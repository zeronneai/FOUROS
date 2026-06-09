import type { Lang } from '../lib/i18n'

export interface Piece {
  id: string
  brand: string
  /** Reference / model line. */
  model: string
  ref?: string
  year?: string
  /** Short note shown on hover/caption, localized. */
  note: { es: string; en: string }
  /** Image path — replace placeholders with real Instagram photos. */
  image: string
  /** Layout weight in the asymmetric editorial grid. */
  span: 'tall' | 'wide' | 'regular'
}

export interface SoldPiece {
  id: string
  brand: string
  model: string
  image: string
}

export interface Testimonial {
  id: string
  quote: { es: string; en: string }
  author: string
  location: string
}

// --- New arrivals (asymmetric grid) -----------------------------------------
// Placeholder images live in /public/placeholders. Swap for real shots.
export const INVENTORY: Piece[] = [
  {
    id: 'datejust-41',
    brand: 'Rolex',
    model: 'Datejust 41',
    ref: 'Ref. 126334',
    year: '2022',
    note: {
      es: 'Esfera azul, jubilee. Full set.',
      en: 'Blue dial, jubilee. Full set.',
    },
    image: '/placeholders/piece-01.svg',
    span: 'tall',
  },
  {
    id: 'santos-large',
    brand: 'Cartier',
    model: 'Santos de Cartier',
    ref: 'Large model',
    year: '2023',
    note: {
      es: 'Acero. QuickSwitch. Como nuevo.',
      en: 'Steel. QuickSwitch. Like new.',
    },
    image: '/placeholders/piece-02.svg',
    span: 'regular',
  },
  {
    id: 'submariner',
    brand: 'Rolex',
    model: 'Submariner Date',
    ref: 'Ref. 126610LN',
    year: '2021',
    note: {
      es: 'Cerámica negra. Sin pulir.',
      en: 'Black ceramic. Unpolished.',
    },
    image: '/placeholders/piece-03.svg',
    span: 'wide',
  },
  {
    id: 'nautilus',
    brand: 'Patek Philippe',
    model: 'Nautilus',
    ref: 'Ref. 5711',
    year: '2019',
    note: {
      es: 'Pieza de colección. Bajo consulta.',
      en: 'Collector grade. On request.',
    },
    image: '/placeholders/piece-04.svg',
    span: 'regular',
  },
  {
    id: 'royal-oak',
    brand: 'Audemars Piguet',
    model: 'Royal Oak',
    ref: 'Ref. 15500ST',
    year: '2022',
    note: {
      es: 'Esfera azul tapisserie.',
      en: 'Blue tapisserie dial.',
    },
    image: '/placeholders/piece-05.svg',
    span: 'tall',
  },
  {
    id: 'daytona',
    brand: 'Rolex',
    model: 'Cosmograph Daytona',
    ref: 'Ref. 116500LN',
    year: '2020',
    note: {
      es: 'Panda. Lista para entregar.',
      en: 'Panda. Ready to hand over.',
    },
    image: '/placeholders/piece-06.svg',
    span: 'regular',
  },
]

// --- Sold wall --------------------------------------------------------------
export const SOLD: SoldPiece[] = [
  { id: 's1', brand: 'Rolex', model: 'GMT-Master II', image: '/placeholders/sold-01.svg' },
  { id: 's2', brand: 'Omega', model: 'Speedmaster', image: '/placeholders/sold-02.svg' },
  { id: 's3', brand: 'Cartier', model: 'Tank Must', image: '/placeholders/sold-03.svg' },
  { id: 's4', brand: 'Rolex', model: 'Day-Date 40', image: '/placeholders/sold-04.svg' },
  { id: 's5', brand: 'Tudor', model: 'Black Bay 58', image: '/placeholders/sold-05.svg' },
]

// --- Testimonials -----------------------------------------------------------
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote: {
      es: 'Encontraron la referencia exacta que llevaba dos años buscando. Trato impecable y discreto.',
      en: 'They found the exact reference I had chased for two years. Impeccable, discreet dealing.',
    },
    author: 'A. Domínguez',
    location: 'El Paso, TX',
  },
  {
    id: 't2',
    quote: {
      es: 'Vendí mi Submariner sin dramas y a buen precio. La verificación me dio total confianza.',
      en: 'Sold my Submariner with zero drama and a fair price. The verification gave me total confidence.',
    },
    author: 'R. Carrillo',
    location: 'Cd. Juárez, MX',
  },
  {
    id: 't3',
    quote: {
      es: 'Hice trade de mi Datejust por un Daytona. Transparentes con la diferencia, cero presión.',
      en: 'Traded my Datejust toward a Daytona. Transparent on the difference, zero pressure.',
    },
    author: 'M. Treviño',
    location: 'El Paso, TX',
  },
]

export function noteFor(p: Piece, lang: Lang): string {
  return p.note[lang]
}
