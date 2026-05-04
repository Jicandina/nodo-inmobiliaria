# El Faro — DESIGN.md

## Color Palette

| Token | Hex | Role |
|---|---|---|
| `navy-950` | `#0b1525` | Background principal (body, page) |
| `navy-900` | `#132035` | Cards, secciones elevadas |
| `navy-800` | `#1b2b4a` | Color logo, bordes, inputs |
| `navy-700` | `#223458` | Hover states, botones secundarios |
| `navy-600` | `#2b3f6a` | Bordes activos |
| `navy-400` | `#507099` | Texto secundario, íconos inactivos |
| `navy-300` | `#7a9dc0` | Subtítulos, placeholders |
| `navy-200` | `#a8c0d8` | Texto auxiliar claro |
| `navy-100` | `#d0dff0` | Texto sobre fondo muy oscuro |
| `gold-400` | `#fbbf24` | Acento principal — énfasis, CTAs hover |
| `gold-500` | `#f59e0b` | Botón primario background |
| `gold-300` | `#fcd34d` | Acento claro |

**Color strategy**: Committed. Navy lleva 60% de la superficie. Dorado máx. 15%.

## Typography

| Role | Font | Weight | Size range |
|---|---|---|---|
| Display / H1 | Playfair Display | 700 bold | 52px–100px |
| H2 | Playfair Display | 700 | 36px–48px |
| H3 | DM Sans | 600 semibold | 18px–22px |
| Body | DM Sans | 400 | 14px–16px |
| Label/caption | DM Sans | 500–600 | 10px–12px |
| Eyebrow | DM Sans | 600 | 10–11px, tracking 0.2em, uppercase |

Line height H1: 0.92–0.95. Body: 1.6–1.7.

## Spacing Rhythm
- Section padding: `py-20` to `py-28`
- Content max-width: `max-w-7xl`
- Page gutter: `px-6 sm:px-10 lg:px-20`
- Card padding: `p-5` to `p-6`

## Components

### btn-primary
Gold background (`bg-gold-500`), navy-950 text, bold. `px-8 py-4`. Rounded-xl. Shadow-gold on hover.

### btn-outline
Gold border + text. No fill. Hover: gold/10 background.

### card
`bg-navy-900 border border-navy-800/60 rounded-2xl shadow-card`

### input-field
`bg-navy-800 border-navy-700` with gold focus ring.

### section-accent
`w-12 h-0.5 bg-gold-500` — thin gold line before section titles.

### Eyebrow pattern
`text-gold-400 text-[11px] font-semibold tracking-[0.25em] uppercase` — before headings.

## Motion
- Entrance: `opacity 0→1 + y 24→0`, ease `[0.22, 1, 0.36, 1]`, duration 0.5–0.85s
- Stagger: 0.07s between items in lists
- Hover transitions: 200ms duration
- No bounce, no elastic. Expo ease-out only.
- `whileInView` with `viewport={{ once: true }}`

## Photography
- Hero: `/faro-lecheria.jpg` — Faro de Lechería real, full bleed
- Property cards: Unsplash (temporales, reemplazar con reales)
- Overlay hero: `from-navy-950 via-navy-950/55 to-navy-950/10` (bottom→top) + `from-navy-950/75 via-navy-950/20 to-transparent` (left→right)

## Layout Principles
- Hero: full-bleed, contenido anclado bottom-left, editorial
- Stats: divider grid sin iconos
- WhyUs: numbered list con sticky header — editorial, no cards
- No floating elements decorativos
- No glassmorphism como default
