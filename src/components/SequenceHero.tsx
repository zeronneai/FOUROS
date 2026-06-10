'use client'

import { useEffect, useRef, useState, type HTMLAttributes } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { INSTAGRAM_DM_URL } from '@/lib/site'
import { InstagramGlyph } from '@/components/icons'
import {
  HERO_MEDIA,
  SEQUENCE_FRAME_COUNT,
  sequenceFrameSrc,
  type HeroOrientation,
} from '@/lib/media'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const PRIORITY_FRAMES = 25
const PIN_DESKTOP = 6000
const PIN_MOBILE = 4500

/**
 * Beat timings per orientation, as normalized pin progress. The two masters
 * run different durations (lg 15.2s, pt 13.2s), so the footage moments —
 * logo / morph+push-in / front view / rotation / explosion — land at
 * different percentages and were mapped frame-by-frame for each:
 *
 *   landscape: logo→0.13 · morph+push-in→0.45 · front 0.46 · rotation→0.79
 *              · explosion starts ~0.81
 *   portrait:  logo→0.12 · morph+push-in→0.40 · front 0.42 · rotation→0.74
 *              · explosion starts ~0.75
 *
 * The climax (b5) enters exactly when the explosion starts in each version.
 */
const BEATS: Record<
  HeroOrientation,
  {
    b0Out: number
    b2In: number
    b2Out: number
    b3In: number
    b3Out: number
    b4In: number
    b4Out: number
    b5In: number
  }
> = {
  landscape: {
    b0Out: 0.06,
    b2In: 0.46,
    b2Out: 0.535,
    b3In: 0.575,
    b3Out: 0.65,
    b4In: 0.69,
    b4Out: 0.755,
    b5In: 0.8,
  },
  portrait: {
    b0Out: 0.06,
    b2In: 0.43,
    b2Out: 0.5,
    b3In: 0.545,
    b3Out: 0.61,
    b4In: 0.655,
    b4Out: 0.71,
    b5In: 0.75,
  },
}

const OUT_DUR = 0.035

interface SequenceHeroProps extends HTMLAttributes<HTMLElement> {
  /** Fired when the persistent ScrollCue should hide (shortly before the
   *  climax CTAs, which would duplicate it) or show again. */
  onCueHide?: (hidden: boolean) => void
}

/**
 * Canvas frame-sequence hero with per-orientation footage: viewports wider
 * than tall scrub the 16:9 sequence, the rest the 9:16 one. Five text beats
 * fade in/out at the per-orientation ranges above. On orientation change the
 * other sequence is loaded while the last drawn frame stays on screen (no
 * black flash), starting with the frame equivalent to the current progress.
 *
 * Reduced motion shows the last frame with the climax copy, no pin/scrub.
 * If a sequence fails to load, the matching lightweight MP4 is scrubbed.
 */
export function SequenceHero({ onCueHide, ...props }: SequenceHeroProps) {
  const { lang, t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fallbackRef = useRef(false)
  // Survives orientation rebuilds so the canvas is never blank mid-swap.
  const lastDrawnRef = useRef<HTMLImageElement | null>(null)
  const [videoFallback, setVideoFallback] = useState(false)
  const [orientation, setOrientation] = useState<HeroOrientation>(() =>
    typeof window !== 'undefined' && window.innerWidth <= window.innerHeight
      ? 'portrait'
      : 'landscape',
  )
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const isPortrait = orientation === 'portrait'
  const media = HERO_MEDIA[orientation]

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

  // Track viewport orientation; flipping it rebuilds the scrub below.
  useEffect(() => {
    const onResize = () =>
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas || reduced) return

    const dir = HERO_MEDIA[orientation].dir
    const T = BEATS[orientation]
    const portrait = orientation === 'portrait'
    const N = SEQUENCE_FRAME_COUNT
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const images: (HTMLImageElement | null)[] = new Array(N).fill(null)
    const ready: boolean[] = new Array(N).fill(false)
    let disposed = false
    let desired = 0
    let drawn = -1

    const draw = (img: HTMLImageElement) => {
      // Manual object-cover anchored to center: fill, center, crop overflow.
      const cw = canvas.width
      const ch = canvas.height
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
      lastDrawnRef.current = img
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      drawn = -1
      // Resizing wipes the bitmap; repaint the last frame we had (possibly
      // from the other orientation) so there is never a black canvas.
      if (lastDrawnRef.current) draw(lastDrawnRef.current)
      render()
    }

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (disposed || ready[i]) return resolve()
        const img = new Image()
        img.decoding = 'async'
        img.onload = () => {
          if (!disposed) {
            images[i] = img
            ready[i] = true
            // Repaint if this frame unblocks what the scroll is asking for.
            if (i <= desired || drawn === -1) render()
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

    sizeCanvas()
    window.addEventListener('resize', sizeCanvas)

    const q = gsap.utils.selector(section)
    gsap.set(q('.sh-b2, .sh-b3, .sh-b4, .sh-b5'), {
      autoAlpha: 0,
      y: 28,
      filter: 'blur(6px)',
    })

    const proxy = { p: 0 }
    const video = videoRef.current
    let cueHidden = false

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${portrait ? PIN_MOBILE : PIN_DESKTOP}`,
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
          // Shortly before the climax CTAs appear, the fixed ScrollCue would
          // duplicate "View collection" — fade it out.
          const hide = proxy.p >= T.b5In - 0.05
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

    // Intro: the eyebrow fades in on load — only when actually at the top
    // (an orientation flip mid-scroll must not replay it).
    let intro: gsap.core.Tween | null = null
    if ((tl.scrollTrigger?.progress ?? 0) < 0.02) {
      intro = gsap.fromTo(
        q('.sh-b0'),
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 },
      )
    }

    // Preload: the frame matching the current progress first (the static
    // stand-in during an orientation swap), then the priority window, then
    // the rest in the background a few at a time.
    desired = Math.round((tl.scrollTrigger?.progress ?? 0) * (N - 1))
    const preload = async () => {
      if (desired > 0) await load(desired)
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

    // Text beats at the per-orientation ranges. Entry: alpha/y/blur in; exit
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
        { autoAlpha: 0, y: -28, filter: 'blur(6px)', duration: OUT_DUR, ease: 'power2.in' },
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

    beatOut('.sh-b0', T.b0Out)
    drift('.sh-b0 .sh-drift', 0, T.b0Out + OUT_DUR)

    beatIn('.sh-b2', T.b2In)
    beatOut('.sh-b2', T.b2Out)
    drift('.sh-b2 .sh-drift', T.b2In, T.b2Out + OUT_DUR)

    beatIn('.sh-b3', T.b3In)
    beatOut('.sh-b3', T.b3Out)
    drift('.sh-b3 .sh-drift', T.b3In, T.b3Out + OUT_DUR)

    beatIn('.sh-b4', T.b4In)
    beatOut('.sh-b4', T.b4Out)
    drift('.sh-b4 .sh-drift', T.b4In, T.b4Out + OUT_DUR)

    beatIn('.sh-b5', T.b5In) // climax — stays
    drift('.sh-b5 .sh-drift', T.b5In, 1)

    return () => {
      disposed = true
      window.removeEventListener('resize', sizeCanvas)
      intro?.kill()
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [reduced, onCueHide, orientation])

  // One-liner placement: landscape alternates left/right in the lateral
  // negative space; portrait centers them at ~78% height under the watch.
  const lineBase =
    'sh-drift beat-scrim text-legible absolute font-display font-medium leading-snug tracking-tightest text-bone'
  const lineSize = isPortrait
    ? 'text-[clamp(1.15rem,5.2vw,1.6rem)]'
    : 'text-[clamp(1.35rem,2.8vw,2.4rem)]'
  const linePortrait = 'inset-x-[8vw] top-[78%] text-center'

  const climax = (
    <div
      className={`sh-drift beat-scrim relative flex flex-col items-center ${
        isPortrait ? 'gap-0' : ''
      }`}
    >
      <h1
        className={`font-display font-semibold leading-[1.05] tracking-tightest text-bone ${
          isPortrait ? 'text-[clamp(2.3rem,11vw,3.6rem)]' : 'text-[clamp(2.5rem,7.5vw,6.5rem)]'
        }`}
      >
        <span className="text-legible block">Turning Time</span>
        <span className="gold-glow block pb-[0.15em] italic text-gold-gradient">
          into Legacy.
        </span>
      </h1>
      <p
        className={`text-legible font-body text-[11px] uppercase tracking-[0.3em] text-muted ${
          isPortrait ? 'mt-4' : 'mt-7'
        }`}
      >
        {c.trade}
      </p>
      <div className={`flex flex-wrap items-center justify-center gap-3 ${isPortrait ? 'mt-5' : 'mt-8'}`}>
        <a href="#galeria" className="cta-gold">
          {t.viewInventory}
        </a>
        <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="cta-ghost">
          <InstagramGlyph className="h-4 w-4" />
          Send DM
        </a>
      </div>
    </div>
  )

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-ink"
      {...props}
    >
      {/* Frame 1 paints immediately (LCP); the canvas takes over as frames
          decode. Reduced motion shows the last frame instead. */}
      <img
        src={sequenceFrameSrc(media.dir, reduced ? SEQUENCE_FRAME_COUNT - 1 : 0)}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

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
          src={videoFallback ? media.fallback : undefined}
          poster={media.poster}
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
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-5 pb-[14vh] text-center">
          {climax}
        </div>
      ) : (
        <>
          {/* Beat 0: eyebrow only — the logo in the footage is the title. */}
          <div className="sh-b0 pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-[18vh]">
            <p className="sh-drift beat-scrim text-legible relative font-body text-[11px] uppercase tracking-[0.3em] text-muted">
              {c.eyebrow}
            </p>
          </div>

          {/* Beats 2-4: one line each. */}
          <div className="sh-b2 pointer-events-none absolute inset-0 z-10">
            <p
              className={`${lineBase} ${lineSize} ${
                isPortrait ? linePortrait : 'left-[6vw] top-[30%] max-w-[34vw] text-left'
              }`}
            >
              {c.inspected}
            </p>
          </div>
          <div className="sh-b3 pointer-events-none absolute inset-0 z-10">
            <p
              className={`${lineBase} ${lineSize} ${
                isPortrait ? linePortrait : 'right-[6vw] top-[40%] max-w-[34vw] text-right'
              }`}
            >
              {c.verified}
            </p>
          </div>
          <div className="sh-b4 pointer-events-none absolute inset-0 z-10">
            {/* Landscape sits high: during this beat the watch lies across
                the vertical center of the frame. */}
            <p
              className={`${lineBase} ${lineSize} ${
                isPortrait ? linePortrait : 'left-[6vw] top-[32%] max-w-[34vw] text-left'
              }`}
            >
              {c.assembled}
            </p>
          </div>

          {/* Beat 5: climax — stays. The only beat with clickable CTAs. */}
          <div
            className={`sh-b5 absolute inset-0 z-20 flex flex-col items-center justify-end px-5 text-center ${
              isPortrait ? 'pb-[10vh]' : 'pb-[16vh]'
            }`}
          >
            {climax}
          </div>
        </>
      )}
    </section>
  )
}
