<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGuestBook } from '@/composables/useGuestBook'

const emit = defineEmits<{ back: [] }>()
const { entries, loading, error, fetchEntries, addEntry } = useGuestBook()

const showForm = ref(false)
const name = ref('')
const message = ref('')
const submitting = ref(false)
const submitted = ref(false)
const prompts = [
  "What's your next dinner party theme?",
  "A dish you've been meaning to attempt.",
  'What deck would you want next?',
  'A food memory worth keeping.',
  'Something the table argued about tonight.'
]
const activePrompt = ref(prompts[Math.floor(Math.random() * prompts.length)])

async function submit() {
  if (!name.value.trim() || !message.value.trim()) return
  submitting.value = true
  const succeeded = await addEntry(name.value.trim(), message.value.trim(), activePrompt.value)
  submitting.value = false

  if (succeeded) {
    submitted.value = true
    showForm.value = false
    name.value = ''
    message.value = ''
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

onMounted(fetchEntries)
</script>

<template>
  <div class="guestbook">
    <div class="gb-header">
      <button class="back-btn" type="button" aria-label="Back" @click="emit('back')">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12 4 L6 10 L12 16" stroke="var(--color-cream-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <h1 class="gb-title">Guest Book</h1>
      <div class="header-space"></div>
    </div>

    <p class="gb-intro">Leave your mark. Every entry stays - shared across every table that plays.</p>

    <button v-if="!showForm" class="sign-btn" type="button" @click="showForm = true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><line x1="7" y1="1" x2="7" y2="13" stroke="var(--color-ink)" stroke-width="1.5" stroke-linecap="round" /><line x1="1" y1="7" x2="13" y2="7" stroke="var(--color-ink)" stroke-width="1.5" stroke-linecap="round" /></svg>
      sign the book
    </button>

    <div v-if="submitted" class="gb-success"><p>✦ your entry has been added to the table.</p></div>

    <div v-if="showForm" class="gb-form">
      <p class="gb-form__prompt">{{ activePrompt }}</p>
      <textarea v-model="message" class="gb-textarea" :placeholder="activePrompt" rows="4" maxlength="400"></textarea>
      <p class="gb-char-count">{{ message.length }} / 400</p>
      <label class="gb-signoff" for="guest-book-name">signing off</label>
      <input id="guest-book-name" v-model="name" class="gb-input" type="text" placeholder="your name" maxlength="40" autocomplete="off" autocorrect="off" autocapitalize="words" />
      <div class="gb-form__actions">
        <button class="gb-cancel" type="button" @click="showForm = false">cancel</button>
        <button class="gb-submit" type="button" :disabled="!name.trim() || !message.trim() || submitting" @click="submit">{{ submitting ? 'saving...' : 'leave your mark' }}</button>
      </div>
      <p v-if="error" class="gb-error">{{ error }}</p>
    </div>

    <div class="gb-divider"></div>
    <div v-if="loading" class="gb-loading"><p>opening the book...</p></div>
    <div v-else-if="entries.length === 0" class="gb-empty"><p>No entries yet. Be the first to sign.</p></div>
    <div v-else class="gb-entries">
      <div v-for="entry in entries" :key="entry.id" class="gb-entry">
        <div class="gb-entry__header"><span class="gb-entry__name">{{ entry.name }}</span><span class="gb-entry__date">{{ formatDate(entry.created_at) }}</span></div>
        <p v-if="entry.prompt" class="gb-entry__prompt">{{ entry.prompt }}</p>
        <p class="gb-entry__message">{{ entry.message }}</p>
      </div>
    </div>

    <button class="back-to-table" type="button" @click="emit('back')">back to the table</button>
  </div>
</template>

<style scoped>
.guestbook { min-height: 100vh; display: flex; flex-direction: column; padding: 0 24px 48px; overflow-y: auto; background: var(--color-bg); }.gb-header { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 16px 0 8px; background: var(--color-bg); }.back-btn,.header-space { width: 44px; height: 44px; }.back-btn { display: grid; place-items: center; border: none; background: none; cursor: pointer; }.gb-title { color: var(--color-cream); font: 400 22px 'Cormorant Garamond', serif; letter-spacing: .04em; }.gb-intro { margin: 4px 0 20px; color: var(--color-cream-muted); font: italic 17px/1.5 'Cormorant Garamond', serif; }.sign-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; height: 52px; margin-bottom: 8px; border: none; border-radius: 14px; background: var(--color-cream); color: var(--color-ink); font: 500 14px 'DM Sans', sans-serif; letter-spacing: .08em; cursor: pointer; }
.gb-success { margin-bottom: 8px; padding: 14px 16px; border-left: 2px solid var(--color-gold); border-radius: 12px; background: var(--color-surface); }.gb-success p { color: var(--color-gold); font: italic 17px 'Cormorant Garamond', serif; }.gb-form { display: flex; flex-direction: column; gap: 12px; margin-bottom: 8px; padding: 20px; border-radius: 16px; background: var(--color-surface); }.gb-form__prompt { color: var(--color-gold); font: italic 17px/1.4 'Cormorant Garamond', serif; }.gb-input,.gb-textarea { width: 100%; padding: 12px 14px; border: 1px solid var(--color-surface-raised); border-radius: 8px; outline: none; background: var(--color-bg); color: var(--color-cream); font: 14px 'DM Sans', sans-serif; caret-color: var(--color-accent); }.gb-input:focus,.gb-textarea:focus { border-color: var(--color-accent); }.gb-textarea { resize: none; font: 16px/1.5 'Cormorant Garamond', serif; }.gb-char-count { margin-top: -4px; color: var(--color-cream-muted); font: 10px 'DM Sans', sans-serif; text-align: right; opacity: .5; }.gb-signoff { margin-top: 4px; color: var(--color-cream-muted); font: 11px 'DM Sans', sans-serif; letter-spacing: .1em; text-transform: uppercase; }.gb-form__actions { display: flex; justify-content: flex-end; gap: 8px; }.gb-cancel { padding: 10px 14px; border: none; background: none; color: var(--color-cream-muted); font: 12px 'DM Sans', sans-serif; cursor: pointer; }.gb-submit { padding: 10px 18px; border: none; border-radius: 10px; background: var(--color-accent); color: var(--color-cream); font: 500 12px 'DM Sans', sans-serif; letter-spacing: .06em; cursor: pointer; }.gb-submit:disabled { cursor: not-allowed; opacity: .4; }.gb-error { color: var(--color-accent); font: 12px 'DM Sans', sans-serif; }
.gb-divider { height: 1px; margin: 16px 0; background: var(--color-surface-raised); }.gb-loading,.gb-empty { padding: 24px 0; text-align: center; }.gb-loading p,.gb-empty p { color: var(--color-cream-muted); font: italic 17px 'Cormorant Garamond', serif; }.gb-entries { display: flex; flex-direction: column; }.gb-entry { display: flex; flex-direction: column; gap: 6px; padding: 18px 0; border-bottom: 1px solid var(--color-surface-raised); }.gb-entry__header { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }.gb-entry__name { color: var(--color-cream); font: 500 18px 'Cormorant Garamond', serif; }.gb-entry__date { flex-shrink: 0; color: var(--color-cream-muted); font: 10px 'DM Sans', sans-serif; letter-spacing: .06em; }.gb-entry__prompt { color: var(--color-gold); font: 10px 'DM Sans', sans-serif; letter-spacing: .08em; text-transform: uppercase; opacity: .7; }.gb-entry__message { color: var(--color-cream-muted); font: 17px/1.5 'Cormorant Garamond', serif; }.back-to-table { width: 100%; height: 52px; margin-top: 32px; border: 1px solid var(--color-surface-raised); border-radius: 14px; background: var(--color-surface); color: var(--color-cream-muted); font: 500 13px 'DM Sans', sans-serif; letter-spacing: .08em; cursor: pointer; } @media (min-width: 769px) { .guestbook { min-height: calc(852px - 70px); } }
</style>