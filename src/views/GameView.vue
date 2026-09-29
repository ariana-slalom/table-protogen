<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAccessibility } from '@/composables/useAccessibility'
import { useDeck } from '@/composables/useDeck'
import { usePlayers } from '@/composables/usePlayers'
import { CATEGORIES } from '@/data/categories'
import HexIcon from '@/components/HexIcon.vue'
import LeaderboardIcon from '@/components/LeaderboardIcon.vue'
import RestartIcon from '@/components/RestartIcon.vue'
import TimerView from '@/views/TimerView.vue'

const emit = defineEmits<{ menu: []; rules: []; guestbook: []; home: [] }>()
const {
  deck, currentCard, currentIndex, activeCategoryId, isFirst, isLast,
  isEndOfCategory, isEndOfDeck, next, prev, setCategory, reshuffleCategory, shuffleAll
} = useDeck()
const { sessionPlayers, awardPoint } = usePlayers()
const { isAccessibilityMode, toggleAccessibilityMode } = useAccessibility()

const threshold = 80
const dragX = ref(0)
const isDragging = ref(false)
const isExiting = ref(false)
const exitDirection = ref<'left' | 'right'>('left')
const showScoreRow = ref(false)
const showLeaderboard = ref(false)
const showDebate = ref(false)
const showMenu = ref(false)
const showTimer = ref(false)
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

function onAccessibilityKeydown(event: KeyboardEvent) {
  if (!isAccessibilityMode.value || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
  if (event.key === 'Escape') {
    showMenu.value = false
    showLeaderboard.value = false
    showDebate.value = false
    showTimer.value = false
  }
  if (event.key === 'ArrowRight' && !isLast.value && !isExiting.value) {
    event.preventDefault()
    commitSwipe('left', next)
  }
  if (event.key === 'ArrowLeft' && !isFirst.value && !isExiting.value) {
    event.preventDefault()
    commitSwipe('right', prev)
  }
}

onMounted(() => window.addEventListener('keydown', onAccessibilityKeydown))
onUnmounted(() => window.removeEventListener('keydown', onAccessibilityKeydown))

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
const currentCardHasTimer = computed(() => currentCard.value.hasTimer === true)
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

function restartGame() {
  sessionStorage.clear()
  window.location.reload()
}
</script>

<template>
  <div class="game">
    <p v-if="isAccessibilityMode" class="sr-only" aria-live="polite">Use left and right arrow keys to navigate cards. Press Escape to close menus and sheets.</p>
    <div class="top-bar">
      <button class="hex-btn" type="button" aria-label="menu" @click="showMenu = true"><HexIcon /></button>
      <button class="icon-btn" type="button" aria-label="Leaderboard" @click="showLeaderboard = true">
        <LeaderboardIcon />
      </button>
    </div>

    <div class="category-strip">
        <button class="cat-chip" :class="{ active: activeCategoryId === 'all' }" type="button" @click="setCategory('all')">shuffle</button>
        <button v-for="categoryItem in CATEGORIES" :key="categoryItem.id" class="cat-chip" type="button" :class="{ active: activeCategoryId === categoryItem.id }" :style="activeCategoryId === categoryItem.id ? { background: categoryItem.color, borderColor: categoryItem.color, color: 'var(--color-ink)' } : {}" @click="setCategory(categoryItem.id)">{{ categoryItem.label }}</button>
    </div>

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

      <section v-else class="card" :class="{ 'card--wiggle': !isDragging && !isExiting }" :style="cardStyle">
        <div class="card-header">
          <span v-if="categoryLabel" class="card-category" :style="{ color: categoryColor }">{{ categoryLabel }}</span>
          <span class="card-number">#{{ currentIndex + 1 }}</span>
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
          <button class="debate-btn" type="button" @click.stop="showDebate = true">debate</button>
          <button v-if="currentCardHasTimer" class="timer-btn" type="button" @click.stop="showTimer = true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="9" r="5.5" stroke="var(--color-gold)" stroke-width="1.2" /><line x1="8" y1="9" x2="8" y2="6" stroke="var(--color-gold)" stroke-width="1.2" stroke-linecap="round" /><line x1="8" y1="9" x2="10" y2="10" stroke="var(--color-gold)" stroke-width="1.2" stroke-linecap="round" /><line x1="6.5" y1="2.5" x2="8" y2="1" stroke="var(--color-gold)" stroke-width="1.2" stroke-linecap="round" /><line x1="9.5" y1="2.5" x2="8" y2="1" stroke="var(--color-gold)" stroke-width="1.2" stroke-linecap="round" /></svg>
            {{ currentCard.timerSeconds || 60 }}s
          </button>
        </footer>
      </section>
    </div>

    <p v-if="!isEndOfCategory && !isEndOfDeck" class="card-counter">{{ currentIndex + 1 }} · {{ deck.length - 1 }}</p>
    <p v-if="!isEndOfCategory && !isEndOfDeck" class="swipe-hint">swipe ← · → to move through the deck</p>
    <button v-if="!showScoreRow && !isEndOfCategory && !isEndOfDeck" class="award-trigger" type="button" @click="showScoreRow = true">+ award point</button>

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

    <div v-if="showMenu" class="overlay" @click="showMenu = false">
      <section class="bottom-sheet" @click.stop>
        <div class="sheet-handle"></div>
        <button class="menu-item" type="button" @click="emit('home'); showMenu = false"><span class="menu-item__icon">◈</span><span>home</span></button>
        <button class="menu-item" type="button" @click="restartGame"><span class="menu-item__icon"><RestartIcon /></span><span>restart game</span></button>
        <button class="menu-item" type="button" @click="emit('rules'); showMenu = false"><span class="menu-item__icon">△</span><span>house rules</span></button>
        <button class="menu-item" type="button" @click="showLeaderboard = true; showMenu = false"><span class="menu-item__icon"><LeaderboardIcon /></span><span>leaderboard</span></button>
        <button class="menu-item" type="button" @click="emit('guestbook'); showMenu = false"><span class="menu-item__icon">✦</span><span>guest book</span></button>
        <div class="menu-footer">
          <button class="accessibility-toggle" type="button" role="switch" :aria-checked="isAccessibilityMode" @click="toggleAccessibilityMode">
            <span>accessibility</span>
            <span class="toggle-label">{{ isAccessibilityMode ? 'on' : 'off' }}</span>
            <span class="toggle-track" :class="{ 'toggle-track--on': isAccessibilityMode }"><span></span></span>
          </button>
        </div>
      </section>
    </div>

    <TimerView v-if="showTimer" :seconds="currentCard.timerSeconds || 60" @close="showTimer = false" />
  </div>
</template>

<style scoped>
.game { position: relative; min-height: 100vh; overflow: hidden; display: flex; flex-direction: column; align-items: center; background: var(--color-bg); padding-bottom: 32px; }
@media (min-width: 769px) { .game { min-height: calc(852px - 70px); } }
@media (max-width: 768px) {
  .game { height: 100dvh; min-height: 0; padding-bottom: 16px; }
  .card-wrap { min-height: 0; }
  .card { height: clamp(290px, calc(100dvh - 300px), 462px); }
  .card-counter { margin-top: 8px; }
  .swipe-hint { margin-top: 6px; }
  .award-trigger { margin-top: 10px; }
}
.top-bar { width: 100%; display: flex; justify-content: space-between; padding: 16px; }.hex-btn,.icon-btn { width: 44px; height: 44px; border: 0; background: none; color: var(--color-cream-muted); cursor: pointer; display: grid; place-items: center; }.category-strip { display: flex; gap: 8px; width: 100%; overflow-x: auto; padding: 0 16px 12px; scrollbar-width: none; }.category-spacer { height: 12px; }.cat-chip { flex: 0 0 auto; height: 32px; padding: 0 14px; border: 1px solid var(--color-surface-raised); border-radius: 100px; background: transparent; color: var(--color-cream-muted); font: 12px 'DM Sans', sans-serif; cursor: pointer; white-space: nowrap; }.cat-chip.active { background: var(--color-cream); border-color: var(--color-cream); color: var(--color-ink); }.fade-enter-active { transition: opacity .4s ease; }.fade-enter-from { opacity: 0; }
.card-wrap { position: relative; display: grid; flex: 1; place-items: center; width: calc(100% - 40px); max-width: 380px; min-height: 462px; cursor: pointer; touch-action: pan-y; }.card { position: absolute; z-index: 1; display: flex; flex-direction: column; gap: 16px; width: 100%; height: 462px; padding: 32px 28px 28px; overflow: hidden; border-radius: 20px; background: var(--color-surface); box-shadow: 0 8px 40px rgb(0 0 0 / 50%); user-select: none; }.card--ghost { z-index: 0; transform: scale(.96) translateY(8px); opacity: .5; pointer-events: none; }.card--end { align-items: center; justify-content: center; text-align: center; }.card-header { display: flex; align-items: center; justify-content: space-between; min-height: 16px; }.card-category { font: 600 11px 'DM Sans', sans-serif; letter-spacing: .14em; text-transform: uppercase; }.card-number { color: var(--color-cream-muted); font: 11px 'DM Sans', sans-serif; opacity: .55; }.card-scroll { position: relative; flex: 1; min-height: 0; overflow-y: auto; padding-right: 6px; overscroll-behavior: contain; scrollbar-width: none; }.card-scroll::-webkit-scrollbar { display: none; }.card-scroll-fade { position: absolute; right: 28px; bottom: 64px; left: 28px; height: 54px; pointer-events: none; background: linear-gradient(to bottom, transparent, rgb(28 30 40 / 88%)); }.scroll-cue { position: absolute; right: 30px; bottom: 82px; z-index: 2; color: var(--color-cream-muted); opacity: .72; pointer-events: none; animation: scroll-cue-bounce 1.6s ease-in-out infinite; }.scroll-cue--up { transform: rotate(180deg); }.scroll-cue--up { animation-name: scroll-cue-bounce-up; } @keyframes scroll-cue-bounce { 0%, 100% { translate: 0 0; } 50% { translate: 0 4px; } } @keyframes scroll-cue-bounce-up { 0%, 100% { translate: 0 0; } 50% { translate: 0 -4px; } }.card-prompt { margin: 4px 0 0; color: var(--color-cream) !important; font-family: 'Cormorant Garamond', serif !important; font-size: 34px; font-weight: 400; line-height: 1.28; letter-spacing: .01em; }.card-note { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--color-surface-raised); color: var(--color-cream-muted); font: italic 13px/1.5 'DM Sans', sans-serif; }.card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; color: var(--color-cream-muted); font: 11px 'DM Sans', sans-serif; }.debate-btn, .award-trigger { border: 1px solid var(--color-surface-raised); border-radius: 100px; background: none; color: var(--color-cream-muted); font: 12px 'DM Sans', sans-serif; cursor: pointer; padding: 8px 16px; }.timer-btn { display: flex; align-items: center; gap: 6px; border: 1px solid var(--color-surface-raised); border-radius: 100px; background: none; color: var(--color-gold); font: 11px 'DM Sans', sans-serif; letter-spacing: .06em; cursor: pointer; padding: 6px 12px; }
.end-title { color: var(--color-cream); font: 26px/1.3 'Cormorant Garamond', serif; }.end-subtitle { color: var(--color-cream-muted); font: italic 18px 'Cormorant Garamond', serif; }.end-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }.end-btn, .sheet-close { height: 48px; border: 1px solid var(--color-surface-raised); border-radius: 12px; background: var(--color-surface-raised); color: var(--color-cream-muted); font: 13px 'DM Sans', sans-serif; cursor: pointer; }.end-btn--accent { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-cream); }.end-label { margin-top: 6px; color: var(--color-cream-muted); font: 10px 'DM Sans', sans-serif; letter-spacing: .12em; text-transform: uppercase; }.end-categories { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
@keyframes wiggle { 0%, 100% { transform: rotate(0) translateX(0); } 15% { transform: rotate(.4deg) translateX(2px); } 30% { transform: rotate(-.3deg) translateX(-1px); } 45% { transform: rotate(.2deg) translateX(1px); } }.card--wiggle { animation: wiggle 4s ease-in-out infinite 1.5s; }.card-counter, .swipe-hint { margin-top: 8px; color: var(--color-cream-muted); font: 11px 'DM Sans', sans-serif; letter-spacing: .1em; opacity: .65; text-transform: uppercase; }.award-trigger { margin-top: 16px; }.score-row { width: 100%; padding: 16px 20px 0; color: var(--color-cream-muted); font: 11px 'DM Sans', sans-serif; text-align: center; text-transform: uppercase; }.score-options { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 12px; }.score-player { height: 44px; padding: 0 20px; border: 1px solid var(--color-surface-raised); border-radius: 100px; background: var(--color-surface); color: var(--color-cream); cursor: pointer; }.muted { color: var(--color-cream-muted); }
.overlay { position: absolute; inset: 0; z-index: 100; display: flex; align-items: flex-end; background: rgb(0 0 0 / 65%); backdrop-filter: blur(4px); }.bottom-sheet { display: flex; flex-direction: column; gap: 14px; width: 100%; max-height: 85%; overflow-y: auto; padding: 16px 24px 40px; border-radius: 24px 24px 0 0; background: var(--color-surface); color: var(--color-cream); }.sheet-handle { width: 40px; height: 4px; margin: 0 auto; border-radius: 2px; background: var(--color-surface-raised); }.menu-item { display: flex; align-items: center; gap: 12px; width: 100%; height: 52px; padding: 0 4px; border: none; border-bottom: 1px solid var(--color-surface-raised); background: none; color: var(--color-cream); font: 22px 'Cormorant Garamond', serif; text-align: left; cursor: pointer; }.menu-item__icon { display: inline-grid; flex: 0 0 22px; place-items: center; color: var(--color-gold); font-family: 'DM Sans', sans-serif; font-size: 16px; }.menu-footer { display: flex; justify-content: flex-end; margin-top: 8px; }.accessibility-toggle { display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 12px; border: 1px solid var(--color-surface-raised); border-radius: 12px; background: none; color: var(--color-cream-muted); font: 13px 'DM Sans', sans-serif; letter-spacing: .04em; cursor: pointer; }.toggle-label { min-width: 22px; text-align: right; }.toggle-track { display: flex; align-items: center; width: 36px; height: 20px; padding: 2px; border-radius: 100px; background: var(--color-surface-raised); transition: background .15s ease; }.toggle-track span { width: 16px; height: 16px; border-radius: 50%; background: var(--color-cream-muted); transition: transform .15s ease, background .15s ease; }.toggle-track--on { background: var(--color-accent); }.toggle-track--on span { transform: translateX(16px); background: var(--color-cream); }.sommelier { color: var(--color-gold); font-size: 54px; line-height: .8; text-align: center; }.bottom-sheet h2 { font: 28px 'Cormorant Garamond', serif; }.leaderboard-row { display: flex; gap: 16px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-surface-raised); }.leaderboard-row strong { flex: 1; font: 20px 'Cormorant Garamond', serif; }.leaderboard-row b, .gold { color: var(--color-gold); }.debate-prompt { color: var(--color-cream-muted); font: italic 18px/1.4 'Cormorant Garamond', serif; }.debate-sources { display: flex; flex-direction: column; gap: 8px; }.debate-sources a { padding: 10px 14px; border-radius: 8px; background: var(--color-surface-raised); color: var(--color-accent); font: 12px 'DM Sans', sans-serif; text-decoration: none; }

@media (max-width: 768px) {
  .game .card-wrap { min-height: 0; }
  .game .card { height: clamp(220px, calc(100dvh - 316px), 462px); }
}
</style>