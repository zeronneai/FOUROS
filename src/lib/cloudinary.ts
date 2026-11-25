/**
 * Gallery image helpers. The inventory photos live in public/inventory as
 * pre-rendered 4:5 WebP files at fixed widths (`<base>-<width>.webp`), so the
 * gallery does not depend on an external image CDN.
 */
const WIDTHS = [520, 760, 1040, 1520] as const

function variant(base: string, width: number): string {
  return `${base}-${width}.webp`
}

/** A `src` at a sensible default width. */
export function cldImage(base: string, width: (typeof WIDTHS)[number] = 760): string {
  return variant(base, width)
}

/** A width-descriptor srcset across the sizes a gallery slot can render at. */
export function cldSrcSet(base: string): string {
  return WIDTHS.map((w) => `${variant(base, w)} ${w}w`).join(', ')
}

/** Matches the gallery grid: ~3-up desktop, 2-up tablet, near-full on phones. */
export const GALLERY_SIZES = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 88vw'
