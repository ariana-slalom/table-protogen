# context.md — Table

## What This Project Is
Table is a mobile-first dinner party card game. Not an app that happens 
to work on mobile — a phone-native experience designed to live at the 
table, passed between players, used in dim light with one hand free.

The form factor is the constraint and the concept. Everything — 
typography scale, touch targets, gesture vocabulary, color contrast — 
is calibrated for that exact context.

## Core Belief
Food-obsessed people have a specific social energy that no existing 
party game is built for. They're opinionated, curious, a little 
competitive about taste, and they want to laugh. Table is for that 
room. Not for everyone — for them.

## User
**Primary:** Foodie, 25–45. Hosting or attending a dinner party, 
tasting, or supper club. Culturally literate, aesthetically aware. 
Has opinions about olive oil. Will immediately judge bad typography.

**In-context posture:** Seated, one-handed, ambient noise, dim light, 
probably one or two drinks in. Not reading. Glancing and acting.

## Design Philosophy
- Dark mode default — higher contrast in candlelight, truer to aesthetic
- Cards are physical objects — weight, shadow, swipe gesture all 
  reinforce the metaphor
- No onboarding walls — one instruction card, then play
- Every screen should feel like it belongs in a well-designed restaurant
- UI chrome is minimal and recedes — the card content is the experience

## Key Decisions and Why

| Decision | Rationale |
|---|---|
| Swipe to advance | Matches physical deck metaphor; natural one-handed gesture |
| Card Zero instruction screen | Zero friction onboarding — one surface, one action |
| No host/player mode | Single-device pass-around is simpler and truer to the format |
| Dark mode default | Dim lighting context; cream-on-dark reads better at the table |
| Local state only | No backend needed; game state is ephemeral and social |
| Cormorant Garamond | Editorial weight, food-world connotations, beautiful at large scale |
| DM Sans for chrome | Clean contrast to serif; readable at small sizes |
| 40+ cards minimum | Deck needs to feel substantive in a 60–90 min session |

## What This Is Not
- Not a trivia app with a food skin
- Not a broad party game (no Cards Against Humanity energy)
- Not a productivity or utility tool
- Not designed for repeat solo use — it's a social object

## Technical Constraints
- Vue 3 + Vite + TypeScript — no framework deviations
- Vuetify 3 for layout primitives; custom CSS for card aesthetics
- No Pinia — reactive state lives in composables or component-level refs
- All data is local mock data — no API calls
- Swipe handled via touch event listeners or a lightweight gesture 
  utility (no full library unless justified)
- Minimum 44px touch targets everywhere
- Vercel deployment, SPA rewrite rules in vercel.json