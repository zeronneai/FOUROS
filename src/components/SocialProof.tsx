import { motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import { SOLD, TESTIMONIALS } from '../data/inventory'
import { Eyebrow, Hairline, Reveal } from './primitives'
import { EASE_EDITORIAL } from '../lib/motion'

export function SocialProof() {
  const { t, lang } = useI18n()

  return (
    <section className="container-editorial py-24 sm:py-32">
      <Reveal>
        <Eyebrow gold>{t('social.eyebrow')}</Eyebrow>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,6vw,4rem)] font-[650] leading-[0.95] tracking-tightest text-bone">
          {t('social.title')}
        </h2>
      </Reveal>

      {/* Sold wall */}
      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {SOLD.map((piece, i) => (
          <motion.div
            key={piece.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.9, ease: EASE_EDITORIAL, delay: i * 0.05 }}
            className="group relative aspect-square overflow-hidden border border-hairline bg-charcoal"
          >
            <img
              src={piece.image}
              alt={`${piece.brand} ${piece.model}`}
              loading="lazy"
              className="h-full w-full object-cover opacity-80 grayscale transition-all duration-700 ease-editorial group-hover:opacity-100 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-ink/30" aria-hidden />
            {/* SOLD stamp */}
            <span className="absolute left-3 top-3 border border-gold/50 px-2 py-1 font-body text-[9px] uppercase tracking-[0.24em] text-gold-light backdrop-blur-sm">
              {t('social.sold')}
            </span>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-bone/60">
                {piece.brand}
              </p>
              <p className="font-display text-sm tracking-tightest text-bone">
                {piece.model}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <Hairline className="my-16" />

      {/* Testimonials */}
      <div className="mb-10">
        <Eyebrow>{t('social.testimonials')}</Eyebrow>
      </div>
      <div className="grid grid-cols-1 gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-3">
        {TESTIMONIALS.map((tst, i) => (
          <motion.figure
            key={tst.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 0.9, ease: EASE_EDITORIAL, delay: i * 0.08 }}
            className="flex flex-col justify-between bg-ink p-8"
          >
            <blockquote className="text-pretty font-display text-lg font-[500] leading-snug tracking-tightest text-bone">
              &ldquo;{tst.quote[lang]}&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3">
              <span aria-hidden className="h-px w-6 bg-gold-line" />
              <span className="font-body text-[12px] tracking-tighter text-muted">
                {tst.author} &middot; {tst.location}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
