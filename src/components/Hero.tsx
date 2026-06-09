import { ArrowDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { whatsappLink } from '@/lib/site'
import { Eyebrow, LineReveal } from '@/components/primitives'

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function Hero() {
  const { lang } = useI18n()

  const copy =
    lang === 'es'
      ? {
          eyebrow: 'Curaduría de relojes de lujo',
          subtitle:
            'Una selección discreta de piezas excepcionales. Buy · Sell · Trade — para coleccionistas que entienden el valor del tiempo bien guardado.',
          collection: 'Ver colección',
          scroll: 'Desliza',
        }
      : {
          eyebrow: 'Curated luxury timepieces',
          subtitle:
            'A discreet selection of exceptional pieces. Buy · Sell · Trade — for collectors who understand the value of time well kept.',
          collection: 'View collection',
          scroll: 'Scroll',
        }

  const whatsappMsg =
    lang === 'es'
      ? 'Hola, me gustaría reservar una pieza.'
      : "Hi, I'd like to reserve a piece."

  return (
    <section
      id="top"
      className="relative flex min-h-[90svh] flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-28 text-center"
    >
      {/* Brand textures */}
      <div className="editorial-grid pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,rgba(232,200,135,0.06),transparent_55%)]"
        aria-hidden="true"
      />
      <div className="film-grain" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <Eyebrow gold className="mb-7 inline-block">
          {copy.eyebrow}
        </Eyebrow>

        <h1 className="font-display text-[clamp(2.5rem,9vw,7rem)] font-bold tracking-tighter text-bone">
          <LineReveal>Turning Time,</LineReveal>
          <LineReveal delay={90} gold className="font-black italic">
            into Legacy.
          </LineReveal>
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-pretty font-body text-[15px] leading-relaxed tracking-tighter text-muted sm:text-base">
          {copy.subtitle}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <a
            href="#galeria"
            className="group inline-flex w-full items-center justify-center gap-3 border border-gold/40 px-7 py-3.5 font-body text-[12px] uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-gold hover:text-gold-light sm:w-auto"
          >
            {copy.collection}
            <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
          </a>
          <a
            href={whatsappLink(whatsappMsg)}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-full items-center justify-center gap-3 border border-hairline px-7 py-3.5 font-body text-[12px] uppercase tracking-[0.2em] text-muted transition-colors duration-300 hover:border-gold/50 hover:text-bone sm:w-auto"
          >
            <WhatsAppGlyph className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#galeria"
        className="group absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-label={copy.scroll}
      >
        <span className="eyebrow text-[10px] transition-colors group-hover:text-bone">{copy.scroll}</span>
        <span className="relative block h-9 w-px overflow-hidden bg-hairline">
          <span className="absolute left-0 top-0 h-3 w-full bg-gold-line motion-safe:animate-scroll-cue" />
        </span>
      </a>
    </section>
  )
}
