import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { STATS, type Stat } from '@/data/inventory'
import { useInView } from '@/hooks/useInView'

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const { lang } = useI18n()
  const { ref, inView } = useInView<HTMLDivElement>()
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVal(stat.value)
      return
    }
    let raf = 0
    const duration = 1300
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setVal(Math.round(easeOutExpo(p) * stat.value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, stat.value])

  return (
    <div
      ref={ref}
      className="flex flex-col gap-2 border-t border-hairline pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <span className="font-display text-4xl font-[650] tracking-tightest text-bone sm:text-5xl">
        {val}
        {stat.suffix}
      </span>
      <span className="eyebrow">{stat.label[lang]}</span>
    </div>
  )
}

export function Stats() {
  return (
    <section className="border-t border-hairline bg-charcoal/30">
      <div className="container-editorial py-16 lg:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label.en} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
