# Session Recap Style Guide — The Godsrain Gauntlet

A one-shot theme. Gorum is dead, his body fell as iron rain, and the gauntlet is fought through the wreckage — magma, wraithlight, adamantine, and the last of Our Lord in Iron's faithful.

The palette is **cooling iron**: near-black slag, molten rust bleeding to ember, and cold adamantine highlights. Undeath and rune-magic enter as violet; life and healing as a sparse jade.

---

## Theme

- **Mood**: Divine wreckage — a dead god's iron rain, cooling slag, and a five-fight descent into the Gorumite faithful
- **Color Mode**: Dark
- **Ambient Effect**: Slow ember pulse behind the header, faint iron-grain vignette
- **Ambient Animation**: `emberbreathe 9s ease-in-out infinite` on the header glow only — nothing animates in the body

## Fonts

| Role | Font | Weight | Size |
|------|------|--------|------|
| **Title (h1 only)** | Cinzel Decorative | 700 | clamp(32px, 6vw, 54px) |
| **Body text** | Inter | 400 | 16px |
| **Headings (h2–h4, card names)** | Inter | 600 | 17–20px |
| **Mono (tags, timestamps, pills)** | JetBrains Mono | 400 | 10–13px |
| **Google Fonts import** | `@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');` | — | — |

## Color Palette

### Base

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deep` | `#0b0a09` | Page background — cold slag |
| `--bg-card` | `#16130f` | Card/panel background |
| `--bg-card-hover` | `#1e1a15` | Card hover state |
| `--border` | `#2f2820` | Borders, dividers |
| `--border-bright` | `#4a3f31` | Emphasized borders |
| `--text` | `#ddd5cb` | Body text |
| `--text-dim` | `#a2978a` | Secondary text, captions (7.1:1 on `--bg-deep` — passes AA) |
| `--text-bright` | `#f6f1ea` | Headings, emphasis |

### Background Gradients

```css
background-image:
  radial-gradient(ellipse at 20% 0%, rgba(196, 68, 42, 0.13) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 12%, rgba(139, 111, 196, 0.09) 0%, transparent 50%);
```

### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--rust` | `#c4442a` | Combat, Gorum, primary danger |
| `--rust-glow` | `rgba(196, 68, 42, 0.28)` | Combat glow |
| `--ember` | `#e8703a` | Magma, crits, heat |
| `--ember-glow` | `rgba(232, 112, 58, 0.26)` | Crit glow |
| `--iron` | `#8fa3b0` | Adamantine, sentinels, exploration |
| `--iron-glow` | `rgba(143, 163, 176, 0.22)` | Exploration glow |
| `--violet` | `#8b6fc4` | Undeath, wraiths, runes, roleplay |
| `--violet-glow` | `rgba(139, 111, 196, 0.24)` | Roleplay glow |
| `--jade` | `#5fa87a` | Healing, nature, Treat Wounds |
| `--jade-glow` | `rgba(95, 168, 122, 0.22)` | Healing glow |
| `--rose` | `#d4526e` | Downs, cliffhangers, near-death |
| `--rose-glow` | `rgba(212, 82, 110, 0.24)` | Cliffhanger glow |
| `--gold` | `#d9a441` | Loot, primary accent |
| `--gold-dim` | `#9c7730` | Muted accent |
| `--gold-glow` | `rgba(217, 164, 65, 0.26)` | Accent glow |

### Character Colors

| Character | Color | Hex |
|-----------|-------|-----|
| Graz (Lizardfolk Swashbuckler) | Scale green | `#4fae7b` |
| Tam al'Thor (Halfling Gunslinger) | Brass | `#d9a441` |
| Chthon'ar'ax (Orc Barbarian) | Blood rust | `#c4442a` |
| Jassik (Nagaji Fighter) | Serpent teal | `#3fa3a3` |
| Keegru (Tripkee Animist) | Moss | `#8bbf5a` |
| Shuyinlo Gallalva (Elf Runesmith) | Rune violet | `#8b6fc4` |

## Component Notes

| Component | Notes |
|-----------|-------|
| **Crit box** | `linear-gradient(135deg, #1d1410, #16130f)`, 1px `--ember` border, inset `0 0 24px var(--ember-glow)` |
| **Magical loot** | `--violet` border, `box-shadow: inset 0 0 20px var(--violet-glow)`, background `#171320` |
| **Blockquote** | `border-left: 3px solid var(--gold-dim)` |
| **Section titles** | Bottom rule `1px solid var(--border)`, `letter-spacing: 0.08em`, uppercase mono kicker above |
| **Timeline dot glow** | `box-shadow: 0 0 0 4px var(--bg-deep), 0 0 12px <type-glow>` — dot color matches the act type |
| **Down marker** | Any round where a PC hit 0 HP gets a `--rose` left border on that `<li>` — the gauntlet's near-death beats are the story |

## Layout

| Setting | Value |
|---------|-------|
| **Max width** | 860px |
| **Body font size** | 16px |
| **Line height** | 1.7 |
| **Card padding** | 24–28px |
| **Card border-radius** | 8px |
| **Section spacing** | 60px margin-bottom |

## Readability Principles

- Cinzel Decorative on the `<h1>` only; everything else is Inter
- Heading weight 600, never 700
- `--text-dim` (`#a2978a`) passes WCAG AA against `--bg-deep` at 7.1:1
- Max content width 860px
- Line height 1.7 for body text
- Paragraph spacing 12px minimum
- List item padding 8px vertical minimum
