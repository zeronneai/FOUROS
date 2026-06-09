# Four O&rsquo;s Timepieces — Landing

Curaduría de relojes de lujo · _Turning Time into Legacy_.
Single-page, mobile-first landing for **@four_os_timepieces** — lead capture
straight to WhatsApp, with an optional Supabase-backed form. Bilingüe ES/EN.

## Stack

- **React + Vite + TypeScript**
- **Tailwind CSS** with a custom design-token palette (no stock blues/grays)
- **Framer Motion** — scroll reveals, parallax, masked headline lines
- **Lenis** — global smooth scroll (auto-disabled under `prefers-reduced-motion`)
- **Supabase** (optional) — lead persistence; otherwise the form hands off to WhatsApp

## Getting started

```bash
npm install
cp .env.example .env   # fill in the values you need (all optional for local dev)
npm run dev            # http://localhost:5173
```

Other scripts: `npm run build`, `npm run preview`, `npm run typecheck`.

## Configuration (`.env`)

Everything is optional — the site runs with sensible fallbacks.

| Variable | Purpose |
| --- | --- |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number, international format, digits only (`15551234567`). |
| `VITE_INSTAGRAM_HANDLE` | Instagram handle without the `@`. |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Enable the Supabase contact form. If unset, the form opens WhatsApp with the lead prefilled. |

Supabase table expected by the form:

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text, piece text, contact text, lang text
);
```

## Replacing the placeholder images

All imagery lives in **`public/placeholders/`** as labeled SVG stand-ins.
Swap them for real photos from Instagram — keep the same filenames, or update
the paths in `src/data/inventory.ts` and `src/components/Hero.tsx`.

| File | Used by | Suggested crop |
| --- | --- | --- |
| `hero.svg` | Hero background | Tall, cinematic macro (or drop in a `<video>` loop in `Hero.tsx`) |
| `piece-01…06.svg` | New-arrivals grid | Mixed: `3:4`, square, `16:10` (see `span` in `inventory.ts`) |
| `sold-01…05.svg` | Sold wall | Square |

Inventory copy, references and the asymmetric grid weights are all data-driven
in `src/data/inventory.ts`.

## Editing copy / translations

All ES/EN strings live in one dictionary: `src/lib/i18n.tsx`. The language
toggle defaults to the browser language (falling back to Spanish) for the
El Paso / Juárez border market, and persists the choice to `localStorage`.

## Design system

Tokens are defined in `tailwind.config.ts`:

- **Background** `#0A0A0B` ink · panels `#141416` charcoal
- **Text** `#F5F2EC` bone · secondary `#8A857B` muted
- **Accent** champagne gold gradient `#E8C887 → #B8923F` — used only on the
  brand, hairlines and micro-details (never as a full button fill)
- **Sunset signature** (logo rose→orange→amber) — reserved for the animated
  monogram ring only
- **Display** Fraunces (600–900) · **UI/body** Inter with tight tracking
- 1px hairline rules (`#2A2A2C`), near-zero border radius

## Structure

```
src/
  App.tsx                 # section composition + Lenis
  components/             # Nav, Hero, Curaduria, Manifiesto, Services,
                          # Authenticity, SocialProof, Contact, Footer …
  data/inventory.ts       # pieces, sold wall, testimonials
  hooks/                  # useLenis, useScrolled
  lib/                    # i18n, supabase, site config, motion variants
```
