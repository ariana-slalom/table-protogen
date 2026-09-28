import type { Card, CategoryId } from '@/types'

export function shuffleDeck(cards: Card[]): Card[] {
  const arr = [...cards]
  for (let index = arr.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[arr[index], arr[swapIndex]] = [arr[swapIndex], arr[index]]
  }
  return arr
}

export function filterByCategory(cards: Card[], categoryId: CategoryId | 'all'): Card[] {
  if (categoryId === 'all') return cards
  return cards.filter(card => card.categoryId === categoryId)
}

export function buildDeck(cards: Card[], categoryId: CategoryId | 'all'): Card[] {
  return shuffleDeck(filterByCategory(cards, categoryId))
}