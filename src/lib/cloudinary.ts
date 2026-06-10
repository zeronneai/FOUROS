/**
 * Cloudinary on-the-fly image transforms for the gallery. Inserts a transform
 * segment after `/upload/` so the original URLs stay swappable.
 *
 * The inventory photos are shot 4:5; we lock that ratio (`c_fill,ar_4:5`) to
 * prevent layout shift and let `f_auto,q_auto` pick the lightest crisp format.
 */
function transform(url: string, width: number): string {
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_fill,ar_4:5,w_${width}/`)
}

/** A `src` at a sensible default width. */
export function cldImage(url: string, width = 760): string {
  return transform(url, width)
}

/** A width-descriptor srcset across the sizes a gallery slot can render at. */
export function cldSrcSet(url: string): string {
  return [520, 760, 1040, 1520].map((w) => `${transform(url, w)} ${w}w`).join(', ')
}

/** Matches the gallery grid: ~3-up desktop, 2-up tablet, near-full on phones. */
export const GALLERY_SIZES = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 88vw'
