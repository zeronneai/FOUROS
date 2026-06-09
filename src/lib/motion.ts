import type { Variants } from 'framer-motion'

// Soft, editorial easing — deliberate, never bouncy.
export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const

// Fade + translate Y reveal. Used as the default section entrance.
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE_EDITORIAL },
  },
}

// Clip-path wipe reveal for headline / image masks.
export const clipReveal: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
  show: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 1.2, ease: EASE_EDITORIAL },
  },
}

// Stagger container for lists / grids.
export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

// Per-line headline reveal (used with a masked wrapper).
export const lineReveal: Variants = {
  hidden: { y: '110%' },
  show: {
    y: '0%',
    transition: { duration: 1.1, ease: EASE_EDITORIAL },
  },
}
