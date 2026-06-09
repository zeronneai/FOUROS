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

// Small UI label set (section copy lives in the components themselves).
const UI = {
  es: {
    navInventory: 'Inventario',
    navContact: 'Contacto',
    reserve: 'Reservar pieza',
    viewInventory: 'Ver colección',
    available: 'Disponible',
    sold: 'SOLD',
    inquire: 'Consultar',
    consult: 'Consultar por WhatsApp',
  },
  en: {
    navInventory: 'Inventory',
    navContact: 'Contact',
    reserve: 'Reserve a piece',
    viewInventory: 'View collection',
    available: 'Available',
    sold: 'SOLD',
    inquire: 'Inquire',
    consult: 'Ask on WhatsApp',
  },
} as const

export type UILabels = (typeof UI)[Lang]

interface I18nContext {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: UILabels
}

const Ctx = createContext<I18nContext | null>(null)

function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'es'
  const stored = localStorage.getItem('fo_lang') as Lang | null
  if (stored === 'es' || stored === 'en') return stored
  // Border market (El Paso / Juárez): follow the browser, fall back to Spanish.
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
  const toggle = useCallback(() => setLangState((p) => (p === 'es' ? 'en' : 'es')), [])

  const value = useMemo<I18nContext>(
    () => ({ lang, setLang, toggle, t: UI[lang] }),
    [lang, setLang, toggle],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n(): I18nContext {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}
