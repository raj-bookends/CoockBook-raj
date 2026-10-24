import type { CSSProperties, ReactNode } from "react";
import { sopPaletteOf } from "@/lib/sop/palette";
import { FitToWidth } from "./FitToWidth";
import type { TimeText } from "@/lib/sop/timeText";
import type { DessertExtras } from "@/lib/sop/dessert";
import type { DimsumExtras } from "@/lib/sop/aiko-dimsum";
import type { DrinkExtras } from "@/lib/sop/aiko-drinks";
import type { AikoOpts } from "@/lib/sop/aiko";

/**
 * The Recipe/SOP document body. Rendered by the public recipe page and by the
 * admin editor's live preview, so the preview can never drift from production.
 *
 * With `editable`, every piece of content carries a `data-field` attribute
 * naming the editor field it comes from (form paths like "ingredients.3").
 */
export interface SopViewData {
  title: string;
  subtitle?: string | null;
  description: string | null;
  summary: string | null;
  categoryName: string | null;
  /** Picks the Desserts / Drinks card design (see lib/sop/dessert.ts). */
  categorySlug?: string | null;
  dessert?: DessertExtras | null;
  /** Aiko Dim Sum card extras (see lib/sop/aiko-dimsum.ts). */
  dimsum?: DimsumExtras | null;
  /** Aiko Drinks card extras (see lib/sop/aiko-drinks.ts). */
  drink?: DrinkExtras | null;
  /** Per-recipe tweaks of the standard Aiko card (see lib/sop/aiko.ts). */
  aiko?: AikoOpts | null;
  station: string | null;
  brandName: string;
  dishCode: string | null;
  versionLabel: string; // "2.1" — already resolved from sopVersion / version
  author: string | null;
  approvedBy: string | null;
  effectiveDate: Date | null;
  nextReviewDate: Date | null;
  yieldText: string | null;
  prepMinutes: number | null;
  cookMinutes: number | null;
  totalMinutes: number | null;
  /** Exact wording for the time stats (ranges); falls back to the minute columns. */
  timeText?: TimeText | null;
  diet: string | null;
  miseEnPlace: string[];
  equipment: string[];
  qualityCheck: string[];
  /** Garnish list, shown under the method. */
  garnish?: string[];
  ingredients: { name: string; quantity: number | null; unit: string | null; groupLabel?: string | null }[];
  /** A step with a title starts a new method section (numbering restarts). */
  steps: { title: string | null; body: string }[];
  plating: string | null;
  holding: string | null;
  allergens: string | null;
  notes?: string | null;
  dishType?: string | null;
  service?: string | null;
  sopSections?: string | null;
}

export function sopVersionLabel(sopVersion: string | null | undefined, version: number | null | undefined): string {
  const v = sopVersion?.trim().replace(/^v/i, "");
  return v || `${version ?? 1}.0`;
}

const ScaleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className || "w-6 h-6"}>
    <path d="M12 3v18M12 3l-8 5v2a8 8 0 0 0 16 0V8l-8-5z" />
    <path d="M12 11h.01" />
  </svg>
);
const KnifeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className || "w-6 h-6"}>
    <path d="M11.63 12.87L2 22.5" />
    <path d="M22.5 2L11.13 13.37A2.83 2.83 0 0 1 7.13 9.37L18.5 2h4v4z" />
  </svg>
);
const PotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className || "w-6 h-6"}>
    <path d="M5 8h14M3 8c0 5 3 11 9 11s9-6 9-11M8 3v3M16 3v3M12 2v4" />
  </svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className || "w-6 h-6"}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const LeafIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className || "w-6 h-6"}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);
const BowlIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className || "w-6 h-6"}>
    <path d="M2 12h20M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8" />
    <path d="M12 6v2M8 5v3M16 5v3" />
  </svg>
);
const CoverIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className || "w-6 h-6"}>
    <path d="M2 16h20M12 4a8 8 0 0 0-8 8h16a8 8 0 0 0-8-8zM12 4V2" />
  </svg>
);
const WheatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className || "w-6 h-6"}>
    <path d="M2 22l10-10M12 12c-2.76 0-5-2.24-5-5s2.24-5 5-5M12 12c0 2.76 2.24 5 5 5s5-2.24 5-5" />
    <path d="M7 7c2.76 0 5-2.24 5-5" />
    <path d="M17 17c0-2.76-2.24-5-5-5" />
  </svg>
);
const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className || "w-6 h-6"}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);
const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-4 h-4"}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const formatSopDate = (d: Date | null | undefined) =>
  d && !Number.isNaN(d.getTime()) ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(d) : "N/A";

/** A4 width in CSS px — the card is always laid out at this width, then zoomed to fit the screen. */
const CARD_WIDTH = 794;

export function RecipeSopView({
  data,
  hero,
  topSlot,
  headerAction,
  editable = false,
}: {
  data: SopViewData;
  hero: ReactNode;
  topSlot?: ReactNode;
  headerAction?: ReactNode;
  editable?: boolean;
}) {
  const f = (field: string) => (editable ? { "data-field": field } : {});
  // In the editor, empty optional fields still get a faint, clickable stand-in.
  const ghost = "opacity-40 italic";
  const docId = `${data.dishCode || "N/A"}-v${data.versionLabel}`;
  // Mise en place / equipment are skipped only when the SOP has neither (the column then holds the notes).
  const hasPrep = data.miseEnPlace.length > 0 || data.equipment.length > 0 || !data.notes || editable;
  // A step with a title starts a new method section; numbering restarts.
  const stepNumbers = data.steps.reduce<number[]>((nums, s, i) => [...nums, s.title || i === 0 ? 1 : nums[i - 1] + 1], []);
  const yieldText = data.yieldText ? (data.yieldText.includes("\n") ? data.yieldText : data.yieldText.replace(" ", "\n")) : "N/A";

  // Same measurements as the A4 SOP card in lib/recipe-print.ts.
  const h3 = "text-[10.5px] font-bold uppercase tracking-[.14em] text-(--sop-ink) border-b border-[#D4B572] pb-1 mb-1.75";
  const metaRow = "grid grid-cols-[42%_1fr] py-[3.5px] border-b border-[#E6E1DA]";
  const metaLabel = "font-bold uppercase text-(--sop-ink)";
  const stat = "col-span-2 flex flex-col items-center gap-0.5 px-1";
  const statIcon = "h-5.5 w-5.5";
  const statLabel = "mt-0.5 text-[9.5px] font-bold uppercase tracking-[.14em]";
  const statValue = "text-[11px] leading-[1.3] text-gray-600 whitespace-pre-line";
  const gbRow = "flex gap-3 py-1.75";
  const gbIcon = "mt-0.5 h-6 w-6 shrink-0 text-(--sop-on-ink)";
  const gbTitle = "mb-0.75 text-[10.5px] font-bold uppercase tracking-[.14em] text-(--sop-on-ink)";
  const gbText = "text-[11.5px] leading-normal whitespace-pre-line";
  const bullets = "list-disc pl-3.75 text-[11.5px] leading-[1.55]";
  const bodyCol = "min-w-0 border-l border-[#E6D6B0] pl-4.75";

  return (
    <div className="mx-auto w-full max-w-250 px-3 py-4 sm:px-6 sm:py-8 print:max-w-none print:p-0 print:flex-1">
      {(topSlot || headerAction) && (
        <div className="mx-auto mb-3 flex max-w-198.5 flex-wrap items-center justify-between gap-3 print:hidden">
          <div>{topSlot}</div>
          {headerAction}
        </div>
      )}

      <FitToWidth width={CARD_WIDTH}>
        <div style={sopPaletteOf(data.brandName) as CSSProperties} className="flex min-h-280.75 flex-col gap-4.25 bg-[#FAF8F5] px-9.5 pb-7.5 pt-8.5 text-[#2C3E35] shadow-[0_6px_24px_rgba(0,0,0,.12)] print:shadow-none">
          {/* Top: intro + photo / green box */}
          <div className="grid grid-cols-[40%_1fr] gap-5.75">
            <div className="min-w-0">
              <div className="border-b border-[#D4B572] pb-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-[#C9A45C]">
                <span {...f("categoryId")}>{data.categoryName || "Recipe"}</span>
                {(data.station || editable) && (
                  <>
                    {"  |  "}
                    <span {...f("station")} className={data.station ? undefined : ghost}>{data.station || "Station"}</span>
                  </>
                )}
              </div>
              <h1 {...f("title")} className="mb-2 mt-2.5 wrap-break-word font-(family-name:--sop-title-font) text-[34px] font-(--sop-title-weight,700) tracking-(--sop-title-spacing) [-webkit-text-stroke:var(--sop-title-stroke,0)] leading-[1.05] text-(--sop-ink)">
                {data.title || "Untitled recipe"}
              </h1>
              {(data.description || editable) && (
                <p {...f("description")} className={`whitespace-pre-wrap text-[12px] leading-normal text-[#2C3E35]/85 ${data.description ? "" : ghost}`}>
                  {data.description || "Add a description…"}
                </p>
              )}

              <div className="mt-2.5 border-t border-[#D4B572] text-[11px]">
                <div {...f("dishCode")} className={metaRow}><span className={metaLabel}>Dish code:</span><span>{data.dishCode || "N/A"}</span></div>
                <div {...f("sopVersion")} className={metaRow}><span className={metaLabel}>Version:</span><span>v{data.versionLabel}</span></div>
                <div {...f("author")} className={metaRow}><span className={metaLabel}>Author:</span><span>{data.author || data.brandName}</span></div>
                <div {...f("approvedBy")} className={metaRow}><span className={metaLabel}>Approved by:</span><span>{data.approvedBy || "N/A"}</span></div>
                <div {...f("effectiveDate")} className={metaRow}><span className={metaLabel}>Effective:</span><span>{formatSopDate(data.effectiveDate)}</span></div>
                <div {...f("nextReviewDate")} className={`${metaRow} border-[#D4B572]!`}><span className={metaLabel}>Next review:</span><span>{formatSopDate(data.nextReviewDate)}</span></div>
              </div>

              <div className="grid grid-cols-6 gap-y-2 border-b border-[#D4B572] py-2.5 text-center text-(--sop-ink)">
                {data.dessert?.stats ? (
                  data.dessert.stats.map((s, i, all) => {
                    const Icon = { tag: KnifeIcon, pot: PotIcon, user: ScaleIcon, leaf: LeafIcon, snow: ClockIcon, clock: ClockIcon, cup: ScaleIcon, ice: ScaleIcon }[s.icon];
                    // Rows of three; a short last row is centred.
                    const rem = all.length % 3;
                    const colStart = rem && i === all.length - rem ? (rem === 1 ? "col-start-3" : "col-start-2") : "";
                    return (
                      <div key={i} className={`${stat} ${colStart} ${i % 3 === 0 || colStart ? "" : "border-l border-[#E6E1DA]"}`}>
                        <Icon className={statIcon} />
                        <b className={statLabel}>{s.label}</b>
                        <span className={statValue}>{s.value}</span>
                      </div>
                    );
                  })
                ) : (
                <>
                <div {...f("yieldText")} className={stat}>
                  <ScaleIcon className={statIcon} />
                  <b className={statLabel}>Yield</b>
                  <span className={statValue}>{yieldText}</span>
                </div>
                <div {...f("prepMinutes")} className={`${stat} border-l border-[#E6E1DA]`}>
                  <KnifeIcon className={statIcon} />
                  <b className={statLabel}>Prep</b>
                  <span className={statValue}>{data.timeText?.prep ?? `${data.prepMinutes || 0} min`}</span>
                </div>
                <div {...f("cookMinutes")} className={`${stat} border-l border-[#E6E1DA]`}>
                  <PotIcon className={statIcon} />
                  <b className={statLabel}>Cook</b>
                  <span className={statValue}>{data.timeText?.cook ?? `${data.cookMinutes || 0} min`}</span>
                </div>
                <div {...f("totalMinutes")} className={`${stat} col-start-2`}>
                  <ClockIcon className={statIcon} />
                  <b className={statLabel}>Total</b>
                  <span className={statValue}>{data.timeText?.total ?? `~${data.totalMinutes || 0} min`}</span>
                </div>
                <div {...f("dietary")} className={`${stat} border-l border-[#E6E1DA]`}>
                  <LeafIcon className={statIcon} />
                  <b className={statLabel}>Diet</b>
                  <span className={statValue}>{data.diet || "N/A"}</span>
                </div>
                </>
                )}
              </div>

              {(data.summary || editable) && (
                <p {...f("summary")} className={`mt-2.25 font-(family-name:--font-playfair) text-[12.5px] italic leading-normal text-(--sop-ink) ${data.summary ? "" : "opacity-40"}`}>
                  {data.summary ? <>&ldquo;{data.summary}&rdquo;</> : "Add a summary…"}
                </p>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-3.25">
              <div {...f("heroImageId")} className="relative h-73.75 w-full overflow-hidden rounded-[14px] bg-[#1a1a1a]">
                {hero}
              </div>

              <div className="flex flex-col rounded-[14px] bg-(--sop-ink) px-5.75 py-4.75 text-white print:bg-(--sop-ink)!">
                <div {...f("plating")} className={gbRow}>
                  <BowlIcon className={gbIcon} />
                  <div>
                    <h4 className={gbTitle}>Plating &amp; Service</h4>
                    <p className={gbText}>{data.plating || "N/A"}</p>
                  </div>
                </div>
                <div {...f("holding")} className={`${gbRow} border-t border-[color-mix(in_srgb,var(--sop-on-ink)_35%,transparent)]`}>
                  <CoverIcon className={gbIcon} />
                  <div>
                    <h4 className={gbTitle}>Holding &amp; Shelf Life</h4>
                    <p className={gbText}>{data.holding || "N/A"}</p>
                  </div>
                </div>
                <div {...f("allergens")} className={`${gbRow} border-t border-[color-mix(in_srgb,var(--sop-on-ink)_35%,transparent)]`}>
                  <WheatIcon className={gbIcon} />
                  <div>
                    <h4 className={gbTitle}>Allergens</h4>
                    <p className={gbText}>{data.allergens || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Body: prep lists / notes | ingredients | method */}
          <div className="grid grid-cols-[27%_1fr_1.15fr] gap-5.75">
            <div className="min-w-0">
              {hasPrep && (
                <>
                  <h3 {...f("miseEnPlace")} className={h3}>Mise En Place</h3>
                  <ul className={bullets}>
                    {data.miseEnPlace.length > 0
                      ? data.miseEnPlace.map((m, i) =>
                          m.startsWith("# ")
                            ? <li key={i} {...f(`miseEnPlace.${i}`)} className="list-none! -ml-3.75! mt-1 font-bold uppercase text-(--sop-ink)">{m.slice(2)}</li>
                            : <li key={i} {...f(`miseEnPlace.${i}`)}>{m}</li>,
                        )
                      : <li {...f("miseEnPlace")}>None</li>}
                  </ul>
                  <h3 {...f("equipment")} className={`${h3} mt-3`}>Equipment / Tools</h3>
                  <ul className={bullets}>
                    {data.equipment.length > 0
                      ? data.equipment.map((e, i) => <li key={i} {...f(`equipment.${i}`)}>{e}</li>)
                      : <li {...f("equipment")}>None</li>}
                  </ul>
                </>
              )}
              {data.notes && (
                <>
                  <h3 className={`${h3} ${hasPrep ? "mt-3" : ""}`}>Notes</h3>
                  <p className="whitespace-pre-line text-[11px] leading-normal">{data.notes}</p>
                </>
              )}
            </div>

            <div className={bodyCol}>
              <h3 {...f("ingredients")} className={h3}>Ingredients (NET)</h3>
              <div className="text-[11px] leading-[1.35]">
                {data.ingredients.map((ing, i) => (
                  <div key={i}>
                    {ing.groupLabel && ing.groupLabel !== data.ingredients[i - 1]?.groupLabel && (
                      <p className="mb-0.5 mt-1.75 font-bold text-(--sop-ink)">{ing.groupLabel}</p>
                    )}
                    <div {...f(`ingredients.${i}`)} className="flex items-baseline gap-1 py-[1.5px]">
                      <span className="min-w-0">{ing.name}</span>
                      <i className="min-w-2 flex-1 -translate-y-0.75 border-b-[1.5px] border-dotted border-[#BDBDBD]" />
                      <span className="whitespace-nowrap text-right">{ing.quantity ? Number(ing.quantity) : ""} {ing.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={bodyCol}>
              <h3 {...f("steps")} className={h3}>Method</h3>
              <ol className="text-[11.5px] leading-[1.45]">
                {data.steps.map(({ title, body }, idx) => {
                  const n = stepNumbers[idx];
                  return (
                    <li key={idx} {...f(`steps.${idx}`)} className="mb-1.5 list-none">
                      {title && <p className="mb-1 mt-2 text-[10.5px] font-bold uppercase tracking-[.08em] text-(--sop-ink) first:mt-0">{title}</p>}
                      <div className="flex items-start gap-2">
                        <span className="mt-px inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-(--sop-ink) text-[10px] font-bold text-white print:bg-(--sop-ink)!">{n}</span>
                        <span>{body}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {data.garnish && data.garnish.length > 0 && (
                <>
                  <h3 className={`${h3} mt-3`}>Garnish</h3>
                  <ul className={bullets}>
                    {data.garnish.map((g, i) => <li key={i}>{g}</li>)}
                  </ul>
                </>
              )}

              {(data.qualityCheck.length > 0 || editable) && (
                <>
                  <h3 {...f("qualityCheck")} className={`${h3} mt-3`}>Quality Check</h3>
                  <ul className="text-[11px] leading-normal">
                    {data.qualityCheck.length > 0
                      ? data.qualityCheck.map((q, i) => (
                          <li key={i} {...f(`qualityCheck.${i}`)} className="flex items-start gap-1.5">
                            <CheckIcon className="mt-0.5 h-3 w-3 shrink-0 text-[#C9A45C]" />
                            <span>{q}</span>
                          </li>
                        ))
                      : <li {...f("qualityCheck")} className="text-[#2C3E35]/50">None</li>}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3.5 gap-y-1 rounded-[10px] bg-(--sop-ink) px-4.75 py-2.75 text-[10px] font-medium text-white print:bg-(--sop-ink)!">
            <div {...f("dishCode")} className="inline-flex items-center gap-1.5">
              <ClipboardIcon className="h-4 w-4 text-(--sop-on-ink)" />
              <span>Document ID: {docId}</span>
            </div>
            <span {...f("effectiveDate")}>Effective: {formatSopDate(data.effectiveDate)}</span>
            <span {...f("nextReviewDate")}>Next review: {formatSopDate(data.nextReviewDate)}</span>
            <span>Page 1 of 1</span>
            <div {...f("brandId")} className="font-(family-name:--font-playfair) text-[13px] font-bold text-(--sop-on-ink)">{data.brandName} Hospitality</div>
          </div>
        </div>
      </FitToWidth>
    </div>
  );
}
