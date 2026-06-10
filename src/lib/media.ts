// Hero media. Two masters in assets/ — hero-master-landscape.mov (16:9, 15.2s)
// and hero-master-portrait.mov (9:16, 13.2s). The hero scrubs a pre-extracted
// frame sequence on a <canvas>, picking the set that matches the viewport
// orientation; the MP4s below are only a safety net.

/** Frames per sequence (1-indexed on disk: frame-001.webp … frame-115.webp). */
export const SEQUENCE_FRAME_COUNT = 115

/**
 * Per-orientation assets. Frames are at the masters' native width (never
 * upscaled): lg 1920px (webp q80), pt 1072px (webp q73 to stay ~6MB).
 * After uploading the fallback MP4s to Cloudinary, point `fallback` there.
 */
export const HERO_MEDIA = {
  landscape: {
    dir: '/sequence/lg',
    poster: '/hero-poster-lg.jpg',
    fallback: '/hero-fallback-lg.mp4',
  },
  portrait: {
    dir: '/sequence/pt',
    poster: '/hero-poster-pt.jpg',
    fallback: '/hero-fallback-pt.mp4',
  },
} as const

export type HeroOrientation = keyof typeof HERO_MEDIA

export function sequenceFrameSrc(dir: string, index: number): string {
  return `${dir}/frame-${String(index + 1).padStart(3, '0')}.webp`
}
