<script setup lang="ts">
import { onMounted, ref } from 'vue'
import GameView from '@/views/GameView.vue'
import LandingView from '@/views/LandingView.vue'
import PlayerSetupView from '@/views/PlayerSetupView.vue'

const isDesktop = ref(false)
const stage = ref<'landing' | 'setup' | 'game'>('landing')

onMounted(() => {
  isDesktop.value = window.innerWidth >= 769

  if (sessionStorage.getItem('table-auth') !== 'true') return

  try {
    const players = JSON.parse(sessionStorage.getItem('table-session-players') || '[]')
    stage.value = Array.isArray(players) && players.length >= 2 ? 'game' : 'setup'
  } catch {
    stage.value = 'setup'
  }
})

function onAuthenticated() {
  sessionStorage.setItem('table-auth', 'true')
  stage.value = 'setup'
}
</script>

<template>
  <!-- DESKTOP: iPhone frame wrapper -->
  <div v-if="isDesktop" class="desktop-shell">
    <div class="phone-frame">
      <div class="phone-notch"></div>
      <div class="phone-screen">
        <LandingView v-if="stage === 'landing'" @authenticated="onAuthenticated" />
        <PlayerSetupView v-else-if="stage === 'setup'" @ready="stage = 'game'" />
        <GameView v-else />
      </div>
      <div class="phone-chin"></div>
    </div>
  </div>

  <!-- MOBILE: full screen, no frame -->
  <template v-else>
    <LandingView v-if="stage === 'landing'" @authenticated="onAuthenticated" />
    <PlayerSetupView v-else-if="stage === 'setup'" @ready="stage = 'game'" />
    <GameView v-else />
  </template>
</template>

<style>
/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* CSS Tokens */
:root {
  --color-bg: #12131A;
  --color-surface: #1C1E28;
  --color-surface-raised: #252836;
  --color-cream: #F2EDE4;
  --color-cream-muted: #8F8C85;
  --color-accent: #9B8B6E;
  --color-gold: #B89A6A;
  --color-ink: #12131A;
  --color-cat-taste: #7A9E7E;
  --color-cat-wyr: #9B8B6E;
  --color-cat-hottake: #B89A6A;
  --color-cat-chefs: #7B8FA8;
  --color-cat-story: #9E8B7A;
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