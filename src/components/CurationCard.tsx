import { useEffect, useRef, useState } from 'react'
import { BadgeCheck, ShieldCheck } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

// Skeuomorphic materials for the watch card. Kept identical to the original
// "Curation, redefined" visual — just static instead of scroll-choreographed.
const STYLES = `
  .cc-card {
      background: linear-gradient(155deg, #18181B 0%, #0A0A0B 100%);
      box-shadow:
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          0 20px 40px -20px rgba(0, 0, 0, 0.8),
          inset 0 1px 2px rgba(232, 200, 135, 0.08),
          inset 0 -2px 4px rgba(0, 0, 0, 0.85);
      border: 1px solid rgba(232, 200, 135, 0.10);
  }
  .cc-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(820px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(232,200,135,0.055) 0%, transparent 42%);
      mix-blend-mode: screen;
  }
  .cc-brand {
      background: linear-gradient(180deg, #F5F2EC 0%, #4A4843 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      transform: translateZ(0);
      filter: drop-shadow(0px 12px 24px rgba(0,0,0,0.8)) drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }
  .cc-watch-case {
      background: radial-gradient(circle at 50% 28%, #2C2C30 0%, #161618 55%, #0B0B0D 100%);
      box-shadow:
          inset 0 0 0 2px rgba(232,200,135,0.20),
          inset 0 0 0 12px #121215,
          inset 0 0 24px rgba(0,0,0,0.9),
          0 40px 80px -15px rgba(0,0,0,0.9),
          0 15px 25px -5px rgba(0,0,0,0.7);
      transform-style: preserve-3d;
      transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .cc-dial { background: radial-gradient(circle at 50% 32%, #1B1B20 0%, #0C0C0F 68%, #060607 100%); }
  .cc-crown {
      background: linear-gradient(90deg, #E8C887 0%, #8A6E2E 100%);
      box-shadow: -2px 0 5px rgba(0,0,0,0.8), inset -1px 0 1px rgba(255,255,255,0.25), inset 1px 0 2px rgba(0,0,0,0.8);
  }
  .cc-glare { background: linear-gradient(125deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 46%); }
  .cc-badge {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 0 0 1px rgba(232, 200, 135, 0.12), 0 25px 50px -12px rgba(0, 0, 0, 0.8),
          inset 0 1px 1px rgba(255,255,255,0.16), inset 0 -1px 1px rgba(0,0,0,0.5);
  }
  .cc-ring {
      transform: rotate(-90deg); transform-origin: center;
      stroke-dasharray: 402; stroke-dashoffset: 402; stroke-linecap: round;
      transition: stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .cc-ring.is-in { stroke-dashoffset: 60; }
`

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function CurationCard() {
  const { lang } = useI18n()
  const cardRef = useRef<HTMLDivElement>(null)
  const watchRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  const [inView, setInView] = useState(false)
  const [count, setCount] = useState(0)
  const metricValue = 240

  // Trigger counter + ring when the card scrolls into view.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = cardRef.current
    if (!el) return
    if (reduced) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const copy =
    lang === 'es'
      ? {
          eyebrow: 'Curaduría',
          heading: 'Curaduría, redefinida.',
          body: (
            <>
              <span className="font-semibold text-gold-light">Four O&rsquo;s</span> selecciona
              piezas excepcionales de alta relojería — Rolex, Cartier, Patek —
              verificadas, con procedencia y listas para volverse legado.
            </>
          ),
          metricLabel: 'Piezas colocadas',
          badges: [
            { title: 'Autenticado', sub: 'Verificación completa' },
            { title: 'Full Set', sub: 'Procedencia documentada' },
          ],
        }
      : {
          eyebrow: 'Curation',
          heading: 'Curation, redefined.',
          body: (
            <>
              <span className="font-semibold text-gold-light">Four O&rsquo;s</span> curates
              exceptional luxury timepieces — Rolex, Cartier, Patek — authenticated,
              with provenance, and ready to become legacy.
            </>
          ),
          metricLabel: 'Pieces placed',
          badges: [
            { title: 'Authenticated', sub: 'Verified in full' },
            { title: 'Full Set', sub: 'Provenance documented' },
          ],
        }

  // Count up the sub-dial metric when the card enters view.
  useEffect(() => {
    if (!inView) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setCount(metricValue)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1600)
      setCount(Math.round(easeOutExpo(p) * metricValue))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  // Mouse tilt (watch) + sheen (card) — fine-pointer only, reduced-motion safe.
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduced) return

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const card = cardRef.current
        const watch = watchRef.current
        if (!card || !watch) return
        const rect = card.getBoundingClientRect()
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          watch.style.transform = 'rotateX(0deg) rotateY(0deg)'
          return
        }
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
        const xVal = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const yVal = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        watch.style.transform = `rotateY(${xVal * 10}deg) rotateX(${-yVal * 10}deg)`
      })
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section id="curaduria" className="scroll-mt-20 border-t border-hairline">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="container-editorial py-16 lg:py-[120px]" style={{ perspective: '1500px' }}>
        <div
          ref={cardRef}
          className="cc-card relative flex items-center justify-center overflow-hidden rounded-[24px] px-4 py-12 lg:px-12 lg:py-16"
        >
          <div className="cc-sheen" aria-hidden="true" />

          <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-3 lg:gap-8">
            {/* LEFT (desktop): curation copy */}
            <div className="order-3 text-center lg:order-1 lg:text-left">
              <span className="eyebrow text-gold-gradient">{copy.eyebrow}</span>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-bone md:text-3xl lg:text-4xl">
                {copy.heading}
              </h2>
              <p className="mx-auto mt-4 hidden max-w-sm text-pretty font-body text-sm leading-relaxed text-bone/70 md:block lg:mx-0 lg:text-base">
                {copy.body}
              </p>
            </div>

            {/* CENTER: the watch */}
            <div className="order-2 flex items-center justify-center" style={{ perspective: '1000px' }}>
              <div className="relative flex scale-[0.8] items-center justify-center sm:scale-90 lg:scale-100">
                <div
                  ref={watchRef}
                  className="cc-watch-case transform-style-3d relative flex h-[300px] w-[300px] items-center justify-center rounded-full will-change-transform"
                >
                  <div className="cc-crown absolute -right-[6px] top-[133px] z-0 h-[34px] w-[10px] rounded-r-md" aria-hidden="true" />
                  <div className="cc-crown absolute -right-[5px] top-[104px] z-0 h-[16px] w-[8px] rounded-r-sm opacity-80" aria-hidden="true" />
                  <div className="cc-crown absolute -right-[5px] top-[180px] z-0 h-[16px] w-[8px] rounded-r-sm opacity-80" aria-hidden="true" />

                  <div className="cc-dial absolute inset-[16px] overflow-hidden rounded-full text-white">
                    <div className="cc-glare pointer-events-none absolute inset-0 z-40" aria-hidden="true" />

                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 240 240" aria-hidden="true">
                      <circle cx="120" cy="120" r="110" fill="none" stroke="rgba(232,200,135,0.14)" strokeWidth="1" />
                      {Array.from({ length: 12 }).map((_, i) => {
                        const major = i % 3 === 0
                        return (
                          <line
                            key={i}
                            x1="120"
                            y1={major ? 14 : 18}
                            x2="120"
                            y2={major ? 27 : 24}
                            transform={`rotate(${i * 30} 120 120)`}
                            stroke={major ? '#E8C887' : 'rgba(245,242,236,0.35)'}
                            strokeWidth={major ? 3 : 1.5}
                            strokeLinecap="round"
                          />
                        )
                      })}
                      <circle cx="120" cy="120" r="64" fill="none" stroke="rgba(245,242,236,0.05)" strokeWidth="3" />
                      <circle className={`cc-ring ${inView ? 'is-in' : ''}`} cx="120" cy="120" r="64" fill="none" stroke="#CBA45F" strokeWidth="3" />
                      <circle cx="120" cy="162" r="26" fill="none" stroke="rgba(245,242,236,0.10)" strokeWidth="1" />
                      <g>
                        <line x1="120" y1="120" x2="120" y2="72" transform="rotate(305 120 120)" stroke="#F5F2EC" strokeWidth="4" strokeLinecap="round" />
                        <line x1="120" y1="120" x2="120" y2="56" transform="rotate(60 120 120)" stroke="#F5F2EC" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="120" cy="120" r="4.5" fill="#E8C887" />
                      </g>
                    </svg>

                    <div className="absolute left-1/2 top-[31%] -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-bone/75">
                        FOUR O&rsquo;S
                      </p>
                    </div>

                    <div className="absolute left-1/2 top-[67.5%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                      <span className="font-display text-lg font-bold leading-none tracking-tightest text-bone">{count}</span>
                      <span className="mt-1 text-[5.5px] font-bold uppercase tracking-[0.18em] text-gold-light/70">
                        {copy.metricLabel}
                      </span>
                    </div>

                    <div className="absolute right-[11%] top-1/2 -translate-y-1/2 rounded-[2px] border border-gold/30 bg-ink/70 px-1.5 py-[3px]">
                      <span className="font-body text-[9px] font-semibold tracking-wider text-bone">09</span>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="cc-badge absolute left-[-15px] top-2 z-30 flex items-center gap-3 rounded-xl p-3 lg:left-[-60px] lg:top-6 lg:gap-4 lg:rounded-2xl lg:p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/25 bg-gradient-to-b from-gold-light/15 to-gold-dark/5 shadow-inner lg:h-10 lg:w-10">
                    <ShieldCheck className="h-4 w-4 text-gold-light lg:h-5 lg:w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-tight text-bone lg:text-sm">{copy.badges[0].title}</p>
                    <p className="text-[10px] text-muted lg:text-xs">{copy.badges[0].sub}</p>
                  </div>
                </div>

                <div className="cc-badge absolute bottom-2 right-[-15px] z-30 flex items-center gap-3 rounded-xl p-3 lg:bottom-6 lg:right-[-60px] lg:gap-4 lg:rounded-2xl lg:p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/25 bg-gradient-to-b from-gold-light/15 to-gold-dark/5 shadow-inner lg:h-10 lg:w-10">
                    <BadgeCheck className="h-4 w-4 text-gold-light lg:h-5 lg:w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-tight text-bone lg:text-sm">{copy.badges[1].title}</p>
                    <p className="text-[10px] text-muted lg:text-xs">{copy.badges[1].sub}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT (desktop): brand word */}
            <div className="order-1 flex justify-center lg:order-3 lg:justify-end">
              <h2 className="cc-brand font-display text-6xl font-black uppercase leading-[1.02] tracking-tighter md:text-[6rem] lg:text-[7rem]">
                FOUR O&rsquo;S
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
