// Generates editorial placeholder SVGs for the gallery.
// Intentional stand-ins (charcoal field, gold hairline frame, watch motif +
// label). Replace /public/gallery/* with real Instagram photos.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '../public/gallery')
mkdirSync(outDir, { recursive: true })

function watchMotif(cx, cy, r, opacity = 0.5) {
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

function svg({ w, h, label, sub }) {
  const r = Math.min(w, h) * 0.2
  const cx = w / 2
  const cy = h * 0.44
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
  <text x="${w / 2}" y="${h - 46}" fill="#F5F2EC" font-family="Georgia, serif" font-size="20" text-anchor="middle" letter-spacing="0.04em">${label}</text>
  <text x="${w / 2}" y="${h - 24}" fill="#8A857B" font-family="Inter, sans-serif" font-size="11" text-anchor="middle" letter-spacing="0.22em">${sub.toUpperCase()}</text>
</svg>`
}

// 3:4, 4:5 and 1:1 — vertical-friendly so the masonry grid reads full.
const ASPECT = { tall: [720, 960], wide: [760, 760], regular: [720, 900] }

const pieces = [
  ['rolex-datejust-41', 'Rolex Datejust 41', 'tall'],
  ['cartier-santos', 'Cartier Santos', 'regular'],
  ['rolex-submariner', 'Rolex Submariner', 'wide'],
  ['patek-nautilus', 'Patek Nautilus', 'regular'],
  ['ap-royal-oak', 'AP Royal Oak', 'tall'],
  ['rolex-daytona', 'Rolex Daytona', 'regular'],
  ['cartier-tank', 'Cartier Tank', 'regular'],
  ['rolex-gmt', 'Rolex GMT-Master II', 'regular'],
  ['omega-speedmaster', 'Omega Speedmaster', 'wide'],
]

for (const [name, label, span] of pieces) {
  const [w, h] = ASPECT[span]
  writeFileSync(resolve(outDir, `${name}.svg`), svg({ w, h, label, sub: 'Placeholder' }))
}

console.log('Generated', pieces.length, 'gallery placeholders in', outDir)
