// src/components/ui/cinematic-landing-hero.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, BadgeCheck, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* Brand glyphs (lucide ships no brand icons) */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

/**
 * Cinematic, GSAP-driven scroll hero — adapted for Four O's Timepieces.
 * The deep-blue app card becomes a charcoal premium card; the iPhone mockup
 * becomes a luxury watch; App Store / Google Play CTAs become WhatsApp /
 * Instagram. Gold is used with discipline (signature lines, hairlines, the
 * watch bezel and seconds track) — never as a full fill.
 */
const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Environment overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 64px 64px;
      background-image:
          linear-gradient(to right, color-mix(in srgb, var(--color-foreground) 4%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 4%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* -------------------------------------------------------------------
     PHYSICAL SKEUOMORPHIC MATERIALS
  ---------------------------------------------------------------------- */

  /* Tagline 1 (outside card): matte off-white with soft depth */
  .text-3d-matte {
      color: var(--color-foreground);
      text-shadow:
          0 10px 30px color-mix(in srgb, var(--color-foreground) 18%, transparent),
          0 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent);
  }

  /* Signature gold gradient — brand line + CTA heading only */
  .text-gold-matte {
      background: linear-gradient(180deg, #E8C887 0%, #B8923F 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter:
          drop-shadow(0px 10px 20px rgba(232, 200, 135, 0.14))
          drop-shadow(0px 2px 4px rgba(0,0,0,0.4));
  }

  /* Brand name inside the dark card: bone -> deep, NOT gold (keep gold rare) */
  .text-card-matte {
      background: linear-gradient(180deg, #F5F2EC 0%, #4A4843 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter:
          drop-shadow(0px 12px 24px rgba(0,0,0,0.8))
          drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  /* Deep charcoal card with dynamic mouse lighting + gold hairline */
  .premium-depth-card {
      background: linear-gradient(155deg, #18181B 0%, #0A0A0B 100%);
      box-shadow:
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          0 20px 40px -20px rgba(0, 0, 0, 0.8),
          inset 0 1px 2px rgba(232, 200, 135, 0.08),
          inset 0 -2px 4px rgba(0, 0, 0, 0.85);
      border: 1px solid rgba(232, 200, 135, 0.10);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(820px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(232,200,135,0.055) 0%, transparent 42%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  /* Luxury watch case — steel body with a fine gold inner ring */
  .watch-case {
      background: radial-gradient(circle at 50% 28%, #2C2C30 0%, #161618 55%, #0B0B0D 100%);
      box-shadow:
          inset 0 0 0 2px rgba(232,200,135,0.20),
          inset 0 0 0 12px #121215,
          inset 0 0 24px rgba(0,0,0,0.9),
          0 40px 80px -15px rgba(0,0,0,0.9),
          0 15px 25px -5px rgba(0,0,0,0.7);
      transform-style: preserve-3d;
  }

  .watch-dial {
      background: radial-gradient(circle at 50% 32%, #1B1B20 0%, #0C0C0F 68%, #060607 100%);
  }

  /* Crown + pushers */
  .crown {
      background: linear-gradient(90deg, #E8C887 0%, #8A6E2E 100%);
      box-shadow:
          -2px 0 5px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.25),
          inset 1px 0 2px rgba(0,0,0,0.8);
  }

  /* Sapphire-crystal glare across the dial */
  .crystal-glare {
      background: linear-gradient(125deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 46%);
  }

  /* Floating glass badges */
  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow:
          0 0 0 1px rgba(232, 200, 135, 0.12),
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          inset 0 1px 1px rgba(255,255,255,0.16),
          inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  /* Tactile outline buttons — gold edge, never a gold fill */
  .btn-fo {
      border: 1px solid rgba(232, 200, 135, 0.40);
      color: #F5F2EC;
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
      box-shadow: 0 12px 24px -10px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05);
  }
  .btn-fo:hover {
      border-color: #E8C887;
      color: #E8C887;
      transform: translateY(-3px);
      box-shadow: 0 18px 32px -10px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.08);
  }
  .btn-fo:active {
      transform: translateY(1px);
      box-shadow: inset 0 2px 6px rgba(0,0,0,0.6);
  }

  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;
  }
`

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string
  tagline1?: string
  tagline2?: string
  cardHeading?: string
  cardDescription?: React.ReactNode
  metricValue?: number
  metricLabel?: string
  dateLabel?: string
  ctaHeading?: string
  ctaDescription?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  badges?: { title: string; sub: string }[]
}

export function CinematicHero({
  brandName = "FOUR O'S",
  tagline1 = 'Turning Time,',
  tagline2 = 'into Legacy.',
  cardHeading = 'Curation, redefined.',
  cardDescription = (
    <>
      <span className="font-semibold text-gold-light">Four O&rsquo;s</span> curates
      exceptional luxury timepieces — Rolex, Cartier, Patek — authenticated, with
      provenance, and ready to become legacy.
    </>
  ),
  metricValue = 240,
  metricLabel = 'Pieces placed',
  dateLabel = '09',
  ctaHeading = 'Secure your next piece.',
  ctaDescription = 'Most pieces are reserved by direct message. Let us talk in private and find the one.',
  primaryLabel = 'WhatsApp',
  primaryHref = '#',
  secondaryLabel = 'Instagram',
  secondaryHref = '#',
  badges = [
    { title: 'Authenticated', sub: 'Verified in full' },
    { title: 'Full Set', sub: 'Provenance documented' },
  ],
  className,
  ...props
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mainCardRef = useRef<HTMLDivElement>(null)
  const mockupRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>(0)

  // 1. High-performance mouse interaction (card sheen + watch tilt)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return
      cancelAnimationFrame(requestRef.current)

      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect()
          const mouseX = e.clientX - rect.left
          const mouseY = e.clientY - rect.top

          mainCardRef.current.style.setProperty('--mouse-x', `${mouseX}px`)
          mainCardRef.current.style.setProperty('--mouse-y', `${mouseY}px`)

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2

          gsap.to(mockupRef.current, {
            rotationY: xVal * 12,
            rotationX: -yVal * 12,
            ease: 'power3.out',
            duration: 1.2,
          })
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(requestRef.current)
    }
  }, [])

  // 2. Cinematic scroll timeline
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // Static, legible fallback — reveal everything, no pinning.
        gsap.set(
          [
            '.text-track',
            '.text-days',
            '.main-card',
            '.card-left-text',
            '.card-right-text',
            '.mockup-scroll-wrapper',
            '.floating-badge',
            '.phone-widget',
          ],
          { clearProps: 'all', autoAlpha: 1 },
        )
        gsap.set('.cta-wrapper', { autoAlpha: 0 })
        gsap.set('.counter-val', { innerHTML: metricValue })
        gsap.set('.progress-ring', { strokeDashoffset: 60 })
        return
      }

      gsap.set('.text-track', { autoAlpha: 0, y: 60, scale: 0.85, filter: 'blur(20px)', rotationX: -20 })
      gsap.set('.text-days', { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' })
      gsap.set('.main-card', { y: window.innerHeight + 200, autoAlpha: 1 })
      gsap.set(
        ['.card-left-text', '.card-right-text', '.mockup-scroll-wrapper', '.floating-badge', '.phone-widget'],
        { autoAlpha: 0 },
      )
      gsap.set('.cta-wrapper', { autoAlpha: 0, scale: 0.8, filter: 'blur(30px)' })

      const introTl = gsap.timeline({ delay: 0.3 })
      introTl
        .to('.text-track', { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', rotationX: 0, ease: 'expo.out' })
        .to('.text-days', { duration: 1.4, clipPath: 'inset(0 0% 0 0)', ease: 'power4.inOut' }, '-=1.0')

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=5600',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      scrollTl
        .to(['.hero-text-wrapper', '.bg-grid-theme'], { scale: 1.15, filter: 'blur(20px)', opacity: 0.2, ease: 'power2.inOut', duration: 2 }, 0)
        .to('.main-card', { y: 0, ease: 'power3.inOut', duration: 2 }, 0)
        .to('.main-card', { width: '100%', height: '100%', borderRadius: '0px', ease: 'power3.inOut', duration: 1.5 })
        .fromTo(
          '.mockup-scroll-wrapper',
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: 'expo.out', duration: 2.5 },
          '-=0.8',
        )
        .fromTo('.phone-widget', { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: 'back.out(1.2)', duration: 1.5 }, '-=1.5')
        .to('.progress-ring', { strokeDashoffset: 60, duration: 2, ease: 'power3.inOut' }, '-=1.2')
        .to('.counter-val', { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 2, ease: 'expo.out' }, '-=2.0')
        .fromTo('.floating-badge', { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: 'back.out(1.5)', duration: 1.5, stagger: 0.2 }, '-=2.0')
        .fromTo('.card-left-text', { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: 'power4.out', duration: 1.5 }, '-=1.5')
        .fromTo('.card-right-text', { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: 'expo.out', duration: 1.5 }, '<')
        .to({}, { duration: 1.6 })
        .set('.hero-text-wrapper', { autoAlpha: 0 })
        .set('.cta-wrapper', { autoAlpha: 1 })
        .to({}, { duration: 1.2 })
        .to(['.mockup-scroll-wrapper', '.floating-badge', '.card-left-text', '.card-right-text'], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: 'power3.in', duration: 1.2, stagger: 0.05,
        })
        // Responsive card pullback — refined small radius (not bubbly)
        .to('.main-card', {
          width: isMobile ? '92vw' : '85vw',
          height: isMobile ? '92vh' : '85vh',
          borderRadius: isMobile ? '14px' : '16px',
          ease: 'expo.inOut',
          duration: 1.8,
        }, 'pullback')
        .to('.cta-wrapper', { scale: 1, filter: 'blur(0px)', ease: 'expo.inOut', duration: 1.8 }, 'pullback')
        .to('.main-card', { y: -window.innerHeight - 300, ease: 'power3.in', duration: 1.5 })
    }, containerRef)

    return () => ctx.revert()
  }, [metricValue])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex h-screen w-screen items-center justify-center overflow-hidden bg-background font-sans text-foreground antialiased',
        className,
      )}
      style={{ perspective: '1500px' }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme pointer-events-none absolute inset-0 z-0 opacity-50" aria-hidden="true" />

      {/* BACKGROUND LAYER: hero taglines */}
      <div className="hero-text-wrapper transform-style-3d absolute z-10 flex w-screen flex-col items-center justify-center px-4 text-center will-change-transform">
        {/* Generous leading + bottom padding so Fraunces ascenders/descenders
            (and the gold background-clip) are never cropped. */}
        <h1 className="text-track gsap-reveal text-3d-matte mb-1 pb-[0.14em] font-display text-[2.75rem] font-bold leading-[1.2] tracking-tight md:text-7xl lg:text-[6rem]">
          {tagline1}
        </h1>
        <h1 className="text-days gsap-reveal text-gold-matte pb-[0.24em] font-display text-[2.75rem] font-black italic leading-[1.2] tracking-tighter md:text-7xl lg:text-[6rem]">
          {tagline2}
        </h1>
      </div>

      {/* BACKGROUND LAYER 2: CTA — WhatsApp + Instagram */}
      <div className="cta-wrapper gsap-reveal pointer-events-auto absolute z-10 flex w-screen flex-col items-center justify-center px-4 text-center will-change-transform">
        <h2 className="text-gold-matte mb-6 font-display text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          {ctaHeading}
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
          {ctaDescription}
        </p>
        <div className="flex flex-col gap-6 sm:flex-row">
          <a
            href={primaryHref}
            target="_blank"
            rel="noreferrer"
            aria-label={primaryLabel}
            className="btn-fo group flex items-center justify-center gap-3 rounded-sm px-8 py-4 focus:outline-none focus:ring-1 focus:ring-gold"
          >
            <WhatsAppGlyph className="h-5 w-5" />
            <span className="font-body text-[13px] uppercase tracking-[0.18em]">{primaryLabel}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <a
            href={secondaryHref}
            target="_blank"
            rel="noreferrer"
            aria-label={secondaryLabel}
            className="btn-fo group flex items-center justify-center gap-3 rounded-sm px-8 py-4 focus:outline-none focus:ring-1 focus:ring-gold"
          >
            <InstagramGlyph className="h-5 w-5" />
            <span className="font-body text-[13px] uppercase tracking-[0.18em]">{secondaryLabel}</span>
          </a>
        </div>
      </div>

      {/* FOREGROUND LAYER: the physical charcoal card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: '1500px' }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card gsap-reveal pointer-events-auto relative flex h-[92vh] w-[92vw] items-center justify-center overflow-hidden rounded-[16px] md:h-[85vh] md:w-[85vw]"
        >
          <div className="card-sheen" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-evenly px-4 py-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:py-0 lg:px-12">
            {/* TOP (mobile) / RIGHT (desktop): brand name */}
            <div className="card-right-text gsap-reveal z-20 order-1 flex w-full justify-center lg:order-3 lg:justify-end">
              <h2 className="text-card-matte pb-[0.08em] font-display text-6xl font-black uppercase leading-[1.02] tracking-tighter md:text-[6rem] lg:text-[8rem]">
                {brandName}
              </h2>
            </div>

            {/* MIDDLE (mobile) / CENTER (desktop): watch mockup */}
            <div className="mockup-scroll-wrapper z-10 order-2 flex h-[380px] w-full items-center justify-center lg:order-2 lg:h-[600px]" style={{ perspective: '1000px' }}>
              <div className="relative flex h-full w-full scale-[0.7] items-center justify-center md:scale-85 lg:scale-100">
                {/* The watch case */}
                <div
                  ref={mockupRef}
                  className="watch-case transform-style-3d relative flex h-[300px] w-[300px] items-center justify-center rounded-full will-change-transform"
                >
                  {/* Crown + pushers */}
                  <div className="crown absolute -right-[6px] top-[133px] z-0 h-[34px] w-[10px] rounded-r-md" aria-hidden="true" />
                  <div className="crown absolute -right-[5px] top-[104px] z-0 h-[16px] w-[8px] rounded-r-sm opacity-80" aria-hidden="true" />
                  <div className="crown absolute -right-[5px] top-[180px] z-0 h-[16px] w-[8px] rounded-r-sm opacity-80" aria-hidden="true" />

                  {/* Dial */}
                  <div className="watch-dial absolute inset-[16px] overflow-hidden rounded-full text-white">
                    <div className="crystal-glare pointer-events-none absolute inset-0 z-40" aria-hidden="true" />

                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 240 240" aria-hidden="true">
                      {/* chapter ring */}
                      <circle cx="120" cy="120" r="110" fill="none" stroke="rgba(232,200,135,0.14)" strokeWidth="1" />
                      {/* hour markers */}
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
                      {/* seconds track (animated) */}
                      <circle cx="120" cy="120" r="64" fill="none" stroke="rgba(245,242,236,0.05)" strokeWidth="3" />
                      <circle className="progress-ring" cx="120" cy="120" r="64" fill="none" stroke="#CBA45F" strokeWidth="3" />
                      {/* sub-dial frame */}
                      <circle cx="120" cy="162" r="26" fill="none" stroke="rgba(245,242,236,0.10)" strokeWidth="1" />
                      {/* hands (10:10) */}
                      <g className="phone-widget">
                        <line x1="120" y1="120" x2="120" y2="72" transform="rotate(305 120 120)" stroke="#F5F2EC" strokeWidth="4" strokeLinecap="round" />
                        <line x1="120" y1="120" x2="120" y2="56" transform="rotate(60 120 120)" stroke="#F5F2EC" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="120" cy="120" r="4.5" fill="#E8C887" />
                      </g>
                    </svg>

                    {/* Brand applique */}
                    <div className="phone-widget absolute left-1/2 top-[31%] -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-bone/75">
                        {brandName}
                      </p>
                    </div>

                    {/* Sub-dial counter */}
                    <div className="phone-widget absolute left-1/2 top-[67.5%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <span className="counter-val font-display text-lg font-bold leading-none tracking-tightest text-bone">0</span>
                      <span className="mt-1 text-[5.5px] font-bold uppercase tracking-[0.18em] text-gold-light/70">
                        {metricLabel}
                      </span>
                    </div>

                    {/* Date window */}
                    <div className="phone-widget absolute right-[11%] top-1/2 -translate-y-1/2 rounded-[2px] border border-gold/30 bg-ink/70 px-1.5 py-[3px]">
                      <span className="font-body text-[9px] font-semibold tracking-wider text-bone">{dateLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Floating glass badges */}
                <div className="floating-badge floating-ui-badge absolute left-[-15px] top-2 z-30 flex items-center gap-3 rounded-xl p-3 lg:left-[-72px] lg:top-8 lg:gap-4 lg:rounded-2xl lg:p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/25 bg-gradient-to-b from-gold-light/15 to-gold-dark/5 shadow-inner lg:h-10 lg:w-10">
                    <ShieldCheck className="h-4 w-4 text-gold-light lg:h-5 lg:w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-tight text-bone lg:text-sm">{badges[0]?.title}</p>
                    <p className="text-[10px] text-muted lg:text-xs">{badges[0]?.sub}</p>
                  </div>
                </div>

                <div className="floating-badge floating-ui-badge absolute bottom-10 right-[-15px] z-30 flex items-center gap-3 rounded-xl p-3 lg:bottom-16 lg:right-[-72px] lg:gap-4 lg:rounded-2xl lg:p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/25 bg-gradient-to-b from-gold-light/15 to-gold-dark/5 shadow-inner lg:h-10 lg:w-10">
                    <BadgeCheck className="h-4 w-4 text-gold-light lg:h-5 lg:w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-tight text-bone lg:text-sm">{badges[1]?.title}</p>
                    <p className="text-[10px] text-muted lg:text-xs">{badges[1]?.sub}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM (mobile) / LEFT (desktop): curation copy */}
            <div className="card-left-text gsap-reveal z-20 order-3 flex w-full flex-col justify-center px-4 text-center lg:order-1 lg:max-w-none lg:px-0 lg:text-left">
              <h3 className="mb-0 font-display text-2xl font-bold tracking-tight text-bone md:text-3xl lg:mb-5 lg:text-4xl">
                {cardHeading}
              </h3>
              <p className="mx-auto hidden max-w-sm text-sm font-normal leading-relaxed text-bone/70 md:block md:text-base lg:mx-0 lg:max-w-none lg:text-lg">
                {cardDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
