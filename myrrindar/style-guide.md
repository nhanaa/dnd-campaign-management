# Session Recap Style Guide — Myrrindar: Winds of Warding

---

## Theme

- **Mood**: Lush winds, open skies, fairy-tale nature, playful and bright
- **Color Mode**: Light (soft meadow green base)
- **Ambient Effect**: Breeze drift — dual sky/earth glow that shifts gently
- **Ambient Animation**: Slow drift 10s, opacity 0.3-0.6

## Fonts

| Role | Font | Weight | Size |
|------|------|--------|------|
| **Title (h1 only)** | Quicksand | 700 | clamp(32px, 6vw, 54px) |
| **Body text** | Nunito | 400 | 16px |
| **Headings (h2-h4, card names)** | Nunito | 600 | 17-20px |
| **Mono (tags, timestamps, pills)** | JetBrains Mono | 400 | 10-13px |
| **Google Fonts import** | `@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400&display=swap')` | — | — |

## Color Palette

### Base

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deep` | `#eaf2ea` | Page background — soft meadow |
| `--bg-card` | `#f4f9f4` | Card/panel background |
| `--bg-card-hover` | `#ffffff` | Card hover state |
| `--border` | `#b8d0b8` | Borders, dividers — sage green |
| `--text` | `#243028` | Body text — deep forest |
| `--text-dim` | `#4a5e50` | Secondary text (WCAG AA compliant) |
| `--text-bright` | `#141e18` | Headings, emphasis |

### Background Gradients

```css
background-image:
  radial-gradient(ellipse at 10% 20%, #c0e0cc33 0%, transparent 50%),
  radial-gradient(ellipse at 90% 80%, #b0d0e033 0%, transparent 50%),
  radial-gradient(ellipse at 50% 0%, #d0e8f022 0%, transparent 40%);
```

### Ambient Effect

```css
background:
  radial-gradient(ellipse at 30% -5%, #88c8e828 0%, transparent 50%),
  radial-gradient(ellipse at 70% 105%, #88c8a828 0%, transparent 50%);
animation: breeze-drift 10s ease-in-out infinite alternate;
/* 0%: opacity 0.3, 50%: opacity 0.6 */
```

### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--red` | `#9a4040` | Combat, danger, cliffhangers |
| `--red-glow` | `#9a404022` | Combat glow |
| `--blue` | `#4a80aa` | Exploration — sky blue |
| `--blue-glow` | `#4a80aa22` | Exploration glow |
| `--green` | `#2e7a48` | Healing, nature — leaf green |
| `--green-glow` | `#2e7a4822` | Healing glow |
| `--purple` | `#7a5aaa` | Roleplay, arcane — lavender |
| `--purple-glow` | `#7a5aaa22` | Roleplay glow |
| `--teal` | `#3a8a8a` | Puzzles, lore |
| `--teal-glow` | `#3a8a8a22` | Puzzle glow |
| `--gold` | `#3a8a5a` | Loot, primary accent — emerald |
| `--gold-dim` | `#5aaa7a` | Muted accent |
| `--gold-glow` | `#3a8a5a22` | Accent glow |

### Character Colors

| Character | Color | Hex |
|-----------|-------|-----|
| Mist (Fairy Bard) | Lavender | `#7a5aaa` |
| *(fill in party members)* | | |

## Component Notes

| Component | Notes |
|-----------|-------|
| **Crit box** | `background: linear-gradient(135deg, #dceede, #e6f4e8)`, border `#7aba8a` |
| **Magical loot** | Border `#5aaa7a`, inner glow `#3a8a5a11`, background `#eaf6ee` |
| **Blockquote** | `border-left: 3px solid var(--gold-dim)`, background `#3a8a5a08` |
| **Section titles** | Underlined with `border-bottom: 1px solid var(--border)`, letter-spacing 2px |
| **Timeline dot glow** | Matches accent colors with `box-shadow: 0 0 8px` |
| **Card hover shadow** | `box-shadow: 0 4px 16px #2e7a4815` |
| **Card hover border** | `border-color: #90c0a0` |

## Layout

| Setting | Value |
|---------|-------|
| **Max width** | 860px |
| **Body font size** | 16px |
| **Line height** | 1.7 |
| **Card padding** | 24-28px |
| **Card border-radius** | 8px |
| **Section spacing** | 60px margin-bottom |

## Readability Principles

- Quicksand used ONLY for the main h1 title
- All other headings and body use Nunito (friendly, rounded sans-serif — playful but readable)
- Heading weight: 600 (semibold)
- `--text-dim` (#4a5e50) passes WCAG AA against `--bg-deep` (#eaf2ea)
- Max content width 860px for comfortable line length
- Line height 1.7 for body text
