<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import LandingView from '@/views/LandingView.vue'
import AboutView from '@/views/AboutView.vue'
import PlayerSetupView from '@/views/PlayerSetupView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import GameView from '@/views/GameView.vue'
import GuestBookView from '@/views/GuestBookView.vue'
import HouseRulesView from '@/views/HouseRulesView.vue'

type Stage = 'landing' | 'setup' | 'welcome' | 'game' | 'rules' | 'guestbook' | 'about'

const stage = ref<Stage>('landing')
const isDesktop = ref(false)

onMounted(() => {
  isDesktop.value = window.innerWidth >= 769

  const auth = sessionStorage.getItem('table-auth') === 'true'
  const hasPlayers = (() => {
    try {
      const players = JSON.parse(sessionStorage.getItem('table-session-players') || '[]')
      return players.length >= 2
    } catch {
      return false
    }
  })()
  const welcomeSeen = sessionStorage.getItem('table-welcome-seen') === 'true'

  if (!auth) {
    stage.value = 'landing'
  } else if (!hasPlayers) {
    stage.value = 'setup'
  } else if (!welcomeSeen) {
    stage.value = 'welcome'
  } else {
    stage.value = 'game'
  }
})

function onAuth() {
  sessionStorage.setItem('table-auth', 'true')
  stage.value = 'setup'
}

function resetScrollPosition() {
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    document.querySelector<HTMLElement>('.phone-screen')?.scrollTo({ top: 0, behavior: 'auto' })
  })
}

watch(stage, resetScrollPosition, { flush: 'post' })
</script>

<template>
  <template v-if="isDesktop">
    <div class="desktop-shell">
      <div class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <LandingView v-if="stage === 'landing'" @authenticated="onAuth" />
          <PlayerSetupView v-else-if="stage === 'setup'" @ready="stage = 'welcome'" />
          <WelcomeView v-else-if="stage === 'welcome'" @play="stage = 'game'" @rules="stage = 'rules'" @guestbook="stage = 'guestbook'" @about="stage = 'about'" />
          <HouseRulesView v-else-if="stage === 'rules'" @back="stage = 'welcome'" />
          <GuestBookView v-else-if="stage === 'guestbook'" @back="stage = 'welcome'" />
          <AboutView v-else-if="stage === 'about'" @back="stage = 'welcome'" />
          <GameView v-else @home="stage = 'welcome'" @rules="stage = 'rules'" @guestbook="stage = 'guestbook'" @about="stage = 'about'" />
        </div>
        <div class="phone-chin"></div>
      </div>
    </div>
  </template>
  <template v-else>
    <LandingView v-if="stage === 'landing'" @authenticated="onAuth" />
    <PlayerSetupView v-else-if="stage === 'setup'" @ready="stage = 'welcome'" />
    <WelcomeView v-else-if="stage === 'welcome'" @play="stage = 'game'" @rules="stage = 'rules'" @guestbook="stage = 'guestbook'" @about="stage = 'about'" />
    <HouseRulesView v-else-if="stage === 'rules'" @back="stage = 'welcome'" />
    <GuestBookView v-else-if="stage === 'guestbook'" @back="stage = 'welcome'" />
    <AboutView v-else-if="stage === 'about'" @back="stage = 'welcome'" />
    <GameView v-else @home="stage = 'welcome'" @rules="stage = 'rules'" @guestbook="stage = 'guestbook'" @about="stage = 'about'" />
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
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background-color: #0F0D0B;
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

#app {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.accessibility-mode :focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

.accessibility-mode .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.accessibility-mode.reduced-motion *,
.accessibility-mode.reduced-motion *::before,
.accessibility-mode.reduced-motion *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  scroll-behavior: auto !important;
  transition-duration: 0.01ms !important;
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