export interface Piece {
  id: string
  brand: string
  /** Rolex only ("GMT-MASTER" | "SUBMARINER" | "DATEJUST" | "EXPLORER II"); null for other brands. */
  family: string | null
  name: string
  /** Renders as "REF. {ref}" when present. */
  ref: string | null
  /** Rendered verbatim (same style, no "REF." prefix) when ref is null. */
  refLabel: string | null
  description: string
  /** Base Cloudinary URL. Responsive f_auto,q_auto transforms applied at render (lib/cloudinary). */
  image: string
}

const CLD = 'https://res.cloudinary.com/dsprn0ew4/image/upload'

/**
 * Final grid order: grouped by family, ascending tier within each group,
 * other brands last. Do NOT re-sort.
 */
export const INVENTORY: Piece[] = [
  // ---- GMT-MASTER (Rolex) --------------------------------------------------
  {
    id: 'rolex-gmt-batman',
    brand: 'ROLEX',
    family: 'GMT-MASTER',
    name: "GMT-Master II 'Batman'",
    ref: '126710BLNR',
    refLabel: null,
    description:
      "The black-and-blue Cerachrom bezel that started the nickname. Two time zones, one of the most requested sports Rolex of the last decade, and it wears even better than it photographs. On the Oyster bracelet. Full set, box and papers.",
    image: `${CLD}/v1781129628/Using_the_reference_image__keep_202606101608_cpdre3.jpg`,
  },
  {
    id: 'rolex-gmt-116710ln',
    brand: 'ROLEX',
    family: 'GMT-MASTER',
    name: 'GMT-Master II',
    ref: '116710LN',
    refLabel: null,
    description:
      "All-black ceramic bezel with the signature green GMT hand. The discreet traveler, all the capability of the GMT without announcing itself. Increasingly hard to find this clean. Full set, box and papers.",
    image: `${CLD}/v1781129628/Using_the_reference_image__keep_202606101606_hmcuzs.jpg`,
  },
  {
    id: 'rolex-gmt-root-beer',
    brand: 'ROLEX',
    family: 'GMT-MASTER',
    name: "GMT-Master II 'Root Beer'",
    ref: '126711CHNR',
    refLabel: null,
    description:
      "Everose gold and steel with the brown and black ceramic bezel that earned the Root Beer name back in the seventies. The only GMT that pulls off warm tones, and the rose gold on the 24-hour hand is a detail Rolex did not have to do. Travel watch that works as a dress watch, which almost nothing else manages. Full set, box and papers.",
    image: `${CLD}/v1785514274/Hand_holding_luxury_watch_2K_202607311008_kvwmfp.jpg`,
  },
  {
    id: 'rolex-gmt-vintage',
    brand: 'ROLEX',
    family: 'GMT-MASTER',
    name: 'GMT-Master Vintage',
    ref: null,
    refLabel: 'GMT-MASTER · TWO-TONE · VINTAGE',
    description:
      "Vintage two-tone GMT with the original box, papers, and hangtags still with it. Modern Rolex is easy to find. Correct vintage Rolex with its full paperwork is a different hunt entirely, and this is the piece that proves what we can source. Warm patina, honest wear, everything documented. For the collector who cares where a watch has been, not just what it costs.",
    image: `${CLD}/v1785514272/Hand_holding_vintage_Rolex_watch_202607310945_f3kdxd.jpg`,
  },

  // ---- SUBMARINER (Rolex) --------------------------------------------------
  {
    id: 'rolex-submariner-116610ln',
    brand: 'ROLEX',
    family: 'SUBMARINER',
    name: 'Submariner Date',
    ref: '116610LN',
    refLabel: null,
    description:
      "The Submariner everyone pictures when they hear the word. Black ceramic bezel, black dial, Oyster bracelet, nothing extra. The previous generation case, which a lot of collectors quietly prefer to the current one. This is the safest watch you will ever buy and the one you will still be wearing in twenty years. Full set, box and papers, with card.",
    image: `${CLD}/v1785514273/Hand_holding_luxury_watch_2K_202607310949_ytekyw.jpg`,
  },
  {
    id: 'rolex-submariner-starbucks',
    brand: 'ROLEX',
    family: 'SUBMARINER',
    name: "Submariner Date 'Starbucks'",
    ref: '126610LV',
    refLabel: null,
    description:
      "Green ceramic bezel over black dial, the modern successor to the Hulk and Kermit lineage. The sports Rolex everyone asks about, in the configuration collectors chase. Full set, box and papers.",
    image: `${CLD}/v1781129627/Using_the_reference_image__keep_202606101602_gyy29d.jpg`,
  },
  {
    id: 'rolex-submariner-hulk',
    brand: 'ROLEX',
    family: 'SUBMARINER',
    name: "Submariner Date 'Hulk'",
    ref: '116610LV',
    refLabel: null,
    description:
      "Discontinued, and the market noticed immediately. Green sunburst dial and matching green ceramic bezel, the only Submariner Rolex ever made this way. The Starbucks that replaced it kept the green bezel but went back to a black dial, which is why the Hulk keeps climbing. If you have been waiting on this one, they do not get easier to find. Full set, box and papers.",
    image: `${CLD}/v1785514273/Hand_holding_luxury_watch_2K_202607310953_ffglup.jpg`,
  },
  {
    id: 'rolex-submariner-bluesy',
    brand: 'ROLEX',
    family: 'SUBMARINER',
    name: "Submariner Date Two-Tone 'Bluesy'",
    ref: '126613LB',
    refLabel: null,
    description:
      "Steel and yellow gold with the royal blue dial and bezel. The Bluesy doesn't whisper. It's the Submariner for someone who's earned it and wants you to know. Iconic for a reason. Full set, box and papers.",
    image: `${CLD}/v1781129628/Using_the_reference_image__keep_202606101612_rl9pbg.jpg`,
  },
  {
    id: 'rolex-submariner-yellow-gold',
    brand: 'ROLEX',
    family: 'SUBMARINER',
    name: 'Submariner Date Yellow Gold',
    ref: '116618LB',
    refLabel: null,
    description:
      "Solid 18k yellow gold, blue dial, blue ceramic bezel. This is the top of the Submariner line and it does not whisper. Heavy on the wrist in the way gold is supposed to be, and the blue keeps it from ever looking costume. For the client who has done the steel sports watches and is ready for the one that ends the conversation. Full set, box and papers.",
    image: `${CLD}/v1785514272/Hand_holding_gold_watch_2K_202607310957_tkyoi9.jpg`,
  },

  // ---- DATEJUST (Rolex) ----------------------------------------------------
  {
    id: 'rolex-datejust-36-blue',
    brand: 'ROLEX',
    family: 'DATEJUST',
    name: 'Datejust 36 Blue',
    ref: '116234',
    refLabel: null,
    description:
      "Sunburst blue dial, white gold fluted bezel, jubilee bracelet. The classic that works with a suit on Monday and a t-shirt on Saturday. If you only own one Rolex, this is the argument. Full set, box and papers.",
    image: `${CLD}/v1781129628/Using_the_reference_image__keep_202606101607_xp1s83.jpg`,
  },
  {
    id: 'rolex-datejust-41-black',
    brand: 'ROLEX',
    family: 'DATEJUST',
    name: 'Datejust 41 Black',
    ref: '126300',
    refLabel: null,
    description:
      "Smooth bezel, black dial, Oyster bracelet. The most understated way to wear a Rolex, pure proportions, zero noise. Modern 41mm presence without the flash. Full set, box and papers.",
    image: `${CLD}/v1781129627/Using_the_reference_image__keep_202606101605_ywfzbk.jpg`,
  },
  {
    id: 'rolex-datejust-41-silver',
    brand: 'ROLEX',
    family: 'DATEJUST',
    name: 'Datejust 41 Silver',
    ref: '126334',
    refLabel: null,
    description:
      "Silver sunburst dial, fluted bezel, jubilee bracelet. Light plays on this dial like nothing else in the lineup. The Datejust formula at its most luminous. Full set, box and papers.",
    image: `${CLD}/v1781129628/Using_the_reference_image__keep_202606101602_1_put9d5.jpg`,
  },
  {
    id: 'rolex-datejust-41-bruce-wayne',
    brand: 'ROLEX',
    family: 'DATEJUST',
    name: "Datejust 41 'Bruce Wayne'",
    ref: '126334',
    refLabel: null,
    description:
      "The one collectors call the Bruce Wayne, and the nickname stuck for a reason. Slate grey dial, fluted white gold bezel, Jubilee bracelet. It reads black across a room and turns silver-grey when you actually look at it. The most understated 41 in the lineup and the one that quietly gets the most compliments. Complete set.",
    image: `${CLD}/v1785514272/Hand_holding_luxury_watch_2K_202607311007_r5empm.jpg`,
  },
  {
    id: 'rolex-datejust-41-green-motif',
    brand: 'ROLEX',
    family: 'DATEJUST',
    name: "Datejust 41 'Green Motif'",
    ref: '126334',
    refLabel: null,
    description:
      "Discontinued green motif dial, the one with the crown pattern repeating across the face that you only catch when the light moves. Fluted white gold bezel, Jubilee bracelet, 41mm. Rolex killed this dial and the used market has been quietly absorbing every clean one since. Green Rolex without buying a sports model. Complete set.",
    image: `${CLD}/v1785514272/Hand_holding_luxury_watch_2K_202607311006_yl4o1m.jpg`,
  },
  {
    id: 'rolex-datejust-41-everose',
    brand: 'ROLEX',
    family: 'DATEJUST',
    name: 'Datejust 41 Everose',
    ref: '126331',
    refLabel: null,
    description:
      "Everose gold and steel with the sundust dial, which is Rolex's word for a rose-champagne sunburst that changes with every angle. Fluted Everose bezel, Jubilee bracelet, 41mm. Rose gold is the tone that reads expensive without reading flashy, and this is the cleanest execution of it Rolex makes. Complete set.",
    image: `${CLD}/v1785514274/Hand_holding_luxury_watch_2K_202607311010_t2ps4m.jpg`,
  },

  // ---- EXPLORER II (Rolex) -------------------------------------------------
  {
    id: 'rolex-explorer-ii',
    brand: 'ROLEX',
    family: 'EXPLORER II',
    name: 'Explorer II',
    ref: '216570',
    refLabel: null,
    description:
      "42mm of pure tool watch, with the orange 24-hour hand that has been its signature since 1971. Built for cave explorers who lose track of whether it is day or night, which almost nobody needs and everybody wants. On orange rubber it turns into a completely different watch, lighter and sportier than anything else in the case. Full set, box and papers.",
    image: `${CLD}/v1785514272/Hand_holding_watch_2K_202607310958_jlmrjy.jpg`,
  },

  // ---- OTHER BRANDS --------------------------------------------------------
  {
    id: 'ap-royal-oak-offshore',
    brand: 'AUDEMARS PIGUET',
    family: null,
    name: 'Royal Oak Offshore Chronograph',
    ref: null,
    refLabel: 'ROYAL OAK OFFSHORE CHRONOGRAPH · 42MM',
    description:
      "The watch that made oversized sports luxury a category. Octagonal bezel, eight screws, the Mega Tapisserie dial that nothing else copies convincingly. This is the piece for the client who already owns the Rolexes and wants something with actual presence on the wrist. Rubber strap, so it wears heavy and sporty the way it was meant to. Complete set.",
    image: `${CLD}/v1785514272/Hand_holding_luxury_watch_2K_202607310944_1_zb30b3.jpg`,
  },
  {
    id: 'hublot-big-bang-unico',
    brand: 'HUBLOT',
    family: null,
    name: 'Big Bang Unico 44mm',
    ref: '411.HX.1170.RX',
    refLabel: null,
    description:
      "Full white ceramic case with skeleton chronograph dial, one of the cleanest and most unique setups Hublot makes. If you're tired of the same Rolex everyone has and want something that actually stands out, this is it. Lightweight, bold, and insane on wrist for the summer. Complete set, box, watch, papers, all included.",
    image: `${CLD}/v1781129629/Using_the_reference_image__keep_202606101609_oxg9ih.jpg`,
  },
  {
    id: 'omega-aqua-terra',
    brand: 'OMEGA',
    family: null,
    name: 'Seamaster Aqua Terra 41mm',
    ref: null,
    refLabel: 'SEAMASTER AQUA TERRA 150M · 41MM',
    description:
      "The Rolex alternative that people who actually know watches respect. Sunburst blue teak dial, co-axial master chronometer movement, and antimagnetic to 15,000 gauss, which is a number nobody else is putting up. Dresses up, swims, and doesn't announce itself in a room. If you want something nobody else at the table is wearing, start here. Full set, box and papers.",
    image: `${CLD}/v1785514273/Hand_holding_luxury_watch_2K_202607310944_rikrkd.jpg`,
  },
  {
    id: 'swatch-royal-pop-green',
    brand: 'SWATCH',
    family: null,
    name: 'Royal Pop Green',
    ref: null,
    refLabel: null,
    description:
      "Skeleton dial, octagonal bezel, full green pop. A collector's wink, serious watchmaking references at a price that lets you actually have fun with it. Conversation starter guaranteed. Complete set.",
    image: `${CLD}/v1781129627/Using_the_reference_image__keep_202606101603_zddlsx.jpg`,
  },
  {
    id: 'seiko-mod-zombie',
    brand: 'SEIKO',
    family: null,
    name: "Seiko Mod 'Zombie'",
    ref: null,
    refLabel: 'CUSTOM MOD · DIVER',
    description:
      "A custom Seiko mod built to be loud on purpose. Green lume that eats the dark, two-tone case, dive bezel. Not a Rolex and not pretending to be one, which is exactly the point. This is the one you wear to the lake, hand to your kid, or take on a trip where a five-figure watch stays home. Every collection needs one of these.",
    image: `${CLD}/v1785514273/Hand_holding_luxury_watch_2K_202607310947_xjikxc.jpg`,
  },
]

// ---- Two-level filters -----------------------------------------------------

/** Level 1, always visible. */
export const BRAND_FILTERS = [
  'ALL',
  'ROLEX',
  'OMEGA',
  'AUDEMARS PIGUET',
  'HUBLOT',
  'SEIKO',
  'SWATCH',
] as const
export type BrandFilter = (typeof BRAND_FILTERS)[number]

/** Level 2, only rendered while ROLEX is the active level-1 filter. */
export const ROLEX_FAMILY_FILTERS = [
  'ALL',
  'GMT-MASTER',
  'SUBMARINER',
  'DATEJUST',
  'EXPLORER II',
] as const
export type FamilyFilter = (typeof ROLEX_FAMILY_FILTERS)[number]

export function matchesFilters(piece: Piece, brand: BrandFilter, family: FamilyFilter): boolean {
  if (brand !== 'ALL' && piece.brand !== brand) return false
  if (brand === 'ROLEX' && family !== 'ALL' && piece.family !== family) return false
  return true
}

// ---- Stats (unchanged) -----------------------------------------------------

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
