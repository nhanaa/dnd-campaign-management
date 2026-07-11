# Session Recap Style Guide — Kingmaker (Avor)

Defines the visual theme for this campaign's HTML session recaps.

---

## Theme

- **Mood**: Candlelit manor at night on the frontier — warm parchment and dark wood, cut by blood-red and cold-giant blue. Stolen Lands frontier base, but the tone flexes darker for a massacre session.
- **Color Mode**: Dark
- **Ambient Effect**: Slow candle-glow pulse (radial gradients, low opacity)
- **Ambient Animation**: `glow-pulse 12s ease-in-out infinite alternate`

## Fonts

| Role | Font | Weight | Size |
|------|------|--------|------|
| **Title (h1 only)** | Cinzel Decorative | 700 | clamp(30px, 5.5vw, 48px) |
| **Body text** | Inter | 400 | 16px |
| **Headings (h2-h4, card names)** | Inter | 600 | 15-20px |
| **Mono (tags, timestamps, pills)** | JetBrains Mono | 400 | 10-13px |
| **Google Fonts import** | `@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap');` | — | — |

## Color Palette

### Base

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deep` | #14100e | Page background (dark warm charcoal) |
| `--bg-card` | #201a16 | Card/panel background |
| `--bg-card-hover` | #2a221c | Card hover state |
| `--border` | #3a2f26 | Borders, dividers |
| `--text` | #ece4d8 | Body text (warm parchment) |
| `--text-dim` | #b3a291 | Secondary text, captions |
| `--text-bright` | #fbf4e8 | Headings, emphasis |

### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--shadow` (primary) | #9a3b3b | Candlelit crimson — primary accent (sparkle, borders, blockquote, threads) |
| `--shadow-bright` | #c25a52 | Brighter crimson |
| `--blood` | #b0303a | Combat, danger, cliffhangers |
| `--gold` | #d0a848 | Loot, candlelight, primary highlight |
| `--gold-dim` | #a07c30 | Muted accent |
| `--azure` | #4a86b8 | RP / the giant's cold breath |
| `--jade` | #6a9a54 | Exploration, Stolen Lands green |
| `--ember` | #cc6a34 | Fire / the burning West Wing / loot bar |

### Character Colors

| Character | Hex |
|-----------|-----|
| Avor (Pax) ★ | #d0a848 (gold) |
| Soft Willow | #7aa06a (willow green) |
| Drek | #5a90c4 (dragon blue) |
| Zouse Von Kusby | #c07a3a (banner bronze) |
| Caleb | #5aa890 (Erastil teal) |

## Layout

| Setting | Value |
|---------|-------|
| **Max width** | 860px |
| **Body font size** | 16px |
| **Line height** | 1.7 |
| **Card padding** | 20-24px |
| **Card border-radius** | 8px |
| **Section spacing** | 56px |

## Readability Principles

- Display font (Cinzel Decorative) ONLY for the main h1 title
- All other headings + body use Inter (semibold 600 for headings)
- `--text-dim` passes WCAG AA against `--bg-deep`
- Max content width 860px; line height 1.7; paragraph spacing 12px min
