import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useRef } from 'react'
import { useI18n } from '../lib/i18n'
import { Eyebrow } from './primitives'

/** A single word whose opacity is driven by scroll progress. */
function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span style={{ opacity }} className="text-bone">
      {children}{' '}
    </motion.span>
  )
}

export function Manifiesto() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'end 40%'],
  })

  const words = t('manifesto.body').split(' ')

  return (
    <section
      id="manifiesto"
      className="relative scroll-mt-24 border-y border-hairline py-32 sm:py-44"
    >
      <div ref={ref} className="container-editorial">
        <div className="mb-10">
          <Eyebrow>{t('manifesto.eyebrow')}</Eyebrow>
        </div>
        <p className="max-w-5xl text-pretty font-display text-[clamp(1.75rem,5.5vw,4.25rem)] font-[600] leading-[1.08] tracking-tightest">
          {words.map((word, i) => {
            const start = i / words.length
            const end = start + 1 / words.length
            return (
              // key includes word index; length changes simply remount the list.
              <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            )
          })}
        </p>
      </div>
    </section>
  )
}
