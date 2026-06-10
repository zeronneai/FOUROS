export type PieceStatus = 'available' | 'sold'
export type Category = 'all' | 'rolex' | 'other'

export interface Piece {
  id: string
  brand: string
  model: string
  ref?: string
  description: string
  status: PieceStatus
  /** Base Cloudinary image URL (4:5). Responsive transforms applied at render. */
  image: string
}

const CLD = 'https://res.cloudinary.com/dsprn0ew4/image/upload'

export const INVENTORY: Piece[] = [
  {
    id: 'rolex-gmt-batman',
    brand: 'Rolex',
    model: "GMT-Master II 'Batman'",
    ref: '126710BLNR',
    description:
      "The black-and-blue Cerachrom bezel that started the nickname. Two time zones, one of the most requested sports Rolex of the last decade, and it wears even better than it photographs. On the Oyster bracelet. Full set, box and papers.",
    status: 'available',
    image: `${CLD}/v1781129628/Using_the_reference_image__keep_202606101608_cpdre3.jpg`,
  },
  {
    id: 'rolex-datejust-36-blue',
    brand: 'Rolex',
    model: 'Datejust 36 Blue',
    ref: '116234',
    description:
      "Sunburst blue dial, white gold fluted bezel, jubilee bracelet. The classic that works with a suit on Monday and a t-shirt on Saturday. If you only own one Rolex, this is the argument. Full set, box and papers.",
    status: 'available',
    image: `${CLD}/v1781129628/Using_the_reference_image__keep_202606101607_xp1s83.jpg`,
  },
  {
    id: 'rolex-gmt-116710ln',
    brand: 'Rolex',
    model: 'GMT-Master II',
    ref: '116710LN',
    description:
      "All-black ceramic bezel with the signature green GMT hand. The discreet traveler, all the capability of the GMT without announcing itself. Increasingly hard to find this clean. Full set, box and papers.",
    status: 'available',
    image: `${CLD}/v1781129628/Using_the_reference_image__keep_202606101606_hmcuzs.jpg`,
  },
  {
    id: 'rolex-datejust-41-black',
    brand: 'Rolex',
    model: 'Datejust 41 Black',
    ref: '126300',
    description:
      "Smooth bezel, black dial, Oyster bracelet. The most understated way to wear a Rolex, pure proportions, zero noise. Modern 41mm presence without the flash. Full set, box and papers.",
    status: 'available',
    image: `${CLD}/v1781129627/Using_the_reference_image__keep_202606101605_ywfzbk.jpg`,
  },
  {
    id: 'swatch-royal-pop-green',
    brand: 'Swatch',
    model: 'Royal Pop Green',
    description:
      "Skeleton dial, octagonal bezel, full green pop. A collector's wink, serious watchmaking references at a price that lets you actually have fun with it. Conversation starter guaranteed. Complete set.",
    status: 'available',
    image: `${CLD}/v1781129627/Using_the_reference_image__keep_202606101603_zddlsx.jpg`,
  },
  {
    id: 'rolex-datejust-41-silver',
    brand: 'Rolex',
    model: 'Datejust 41 Silver',
    ref: '126334',
    description:
      "Silver sunburst dial, fluted bezel, jubilee bracelet. Light plays on this dial like nothing else in the lineup. The Datejust formula at its most luminous. Full set, box and papers.",
    status: 'available',
    image: `${CLD}/v1781129628/Using_the_reference_image__keep_202606101602_1_put9d5.jpg`,
  },
  {
    id: 'rolex-submariner-starbucks',
    brand: 'Rolex',
    model: "Submariner Date 'Starbucks'",
    ref: '126610LV',
    description:
      "Green ceramic bezel over black dial, the modern successor to the Hulk and Kermit lineage. The sports Rolex everyone asks about, in the configuration collectors chase. Full set, box and papers.",
    status: 'available',
    image: `${CLD}/v1781129627/Using_the_reference_image__keep_202606101602_gyy29d.jpg`,
  },
  {
    id: 'rolex-submariner-bluesy',
    brand: 'Rolex',
    model: "Submariner Date Two-Tone 'Bluesy'",
    ref: '126613LB',
    description:
      "Steel and yellow gold with the royal blue dial and bezel. The Bluesy doesn't whisper. It's the Submariner for someone who's earned it and wants you to know. Iconic for a reason. Full set, box and papers.",
    status: 'available',
    image: `${CLD}/v1781129628/Using_the_reference_image__keep_202606101612_rl9pbg.jpg`,
  },
  {
    id: 'hublot-big-bang-unico',
    brand: 'Hublot',
    model: 'Big Bang Unico 44mm',
    ref: '411.HX.1170.RX',
    description:
      "Full white ceramic case with skeleton chronograph dial, one of the cleanest and most unique setups Hublot makes. If you're tired of the same Rolex everyone has and want something that actually stands out, this is it. Lightweight, bold, and insane on wrist for the summer. Complete set, box, watch, papers, all included.",
    status: 'available',
    image: `${CLD}/v1781129629/Using_the_reference_image__keep_202606101609_oxg9ih.jpg`,
  },
]

/** Brand-based filters. "Other Brands" is everything that is not Rolex. */
export const FILTERS: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'rolex', label: 'Rolex' },
  { key: 'other', label: 'Other Brands' },
]

export function matchesFilter(piece: Piece, key: Category): boolean {
  if (key === 'all') return true
  if (key === 'rolex') return piece.brand === 'Rolex'
  return piece.brand !== 'Rolex'
}

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
