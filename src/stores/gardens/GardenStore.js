import { defineStore } from 'pinia'
import EventService from '@/services/EventService'

export const useGardenStore = defineStore('gardens', {
  state: () => ({
    gardens: [],
    garden: null,
    loading: false,
    error: null,
  }),

  getters: {
    allGardens: (state) => state.gardens,
    currentGarden: (state) => state.garden,
    isLoading: (state) => state.loading,
    errorMessage: (state) => state.error,
    numberOfGardens: (state) => state.gardens.length,

    activeGardens: (state) =>
      state.gardens.filter(g => g.status === 'Active'),

    sortedByName: (state) =>
      [...state.gardens].sort((a, b) => (a.name || '').localeCompare(b.name || '')),
  },

  actions: {
    // ========================================
    // FETCH ALL GARDENS
    // ========================================
    async fetchGardens() {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.getGardens()
        const seen = new Set()
        this.gardens = response.data.filter(g => {
          if (seen.has(g.id)) return false
          seen.add(g.id)
          return true
        })
        return this.gardens
      } catch (error) {
        this.error = error.response?.data || 'Failed to fetch gardens'
        console.error('GardenStore fetchGardens error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // FETCH SINGLE GARDEN
    // ========================================
    async fetchGarden(id) {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.getGarden(id)
        this.garden = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to fetch garden'
        console.error('GardenStore fetchGarden error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // CREATE GARDEN
    // ========================================
    async createGarden(garden) {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.postGarden(garden)
        this.gardens.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to create garden'
        console.error('GardenStore createGarden error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // UPDATE GARDEN
    // ========================================
    async updateGarden(garden) {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.putGarden(garden)
        const idx = this.gardens.findIndex(g => g.id === garden.id)
        if (idx !== -1) this.gardens[idx] = response.data
        this.garden = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to update garden'
        console.error('GardenStore updateGarden error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // DELETE GARDEN
    // ========================================
    async deleteGarden(garden) {
      this.loading = true
      this.error = null
      try {
        await EventService.deleteGarden(garden)
        this.gardens = this.gardens.filter(g => g.id !== garden.id)
        if (this.garden?.id === garden.id) this.garden = null
      } catch (error) {
        this.error = error.response?.data || 'Failed to delete garden'
        console.error('GardenStore deleteGarden error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // CLEAR
    // ========================================
    clearGarden() {
      this.garden = null
    },
    clearGardens() {
      this.gardens = []
    },
  },
})
