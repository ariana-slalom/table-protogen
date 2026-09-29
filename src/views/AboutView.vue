<script setup lang="ts">
defineEmits<{ back: [] }>()
</script>

<template>
  <div class="about">
    <div class="about-header">
      <button class="back-btn" type="button" aria-label="Back" @click="$emit('back')">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12 4 L6 10 L12 16" stroke="var(--color-cream-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <h1 class="about-title">About</h1>
      <div class="header-space"></div>
    </div>

    <div class="about-body">
      <div class="about-mark">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 4 L34 12 L34 28 L20 36 L6 28 L6 12 Z" stroke="var(--color-gold)" stroke-width="1" fill="none" stroke-linejoin="round" /><line x1="12" y1="20" x2="28" y2="20" stroke="var(--color-gold)" stroke-width="1" stroke-linecap="round" /></svg>
      </div>
      <h2 class="about-name">Table</h2>
      <p class="about-deck">Deck 01 - The Starter Deck</p>
      <p class="about-text">Table is a dinner party card game for people who take food seriously and themselves lightly. It was built for the table - the actual table, the one with the good bottle open and everyone still arguing about the last course.</p>
      <p class="about-text">The cards are designed for a specific kind of person: curious, opinionated, generous with what's in their glass, and constitutionally incapable of letting a bad food take go unchallenged.</p>
      <p class="about-text">This is Deck 01. More are coming - The Brewmaster, French Classics, The Cellar, Fire & Smoke. Each one goes deeper into a world worth arguing about.</p>
      <div class="about-divider"></div>
      <div class="about-meta">
        <div class="meta-row"><span class="meta-label">version</span><span class="meta-value">1.0 · Starter Deck</span></div>
        <div class="meta-row"><span class="meta-label">cards</span><span class="meta-value">60 across 5 categories</span></div>
        <div class="meta-row"><span class="meta-label">players</span><span class="meta-value">2 - 8</span></div>
        <div class="meta-row"><span class="meta-label">best with</span><span class="meta-value">a good bottle and strong opinions</span></div>
      </div>
      <div class="about-divider"></div>
      <p class="about-footer">Built with love for the people who debate olive oil terroir and then open the good bottle anyway.</p>
      <p class="about-copyright">© {{ new Date().getFullYear() }} Table. All rights reserved.</p>
    </div>

    <button class="back-to-table" type="button" @click="$emit('back')">back to the table</button>
  </div>
</template>

<style scoped>
.about { min-height: 100vh; display: flex; flex-direction: column; padding: 0 24px 48px; overflow-y: auto; background: var(--color-bg); }.about-header { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 16px 0 8px; background: var(--color-bg); }.back-btn,.header-space { width: 44px; height: 44px; }.back-btn { display: grid; place-items: center; border: none; background: none; cursor: pointer; }.about-title { color: var(--color-cream); font: 400 22px 'Cormorant Garamond', serif; letter-spacing: .04em; }.about-body { display: flex; flex-direction: column; gap: 20px; padding-top: 16px; }.about-mark { display: flex; justify-content: center; padding: 8px 0; }.about-name { color: var(--color-cream); font: 400 48px/1 'Cormorant Garamond', serif; letter-spacing: .06em; text-align: center; }.about-deck { color: var(--color-gold); font: 11px 'DM Sans', sans-serif; letter-spacing: .12em; text-align: center; text-transform: uppercase; opacity: .8; }.about-text { color: var(--color-cream-muted); font: 18px/1.6 'Cormorant Garamond', serif; }.about-divider { height: 1px; margin: 4px 0; background: var(--color-surface-raised); }.about-meta { display: flex; flex-direction: column; }.meta-row { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--color-surface-raised); }.meta-label { flex-shrink: 0; color: var(--color-cream-muted); font: 10px 'DM Sans', sans-serif; letter-spacing: .1em; text-transform: uppercase; opacity: .6; }.meta-value { color: var(--color-cream); font: 17px 'Cormorant Garamond', serif; text-align: right; }.about-footer { color: var(--color-cream-muted); font: italic 16px/1.5 'Cormorant Garamond', serif; text-align: center; opacity: .6; }.about-copyright { margin-top: 8px; color: var(--color-cream-muted); font: 10px 'DM Sans', sans-serif; letter-spacing: .08em; text-align: center; opacity: .35; }.back-to-table { width: 100%; height: 52px; margin-top: 32px; border: 1px solid var(--color-surface-raised); border-radius: 14px; background: var(--color-surface); color: var(--color-cream-muted); font: 500 13px 'DM Sans', sans-serif; letter-spacing: .08em; cursor: pointer; } @media (min-width: 769px) { .about { min-height: calc(852px - 70px); } }
</style>