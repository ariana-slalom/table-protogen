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
      <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Rosemary: woody stem with fine needle leaves -->
        <path d="M39 86 23 25" stroke="#53664B" stroke-width="1.5" stroke-linecap="round" />
        <path d="m29 48-8-4m9 0-7-6m9 4-6-7m9 5-5-8m-3 20 8-2m-6-4 8-4m-6-4 7-5m-5-4 6-6" stroke="#7A9E7E" stroke-width="1.4" stroke-linecap="round" />
        <!-- Thyme: fine center stem with small paired leaves -->
        <path d="M40 86 40 20" stroke="#718467" stroke-width="1.25" stroke-linecap="round" />
        <ellipse cx="37" cy="67" rx="2.6" ry="1.35" fill="#91A982" transform="rotate(-22 37 67)" />
        <ellipse cx="43" cy="62" rx="2.6" ry="1.35" fill="#7A9E7E" transform="rotate(22 43 62)" />
        <ellipse cx="37" cy="56" rx="2.5" ry="1.3" fill="#91A982" transform="rotate(-22 37 56)" />
        <ellipse cx="43" cy="51" rx="2.5" ry="1.3" fill="#7A9E7E" transform="rotate(22 43 51)" />
        <ellipse cx="37" cy="45" rx="2.3" ry="1.2" fill="#91A982" transform="rotate(-22 37 45)" />
        <ellipse cx="43" cy="40" rx="2.3" ry="1.2" fill="#7A9E7E" transform="rotate(22 43 40)" />
        <ellipse cx="37" cy="34" rx="2.1" ry="1.1" fill="#91A982" transform="rotate(-22 37 34)" />
        <ellipse cx="43" cy="29" rx="2.1" ry="1.1" fill="#7A9E7E" transform="rotate(22 43 29)" />
        <!-- Marjoram: warm broad paired leaves -->
        <path d="M41 86 57 30" stroke="#617559" stroke-width="1.4" stroke-linecap="round" />
        <ellipse cx="49" cy="63" rx="4" ry="2.5" fill="#8AA37B" transform="rotate(-28 49 63)" />
        <ellipse cx="55" cy="57" rx="4" ry="2.5" fill="#78966E" transform="rotate(28 55 57)" />
        <ellipse cx="51" cy="51" rx="3.7" ry="2.3" fill="#8AA37B" transform="rotate(-28 51 51)" />
        <ellipse cx="57" cy="45" rx="3.7" ry="2.3" fill="#78966E" transform="rotate(28 57 45)" />
        <ellipse cx="54" cy="39" rx="3.3" ry="2.1" fill="#8AA37B" transform="rotate(-28 54 39)" />
        <ellipse cx="59" cy="34" rx="3.1" ry="2" fill="#78966E" transform="rotate(28 59 34)" />
        <path d="M30 82 Q40 80 50 82" stroke="#B89A6A" stroke-width="2" stroke-linecap="round" fill="none" />
        <path d="M31 86 Q40 84 49 86" stroke="#C9AD7A" stroke-width="1.5" stroke-linecap="round" fill="none" />
        <path d="M32 90 Q40 88 48 90" stroke="#B89A6A" stroke-width="1.5" stroke-linecap="round" fill="none" />
        <circle cx="40" cy="84" r="2" fill="#C9AD7A" />
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
  height: 100px;
  margin: 8px 0;
  opacity: 0.85;
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