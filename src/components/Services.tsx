import { motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import { Eyebrow, Hairline } from './primitives'
import { EASE_EDITORIAL } from '../lib/motion'

const ROWS = [
  { n: '01', title: 'services.buy.title', body: 'services.buy.body' },
  { n: '02', title: 'services.sell.title', body: 'services.sell.body' },
  { n: '03', title: 'services.trade.title', body: 'services.trade.body' },
] as const

export function Services() {
  const { t } = useI18n()

  return (
    <section id="servicios" className="container-editorial scroll-mt-24 py-24 sm:py-32">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 1, ease: EASE_EDITORIAL }}
          className="lg:col-span-8"
        >
          <Eyebrow gold>{t('services.eyebrow')}</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] font-[650] leading-[0.95] tracking-tightest text-bone">
            {t('services.title')}
          </h2>
        </motion.div>
      </div>

      <div className="mt-14">
        {ROWS.map((row, i) => (
          <motion.div
            key={row.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 1, ease: EASE_EDITORIAL, delay: i * 0.05 }}
          >
            {i === 0 && <Hairline />}
            <div className="group grid grid-cols-12 items-start gap-4 py-9 sm:gap-8 sm:py-12">
              <div className="col-span-12 sm:col-span-2">
                <span className="font-display text-2xl font-[600] text-gold-gradient sm:text-3xl">
                  {row.n}
                </span>
              </div>
              <div className="col-span-12 sm:col-span-4">
                <h3 className="font-display text-3xl font-[650] tracking-tightest text-bone transition-transform duration-500 ease-editorial group-hover:translate-x-1 sm:text-4xl">
                  {t(row.title)}
                </h3>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <p className="max-w-md text-pretty font-body text-[14px] leading-relaxed tracking-tighter text-muted">
                  {t(row.body)}
                </p>
              </div>
            </div>
            <Hairline />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
