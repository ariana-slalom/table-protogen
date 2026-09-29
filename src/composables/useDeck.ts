import { ref, computed } from 'vue'
import type { Card, CategoryId } from '@/types'
import { CARDS } from '@/data/cards'
import { buildDeck, filterByCategory, shuffleDeck } from '@/utils/deck'

const END_OF_CATEGORY: Card = { id: 'end-category', categoryId: null, prompt: '', hasTimer: false, note: null }
const END_OF_DECK: Card = { id: 'end-deck', categoryId: null, prompt: '', hasTimer: false, note: null }
const activeCategoryId = ref<CategoryId | 'all'>('all')
const deck = ref<Card[]>([...buildDeck(CARDS, 'all'), END_OF_DECK])
const currentIndex = ref(0)
const currentCard = computed(() => deck.value[currentIndex.value])
const isFirst = computed(() => currentIndex.value === 0)
const isLast = computed(() => currentIndex.value === deck.value.length - 1)
const isEndOfCategory = computed(() => currentCard.value.id === 'end-category')
const isEndOfDeck = computed(() => currentCard.value.id === 'end-deck')
function next() { if (!isLast.value) currentIndex.value++ }
function prev() { if (!isFirst.value) currentIndex.value-- }
function setCategory(id: CategoryId | 'all') {
  activeCategoryId.value = id
  const filtered = id === 'all' ? shuffleDeck(CARDS) : shuffleDeck(filterByCategory(CARDS, id))
  deck.value = [...filtered, id === 'all' ? END_OF_DECK : END_OF_CATEGORY]
  currentIndex.value = 0
}
function reshuffleCategory() { setCategory(activeCategoryId.value) }
function shuffleAll() { setCategory('all') }
export function useDeck() { return { deck, currentCard, currentIndex, activeCategoryId, isFirst, isLast, isEndOfCategory, isEndOfDeck, next, prev, setCategory, reshuffleCategory, shuffleAll } }