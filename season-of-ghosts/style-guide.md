# Session Recap Style Guide — Season of Ghosts (Willowshore, Shenmen)

---

## Theme

- **Mood**: Tian Xia haunted-village fog — Korean/Chinese ghost story, paper-lantern warm gold against ink-wash indigo, Pharasma's pale-cyan light against the Crimson Stain's red. A small village that cannot leave, surrounded by spirits, slowly uncovering what's wrong.
- **Color Mode**: Dark (deep indigo-black base, not pure black)
- **Ambient Effect**: Slow fog-breathe — low-opacity pulses of pale cyan from one corner and crimson from the opposite, representing the spiritual duality of the campaign
- **Ambient Animation**: `fog-breathe 12s ease-in-out infinite alternate`, opacity 0.4 → 0.7

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
| `--bg-deep` | `#0f1418` | Page background — deep ink-wash indigo, near-black but with cool blue undertone |
| `--bg-card` | `#171f26` | Card/panel background — raised indigo |
| `--bg-card-hover` | `#1f2832` | Card hover state |
| `--border` | `#2a3540` | Borders, dividers — muted slate |
| `--border-bright` | `#3e4a58` | Active/bright borders, hover accents |
| `--text` | `#e2e8ee` | Body text — cool off-white |
| `--text-dim` | `#a0a8b2` | Secondary text, captions (WCAG AA compliant against `--bg-deep`) |
| `--text-bright` | `#f0f4f8` | Headings, emphasis — pale ivory |

### Background Gradients

```css
background-image:
  radial-gradient(ellipse at 10% 5%, #4a708818 0%, transparent 50%),
  radial-gradient(ellipse at 90% 90%, #a8284018 0%, transparent 50%),
  radial-gradient(ellipse at 50% 60%, #1a232c14 0%, transparent 60%);
```

### Ambient Effect (fog-breathe)

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 15% 90%, #4a708814 0%, transparent 50%),
    radial-gradient(ellipse at 85% 10%, #a8284010 0%, transparent 50%);
  animation: fog-breathe 12s ease-in-out infinite alternate;
  z-index: 0;
}

@keyframes fog-breathe {
  0%   { opacity: 0.4; }
  100% { opacity: 0.7; }
}
```

### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--crimson` | `#a82840` | **Primary danger accent** — the Crimson Stain, Combat, danger, cliffhangers, Kugaptee |
| `--crimson-bright` | `#c83858` | Cliffhanger highlights, bright crimson |
| `--crimson-glow` | `#a8284030` | Crimson glow (hex + alpha) |
| `--cyan` | `#4a7088` | **Pharasma's color** — divine, the cycle, Boneyard, Jun-Yeong's bloodline |
| `--cyan-bright` | `#6890a8` | Bright cyan / divine emphasis |
| `--cyan-glow` | `#4a708824` | Cyan glow |
| `--lantern` | `#d4a050` | Lantern gold — Eternal Lantern, loot, faction, warmth |
| `--lantern-dim` | `#a07838` | Muted lantern gold |
| `--lantern-glow` | `#d4a05024` | Lantern glow |
| `--amber` | `#e8be78` | Highlight text, magical loot names |
| `--amber-glow` | `#e8be7822` | Amber glow |
| `--violet` | `#7a5a98` | Roleplay, dreams, occult, shadow |
| `--violet-glow` | `#7a5a9822` | Roleplay glow |
| `--jade` | `#5a8870` | Healing, nature, the Specterwood (when not malevolent) |
| `--jade-glow` | `#5a887022` | Jade glow |
| `--shadow` | `#46506a` | Shadow / Wayang ancestry / Mo — cool steel-shadow |
| `--shadow-glow` | `#46506a22` | Shadow glow |
| `--blood-orange` | `#c46838` | Mystery / fire / the lumber camp threat — warm orange-rust |
| `--blood-orange-glow` | `#c4683822` | Blood orange glow |

### Character Colors

| Character | Color | Token | Hex | Reasoning |
|-----------|-------|-------|-----|-----------|
| **Mo** (Wayang Rogue) | Shadow | `--shadow` | `#46506a` | Wayang heritage from the Netherworld, Shadow of the Smith, shadow-folk |
| **Ming Bao** (Monk + Bard) | Jade | `--jade` | `#5a8870` | Tian-Shu human, monastic, herb-green grounded — also Bard dedication carries some warmth |
| **Jun-Yeong** (Psychopomp Sorcerer) | Cyan | `--cyan` | `#4a7088` | Pharasma's bloodline, Boneyard, Jeoseung Saja robes |
| **Mingxi** (Magus — absent) | Amber | `--amber` | `#e8be78` | Half-Tengu Magus, spike-damage gold (use only for memorial mentions) |
| **Dot** (Druid — absent) | Jade | `--jade` | `#5a8870` | Peach Leshy druid (use only for memorial mentions; if both present in same recap, use Mingxi=amber and Ming Bao gets a different shade) |
| **Atlacoya** (Investigator — absent today) | Violet | `--violet` | `#7a5a98` | Chameleon lizardfolk, alchemical sciences, Crimson Stain visions |

## Component Notes

| Component | Notes |
|-----------|-------|
| **Header decoration** | Single `❀` (cherry-blossom-ish ornament) above h1 in `--lantern` with `text-shadow: 0 0 16px var(--lantern-glow)`. Small `❀` prepended to every h2 via `::before` |
| **Combat box** | `background: linear-gradient(135deg, #171f26, #1c1a22)`, `border-left: 3px solid var(--crimson)`, `box-shadow: inset 0 0 24px var(--crimson-glow)` |
| **Combat stats inner panel** | `background: #0a0e12` (slightly darker than card), `border: 1px solid var(--border)` |
| **Magical loot** | `border-color: var(--lantern-dim)`, `background: linear-gradient(135deg, #171f26, #20231a)`, `box-shadow: inset 0 0 20px var(--lantern-glow)`. Name text in `--amber` |
| **Blockquote** | `border-left: 3px solid var(--lantern-dim)`, `background: #4a708808` (very faint cyan wash), italic text |
| **Section titles (h2)** | Uppercase, `letter-spacing: 2.2px`, prepended `❀` in `--lantern`, `border-bottom: 1px solid var(--border)` |
| **Timeline dot glow** | Matches accent: crimson (combat), violet (rp), cyan (explore/divine), lantern (social/faction), blood-orange (mystery). `box-shadow: 0 0 10px [accent]-glow` |
| **Card hover** | `border-color: var(--border-bright)`, `box-shadow: 0 4px 18px #00000060` |
| **XP / faction banner** | `border: 1px solid var(--lantern-dim)`, `box-shadow: 0 0 20px var(--lantern-glow)`, gold mono text, amber strong |
| **Open-threads list bullets** | Custom `❀` in `--crimson` via `::before` instead of default disc |
| **Cliffhanger box** | `background: linear-gradient(135deg, #1c1014, #251018)`, `border: 1px solid var(--crimson)`, `border-left: 4px solid var(--crimson)`, `box-shadow: 0 0 40px var(--crimson-glow)`. Big line uses Cinzel Decorative at 22px |
| **Pax's Notes / Journal section** | `background: #1f2832` (lighter than card), `border-left: 4px solid var(--lantern)`, `box-shadow: inset 0 0 32px var(--lantern-glow), 0 4px 20px #00000060`. Headings in `--amber`, dashed divider under intro |

## Layout

| Setting | Value |
|---------|-------|
| **Max width** | 860px |
| **Body font size** | 16px |
| **Line height** | 1.7 |
| **Card padding** | 20-28px |
| **Card border-radius** | 6px |
| **Section spacing** | 56-60px margin-bottom |
| **Container padding** | `60px 28px 120px` |

## Composition Bar Default Colors

When drawing the session composition bar, use these mappings (Season of Ghosts is mystery-heavy with significant RP):

| Segment | Color | Token |
|---------|-------|-------|
| Roleplay | violet | `--violet` |
| Combat | crimson | `--crimson` |
| Exploration | cyan | `--cyan` |
| Social / Town | lantern | `--lantern` |
| Mystery / Lore | blood-orange | `--blood-orange` |

## Readability Principles

- **Cinzel Decorative used ONLY for the h1 title** (and optionally the cliffhanger's big punch line) — nowhere else
- All other headings and body use **Inter** (clean, geometric sans-serif — neutral against the cool ink-wash base)
- Heading weight: **600 (semibold)**, not 700 (bold). Cinzel is the exception at 700.
- `--text-dim` (#a0a8b2) passes WCAG AA against `--bg-deep` (#0f1418) — roughly 8.5:1 contrast
- Max content width **860px** for comfortable line length
- Line height **1.7** for body text
- List item padding **7-9px** vertical minimum
- The dark background is **deep ink-wash indigo, not pure black** — keep cool atmosphere
- **Do not use pure red (#ff0000) or pure black (#000000) anywhere.** Use `--crimson` for red accents and `--bg-deep` for "black" panels

## Tone Guidance (for writing, not just color)

- **Foggy and watchful**: the campaign is small-town horror. The palette should feel like *low lantern-light through fog* — visible, but not bright. The eye should rest on lantern-gold, not be hit by it.
- **Pharasma is the structuring counterforce**: cyan accents around Jun-Yeong, divine elements, and the cycle of life-and-death imagery. Cyan = "the way things should be."
- **Crimson is wrongness, not bloodshed**: the Crimson Stain is metaphysical violation, not gore. Use crimson for *Kugaptee* references, the red butterflies, the cult, and the cliffhanger box. Don't over-use it for routine combat — keep it pointed.
- **Lantern gold for community**: the village holding itself together (loot, social, Eternal Lantern, NPC ties). Mo's foundling-relationship with Willowshore is a lantern theme, not a shadow theme.
- **Shadow accent for Mo specifically**: the Wayang heritage and shadow-of-the-smith. The character card and spotlight border for Mo should read as cool dark steel.
- **Avoid horror clichés**: no dripping fonts, no red splatters, no skull motifs. The fear in this campaign is *quiet erasure*, not gore. Visual restraint amplifies the dread.
