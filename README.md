# Four O&rsquo;s Timepieces — Landing

Curaduría de relojes de lujo · _Turning Time into Legacy_.
Mobile-first, bilingual (ES/EN) landing for **@four_os_timepieces** — lead
capture straight to WhatsApp, with the gallery as the heart of the page.

## Stack

- **React + Vite + TypeScript**
- **Tailwind CSS** with a custom design-token palette (no stock blues/grays) +
  shadcn-style semantic tokens (`background` / `foreground` / `muted-foreground`)
- **lucide-react** icons (WhatsApp / Instagram are inline brand glyphs)
- shadcn-style structure: `@/*` path alias, `@/lib/utils` `cn()` helper
- Reveals via a tiny IntersectionObserver hook — no animation library, all
  motion is `prefers-reduced-motion` safe

## Getting started

```bash
npm install
cp .env.example .env   # optional — sensible fallbacks if unset
npm run dev            # http://localhost:5173
```

Other scripts: `npm run build`, `npm run preview`, `npm run typecheck`.

## Page structure

`Nav → Hero → Curation card → Gallery → Stats → Contact/Footer`. Every section
carries an eyebrow + 1px hairline and ends by inviting the next action.

```
src/
  App.tsx                    # section composition
  components/
    Nav.tsx                  # fixed nav, blur-on-scroll, anchors (Colección/Curaduría/Contacto)
    Hero.tsx                 # title (masked line reveal), CTAs, scroll cue
    CurationCard.tsx         # the "Curation, redefined" watch card (steel case,
                             #   gold bezel, in-view counter/ring, mouse tilt, badges)
    Gallery.tsx              # editorial masonry + category filters + WhatsApp per piece
    Stats.tsx                # subtle count-up stats strip
    Footer.tsx               # closing CTA (#contacto) + footer
    LanguageToggle.tsx       # ES / EN switch
    primitives.tsx           # Eyebrow / Hairline / Reveal / LineReveal / Monogram
  data/inventory.ts          # pieces (brand, status, tags, span), stats, filters
  hooks/useInView.ts         # IntersectionObserver reveal (reduced-motion safe)
  lib/{utils,i18n,site}.ts   # cn(), language provider + labels, WhatsApp/IG links
```

### Gallery

The intuitive heart of the page: an editorial **masonry** wall (varied heights,
no uniform shadowed cards), category filters (`Todos · Rolex · Cartier · Patek ·
New Arrivals · SOLD`), Disponible / SOLD badges, slow hover zoom, and a
per-piece **Consultar por WhatsApp** link that opens the chat pre-filled with
the model. Pieces, filters and stats are data-driven in `src/data/inventory.ts`.

### Replacing placeholder images

`public/gallery/*.svg` are labeled stand-ins at vertical (4:5 / 3:4 / 1:1)
ratios so the grid reads full. Swap them for real Instagram photos — keep the
same filenames, or edit the paths in `src/data/inventory.ts`.

## Configuration (`.env`)

All optional — the site runs with fallbacks.

| Variable | Purpose |
| --- | --- |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number, international format, digits only (`15551234567`). **Set this** or the CTAs point nowhere. |
| `VITE_INSTAGRAM_HANDLE` | Instagram handle without the `@`. |

## Design tokens

Defined in `tailwind.config.ts` + CSS vars in `src/index.css`:

- **Background** `#0A0A0B` ink · panels `#141416` charcoal
- **Text** `#F5F2EC` bone · secondary `#8A857B` muted
- **Accent** champagne gold gradient `#E8C887 → #B8923F` — brand, hairlines,
  micro-details only (never a full button fill)
- **Display** Fraunces (variable, 400–900) · **UI/body** Inter, tight tracking
