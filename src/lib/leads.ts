// Lead capture + admin API client.
// Backend: Google Apps Script web app (see apps-script/leads.gs).
// Apps Script has no CORS preflight support, so every call is a "simple"
// request: POST with a text/plain body containing JSON.

export const LEADS_ENDPOINT: string =
  import.meta.env.VITE_LEADS_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbzVFRjXudjEp68flYMQcTEK6V8q9rMzPv0PtQtLKjCPHb9WIPbG7PzcizTWCw-3iuMX/exec'

export const LEAD_STATUSES = ['New', 'Contacted', 'Negotiating', 'Sold', 'Not a fit'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export type LeadInput = {
  name: string
  email: string
  phone: string
  dreamPiece: string
  budget: string
  stage: string
  page: string
  source: string
  website: string // honeypot, must stay empty
}

export type Lead = {
  id: number
  timestamp: string
  name: string
  email: string
  phone: string
  dreamPiece: string
  budget: string
  stage: string
  page: string
  source: string
  status: LeadStatus
  notes: string
}

type ApiResult<T = unknown> = ({ ok: true } & T) | { ok: false; error: string }

async function call<T>(body: Record<string, unknown>): Promise<ApiResult<T>> {
  if (!LEADS_ENDPOINT) return { ok: false, error: 'no_endpoint' }
  try {
    const res = await fetch(LEADS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    })
    return (await res.json()) as ApiResult<T>
  } catch {
    return { ok: false, error: 'network' }
  }
}

export function submitLead(input: LeadInput) {
  return call(input)
}

export function adminList(key: string) {
  return call<{ leads: Lead[]; statuses: LeadStatus[] }>({ action: 'list', key })
}

export function adminUpdate(key: string, id: number, patch: { status?: LeadStatus; notes?: string }) {
  return call({ action: 'status', key, id, ...patch })
}

/* ---------- Validation ---------- */

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
export const isPhone = (v: string) => v.replace(/\D/g, '').length >= 7

/* ---------- Contact helpers (admin) ---------- */

/** Digits for wa.me: 10 digits = US (+1); otherwise keep what was typed. */
export function waDigits(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.length === 10) return `1${d}`
  return d
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || ''
}

export function outreachText(lead: Pick<Lead, 'name' | 'dreamPiece'>): string {
  const hi = firstName(lead.name) ? `Hi ${firstName(lead.name)}` : 'Hi there'
  const piece =
    lead.dreamPiece && lead.dreamPiece !== 'Open to suggestions'
      ? `I saw you're looking for a ${lead.dreamPiece}. I'd love to help you find it.`
      : `I saw you're looking for your next piece. I'd love to help you find it.`
  return `${hi}, this is Edward from Four O's Timepieces. ${piece}`
}

export function whatsappHref(lead: Lead) {
  return `https://wa.me/${waDigits(lead.phone)}?text=${encodeURIComponent(outreachText(lead))}`
}

export function mailtoHref(lead: Lead) {
  const subject =
    lead.dreamPiece && lead.dreamPiece !== 'Open to suggestions'
      ? `Your next piece: ${lead.dreamPiece}`
      : 'Your next piece'
  return `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(outreachText(lead))}`
}

/* ---------- Modal open bus ---------- */

const OPEN_EVENT = 'fouros:open-lead-modal'

/** Open the lead modal from anywhere (nav link, gallery CTA, etc.). */
export function openLeadModal(source = 'button') {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { source } }))
}

export function onOpenLeadModal(handler: (source: string) => void) {
  const fn = (e: Event) => handler((e as CustomEvent<{ source: string }>).detail?.source ?? 'button')
  window.addEventListener(OPEN_EVENT, fn)
  return () => window.removeEventListener(OPEN_EVENT, fn)
}
