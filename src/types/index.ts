export type CategoryId =
  | 'taste'
  | 'would-you-rather'
  | 'hot-take'
  | 'chefs-table'
  | 'story'

export interface Category {
  id: CategoryId
  label: string
  color: string
  icon: string
}

export interface Card {
  id: string
  categoryId: CategoryId | null
  prompt: string
  hasTimer: boolean
  timerSeconds?: number
  note?: string
}

export interface DeckState {
  activeCategoryId: CategoryId | 'all'
  currentIndex: number
  deck: Card[]
}