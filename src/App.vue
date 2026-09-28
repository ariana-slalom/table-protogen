<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LandingView from '@/views/LandingView.vue'

const authenticated = ref(false)
const isDesktop = ref(false)

onMounted(() => {
  authenticated.value = sessionStorage.getItem('table-auth') === 'true'
  isDesktop.value = window.innerWidth >= 769
})

function onAuth() {
  sessionStorage.setItem('table-auth', 'true')
  authenticated.value = true
}
</script>

<template>
  <!-- DESKTOP: iPhone frame wrapper -->
  <div v-if="isDesktop" class="desktop-shell">
    <div class="phone-frame">
      <div class="phone-notch"></div>
      <div class="phone-screen">
        <LandingView v-if="!authenticated" @authenticated="onAuth" />
        <RouterView v-else />
      </div>
      <div class="phone-chin"></div>
    </div>
  </div>

  <!-- MOBILE: full screen, no frame -->
  <template v-else>
    <LandingView v-if="!authenticated" @authenticated="onAuth" />
    <RouterView v-else />
  </template>
</template>

<style>
/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* CSS Tokens */
:root {
  --color-bg: #1A1713;
  --color-surface: #2A2420;
  --color-surface-raised: #332C28;
  --color-cream: #F7F2E8;
  --color-cream-muted: #B8B0A4;
  --color-terracotta: #C4622D;
  --color-gold: #C9973A;
  --color-ink: #1C1C1A;
  --color-cat-taste: #7A9E7E;
  --color-cat-wyr: #C4622D;
  --color-cat-hottake: #C9973A;
  --color-cat-chefs: #6B8FA8;
  --color-cat-story: #9E7E6B;
}

html, body {
  height: 100%;
  background-color: #0F0D0B;
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Mobile: full screen */
@media (max-width: 768px) {
  html, body {
    background-color: var(--color-bg);
  }
}

/* Desktop: center the frame */
@media (min-width: 769px) {
  .desktop-shell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    min-height: 100vh;
  }

  .phone-frame {
    position: relative;
    width: 393px;
    height: 852px;
    background: var(--color-bg);
    border-radius: 54px;
    border: 10px solid #2E2A27;
    box-shadow:
      0 0 0 1px #3D3733,
      0 40px 80px rgba(0,0,0,0.7),
      inset 0 0 0 1px #1A1713;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .phone-notch {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 126px;
    height: 36px;
    background: #0F0D0B;
    border-radius: 0 0 20px 20px;
    z-index: 10;
    flex-shrink: 0;
  }

  .phone-screen {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 36px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .phone-screen::-webkit-scrollbar { display: none; }

  .phone-chin {
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .phone-chin::after {
    content: '';
    width: 120px;
    height: 5px;
    background: #3D3733;
    border-radius: 3px;
  }
}
</style>