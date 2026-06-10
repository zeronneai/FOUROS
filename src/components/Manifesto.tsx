import { useI18n } from '@/lib/i18n'
import { Reveal } from '@/components/primitives'

/**
 * Editorial manifesto: large type, generous negative space. Carries the
 * curation message between the hero and the collection. One focused moment.
 */
export function Manifesto() {
  const { lang } = useI18n()

  const copy =
    lang === 'es'
      ? {
          lead: 'No vendemos relojes.',
          body: 'Custodiamos legados. Cada pieza llega a Four O’s seleccionada a mano, desarmada hasta su último componente y verificada hasta el último detalle. Rolex, Cartier, Patek. Comprar, vender o intercambiar, siempre en privado.',
          sign: 'Four O’s Timepieces',
        }
      : {
          lead: 'We do not sell watches.',
          body: 'We steward legacies. Every piece reaches Four O’s hand-selected, taken apart to its last component and verified to the last detail. Rolex, Cartier, Patek. Buy, sell or trade, always in private.',
          sign: 'Four O’s Timepieces',
        }

  return (
    <section id="manifiesto" className="scroll-mt-24 border-t border-hairline">
      <div className="container-editorial py-24 lg:py-[120px]">
        <Reveal className="max-w-4xl">
          <p className="font-display text-[clamp(2rem,6vw,4.25rem)] font-semibold leading-[1.06] tracking-tightest text-bone">
            {copy.lead}{' '}
            <span className="text-muted">{copy.body}</span>
          </p>
          <p className="mt-10 font-body text-[12px] uppercase tracking-[0.3em] text-gold-gradient">
            {copy.sign}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
