/**
 * Colours of the classic SOP card (standard + Desserts/Drinks), as CSS
 * variables set on the card root. Capiche's green design is the default;
 * Beshak swaps the green for its brand orange. Used by the web cards
 * (RecipeSopView, DessertSopView) and the print/PDF builder alike.
 */
export interface SopPalette {
  /** Standard card: title, headings, info box, step numbers, footer. */
  "--sop-ink": string;
  /** Gradient end of the category PDF cover. */
  "--sop-ink-2": string;
  /** Standard card: icons and titles inside the info box and footer. */
  "--sop-on-ink": string;
  /** Desserts/Drinks card: title first word, headings, meta box, side panel. */
  "--dz-ink": string;
  /** Desserts/Drinks card: title rest, rules, bullets, step numbers. */
  "--dz-acc": string;
  /** Desserts/Drinks card: highlight text on the dark meta box / panel. */
  "--dz-acc-soft": string;
  /** Desserts/Drinks card: rules, icons and headings on the dark side panel. */
  "--dz-on-ink": string;
  /** Recipe title font (single quotes only: the print builder puts this in a style attribute). */
  "--sop-title-font": string;
  /** Recipe title weight; unset keeps each card's own weight. */
  "--sop-title-weight"?: string;
  "--sop-title-spacing": string;
  /** Faux-bold outline for single-weight title fonts. */
  "--sop-title-stroke"?: string;
}

const CLASSIC: SopPalette = {
  "--sop-ink": "#1F3D2D",
  "--sop-ink-2": "#2a5a3d",
  "--sop-on-ink": "#D4B572",
  "--dz-ink": "#173B2B",
  "--dz-acc": "#D95F1E",
  "--dz-acc-soft": "#E8A35E",
  "--dz-on-ink": "#D95F1E",
  "--sop-title-font": "var(--font-playfair, 'Playfair Display'), Georgia, serif",
  "--sop-title-spacing": "normal",
};

const BESHAK: SopPalette = {
  "--sop-ink": "#D4452F",
  "--sop-ink-2": "#E8664C",
  "--sop-on-ink": "#FFE3B8",
  "--dz-ink": "#D4452F",
  "--dz-acc": "#9E2D1B",
  "--dz-acc-soft": "#FFD4CC",
  "--dz-on-ink": "#FFD4CC",
  // Closest web font to the Beshak logo lettering (flared, wide capitals).
  "--sop-title-font": "var(--font-marcellus-sc, 'Marcellus SC'), Georgia, serif",
  "--sop-title-weight": "400",
  "--sop-title-spacing": ".04em",
  "--sop-title-stroke": ".6px",
};

export function sopPaletteOf(brandName: string | null | undefined): SopPalette {
  return /beshak/i.test(brandName ?? "") ? BESHAK : CLASSIC;
}

/** The palette as an inline `style` attribute value for the print HTML. */
export function sopPaletteStyle(brandName: string | null | undefined): string {
  return Object.entries(sopPaletteOf(brandName))
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}
