import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

/**
 * Always-present, subtle "View collection" cue. It keeps the cinematic intro
 * clean (no nav, no other buttons) while still inviting the visitor to scroll
 * through the whole page. The "scroll to explore" hint shows during the intro
 * and fades once the cinematic is done; the pill itself stays at all times.
 */
export function ScrollCue({ revealed = false }: { revealed?: boolean }) {
  const { lang, t } = useI18n()
  const hint = lang === 'es' ? 'Desliza para explorar' : 'Scroll to explore'

  return (
    <a
      href="#galeria"
      className="group fixed bottom-6 left-1/2 z-[55] flex -translate-x-1/2 flex-col items-center gap-2.5"
      aria-label={t.viewInventory}
    >
      <span
        className={`eyebrow text-[10px] text-muted transition-opacity duration-500 group-hover:text-bone ${
          revealed ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {hint}
      </span>
      <span className="flex items-center gap-2 border border-gold/30 bg-ink/40 px-4 py-2 font-body text-[11px] uppercase tracking-[0.2em] text-bone/90 backdrop-blur-md transition-colors duration-300 group-hover:border-gold group-hover:text-gold-light">
        {t.viewInventory}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-500 ${
            revealed ? '' : 'motion-safe:animate-nudge'
          }`}
          aria-hidden="true"
        />
      </span>
    </a>
  )
}
