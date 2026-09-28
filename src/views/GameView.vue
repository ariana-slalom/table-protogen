<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDeck } from '@/composables/useDeck'
import { usePlayers } from '@/composables/usePlayers'
import { CATEGORIES } from '@/data/categories'

const { currentCard, currentIndex, deck, activeCategoryId, isFirst, isLast, next, prev, setCategory } = useDeck()
const { sessionPlayers, awardPoint } = usePlayers()
const threshold = 80
const dragX = ref(0)
const isDragging = ref(false)
const isExiting = ref(false)
const exitDir = ref<'left' | 'right'>('left')
const showScoreRow = ref(false)
const showLeaderboard = ref(false)
const showDebate = ref(false)

function onTouchStart(event: TouchEvent) {
  const startX = event.touches[0].clientX
  isDragging.value = true
  function onMove(moveEvent: TouchEvent) { dragX.value = moveEvent.touches[0].clientX - startX }
  function onEnd() {
    isDragging.value = false
    if (dragX.value < -threshold && !isLast.value) {
      exitDir.value = 'left'; isExiting.value = true
      setTimeout(() => { next(); isExiting.value = false; dragX.value = 0 }, 250)
    } else if (dragX.value > threshold && !isFirst.value) {
      exitDir.value = 'right'; isExiting.value = true
      setTimeout(() => { prev(); isExiting.value = false; dragX.value = 0 }, 250)
    } else dragX.value = 0
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)
  }
  document.addEventListener('touchmove', onMove, { passive: true })
  document.addEventListener('touchend', onEnd)
}

const cardStyle = computed(() => {
  if (isExiting.value) return { transform: `translateX(${exitDir.value === 'left' ? '-115%' : '115%'})`, transition: 'transform 0.25s ease-in, opacity 0.25s ease-in', opacity: '0' }
  if (isDragging.value) return { transform: `translateX(${dragX.value}px) rotate(${dragX.value * 0.025}deg)`, transition: 'none' }
  return { transform: 'translateX(0)', transition: 'transform 0.2s ease-out' }
})

const category = computed(() => currentCard.value.categoryId ? CATEGORIES.find(item => item.id === currentCard.value.categoryId) : undefined)
const categoryColor = computed(() => category.value?.color || 'var(--color-cream-muted)')
const categoryLabel = computed(() => category.value?.label)
const sortedPlayers = computed(() => [...sessionPlayers.value].sort((first, second) => second.score - first.score))
const debateContent = {
  ruling: 'The table is divided — as it should be. Here is what the record shows.',
  sources: [
    { label: 'Serious Eats — The Food Lab', url: 'https://www.seriouseats.com/the-food-lab' },
    { label: 'Noma Guide to Fermentation', url: 'https://www.penguinrandomhouse.com/books/569799/the-noma-guide-to-fermentation-by-rene-redzepi-and-david-zilber/' },
    { label: 'Salt Fat Acid Heat — Samin Nosrat', url: 'https://www.saltfatacidheat.com' }
  ]
}

function triggerScoring() { if (currentCard.value.id !== 'card-zero') showScoreRow.value = true }
function handleAward(id: string) { awardPoint(id); showScoreRow.value = false }
</script>

<template>
  <div class="game">
    <div class="top-bar">
      <span class="card-count">{{ currentIndex }} / {{ deck.length - 1 }}</span>
      <button class="icon-btn" type="button" title="leaderboard" aria-label="Open leaderboard" @click="showLeaderboard = true">⬡</button>
    </div>

    <div class="category-strip">
      <button class="cat-chip" :class="{ active: activeCategoryId === 'all' }" type="button" @click="setCategory('all')">all</button>
      <button v-for="cat in CATEGORIES" :key="cat.id" class="cat-chip" :class="{ active: activeCategoryId === cat.id }" :style="activeCategoryId === cat.id ? { background: cat.color, borderColor: cat.color, color: 'var(--color-ink)' } : {}" type="button" @click="setCategory(cat.id)">{{ cat.label }}</button>
    </div>

    <div class="card-wrap" @touchstart="onTouchStart">
      <div class="card card--ghost"></div>
      <div class="card" :style="cardStyle">
        <span v-if="categoryLabel" class="card__category" :style="{ color: categoryColor }">{{ categoryLabel }}</span>
        <p class="card__prompt">{{ currentCard.prompt }}</p>
        <p v-if="currentCard.note" class="card__note">{{ currentCard.note }}</p>
        <div class="card__footer">
          <span class="card__num">{{ currentCard.id === 'card-zero' ? '·' : `#${currentIndex}` }}</span>
          <button v-if="currentCard.id !== 'card-zero'" class="debate-btn" type="button" @click="showDebate = true">debate this</button>
        </div>
      </div>
    </div>

    <div v-if="currentCard.id === 'card-zero'" class="swipe-hint">swipe left to begin</div>
    <button v-if="currentCard.id !== 'card-zero' && !showScoreRow" class="award-trigger" type="button" @click="triggerScoring">+ award point</button>
    <div v-if="showScoreRow" class="score-row">
      <p class="score-row__label">who won this round?</p>
      <div class="score-row__players">
        <button v-for="player in sessionPlayers" :key="player.id" class="score-player-btn" type="button" @click="handleAward(player.id)">{{ player.name }}</button>
        <button class="score-player-btn score-player-btn--skip" type="button" @click="showScoreRow = false">nobody</button>
      </div>
    </div>

    <div v-if="showLeaderboard" class="overlay" @click="showLeaderboard = false">
      <div class="bottom-sheet" @click.stop>
        <div class="sheet-handle"></div><h2 class="sheet-title">leaderboard</h2>
        <div class="leaderboard"><div v-for="(player, index) in sortedPlayers" :key="player.id" class="lb-row"><span class="lb-rank">{{ index + 1 }}</span><span class="lb-name">{{ player.name }}</span><span class="lb-score">{{ player.score }}</span></div></div>
        <button class="sheet-close" type="button" @click="showLeaderboard = false">close</button>
      </div>
    </div>

    <div v-if="showDebate" class="overlay" @click="showDebate = false">
      <div class="bottom-sheet" @click.stop>
        <div class="sheet-handle"></div><h2 class="sheet-title">settle it</h2>
        <p class="debate-prompt">{{ currentCard.prompt }}</p><p class="debate-ruling">{{ debateContent.ruling }}</p>
        <div class="debate-sources"><a v-for="source in debateContent.sources" :key="source.url" :href="source.url" target="_blank" rel="noopener" class="debate-source-link">{{ source.label }}</a></div>
        <button class="sheet-close" type="button" @click="showDebate = false">close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game { min-height: 100vh; display: flex; flex-direction: column; align-items: center; background: var(--color-bg); padding-bottom: 24px; overflow: hidden; }
@media (min-width: 769px) { .game { min-height: calc(852px - 70px); } }
.top-bar { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 16px 20px 8px; }
.card-count { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-cream-muted); letter-spacing: 0.08em; }
.icon-btn { background: none; border: none; color: var(--color-cream-muted); font-size: 20px; cursor: pointer; width: 44px; height: 44px; display: grid; place-items: center; }
.category-strip { display: flex; gap: 8px; overflow-x: auto; padding: 0 20px 12px; width: 100%; scrollbar-width: none; }
.category-strip::-webkit-scrollbar { display: none; }
.cat-chip { flex-shrink: 0; height: 32px; padding: 0 14px; border-radius: 100px; border: 1px solid var(--color-surface-raised); background: transparent; color: var(--color-cream-muted); font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; white-space: nowrap; transition: all 0.15s ease; }
.cat-chip.active { background: var(--color-cream); color: var(--color-ink); border-color: var(--color-cream); }
.card-wrap { position: relative; width: calc(100% - 48px); max-width: 380px; flex: 1; display: flex; align-items: center; justify-content: center; touch-action: pan-y; }
.card { position: absolute; width: 100%; min-height: 420px; background: var(--color-surface); border-radius: 20px; padding: 32px 28px 28px; box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5); display: flex; flex-direction: column; gap: 16px; cursor: grab; user-select: none; will-change: transform; }
.card--ghost { transform: scale(0.96) translateY(8px); opacity: 0.4; z-index: 0; pointer-events: none; }
.card:not(.card--ghost) { z-index: 1; }
.card__category { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.card__prompt { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 400; color: var(--color-cream); line-height: 1.35; letter-spacing: 0.01em; flex: 1; }
.card__note { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-cream-muted); line-height: 1.5; font-style: italic; border-top: 1px solid var(--color-surface-raised); padding-top: 12px; }
.card__footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.card__num { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-cream-muted); opacity: 0.5; }
.debate-btn, .award-trigger { background: none; border: 1px solid var(--color-surface-raised); border-radius: 100px; color: var(--color-cream-muted); font-family: 'DM Sans', sans-serif; font-size: 11px; cursor: pointer; letter-spacing: 0.06em; }
.debate-btn { padding: 6px 14px; }
.swipe-hint { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-cream-muted); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 16px; opacity: 0.5; }
.award-trigger { margin-top: 20px; padding: 10px 24px; font-size: 12px; letter-spacing: 0.08em; }
.score-row { width: 100%; padding: 16px 20px 0; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.score-row__label, .setup__count { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-cream-muted); letter-spacing: 0.1em; text-transform: uppercase; }
.score-row__players { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.score-player-btn { height: 44px; padding: 0 20px; border-radius: 100px; border: 1px solid var(--color-surface-raised); background: var(--color-surface); color: var(--color-cream); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; }
.score-player-btn:active { background: var(--color-terracotta); border-color: var(--color-terracotta); }.score-player-btn--skip { color: var(--color-cream-muted); font-style: italic; }
.overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); z-index: 100; display: flex; align-items: flex-end; backdrop-filter: blur(4px); }
.bottom-sheet { width: 100%; background: var(--color-surface); border-radius: 24px 24px 0 0; padding: 16px 24px 40px; display: flex; flex-direction: column; gap: 16px; max-height: 80vh; overflow-y: auto; }
.sheet-handle { width: 40px; height: 4px; background: var(--color-surface-raised); border-radius: 2px; margin: 0 auto 8px; }.sheet-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: var(--color-cream); letter-spacing: 0.04em; }
.sheet-close { background: var(--color-surface-raised); border: none; border-radius: 12px; height: 48px; color: var(--color-cream-muted); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; letter-spacing: 0.08em; margin-top: 8px; }
.leaderboard, .debate-sources { display: flex; flex-direction: column; gap: 4px; }.lb-row { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-surface-raised); gap: 16px; }.lb-rank { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-cream-muted); width: 16px; }.lb-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--color-cream); flex: 1; }.lb-score { font-family: 'DM Sans', sans-serif; font-size: 24px; font-weight: 300; color: var(--color-gold); }
.debate-prompt { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--color-cream-muted); font-style: italic; line-height: 1.4; }.debate-ruling { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--color-cream); line-height: 1.6; }.debate-sources { gap: 8px; }.debate-source-link { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-terracotta); text-decoration: none; padding: 10px 14px; background: var(--color-surface-raised); border-radius: 8px; letter-spacing: 0.02em; }
</style>