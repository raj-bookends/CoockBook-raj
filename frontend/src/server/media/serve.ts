import "server-only";
import { db } from "@/server/db";
import { getCurrentAdmin } from "@/server/auth/session";
import { localRead } from "@/server/media/localfs";
import { readStoredFile } from "@/server/media/storage";
import { asVariants } from "@/lib/media";

const SAFE_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const EXT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

const PUBLISHED = { status: "PUBLISHED", deletedAt: null } as const;

/**
 * An image is public ONLY while it is part of published content (a published recipe's
 * hero/gallery/step photo, a brand's logo/mark/social image, a category cover).
 * Everything else — drafts, trashed recipes, the unattached admin library — needs an
 * admin session. Unknown/guessed ids get the same 404 as forbidden ones.
 */
async function isPublicMedia(mediaId: string): Promise<boolean> {
  const hit = await db.media.findFirst({
    where: {
      id: mediaId,
      status: "READY",
      deletedAt: null,
      OR: [
        { recipeHeroFor: { some: PUBLISHED } },
        { recipeGalleryOf: { some: { recipe: PUBLISHED } } },
        { recipeStepOf: { some: { recipe: PUBLISHED } } },
        { brandsAsLogo: { some: {} } },
        { brandsAsMark: { some: {} } },
        { brandsAsOgImage: { some: {} } },
        { categoryOf: { some: {} } },
      ],
    },
    select: { id: true },
  });
  return !!hit;
}

// Per-instance caches, so a warm function answers repeat requests (CDN misses in
// another region, after a deploy) without the access query, storage fetch and decrypt.
// Only PUBLIC results are kept; a recipe unpublished later stops being served from
// here once its entry expires.
const PUBLIC_TTL_MS = 5 * 60_000;
const FILE_CACHE_MAX_BYTES = 64 * 1024 * 1024;
const publicUntil = new Map<string, number>();
const fileCache = new Map<string, { data: Buffer; contentType: string; until: number }>();
let fileCacheBytes = 0;

async function isPublicMediaCached(mediaId: string): Promise<boolean> {
  const until = publicUntil.get(mediaId);
  if (until && until > Date.now()) return true;
  const ok = await isPublicMedia(mediaId);
  if (ok) publicUntil.set(mediaId, Date.now() + PUBLIC_TTL_MS);
  else publicUntil.delete(mediaId);
  return ok;
}

function cachedFile(key: string): { data: Buffer; contentType: string } | null {
  const hit = fileCache.get(key);
  if (!hit) return null;
  if (hit.until <= Date.now()) {
    fileCache.delete(key);
    fileCacheBytes -= hit.data.byteLength;
    return null;
  }
  // Re-insert so the Map's order stays least-recently-used first.
  fileCache.delete(key);
  fileCache.set(key, hit);
  return hit;
}

function cacheFile(key: string, file: { data: Buffer; contentType: string }) {
  if (file.data.byteLength > FILE_CACHE_MAX_BYTES / 8 || fileCache.has(key)) return;
  fileCache.set(key, { ...file, until: Date.now() + PUBLIC_TTL_MS });
  fileCacheBytes += file.data.byteLength;
  for (const [k, v] of fileCache) {
    if (fileCacheBytes <= FILE_CACHE_MAX_BYTES) break;
    fileCache.delete(k);
    fileCacheBytes -= v.data.byteLength;
  }
}

const notFound = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });

export async function serveMedia(segments: string[]): Promise<Response> {
  if (segments.length < 1 || segments.length > 2 || !segments.every((s) => SAFE_SEGMENT.test(s) && !s.includes(".."))) {
    return notFound();
  }
  const mediaId = segments[0];
  const key = `media/${segments.join("/")}`;

  const warm = cachedFile(key);
  if (warm && (await isPublicMediaCached(mediaId))) return fileResponse(warm, true);

  // The file is fetched from storage WHILE the access check runs (they are
  // independent round trips), but it is only returned once the check passes.
  const filePromise = (async () => {
    if (segments.length === 2) return readStoredFile(`media/${segments.join("/")}`);
    // Bare "/media/<id>" → the largest WebP variant.
    const media = await db.media.findFirst({ where: { id: mediaId, deletedAt: null }, select: { variants: true } });
    const best = asVariants(media?.variants).filter((v) => v.format === "webp").sort((a, b) => b.w - a.w)[0];
    return best ? readStoredFile(best.key) : null;
  })();
  filePromise.catch(() => {}); // handled below; avoids an unhandled rejection when access is denied

  const isPublic = await isPublicMediaCached(mediaId);
  if (!isPublic) {
    // Not part of published content: only a signed-in admin may see it (drafts, library previews).
    const admin = await getCurrentAdmin().catch(() => null);
    if (!admin) return notFound();
  }

  let file: { data: Buffer; contentType: string } | null = null;
  try {
    file = await filePromise;
  } catch (err) {
    console.error("media decrypt/read failed", err instanceof Error ? err.message : err);
    return new Response("Media unavailable", { status: 500, headers: { "Cache-Control": "no-store" } });
  }

  // Dev only: files written by the `local` driver before the DB store existed.
  if (!file && process.env.STORAGE_DRIVER === "local") {
    const data = await localRead(key);
    if (data) file = { data, contentType: EXT_TYPES[key.slice(key.lastIndexOf(".")).toLowerCase()] ?? "application/octet-stream" };
  }
  if (!file) return notFound();
  if (isPublic) cacheFile(key, file);
  return fileResponse(file, isPublic);
}

function fileResponse(file: { data: Buffer; contentType: string }, isPublic: boolean): Response {
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.data.byteLength),
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
      // Public images may be CDN-cached; draft/library images are private and never cached.
      // A key never changes content (new uploads get a new media id), so public copies
      // can stay cached for long: 7 days in the browser, 30 days on Vercel's CDN.
      "Cache-Control": isPublic ? "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400" : "private, no-store",
    },
  });
}
