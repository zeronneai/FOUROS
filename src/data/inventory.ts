export type PieceStatus = 'available' | 'sold'
export type Category = 'all' | 'rolex' | 'cartier' | 'new' | 'sold'

export interface Piece {
  id: string
  brand: string
  model: string
  ref?: string
  year?: string
  status: PieceStatus
  /** Tags drive the category filters (e.g. 'new' for New Arrivals). */
  tags: Category[]
  note: { es: string; en: string }
  image: string
  /** Asymmetric editorial weight. */
  span: 'tall' | 'wide' | 'regular'
}

// Replace /public/gallery/* with real Instagram photos (keep the filenames).
export const INVENTORY: Piece[] = [
  {
    id: 'rolex-datejust-41',
    brand: 'Rolex',
    model: 'Datejust 41',
    ref: 'Ref. 126334',
    year: '2022',
    status: 'available',
    tags: ['rolex', 'new'],
    note: { es: 'Esfera azul, jubilee. Full set.', en: 'Blue dial, jubilee. Full set.' },
    image: '/gallery/rolex-datejust-41.svg',
    span: 'tall',
  },
  {
    id: 'cartier-santos',
    brand: 'Cartier',
    model: 'Santos de Cartier',
    ref: 'Large model',
    year: '2023',
    status: 'available',
    tags: ['cartier', 'new'],
    note: { es: 'Acero. QuickSwitch. Como nuevo.', en: 'Steel. QuickSwitch. Like new.' },
    image: '/gallery/cartier-santos.svg',
    span: 'regular',
  },
  {
    id: 'rolex-submariner',
    brand: 'Rolex',
    model: 'Submariner Date',
    ref: 'Ref. 126610LN',
    year: '2021',
    status: 'available',
    tags: ['rolex'],
    note: { es: 'Cerámica negra. Sin pulir.', en: 'Black ceramic. Unpolished.' },
    image: '/gallery/rolex-submariner.svg',
    span: 'wide',
  },
  {
    id: 'patek-nautilus',
    brand: 'Patek Philippe',
    model: 'Nautilus 5711',
    ref: 'Ref. 5711/1A',
    year: '2019',
    status: 'sold',
    tags: ['sold'],
    note: { es: 'Pieza de colección.', en: 'Collector grade.' },
    image: '/gallery/patek-nautilus.svg',
    span: 'regular',
  },
  {
    id: 'ap-royal-oak',
    brand: 'Audemars Piguet',
    model: 'Royal Oak',
    ref: 'Ref. 15500ST',
    year: '2022',
    status: 'available',
    tags: ['new'],
    note: { es: 'Esfera azul tapisserie.', en: 'Blue tapisserie dial.' },
    image: '/gallery/ap-royal-oak.svg',
    span: 'tall',
  },
  {
    id: 'rolex-daytona',
    brand: 'Rolex',
    model: 'Cosmograph Daytona',
    ref: 'Ref. 116500LN',
    year: '2020',
    status: 'available',
    tags: ['rolex', 'new'],
    note: { es: 'Panda. Lista para entregar.', en: 'Panda. Ready to hand over.' },
    image: '/gallery/rolex-daytona.svg',
    span: 'regular',
  },
  {
    id: 'cartier-tank',
    brand: 'Cartier',
    model: 'Tank Must',
    ref: 'Large model',
    year: '2023',
    status: 'available',
    tags: ['cartier'],
    note: { es: 'Cuarzo. Correa de piel.', en: 'Quartz. Leather strap.' },
    image: '/gallery/cartier-tank.svg',
    span: 'regular',
  },
  {
    id: 'rolex-gmt',
    brand: 'Rolex',
    model: 'GMT-Master II',
    ref: 'Ref. 126710BLRO',
    year: '2021',
    status: 'sold',
    tags: ['rolex', 'sold'],
    note: { es: 'Pepsi. Jubilee.', en: 'Pepsi. Jubilee.' },
    image: '/gallery/rolex-gmt.svg',
    span: 'regular',
  },
  {
    id: 'omega-speedmaster',
    brand: 'Omega',
    model: 'Speedmaster Professional',
    ref: 'Moonwatch',
    year: '2020',
    status: 'sold',
    tags: ['sold'],
    note: { es: 'Hesalite. Caja y papeles.', en: 'Hesalite. Box & papers.' },
    image: '/gallery/omega-speedmaster.svg',
    span: 'wide',
  },
]

export interface Stat {
  value: number
  suffix?: string
  label: { es: string; en: string }
}

export const STATS: Stat[] = [
  { value: 8, suffix: '+', label: { es: 'Años de curaduría', en: 'Years curating' } },
  { value: 240, suffix: '+', label: { es: 'Piezas colocadas', en: 'Pieces placed' } },
  { value: 100, suffix: '%', label: { es: 'Autenticidad garantizada', en: 'Authenticity guaranteed' } },
  { value: 12, suffix: '', label: { es: 'Marcas en cartera', en: 'Brands in portfolio' } },
]

export const FILTERS: { key: Category; label: { es: string; en: string } }[] = [
  { key: 'all', label: { es: 'Todos', en: 'All' } },
  { key: 'rolex', label: { es: 'Rolex', en: 'Rolex' } },
  { key: 'cartier', label: { es: 'Cartier', en: 'Cartier' } },
  { key: 'new', label: { es: 'New Arrivals', en: 'New Arrivals' } },
  { key: 'sold', label: { es: 'SOLD', en: 'SOLD' } },
]
