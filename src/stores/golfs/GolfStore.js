import { defineStore } from 'pinia'
import EventService from '@/services/EventService.js'

export const useGolfStore = defineStore('golfs', {
  state: () => ({
    golfs: [],
    golf: null,
    loading: false,
    error: null,
  }),

  getters: {
    allGolfs: (state) => state.golfs,
    currentGolf: (state) => state.golf,
    isLoading: (state) => state.loading,
  },

  actions: {
    async fetchGolfs() {
      this.loading = true
      try {
        const response = await EventService.getGolfs()
        this.golfs = response.data
      } catch (error) {
        this.error = error
        console.error('Golf Fetch Error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchGolf(id) {
      // Cache-first: check the list before hitting the API
      const existing = this.golfs.find(
        (g) => g.id === parseInt(id) || g.id === id
      )
      if (existing) {
        this.golf = existing
        return
      }
      this.loading = true
      try {
        const response = await EventService.getGolf(id)
        this.golf = response.data
      } catch (error) {
        this.error = error
        console.error('Golf Get Error:', error)
      } finally {
        this.loading = false
      }
    },

    async createGolf(golf) {
      try {
        const response = await EventService.postGolf(golf)
        const created = response.data || golf
        this.golfs.push(created)
        return { success: true, data: created }
      } catch (error) {
        this.error = error
        console.error('Golf Create Error:', error)
        return { success: false, error }
      }
    },

    async updateGolf(golf) {
      try {
        const response = await EventService.putGolf(golf)
        const updated = response.data || golf
        const idx = this.golfs.findIndex((g) => g.id === golf.id)
        if (idx !== -1) this.golfs[idx] = updated
        this.golf = updated
        return { success: true, data: updated }
      } catch (error) {
        this.error = error
        console.error('Golf Update Error:', error)
        return { success: false, error }
      }
    },

    async deleteGolf(golf) {
      try {
        await EventService.deleteGolf(golf)
        this.golfs = this.golfs.filter((g) => g.id !== golf.id)
        return { success: true }
      } catch (error) {
        this.error = error
        console.error('Golf Delete Error:', error)
        return { success: false, error }
      }
    },

    clearGolf() {
      this.golf = null
    },
  },
})
