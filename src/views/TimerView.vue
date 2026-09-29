<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useAccessibility } from '@/composables/useAccessibility'

const props = defineProps<{ seconds: number }>()
const emit = defineEmits<{ close: [] }>()
const { isAccessibilityMode } = useAccessibility()

const total = props.seconds || 60
const remaining = ref(total)
const isRunning = ref(false)
const isDone = ref(false)
let interval: ReturnType<typeof setInterval> | null = null
let dragStartY = 0
let dragStartRemaining = 0

const radius = 100
const circumference = 2 * Math.PI * radius
const strokeDash = computed(() => `${circumference * (remaining.value / total)} ${circumference}`)
const displayTime = computed(() => {
  const minutes = Math.floor(remaining.value / 60)
  const seconds = remaining.value % 60
  return minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${remaining.value}`
})
const isPulsing = computed(() => remaining.value <= 10 && isRunning.value)

function stopInterval() {
  if (interval) clearInterval(interval)
  interval = null
}

function start() {
  if (isDone.value) return reset()
  if (isRunning.value) return
  isRunning.value = true
  interval = setInterval(() => {
    remaining.value--
    if (remaining.value <= 0) {
      remaining.value = 0
      stopInterval()
      isRunning.value = false
      isDone.value = true
      playDing()
    }
  }, 1000)
}

function pause() {
  stopInterval()
  isRunning.value = false
}

function reset() {
  stopInterval()
  remaining.value = total
  isRunning.value = false
  isDone.value = false
}

function handleTap() {
  if (isDone.value) return reset()
  if (isRunning.value) pause()
  else start()
}

function onDragStart(event: TouchEvent | MouseEvent) {
  dragStartY = 'touches' in event ? event.touches[0].clientY : event.clientY
  dragStartRemaining = remaining.value
  if (isRunning.value) pause()

  function move(moveEvent: TouchEvent | MouseEvent) {
    const y = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY
    const delta = Math.round((dragStartY - y) / 4)
    remaining.value = Math.max(0, Math.min(total, dragStartRemaining + delta))
  }
  function end() {
    document.removeEventListener('touchmove', move as EventListener)
    document.removeEventListener('mousemove', move as EventListener)
    document.removeEventListener('touchend', end)
    document.removeEventListener('mouseup', end)
  }

  document.addEventListener('touchmove', move as EventListener, { passive: true })
  document.addEventListener('mousemove', move as EventListener)
  document.addEventListener('touchend', end)
  document.addEventListener('mouseup', end)
}

function playDing() {
  try {
    const context = new AudioContext()
    ;[880, 1108].forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      const time = context.currentTime + index * 0.18
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(0.5, time + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2)
      oscillator.start(time)
      oscillator.stop(time + 1.2)
    })
  } catch {}
}

onUnmounted(stopInterval)
</script>

<template>
  <div class="timer-screen">
    <p v-if="isAccessibilityMode" class="sr-only" aria-live="polite">{{ isDone ? "Time's up" : `${displayTime} remaining` }}</p>
    <div class="timer-topbar">
      <button class="back-btn" type="button" @click="emit('close')">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12 4 L6 10 L12 16" stroke="var(--color-cream-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
        <span>back to card</span>
      </button>
    </div>
    <div class="timer-main" @click="handleTap" @touchstart.prevent="onDragStart" @mousedown="onDragStart">
      <svg class="timer-ring" width="260" height="260" viewBox="0 0 260 260">
        <circle cx="130" cy="130" r="100" fill="none" stroke="var(--color-surface-raised)" stroke-width="6" />
        <circle cx="130" cy="130" r="100" fill="none" stroke-width="6" stroke-linecap="round" :stroke-dasharray="strokeDash" stroke-dashoffset="0" transform="rotate(-90 130 130)" :style="{ transition: isRunning ? 'stroke-dasharray 1s linear' : 'none', stroke: isDone || remaining <= 10 ? 'var(--color-accent)' : 'var(--color-gold)' }" />
      </svg>
      <div class="timer-display" :class="{ 'timer-display--pulse': isPulsing }">{{ displayTime }}</div>
      <p class="timer-state">{{ isDone ? "time's up" : isRunning ? 'tap to pause' : 'tap to start' }}</p>
    </div>
    <p class="timer-drag-hint">drag up or down to wind</p>
    <button v-if="!isRunning" class="reset-btn" type="button" @click.stop="reset">reset</button>
  </div>
</template>

<style scoped>
.timer-screen { position: absolute; inset: 0; z-index: 200; display: flex; flex-direction: column; align-items: center; background: var(--color-bg); }.timer-topbar { width: 100%; padding: 16px 12px 0; }.back-btn { display: flex; align-items: center; gap: 6px; height: 44px; padding: 8px; border: none; background: none; color: var(--color-cream-muted); font: 12px 'DM Sans', sans-serif; letter-spacing: .08em; cursor: pointer; }.timer-main { position: relative; display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; gap: 16px; width: 100%; cursor: pointer; touch-action: none; }.timer-ring { position: absolute; }.timer-display { position: relative; z-index: 1; margin-top: 40px; color: var(--color-cream); font: 300 80px/1 'Cormorant Garamond', serif; letter-spacing: -0.02em; transition: color .3s ease; }.timer-display--pulse { animation: pulse .6s ease-in-out infinite; color: var(--color-accent); }.timer-state { position: relative; z-index: 1; margin-top: 8px; color: var(--color-cream-muted); font: 11px 'DM Sans', sans-serif; letter-spacing: .14em; text-transform: uppercase; opacity: .6; }.timer-drag-hint { margin-bottom: 8px; color: var(--color-cream-muted); font: 10px 'DM Sans', sans-serif; letter-spacing: .1em; text-transform: uppercase; opacity: .35; }.reset-btn { margin-bottom: 32px; padding: 10px 28px; border: 1px solid var(--color-surface-raised); border-radius: 100px; background: none; color: var(--color-cream-muted); font: 12px 'DM Sans', sans-serif; letter-spacing: .08em; cursor: pointer; } @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
</style>