import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'es' | 'en'

type Dict = Record<string, { es: string; en: string }>

// Single source of truth for copy. Keys are dot-namespaced by section.
const DICT: Dict = {
  // Nav
  'nav.inventory': { es: 'Inventario', en: 'Inventory' },
  'nav.services': { es: 'Servicios', en: 'Services' },
  'nav.about': { es: 'Sobre', en: 'About' },
  'nav.contact': { es: 'Contacto', en: 'Contact' },
  'nav.cta': { es: 'Reservar pieza', en: 'Reserve a piece' },

  // Hero
  'hero.eyebrow': { es: 'Curaduría de relojes de lujo', en: 'Curated luxury timepieces' },
  'hero.title.a': { es: 'Turning Time', en: 'Turning Time' },
  'hero.title.b': { es: 'into Legacy', en: 'into Legacy' },
  'hero.subtitle': {
    es: 'Una selección discreta de piezas excepcionales. Buy · Sell · Trade — para coleccionistas que entienden el valor del tiempo bien guardado.',
    en: 'A discreet selection of exceptional pieces. Buy · Sell · Trade — for collectors who understand the value of time well kept.',
  },
  'hero.scroll': { es: 'Desliza', en: 'Scroll' },

  // Curaduría
  'curate.eyebrow': { es: 'La curaduría', en: 'The curation' },
  'curate.title': { es: 'Piezas recién llegadas', en: 'New arrivals' },
  'curate.intro': {
    es: 'Cada referencia es seleccionada a mano. Disponibilidad limitada; los precios se comparten en privado.',
    en: 'Every reference is hand-selected. Limited availability; prices are shared privately.',
  },
  'curate.price': { es: 'Precio bajo consulta', en: 'Price on request' },
  'curate.inquire': { es: 'Consultar pieza', en: 'Inquire' },

  // Manifiesto
  'manifesto.eyebrow': { es: 'Manifiesto', en: 'Manifesto' },
  'manifesto.body': {
    es: 'No vendemos relojes. Custodiamos legados — objetos que sobreviven a quien los porta y miden algo más que las horas.',
    en: 'We do not sell watches. We steward legacies — objects that outlive the wearer and measure more than hours.',
  },

  // Services
  'services.eyebrow': { es: 'Cómo trabajamos', en: 'How we work' },
  'services.title': { es: 'Buy · Sell · Trade', en: 'Buy · Sell · Trade' },
  'services.buy.title': { es: 'Adquirir', en: 'Buy' },
  'services.buy.body': {
    es: 'Te conseguimos la referencia exacta que buscas, verificada y lista para entregar. Acceso a piezas que no llegan al mercado abierto.',
    en: 'We source the exact reference you want — authenticated and ready to hand over. Access to pieces that never reach the open market.',
  },
  'services.sell.title': { es: 'Vender', en: 'Sell' },
  'services.sell.body': {
    es: 'Liquidez discreta por tu reloj, a su valor real de colección. Avalúo honesto, sin intermediarios ruidosos.',
    en: 'Discreet liquidity for your watch at its true collector value. Honest appraisal, no noisy middlemen.',
  },
  'services.trade.title': { es: 'Intercambiar', en: 'Trade' },
  'services.trade.body': {
    es: 'Haz evolucionar tu colección. Cambiamos tu pieza actual por la siguiente, ajustando la diferencia con transparencia.',
    en: 'Let your collection evolve. Trade your current piece toward the next, with the difference settled transparently.',
  },

  // Authenticity
  'auth.eyebrow': { es: 'Autenticidad', en: 'Authenticity' },
  'auth.title': { es: 'Verificada antes de cambiar de manos', en: 'Verified before it changes hands' },
  'auth.body': {
    es: 'Cada pieza pasa por un proceso de verificación riguroso. Procedencia, números de serie y movimiento — documentados.',
    en: 'Every piece passes a rigorous verification process. Provenance, serial numbers and movement — documented.',
  },
  'auth.step1.title': { es: 'Procedencia', en: 'Provenance' },
  'auth.step1.body': {
    es: 'Historial y documentación de origen revisados pieza por pieza.',
    en: 'History and origin documentation reviewed piece by piece.',
  },
  'auth.step2.title': { es: 'Inspección', en: 'Inspection' },
  'auth.step2.body': {
    es: 'Movimiento, referencia y serial examinados por especialistas.',
    en: 'Movement, reference and serial examined by specialists.',
  },
  'auth.step3.title': { es: 'Garantía', en: 'Guarantee' },
  'auth.step3.body': {
    es: 'Respaldo por escrito de autenticidad en cada transacción.',
    en: 'Written authenticity guarantee on every transaction.',
  },

  // Social proof
  'social.eyebrow': { es: 'Confianza', en: 'Trust' },
  'social.title': { es: 'Piezas que ya encontraron dueño', en: 'Pieces that found their owner' },
  'social.sold': { es: 'Vendido', en: 'Sold' },
  'social.testimonials': { es: 'Lo que dicen', en: 'In their words' },

  // Contact
  'contact.eyebrow': { es: 'El siguiente paso', en: 'The next step' },
  'contact.title': { es: 'Asegura tu próxima pieza', en: 'Secure your next piece' },
  'contact.body': {
    es: 'La mayoría de las piezas se reservan por mensaje directo. Escríbenos y conversamos en privado.',
    en: 'Most pieces are reserved by direct message. Write to us and we talk in private.',
  },
  'contact.whatsapp': { es: 'Escribir por WhatsApp', en: 'Message on WhatsApp' },
  'contact.instagram': { es: 'Seguir en Instagram', en: 'Follow on Instagram' },
  'contact.or': { es: 'o déjanos tus datos', en: 'or leave your details' },
  'contact.form.name': { es: 'Nombre', en: 'Name' },
  'contact.form.piece': { es: 'Pieza de interés', en: 'Piece of interest' },
  'contact.form.piece.placeholder': {
    es: 'Ej. Rolex Datejust 41, Cartier Santos…',
    en: 'e.g. Rolex Datejust 41, Cartier Santos…',
  },
  'contact.form.contact': { es: 'WhatsApp o correo', en: 'WhatsApp or email' },
  'contact.form.submit': { es: 'Enviar consulta', en: 'Send inquiry' },
  'contact.form.sending': { es: 'Enviando…', en: 'Sending…' },
  'contact.form.success': {
    es: 'Recibido. Te contactamos en breve.',
    en: 'Received. We will be in touch shortly.',
  },
  'contact.form.error': {
    es: 'Algo falló. Escríbenos directo por WhatsApp.',
    en: 'Something failed. Message us directly on WhatsApp.',
  },

  // Footer
  'footer.tagline': { es: 'Turning Time into Legacy', en: 'Turning Time into Legacy' },
  'footer.rights': { es: 'Todos los derechos reservados.', en: 'All rights reserved.' },
  'footer.disclaimer': {
    es: 'Distribuidor independiente. No afiliado a las marcas relojeras mencionadas.',
    en: 'Independent dealer. Not affiliated with the watch brands mentioned.',
  },
}

interface I18nContext {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: (key: keyof typeof DICT) => string
}

const Ctx = createContext<I18nContext | null>(null)

function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'es'
  const stored = localStorage.getItem('fo_lang') as Lang | null
  if (stored === 'es' || stored === 'en') return stored
  // Border market: default to browser, fall back to Spanish.
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es')

  useEffect(() => {
    setLangState(detectLang())
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('fo_lang', lang)
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const toggle = useCallback(
    () => setLangState((p) => (p === 'es' ? 'en' : 'es')),
    [],
  )
  const t = useCallback((key: keyof typeof DICT) => DICT[key]?.[lang] ?? String(key), [lang])

  const value = useMemo<I18nContext>(
    () => ({ lang, setLang, toggle, t }),
    [lang, setLang, toggle, t],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n(): I18nContext {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}
