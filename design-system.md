# design-system.md — Table

## Color Tokens

### Base Palette
| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#1A1713` | App background, dark base |
| `--color-surface` | `#2A2420` | Card surface, elevated containers |
| `--color-surface-raised` | `#332C28` | Modals, overlays, active states |
| `--color-cream` | `#F7F2E8` | Primary text on dark, card face |
| `--color-cream-muted` | `#B8B0A4` | Secondary text, metadata, labels |
| `--color-terracotta` | `#C4622D` | Primary accent, CTAs, active nav |
| `--color-gold` | `#C9973A` | Category highlights, icons, timers |
| `--color-ink` | `#1C1C1A` | Text on light surfaces (card backs) |

### Category Colors
All warm, earthy — distinct but never clinical.
| Category | Token | Hex |
|---|---|---|
| Taste | `--color-cat-taste` | `#7A9E7E` (sage green) |
| Would You Rather | `--color-cat-wyr` | `#C4622D` (terracotta) |
| Hot Take | `--color-cat-hottake` | `#C9973A` (gold) |
| Chef's Table | `--color-cat-chefs` | `#6B8FA8` (slate blue) |
| Story | `--color-cat-story` | `#9E7E6B` (warm taupe) |

---

## Typography

### Fonts
- **Cormorant Garamond** — card text, headings, category labels
- **DM Sans** — UI chrome, buttons, metadata, nav

### Scale
| Role | Font | Size | Weight | Line Height |
|---|---|---|---|---|
| Card text (primary) | Cormorant Garamond | 28px | 400 | 1.35 |
| Card text (large prompt) | Cormorant Garamond | 32px | 500 | 1.3 |
| Category label | Cormorant Garamond | 13px | 600 | 1 |
| Section heading | Cormorant Garamond | 22px | 500 | 1.2 |
| UI label / button | DM Sans | 13px | 500 | 1 |
| Metadata / count | DM Sans | 11px | 400 | 1 |
| Timer | DM Sans | 48px | 300 | 1 |

### Rules
- Cormorant Garamond always letter-spaced slightly: `letter-spacing: 0.01em`
- Category labels: all-caps, `letter-spacing: 0.12em`
- No font sizes below 13px anywhere — dim lighting constraint
- Card prompt text never wraps to more than 4 lines — shorten copy if needed

---

## Spacing & Layout

### Base Unit
`8px` — all spacing is multiples of 8.

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | 4px | Icon gaps, tight inline |
| `--space-sm` | 8px | Component internals |
| `--space-md` | 16px | Card padding, section gaps |
| `--space-lg` | 24px | Between major sections |
| `--space-xl` | 40px | Page-level breathing room |

### Touch Targets
- Minimum 44×44px for all interactive elements — no exceptions
- Primary actions (swipe zone, category chips): full-width or 
  near-full-width where possible
- Bottom nav/controls: minimum 56px height

### Card Dimensions
- Width: `calc(100vw - 48px)` — 24px margin each side
- Max width: `420px` — centered on desktop
- Min height: `480px` — enough presence to feel like a card
- Border radius: `16px`
- Shadow: `0 8px 32px rgba(0,0,0,0.45)` — weight and depth

---

## Component Patterns

### Card
┌─────────────────────────────┐
│ [CATEGORY LABEL] │ ← 13px caps, category color, top-left
│ │
│ │
│ Card prompt text here │ ← Cormorant, 28–32px, centered
│ wraps naturally up to │
│ four lines max │
│ │
│ │
│ [icon / #] │ ← card number or category icon, bottom
└─────────────────────────────┘
- Background: `--color-surface`
- Text: `--color-cream`
- Category label: category color token
- Subtle grain texture via CSS (see below)

### Card Texture (CSS)
```css
.card {
  background-color: var(--color-surface);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
}
```

### Swipe Gesture Behavior
- Swipe right → advance to next card
- Swipe left → go back one card
- Visual: card translates on drag, snaps forward or returns on release
- Threshold: 80px horizontal movement to commit the swipe
- On commit: card exits with momentum (ease-out, ~250ms)
- Next card visible underneath, slightly scaled down (scale 0.96)

### Category Selector
- Horizontal scroll row of chips — no wrapping
- Chip: `--color-surface-raised`, active state uses category color
- "All" chip always first
- DM Sans 13px, 500 weight

### Timer
- Full-bleed overlay on card when active
- DM Sans 48px, `--color-gold`
- Start/stop tap anywhere on overlay
- Counts down from 60s, pulses last 10s

### Instruction Card (Card Zero)
- Same card dimensions and surface as play cards
- Cormorant Garamond, slightly smaller (22px)
- Copy: concise — 3 lines max
- "Swipe to begin →" as sole CTA, DM Sans, muted
- No skip button — the swipe IS the skip

---

## Motion & Animation

| Interaction | Behavior | Duration | Easing |
|---|---|---|---|
| Swipe commit | Card exits, next enters from behind | 250ms | ease-out |
| Swipe cancel | Card snaps back to center | 180ms | ease-in-out |
| Category switch | Stack fades, resets to first card | 200ms | ease |
| Timer pulse | Scale 1→1.04→1, gold→terracotta | 600ms | ease-in-out |
| App load | Fade in from bg color | 300ms | ease |

---

## Tone of Voice

- Card prompts: direct, specific, a little cheeky — never juvenile
- No exclamation points in card text
- No emoji anywhere in the UI
- UI labels: lowercase where possible — "shuffle all" not "Shuffle All"
- Error states (if any): dry, brief — "nothing here" not "Oops!"