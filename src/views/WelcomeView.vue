<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlayers } from '@/composables/usePlayers'

const emit = defineEmits<{ play: []; rules: [] }>()
const { sessionPlayers } = usePlayers()
const partyMessageKey = 'table-party-message'
const partyMessage = ref(localStorage.getItem(partyMessageKey) || '')
const showPartyInput = ref(false)
const partyInput = ref('')
const comingDecks = [
  { id: 2, name: 'The Brewmaster', icon: '◈' },
  { id: 3, name: 'French Classics', icon: '◇' },
  { id: 4, name: 'The Cellar', icon: '◆' },
  { id: 5, name: 'Fire & Smoke', icon: '△' }
]

function savePartyMessage() {
  localStorage.setItem(partyMessageKey, partyInput.value)
  partyMessage.value = partyInput.value
  showPartyInput.value = false
  partyInput.value = ''
}

function clearPartyMessage() {
  localStorage.removeItem(partyMessageKey)
  partyMessage.value = ''
}

function handlePlay() {
  sessionStorage.setItem('table-welcome-seen', 'true')
  if (partyMessage.value) localStorage.removeItem(partyMessageKey)
  emit('play')
}

const playerNames = computed(() => {
  const names = sessionPlayers.value.map(player => player.name)
  if (names.length < 2) return names.join('')
  if (names.length === 2) return names.join(' & ')
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
})

const tonight = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric'
})
</script>

<template>
  <div class="welcome">
    <div class="welcome__header">
      <p class="welcome__date">{{ tonight }}</p>
      <h1 class="wordmark">Table</h1>
      <p class="welcome__greeting">Welcome, fellow foodies.</p>
      <p v-if="playerNames" class="welcome__players">{{ playerNames }}</p>
    </div>

    <div v-if="partyMessage && !showPartyInput" class="party-msg">
      <p class="party-msg__label">a note from your host</p>
      <p class="party-msg__text">{{ partyMessage }}</p>
      <button class="party-msg__clear" type="button" @click="clearPartyMessage">clear</button>
    </div>

    <div v-if="showPartyInput" class="party-input-wrap">
      <p class="party-input__label">leave a note for your guests</p>
      <textarea v-model="partyInput" class="party-input__field" placeholder="Welcome to our table..." rows="3" maxlength="200"></textarea>
      <div class="party-input__actions">
        <button class="party-input__cancel" type="button" @click="showPartyInput = false">cancel</button>
        <button class="party-input__save" type="button" @click="savePartyMessage">save note</button>
      </div>
    </div>

    <div class="deck-badge"><span class="deck-badge__num">01</span><span class="deck-badge__label">The Starter Deck</span></div>

    <div class="welcome__actions">
      <button class="action-btn action-btn--primary" type="button" @click="handlePlay">
        <svg class="action-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><polygon points="3,2 13,8 3,14" fill="var(--color-ink)" opacity="0.8" /></svg>
        let's play
      </button>
      <button class="action-btn action-btn--secondary" type="button" @click="emit('rules')">
        <svg class="action-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3 L8 2 L14 3 L14 13 L8 14 L2 13 Z" stroke="var(--color-cream-muted)" stroke-width="1" fill="none" /><line x1="8" y1="2" x2="8" y2="14" stroke="var(--color-cream-muted)" stroke-width="1" /></svg>
        house rules
      </button>
      <button v-if="!showPartyInput && !partyMessage" class="action-btn action-btn--tertiary" type="button" @click="showPartyInput = true">
        <svg class="action-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4 L8 9 L14 4" stroke="var(--color-cream-muted)" stroke-width="1" fill="none" /><rect x="2" y="4" width="12" height="9" rx="1" stroke="var(--color-cream-muted)" stroke-width="1" fill="none" /></svg>
        plan a party
      </button>
    </div>

    <div class="decks-coming">
      <p class="decks-coming__label">more decks coming</p>
      <div class="decks-coming__list">
        <div v-for="deck in comingDecks" :key="deck.id" class="deck-pill"><span class="deck-pill__icon">{{ deck.icon }}</span><span class="deck-pill__name">{{ deck.name }}</span><span class="deck-pill__soon">soon</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 48px 24px 40px; background: var(--color-bg); gap: 28px; overflow-y: auto; }
@media (min-width: 769px) { .welcome { min-height: calc(852px - 70px); } }
.welcome__header { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }.welcome__date, .party-msg__label, .party-input__label, .decks-coming__label { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-cream-muted); letter-spacing: 0.12em; text-transform: uppercase; }.welcome__date, .decks-coming__label { font-size: 10px; }.wordmark { font-family: 'Cormorant Garamond', serif; font-size: 52px; font-weight: 400; color: var(--color-cream); letter-spacing: 0.06em; line-height: 1; }.welcome__greeting { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-style: italic; color: var(--color-cream-muted); }.welcome__players { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--color-gold); letter-spacing: 0.04em; }
.party-msg, .party-input-wrap { width: 100%; max-width: 360px; background: var(--color-surface); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 8px; }.party-msg { border-left: 2px solid var(--color-gold); }.party-msg__label { color: var(--color-gold); }.party-msg__text { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--color-cream); font-style: italic; line-height: 1.4; }.party-msg__clear, .party-input__cancel { align-self: flex-end; background: none; border: none; font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-cream-muted); cursor: pointer; letter-spacing: 0.06em; }.party-input-wrap { gap: 12px; }.party-input__label { font-size: 11px; letter-spacing: 0.1em; }.party-input__field { background: var(--color-bg); border: 1px solid var(--color-surface-raised); border-radius: 8px; padding: 12px 14px; color: var(--color-cream); font-family: 'Cormorant Garamond', serif; font-size: 17px; resize: none; outline: none; caret-color: var(--color-accent); line-height: 1.5; }.party-input__field:focus { border-color: var(--color-accent); }.party-input__actions { display: flex; gap: 8px; justify-content: flex-end; }.party-input__cancel { align-self: auto; padding: 8px 12px; font-size: 12px; }.party-input__save { background: var(--color-accent); border: none; border-radius: 8px; padding: 8px 16px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: var(--color-cream); cursor: pointer; letter-spacing: 0.06em; }
.deck-badge { display: flex; align-items: center; gap: 10px; border: 1px solid var(--color-surface-raised); border-radius: 100px; padding: 8px 16px; }.deck-badge__num { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: var(--color-gold); }.deck-badge__label { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-cream-muted); letter-spacing: 0.08em; text-transform: uppercase; }
.welcome__actions { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 360px; }.action-btn { width: 100%; height: 52px; border-radius: 14px; border: 1px solid var(--color-surface-raised); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.08em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: opacity 0.15s ease; }.action-btn--primary { background: var(--color-cream); color: var(--color-ink); border-color: var(--color-cream); }.action-btn--secondary { background: var(--color-surface); color: var(--color-cream-muted); }.action-btn--tertiary { background: transparent; color: var(--color-cream-muted); }.action-icon { flex-shrink: 0; }
.decks-coming { width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 10px; }.decks-coming__label { opacity: 0.6; }.decks-coming__list { display: flex; flex-direction: column; gap: 6px; }.deck-pill { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--color-surface); border-radius: 10px; opacity: 0.5; }.deck-pill__icon { color: var(--color-gold); font-size: 14px; }.deck-pill__name { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: var(--color-cream); flex: 1; }.deck-pill__soon { font-family: 'DM Sans', sans-serif; font-size: 10px; color: var(--color-cream-muted); letter-spacing: 0.1em; text-transform: uppercase; }
</style>