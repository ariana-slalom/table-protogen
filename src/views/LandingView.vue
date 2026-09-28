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
      <svg width="140" height="60" viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Spoon handle -->
        <path d="M10 32 Q50 30 90 31" stroke="#8B7A65" stroke-width="2" stroke-linecap="round" />
        <!-- Spoon bowl -->
        <ellipse cx="105" cy="31" rx="16" ry="10" fill="#2A2420" stroke="#6B6055" stroke-width="1.2" />
        <!-- Quenelle on spoon -->
        <path d="M93 31 Q98 23 105 24 Q112 23 117 31 Q112 35 105 34 Q98 35 93 31Z" fill="#7A6B5A" stroke="#6B5E4E" stroke-width="0.8" />
        <!-- Micro herb left -->
        <path d="M101 24 Q99 19 97 17" stroke="#7A9E7E" stroke-width="1.5" stroke-linecap="round" />
        <!-- Micro herb right -->
        <path d="M103 23 Q104 18 106 16" stroke="#7A9E7E" stroke-width="1.5" stroke-linecap="round" />
        <!-- Gold dot garnish -->
        <circle cx="108" cy="26" r="2" fill="#B89A6A" />
        <!-- Sauce dot on spoon -->
        <circle cx="97" cy="32" r="1.5" fill="#9B8B6E" opacity="0.7" />
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
  height: 60px;
  margin: 4px 0;
  opacity: 0.9;
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
  caret-color: var(--color-accent);
  transition: border-color 0.15s ease;
}

.field-input:focus {
  border-color: var(--color-accent);
}

.field-input--error {
  border-color: var(--color-accent);
}

.error-msg {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: var(--color-accent);
  margin-top: 8px;
  text-align: center;
}

.submit-btn {
  width: 100%;
  margin-top: 16px;
  height: 48px;
  background: var(--color-accent);
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