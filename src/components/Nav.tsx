import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import { useScrolled } from '../hooks/useScrolled'
import { whatsappLink } from '../lib/site'
import { Monogram } from './primitives'
import { LanguageToggle } from './LanguageToggle'
import { EASE_EDITORIAL } from '../lib/motion'

const LINKS = [
  { key: 'nav.inventory', href: '#inventario' },
  { key: 'nav.services', href: '#servicios' },
  { key: 'nav.about', href: '#manifiesto' },
  { key: 'nav.contact', href: '#contacto' },
] as const

export function Nav() {
  const { t } = useI18n()
  const scrolled = useScrolled(24)
  const [open, setOpen] = useState(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-editorial ${
        scrolled
          ? 'border-b border-hairline bg-ink/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-editorial flex h-[68px] items-center justify-between">
        {/* Brand */}
        <a href="#top" className="flex items-center gap-3" aria-label="Four O's Timepieces">
          <Monogram size={34} />
          <span className="hidden font-display text-[15px] font-semibold tracking-tightest text-bone sm:block">
            Four O&rsquo;s <span className="text-muted">Timepieces</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="link-underline font-body text-[13px] tracking-tighter text-muted transition-colors duration-300 hover:text-bone"
            >
              {t(l.key)}
            </a>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-5">
          <LanguageToggle className="hidden sm:flex" />
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="hidden border border-gold/40 px-4 py-2 font-body text-[12px] uppercase tracking-[0.18em] text-bone transition-colors duration-300 ease-editorial hover:border-gold hover:text-gold-light sm:inline-block"
          >
            {t('nav.cta')}
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-bone transition-transform duration-300 ease-editorial ${
                  open ? 'translate-y-[5px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-bone transition-transform duration-300 ease-editorial ${
                  open ? '-translate-y-[5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
            className="overflow-hidden border-t border-hairline bg-ink/95 backdrop-blur-md md:hidden"
          >
            <div className="container-editorial flex flex-col gap-1 py-6">
              {LINKS.map((l) => (
                <a
                  key={l.key}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-hairline py-3 font-display text-xl tracking-tightest text-bone"
                >
                  {t(l.key)}
                </a>
              ))}
              <div className="flex items-center justify-between pt-5">
                <LanguageToggle />
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-gold/40 px-4 py-2 font-body text-[12px] uppercase tracking-[0.18em] text-gold-light"
                >
                  {t('nav.cta')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
