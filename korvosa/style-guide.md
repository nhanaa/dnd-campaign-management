# Session Recap Style Guide — Curse of the Crimson Throne

---

## Theme

- **Mood**: Gritty urban intrigue, torchlit stone corridors, political corruption, a city smoldering
- **Color Mode**: Light (warm parchment base)
- **Ambient Effect**: Ember drift — faint warm glow from below, like firelight through a window
- **Ambient Animation**: Slow pulse 6s, opacity 0.3-0.5

## Fonts

| Role | Font | Weight | Size |
|------|------|--------|------|
| **Title (h1 only)** | MedievalSharp | 400 | clamp(32px, 6vw, 54px) |
| **Body text** | Lora | 400 | 16px |
| **Headings (h2-h4, card names)** | Lora | 600 | 17-20px |
| **Mono (tags, timestamps, pills)** | JetBrains Mono | 400 | 10-13px |
| **Google Fonts import** | `@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400&display=swap')` | — | — |

## Color Palette

### Base

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deep` | `#eae4da` | Page background — aged parchment |
| `--bg-card` | `#f2ede4` | Card/panel background — lighter parchment |
| `--bg-card-hover` | `#f8f4ed` | Card hover state |
| `--border` | `#c8bfb0` | Borders, dividers — warm stone gray |
| `--text` | `#2e2a24` | Body text — dark ink brown |
| `--text-dim` | `#5a5347` | Secondary text (WCAG AA compliant on parchment) |
| `--text-bright` | `#1a1714` | Headings, emphasis — near black |

### Background Gradients

```css
background-image:
  radial-gradient(ellipse at 30% 100%, #d4c4a822 0%, transparent 50%),
  radial-gradient(ellipse at 70% 0%, #c8b89822 0%, transparent 40%);
```

### Ambient Effect

```css
background: radial-gradient(ellipse at 50% 110%, #c4884420 0%, transparent 55%);
animation: ember-glow 6s ease-in-out infinite alternate;
/* 0%: opacity 0.3, 50%: opacity 0.5 */
```

### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--red` | `#8a2c2c` | Combat, danger, cliffhangers — crimson |
| `--red-glow` | `#8a2c2c22` | Combat glow |
| `--blue` | `#4a6278` | Exploration — steel blue-gray |
| `--blue-glow` | `#4a627822` | Exploration glow |
| `--green` | `#4a6a3a` | Healing, nature — muted moss |
| `--green-glow` | `#4a6a3a22` | Healing glow |
| `--purple` | `#6a3a6a` | Roleplay, arcane — deep plum |
| `--purple-glow` | `#6a3a6a22` | Roleplay glow |
| `--teal` | `#3a6a62` | Puzzles, lore — verdigris |
| `--teal-glow` | `#3a6a6222` | Puzzle glow |
| `--gold` | `#8a6a2c` | Loot, primary accent — antique gold |
| `--gold-dim` | `#a07a3a` | Muted accent |
| `--gold-glow` | `#8a6a2c22` | Accent glow |

### Character Colors

| Character | Color | Hex |
|-----------|-------|-----|
| Rime (Draconic Sorcerer) | Frost crimson | `#7a2a3a` |
| *(fill in party members)* | | |

## Component Notes

| Component | Notes |
|-----------|-------|
| **Crit box** | `background: linear-gradient(135deg, #e0d6c8, #ebe2d4)`, border `#a0906a` |
| **Magical loot** | Border `#a07a3a`, inner glow `#8a6a2c11`, background `#f0e8da` |
| **Blockquote** | `border-left: 3px solid var(--gold-dim)`, background `#8a6a2c08` |
| **Section titles** | Underlined with `border-bottom: 1px solid var(--border)`, letter-spacing 2px |
| **Timeline dot glow** | Matches accent colors with `box-shadow: 0 0 8px` |
| **Card hover shadow** | `box-shadow: 0 4px 16px #2e2a2412` |
| **Card hover border** | `border-color: #b0a890` |

## Layout

| Setting | Value |
|---------|-------|
| **Max width** | 860px |
| **Body font size** | 16px |
| **Line height** | 1.7 |
| **Card padding** | 24-28px |
| **Card border-radius** | 6px |
| **Section spacing** | 60px margin-bottom |

## Readability Principles

- MedievalSharp used ONLY for the main h1 title
- All other headings and body use Lora (warm, calligraphic serif — bookish, like a worn journal)
- Heading weight: 600 (semibold)
- `--text-dim` (#5a5347) passes WCAG AA against `--bg-deep` (#eae4da)
- Max content width 860px for comfortable line length
- Line height 1.7 for body text
- Border-radius 6px (slightly less rounded — more angular, stone-like)
