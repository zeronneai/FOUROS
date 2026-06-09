// Generates editorial placeholder SVGs for piece/sold/hero imagery.
// These are intentional stand-ins (charcoal field, gold hairline frame, a
// simple watch motif + label). Replace /public/placeholders/* with real photos.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '../public/placeholders')
mkdirSync(outDir, { recursive: true })

function watchMotif(cx, cy, r, opacity = 0.5) {
  // Minimal wristwatch line drawing: case, crown, two lugs, hands.
  return `
    <g stroke="#C9A45F" stroke-width="1.25" fill="none" opacity="${opacity}">
      <circle cx="${cx}" cy="${cy}" r="${r}" />
      <circle cx="${cx}" cy="${cy}" r="${r - 7}" stroke-opacity="0.5" />
      <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r * 0.55}" />
      <line x1="${cx}" y1="${cy}" x2="${cx + r * 0.42}" y2="${cy + r * 0.18}" />
      <circle cx="${cx}" cy="${cy}" r="1.6" fill="#C9A45F" stroke="none" />
      <rect x="${cx + r - 1}" y="${cy - 4}" width="6" height="8" rx="1" />
      <path d="M ${cx - r * 0.55} ${cy - r} L ${cx - r * 0.7} ${cy - r - 22}
               M ${cx + r * 0.55} ${cy - r} L ${cx + r * 0.7} ${cy - r - 22}
               M ${cx - r * 0.55} ${cy + r} L ${cx - r * 0.7} ${cy + r + 22}
               M ${cx + r * 0.55} ${cy + r} L ${cx + r * 0.7} ${cy + r + 22}"
            stroke-opacity="0.45" />
    </g>`
}

function svg({ w, h, label, sub, big = false }) {
  const r = Math.min(w, h) * (big ? 0.16 : 0.2)
  const cx = w / 2
  const cy = h * (sub ? 0.42 : 0.46)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#161618"/>
      <stop offset="1" stop-color="#0E0E10"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#E8C887"/>
      <stop offset="1" stop-color="#B8923F"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.4" r="0.7">
      <stop offset="0" stop-color="#1F1F22"/>
      <stop offset="1" stop-color="#0E0E10" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect x="10.5" y="10.5" width="${w - 21}" height="${h - 21}" fill="none" stroke="url(#gold)" stroke-opacity="0.28"/>
  ${watchMotif(cx, cy, r, 0.55)}
  <text x="${w / 2}" y="${h - 46}" fill="#F5F2EC" font-family="Georgia, serif" font-size="${big ? 26 : 20}" text-anchor="middle" letter-spacing="0.04em">${label}</text>
  ${sub ? `<text x="${w / 2}" y="${h - 24}" fill="#8A857B" font-family="Inter, sans-serif" font-size="11" text-anchor="middle" letter-spacing="0.22em">${sub.toUpperCase()}</text>` : ''}
</svg>`
}

const pieces = [
  ['piece-01', 'Rolex Datejust 41', 'Placeholder', 600, 800],
  ['piece-02', 'Cartier Santos', 'Placeholder', 600, 600],
  ['piece-03', 'Rolex Submariner', 'Placeholder', 1000, 620],
  ['piece-04', 'Patek Nautilus', 'Placeholder', 600, 600],
  ['piece-05', 'AP Royal Oak', 'Placeholder', 600, 800],
  ['piece-06', 'Rolex Daytona', 'Placeholder', 600, 600],
]
for (const [name, label, sub, w, h] of pieces) {
  writeFileSync(resolve(outDir, `${name}.svg`), svg({ w, h, label, sub }))
}

const sold = [
  ['sold-01', 'GMT-Master II'],
  ['sold-02', 'Speedmaster'],
  ['sold-03', 'Tank Must'],
  ['sold-04', 'Day-Date 40'],
  ['sold-05', 'Black Bay 58'],
]
for (const [name, label] of sold) {
  writeFileSync(resolve(outDir, `${name}.svg`), svg({ w: 600, h: 600, label, sub: 'Sold' }))
}

// Hero (cinematic macro stand-in)
writeFileSync(
  resolve(outDir, 'hero.svg'),
  svg({ w: 1600, h: 2000, label: "Four O's Timepieces", sub: 'Hero — replace with macro shot', big: true }),
)

console.log('Generated placeholders in', outDir)
