import { useI18n } from '../lib/i18n'
import { Eyebrow, Hairline, Reveal } from './primitives'

const STEPS = [
  { n: '01', title: 'auth.step1.title', body: 'auth.step1.body' },
  { n: '02', title: 'auth.step2.title', body: 'auth.step2.body' },
  { n: '03', title: 'auth.step3.title', body: 'auth.step3.body' },
] as const

export function Authenticity() {
  const { t } = useI18n()

  return (
    <section className="bg-charcoal/40">
      <div className="container-editorial py-24 sm:py-32">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left: heading */}
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow gold>{t('auth.eyebrow')}</Eyebrow>
              <h2 className="mt-4 max-w-md text-balance font-display text-[clamp(1.75rem,4.5vw,3rem)] font-[650] leading-[1.02] tracking-tightest text-bone">
                {t('auth.title')}
              </h2>
              <p className="mt-6 max-w-sm text-pretty font-body text-[14px] leading-relaxed tracking-tighter text-muted">
                {t('auth.body')}
              </p>
            </Reveal>
          </div>

          {/* Right: numbered steps */}
          <div className="lg:col-span-6 lg:col-start-7">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                {i === 0 && <Hairline />}
                <div className="flex items-baseline gap-6 py-7">
                  <span className="font-body text-[11px] tracking-[0.2em] text-gold-light">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-[600] tracking-tightest text-bone">
                      {t(s.title)}
                    </h3>
                    <p className="mt-2 max-w-sm text-pretty font-body text-[13px] leading-relaxed tracking-tighter text-muted">
                      {t(s.body)}
                    </p>
                  </div>
                </div>
                <Hairline />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
