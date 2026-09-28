import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export interface GuestBookEntry {
  id: string
  name: string
  message: string
  prompt: string | null
  created_at: string
}

const entries = ref<GuestBookEntry[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchEntries() {
  loading.value = true
  error.value = null

  try {
    const { data, error: err } = await supabase
      .from('guest_book')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (err) throw err
    entries.value = data || []
  } catch (caughtError) {
    error.value = 'Could not load the guest book.'
    console.error(caughtError)
  } finally {
    loading.value = false
  }
}

async function addEntry(name: string, message: string, prompt?: string) {
  error.value = null

  try {
    const { error: err } = await supabase
      .from('guest_book')
      .insert({ name, message, prompt: prompt || null })

    if (err) throw err
    await fetchEntries()
    return true
  } catch (caughtError) {
    error.value = 'Could not save your entry.'
    console.error(caughtError)
    return false
  }
}

export function useGuestBook() {
  return { entries, loading, error, fetchEntries, addEntry }
}