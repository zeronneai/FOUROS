import { CinematicHero } from '@/components/ui/cinematic-landing-hero'
import { LanguageToggle } from '@/components/LanguageToggle'
import { Gallery } from '@/components/Gallery'
import { Stats } from '@/components/Stats'
import { Footer } from '@/components/Footer'
import { useI18n } from '@/lib/i18n'
import { INSTAGRAM_URL, whatsappLink } from '@/lib/site'

// Bilingual content for the cinematic hero. The brand motto stays in English
// (it's the signature line); the rest follows the ES/EN toggle.
const CONTENT = {
  es: {
    cardHeading: 'Curaduría, redefinida.',
    cardDescription: (
      <>
        <span className="font-semibold text-gold-light">Four O&rsquo;s</span> selecciona
        piezas excepcionales de alta relojería — Rolex, Cartier, Patek —
        verificadas, con procedencia y listas para volverse legado.
      </>
    ),
    metricLabel: 'Piezas colocadas',
    ctaHeading: 'Asegura tu próxima pieza.',
    ctaDescription:
      'La mayoría de las piezas se reservan por mensaje directo. Conversemos en privado y encontremos la indicada.',
    badges: [
      { title: 'Autenticado', sub: 'Verificación completa' },
      { title: 'Full Set', sub: 'Procedencia documentada' },
    ],
  },
  en: {
    cardHeading: 'Curation, redefined.',
    cardDescription: (
      <>
        <span className="font-semibold text-gold-light">Four O&rsquo;s</span> curates
        exceptional luxury timepieces — Rolex, Cartier, Patek — authenticated,
        with provenance, and ready to become legacy.
      </>
    ),
    metricLabel: 'Pieces placed',
    ctaHeading: 'Secure your next piece.',
    ctaDescription:
      'Most pieces are reserved by direct message. Let us talk in private and find the one.',
    badges: [
      { title: 'Authenticated', sub: 'Verified in full' },
      { title: 'Full Set', sub: 'Provenance documented' },
    ],
  },
} as const

export default function App() {
  const { lang, t } = useI18n()
  const c = CONTENT[lang]

  const whatsappMessage =
    lang === 'es'
      ? 'Hola, me gustaría reservar una pieza.'
      : "Hi, I'd like to reserve a piece."

  return (
    <>
      {/* Minimal fixed overlay nav — legible over the shifting cinematic bg */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] mix-blend-difference">
        <div className="container-editorial flex items-center justify-between py-5">
          <a
            href="#top"
            className="pointer-events-auto font-display text-sm font-semibold tracking-tightest text-bone"
            aria-label="Four O's Timepieces"
          >
            Four O&rsquo;s <span className="opacity-60">Timepieces</span>
          </a>
          <nav className="pointer-events-auto flex items-center gap-5 sm:gap-7">
            <a
              href="#galeria"
              className="link-underline font-body text-[11px] uppercase tracking-[0.2em] text-bone/90 hover:text-bone"
            >
              {t.navInventory}
            </a>
            <a
              href="#contacto"
              className="link-underline hidden font-body text-[11px] uppercase tracking-[0.2em] text-bone/90 hover:text-bone sm:inline-flex"
            >
              {t.navContact}
            </a>
            <LanguageToggle />
          </nav>
        </div>
      </header>

      <main>
        <CinematicHero
          id="top"
          brandName="FOUR O'S"
          tagline1="Turning Time,"
          tagline2="into Legacy."
          cardHeading={c.cardHeading}
          cardDescription={c.cardDescription}
          metricValue={240}
          metricLabel={c.metricLabel}
          dateLabel="09"
          ctaHeading={c.ctaHeading}
          ctaDescription={c.ctaDescription}
          primaryLabel="WhatsApp"
          primaryHref={whatsappLink(whatsappMessage)}
          secondaryLabel="Instagram"
          secondaryHref={INSTAGRAM_URL}
          badges={[...c.badges]}
          inventoryLabel={t.viewInventory}
          inventoryHref="#galeria"
        />
        <Gallery />
        <Stats />
        <Footer />
      </main>
    </>
  )
}
