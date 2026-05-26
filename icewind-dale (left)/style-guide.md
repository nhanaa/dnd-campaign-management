# Session Recap Style Guide — Rime of the Frostmaiden

---

## Theme

- **Mood**: Frozen wasteland, bleak tundra, creeping dread beneath the ice
- **Color Mode**: Light
- **Ambient Effect**: Frost shimmer — subtle cold glow from the top of the page
- **Ambient Animation**: Slow breathe 8s, opacity 0.4-0.7

## Fonts

| Role | Font | Weight | Size |
|------|------|--------|------|
| **Title (h1 only)** | Pirata One | 400 | clamp(32px, 6vw, 54px) |
| **Body text** | IBM Plex Sans | 400 | 16px |
| **Headings (h2-h4, card names)** | IBM Plex Sans | 600 | 17-20px |
| **Mono (tags, timestamps, pills)** | JetBrains Mono | 400 | 10-13px |
| **Google Fonts import** | `@import url('https://fonts.googleapis.com/css2?family=Pirata+One&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400&display=swap')` | — | — |

## Color Palette

### Base

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deep` | `#e8edf2` | Page background — pale frost gray |
| `--bg-card` | `#f4f7fa` | Card/panel background |
| `--bg-card-hover` | `#ffffff` | Card hover state |
| `--border` | `#c4ced8` | Borders, dividers |
| `--text` | `#2c3640` | Body text — dark slate |
| `--text-dim` | `#4a5a68` | Secondary text (WCAG AA compliant) |
| `--text-bright` | `#1a2530` | Headings, emphasis — near black |

### Background Gradients

```css
background-image:
  radial-gradient(ellipse at 20% 0%, #cad8e822 0%, transparent 50%),
  radial-gradient(ellipse at 80% 100%, #b8c8d822 0%, transparent 50%);
```

### Ambient Effect

```css
background: radial-gradient(ellipse at 50% -10%, #a0c4e033 0%, transparent 60%);
animation: frost-breathe 8s ease-in-out infinite alternate;
/* 0%: opacity 0.4, 50%: opacity 0.7 */
```

### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--red` | `#8b3a3a` | Combat, danger, cliffhangers |
| `--red-glow` | `#8b3a3a22` | Combat glow |
| `--blue` | `#2a5a8a` | Exploration |
| `--blue-glow` | `#2a5a8a22` | Exploration glow |
| `--green` | `#3a7a5a` | Healing, nature |
| `--green-glow` | `#3a7a5a22` | Healing glow |
| `--purple` | `#6a4a8a` | Roleplay, arcane |
| `--purple-glow` | `#6a4a8a22` | Roleplay glow |
| `--teal` | `#3a7a7a` | Puzzles, lore |
| `--teal-glow` | `#3a7a7a22` | Puzzle glow |
| `--gold` | `#3a6b8a` | Loot, primary accent (steel blue, not gold) |
| `--gold-dim` | `#5a8aaa` | Muted accent |
| `--gold-glow` | `#3a6b8a22` | Accent glow |

### Character Colors

| Character | Color | Hex |
|-----------|-------|-----|
| Avarath Solvane (Paladin) | Frost steel | `#2a5a8a` |
| Kane Whitefang (Druid) | Pine green | `#2a6a4a` |
| Rathis Nox (Rogue) | Shadow purple | `#5a3a7a` |
| Rune Anstepa (Ranger) | Autumn rust | `#7a4a2a` |
| Thors Ketterson (Fighter) | Blood red | `#7a3030` |
| Virel Talthrae (Wizard) | Deep teal | `#2a6a6a` |

## Component Notes

| Component | Notes |
|-----------|-------|
| **Crit box** | `background: linear-gradient(135deg, #dce8f0, #e8f0f6)`, border `#8aaabf` |
| **Magical loot** | Border `#5a8aaa`, inner glow `#3a6b8a11`, background `#edf2f8` |
| **Blockquote** | `border-left: 3px solid var(--gold-dim)`, background `#2a5a8a08` |
| **Section titles** | Underlined with `border-bottom: 1px solid var(--border)`, letter-spacing 2px |
| **Timeline dot glow** | Matches accent colors with `box-shadow: 0 0 8px` |
| **Card hover shadow** | `box-shadow: 0 4px 16px #2a5a8a18` |
| **Card hover border** | `border-color: #a0b0c0` |

## Layout

| Setting | Value |
|---------|-------|
| **Max width** | 860px |
| **Body font size** | 16px |
| **Line height** | 1.7 |
| **Card padding** | 24-28px |
| **Card border-radius** | 8px |
| **Section spacing** | 60px margin-bottom |
| **Timeline event spacing** | 40px margin-bottom |
| **Paragraph spacing** | 12px |
| **List item padding** | 8px vertical |

## Readability Principles

- Pirata One used ONLY for the main h1 title
- All other headings and body use IBM Plex Sans
- Heading weight: 600 (semibold), not 700 (bold)
- `--text-dim` (#4a5a68) passes WCAG AA against `--bg-deep` (#e8edf2)
- Max content width 860px for comfortable line length
- Line height 1.7 for body text
