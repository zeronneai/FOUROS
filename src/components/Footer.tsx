import { useI18n } from '../lib/i18n'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, whatsappLink } from '../lib/site'
import { Monogram } from './primitives'

const NAV = [
  { key: 'nav.inventory', href: '#inventario' },
  { key: 'nav.services', href: '#servicios' },
  { key: 'nav.about', href: '#manifiesto' },
  { key: 'nav.contact', href: '#contacto' },
] as const

export function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-hairline bg-ink">
      <div className="container-editorial py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <Monogram size={40} />
              <span className="font-display text-lg font-semibold tracking-tightest text-bone">
                Four O&rsquo;s <span className="text-muted">Timepieces</span>
              </span>
            </div>
            <p className="mt-5 max-w-xs font-display text-xl italic tracking-tightest text-gold-gradient">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Nav */}
          <nav className="md:col-span-3">
            <p className="eyebrow mb-5">{t('nav.services')}</p>
            <ul className="flex flex-col gap-3">
              {NAV.map((l) => (
                <li key={l.key}>
                  <a
                    href={l.href}
                    className="link-underline font-body text-[14px] tracking-tighter text-muted hover:text-bone"
                  >
                    {t(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="md:col-span-4">
            <p className="eyebrow mb-5">{t('nav.contact')}</p>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline font-body text-[14px] tracking-tighter text-muted hover:text-bone"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline font-body text-[14px] tracking-tighter text-muted hover:text-bone"
                >
                  @{INSTAGRAM_HANDLE}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[11px] tracking-tighter text-muted">
            &copy; {year} Four O&rsquo;s Timepieces. {t('footer.rights')}
          </p>
          <p className="max-w-md font-body text-[11px] leading-relaxed tracking-tighter text-muted/70">
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  )
}
