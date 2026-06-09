import { useEffect, useRef, useState } from 'react'
import { CinematicHero } from '@/components/ui/cinematic-landing-hero'
import { Nav } from '@/components/Nav'
import { ScrollCue } from '@/components/ScrollCue'
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
  const { lang } = useI18n()
  const c = CONTENT[lang]

  // The nav + section UI stay hidden until the cinematic scroll finishes.
  // A sentinel placed right after the pinned hero tells us when we've arrived.
  const [revealed, setRevealed] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setRevealed(true)
      return
    }
    const onScroll = () => {
      const el = sentinelRef.current
      if (!el) return
      // Reveal once the gallery boundary reaches ~60% up the viewport;
      // hide again if the visitor scrolls back into the cinematic.
      setRevealed(el.getBoundingClientRect().top <= window.innerHeight * 0.6)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const whatsappMessage =
    lang === 'es'
      ? 'Hola, me gustaría reservar una pieza.'
      : "Hi, I'd like to reserve a piece."

  return (
    <>
      <Nav revealed={revealed} />

      {/* Always-present, subtle scroll cue → keeps the intro clean */}
      <ScrollCue revealed={revealed} />

      <main>
        {/* Cinematic hero — title + "Curation, redefined" watch card reveal on scroll */}
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
        />

        {/* Boundary sentinel: marks the end of the cinematic */}
        <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

        <Gallery />
        <Stats />
        <Footer />
      </main>
    </>
  )
}
