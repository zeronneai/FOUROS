import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/useInView'

/** Small uppercase eyebrow label over a section title. */
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
    <span className={cn('eyebrow', gold && 'text-gold-gradient', className)}>{children}</span>
  )
}

/** A single 1px editorial hairline rule. */
export function Hairline({ className = '' }: { className?: string }) {
  return <div className={cn('hairline', className)} role="separator" />
}

/** Scroll-triggered reveal (fade + translate Y). CSS-driven, reduced-motion safe. */
export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={cn('reveal', inView && 'reveal-in', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/** The 4O monogram with an animated sunset hairline border (brand signature). */
export function Monogram({ size = 40 }: { size?: number }) {
  return (
    <span
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
      aria-label="Four O's Timepieces"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-sm bg-sunset-line opacity-70 motion-safe:animate-sunset-rotate"
        style={{
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />
      <span className="absolute inset-[1.5px] rounded-sm bg-ink" aria-hidden />
      <span className="relative font-display text-[0.95em] font-bold tracking-tightest text-gold-gradient">
        4O
      </span>
    </span>
  )
}
