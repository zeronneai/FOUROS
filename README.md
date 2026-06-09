# Four O&rsquo;s Timepieces — Cinematic Landing

Curaduría de relojes de lujo · _Turning Time into Legacy_.
A single, full-screen **cinematic scroll experience** for **@four_os_timepieces** —
a GSAP-driven pinned timeline that flies a charcoal "card" into view, reveals a
luxury-watch mockup, counts up a stat, and resolves into WhatsApp / Instagram
CTAs. Bilingüe ES/EN.

## Stack

- **React + Vite + TypeScript**
- **Tailwind CSS** with a custom design-token palette (no stock blues/grays) +
  shadcn-style semantic tokens (`background` / `foreground` / `muted-foreground`)
- **GSAP + ScrollTrigger** — the cinematic pinned timeline, mouse-tilt and sheen
- **lucide-react** — UI icons (brand glyphs for WhatsApp/Instagram are inline SVG,
  since lucide ships no brand icons)
- shadcn-style structure: `@/*` path alias, `@/lib/utils` `cn()` helper,
  components under `src/components/ui/`

## Getting started

```bash
npm install
cp .env.example .env   # optional — sensible fallbacks if unset
npm run dev            # http://localhost:5173
```

Other scripts: `npm run build`, `npm run preview`, `npm run typecheck`.

> The hero pins the page and consumes ~7000px of scroll to play the full
> timeline. Under `prefers-reduced-motion` the pinning is skipped and a static,
> legible layout is shown instead.

## Project structure (shadcn-style)

```
src/
  App.tsx                              # composes the hero + bilingual content
  components/
    ui/cinematic-landing-hero.tsx      # the cinematic component (the deliverable)
    LanguageToggle.tsx                 # ES / EN switch
  lib/
    utils.ts                           # cn() — clsx + tailwind-merge
    i18n.tsx                           # language provider (browser default → ES)
    site.ts                            # WhatsApp / Instagram links + brand consts
```

> **Why `components/ui`?** It's the shadcn convention: a predictable home for
> reusable, copy-pasted UI primitives that the `@/components/ui/*` import alias
> and tooling expect. Keeping the cinematic hero there means future shadcn
> components drop in alongside it without restructuring.

## The cinematic hero

`<CinematicHero />` is fully prop-driven, so the same component can be re-themed.
`App.tsx` feeds it Four O&rsquo;s content (ES/EN via the language toggle):

| Prop | Purpose |
| --- | --- |
| `brandName` | Large brand word inside the card + watch applique (`FOUR O'S`). |
| `tagline1` / `tagline2` | Hero lines. `tagline2` renders in the signature gold gradient. |
| `cardHeading` / `cardDescription` | Curation copy beside the watch. |
| `metricValue` / `metricLabel` | The sub-dial counter that animates up (e.g. _Pieces placed_). |
| `dateLabel` | The watch date window. |
| `ctaHeading` / `ctaDescription` | The closing call-to-action. |
| `primaryHref` / `secondaryHref` + labels | WhatsApp + Instagram CTAs. |
| `badges` | The two floating glass badges (Authenticated / Full Set). |

### Brand adaptation vs. the source component

The component started as a sobriety-app hero (deep-blue card, iPhone mockup,
App Store / Google Play). It was adapted to the Four O&rsquo;s design system:

- Deep blue `#162C6D` → **charcoal** card with a fine gold hairline
- iPhone app UI → a **luxury watch** (steel case, gold bezel ring, animated
  seconds track repurposed from the original progress ring, 10:10 hands,
  sub-dial counter, date window)
- App Store / Google Play → **WhatsApp + Instagram** outline CTAs (gold edge,
  never a gold fill)
- Emoji badges → **lucide icons** (ShieldCheck / BadgeCheck)
- Gold kept disciplined: signature lines, hairlines, bezel and seconds track only

## Configuration (`.env`)

All optional — the site runs with fallbacks.

| Variable | Purpose |
| --- | --- |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number, international format, digits only (`15551234567`). **Set this** or the CTAs point nowhere. |
| `VITE_INSTAGRAM_HANDLE` | Instagram handle without the `@`. |

## Design tokens

Defined in `tailwind.config.ts` (and CSS vars in `src/index.css`):

- **Background** `#0A0A0B` ink · panels `#141416` charcoal
- **Text** `#F5F2EC` bone · secondary `#8A857B` muted
- **Accent** champagne gold gradient `#E8C887 → #B8923F` — brand, hairlines,
  micro-details only (never a full button fill)
- **Display** Fraunces (variable, 400–900) · **UI/body** Inter, tight tracking
