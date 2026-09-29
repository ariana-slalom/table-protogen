<script setup lang="ts">
defineEmits<{ back: [] }>()

const rules = [
  { icon: '◈', title: 'Choose your deck', body: 'Start with The Starter Deck - 45 cards across five categories. More themed decks are coming. Each one goes deeper into a world.' },
  { icon: '◇', title: 'Swipe through prompts', body: 'One card at a time. Read it aloud. Swipe left to advance, right to go back. Pass the phone - whoever draws the card reads it.' },
  { icon: '△', title: 'Award points', body: 'Think Cards Against Humanity but for people who have opinions about the Maillard reaction. Best answer wins the point. Funniest answer also wins the point. The host decides. Democracy is optional.' },
  { icon: '◆', title: 'Debate This', body: 'Tap "debate this" on any card to pull up sources and settle the argument. This is not cheating. This is due diligence.' },
  { icon: '○', title: 'Timed rounds', body: 'Some cards run on a 60-second clock. The circle counts down in the corner of the card. First correct answer, or best take when time runs out, takes the point.' },
  { icon: '✦', title: 'Sign the guest book', body: 'Before you leave, open the guest book. Leave a thought, a dinner idea, a note for the next deck. Your entry stays - shared across every table that plays.' }
]
</script>

<template>
  <div class="rules-page">
    <div class="rules-header">
      <button class="back-btn" type="button" aria-label="Back" @click="$emit('back')">‹</button>
      <h1 class="rules-title">House Rules</h1>
      <div class="header-space"></div>
    </div>
    <p class="rules-intro">Table is a dinner party card game for people who take food seriously and themselves lightly.</p>
    <div class="rules-list">
      <div v-for="rule in rules" :key="rule.title" class="rule-item">
        <div class="rule-icon">{{ rule.icon }}</div>
        <div class="rule-content"><h3>{{ rule.title }}</h3><p>{{ rule.body }}</p></div>
      </div>
    </div>
    <div class="rules-footer"><p>No wrong answers. Except wrong answers about the Maillard reaction.</p></div>
    <button class="play-btn" type="button" @click="$emit('back')">back to the table</button>
  </div>
</template>

<style scoped>
.rules-page { min-height: 100vh; display: flex; flex-direction: column; padding: 0 24px 48px; overflow-y: auto; background: var(--color-bg); }.rules-header { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 16px 0 8px; background: var(--color-bg); }.back-btn,.header-space { width: 44px; height: 44px; }.back-btn { border: none; background: none; color: var(--color-cream-muted); font-size: 32px; cursor: pointer; }.rules-title { color: var(--color-cream); font: 400 22px 'Cormorant Garamond', serif; letter-spacing: .04em; }.rules-intro { margin: 8px 0 32px; color: var(--color-cream-muted); font: italic 18px/1.5 'Cormorant Garamond', serif; }.rules-list { display: flex; flex-direction: column; gap: 28px; }.rule-item { display: flex; gap: 16px; align-items: flex-start; }.rule-icon { flex: 0 0 24px; margin-top: 3px; color: var(--color-gold); font-size: 16px; text-align: center; }.rule-content { display: flex; flex-direction: column; gap: 6px; }.rule-content h3 { color: var(--color-cream); font: 600 11px 'DM Sans', sans-serif; letter-spacing: .1em; text-transform: uppercase; }.rule-content p { color: var(--color-cream-muted); font: 17px/1.5 'Cormorant Garamond', serif; }.rules-footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--color-surface-raised); }.rules-footer p { color: var(--color-cream-muted); font: italic 16px/1.5 'Cormorant Garamond', serif; opacity: .6; text-align: center; }.play-btn { width: 100%; height: 52px; margin-top: 32px; border: 1px solid var(--color-surface-raised); border-radius: 14px; background: var(--color-surface); color: var(--color-cream-muted); font: 500 13px 'DM Sans', sans-serif; letter-spacing: .08em; cursor: pointer; } @media (min-width: 769px) { .rules-page { min-height: calc(852px - 70px); } }
</style>