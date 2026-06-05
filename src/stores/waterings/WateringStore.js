import { defineStore } from 'pinia'
import EventService from '@/services/EventService'

function dedupeById(items) {
  const seen = new Set()
  return (items || []).filter(item => {
    const id = Number(item?.id)
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

function normalizeWatering(watering) {
  if (!watering) return null

  const gardenIdsFromArray = Array.isArray(watering.gardens)
    ? watering.gardens.map(g => Number(g?.id)).filter(Boolean)
    : []

  const gardenIdsFromField = dedupeById((watering.garden_ids || []).map(id => ({ id }))).map(g => g.id)

  return {
    ...watering,
    id: Number(watering.id),
    gardens: Array.isArray(watering.gardens) ? watering.gardens : [],
    plants: Array.isArray(watering.plants) ? watering.plants : [],
    garden_ids: [...new Set([...gardenIdsFromField, ...gardenIdsFromArray])]
  }
}

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

    wateringsForGarden: (state) => (gardenId) => {
      const targetGardenId = Number(gardenId)
      return state.waterings.filter(w => {
        const byIds = Array.isArray(w.garden_ids) && w.garden_ids.some(id => Number(id) === targetGardenId)
        const byGardens = Array.isArray(w.gardens) && w.gardens.some(g => Number(g.id) === targetGardenId)
        return byIds || byGardens
      })
    },

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
        this.waterings = dedupeById((response.data || [])
          .map(normalizeWatering)
          .filter(Boolean))
        return this.waterings
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
        this.watering = normalizeWatering(response.data)

        const idx = this.waterings.findIndex(w => Number(w.id) === Number(this.watering?.id))
        if (idx !== -1) this.waterings.splice(idx, 1, this.watering)

        return this.watering
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
        const created = normalizeWatering(response.data)
        this.waterings.push(created)
        this.watering = created
        return created
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
        const updated = normalizeWatering(response.data)
        const idx = this.waterings.findIndex(w => w.id === watering.id)
        if (idx !== -1) this.waterings[idx] = updated
        this.watering = updated
        return updated
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
