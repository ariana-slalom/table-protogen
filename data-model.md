# data-model.md — Table

## TypeScript Interfaces

```typescript
// src/types/index.ts

export type CategoryId = 
  | 'taste' 
  | 'would-you-rather' 
  | 'hot-take' 
  | 'chefs-table' 
  | 'story'

export interface Category {
  id: CategoryId
  label: string
  color: string // CSS custom property reference
  icon: string  // MDI icon name
}

export interface Card {
  id: string          // e.g. 'taste-01'
  categoryId: CategoryId
  prompt: string
  hasTimer: boolean   // if true, timer affordance shown
  timerSeconds?: number // defaults to 60 if hasTimer true
  note?: string       // optional host note, shown smaller below prompt
}

export interface DeckState {
  activeCategoryId: CategoryId | 'all'
  currentIndex: number
  deck: Card[]        // ordered list for current session
}
```

---

## Category Registry

```typescript
// src/data/categories.ts

import type { Category } from '@/types'

export const CATEGORIES: Category[] = [
  {
    id: 'taste',
    label: 'Taste',
    color: 'var(--color-cat-taste)',
    icon: 'mdi-silverware-fork-knife'
  },
  {
    id: 'would-you-rather',
    label: 'Would You Rather',
    color: 'var(--color-cat-wyr)',
    icon: 'mdi-scale-balance'
  },
  {
    id: 'hot-take',
    label: 'Hot Take',
    color: 'var(--color-cat-hottake)',
    icon: 'mdi-fire'
  },
  {
    id: 'chefs-table',
    label: "Chef's Table",
    color: 'var(--color-cat-chefs)',
    icon: 'mdi-chef-hat'
  },
  {
    id: 'story',
    label: 'Story',
    color: 'var(--color-cat-story)',
    icon: 'mdi-book-open-variant'
  }
]
```

---

## Mock Card Content

```typescript
// src/data/cards.ts

import type { Card } from '@/types'

export const CARDS: Card[] = [

  // ── TASTE ──────────────────────────────────────────────────────────

  {
    id: 'taste-01',
    categoryId: 'taste',
    prompt: 'Name a flavor that sounds disgusting but tastes incredible.',
    hasTimer: false
  },
  {
    id: 'taste-02',
    categoryId: 'taste',
    prompt: 'Describe the texture of risotto without using any food words.',
    hasTimer: false
  },
  {
    id: 'taste-03',
    categoryId: 'taste',
    prompt: 'Blind taste round — host pours two oils. Everyone votes. Which is better, and why?',
    hasTimer: true,
    timerSeconds: 60,
    note: 'Host: any two oils works. EVOO vs neutral, or two EVOOs.'
  },
  {
    id: 'taste-04',
    categoryId: 'taste',
    prompt: 'Name something you\'ve eaten that genuinely had no flavor. Defend why you ate it anyway.',
    hasTimer: false
  },
  {
    id: 'taste-05',
    categoryId: 'taste',
    prompt: 'What\'s a smell that immediately makes you hungry, even when you\'re not?',
    hasTimer: false
  },
  {
    id: 'taste-06',
    categoryId: 'taste',
    prompt: 'Everyone at the table: rank salt, fat, acid, heat in order of importance. Defend your first choice.',
    hasTimer: false
  },
  {
    id: 'taste-07',
    categoryId: 'taste',
    prompt: 'Name a food pairing that sounds wrong but works perfectly. Convince the table.',
    hasTimer: false
  },
  {
    id: 'taste-08',
    categoryId: 'taste',
    prompt: 'Describe what umami tastes like to someone who\'s never heard the word.',
    hasTimer: false
  },
  {
    id: 'taste-09',
    categoryId: 'taste',
    prompt: 'What\'s the single most underrated ingredient in a professional kitchen? Make your case.',
    hasTimer: false
  },

  // ── WOULD YOU RATHER ───────────────────────────────────────────────

  {
    id: 'wyr-01',
    categoryId: 'would-you-rather',
    prompt: 'Only eat at Michelin-starred restaurants but never cook at home again — or — never eat out but become a technically excellent home cook?',
    hasTimer: false
  },
  {
    id: 'wyr-02',
    categoryId: 'would-you-rather',
    prompt: 'Give up cheese forever — or — give up wine forever?',
    hasTimer: false
  },
  {
    id: 'wyr-03',
    categoryId: 'would-you-rather',
    prompt: 'Always know every ingredient in your food — or — never know anything about what you\'re eating?',
    hasTimer: false
  },
  {
    id: 'wyr-04',
    categoryId: 'would-you-rather',
    prompt: 'Eat the same perfect meal every day for a year — or — eat something different every day but it\'s always just okay?',
    hasTimer: false
  },
  {
    id: 'wyr-05',
    categoryId: 'would-you-rather',
    prompt: 'Have the ability to cook anything flawlessly but lose all ability to taste — or — taste everything perfectly but never be able to cook?',
    hasTimer: false
  },
  {
    id: 'wyr-06',
    categoryId: 'would-you-rather',
    prompt: 'Eat only street food for the rest of your life — or — only tasting menus?',
    hasTimer: false
  },
  {
    id: 'wyr-07',
    categoryId: 'would-you-rather',
    prompt: 'Give up caffeine forever — or — give up alcohol forever?',
    hasTimer: false
  },
  {
    id: 'wyr-08',
    categoryId: 'would-you-rather',
    prompt: 'Have the palate of a Michelin-starred chef but a line cook\'s salary — or — the palate of someone who genuinely can\'t tell the difference but a budget for anywhere you want?',
    hasTimer: false
  },
  {
    id: 'wyr-09',
    categoryId: 'would-you-rather',
    prompt: 'Never eat dessert again — or — never eat a first course again?',
    hasTimer: false
  },

  // ── HOT TAKE ───────────────────────────────────────────────────────

  {
    id: 'hottake-01',
    categoryId: 'hot-take',
    prompt: 'Butter makes everything better. True or myth?',
    hasTimer: false,
    note: 'One player states their take. Table votes agree or disagree.'
  },
  {
    id: 'hottake-02',
    categoryId: 'hot-take',
    prompt: 'Fine dining is worth it. Make your case.',
    hasTimer: false,
    note: 'One player states their take. Table votes agree or disagree.'
  },
  {
    id: 'hottake-03',
    categoryId: 'hot-take',
    prompt: 'The best pizza is [blank]. Defend it.',
    hasTimer: false,
    note: 'Everyone fills in the blank. Table picks a winner.'
  },
  {
    id: 'hottake-04',
    categoryId: 'hot-take',
    prompt: 'Brunch is the most overrated meal. Agree or disagree?',
    hasTimer: false,
    note: 'One player states their take. Table votes agree or disagree.'
  },
  {
    id: 'hottake-05',
    categoryId: 'hot-take',
    prompt: 'A restaurant with bad service can still be a great meal. Make your case.',
    hasTimer: false,
    note: 'One player states their take. Table votes agree or disagree.'
  },
  {
    id: 'hottake-06',
    categoryId: 'hot-take',
    prompt: 'Nose-to-tail eating should be the norm, not a novelty. Agree or disagree?',
    hasTimer: false,
    note: 'One player states their take. Table votes agree or disagree.'
  },
  {
    id: 'hottake-07',
    categoryId: 'hot-take',
    prompt: 'The tasting menu format is dying. Good riddance or tragedy?',
    hasTimer: false,
    note: 'One player states their take. Table votes agree or disagree.'
  },
  {
    id: 'hottake-08',
    categoryId: 'hot-take',
    prompt: 'Cookbooks are more useful than cooking videos. True or myth?',
    hasTimer: false,
    note: 'One player states their take. Table votes agree or disagree.'
  },
  {
    id: 'hottake-09',
    categoryId: 'hot-take',
    prompt: 'The best version of any dish is almost always the simplest version. Agree or disagree?',
    hasTimer: false,
    note: 'One player states their take. Table votes agree or disagree.'
  },

  // ── CHEF'S TABLE ───────────────────────────────────────────────────

  {
    id: 'chefs-01',
    categoryId: 'chefs-table',
    prompt: 'What cuisine is mole from, and name its two most important ingredients?',
    hasTimer: false,
    note: 'Answer: Mexican. Chili peppers and chocolate (or chili peppers and any one of: nuts, seeds, tomato).'
  },
  {
    id: 'chefs-02',
    categoryId: 'chefs-table',
    prompt: 'Name five uses for rendered duck fat. Go.',
    hasTimer: true,
    timerSeconds: 60
  },
  {
    id: 'chefs-03',
    categoryId: 'chefs-table',
    prompt: 'What is the Maillard reaction and why does it matter?',
    hasTimer: false,
    note: 'Answer: A chemical reaction between amino acids and sugars under heat that creates browning, flavor, and aroma. It\'s why seared meat tastes different from boiled meat.'
  },
  {
    id: 'chefs-04',
    categoryId: 'chefs-table',
    prompt: 'What are the five French mother sauces?',
    hasTimer: false,
    note: 'Answer: Béchamel, Velouté, Espagnole, Hollandaise, Sauce Tomat.'
  },
  {
    id: 'chefs-05',
    categoryId: 'chefs-table',
    prompt: 'What does \'mise en place\' mean, and why do professional kitchens swear by it?',
    hasTimer: false,
    note: 'Answer: "Everything in its place." All ingredients prepped and ready before cooking begins. Reduces chaos, speeds service, prevents mistakes.'
  },
  {
    id: 'chefs-06',
    categoryId: 'chefs-table',
    prompt: 'Name three cheeses and identify their country of origin. No repeating countries.',
    hasTimer: true,
    timerSeconds: 60
  },
  {
    id: 'chefs-07',
    categoryId: 'chefs-table',
    prompt: 'What\'s the difference between a stock and a broth?',
    hasTimer: false,
    note: 'Answer: Stock is made from bones (collagen, body). Broth is made from meat (flavor, less body). Stock is the base; broth is more finished.'
  },
  {
    id: 'chefs-08',
    categoryId: 'chefs-table',
    prompt: 'What region of France is Champagne from, and what makes it legally Champagne?',
    hasTimer: false,
    note: 'Answer: The Champagne region northeast of Paris. Must use specific grapes (Chardonnay, Pinot Noir, Pinot Meunier), traditional method fermentation, and originate in the region.'
  },
  {
    id: 'chefs-09',
    categoryId: 'chefs-table',
    prompt: 'Name the four components of a classic vinaigrette — and the correct ratio.',
    hasTimer: false,
    note: 'Answer: Oil, acid (vinegar or citrus), emulsifier (mustard or egg), seasoning. Classic ratio: 3 parts oil to 1 part acid.'
  },

  // ── STORY ──────────────────────────────────────────────────────────

  {
    id: 'story-01',
    categoryId: 'story',
    prompt: 'Describe the best meal you\'ve ever eaten in exactly three sentences.',
    hasTimer: false
  },
  {
    id: 'story-02',
    categoryId: 'story',
    prompt: 'The worst thing you\'ve ever cooked — and what went wrong.',
    hasTimer: false
  },
  {
    id: 'story-03',
    categoryId: 'story',
    prompt: 'A food you hated as a child that you now love. What changed?',
    hasTimer: false
  },
  {
    id: 'story-04',
    categoryId: 'story',
    prompt: 'Describe a meal that had nothing to do with the food.',
    hasTimer: false
  },
  {
    id: 'story-05',
    categoryId: 'story',
    prompt: 'You\'re building your last dinner party menu. Four courses. What\'s on it and who\'s at the table?',
    hasTimer: false
  },
  {
    id: 'story-06',
    categoryId: 'story',
    prompt: 'A kitchen disaster that somehow worked out.',
    hasTimer: false
  },
  {
    id: 'story-07',
    categoryId: 'story',
    prompt: 'Name a food that is inseparable from a specific memory. Tell us both.',
    hasTimer: false
  },
  {
    id: 'story-08',
    categoryId: 'story',
    prompt: 'The most surprising thing you\'ve ever eaten. Would you eat it again?',
    hasTimer: false
  },
  {
    id: 'story-09',
    categoryId: 'story',
    prompt: 'You\'re opening a restaurant. One sentence: what is it, and why would someone cross town for it?',
    hasTimer: false
  }
]
```

---

## Deck Logic Notes
// src/utils/deck.ts — implement these functions

shuffleDeck(cards: Card[]): Card[]
→ Fisher-Yates shuffle, returns new array

filterByCategory(cards: Card[], categoryId: CategoryId | 'all'): Card[]
→ returns full array if 'all', filtered array otherwise

buildDeck(cards: Card[], categoryId: CategoryId | 'all'): Card[]
→ filter → shuffle → return
→ always prepend Card Zero (instruction card) at index 0
→ Card Zero is not part of CARDS array — it's injected at runtime

---

## Card Zero (Instruction Card)

```typescript
// Not in CARDS array — injected at runtime as deck[0]

const CARD_ZERO = {
  id: 'card-zero',
  categoryId: null,
  prompt: 'Pull out your phone. Pass it around. Read the card aloud. Play as a group.',
  hasTimer: false,
  note: 'Swipe to begin →'
}
```