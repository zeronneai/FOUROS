import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { whatsappLink } from '@/lib/site'
import { Monogram } from '@/components/primitives'
import { LanguageToggle } from '@/components/LanguageToggle'

export function Nav({ revealed = true }: { revealed?: boolean }) {
  const { lang, t } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#top', label: lang === 'es' ? 'Curaduría' : 'Curation' },
    { href: '#galeria', label: lang === 'es' ? 'Colección' : 'Collection' },
    { href: '#contacto', label: t.navContact },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-[transform,opacity,background-color,border-color] duration-700 ease-out ${
        revealed ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'
      } ${
        scrolled ? 'border-b border-hairline bg-ink/80 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-editorial flex h-[64px] items-center justify-between">
        <a href="#top" className="flex items-center gap-3" aria-label="Four O's Timepieces" onClick={() => setOpen(false)}>
          <Monogram size={32} />
          <span className="hidden font-display text-sm font-semibold tracking-tightest text-bone sm:block">
            Four O&rsquo;s <span className="text-muted">Timepieces</span>
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link-underline font-body text-[12px] uppercase tracking-[0.2em] text-muted transition-colors duration-300 hover:text-bone"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <LanguageToggle />
          <a
            href={whatsappLink(lang === 'es' ? 'Hola, me gustaría reservar una pieza.' : "Hi, I'd like to reserve a piece.")}
            target="_blank"
            rel="noreferrer"
            className="hidden border border-gold/40 px-4 py-2 font-body text-[11px] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-gold hover:text-gold-light sm:inline-block"
          >
            {t.reserve}
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-px w-full bg-bone transition-transform duration-300 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`absolute bottom-0 left-0 h-px w-full bg-bone transition-transform duration-300 ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`overflow-hidden border-t border-hairline bg-ink/95 backdrop-blur-md transition-[max-height,opacity] duration-400 md:hidden ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-editorial flex flex-col py-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-hairline py-3 font-display text-xl tracking-tightest text-bone"
            >
              {l.label}
            </a>
          ))}
          <a
            href={whatsappLink(lang === 'es' ? 'Hola, me gustaría reservar una pieza.' : "Hi, I'd like to reserve a piece.")}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="mt-4 inline-block w-fit border border-gold/40 px-5 py-2.5 font-body text-[11px] uppercase tracking-[0.18em] text-gold-light"
          >
            {t.reserve}
          </a>
        </div>
      </div>
    </header>
  )
}
