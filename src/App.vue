<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LandingView from './views/LandingView.vue'

const authenticated = ref(false)

onMounted(() => {
  authenticated.value = sessionStorage.getItem('table-auth') === 'true'
})

function authenticate() {
  sessionStorage.setItem('table-auth', 'true')
  authenticated.value = true
}
</script>

<template>
  <main v-if="authenticated" class="app-placeholder" aria-label="Table game">
    <span>Table</span>
  </main>
  <LandingView v-else @authenticated="authenticate" />
</template>

<style scoped>
.app-placeholder {
  display: grid;
  min-height: 100dvh;
  place-items: center;
  color: var(--color-cream);
  font-family: 'Cormorant Garamond', serif;
  font-size: 52px;
  letter-spacing: 0.08em;
}
</style>