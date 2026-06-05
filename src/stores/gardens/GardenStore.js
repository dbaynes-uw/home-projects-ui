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

function normalizeWateringSummary(watering) {
  if (!watering) return null
  const gardenIdsFromArray = Array.isArray(watering.gardens)
    ? watering.gardens.map(g => Number(g?.id)).filter(Boolean)
    : []
  const gardenIds = dedupeById((watering.garden_ids || []).map(id => ({ id }))).map(g => g.id)

  return {
    ...watering,
    id: Number(watering.id),
    garden_ids: [...new Set([...gardenIds, ...gardenIdsFromArray])],
    gardens: Array.isArray(watering.gardens) ? watering.gardens : []
  }
}

function normalizePlantSummary(plant) {
  if (!plant) return null
  return {
    ...plant,
    id: Number(plant.id),
    garden_id: plant.garden_id != null ? Number(plant.garden_id) : null,
    watering_id: plant.watering_id != null ? Number(plant.watering_id) : null
  }
}

function normalizeGarden(garden) {
  if (!garden) return null

  const waterings = dedupeById((garden.waterings || [])
    .map(normalizeWateringSummary)
    .filter(Boolean))

  const plants = dedupeById((garden.plants || [])
    .map(normalizePlantSummary)
    .filter(Boolean))

  const wateringIds = dedupeById((garden.watering_ids || []).map(id => ({ id }))).map(w => w.id)
  const wateringIdsFromObjects = waterings.map(w => w.id)

  return {
    ...garden,
    id: Number(garden.id),
    waterings,
    plants,
    watering_ids: [...new Set([...wateringIds, ...wateringIdsFromObjects])]
  }
}

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
        this.gardens = dedupeById((response.data || [])
          .map(normalizeGarden)
          .filter(Boolean))
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
        this.garden = normalizeGarden(response.data)

        const idx = this.gardens.findIndex(g => Number(g.id) === Number(this.garden?.id))
        if (idx !== -1) this.gardens.splice(idx, 1, this.garden)

        return this.garden
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
        const created = normalizeGarden(response.data)
        this.gardens.push(created)
        this.garden = created
        return created
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
        const updated = normalizeGarden(response.data)
        const idx = this.gardens.findIndex(g => g.id === garden.id)
        if (idx !== -1) this.gardens[idx] = updated
        this.garden = updated
        return updated
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
