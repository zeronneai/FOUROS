import { ArrowUpRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, whatsappLink } from '@/lib/site'
import { Monogram, Reveal } from '@/components/primitives'

export function Footer() {
  const { lang } = useI18n()
  const year = new Date().getFullYear()

  const copy =
    lang === 'es'
      ? {
          eyebrow: 'El siguiente paso',
          title: 'Asegura tu próxima pieza',
          body: 'La mayoría de las piezas se reservan por mensaje directo. Escríbenos y conversamos en privado.',
          whatsapp: 'Escribir por WhatsApp',
          instagram: 'Seguir en Instagram',
          rights: 'Todos los derechos reservados.',
          disclaimer:
            'Distribuidor independiente. No afiliado a las marcas relojeras mencionadas.',
        }
      : {
          eyebrow: 'The next step',
          title: 'Secure your next piece',
          body: 'Most pieces are reserved by direct message. Write to us and we talk in private.',
          whatsapp: 'Message on WhatsApp',
          instagram: 'Follow on Instagram',
          rights: 'All rights reserved.',
          disclaimer: 'Independent dealer. Not affiliated with the watch brands mentioned.',
        }

  const reserveMsg =
    lang === 'es'
      ? 'Hola, me gustaría reservar una pieza.'
      : "Hi, I'd like to reserve a piece."

  return (
    <footer id="contacto" className="scroll-mt-20 border-t border-hairline bg-ink">
      {/* Closing CTA */}
      <div className="container-editorial py-20 lg:py-[120px]">
        <Reveal>
          <h2 className="max-w-2xl text-balance font-display text-[clamp(2.25rem,7vw,5rem)] font-[650] leading-[1.02] tracking-tightest text-bone">
            {copy.title}
          </h2>
          <p className="mt-6 max-w-md text-pretty font-body text-[15px] leading-relaxed tracking-tighter text-muted">
            {copy.body}
          </p>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <a
              href={whatsappLink(reserveMsg)}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-3 border border-gold/40 px-6 py-3.5 font-body text-[12px] uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-gold hover:text-gold-light"
            >
              {copy.whatsapp}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="link-underline font-body text-[12px] uppercase tracking-[0.2em] text-muted hover:text-bone"
            >
              {copy.instagram}
            </a>
          </div>
        </Reveal>
      </div>

      {/* Footer base */}
      <div className="border-t border-hairline">
        <div className="container-editorial flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Monogram size={38} />
            <span className="font-display text-base font-semibold tracking-tightest text-bone">
              Four O&rsquo;s <span className="text-muted">Timepieces</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            <a href="#galeria" className="link-underline font-body text-[13px] tracking-tighter text-muted hover:text-bone">
              {lang === 'es' ? 'Inventario' : 'Inventory'}
            </a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="link-underline font-body text-[13px] tracking-tighter text-muted hover:text-bone">
              WhatsApp
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="link-underline font-body text-[13px] tracking-tighter text-muted hover:text-bone">
              @{INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
        <div className="container-editorial flex flex-col gap-3 border-t border-hairline py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[11px] tracking-tighter text-muted">
            &copy; {year} Four O&rsquo;s Timepieces. {copy.rights}
          </p>
          <p className="max-w-md font-body text-[11px] leading-relaxed tracking-tighter text-muted/70">
            {copy.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  )
}
