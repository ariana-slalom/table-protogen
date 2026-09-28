import type { Category } from '@/types'

export const CATEGORIES: Category[] = [
  { id: 'taste', label: 'Taste', color: 'var(--color-cat-taste)', icon: 'mdi-silverware-fork-knife' },
  { id: 'would-you-rather', label: 'Would You Rather', color: 'var(--color-cat-wyr)', icon: 'mdi-swap-horizontal' },
  { id: 'hot-take', label: 'Hot Take', color: 'var(--color-cat-hottake)', icon: 'mdi-fire' },
  { id: 'chefs-table', label: "Chef's Table", color: 'var(--color-cat-chefs)', icon: 'mdi-chef-hat' },
  { id: 'story', label: 'Story', color: 'var(--color-cat-story)', icon: 'mdi-book-open-page-variant' }
]