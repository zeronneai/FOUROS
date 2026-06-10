import { useInView } from '@/hooks/useInView'
import { useI18n } from '@/lib/i18n'

interface Segment {
  t: string
  gold?: boolean
}

/**
 * Editorial manifesto with dramatic hierarchy: a small eyebrow, an isolated
 * hero-scale serif lead (line-by-line mask reveal), then the body as a separate
 * right-offset block behind a 1px gold rule, with two champagne-italic accents.
 */
export function Manifesto() {
  const { lang } = useI18n()
  const { ref, inView } = useInView<HTMLDivElement>('0px 0px -15% 0px')

  const copy =
    lang === 'es'
      ? {
          eyebrow: 'El manifiesto',
          leadLines: ['No vendemos', 'relojes.'],
          body: [
            { t: 'Custodiamos legados.', gold: true },
            {
              t: ' Cada pieza llega a Four O’s seleccionada a mano, desarmada hasta su último componente y verificada hasta el último detalle. Rolex, Cartier, Patek. Comprar, vender o intercambiar, ',
            },
            { t: 'siempre en privado.', gold: true },
          ] as Segment[],
          sign: 'Four O’s Timepieces',
        }
      : {
          eyebrow: 'The manifesto',
          leadLines: ['We do not', 'sell watches.'],
          body: [
            { t: 'We steward legacies.', gold: true },
            {
              t: ' Every piece reaches Four O’s hand-selected, taken apart to its last component and verified to the last detail. Rolex, Cartier, Patek. Buy, sell or trade, ',
            },
            { t: 'always in private.', gold: true },
          ] as Segment[],
          sign: 'Four O’s Timepieces',
        }

  return (
    <section id="manifiesto" className="scroll-mt-24 border-t border-hairline">
      <div ref={ref} className="container-editorial py-24 lg:py-[120px]">
        {/* 1. Eyebrow */}
        <span className="font-body text-[11px] uppercase tracking-[0.3em] text-muted">
          {copy.eyebrow}
        </span>

        {/* 2. Isolated hero-scale lead, masked line-by-line reveal */}
        <h2 className="mt-7 max-w-[14ch] font-display text-[clamp(3.5rem,9vw,6rem)] font-semibold leading-[1.02] tracking-tightest text-bone">
          {copy.leadLines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.04em]">
              <span
                className="block pb-[0.16em] will-change-transform transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transitionDelay: `${i * 130}ms`,
                  transform: inView ? 'translateY(0)' : 'translateY(110%)',
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </h2>

        {/* 3. Body: separate right-offset block behind a 1px gold rule */}
        <div className="mt-16 grid lg:mt-24 lg:grid-cols-12">
          <div
            className="border-l border-gold/25 pl-6 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:col-span-7 lg:col-start-5 lg:pl-10"
            style={{
              transitionDelay: '560ms',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(12px)',
            }}
          >
            <p className="max-w-[640px] text-pretty font-body text-[1.125rem] leading-[1.7] text-muted lg:text-[1.25rem]">
              {copy.body.map((seg, i) =>
                seg.gold ? (
                  <span key={i} className="italic text-gold-gradient">
                    {seg.t}
                  </span>
                ) : (
                  <span key={i}>{seg.t}</span>
                ),
              )}
            </p>
          </div>
        </div>

        {/* 7. Signature */}
        <p className="mt-16 font-body text-[11px] uppercase tracking-[0.3em] text-muted lg:mt-24">
          {copy.sign}
        </p>
      </div>
    </section>
  )
}
