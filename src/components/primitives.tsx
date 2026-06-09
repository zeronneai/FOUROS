import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { revealUp } from '../lib/motion'

/** Small uppercase eyebrow label. */
export function Eyebrow({
  children,
  className = '',
  gold = false,
}: {
  children: ReactNode
  className?: string
  gold?: boolean
}) {
  return (
    <span
      className={`eyebrow ${gold ? 'text-gold-gradient' : ''} ${className}`}
    >
      {children}
    </span>
  )
}

/** A single 1px editorial hairline rule. */
export function Hairline({ className = '' }: { className?: string }) {
  return <div className={`hairline ${className}`} role="separator" />
}

/**
 * Scroll-triggered reveal wrapper. Fades + translates its children once when
 * they enter the viewport. Respects reduced motion via Framer's own handling.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'span'
}) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      variants={revealUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ delay }}
    >
      {children}
    </Comp>
  )
}

/** The 4O monogram with an animated sunset hairline border (brand signature). */
export function Monogram({
  size = 40,
  withRing = true,
}: {
  size?: number
  withRing?: boolean
}) {
  return (
    <span
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
      aria-label="Four O's Timepieces"
    >
      {withRing && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-sm bg-sunset-line opacity-70 motion-safe:animate-sunset-rotate"
          style={{
            WebkitMask:
              'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px',
          }}
        />
      )}
      <span className="absolute inset-[1.5px] rounded-sm bg-ink" aria-hidden />
      <span className="relative font-display text-[0.95em] font-bold tracking-tightest text-gold-gradient">
        4O
      </span>
    </span>
  )
}
