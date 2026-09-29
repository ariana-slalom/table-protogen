<script setup lang="ts">
defineEmits<{ back: [] }>()
</script>

<template>
  <div class="gb-placeholder">
    <button class="back-btn" type="button" aria-label="Back" @click="$emit('back')">‹</button>
    <p>guest book coming</p>
  </div>
</template>

<style scoped>
.gb-placeholder { min-height: 100vh; display: flex; flex-direction: column; background: var(--color-bg); }
.back-btn { width: 44px; height: 44px; margin: 16px 8px 0; border: none; background: none; color: var(--color-cream-muted); font-size: 32px; cursor: pointer; }
.gb-placeholder p { padding: 40px 24px; color: var(--color-cream); font: 28px 'Cormorant Garamond', serif; }
</style>