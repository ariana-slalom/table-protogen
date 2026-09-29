import { ref, watch } from 'vue'

const STORAGE_KEY = 'table-accessibility-mode'
const isAccessibilityMode = ref(localStorage.getItem(STORAGE_KEY) === 'true')

watch(isAccessibilityMode, enabled => {
  localStorage.setItem(STORAGE_KEY, String(enabled))
  document.documentElement.classList.toggle('accessibility-mode', enabled)
  document.documentElement.classList.toggle(
    'reduced-motion',
    enabled && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}, { immediate: true })

function toggleAccessibilityMode() {
  isAccessibilityMode.value = !isAccessibilityMode.value
}

export function useAccessibility() {
  return { isAccessibilityMode, toggleAccessibilityMode }
}