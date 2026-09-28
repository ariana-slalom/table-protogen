# BRIEF.md — Table

## Project Summary
Table is a mobile-first dinner party card game for food-obsessed people. 
Players swipe through cards on a shared phone, reading prompts aloud and 
playing as a group between courses. Designed for one hand, dim lighting, 
and ambient noise — beautiful enough to leave on the table.

## Target User
Foodies aged 25–45. Hosting or attending a dinner party, tasting, or 
supper club. Phone passed between players. One hand free, the other 
holding a glass. Two drinks in. Not reading instructions.

## Mobile Context
- Device: ~390px viewport, touch-only primary interaction
- Lighting: dim ambient, candlelight
- Posture: seated, one-handed, glancing
- Session: 20–90 minutes, episodic — players dip in and out

## Core Flow
1. App opens to a single instruction card ("Card Zero") — brief, elegant, 
   one swipe to start
2. Swipe right advances to the next card; swipe left goes back
3. Category selector accessible from main view — group can filter by vibe 
   or shuffle all
4. Cards are drawn in sequence within a category or randomly across all

## Card Categories
- **Taste** — sensory and palate challenges
- **Would You Rather** — food-specific dilemmas
- **Hot Take** — one player shares, table votes
- **Chef's Table** — trivia and knowledge
- **Story** — short prompts passed around the table

## Key Interactions
- Swipe to advance/go back through deck
- Category filter — accessible, not required
- Shuffle all mode — random across categories
- Timer on select card types (60s)
- Manual score tally — optional, lightweight

## Design Intent
Warm, editorial. Linen-and-candlelight. A beautifully typeset card game 
meets a great restaurant's menu. Dark mode default. Every visual decision 
should feel considered and tactile — not generic UI kit.

### Color Tokens
- Background: `#1A1713` (dark warm near-black)
- Surface: `#2A2420` (card surface)
- Cream: `#F7F2E8` (primary text on dark)
- Terracotta: `#C4622D` (accent, CTAs)
- Gold: `#C9973A` (category highlights, icons)
- Ink: `#1C1C1A` (text on light surfaces)

### Typography
- Serif: Cormorant Garamond — card text, headings
- Sans: DM Sans — UI chrome, labels, metadata

## Scope Decisions
- Single-device pass-around only — no host/player mode split
- No backend, no auth, no Pinia — local Vue state only
- All card content invented — minimum 8 cards per category (40+ total)
- Responsive: mobile-first, desktop scales gracefully

## What Success Looks Like
A first-time player swipes the instruction card, immediately understands 
the game, and draws a card that makes the table laugh or argue. No 
explanation needed. No friction. Just pull it out and play.

## Tech Stack
Vue 3 + Vite + TypeScript  
Vuetify 3 + @mdi/font  
Google Fonts (Cormorant Garamond, DM Sans) via index.html  
Vercel deployment with SPA rewrite rules