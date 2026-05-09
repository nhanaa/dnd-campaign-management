# Session Recap Style Guide — [Campaign Name]

Use this template to define the visual theme for each campaign's HTML session recaps. Copy this file into the campaign folder as `style-guide.md` and fill it out.

---

## Theme

- **Mood**: [e.g., Frozen wasteland, dark dungeon, tropical adventure, gothic horror]
- **Color Mode**: [Light / Dark]
- **Ambient Effect**: [e.g., Frost shimmer, torch flicker, rain, none]
- **Ambient Animation**: [e.g., "slow breathe 8s" / "flicker 4s" / none]

## Fonts

| Role | Font | Weight | Size |
|------|------|--------|------|
| **Title (h1 only)** | [Display font name] | [400-900] | [clamp(32px, 6vw, 54px)] |
| **Body text** | [Sans/serif font name] | 400 | 16px |
| **Headings (h2-h4, card names)** | [Same as body or different] | 600 | 17-20px |
| **Mono (tags, timestamps, pills)** | JetBrains Mono | 400 | 10-13px |
| **Google Fonts import** | [Full @import URL] | — | — |

## Color Palette

### Base

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deep` | | Page background |
| `--bg-card` | | Card/panel background |
| `--bg-card-hover` | | Card hover state |
| `--border` | | Borders, dividers |
| `--text` | | Body text |
| `--text-dim` | | Secondary text, captions |
| `--text-bright` | | Headings, emphasis |

### Background Gradients (optional)

```css
background-image:
  radial-gradient(ellipse at __% __%, ________ 0%, transparent 50%),
  radial-gradient(ellipse at __% __%, ________ 0%, transparent 50%);
```

### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--red` | | Combat, danger, cliffhangers |
| `--red-glow` | | Combat glow (hex + alpha) |
| `--blue` | | Exploration |
| `--blue-glow` | | Exploration glow |
| `--green` | | Healing, nature |
| `--green-glow` | | Healing glow |
| `--purple` | | Roleplay, arcane |
| `--purple-glow` | | Roleplay glow |
| `--teal` | | Puzzles, lore |
| `--teal-glow` | | Puzzle glow |
| `--gold` | | Loot, primary accent |
| `--gold-dim` | | Muted accent |
| `--gold-glow` | | Accent glow |

### Character Colors

| Character | Color | Hex |
|-----------|-------|-----|
| [Character 1] | | |
| [Character 2] | | |
| [Character 3] | | |
| [Character 4] | | |
| [Character 5] | | |
| [Character 6] | | |

## Component Notes

| Component | Notes |
|-----------|-------|
| **Crit box** | Background gradient, border color |
| **Magical loot** | Border color, inner glow, background |
| **Blockquote** | Border-left color |
| **Section titles** | Underline style, letter-spacing |
| **Timeline dot glow** | Matches accent colors |

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

- Display/decorative fonts used ONLY for the main h1 title
- All other headings and body use a clean, readable font (sans-serif preferred)
- Heading weight: 600 (semibold), not 700 (bold)
- Text-dim must pass WCAG AA contrast against bg-deep (minimum 4.5:1)
- Max content width ~860px for comfortable line length
- Line height 1.7 for body text
- Paragraph spacing 12px minimum
- List item padding 8px vertical minimum
