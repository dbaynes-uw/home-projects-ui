import { defineStore } from 'pinia'
import EventService from '@/services/EventService.js'

export const useGolfStore = defineStore('golf', {
  state: () => ({
    golfRounds: [],       // list from index
    currentRound: null,   // single round with nested player_scores
    loading: false,
    error: null,
  }),

  getters: {
    allGolfRounds: (state) => state.golfRounds,
  },

  actions: {
    // ── Fetch all rounds ────────────────────────────────────────────────────
    async fetchGolfRounds() {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.getGolfRounds()
        this.golfRounds = response.data
      } catch (err) {
        this.error = err
        console.error('fetchGolfRounds error', err)
      } finally {
        this.loading = false
      }
    },

    // ── Fetch single round (cache-first) ────────────────────────────────────
    async fetchGolfRound(id) {
      if (this.currentRound && String(this.currentRound.id) === String(id)) {
        return
      }
      this.loading = true
      this.error = null
      try {
        const response = await EventService.getGolfRound(id)
        this.currentRound = response.data
      } catch (err) {
        this.error = err
        console.error('fetchGolfRound error', err)
      } finally {
        this.loading = false
      }
    },

    // Force reload of a single round (bypasses cache)
    async reloadGolfRound(id) {
      this.loading = true
      try {
        const response = await EventService.getGolfRound(id)
        this.currentRound = response.data
        const idx = this.golfRounds.findIndex(r => r.id === response.data.id)
        if (idx !== -1) this.golfRounds.splice(idx, 1, response.data)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // ── Create round with nested player_scores ──────────────────────────────
    async createGolfRound(roundData) {
      try {
        const response = await EventService.postGolfRound(roundData)
        const created = response.data
        this.golfRounds.unshift(created)
        this.currentRound = created
        return { success: true, data: created }
      } catch (err) {
        console.error('createGolfRound error', err)
        return { success: false, error: err }
      }
    },

    // ── Update round with nested player_scores ──────────────────────────────
    async updateGolfRound(roundData) {
      try {
        const response = await EventService.putGolfRound(roundData)
        const updated = response.data
        this.currentRound = updated
        const idx = this.golfRounds.findIndex(r => r.id === updated.id)
        if (idx !== -1) this.golfRounds.splice(idx, 1, updated)
        return { success: true, data: updated }
      } catch (err) {
        console.error('updateGolfRound error', err)
        return { success: false, error: err }
      }
    },

    // ── Delete round ────────────────────────────────────────────────────────
    async deleteGolfRound(id) {
      try {
        await EventService.deleteGolfRound(id)
        this.golfRounds = this.golfRounds.filter(r => r.id !== id)
        if (this.currentRound?.id === id) this.currentRound = null
        return { success: true }
      } catch (err) {
        console.error('deleteGolfRound error', err)
        return { success: false, error: err }
      }
    },

    clearCurrentRound() {
      this.currentRound = null
    },
  },
})

