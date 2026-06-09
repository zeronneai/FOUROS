import { motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import { INVENTORY, type Piece } from '../data/inventory'
import { whatsappLink } from '../lib/site'
import { Eyebrow, Hairline, Reveal } from './primitives'
import { EASE_EDITORIAL } from '../lib/motion'

// Asymmetric editorial spans — deliberately uneven, not a 3-up grid.
const SPAN_CLASS: Record<Piece['span'], string> = {
  tall: 'sm:col-span-6 sm:row-span-2',
  wide: 'sm:col-span-12 lg:col-span-7 sm:row-span-1',
  regular: 'sm:col-span-6 lg:col-span-5 sm:row-span-1',
}

const ASPECT: Record<Piece['span'], string> = {
  tall: 'aspect-[3/4]',
  wide: 'aspect-[16/10]',
  regular: 'aspect-square',
}

function PieceCard({ piece, index }: { piece: Piece; index: number }) {
  const { t, lang } = useI18n()
  const inquiry =
    lang === 'es'
      ? `Hola, me interesa el ${piece.brand} ${piece.model}${piece.ref ? ` (${piece.ref})` : ''}.`
      : `Hi, I'm interested in the ${piece.brand} ${piece.model}${piece.ref ? ` (${piece.ref})` : ''}.`

  return (
    <motion.a
      href={whatsappLink(inquiry)}
      target="_blank"
      rel="noreferrer"
      className={`group relative block ${SPAN_CLASS[piece.span]}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease: EASE_EDITORIAL, delay: (index % 3) * 0.06 }}
    >
      <div
        className={`relative overflow-hidden border border-hairline bg-charcoal ${ASPECT[piece.span]}`}
      >
        <img
          src={piece.image}
          alt={`${piece.brand} ${piece.model}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.06]"
        />
        {/* index marker */}
        <span className="absolute left-4 top-4 font-body text-[11px] tracking-[0.2em] text-bone/70">
          {String(index + 1).padStart(2, '0')}
        </span>
        {/* hover veil + inquire cue */}
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 ease-editorial group-hover:opacity-100">
          <span className="m-4 font-body text-[11px] uppercase tracking-[0.22em] text-gold-light">
            {t('curate.inquire')} &rarr;
          </span>
        </div>
      </div>

      {/* caption */}
      <div className="flex items-baseline justify-between gap-4 pt-4">
        <div className="min-w-0">
          <p className="eyebrow mb-1">{piece.brand}</p>
          <h3 className="truncate font-display text-lg font-semibold tracking-tightest text-bone">
            {piece.model}
          </h3>
          <p className="mt-1 truncate font-body text-[13px] tracking-tighter text-muted">
            {piece.ref ? `${piece.ref} · ` : ''}
            {piece.note[lang]}
          </p>
        </div>
        <span className="shrink-0 font-body text-[11px] uppercase tracking-[0.16em] text-muted">
          {t('curate.price')}
        </span>
      </div>
    </motion.a>
  )
}

export function Curaduria() {
  const { t } = useI18n()
  return (
    <section id="inventario" className="container-editorial scroll-mt-24 py-24 sm:py-32">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <Eyebrow gold>{t('curate.eyebrow')}</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] font-[650] leading-[0.95] tracking-tightest text-bone">
            {t('curate.title')}
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-5">
          <p className="max-w-md text-pretty font-body text-[14px] leading-relaxed tracking-tighter text-muted">
            {t('curate.intro')}
          </p>
        </Reveal>
      </div>

      <Hairline className="my-12" />

      {/* Asymmetric grid */}
      <div className="grid auto-rows-auto grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-12">
        {INVENTORY.map((piece, i) => (
          <PieceCard key={piece.id} piece={piece} index={i} />
        ))}
      </div>
    </section>
  )
}
