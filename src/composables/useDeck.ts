import { computed, ref } from 'vue'
import type { Card, CategoryId } from '@/types'
import { CARDS } from '@/data/cards'
import { buildDeck } from '@/utils/deck'

const CARD_ZERO: Card = {
  id: 'card-zero',
  categoryId: null,
  prompt: 'Pull it out. Pass it around. Read the card aloud. Play as a group.',
  hasTimer: false,
  note: 'Swipe left to begin →'
}

const activeCategoryId = ref<CategoryId | 'all'>('all')
const deck = ref<Card[]>([CARD_ZERO, ...buildDeck(CARDS, 'all')])
const currentIndex = ref(0)
const currentCard = computed(() => deck.value[currentIndex.value])
const isFirst = computed(() => currentIndex.value === 0)
const isLast = computed(() => currentIndex.value === deck.value.length - 1)

function next() { if (!isLast.value) currentIndex.value++ }
function prev() { if (!isFirst.value) currentIndex.value-- }
function setCategory(id: CategoryId | 'all') {
  activeCategoryId.value = id
  deck.value = [CARD_ZERO, ...buildDeck(CARDS, id)]
  currentIndex.value = 0
}

export function useDeck() {
  return { deck, currentCard, currentIndex, activeCategoryId, isFirst, isLast, next, prev, setCategory }
}