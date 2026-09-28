<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ authenticated: [] }>()

const password = ref('')
const error = ref(false)
const shaking = ref(false)

function submit() {
  if (password.value === 'ariana-protogen303') {
    emit('authenticated')
  } else {
    error.value = true
    shaking.value = true
    password.value = ''
    setTimeout(() => { shaking.value = false }, 400)
  }
}
</script>

<template>
  <div class="landing">
    <div class="landing__top">
      <h1 class="wordmark">Table</h1>
      <p class="tagline">For people with opinions about olive oil.</p>
    </div>

    <div class="illustration">
      <svg width="86" height="92" viewBox="18 32 60 76" role="img" aria-label="An herb canapé">
        <path d="M25 76h46l-5 18H30l-5-18Z" fill="#C9973A" />
        <path d="M30 94h36l-3 7H33l-3-7Z" fill="#A97832" />
        <ellipse cx="48" cy="76" rx="23" ry="9" fill="#E5D8B8" />
        <path d="M31 74c2-14 11-22 18-22s17 8 18 22c-8 6-28 6-36 0Z" fill="#F0EDE6" />
        <path d="M36 69c4-8 8-12 13-12s10 4 14 12" fill="none" stroke="#D1CBC0" stroke-width="1.5" stroke-linecap="round" />
        <path d="M38 70c1-6 10-9 16-5 5 3 3 9-2 9-5 0-6-6-1-9 5-3 12 0 12 6" fill="none" stroke="#C9973A" stroke-width="1.5" stroke-linecap="round" />
        <path d="M49 57c-1-9 3-15 10-18-1 8-4 13-10 18Z" fill="#7A9E7E" />
        <path d="M48 58c-6-4-10-9-10-15 7 2 11 7 10 15Z" fill="#6B8FA8" />
        <path d="M49 58 47 46" fill="none" stroke="#B8B0A4" stroke-width="1" stroke-linecap="round" />
      </svg>
    </div>

    <div class="landing__card" :class="{ shake: shaking }">
      <label class="field-label">tonight's password</label>
      <input
        v-model="password"
        type="password"
        class="field-input"
        :class="{ 'field-input--error': error }"
        @keyup.enter="submit"
        @focus="error = false"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />
      <p v-if="error" class="error-msg">wrong password. try again.</p>
      <button class="submit-btn" @click="submit">Enter</button>
    </div>

    <p class="bottom-label">a game for the table</p>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background-color: var(--color-bg);
  gap: 32px;
}

/* On desktop inside phone frame, min-height should fill frame not viewport */
@media (min-width: 769px) {
  .landing {
    min-height: calc(852px - 70px);
  }
}

.landing__top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.wordmark {
  font-family: 'Cormorant Garamond', serif;
  font-size: 56px;
  font-weight: 400;
  color: var(--color-cream);
  letter-spacing: 0.06em;
  line-height: 1;
}

.tagline {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-style: italic;
  color: var(--color-cream-muted);
  letter-spacing: 0.01em;
  text-align: center;
}

.illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 92px;
  margin: 0;
}

.landing__card {
  width: 100%;
  max-width: 360px;
  background: var(--color-surface);
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.45);
  display: flex;
  flex-direction: column;
  gap: 0;
}

.field-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-cream-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 12px;
  display: block;
}

.field-input {
  width: 100%;
  background: var(--color-bg);
  border: 1px solid var(--color-surface-raised);
  border-radius: 8px;
  padding: 14px 16px;
  color: var(--color-cream);
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  outline: none;
  caret-color: var(--color-terracotta);
  transition: border-color 0.15s ease;
}

.field-input:focus {
  border-color: var(--color-terracotta);
}

.field-input--error {
  border-color: var(--color-terracotta);
}

.error-msg {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: var(--color-terracotta);
  margin-top: 8px;
  text-align: center;
}

.submit-btn {
  width: 100%;
  margin-top: 16px;
  height: 48px;
  background: var(--color-terracotta);
  color: var(--color-cream);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.bottom-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: var(--color-cream-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.shake {
  animation: shake 0.4s ease;
}
</style>