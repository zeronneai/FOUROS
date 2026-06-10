'use client'

import { useEffect, useRef, useState, type HTMLAttributes } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { whatsappLink } from '@/lib/site'
import {
  HERO_FALLBACK_VIDEO_SRC,
  HERO_POSTER,
  SEQUENCE_DIR,
  SEQUENCE_DIR_SM,
  SEQUENCE_FRAME_COUNT,
  sequenceFrameSrc,
} from '@/lib/media'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const PRIORITY_FRAMES = 25
const PIN_DESKTOP = 6000
const PIN_MOBILE = 4500

/**
 * Canvas frame-sequence hero. The master clip (logo → the "O" becomes a watch
 * → exploded view, push-in baked in) is scrubbed frame-by-frame while five
 * text beats fade in/out at normalized progress ranges:
 *
 *   0-0.10  eyebrow only (the logo in the footage is the title)
 *   0.12-0.45  no text (the "O" morphs into the watch, then the push-in)
 *   0.46-0.57  "Inspected to the last component."   — left third
 *   0.575-0.685  "Verified to the last detail."     — right
 *   0.69-0.79  "Assembled into legacy."             — left, high (the watch
 *               lies across the vertical center here)
 *   0.80-1.0   climax over the explosion: H1 + subline + CTAs (stays)
 *
 * Reduced motion shows the last frame with the climax copy, no pin/scrub.
 * If the sequence fails to load, a lightweight MP4 is scrubbed instead.
 */
interface SequenceHeroProps extends HTMLAttributes<HTMLElement> {
  /** Fired when the persistent ScrollCue should hide (pin progress ≥ 0.75,
   *  where the climax CTAs would duplicate it) or show again. */
  onCueHide?: (hidden: boolean) => void
}

export function SequenceHero({ onCueHide, ...props }: SequenceHeroProps) {
  const { lang, t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fallbackRef = useRef(false)
  const [videoFallback, setVideoFallback] = useState(false)
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const c =
    lang === 'es'
      ? {
          eyebrow: 'Curaduría de relojes de lujo',
          inspected: 'Inspeccionado hasta el último componente.',
          verified: 'Verificado hasta el último detalle.',
          assembled: 'Armado como legado.',
          trade: 'Comprar. Vender. Intercambiar.',
        }
      : {
          eyebrow: 'Luxury watch curation',
          inspected: 'Inspected to the last component.',
          verified: 'Verified to the last detail.',
          assembled: 'Assembled into legacy.',
          trade: 'Buy. Sell. Trade.',
        }

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas || reduced) return

    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const dir = isMobile ? SEQUENCE_DIR_SM : SEQUENCE_DIR
    const N = SEQUENCE_FRAME_COUNT
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const images: (HTMLImageElement | null)[] = new Array(N).fill(null)
    const ready: boolean[] = new Array(N).fill(false)
    let disposed = false
    let desired = 0
    let drawn = -1

    const draw = (img: HTMLImageElement) => {
      // Manual object-cover: fill the canvas, center, crop overflow.
      const cw = canvas.width
      const ch = canvas.height
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    }

    const render = () => {
      if (fallbackRef.current) return
      // Fall back to the nearest earlier frame that has decoded.
      let idx = desired
      while (idx > 0 && !ready[idx]) idx--
      if (!ready[idx] || idx === drawn) return
      drawn = idx
      draw(images[idx]!)
    }

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      drawn = -1
      render()
    }

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image()
        img.decoding = 'async'
        img.onload = () => {
          if (!disposed) {
            images[i] = img
            ready[i] = true
            // Repaint if this frame unblocks what the scroll is asking for.
            if (i <= desired) render()
          }
          resolve()
        }
        img.onerror = () => {
          if (i === 0 && !disposed) {
            fallbackRef.current = true
            setVideoFallback(true)
          }
          resolve()
        }
        img.src = sequenceFrameSrc(dir, i)
      })

    // First frames load eagerly (frame 1 is already painted as an <img> for
    // LCP); the rest stream in the background a few at a time.
    const preload = async () => {
      await Promise.all(
        Array.from({ length: Math.min(PRIORITY_FRAMES, N) }, (_, i) => load(i)),
      )
      const queue = Array.from({ length: N - PRIORITY_FRAMES }, (_, i) => i + PRIORITY_FRAMES)
      await Promise.all(
        Array.from({ length: 6 }, async () => {
          while (queue.length > 0 && !disposed) await load(queue.shift()!)
        }),
      )
    }
    void preload()

    sizeCanvas()
    window.addEventListener('resize', sizeCanvas)

    const q = gsap.utils.selector(section)
    gsap.set(q('.sh-b2, .sh-b3, .sh-b4, .sh-b5'), {
      autoAlpha: 0,
      y: 28,
      filter: 'blur(6px)',
    })

    // Intro: the eyebrow fades in on load (not scroll-driven).
    const intro = gsap.fromTo(
      q('.sh-b0'),
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 },
    )

    const proxy = { p: 0 }
    const video = videoRef.current
    let cueHidden = false

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${isMobile ? PIN_MOBILE : PIN_DESKTOP}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    })

    // Footage scrub across the whole pin (timeline spans 1 = full progress).
    tl.to(
      proxy,
      {
        p: 1,
        duration: 1,
        onUpdate: () => {
          // Past ~0.75 the climax CTAs appear — the fixed ScrollCue would
          // duplicate "View collection", so it fades out and stays out.
          const hide = proxy.p >= 0.75
          if (hide !== cueHidden) {
            cueHidden = hide
            onCueHide?.(hide)
          }
          if (fallbackRef.current) {
            if (video && video.duration && isFinite(video.duration)) {
              video.currentTime = proxy.p * video.duration
            }
            return
          }
          desired = Math.round(proxy.p * (N - 1))
          render()
        },
      },
      0,
    )

    // Text beats at normalized progress ranges. Entry: alpha/y/blur in; exit
    // is the inverse before the next beat — never two visible at once.
    const beatIn = (sel: string, at: number) =>
      tl.fromTo(
        q(sel),
        { autoAlpha: 0, y: 28, filter: 'blur(6px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.04,
          ease: 'power3.out',
          immediateRender: false,
        },
        at,
      )
    const beatOut = (sel: string, at: number) =>
      tl.to(
        q(sel),
        { autoAlpha: 0, y: -28, filter: 'blur(6px)', duration: 0.035, ease: 'power2.in' },
        at,
      )
    // Micro-parallax (~0.9x): the copy drifts slightly slower than the scroll.
    const drift = (sel: string, from: number, to: number) =>
      tl.fromTo(
        q(sel),
        { yPercent: 5 },
        { yPercent: -5, duration: to - from, immediateRender: false },
        from,
      )

    beatOut('.sh-b0', 0.06) // ends at 0.10, before the "O" morph
    drift('.sh-b0 .sh-drift', 0, 0.1)

    beatIn('.sh-b2', 0.46)
    beatOut('.sh-b2', 0.535)
    drift('.sh-b2 .sh-drift', 0.46, 0.57)

    beatIn('.sh-b3', 0.575)
    beatOut('.sh-b3', 0.65)
    drift('.sh-b3 .sh-drift', 0.575, 0.685)

    beatIn('.sh-b4', 0.69)
    beatOut('.sh-b4', 0.755)
    drift('.sh-b4 .sh-drift', 0.69, 0.79)

    beatIn('.sh-b5', 0.8) // climax — stays
    drift('.sh-b5 .sh-drift', 0.8, 1)

    return () => {
      disposed = true
      window.removeEventListener('resize', sizeCanvas)
      intro.kill()
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [reduced, onCueHide])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-ink"
      {...props}
    >
      {/* Frame 1 paints immediately (LCP); the canvas takes over as frames
          decode. Reduced motion shows the last frame instead. */}
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet={sequenceFrameSrc(SEQUENCE_DIR_SM, reduced ? SEQUENCE_FRAME_COUNT - 1 : 0)}
        />
        <img
          src={sequenceFrameSrc(SEQUENCE_DIR, reduced ? SEQUENCE_FRAME_COUNT - 1 : 0)}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      {!reduced && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full ${videoFallback ? 'hidden' : ''}`}
        />
      )}

      {/* Safety net: scrubbed MP4 if the frame sequence fails to load. */}
      {!reduced && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover ${videoFallback ? '' : 'hidden'}`}
          src={videoFallback ? HERO_FALLBACK_VIDEO_SRC : undefined}
          poster={HERO_POSTER}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
        />
      )}

      {/* Cinematic scrims for legibility + depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_30%,rgba(10,10,11,0.55)_75%,rgba(10,10,11,0.92)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink via-ink/40 to-transparent"
      />

      {reduced ? (
        /* Static beat: last frame + final headline, no pin/scrub. */
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-5 pb-[16vh] text-center">
          <div className="beat-scrim relative flex flex-col items-center">
            <h1 className="font-display text-[clamp(2.5rem,7.5vw,6.5rem)] font-semibold leading-[1.05] tracking-tightest text-bone">
              <span className="text-legible block">Turning Time</span>
              <span className="gold-glow block pb-[0.15em] italic text-gold-gradient">
                into Legacy.
              </span>
            </h1>
            <p className="text-legible mt-7 font-body text-[11px] uppercase tracking-[0.3em] text-muted">
              {c.trade}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a href="#galeria" className="cta-gold">
                {t.viewInventory}
              </a>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="cta-ghost">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Beat 0: eyebrow only — the logo in the footage is the title. */}
          <div className="sh-b0 pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-[18vh]">
            <p className="sh-drift beat-scrim text-legible relative font-body text-[11px] uppercase tracking-[0.3em] text-muted">
              {c.eyebrow}
            </p>
          </div>

          {/* Beats 2-4: one line each, alternating in the lateral negative
              space around the vertical exploded view. */}
          <div className="sh-b2 pointer-events-none absolute inset-0 z-10">
            <p className="sh-drift beat-scrim text-legible absolute left-[6vw] top-[30%] max-w-[80vw] text-left font-display text-[clamp(1.35rem,2.8vw,2.4rem)] font-medium leading-snug tracking-tightest text-bone md:max-w-[34vw]">
              {c.inspected}
            </p>
          </div>
          <div className="sh-b3 pointer-events-none absolute inset-0 z-10">
            <p className="sh-drift beat-scrim text-legible absolute right-[6vw] top-[40%] max-w-[80vw] text-right font-display text-[clamp(1.35rem,2.8vw,2.4rem)] font-medium leading-snug tracking-tightest text-bone md:max-w-[34vw]">
              {c.verified}
            </p>
          </div>
          <div className="sh-b4 pointer-events-none absolute inset-0 z-10">
            {/* High placement: during this beat the watch lies horizontally
                across the vertical center of the frame. */}
            <p className="sh-drift beat-scrim text-legible absolute left-[6vw] top-[32%] max-w-[80vw] text-left font-display text-[clamp(1.35rem,2.8vw,2.4rem)] font-medium leading-snug tracking-tightest text-bone md:max-w-[34vw]">
              {c.assembled}
            </p>
          </div>

          {/* Beat 5: climax — stays. The only beat with clickable CTAs. */}
          <div className="sh-b5 absolute inset-0 z-20 flex flex-col items-center justify-end px-5 pb-[16vh] text-center">
            {/* H1 → subline → CTAs with explicit air between each, so the
                descenders of "Legacy." never sit on top of the subline. */}
            <div className="sh-drift beat-scrim relative flex flex-col items-center">
              <h1 className="font-display text-[clamp(2.5rem,7.5vw,6.5rem)] font-semibold leading-[1.05] tracking-tightest text-bone">
                <span className="text-legible block">Turning Time</span>
                <span className="gold-glow block pb-[0.15em] italic text-gold-gradient">
                  into Legacy.
                </span>
              </h1>
              <p className="text-legible mt-7 font-body text-[11px] uppercase tracking-[0.3em] text-muted">
                {c.trade}
              </p>
              <div className="mt-8 flex items-center gap-3">
                <a href="#galeria" className="cta-gold">
                  {t.viewInventory}
                </a>
                <a href={whatsappLink()} target="_blank" rel="noreferrer" className="cta-ghost">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
