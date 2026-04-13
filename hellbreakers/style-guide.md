# Session Recap Style Guide — Hellbreakers (Rise Up Isger)

---

## Theme

- **Mood**: Infernal-rebellion gothic — revolution against Chelaxian tyranny, Milani's rose against Asmodean fire, ember and ash with gold highlights. Dark but warm, not oppressive.
- **Color Mode**: Dark (burgundy-black base, not pure black)
- **Ambient Effect**: Ember flicker — low, slow pulses of rose and gold glow from the corners, like distant forge-light or lantern embers
- **Ambient Animation**: `ember-flicker 9s ease-in-out infinite alternate`, opacity 0.5 → 0.85

## Fonts

| Role | Font | Weight | Size |
|------|------|--------|------|
| **Title (h1 only)** | Cinzel Decorative | 700 | clamp(30px, 5.5vw, 48px) |
| **Body text** | Inter | 400 | 16px |
| **Headings (h2-h4, card names)** | Inter | 600 | 15-21px |
| **Mono (tags, timestamps, pills)** | JetBrains Mono | 400 | 10-12px |
| **Google Fonts import** | `@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap')` | — | — |

## Color Palette

### Base

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deep` | `#1d151a` | Page background — deep burgundy-black (not pure black; carries the warm rebellion tone) |
| `--bg-card` | `#2a1e24` | Card/panel background — raised burgundy |
| `--bg-card-hover` | `#342630` | Card hover state |
| `--border` | `#4a3640` | Borders, dividers — muted wine |
| `--border-bright` | `#6a4650` | Active/bright borders, hover accents |
| `--text` | `#ece4e0` | Body text — warm off-white |
| `--text-dim` | `#b4a49c` | Secondary text, captions (WCAG AA compliant against `--bg-deep`) |
| `--text-bright` | `#faf2ec` | Headings, emphasis — ivory |

### Background Gradients

```css
background-image:
  radial-gradient(ellipse at 15% 10%, #c0304814 0%, transparent 45%),
  radial-gradient(ellipse at 85% 85%, #c8905014 0%, transparent 50%),
  radial-gradient(ellipse at 50% 50%, #3a2a2e10 0%, transparent 60%);
```

### Ambient Effect

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 20% 95%, #d65a2812 0%, transparent 45%),
    radial-gradient(ellipse at 75% 5%, #c0304810 0%, transparent 50%);
  animation: ember-flicker 9s ease-in-out infinite alternate;
  z-index: 0;
}

@keyframes ember-flicker {
  0%   { opacity: 0.5; }
  100% { opacity: 0.85; }
}
```

### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--rose` | `#c03048` | **Primary accent** — Milani's rose, Combat, danger, cliffhangers |
| `--rose-bright` | `#e04060` | Cliffhanger highlights, bright rose |
| `--rose-glow` | `#c0304830` | Rose glow (hex + alpha) |
| `--gold` | `#c89050` | Loot, faction, the Hellbreakers' cause — burnished gold |
| `--gold-dim` | `#9a6c38` | Muted gold accent |
| `--gold-glow` | `#c8905028` | Gold glow |
| `--ember` | `#d65a28` | Mystery, infernal, forge — ember orange |
| `--ember-glow` | `#d65a2824` | Ember glow |
| `--amber` | `#e8b560` | Highlight text, magical loot names |
| `--amber-glow` | `#e8b56022` | Amber glow |
| `--violet` | `#8a5aa4` | Roleplay, arcane — twilight violet |
| `--violet-glow` | `#8a5aa422` | Roleplay glow |
| `--teal` | `#4a9088` | Exploration, puzzles, divine — jade teal |
| `--teal-glow` | `#4a908822` | Teal glow |
| `--jade` | `#5a9060` | Healing, nature, alchemy — herb green |
| `--jade-glow` | `#5a906022` | Jade glow |
| `--rust` | `#b06030` | Construct, inventor, machine — rust |
| `--rust-glow` | `#b0603022` | Rust glow |
| `--ivory` | `#d8cab0` | Steel, blades, honor — cool ivory |
| `--ivory-glow` | `#d8cab022` | Ivory glow |

### Character Colors

| Character | Color | Token | Hex | Reasoning |
|-----------|-------|-------|-----|-----------|
| **Bai Jian** (Dueling Fighter) | Ivory | `--ivory` | `#d8cab0` | 白剑 "white blade" — the jian, silver, steel, Tian honor |
| **Cyrathul** (Thaumaturge) | Violet | `--violet` | `#8a5aa4` | The purple dragon — Mirror Cloak, lunar observatory, twilight |
| **Panacea** (Witch — Divine) | Teal | `--teal` | `#4a9088` | Catfolk witch, Paradox of Opposites, divine tradition, cool healer |
| **Moob** (Alchemist) | Jade | `--jade` | `#5a9060` | Goblin alchemist — elixirs, bombs, herbs, acid |
| **Fang** (Inventor — Wing) | Rust | `--rust` | `#b06030` | Goblin inventor, wolf-motorcycle construct, fire from Wing's tailpipe |

## Component Notes

| Component | Notes |
|-----------|-------|
| **Header decoration** | Single `✦` (sparkle) above h1 in `--rose` with `text-shadow: 0 0 16px var(--rose-glow)`. Small sparkle also prepended to every h2 via `::before` |
| **Combat box** | `background: linear-gradient(135deg, #2a1e24, #32202a)`, `border-left: 3px solid var(--rose)`, `box-shadow: inset 0 0 24px #c0304814` |
| **Combat stats inner panel** | `background: #160f12` (slightly darker than card), `border: 1px solid var(--border)` |
| **Magical loot** | `border-color: var(--gold-dim)`, `background: linear-gradient(135deg, #2a1e24, #2f2418)`, `box-shadow: inset 0 0 20px var(--gold-glow)`. Name text in `--amber` |
| **Blockquote** | `border-left: 3px solid var(--gold-dim)`, `background: #c0304808` (very faint rose wash), italic text |
| **Section titles (h2)** | Uppercase, `letter-spacing: 2.2px`, prepended `✦` in `--rose`, `border-bottom: 1px solid var(--border)` |
| **Timeline dot glow** | Matches accent: rose (combat), violet (rp), teal (explore), gold (social/faction), ember (mystery). `box-shadow: 0 0 10px [accent]-glow` |
| **Card hover** | `border-color: var(--border-bright)`, `box-shadow: 0 4px 18px #00000040` |
| **XP / faction banner** | `border: 1px solid var(--gold-dim)`, `box-shadow: 0 0 20px var(--gold-glow)`, gold mono text, amber strong |
| **Open-threads list bullets** | Custom `➤` in `--rose` via `::before` instead of default disc |
| **Cliffhanger box** | `background: linear-gradient(135deg, #2a1418, #3a181c)`, `border: 1px solid var(--rose)`, `border-left: 4px solid var(--rose)`, `box-shadow: 0 0 40px var(--rose-glow)`. Inner radial ember glow overlay. Big line uses Cinzel Decorative at 22px |
| **Pax's Notes / Journal section** | `background: #3a2a30` (lighter than card — visually distinct), `border-left: 4px solid var(--gold)`, `box-shadow: inset 0 0 32px var(--gold-glow), 0 4px 20px #00000040`. Headings in `--amber`, dashed divider under intro |

## Layout

| Setting | Value |
|---------|-------|
| **Max width** | 860px |
| **Body font size** | 16px |
| **Line height** | 1.7 |
| **Card padding** | 20-28px |
| **Card border-radius** | 6px (slightly tighter than other campaigns — suits the inked/engraved tone) |
| **Section spacing** | 56-60px margin-bottom |
| **Container padding** | `60px 28px 120px` |

## Composition Bar Default Colors

When drawing the session composition bar, use these mappings (different from other campaigns — roleplay as primary since Hellbreakers is a 50/50 RP/combat AP):

| Segment | Color | Token |
|---------|-------|-------|
| Roleplay | violet | `--violet` |
| Combat | rose | `--rose` |
| Exploration | teal | `--teal` |
| Faction / Social | gold | `--gold` |
| Loot / Mystery | ember | `--ember` |

## Readability Principles

- **Cinzel Decorative used ONLY for the h1 title** (and optionally the cliffhanger's big punch line) — nowhere else
- All other headings and body use **Inter** (clean, geometric sans-serif — neutral and legible against the dark base)
- Heading weight: **600 (semibold)**, not 700 (bold). Cinzel is the exception at 700.
- `--text-dim` (#b4a49c) passes WCAG AA against `--bg-deep` (#1d151a) — roughly 7.8:1 contrast
- Max content width **860px** for comfortable line length
- Line height **1.7** for body text
- List item padding **7-9px** vertical minimum
- The dark background is **burgundy, not black** — keep warmth in every panel
- **Do not use pure red (#ff0000) or pure black (#000000) anywhere.** Use `--rose` for red accents and `--bg-deep` for "black" panels

## Tone Guidance (for writing, not just color)

- **Infernal but warm**: the Hellbreakers are rebels fighting fire with fire. The palette should read as *lit* rather than *dark*. Roses bloom in ash.
- **Faction accents lean gold, not silver**: Milani's symbol is a rose on gold, not cold steel
- **Combat reads red/rose, not ember**: keep ember for mystery/infernal/trap content so combat stays visually distinct from cult/devil stuff
- **Character card left borders** are how the eye tracks who did what — match them consistently to the Character Colors table above in every recap
