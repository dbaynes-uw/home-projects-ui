import { defineStore } from 'pinia'

const STORAGE_KEY = 'shared_view_note'
const MAX_BYTES = 80

function byteLength(text) {
  return encodeURIComponent(text).replace(/%[A-F\d]{2}/g, 'x').length
}

function trimToMaxBytes(text, maxBytes) {
  let output = text
  while (byteLength(output) > maxBytes) {
    output = output.slice(0, -1)
  }
  return output
}

function loadNote() {
  try {
    const savedNote = localStorage.getItem(STORAGE_KEY)
    if (!savedNote) return ''
    return trimToMaxBytes(savedNote, MAX_BYTES)
  } catch {
    return ''
  }
}

function saveNote(note) {
  try {
    localStorage.setItem(STORAGE_KEY, note)
  } catch {
    // Ignore storage failures; the UI can still continue with in-memory state.
  }
}

export const useViewNoteStore = defineStore('viewNote', {
  state: () => ({
    note: loadNote(),
    maxBytes: MAX_BYTES,
  }),

  getters: {
    noteBytes: (state) => byteLength(state.note || ''),
  },

  actions: {
    setNote(value) {
      const nextNote = trimToMaxBytes(String(value || ''), MAX_BYTES)
      this.note = nextNote
      saveNote(nextNote)
    },
    clearNote() {
      this.setNote('')
    },
    byteLength,
    trimToMaxBytes,
  },
})
