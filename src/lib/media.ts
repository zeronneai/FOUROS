// Hero footage (the watch disassembling / reassembling). Served from Cloudinary
// — it loads in the visitor's browser, so the build sandbox never needs it.
// Swap this constant to change the clip; `q_auto` lets Cloudinary optimize.
const CLOUD_BASE = 'https://res.cloudinary.com/dsprn0ew4/video/upload'
const CLIP = 'v1781101907/WhatsApp_Video_2026-06-10_at_8.31.31_AM_jydqkt'

/**
 * The watch clip. Uses the original delivery URL (guaranteed to play).
 * For lighter payload / smoother scrubbing you can switch to the optimized
 * variant: `${CLOUD_BASE}/q_auto/${CLIP}.mp4`.
 */
export const HERO_VIDEO_SRC = `${CLOUD_BASE}/${CLIP}.mp4`

/** First-frame poster for instant paint / LCP and reduced-motion fallback. */
export const HERO_VIDEO_POSTER = `${CLOUD_BASE}/so_0,q_auto,f_jpg/${CLIP}.jpg`
