import { useI18n, type Lang } from '../lib/i18n'

/** Minimal ES / EN switch — two glyphs divided by a hairline. */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useI18n()
  const langs: Lang[] = ['es', 'en']

  return (
    <div
      className={`flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.2em] ${className}`}
      role="group"
      aria-label="Language"
    >
      {langs.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="h-3 w-px bg-hairline" />}
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`transition-colors duration-300 ease-editorial ${
              lang === l
                ? 'text-gold-gradient'
                : 'text-muted hover:text-bone'
            }`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  )
}
