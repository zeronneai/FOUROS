// Hero media. The master clip lives in assets/hero-master.mov (logo → watch →
// exploded view, push-in already baked in). The hero scrubs a pre-extracted
// frame sequence on a <canvas>; the MP4 below is only a safety net.

/** Frames extracted from the master (ffmpeg, webp q75). Two sizes:
 *  /sequence (1600px, desktop) and /sequence/sm (720px, mobile). */
export const SEQUENCE_FRAME_COUNT = 115
export const SEQUENCE_DIR = '/sequence'
export const SEQUENCE_DIR_SM = '/sequence/sm'

/** Frames are 1-indexed on disk: frame-001.webp … frame-115.webp. */
export function sequenceFrameSrc(dir: string, index: number): string {
  return `${dir}/frame-${String(index + 1).padStart(3, '0')}.webp`
}

/** Poster (frame 1, the logo) for the <video> fallback and social embeds. */
export const HERO_POSTER = '/hero-poster.jpg'

/**
 * Lightweight 1080p encode of the master, shown only if the frame sequence
 * fails to load. Served from /public for now — after uploading
 * public/hero-fallback.mp4 to Cloudinary, point this at the Cloudinary URL.
 */
export const HERO_FALLBACK_VIDEO_SRC = '/hero-fallback.mp4'
