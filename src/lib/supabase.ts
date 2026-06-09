import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Optional: the form degrades gracefully to WhatsApp when Supabase isn't configured.
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null

export interface LeadPayload {
  name: string
  piece: string
  contact: string
  lang: string
}

/**
 * Persist a lead to the `leads` table. Returns true on success.
 * Expected table:
 *   create table leads (
 *     id uuid primary key default gen_random_uuid(),
 *     created_at timestamptz default now(),
 *     name text, piece text, contact text, lang text
 *   );
 */
export async function submitLead(payload: LeadPayload): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('leads').insert({
    name: payload.name,
    piece: payload.piece,
    contact: payload.contact,
    lang: payload.lang,
  })
  if (error) {
    console.error('[supabase] lead insert failed:', error.message)
    return false
  }
  return true
}
