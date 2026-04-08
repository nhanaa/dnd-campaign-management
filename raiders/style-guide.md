# Session Recap Style Guide — Raiders of the Serpent Sea

---

## Theme

- **Mood**: Norse seafaring, storm-battered iron, runic sagas, cold violence
- **Color Mode**: Light (darker steel gray base — storm-at-sea)
- **Ambient Effect**: Sea swell — deep cold glow from below like light through dark water
- **Ambient Animation**: Slow swell 7s, opacity 0.4-0.7

## Fonts

| Role | Font | Weight | Size |
|------|------|--------|------|
| **Title (h1 only)** | Uncial Antiqua | 400 | clamp(32px, 6vw, 54px) |
| **Body text** | Rajdhani | 400 | 17px |
| **Headings (h2-h4, card names)** | Rajdhani | 600 | 17-20px |
| **Mono (tags, timestamps, pills)** | JetBrains Mono | 400 | 10-13px |
| **Google Fonts import** | `@import url('https://fonts.googleapis.com/css2?family=Uncial+Antiqua&family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap')` | — | — |

## Color Palette

### Base

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deep` | `#d0d4da` | Page background — dark steel gray |
| `--bg-card` | `#dce0e6` | Card/panel background |
| `--bg-card-hover` | `#e8ecf0` | Card hover state |
| `--border` | `#9aa4b0` | Borders, dividers — iron gray |
| `--text` | `#181e26` | Body text — near black ink |
| `--text-dim` | `#3a4450` | Secondary text (WCAG AA compliant) |
| `--text-bright` | `#0a1018` | Headings, emphasis |

### Background Gradients

```css
background-image:
  radial-gradient(ellipse at 15% 90%, #8a9aae1a 0%, transparent 50%),
  radial-gradient(ellipse at 85% 10%, #7a8a9e1a 0%, transparent 45%),
  radial-gradient(ellipse at 50% 50%, #90a0b010 0%, transparent 60%);
```

### Ambient Effect

```css
background:
  radial-gradient(ellipse at 40% 110%, #3a6a8a1a 0%, transparent 55%),
  radial-gradient(ellipse at 60% -10%, #6a8aaa14 0%, transparent 45%);
animation: sea-swell 7s ease-in-out infinite alternate;
/* 0%: opacity 0.4, 50%: opacity 0.7 */
```

### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--red` | `#7a2020` | Combat, danger, cliffhangers — blood red |
| `--red-glow` | `#7a202028` | Combat glow |
| `--blue` | `#1e4a6e` | Exploration — deep ocean |
| `--blue-glow` | `#1e4a6e22` | Exploration glow |
| `--green` | `#2e5a42` | Healing, nature — dark pine |
| `--green-glow` | `#2e5a4222` | Healing glow |
| `--purple` | `#4a3a6a` | Roleplay, arcane — twilight |
| `--purple-glow` | `#4a3a6a22` | Roleplay glow |
| `--teal` | `#2e5868` | Puzzles, lore — deep sea |
| `--teal-glow` | `#2e586822` | Puzzle glow |
| `--gold` | `#4a6880` | Loot, primary accent — cold steel blue |
| `--gold-dim` | `#5a7a94` | Muted accent |
| `--gold-glow` | `#4a688022` | Accent glow |

### Character Colors

| Character | Color | Hex |
|-----------|-------|-----|
| Aesgor / Tuss (Cleric) | Deep ocean | `#1e4a6e` |
| *(fill in party members)* | | |

## Component Notes

| Component | Notes |
|-----------|-------|
| **Crit box** | `background: linear-gradient(135deg, #c4ccd6, #d4dce4)`, border `#6a7a8e` |
| **Magical loot** | Border `#5a7a94`, inner glow `#4a688014`, background `#dae2ea` |
| **Blockquote** | `border-left: 3px solid var(--gold-dim)`, background `#1e4a6e0c` |
| **Section titles** | Underlined with `border-bottom: 1px solid var(--border)`, letter-spacing 2px |
| **Timeline dot glow** | Matches accent colors with `box-shadow: 0 0 8px` |
| **Card hover shadow** | `box-shadow: 0 4px 16px #181e2620` |
| **Card hover border** | `border-color: #7a8a9a` |

## Layout

| Setting | Value |
|---------|-------|
| **Max width** | 860px |
| **Body font size** | 17px |
| **Line height** | 1.7 |
| **Card padding** | 24-28px |
| **Card border-radius** | 8px |
| **Section spacing** | 60px margin-bottom |

## Readability Principles

- Uncial Antiqua used ONLY for the main h1 title
- All other headings and body use Rajdhani (angular, geometric sans-serif — sharp and distinct)
- Heading weight: 600 (semibold)
- `--text-dim` (#3a4450) passes WCAG AA against `--bg-deep` (#d0d4da)
- Body font bumped to 17px (Rajdhani reads slightly smaller due to condensed geometry)
- Max content width 860px for comfortable line length
- Line height 1.7 for body text
