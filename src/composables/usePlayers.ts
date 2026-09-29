import { computed, ref } from 'vue'
import type { Player } from '@/types'

const ROSTER_KEY = 'table-player-roster'
const SESSION_KEY = 'table-session-players'

function loadRoster(): Player[] {
  try {
    const raw = localStorage.getItem(ROSTER_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function loadSessionPlayers(): Player[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

const roster = ref<Player[]>(loadRoster())
const sessionPlayers = ref<Player[]>(loadSessionPlayers())

function saveRoster() {
  localStorage.setItem(ROSTER_KEY, JSON.stringify(roster.value))
}

function saveSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionPlayers.value))
}

function addToRoster(name: string): Player {
  const trimmed = name.trim()
  const existing = roster.value.find(
    player => player.name.toLowerCase() === trimmed.toLowerCase()
  )

  if (existing) return existing

  const player: Player = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: trimmed,
    score: 0
  }

  roster.value.push(player)
  saveRoster()
  return player
}

function addToSession(name: string) {
  if (sessionPlayers.value.length >= 8) return

  const player = addToRoster(name)
  const alreadyIn = sessionPlayers.value.find(sessionPlayer => sessionPlayer.id === player.id)
  if (alreadyIn) return

  sessionPlayers.value.push({ ...player, score: 0 })
  saveSession()
}

function removeFromSession(id: string) {
  sessionPlayers.value = sessionPlayers.value.filter(player => player.id !== id)
  saveSession()
}

function awardPoint(id: string) {
  const player = sessionPlayers.value.find(sessionPlayer => sessionPlayer.id === id)
  if (player) {
    player.score++
    saveSession()
  }
}

function clearSession() {
  sessionPlayers.value = []
  sessionStorage.removeItem(SESSION_KEY)
}

const searchRoster = computed(() => (query: string) => {
  if (!query.trim()) return roster.value.slice(0, 6)

  return roster.value.filter(player =>
    player.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6)
})

export function usePlayers() {
  return {
    roster,
    sessionPlayers,
    searchRoster,
    addToSession,
    removeFromSession,
    awardPoint,
    clearSession
  }
}