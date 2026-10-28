import { useCallback, useEffect, useMemo, useState } from 'react'
import { Copy, LogOut, Mail, MessageCircle, Phone, RefreshCw, Search, Check } from 'lucide-react'
import {
  LEAD_STATUSES,
  LEADS_ENDPOINT,
  adminList,
  adminUpdate,
  mailtoHref,
  whatsappHref,
  type Lead,
  type LeadStatus,
} from '@/lib/leads'
import { Monogram } from '@/components/primitives'
import { cn } from '@/lib/utils'

const KEY_STORAGE = 'fouros_admin_key'

function readKey() {
  try {
    return sessionStorage.getItem(KEY_STORAGE) ?? ''
  } catch {
    return ''
  }
}
function writeKey(k: string) {
  try {
    if (k) sessionStorage.setItem(KEY_STORAGE, k)
    else sessionStorage.removeItem(KEY_STORAGE)
  } catch {
    /* ignore */
  }
}

export default function AdminApp() {
  const [key, setKey] = useState(readKey)
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    document.title = "Concierge Desk · Four O's"
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  const load = useCallback(
    async (k: string, quiet = false) => {
      const res = await adminList(k)
      if (res.ok) {
        setLeads(res.leads)
        setAuthError('')
        return true
      }
      if (res.error === 'unauthorized') {
        writeKey('')
        setKey('')
        setLeads(null)
        setAuthError('Wrong password')
      } else if (!quiet) {
        setAuthError(res.error === 'no_endpoint' ? 'Leads endpoint not configured yet.' : 'Could not connect. Try again.')
      }
      return false
    },
    [],
  )

  useEffect(() => {
    if (key) load(key)
  }, [key, load])

  if (!key || (leads === null && authError)) {
    return (
      <Login
        error={authError}
        onSubmit={async (k) => {
          const ok = await load(k)
          if (ok) {
            writeKey(k)
            setKey(k)
          }
        }}
      />
    )
  }

  return (
    <Dashboard
      adminKey={key}
      leads={leads}
      setLeads={setLeads}
      reload={(quiet) => load(key, quiet)}
      logout={() => {
        writeKey('')
        setKey('')
        setLeads(null)
        setAuthError('')
      }}
    />
  )
}

/* ---------------- Login ---------------- */

function Login({ onSubmit, error }: { onSubmit: (k: string) => Promise<void>; error: string }) {
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-ink px-5">
      <form
        className="w-full max-w-sm"
        onSubmit={async (e) => {
          e.preventDefault()
          if (!value.trim()) return
          setBusy(true)
          await onSubmit(value.trim())
          setBusy(false)
        }}
      >
        <Monogram size={48} />
        <p className="eyebrow mt-8 text-gold-gradient">Four O&rsquo;s Timepieces</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tightest text-bone">Concierge Desk</h1>
        <p className="mt-2 font-body text-sm text-muted">Private. Enter your access password.</p>
        <input
          type="password"
          autoComplete="current-password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Password"
          className="lead-input mt-8"
          autoFocus
        />
        {error && <p className="mt-3 font-body text-[13px] text-gold-light">{error}</p>}
        {!LEADS_ENDPOINT && (
          <p className="mt-3 font-body text-[13px] text-muted">Setup pending: the leads endpoint is not configured.</p>
        )}
        <button type="submit" disabled={busy} className="cta-gold mt-6 w-full justify-center disabled:opacity-60">
          {busy ? 'Checking' : 'Enter'}
        </button>
      </form>
    </main>
  )
}

/* ---------------- Dashboard ---------------- */

function relTime(ts: string) {
  // Sheet format: "yyyy-MM-dd HH:mm" (El Paso). Good enough for relative display.
  const d = new Date(ts.replace(' ', 'T'))
  if (isNaN(d.getTime())) return ts
  const mins = Math.round((Date.now() - d.getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  if (days < 30) return `${days}d ago`
  return ts.split(' ')[0]
}

function Dashboard({
  adminKey,
  leads,
  setLeads,
  reload,
  logout,
}: {
  adminKey: string
  leads: Lead[] | null
  setLeads: (fn: (prev: Lead[] | null) => Lead[] | null) => void
  reload: (quiet?: boolean) => Promise<boolean>
  logout: () => void
}) {
  const [filter, setFilter] = useState<LeadStatus | 'All'>('All')
  const [query, setQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState('')

  // Auto refresh every 60s while visible
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') reload(true)
    }, 60000)
    return () => window.clearInterval(id)
  }, [reload])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(id)
  }, [toast])

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const s of LEAD_STATUSES) c[s] = 0
    for (const l of leads ?? []) c[l.status] = (c[l.status] ?? 0) + 1
    return c
  }, [leads])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (leads ?? []).filter((l) => {
      if (filter !== 'All' && l.status !== filter) return false
      if (!q) return true
      return [l.name, l.dreamPiece, l.email, l.phone, l.budget, l.stage, l.notes]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [leads, filter, query])

  const patch = async (lead: Lead, change: { status?: LeadStatus; notes?: string }) => {
    const prev = lead
    setLeads((ls) => ls?.map((l) => (l.id === lead.id ? { ...l, ...change } : l)) ?? ls)
    const res = await adminUpdate(adminKey, lead.id, change)
    if (!res.ok) {
      setLeads((ls) => ls?.map((l) => (l.id === lead.id ? prev : l)) ?? ls)
      setToast('Could not save. Try again.')
      return false
    }
    return true
  }

  const contacted = (lead: Lead) => {
    if (lead.status === 'New') patch(lead, { status: 'Contacted' })
  }

  return (
    <main className="min-h-[100svh] bg-ink pb-24">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-hairline bg-ink/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Monogram size={30} />
            <div>
              <p className="font-display text-base font-semibold leading-none tracking-tightest text-bone">Concierge Desk</p>
              <p className="mt-1 font-body text-[11px] uppercase tracking-[0.18em] text-muted">
                {leads ? `${leads.length} leads` : 'Loading'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <IconButton
              label="Refresh"
              onClick={async () => {
                setRefreshing(true)
                await reload()
                setRefreshing(false)
              }}
            >
              <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
            </IconButton>
            <IconButton label="Log out" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4">
          {(['New', 'Contacted', 'Negotiating', 'Sold'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(filter === s ? 'All' : s)}
              className={cn('bg-charcoal px-4 py-4 text-left transition-colors', filter === s && 'bg-gold/10')}
            >
              <p className="eyebrow">{s}</p>
              <p className={cn('mt-1 font-display text-3xl font-semibold tracking-tightest', s === 'New' ? 'text-gold-gradient' : 'text-bone')}>
                {counts[s] ?? 0}
              </p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {(['All', ...LEAD_STATUSES] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={cn('lead-chip shrink-0', filter === s && 'lead-chip-on')}
              >
                {s}
                {s !== 'All' && <span className="ml-1.5 text-muted">{counts[s] ?? 0}</span>}
              </button>
            ))}
          </div>
          <label className="relative block sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, piece, phone"
              className="lead-input pl-9"
            />
          </label>
        </div>

        {/* List */}
        <div className="mt-6 space-y-3">
          {leads === null &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse border border-hairline bg-charcoal" />
            ))}

          {leads !== null && visible.length === 0 && (
            <div className="border border-hairline bg-charcoal px-6 py-16 text-center">
              <p className="font-display text-2xl tracking-tightest text-bone">
                {leads.length === 0 ? 'No leads yet.' : 'Nothing matches.'}
              </p>
              <p className="mt-2 font-body text-sm text-muted">
                {leads.length === 0
                  ? "They'll appear here as soon as someone fills the form."
                  : 'Try another filter or search.'}
              </p>
            </div>
          )}

          {visible.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onStatus={(status) => patch(lead, { status })}
              onNotes={(notes) => patch(lead, { notes })}
              onContact={() => contacted(lead)}
              onCopy={(v) => {
                navigator.clipboard?.writeText(v).then(
                  () => setToast('Copied'),
                  () => setToast('Could not copy'),
                )
              }}
            />
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 border border-gold/40 bg-charcoal px-5 py-3 font-body text-[13px] text-bone shadow-2xl">
          {toast}
        </div>
      )}
    </main>
  )
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-bone"
    >
      {children}
    </button>
  )
}

/* ---------------- Lead card ---------------- */

function LeadCard({
  lead,
  onStatus,
  onNotes,
  onContact,
  onCopy,
}: {
  lead: Lead
  onStatus: (s: LeadStatus) => void
  onNotes: (n: string) => Promise<boolean>
  onContact: () => void
  onCopy: (v: string) => void
}) {
  const [notes, setNotes] = useState(lead.notes)
  const [notesOpen, setNotesOpen] = useState(!!lead.notes)
  const [saved, setSaved] = useState(false)

  useEffect(() => setNotes(lead.notes), [lead.notes])

  const isNew = lead.status === 'New'
  const piece = lead.dreamPiece || 'Open to suggestions'

  return (
    <article className={cn('border bg-charcoal p-5 sm:p-6', isNew ? 'border-gold/35' : 'border-hairline')}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {isNew && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-label="New" />}
            <h2 className="truncate font-display text-xl font-semibold tracking-tightest text-bone sm:text-2xl">{piece}</h2>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {lead.budget && <Tag gold>{lead.budget}</Tag>}
            {lead.stage && <Tag>{lead.stage}</Tag>}
          </div>
        </div>

        <select
          value={lead.status}
          onChange={(e) => onStatus(e.target.value as LeadStatus)}
          className="shrink-0 rounded-sm border border-hairline bg-ink px-2 py-2 font-body text-[12px] text-bone outline-none focus:border-gold/70"
          aria-label="Status"
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-[13px] text-muted">
        <span className="text-bone/90">{lead.name || 'No name'}</span>
        <span title={`${lead.timestamp} (El Paso)`}>{relTime(lead.timestamp)}</span>
        {lead.source && <span className="uppercase tracking-[0.14em] text-[11px]">via {lead.source}</span>}
      </div>

      {(lead.email || lead.phone) && (
        <div className="mt-3 flex flex-col gap-1 font-body text-[13px]">
          {lead.phone && (
            <CopyRow value={lead.phone} onCopy={onCopy} />
          )}
          {lead.email && (
            <CopyRow value={lead.email} onCopy={onCopy} />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {lead.phone ? (
          <ActionLink href={whatsappHref(lead)} external onClick={onContact} primary>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </ActionLink>
        ) : (
          <ActionDisabled>WhatsApp</ActionDisabled>
        )}
        {lead.phone ? (
          <ActionLink href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`} onClick={onContact}>
            <Phone className="h-4 w-4" /> Call
          </ActionLink>
        ) : (
          <ActionDisabled>Call</ActionDisabled>
        )}
        {lead.email ? (
          <ActionLink href={mailtoHref(lead)} onClick={onContact}>
            <Mail className="h-4 w-4" /> Email
          </ActionLink>
        ) : (
          <ActionDisabled>Email</ActionDisabled>
        )}
      </div>

      {/* Notes */}
      <div className="mt-4">
        {notesOpen ? (
          <div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={async () => {
                if (notes === lead.notes) return
                const ok = await onNotes(notes)
                if (ok) {
                  setSaved(true)
                  window.setTimeout(() => setSaved(false), 1800)
                }
              }}
              rows={3}
              placeholder="Notes: what he wants, follow up date, offer made"
              className="lead-input min-h-[84px] py-3"
            />
            <p className={cn('mt-1 h-4 font-body text-[11px] text-gold-light transition-opacity', saved ? 'opacity-100' : 'opacity-0')}>
              Saved
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setNotesOpen(true)}
            className="font-body text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-bone"
          >
            + Add note
          </button>
        )}
      </div>
    </article>
  )
}

function Tag({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
  return (
    <span
      className={cn(
        'border px-2 py-0.5 font-body text-[11px] tracking-[0.04em]',
        gold ? 'border-gold/40 text-gold-light' : 'border-hairline text-bone/70',
      )}
    >
      {children}
    </span>
  )
}

function CopyRow({ value, onCopy }: { value: string; onCopy: (v: string) => void }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        onCopy(value)
        setDone(true)
        window.setTimeout(() => setDone(false), 1500)
      }}
      className="group inline-flex w-fit items-center gap-2 text-bone/80 transition-colors hover:text-bone"
      title="Copy"
    >
      <span className="break-all text-left">{value}</span>
      {done ? (
        <Check className="h-3.5 w-3.5 text-gold-light" />
      ) : (
        <Copy className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
      )}
    </button>
  )
}

function ActionLink({
  href,
  children,
  onClick,
  external = false,
  primary = false,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
  external?: boolean
  primary?: boolean
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'flex min-h-[48px] items-center justify-center gap-2 border font-body text-[11px] uppercase tracking-[0.16em] transition-colors duration-300',
        primary
          ? 'border-gold/60 bg-gold/15 text-bone hover:border-gold hover:text-gold-light'
          : 'border-hairline text-bone/85 hover:border-bone/40 hover:text-bone',
      )}
    >
      {children}
    </a>
  )
}

function ActionDisabled({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex min-h-[48px] items-center justify-center border border-hairline/60 font-body text-[11px] uppercase tracking-[0.16em] text-muted/40">
      {children}
    </span>
  )
}
