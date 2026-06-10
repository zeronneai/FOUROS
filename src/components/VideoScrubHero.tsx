'use client'

import { useEffect, useRef, type HTMLAttributes } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { HERO_VIDEO_POSTER, HERO_VIDEO_SRC } from '@/lib/media'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// The clip starts with the watch in pieces; scrolling down assembles it
// (forward scrub, climax = assembled). If the real footage runs the other way,
// flip this to true and the scrub plays from the end backward.
const REVERSE_SCRUB = false

/**
 * Scroll-sequenced video hero (Locomotive / sequence-scroll pattern).
 * The watch footage is scrubbed by scroll while three short type beats
 * cross-fade over it: assembled, in pieces, reassembled. The section pins,
 * so the whole story plays in place. Reduced motion shows a static frame.
 */
export function VideoScrubHero(props: HTMLAttributes<HTMLElement>) {
  const { lang } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const durationRef = useRef(6)

  const t =
    lang === 'es'
      ? {
          eyebrow: "Four O's Timepieces",
          b1: 'Inspeccionado hasta el último componente.',
          b2: 'Verificado hasta el último detalle.',
          c1: 'Armado como legado.',
          buy: 'Comprar. Vender. Intercambiar.',
        }
      : {
          eyebrow: "Four O's Timepieces",
          b1: 'Inspected to the last component.',
          b2: 'Verified to the last detail.',
          c1: 'Assembled into legacy.',
          buy: 'Buy. Sell. Trade.',
        }

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    video.pause()

    // Static fallback: first beat visible, no pin/scrub.
    if (reduced) {
      gsap.set(['.vsh-b', '.vsh-c'], { autoAlpha: 0 })
      gsap.set('.vsh-a', { autoAlpha: 1 })
      gsap.set('.vsh-a-line', { yPercent: 0, autoAlpha: 1 })
      return
    }

    const tweens: gsap.core.Tween[] = []
    let tl: gsap.core.Timeline | null = null

    gsap.set(['.vsh-b', '.vsh-c'], { autoAlpha: 0, y: 28 })

    // Intro: masked headline rises on load (not scroll-driven).
    tweens.push(
      gsap.fromTo(
        '.vsh-a-line',
        { yPercent: 118 },
        { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.25 },
      ),
      gsap.fromTo(
        '.vsh-eyebrow',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15 },
      ),
    )

    const build = () => {
      const dur = video.duration && isFinite(video.duration) ? video.duration : 6
      durationRef.current = dur
      const pinLen = Math.round(Math.min(6800, Math.max(3000, dur * 1000)))

      tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${pinLen}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      // Scrub the footage across the whole pin (timeline spans 3 units).
      if (REVERSE_SCRUB) {
        video.currentTime = dur
        tl.fromTo(video, { currentTime: dur }, { currentTime: 0, duration: 3 }, 0)
      } else {
        tl.to(video, { currentTime: dur, duration: 3 }, 0)
      }
      // Beat A (assembled) holds, then lifts away.
      tl.to('.vsh-a', { autoAlpha: 0, y: -36, duration: 0.45, ease: 'power2.in' }, 0.85)
      // Beat B (in pieces).
      tl.to('.vsh-b', { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 1.05)
        .to('.vsh-b', { autoAlpha: 0, y: -28, duration: 0.4, ease: 'power2.in' }, 1.85)
      // Beat C (reassembled).
      tl.to('.vsh-c', { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 2.1)
    }

    const onMeta = () => {
      build()
      ScrollTrigger.refresh()
    }

    if (video.readyState >= 1) {
      build()
    } else {
      video.addEventListener('loadedmetadata', onMeta, { once: true })
    }

    return () => {
      video.removeEventListener('loadedmetadata', onMeta)
      tweens.forEach((tw) => tw.kill())
      tl?.scrollTrigger?.kill()
      tl?.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-ink"
      {...props}
    >
      {/* Footage */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO_SRC}
        poster={HERO_VIDEO_POSTER}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Cinematic scrims for legibility + depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_30%,rgba(10,10,11,0.55)_75%,rgba(10,10,11,0.92)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink via-ink/40 to-transparent"
      />

      {/* Type beats — each fills the viewport and is cross-faded by scroll */}
      {/* Beat A: assembled */}
      <div className="vsh-a absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
        <p className="vsh-eyebrow eyebrow mb-6 text-gold-gradient">{t.eyebrow}</p>
        <h1 className="font-display text-[clamp(2.75rem,9vw,7.5rem)] font-semibold leading-[1.04] tracking-tightest text-bone">
          <span className="block overflow-hidden pb-[0.04em]">
            <span className="vsh-a-line block will-change-transform">Turning Time</span>
          </span>
          <span className="block overflow-hidden pb-[0.18em]">
            <span className="vsh-a-line block italic text-gold-gradient will-change-transform">
              into Legacy
            </span>
          </span>
        </h1>
      </div>

      {/* Beat B: in pieces */}
      <div className="vsh-b pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5 text-center">
        <p className="font-display text-[clamp(1.5rem,4.5vw,3.25rem)] font-medium leading-[1.14] tracking-tightest text-bone">
          {t.b1}
          <br />
          <span className="text-muted">{t.b2}</span>
        </p>
      </div>

      {/* Beat C: reassembled */}
      <div className="vsh-c pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 px-5 text-center">
        <p className="font-display text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tightest text-gold-gradient">
          {t.c1}
        </p>
        <p className="font-body text-[11px] uppercase tracking-[0.3em] text-muted">{t.buy}</p>
      </div>
    </section>
  )
}
