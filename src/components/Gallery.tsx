import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { whatsappLink } from '@/lib/site'
import { FILTERS, INVENTORY, type Category, type Piece } from '@/data/inventory'
import { Eyebrow, Hairline, Reveal } from '@/components/primitives'

// Varied aspect ratios drive the magazine rhythm inside the masonry columns.
const ASPECT: Record<Piece['span'], string> = {
  tall: 'aspect-[3/4]',
  regular: 'aspect-[4/5]',
  wide: 'aspect-square',
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function StatusBadge({ piece }: { piece: Piece }) {
  const { t } = useI18n()
  if (piece.status === 'sold') {
    return (
      <span className="absolute left-4 top-4 border border-bone/30 bg-ink/70 px-2.5 py-1 font-body text-[10px] uppercase tracking-[0.24em] text-bone backdrop-blur-sm">
        {t.sold}
      </span>
    )
  }
  return (
    <span className="absolute left-4 top-4 flex items-center gap-2 border border-gold/40 bg-ink/60 px-2.5 py-1 font-body text-[10px] uppercase tracking-[0.2em] text-gold-light backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-gold-light" aria-hidden="true" />
      {t.available}
    </span>
  )
}

function PieceCard({ piece, index }: { piece: Piece; index: number }) {
  const { t, lang } = useI18n()
  const sold = piece.status === 'sold'
  const inquiry =
    lang === 'es'
      ? `Hola, me interesa el ${piece.brand} ${piece.model}${piece.ref ? ` (${piece.ref})` : ''}.`
      : `Hi, I'm interested in the ${piece.brand} ${piece.model}${piece.ref ? ` (${piece.ref})` : ''}.`

  return (
    <Reveal className="mb-5 break-inside-avoid" delay={(index % 3) * 70}>
      <div className="group flex h-full flex-col">
        <a
          href={whatsappLink(inquiry)}
          target="_blank"
          rel="noreferrer"
          className={`relative block overflow-hidden border border-hairline bg-charcoal ${ASPECT[piece.span]}`}
          aria-label={`${piece.brand} ${piece.model} — ${t.inquire}`}
        >
          <img
            src={piece.image}
            alt={`${piece.brand} ${piece.model}`}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] ${
              sold ? 'opacity-80 grayscale' : ''
            }`}
          />
          <span className="absolute right-4 top-4 font-body text-[11px] tracking-[0.2em] text-bone/60">
            {String(index + 1).padStart(2, '0')}
          </span>
          <StatusBadge piece={piece} />
          <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="m-4 inline-flex items-center gap-1.5 font-body text-[11px] uppercase tracking-[0.22em] text-gold-light">
              {t.inquire} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </span>
        </a>

        <div className="flex items-start justify-between gap-4 pt-4">
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
        </div>

        {/* Per-piece CTA — always tappable on mobile */}
        <a
          href={whatsappLink(inquiry)}
          target="_blank"
          rel="noreferrer"
          className="link-underline mt-3 inline-flex w-fit items-center gap-2 font-body text-[11px] uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:text-gold-light"
        >
          <WhatsAppGlyph className="h-3.5 w-3.5" />
          {t.consult}
        </a>
      </div>
    </Reveal>
  )
}

export function Gallery() {
  const { lang } = useI18n()
  const [active, setActive] = useState<Category>('all')

  const pieces =
    active === 'all' ? INVENTORY : INVENTORY.filter((p) => p.tags.includes(active))

  const copy =
    lang === 'es'
      ? {
          eyebrow: 'La colección',
          title: 'Piezas en curaduría',
          intro:
            'El corazón de la colección. Piezas seleccionadas a mano — disponibles y vendidas — con precio bajo consulta.',
          closing: '¿No ves la referencia que buscas? La conseguimos.',
          closingCta: 'Pedir una pieza específica',
        }
      : {
          eyebrow: 'The collection',
          title: 'Pieces under curation',
          intro:
            'The heart of the collection. Hand-selected pieces — available and sold — with price on request.',
          closing: "Don't see the reference you want? We'll source it.",
          closingCta: 'Request a specific piece',
        }

  const sourcingMsg =
    lang === 'es'
      ? 'Hola, busco una referencia específica:'
      : "Hi, I'm looking for a specific reference:"

  return (
    <section id="galeria" className="scroll-mt-20 border-t border-hairline">
      <div className="container-editorial py-20 lg:py-[120px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Eyebrow gold>{copy.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] font-[650] leading-[1] tracking-tightest text-bone">
              {copy.title}
            </h2>
          </Reveal>
          <Reveal delay={80} className="lg:col-span-5">
            <p className="max-w-md text-pretty font-body text-[14px] leading-relaxed tracking-tighter text-muted">
              {copy.intro}
            </p>
          </Reveal>
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActive(f.key)}
              aria-pressed={active === f.key}
              className={`link-underline font-body text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                active === f.key ? 'text-gold-gradient' : 'text-muted hover:text-bone'
              }`}
            >
              {f.label[lang]}
            </button>
          ))}
        </div>

        <Hairline className="my-10" />

        {/* Asymmetric editorial masonry — varied heights, magazine rhythm */}
        <div className="columns-2 gap-5 lg:columns-3">
          {pieces.map((piece, i) => (
            <PieceCard key={piece.id} piece={piece} index={i} />
          ))}
        </div>

        {/* Closing invitation — no dead-end */}
        <Reveal>
          <div className="mt-16 flex flex-col items-start justify-between gap-5 border-t border-hairline pt-8 sm:flex-row sm:items-center">
            <p className="max-w-md font-display text-xl tracking-tightest text-bone sm:text-2xl">
              {copy.closing}
            </p>
            <a
              href={whatsappLink(sourcingMsg)}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex shrink-0 items-center gap-3 border border-gold/40 px-6 py-3 font-body text-[12px] uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-gold hover:text-gold-light"
            >
              {copy.closingCta}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
