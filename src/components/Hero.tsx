import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useI18n } from '../lib/i18n'
import { clipReveal, EASE_EDITORIAL, lineReveal } from '../lib/motion'
import { whatsappLink } from '../lib/site'

export function Hero() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // Subtle parallax: image drifts slower than the page.
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4])

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      {/* Full-bleed image (replace with macro shot or <video> loop) */}
      <motion.div
        style={{ y: imgY, scale: imgScale }}
        className="absolute inset-0 -z-10"
      >
        <img
          src="/placeholders/hero.svg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Cinematic vignette — keeps text legible, left-weighted */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/70 to-ink/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/30"
      />

      {/* Content — left aligned, NOT centered */}
      <div className="container-editorial pb-24 pt-32 sm:pb-32">
        <motion.div
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.div variants={clipReveal} className="mb-6">
            <span className="eyebrow text-gold-gradient">{t('hero.eyebrow')}</span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.75rem,11vw,8rem)] font-[650] leading-[0.92] tracking-tightest text-bone">
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block">
                {t('hero.title.a')}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                variants={lineReveal}
                transition={{ delay: 0.08 }}
                className="block italic text-gold-gradient"
              >
                {t('hero.title.b')}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: EASE_EDITORIAL }}
            className="mt-7 max-w-xl text-pretty font-body text-[15px] leading-relaxed tracking-tighter text-muted sm:text-base"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 1, ease: EASE_EDITORIAL }}
            className="mt-9 flex items-center gap-7"
          >
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 border border-gold/40 px-6 py-3 font-body text-[12px] uppercase tracking-[0.2em] text-bone transition-colors duration-300 ease-editorial hover:border-gold hover:text-gold-light"
            >
              {t('nav.cta')}
              <span aria-hidden className="transition-transform duration-300 ease-editorial group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
            <a
              href="#inventario"
              className="link-underline font-body text-[12px] uppercase tracking-[0.2em] text-muted hover:text-bone"
            >
              {t('curate.title')}
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated scroll cue */}
      <div className="container-editorial pb-8">
        <div className="flex items-center gap-3">
          <span className="relative block h-9 w-px overflow-hidden bg-hairline">
            <span className="absolute left-0 top-0 h-3 w-full bg-gold-line motion-safe:animate-scroll-cue" />
          </span>
          <span className="eyebrow">{t('hero.scroll')}</span>
        </div>
      </div>
    </section>
  )
}
