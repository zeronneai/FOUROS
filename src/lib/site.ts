// Central place for outward-facing links and brand constants.
// Replace the defaults via env vars when deploying.

export const INSTAGRAM_HANDLE =
  import.meta.env.VITE_INSTAGRAM_HANDLE ?? 'four_os_timepieces'

export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`

// Primary contact channel: open the Instagram profile to DM, new tab.
export const INSTAGRAM_DM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`

// Digits only, international format, no '+' or spaces.
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '15555555555'

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const BRAND = {
  name: "Four O's Timepieces",
  tagline: 'Turning Time into Legacy',
} as const
