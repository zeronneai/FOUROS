import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { INSTAGRAM_DM_URL } from '@/lib/site'
import { cldImage, cldSrcSet, GALLERY_SIZES } from '@/lib/cloudinary'
import {
  BRAND_FILTERS,
  INVENTORY,
  matchesFilters,
  ROLEX_FAMILY_FILTERS,
  type BrandFilter,
  type FamilyFilter,
  type Piece,
} from '@/data/inventory'
import { Eyebrow, Reveal } from '@/components/primitives'
import { InstagramGlyph } from '@/components/icons'

const DM_PROPS = { href: INSTAGRAM_DM_URL, target: '_blank', rel: 'noopener noreferrer' } as const

function PieceCard({ piece, index }: { piece: Piece; index: number }) {
  const alt = `${piece.brand} ${piece.name}${piece.ref ? ` ${piece.ref}` : ''}`
  const refLine = piece.ref ? `Ref. ${piece.ref}` : piece.refLabel

  return (
    <Reveal className="h-full" delay={(index % 3) * 70}>
      <article className="group flex h-full flex-col">
        {/* Fixed 4:5 slot — no layout shift */}
        <a
          {...DM_PROPS}
          className="relative block aspect-[4/5] overflow-hidden border border-hairline bg-charcoal"
          aria-label={`${alt}, send a DM on Instagram`}
        >
          <img
            src={cldImage(piece.image)}
            srcSet={cldSrcSet(piece.image)}
            sizes={GALLERY_SIZES}
            alt={alt}
            loading={index < 3 ? 'eager' : 'lazy'}
            decoding="async"
            width={760}
            height={950}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
          <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="m-4 inline-flex items-center gap-1.5 font-body text-[11px] uppercase tracking-[0.22em] text-gold-light">
              Send DM <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </span>
        </a>

        {/* Meta: brand → name → ref → description → footer row */}
        <div className="flex flex-1 flex-col pt-4">
          <p className="eyebrow mb-1.5">{piece.brand}</p>
          <h3 className="font-display text-xl font-semibold leading-tight tracking-tightest text-bone">
            {piece.name}
          </h3>
          {refLine && (
            <p className="mt-1.5 font-body text-[11px] uppercase tracking-[0.22em] text-muted">
              {refLine}
            </p>
          )}
          <p className="mt-3 text-pretty font-body text-[13.5px] leading-relaxed text-muted">
            {piece.description}
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-hairline pt-4">
            <span className="font-body text-[11px] uppercase tracking-[0.18em] text-muted">
              Price on request
            </span>
            <a
              {...DM_PROPS}
              className="link-underline inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:text-gold-light"
            >
              <InstagramGlyph className="h-3.5 w-3.5" />
              Send DM
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

export function Gallery() {
  const { lang } = useI18n()
  const [brand, setBrand] = useState<BrandFilter>('ALL')
  const [family, setFamily] = useState<FamilyFilter>('ALL')

  // Leaving ROLEX (or picking any level-1 tab) resets level 2.
  const selectBrand = (b: BrandFilter) => {
    setBrand(b)
    setFamily('ALL')
  }

  const pieces = INVENTORY.filter((p) => matchesFilters(p, brand, family))

  const copy =
    lang === 'es'
      ? {
          eyebrow: 'La colección',
          title: 'Piezas en curaduría',
          intro:
            'Piezas que hemos conseguido y piezas que podemos conseguir. Cada una seleccionada a mano y autenticada. Precio bajo consulta.',
          closing: '¿No ves la referencia que buscas? La conseguimos.',
          closingCta: 'Send DM',
        }
      : {
          eyebrow: 'The collection',
          title: 'Pieces under curation',
          intro:
            "Pieces we've sourced and pieces we can source. Every one hand-selected and authenticated. Price on request.",
          closing: "Don't see the reference you want? We'll source it.",
          closingCta: 'Send DM',
        }

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

        {/* Two-level filters — stick below the fixed nav while the tall grid scrolls */}
        <div className="sticky top-16 z-30 -mx-5 mt-10 border-b border-hairline bg-ink/90 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          {/* Level 1: brands */}
          <div
            className="no-scrollbar flex items-center gap-x-7 overflow-x-auto whitespace-nowrap"
            role="tablist"
            aria-label="Brand"
          >
            {BRAND_FILTERS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => selectBrand(b)}
                aria-pressed={brand === b}
                className={`link-underline shrink-0 font-body text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  brand === b ? 'text-gold-gradient' : 'text-muted hover:text-bone'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Level 2: Rolex families — only mounted while ROLEX is active */}
          {brand === 'ROLEX' && (
            <div
              className="no-scrollbar subfilter-enter mt-3.5 flex items-center gap-x-5 overflow-x-auto whitespace-nowrap"
              role="tablist"
              aria-label="Rolex family"
            >
              {ROLEX_FAMILY_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFamily(f)}
                  aria-pressed={family === f}
                  className={`link-underline shrink-0 font-body text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    family === f ? 'text-gold-gradient' : 'text-muted/60 hover:text-bone'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Uniform 4:5 editorial grid */}
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 lg:gap-x-6">
          {pieces.map((piece, i) => (
            <PieceCard key={piece.id} piece={piece} index={i} />
          ))}
        </div>

        {/* Closing invitation */}
        <Reveal>
          <div className="mt-16 flex flex-col items-start justify-between gap-5 border-t border-hairline pt-8 sm:flex-row sm:items-center">
            <p className="max-w-md font-display text-xl tracking-tightest text-bone sm:text-2xl">
              {copy.closing}
            </p>
            <a
              {...DM_PROPS}
              className="group inline-flex shrink-0 items-center gap-3 border border-gold/40 px-6 py-3 font-body text-[12px] uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-gold hover:text-gold-light"
            >
              <InstagramGlyph className="h-4 w-4" />
              {copy.closingCta}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
