import { CinematicHero } from '@/components/ui/cinematic-landing-hero'
import { LanguageToggle } from '@/components/LanguageToggle'
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
  const { lang } = useI18n()
  const c = CONTENT[lang]

  const whatsappMessage =
    lang === 'es'
      ? 'Hola, me gustaría reservar una pieza.'
      : "Hi, I'd like to reserve a piece."

  return (
    <>
      {/* Minimal fixed overlay: brand mark + language toggle */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-5 py-5 sm:px-8">
        <a
          href="#"
          className="pointer-events-auto font-display text-sm font-semibold tracking-tightest text-bone/90 mix-blend-difference"
          aria-label="Four O's Timepieces"
        >
          Four O&rsquo;s <span className="text-muted">Timepieces</span>
        </a>
        <LanguageToggle className="pointer-events-auto mix-blend-difference" />
      </header>

      <main>
        <CinematicHero
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
        />
      </main>
    </>
  )
}
