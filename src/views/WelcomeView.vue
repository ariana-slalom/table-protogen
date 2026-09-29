<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlayers } from '@/composables/usePlayers'
import HexIcon from '@/components/HexIcon.vue'
import RestartIcon from '@/components/RestartIcon.vue'

const emit = defineEmits<{ play: []; rules: []; guestbook: [] }>()
const { sessionPlayers, addToSession, removeFromSession } = usePlayers()
const guestListMode = ref(false)
const showMenu = ref(false)
const partyInput = ref('')
const comingDecks = [
  { id: 2, name: 'The Brewmaster', icon: '◈' },
  { id: 3, name: 'French Classics', icon: '◇' },
  { id: 4, name: 'The Cellar', icon: '◆' },
  { id: 5, name: 'Fire & Smoke', icon: '△' }
]

function saveGuestList() {
  const names = partyInput.value
    .split(',')
    .map(name => name.trim())
    .filter(name => name.length > 1)

  names.forEach(name => addToSession(name))
  partyInput.value = ''
}

function handlePlay() {
  sessionStorage.setItem('table-welcome-seen', 'true')
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
    <div class="welcome-topbar">
      <button v-if="guestListMode" class="guest-list-back" type="button" aria-label="Back" @click="guestListMode = false; partyInput = ''">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M12 4 L6 10 L12 16" stroke="var(--color-cream-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button v-else class="hex-btn" type="button" aria-label="menu" @click="showMenu = true"><HexIcon /></button>
    </div>
    <div class="welcome__header">
      <p class="welcome__date">{{ tonight }}</p>
      <h1 class="wordmark">Table</h1>
      <p class="welcome__greeting">Welcome, fellow foodies.</p>
      <p v-if="playerNames" class="welcome__players">{{ playerNames }}</p>
    </div>

    <div v-if="guestListMode" class="guest-list-wrap">
      <p class="guest-list__title">tonight's guests</p>
      <div v-if="sessionPlayers.length" class="guest-tags">
        <div v-for="player in sessionPlayers" :key="player.id" class="guest-tag">
          <span>{{ player.name }}</span>
          <button class="guest-tag__remove" type="button" :aria-label="`Remove ${player.name}`" @click="removeFromSession(player.id)">×</button>
        </div>
      </div>
      <p class="guest-list__hint">add names separated by commas, or one at a time</p>
      <textarea v-model="partyInput" class="party-input__field" placeholder="Sam, Nina, Omar..." rows="2" maxlength="200"></textarea>
      <div class="party-input__actions">
        <button class="party-input__cancel" type="button" @click="guestListMode = false; partyInput = ''">done</button>
        <button v-if="partyInput.trim()" class="party-input__save" type="button" @click="saveGuestList">add guests</button>
      </div>
    </div>

    <template v-if="!guestListMode">
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
        <button class="action-btn action-btn--tertiary" type="button" @click="guestListMode = true">
          <svg class="action-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4 L8 9 L14 4" stroke="var(--color-cream-muted)" stroke-width="1" fill="none" /><rect x="2" y="4" width="12" height="9" rx="1" stroke="var(--color-cream-muted)" stroke-width="1" fill="none" /></svg>
          pre-set the guest list
        </button>
      </div>

      <div class="decks-coming">
        <p class="decks-coming__label">more decks coming</p>
        <div class="decks-coming__list">
          <div v-for="deck in comingDecks" :key="deck.id" class="deck-pill"><span class="deck-pill__icon">{{ deck.icon }}</span><span class="deck-pill__name">{{ deck.name }}</span><span class="deck-pill__soon">soon</span></div>
        </div>
      </div>
    </template>

    <div v-if="showMenu" class="overlay" @click="showMenu = false">
      <div class="bottom-sheet" @click.stop>
        <div class="sheet-handle"></div>
        <button class="menu-item" type="button" @click="showMenu = false"><span class="menu-item__icon">◈</span><span>home</span></button>
        <button class="menu-item" type="button" @click="emit('play'); showMenu = false"><span class="menu-item__icon"><RestartIcon /></span><span>let's play</span></button>
        <button class="menu-item" type="button" @click="emit('rules'); showMenu = false"><span class="menu-item__icon">△</span><span>house rules</span></button>
        <button class="menu-item" type="button" @click="emit('guestbook'); showMenu = false"><span class="menu-item__icon">✦</span><span>guest book</span></button>
        <button class="sheet-close" type="button" @click="showMenu = false">close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome { position: relative; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 0 24px 40px; background: var(--color-bg); gap: 28px; overflow: hidden; }
@media (min-width: 769px) { .welcome { min-height: calc(852px - 70px); } }
.welcome-topbar { width: 100%; display: flex; justify-content: flex-start; padding: 0 8px; }.hex-btn,.guest-list-back { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; }
.welcome__header { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }.welcome__date, .party-msg__label, .party-input__label, .decks-coming__label { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-cream-muted); letter-spacing: 0.12em; text-transform: uppercase; }.welcome__date, .decks-coming__label { font-size: 10px; }.wordmark { font-family: 'Cormorant Garamond', serif; font-size: 52px; font-weight: 400; color: var(--color-cream); letter-spacing: 0.06em; line-height: 1; }.welcome__greeting { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-style: italic; color: var(--color-cream-muted); }.welcome__players { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--color-gold); letter-spacing: 0.04em; }
.party-input-wrap { width: 100%; max-width: 360px; background: var(--color-surface); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }.party-input__label { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-cream-muted); letter-spacing: 0.1em; text-transform: uppercase; }.party-input__field { background: var(--color-bg); border: 1px solid var(--color-surface-raised); border-radius: 8px; padding: 12px 14px; color: var(--color-cream); font-family: 'Cormorant Garamond', serif; font-size: 17px; resize: none; outline: none; caret-color: var(--color-accent); line-height: 1.5; }.party-input__field:focus { border-color: var(--color-accent); }.party-input__actions { display: flex; gap: 8px; justify-content: flex-end; }.party-input__cancel { align-self: auto; padding: 8px 12px; background: none; border: none; color: var(--color-cream-muted); font: 12px 'DM Sans', sans-serif; cursor: pointer; }.party-input__save { background: var(--color-accent); border: none; border-radius: 8px; padding: 8px 16px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: var(--color-cream); cursor: pointer; letter-spacing: 0.06em; }
.guest-list-wrap { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 360px; padding-top: 8px; }.guest-list__title { color: var(--color-cream); font: 22px 'Cormorant Garamond', serif; letter-spacing: .02em; }.guest-list__hint { color: var(--color-cream-muted); font: 11px 'DM Sans', sans-serif; letter-spacing: .04em; opacity: .6; }.guest-tags { display: flex; flex-wrap: wrap; gap: 8px; }.guest-tag { display: flex; align-items: center; gap: 6px; padding: 6px 10px 6px 14px; border: 1px solid var(--color-surface-raised); border-radius: 100px; background: var(--color-surface); color: var(--color-cream); font: 13px 'DM Sans', sans-serif; }.guest-tag__remove { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; padding: 0; border: none; background: none; color: var(--color-cream-muted); font-size: 16px; line-height: 1; cursor: pointer; }
.deck-badge { display: flex; align-items: center; gap: 10px; border: 1px solid var(--color-surface-raised); border-radius: 100px; padding: 8px 16px; }.deck-badge__num { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: var(--color-gold); }.deck-badge__label { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-cream-muted); letter-spacing: 0.08em; text-transform: uppercase; }
.welcome__actions { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 360px; }.action-btn { width: 100%; height: 52px; border-radius: 14px; border: 1px solid var(--color-surface-raised); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.08em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: opacity 0.15s ease; }.action-btn--primary { background: var(--color-cream); color: var(--color-ink); border-color: var(--color-cream); }.action-btn--secondary { background: var(--color-surface); color: var(--color-cream-muted); }.action-btn--tertiary { background: transparent; color: var(--color-cream-muted); }.action-icon { flex-shrink: 0; }
.decks-coming { width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 10px; }.decks-coming__label { opacity: 0.6; }.decks-coming__list { display: flex; flex-direction: column; gap: 6px; }.deck-pill { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--color-surface); border-radius: 10px; opacity: 0.5; }.deck-pill__icon { color: var(--color-gold); font-size: 14px; }.deck-pill__name { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: var(--color-cream); flex: 1; }.deck-pill__soon { font-family: 'DM Sans', sans-serif; font-size: 10px; color: var(--color-cream-muted); letter-spacing: 0.1em; text-transform: uppercase; }
.overlay { position: absolute; inset: 0; z-index: 100; display: flex; align-items: flex-end; background: rgb(0 0 0 / 65%); backdrop-filter: blur(4px); }.bottom-sheet { width: 100%; padding: 16px 24px 40px; border-radius: 24px 24px 0 0; background: var(--color-surface); display: flex; flex-direction: column; gap: 8px; }.sheet-handle { width: 40px; height: 4px; margin: 0 auto 8px; border-radius: 2px; background: var(--color-surface-raised); }.menu-item { display: flex; align-items: center; gap: 12px; width: 100%; height: 52px; padding: 0 4px; border: none; border-bottom: 1px solid var(--color-surface-raised); background: none; color: var(--color-cream); font-family: 'Cormorant Garamond', serif; font-size: 22px; text-align: left; letter-spacing: 0.02em; cursor: pointer; }.menu-item__icon { display: inline-grid; flex: 0 0 22px; place-items: center; color: var(--color-gold); font-family: 'DM Sans', sans-serif; font-size: 16px; }.menu-item--danger { color: var(--color-cream-muted); }.sheet-close { height: 48px; margin-top: 8px; border: none; border-radius: 12px; background: var(--color-surface-raised); color: var(--color-cream-muted); font: 13px 'DM Sans', sans-serif; cursor: pointer; }
</style>