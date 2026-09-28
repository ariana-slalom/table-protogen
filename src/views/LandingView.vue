<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ authenticated: [] }>()

const password = ref('')
const error = ref(false)
const isShaking = ref(false)

function submitPassword() {
  if (password.value === 'ariana-protogen303') {
    sessionStorage.setItem('table-auth', 'true')
    emit('authenticated')
    return
  }

  error.value = true
  password.value = ''
  isShaking.value = true
}

function clearShake() {
  isShaking.value = false
}
</script>

<template>
  <main class="landing">
    <div class="landing__content">
      <header class="landing__header">
        <h1>Table</h1>
        <p>For people with opinions about olive oil.</p>
      </header>

      <form class="password-card" @submit.prevent="submitPassword">
        <label for="password">tonight's password</label>
        <input
          id="password"
          v-model="password"
          :class="{ error, shake: isShaking }"
          type="password"
          autocomplete="current-password"
          @animationend="clearShake"
        />
        <button type="submit">Enter</button>
        <p v-if="error" class="error-message" role="alert">wrong password. try again.</p>
      </form>

      <p class="landing__footer">a game for the table</p>
    </div>
  </main>
</template>

<style scoped>
.landing {
  display: grid;
  min-height: 100dvh;
  overflow: hidden;
  place-items: center;
  padding: 24px;
  background: var(--color-bg);
}

.landing__content {
  width: min(100%, 342px);
}

.landing__header {
  margin-bottom: 32px;
  text-align: center;
}

h1 {
  margin: 0;
  color: var(--color-cream);
  font-family: 'Cormorant Garamond', serif;
  font-size: 52px;
  font-weight: 500;
  letter-spacing: 0.08em;
  line-height: 1;
}

.landing__header p {
  margin: 14px 0 0;
  color: var(--color-cream-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-style: italic;
  line-height: 1.4;
}

.password-card {
  padding: 32px 24px;
  border-radius: 16px;
  background: var(--color-surface);
  box-shadow: 0 8px 32px rgb(0 0 0 / 45%);
}

label {
  display: block;
  margin-bottom: 12px;
  color: var(--color-cream-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

input {
  box-sizing: border-box;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--color-surface-raised);
  border-radius: 8px;
  outline: none;
  background: var(--color-bg);
  caret-color: var(--color-terracotta);
  color: var(--color-cream);
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
}

input:focus,
input.error {
  border-color: var(--color-terracotta);
}

button {
  width: 100%;
  height: 48px;
  margin-top: 16px;
  border: 0;
  border-radius: 8px;
  background: var(--color-terracotta);
  color: var(--color-cream);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.error-message {
  margin: 10px 0 0;
  color: var(--color-terracotta);
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  text-align: center;
}

.landing__footer {
  margin: 24px 0 0;
  color: var(--color-cream-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-align: center;
  text-transform: uppercase;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-6px);
  }

  40% {
    transform: translateX(6px);
  }

  60% {
    transform: translateX(-4px);
  }

  80% {
    transform: translateX(4px);
  }
}

.shake {
  animation: shake 0.35s ease;
}
</style>