<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlayers } from '@/composables/usePlayers'

const emit = defineEmits<{ ready: [] }>()

const { sessionPlayers, searchRoster, addToSession, removeFromSession } = usePlayers()

const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const suggestions = computed(() => searchRoster.value(query.value))

function selectPlayer(name: string) {
  addToSession(name)
  query.value = ''
  inputRef.value?.focus()
}

function handleEnter() {
  if (!query.value.trim()) return

  const match = suggestions.value.find(
    player => player.name.toLowerCase() === query.value.trim().toLowerCase()
  )
  selectPlayer(match ? match.name : query.value.trim())
}

function startGame() {
  if (sessionPlayers.value.length < 2) return
  emit('ready')
}
</script>

<template>
  <div class="setup">
    <div class="setup__header">
      <h1 class="wordmark">Table</h1>
      <p class="setup__sub">who's playing tonight?</p>
    </div>

    <p class="setup__context">
      Use the same name each visit - your points accumulate on the leaderboard across games.
    </p>

    <div v-if="sessionPlayers.length" class="player-chips">
      <div v-for="player in sessionPlayers" :key="player.id" class="player-chip">
        <span class="chip-name">{{ player.name }}</span>
        <button class="chip-remove" type="button" :aria-label="`Remove ${player.name}`" @click="removeFromSession(player.id)">
          ×
        </button>
      </div>
    </div>

    <div v-if="sessionPlayers.length < 8" class="search-wrap">
      <input
        ref="inputRef"
        v-model="query"
        class="search-input"
        type="text"
        placeholder="search or add a player"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="words"
        spellcheck="false"
        @keyup.enter="handleEnter"
      />

      <div v-if="suggestions.length && query.length > 0" class="suggestions">
        <button
          v-for="player in suggestions"
          :key="player.id"
          class="suggestion-item"
          type="button"
          @click="selectPlayer(player.name)"
        >
          {{ player.name }}
        </button>
      </div>

      <div
        v-else-if="query.trim().length > 1 && !suggestions.find(player => player.name.toLowerCase() === query.trim().toLowerCase())"
        class="suggestions"
      >
        <button class="suggestion-item suggestion-item--new" type="button" @click="selectPlayer(query.trim())">
          add "{{ query.trim() }}"
        </button>
      </div>
    </div>

    <p v-if="sessionPlayers.length < 2" class="setup__hint">
      add at least 2 players to begin
    </p>

    <button
      class="start-btn"
      :class="{ 'start-btn--ready': sessionPlayers.length >= 2 }"
      :disabled="sessionPlayers.length < 2"
      type="button"
      @click="startGame"
    >
      let's eat
    </button>

    <p v-if="sessionPlayers.length >= 2" class="setup__count">
      {{ sessionPlayers.length }} players · up to 8
    </p>
  </div>
</template>

<style scoped>
.setup {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px 40px;
  background: var(--color-bg);
  gap: 24px;
}

@media (min-width: 769px) {
  .setup { min-height: calc(852px - 70px); }
}

.setup__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.wordmark {
  font-family: 'Cormorant Garamond', serif;
  font-size: 48px;
  font-weight: 400;
  color: var(--color-cream);
  letter-spacing: 0.06em;
  line-height: 1;
}

.setup__sub {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--color-cream-muted);
  font-style: italic;
}

.setup__context {
  max-width: 280px;
  color: var(--color-cream-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  line-height: 1.5;
  opacity: 0.7;
  text-align: center;
}

.player-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  width: 100%;
  max-width: 360px;
}

.player-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-surface);
  border-radius: 100px;
  padding: 6px 12px 6px 14px;
}

.chip-name {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: var(--color-cream);
}

.chip-remove {
  background: none;
  border: none;
  color: var(--color-cream-muted);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-wrap {
  position: relative;
  width: 100%;
  max-width: 360px;
}

.search-input {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-raised);
  border-radius: 12px;
  padding: 16px 18px;
  color: var(--color-cream);
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  outline: none;
  caret-color: var(--color-accent);
  transition: border-color 0.15s ease;
}

.search-input:focus {
  border-color: var(--color-accent);
}

.search-input::placeholder {
  color: var(--color-cream-muted);
  opacity: 0.6;
}

.suggestions {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--color-surface-raised);
  border-radius: 12px;
  overflow: hidden;
  z-index: 10;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.suggestion-item {
  display: block;
  width: 100%;
  padding: 14px 18px;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: var(--color-cream);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}

.suggestion-item:last-child { border-bottom: none; }

.suggestion-item--new {
  color: var(--color-accent);
  font-style: italic;
}

.setup__hint {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: var(--color-cream-muted);
  opacity: 0.6;
}

.start-btn {
  width: 100%;
  max-width: 360px;
  height: 52px;
  background: var(--color-surface);
  color: var(--color-cream-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid var(--color-surface-raised);
  border-radius: 12px;
  cursor: not-allowed;
  transition: all 0.2s ease;
}

.start-btn--ready {
  background: var(--color-accent);
  color: var(--color-cream);
  border-color: var(--color-accent);
  cursor: pointer;
}

.setup__count {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: var(--color-cream-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>