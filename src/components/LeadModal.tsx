import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Loader2, X } from 'lucide-react'
import { INSTAGRAM_DM_URL } from '@/lib/site'
import { isEmail, isPhone, onOpenLeadModal, submitLead } from '@/lib/leads'
import { InstagramGlyph } from '@/components/icons'
import { cn } from '@/lib/utils'

const SEEN_KEY = 'fouros_lead_modal_seen'
const SEEN_DAYS = 7
const AUTO_OPEN_MS = 4000
const SCROLL_IDLE_MS = 1500

const PIECE_CHIPS = [
  'Rolex Submariner',
  'GMT-Master II',
  'Datejust',
  'Daytona',
  'Audemars Piguet',
  'Patek Philippe',
]
const BUDGETS = ['Under $10K', '$10K to $20K', '$20K to $50K', '$50K+', 'Prefer to discuss']
const STAGES = [
  'My first luxury watch',
  'Building my collection',
  'Seasoned collector',
  'Looking to sell or trade',
]

type Step = 0 | 1 | 2 | 3 | 'done'

function wasSeenRecently(): boolean {
  try {
    const v = localStorage.getItem(SEEN_KEY)
    if (!v) return false
    return Date.now() - Number(v) < SEEN_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, String(Date.now()))
  } catch {
    /* storage blocked: the session flag below still prevents repeats */
  }
}

let shownThisSession = false

export function LeadModal() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false) // drives enter/exit transition
  const [step, setStep] = useState<Step>(0)
  const [source, setSource] = useState('popup')

  const [dreamPiece, setDreamPiece] = useState('')
  const [budget, setBudget] = useState('')
  const [stage, setStage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('') // honeypot

  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  const show = useCallback((src: string) => {
    lastFocus.current = document.activeElement as HTMLElement | null
    shownThisSession = true
    setSource(src)
    setOpen(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }, [])

  const close = useCallback(() => {
    markSeen()
    setVisible(false)
    window.setTimeout(() => {
      setOpen(false)
      lastFocus.current?.focus?.()
    }, 450)
  }, [])

  // Auto-open: after a few seconds, but only while the user is not mid-scroll,
  // so the cinematic hero is never interrupted.
  useEffect(() => {
    if (wasSeenRecently() || shownThisSession) return
    let lastScroll = 0
    let timer = 0
    const onScroll = () => {
      lastScroll = Date.now()
    }
    const tryOpen = () => {
      if (shownThisSession) return
      if (Date.now() - lastScroll < SCROLL_IDLE_MS) {
        timer = window.setTimeout(tryOpen, 500)
        return
      }
      show('popup')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    timer = window.setTimeout(tryOpen, AUTO_OPEN_MS)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [show])

  // Manual triggers (nav, gallery)
  useEffect(() => onOpenLeadModal((src) => show(src)), [show])

  // Scroll lock, ESC, focus trap
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab' && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([tabindex="-1"]), a[href]',
        )
        if (!nodes.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    const id = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('input, button')?.focus(), 500)
    return () => {
      document.documentElement.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(id)
    }
  }, [open, close])

  // Success screen auto-closes
  useEffect(() => {
    if (step !== 'done') return
    const id = window.setTimeout(close, 9000)
    return () => window.clearTimeout(id)
  }, [step, close])

  const canNext =
    (step === 0 && dreamPiece.trim().length > 0) || (step === 1 && !!budget) || (step === 2 && !!stage)

  const next = () => {
    setError('')
    if (step === 0 || step === 1 || step === 2) setStep((step + 1) as Step)
  }
  const back = () => {
    setError('')
    setFailed(false)
    if (step === 1 || step === 2 || step === 3) setStep((step - 1) as Step)
  }

  const submit = async () => {
    setFailed(false)
    const emailOk = isEmail(email)
    const phoneOk = isPhone(phone)
    if (!email.trim() && !phone.trim()) return setError('Leave an email, a phone, or both.')
    if (email.trim() && !emailOk) return setError('That email does not look right.')
    if (phone.trim() && !phoneOk) return setError('That phone number looks too short.')
    setError('')
    setSending(true)
    const res = await submitLead({
      name: name.trim(),
      email: emailOk ? email.trim() : '',
      phone: phoneOk ? phone.trim() : '',
      dreamPiece: dreamPiece.trim() || 'Open to suggestions',
      budget,
      stage,
      page: window.location.pathname,
      source,
      website,
    })
    setSending(false)
    if (res.ok) {
      markSeen()
      setStep('done')
    } else {
      setFailed(true)
    }
  }

  if (!open) return null

  const stepIndex = step === 'done' ? 4 : step

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-ink/75 backdrop-blur-sm transition-opacity duration-500 ease-editorial',
          visible ? 'opacity-100' : 'opacity-0',
        )}
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          'relative w-full max-w-[560px] border border-hairline bg-charcoal shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]',
          'max-h-[92svh] overflow-y-auto no-scrollbar',
          'transition-[transform,opacity,filter] duration-[650ms] ease-editorial motion-reduce:transition-opacity',
          visible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[3px]',
        )}
      >
        {/* Progress line */}
        <div className="h-px w-full bg-hairline">
          <div
            className="h-px bg-gold-line transition-[width] duration-700 ease-editorial"
            style={{ width: `${(stepIndex / 4) * 100}%` }}
          />
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-bone"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <div className="px-6 pb-7 pt-9 sm:px-10 sm:pb-10 sm:pt-12">
          {step !== 'done' && (
            <>
              <span className="eyebrow text-gold-gradient">Private concierge</span>
              <h2
                id="lead-modal-title"
                className="mt-3 font-display text-[2rem] font-semibold leading-[1.1] tracking-tightest text-bone sm:text-[2.5rem]"
              >
                Find your next piece.
              </h2>
              <p className="mt-3 max-w-sm font-body text-[15px] leading-relaxed text-muted">
                Tell us what you are after. Edward will personally reach out with options.
              </p>
              <div className="hairline my-7" />
              <p className="eyebrow mb-4">
                {String(stepIndex + 1).padStart(2, '0')} / 04
              </p>
            </>
          )}

          {/* Step 1: dream piece */}
          {step === 0 && (
            <div key="s0" className="lead-step">
              <label htmlFor="lead-piece" className="font-display text-xl tracking-tightest text-bone">
                What is your dream piece?
              </label>
              <input
                id="lead-piece"
                value={dreamPiece}
                onChange={(e) => setDreamPiece(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canNext && next()}
                placeholder="e.g. Submariner Starbucks, Royal Oak, Nautilus"
                className="lead-input mt-4"
                autoComplete="off"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {PIECE_CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDreamPiece(c)}
                    className={cn('lead-chip', dreamPiece === c && 'lead-chip-on')}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: budget */}
          {step === 1 && (
            <div key="s1" className="lead-step">
              <p className="font-display text-xl tracking-tightest text-bone">What is your current budget?</p>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {BUDGETS.map((b) => (
                  <OptionCard key={b} label={b} selected={budget === b} onSelect={() => setBudget(b)} />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: collector stage */}
          {step === 2 && (
            <div key="s2" className="lead-step">
              <p className="font-display text-xl tracking-tightest text-bone">Where are you in your collection?</p>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {STAGES.map((s) => (
                  <OptionCard key={s} label={s} selected={stage === s} onSelect={() => setStage(s)} />
                ))}
              </div>
            </div>
          )}

          {/* Step 4: contact */}
          {step === 3 && (
            <div key="s3" className="lead-step">
              <p className="font-display text-xl tracking-tightest text-bone">How can we reach you?</p>
              <p className="mt-1 font-body text-[13px] text-muted">Email, phone, or both.</p>
              <div className="mt-5 space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name (optional)"
                  autoComplete="name"
                  className="lead-input"
                />
                <input
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  autoComplete="email"
                  className="lead-input"
                />
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                  placeholder="Phone"
                  autoComplete="tel"
                  className="lead-input"
                />
                {/* Honeypot: hidden from humans */}
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />
              </div>
              {error && <p className="mt-3 font-body text-[13px] text-gold-light">{error}</p>}
              {failed && (
                <p className="mt-3 font-body text-[13px] text-gold-light">
                  Something went wrong.{' '}
                  <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="underline">
                    Send us a DM instead
                  </a>
                  .
                </p>
              )}
            </div>
          )}

          {/* Success */}
          {step === 'done' && (
            <div className="lead-step py-4 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center border border-gold/50">
                <Check className="h-6 w-6 text-gold-light" strokeWidth={1.5} />
              </span>
              <h2 id="lead-modal-title" className="mt-6 font-display text-[2.5rem] font-semibold tracking-tightest text-bone">
                Noted.
              </h2>
              <p className="mx-auto mt-3 max-w-xs font-body text-[15px] leading-relaxed text-muted">
                Edward will reach out shortly. Meanwhile, see what just arrived.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="cta-gold">
                  <InstagramGlyph className="h-3.5 w-3.5" />
                  Send DM
                </a>
                <button type="button" onClick={close} className="cta-ghost">
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Footer nav */}
          {step !== 'done' && (
            <div className="mt-8 flex items-center justify-between gap-3">
              {step === 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setDreamPiece('Open to suggestions')
                    setStep(1)
                  }}
                  className="min-h-[44px] font-body text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-bone"
                >
                  Not sure yet
                </button>
              ) : (
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex min-h-[44px] items-center gap-2 font-body text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-bone"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
              )}

              {step === 3 ? (
                <button type="button" onClick={submit} disabled={sending} className="cta-gold min-h-[44px] disabled:opacity-60">
                  {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  {sending ? 'Sending' : 'Send to Edward'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canNext}
                  className="cta-gold min-h-[44px] disabled:pointer-events-none disabled:opacity-35"
                >
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OptionCard({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex min-h-[52px] items-center justify-between border px-4 py-3 text-left font-body text-[15px] transition-colors duration-300',
        selected ? 'border-gold bg-gold/10 text-bone' : 'border-hairline text-bone/80 hover:border-bone/30 hover:text-bone',
      )}
    >
      {label}
      <span
        className={cn(
          'ml-3 h-2 w-2 shrink-0 rounded-full transition-colors',
          selected ? 'bg-gold' : 'bg-hairline',
        )}
      />
    </button>
  )
}
