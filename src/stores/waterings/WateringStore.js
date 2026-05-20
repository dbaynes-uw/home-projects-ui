import { defineStore } from 'pinia'
import EventService from '@/services/EventService'

export const useWateringStore = defineStore('waterings', {
  state: () => ({
    waterings: [],
    watering: null,
    loading: false,
    error: null,
  }),

  getters: {
    allWaterings: (state) => state.waterings,
    currentWatering: (state) => state.watering,
    isLoading: (state) => state.loading,
    errorMessage: (state) => state.error,
    numberOfWaterings: (state) => state.waterings.length,

    wateringsForGarden: (state) => (gardenId) =>
      state.waterings.filter(w => w.garden_id == gardenId),

    sortedByName: (state) =>
      [...state.waterings].sort((a, b) => (a.name || '').localeCompare(b.name || '')),
  },

  actions: {
    // ========================================
    // FETCH ALL WATERINGS
    // ========================================
    async fetchWaterings() {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.getWaterings()
        this.waterings = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to fetch waterings'
        console.error('WateringStore fetchWaterings error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // FETCH SINGLE WATERING
    // ========================================
    async fetchWatering(id) {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.getWatering(id)
        this.watering = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to fetch watering'
        console.error('WateringStore fetchWatering error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // CREATE WATERING
    // ========================================
    async createWatering(watering) {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.postWatering(watering)
        this.waterings.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to create watering'
        console.error('WateringStore createWatering error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // UPDATE WATERING
    // ========================================
    async updateWatering(watering) {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.putWatering(watering)
        const idx = this.waterings.findIndex(w => w.id === watering.id)
        if (idx !== -1) this.waterings[idx] = response.data
        this.watering = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to update watering'
        console.error('WateringStore updateWatering error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // DELETE WATERING
    // ========================================
    async deleteWatering(watering) {
      this.loading = true
      this.error = null
      try {
        await EventService.deleteWatering(watering)
        this.waterings = this.waterings.filter(w => w.id !== watering.id)
        if (this.watering?.id === watering.id) this.watering = null
      } catch (error) {
        this.error = error.response?.data || 'Failed to delete watering'
        console.error('WateringStore deleteWatering error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // CLEAR
    // ========================================
    clearWatering() {
      this.watering = null
    },
    clearWaterings() {
      this.waterings = []
    },
  },
})
