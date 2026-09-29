<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useDeck } from '@/composables/useDeck'
import { usePlayers } from '@/composables/usePlayers'
import { CATEGORIES } from '@/data/categories'

const emit = defineEmits<{ menu: []; rules: [] }>()
const {
  deck, currentCard, currentIndex, activeCategoryId, isFirst, isLast,
  isEndOfCategory, isEndOfDeck, next, prev, setCategory, reshuffleCategory, shuffleAll
} = useDeck()
const { sessionPlayers, awardPoint } = usePlayers()

const threshold = 80
const dragX = ref(0)
const isDragging = ref(false)
const isExiting = ref(false)
const exitDirection = ref<'left' | 'right'>('left')
const showScoreRow = ref(false)
const showLeaderboard = ref(false)
const showDebate = ref(false)
const isDesktopDevice = !('ontouchstart' in window)
const cardContent = ref<HTMLElement | null>(null)
const showScrollFade = ref(false)
const scrollCueDirection = ref<'up' | 'down' | null>(null)

function updateScrollFade() {
  nextTick(() => {
    const content = cardContent.value
    if (!content) return
    const hasMoreBelow = content.scrollHeight - content.scrollTop > content.clientHeight + 2
    showScrollFade.value = hasMoreBelow
    scrollCueDirection.value = hasMoreBelow ? 'down' : content.scrollTop > 2 ? 'up' : null
  })
}

function onCardContentScroll() {
  const content = cardContent.value
  if (!content) return
  const hasMoreBelow = content.scrollHeight - content.scrollTop > content.clientHeight + 2
  showScrollFade.value = hasMoreBelow
  scrollCueDirection.value = hasMoreBelow ? 'down' : content.scrollTop > 2 ? 'up' : null
}

onMounted(updateScrollFade)
watch(() => currentCard.value.id, () => {
  nextTick(() => {
    if (cardContent.value) cardContent.value.scrollTop = 0
    updateScrollFade()
  })
})

function commitSwipe(direction: 'left' | 'right', action: () => void) {
  exitDirection.value = direction
  isExiting.value = true
  setTimeout(() => {
    action()
    dragX.value = 0
    isExiting.value = false
  }, 320)
}

function onTouchStart(event: TouchEvent) {
  const startX = event.touches[0].clientX
  isDragging.value = true

  function move(moveEvent: TouchEvent) {
    dragX.value = moveEvent.touches[0].clientX - startX
  }

  function end() {
    isDragging.value = false
    if (dragX.value < -threshold && !isLast.value) commitSwipe('left', next)
    else if (dragX.value > threshold && !isFirst.value) commitSwipe('right', prev)
    else dragX.value = 0
    document.removeEventListener('touchmove', move)
    document.removeEventListener('touchend', end)
  }

  document.addEventListener('touchmove', move, { passive: true })
  document.addEventListener('touchend', end)
}

function handleDesktopClick(event: MouseEvent) {
  if (!isDesktopDevice || isExiting.value || isEndOfCategory.value || isEndOfDeck.value) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  if (event.clientX - rect.left > rect.width / 2 && !isLast.value) commitSwipe('left', next)
  else if (event.clientX - rect.left <= rect.width / 2 && !isFirst.value) commitSwipe('right', prev)
}

const cardStyle = computed(() => {
  if (isExiting.value) {
    return {
      transform: `translateX(${exitDirection.value === 'left' ? '-28px' : '28px'}) rotate(${exitDirection.value === 'left' ? '-2deg' : '2deg'})`,
      transition: 'transform 0.28s ease-in, opacity 0.28s ease-in',
      opacity: '0'
    }
  }
  if (isDragging.value) return { transform: `translateX(${dragX.value}px) rotate(${dragX.value * 0.02}deg)`, transition: 'none' }
  return { transition: 'transform 0.22s ease-out' }
})

const category = computed(() => currentCard.value.categoryId ? CATEGORIES.find(item => item.id === currentCard.value.categoryId) : undefined)
const categoryLabel = computed(() => category.value?.label)
const categoryColor = computed(() => category.value?.color || 'var(--color-cream-muted)')
const categoriesVisible = computed(() => currentIndex.value > 0)
const sortedPlayers = computed(() => [...sessionPlayers.value].sort((first, second) => second.score - first.score))
const debateSources = [
  { label: 'Serious Eats - The Food Lab', url: 'https://www.seriouseats.com' },
  { label: 'The Noma Guide to Fermentation', url: 'https://www.penguinrandomhouse.com/books/569799' },
  { label: 'Salt Fat Acid Heat - Samin Nosrat', url: 'https://www.saltfatacidheat.com' }
]

function award(id: string) {
  awardPoint(id)
  showScoreRow.value = false
}
</script>

<template>
  <div class="game">
    <div class="top-bar">
      <button class="icon-btn" type="button" aria-label="Main menu" @click="emit('menu')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5Z" stroke="var(--color-cream-muted)" stroke-width="1.25" />
          <path d="M8.5 10h7M8.5 14h7" stroke="var(--color-cream-muted)" stroke-width="1.25" stroke-linecap="round" />
        </svg>
      </button>
      <button class="icon-btn" type="button" aria-label="Leaderboard" @click="showLeaderboard = true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5Z" stroke="var(--color-cream-muted)" stroke-width="1.25" />
          <path d="M8 15v-3M12 15V9M16 15v-6" stroke="var(--color-cream-muted)" stroke-width="1.25" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <Transition name="fade">
      <div v-if="categoriesVisible" class="category-strip">
        <button class="cat-chip" :class="{ active: activeCategoryId === 'all' }" type="button" @click="setCategory('all')">mix</button>
        <button v-for="categoryItem in CATEGORIES" :key="categoryItem.id" class="cat-chip" type="button" :class="{ active: activeCategoryId === categoryItem.id }" :style="activeCategoryId === categoryItem.id ? { background: categoryItem.color, borderColor: categoryItem.color, color: 'var(--color-ink)' } : {}" @click="setCategory(categoryItem.id)">{{ categoryItem.label }}</button>
      </div>
    </Transition>
    <div v-if="!categoriesVisible" class="category-spacer"></div>

    <div class="card-wrap" @touchstart="onTouchStart" @click="handleDesktopClick">
      <div v-if="!isEndOfCategory && !isEndOfDeck" class="card card--ghost"></div>

      <section v-if="isEndOfCategory" class="card card--end">
        <p class="end-title">You've tasted everything<br>in this category.</p>
        <div class="end-actions">
          <button class="end-btn" type="button" @click="reshuffleCategory">shuffle again</button>
          <button class="end-btn end-btn--accent" type="button" @click="shuffleAll">mix it all up</button>
          <p class="end-label">pick another</p>
          <div class="end-categories">
            <button v-for="categoryItem in CATEGORIES" :key="categoryItem.id" class="cat-chip" type="button" :style="{ borderColor: categoryItem.color, color: categoryItem.color }" @click="setCategory(categoryItem.id)">{{ categoryItem.label }}</button>
          </div>
        </div>
      </section>

      <section v-else-if="isEndOfDeck" class="card card--end">
        <p class="end-title">That's all for now.</p>
        <p class="end-subtitle">The table has spoken.</p>
        <div class="end-actions">
          <button class="end-btn end-btn--accent" type="button" @click="shuffleAll">reshuffle the deck</button>
          <button class="end-btn" type="button" @click="showLeaderboard = true">view leaderboard</button>
        </div>
      </section>

      <section v-else class="card" :class="{ 'card--wiggle': !isDragging && !isExiting && currentIndex > 0 }" :style="cardStyle">
        <div class="card-header">
          <span v-if="categoryLabel" class="card-category" :style="{ color: categoryColor }">{{ categoryLabel }}</span>
          <span class="card-number">{{ currentCard.id === 'card-zero' ? '·' : `#${currentIndex}` }}</span>
        </div>
        <div ref="cardContent" class="card-scroll" @click.stop @touchstart.stop @scroll="onCardContentScroll">
          <p class="card-prompt">{{ currentCard.prompt }}</p>
          <p v-if="currentCard.note" class="card-note">{{ currentCard.note }}</p>
        </div>
        <div v-if="showScrollFade" class="card-scroll-fade"></div>
        <span v-if="scrollCueDirection" class="scroll-cue" :class="{ 'scroll-cue--up': scrollCueDirection === 'up' }" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v16M6 14l6 6 6-6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <footer class="card-footer">
          <button v-if="currentCard.id !== 'card-zero'" class="debate-btn" type="button" @click.stop="showDebate = true">debate this</button>
        </footer>
      </section>
    </div>

    <p v-if="!isEndOfCategory && !isEndOfDeck" class="card-counter">{{ currentIndex }} · {{ deck.length - 2 }}</p>
    <p v-if="currentIndex === 0" class="swipe-hint">swipe left to advance · swipe right to go back</p>
    <p v-else-if="!isEndOfCategory && !isEndOfDeck" class="swipe-hint">swipe ← · → to move through the deck</p>
    <button v-if="currentCard.id !== 'card-zero' && !showScoreRow && !isEndOfCategory && !isEndOfDeck" class="award-trigger" type="button" @click="showScoreRow = true">+ award point</button>

    <div v-if="showScoreRow" class="score-row">
      <p>who won this round?</p>
      <div class="score-options">
        <button v-for="player in sessionPlayers" :key="player.id" class="score-player" type="button" @click="award(player.id)">{{ player.name }}</button>
        <button class="score-player muted" type="button" @click="showScoreRow = false">nobody</button>
      </div>
    </div>

    <div v-if="showLeaderboard" class="overlay" @click="showLeaderboard = false">
      <section class="bottom-sheet" @click.stop>
        <div class="sheet-handle"></div>
        <div class="sommelier">♢</div>
        <h2>leaderboard</h2>
        <div class="leaderboard">
          <div v-for="(player, index) in sortedPlayers" :key="player.id" class="leaderboard-row">
            <span :class="{ gold: index === 0 }">{{ index === 0 ? '★' : index + 1 }}</span>
            <strong>{{ player.name }}</strong>
            <b>{{ player.score }}</b>
          </div>
        </div>
        <button class="sheet-close" type="button" @click="showLeaderboard = false">close</button>
      </section>
    </div>

    <div v-if="showDebate" class="overlay" @click="showDebate = false">
      <section class="bottom-sheet" @click.stop>
        <div class="sheet-handle"></div>
        <h2>settle it</h2>
        <p class="debate-prompt">{{ currentCard.prompt }}</p>
        <p>The table is divided - as it should be. Here is what the record shows.</p>
        <div class="debate-sources"><a v-for="source in debateSources" :key="source.url" :href="source.url" target="_blank" rel="noopener">{{ source.label }}</a></div>
        <button class="sheet-close" type="button" @click="showDebate = false">close</button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.game { position: relative; min-height: 100vh; overflow: hidden; display: flex; flex-direction: column; align-items: center; background: var(--color-bg); padding-bottom: 32px; }
@media (min-width: 769px) { .game { min-height: calc(852px - 70px); } }
.top-bar { width: 100%; display: flex; justify-content: space-between; padding: 16px; }.icon-btn { width: 44px; height: 44px; border: 0; background: none; cursor: pointer; display: grid; place-items: center; }.category-strip { display: flex; gap: 8px; width: 100%; overflow-x: auto; padding: 0 16px 12px; scrollbar-width: none; }.category-spacer { height: 12px; }.cat-chip { flex: 0 0 auto; height: 32px; padding: 0 14px; border: 1px solid var(--color-surface-raised); border-radius: 100px; background: transparent; color: var(--color-cream-muted); font: 12px 'DM Sans', sans-serif; cursor: pointer; white-space: nowrap; }.cat-chip.active { background: var(--color-cream); border-color: var(--color-cream); color: var(--color-ink); }.fade-enter-active { transition: opacity .4s ease; }.fade-enter-from { opacity: 0; }
.card-wrap { position: relative; display: grid; flex: 1; place-items: center; width: calc(100% - 40px); max-width: 380px; min-height: 420px; cursor: pointer; touch-action: pan-y; }.card { position: absolute; z-index: 1; display: flex; flex-direction: column; gap: 16px; width: 100%; height: 420px; padding: 32px 28px 28px; overflow: hidden; border-radius: 20px; background: var(--color-surface); box-shadow: 0 8px 40px rgb(0 0 0 / 50%); user-select: none; }.card--ghost { z-index: 0; transform: scale(.96) translateY(8px); opacity: .5; pointer-events: none; }.card--end { align-items: center; justify-content: center; text-align: center; }.card-header { display: flex; align-items: center; justify-content: space-between; min-height: 16px; }.card-category { font: 600 11px 'DM Sans', sans-serif; letter-spacing: .14em; text-transform: uppercase; }.card-number { color: var(--color-cream-muted); font: 11px 'DM Sans', sans-serif; opacity: .55; }.card-scroll { position: relative; flex: 1; min-height: 0; overflow-y: auto; padding-right: 6px; overscroll-behavior: contain; scrollbar-width: none; }.card-scroll::-webkit-scrollbar { display: none; }.card-scroll-fade { position: absolute; right: 28px; bottom: 64px; left: 28px; height: 54px; pointer-events: none; background: linear-gradient(to bottom, transparent, rgb(28 30 40 / 88%)); }.scroll-cue { position: absolute; right: 30px; bottom: 82px; z-index: 2; color: var(--color-cream-muted); opacity: .72; pointer-events: none; animation: scroll-cue-bounce 1.6s ease-in-out infinite; }.scroll-cue--up { transform: rotate(180deg); }.scroll-cue--up { animation-name: scroll-cue-bounce-up; } @keyframes scroll-cue-bounce { 0%, 100% { translate: 0 0; } 50% { translate: 0 4px; } } @keyframes scroll-cue-bounce-up { 0%, 100% { translate: 0 0; } 50% { translate: 0 -4px; } }.card-prompt { margin: 4px 0 0; color: var(--color-cream) !important; font-family: 'Cormorant Garamond', serif !important; font-size: 34px; font-weight: 400; line-height: 1.28; letter-spacing: .01em; }.card-note { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--color-surface-raised); color: var(--color-cream-muted); font: italic 13px/1.5 'DM Sans', sans-serif; }.card-footer { display: flex; align-items: center; margin-top: auto; color: var(--color-cream-muted); font: 11px 'DM Sans', sans-serif; }.debate-btn, .award-trigger { border: 1px solid var(--color-surface-raised); border-radius: 100px; background: none; color: var(--color-cream-muted); font: 12px 'DM Sans', sans-serif; cursor: pointer; padding: 8px 16px; }
.end-title { color: var(--color-cream); font: 26px/1.3 'Cormorant Garamond', serif; }.end-subtitle { color: var(--color-cream-muted); font: italic 18px 'Cormorant Garamond', serif; }.end-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }.end-btn, .sheet-close { height: 48px; border: 1px solid var(--color-surface-raised); border-radius: 12px; background: var(--color-surface-raised); color: var(--color-cream-muted); font: 13px 'DM Sans', sans-serif; cursor: pointer; }.end-btn--accent { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-cream); }.end-label { margin-top: 6px; color: var(--color-cream-muted); font: 10px 'DM Sans', sans-serif; letter-spacing: .12em; text-transform: uppercase; }.end-categories { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
@keyframes wiggle { 0%, 100% { transform: rotate(0) translateX(0); } 15% { transform: rotate(.4deg) translateX(2px); } 30% { transform: rotate(-.3deg) translateX(-1px); } 45% { transform: rotate(.2deg) translateX(1px); } }.card--wiggle { animation: wiggle 4s ease-in-out infinite 1.5s; }.card-counter, .swipe-hint { margin-top: 8px; color: var(--color-cream-muted); font: 11px 'DM Sans', sans-serif; letter-spacing: .1em; opacity: .65; text-transform: uppercase; }.award-trigger { margin-top: 16px; }.score-row { width: 100%; padding: 16px 20px 0; color: var(--color-cream-muted); font: 11px 'DM Sans', sans-serif; text-align: center; text-transform: uppercase; }.score-options { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 12px; }.score-player { height: 44px; padding: 0 20px; border: 1px solid var(--color-surface-raised); border-radius: 100px; background: var(--color-surface); color: var(--color-cream); cursor: pointer; }.muted { color: var(--color-cream-muted); }
.overlay { position: absolute; inset: 0; z-index: 100; display: flex; align-items: flex-end; background: rgb(0 0 0 / 65%); backdrop-filter: blur(4px); }.bottom-sheet { display: flex; flex-direction: column; gap: 14px; width: 100%; max-height: 85%; overflow-y: auto; padding: 16px 24px 40px; border-radius: 24px 24px 0 0; background: var(--color-surface); color: var(--color-cream); }.sheet-handle { width: 40px; height: 4px; margin: 0 auto; border-radius: 2px; background: var(--color-surface-raised); }.sommelier { color: var(--color-gold); font-size: 54px; line-height: .8; text-align: center; }.bottom-sheet h2 { font: 28px 'Cormorant Garamond', serif; }.leaderboard-row { display: flex; gap: 16px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-surface-raised); }.leaderboard-row strong { flex: 1; font: 20px 'Cormorant Garamond', serif; }.leaderboard-row b, .gold { color: var(--color-gold); }.debate-prompt { color: var(--color-cream-muted); font: italic 18px/1.4 'Cormorant Garamond', serif; }.debate-sources { display: flex; flex-direction: column; gap: 8px; }.debate-sources a { padding: 10px 14px; border-radius: 8px; background: var(--color-surface-raised); color: var(--color-accent); font: 12px 'DM Sans', sans-serif; text-decoration: none; }
</style>