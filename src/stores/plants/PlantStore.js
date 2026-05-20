import { defineStore } from 'pinia'
import EventService from '@/services/EventService'

export const usePlantStore = defineStore('plants', {
  state: () => ({
    plants: [],
    plant: null,
    loading: false,
    error: null,
  }),

  getters: {
    allPlants: (state) => state.plants,
    currentPlant: (state) => state.plant,
    isLoading: (state) => state.loading,
    errorMessage: (state) => state.error,
    numberOfPlants: (state) => state.plants.length,

    plantsForGarden: (state) => (gardenId) =>
      state.plants.filter(p => p.garden_id == gardenId),

    plantsForWatering: (state) => (wateringId) =>
      state.plants.filter(p => p.watering_id == wateringId),

    activePlants: (state) =>
      state.plants.filter(p => p.active),

    sortedByName: (state) =>
      [...state.plants].sort((a, b) => (a.plant_name || '').localeCompare(b.plant_name || '')),
  },

  actions: {
    // ========================================
    // FETCH ALL PLANTS
    // ========================================
    async fetchPlants(garden = null) {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.getPlants(garden)
        this.plants = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to fetch plants'
        console.error('PlantStore fetchPlants error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // FETCH SINGLE PLANT
    // ========================================
    async fetchPlant(id) {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.getPlant(id)
        this.plant = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to fetch plant'
        console.error('PlantStore fetchPlant error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // CREATE PLANT
    // ========================================
    async createPlant(plant) {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.postPlant(plant)
        this.plants.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to create plant'
        console.error('PlantStore createPlant error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // UPDATE PLANT
    // ========================================
    async updatePlant(plant) {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.putPlant(plant)
        const idx = this.plants.findIndex(p => p.id === plant.id)
        if (idx !== -1) this.plants[idx] = response.data
        this.plant = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to update plant'
        console.error('PlantStore updatePlant error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // DELETE PLANT
    // ========================================
    async deletePlant(plant) {
      this.loading = true
      this.error = null
      try {
        await EventService.deletePlant(plant)
        this.plants = this.plants.filter(p => p.id !== plant.id)
        if (this.plant?.id === plant.id) this.plant = null
      } catch (error) {
        this.error = error.response?.data || 'Failed to delete plant'
        console.error('PlantStore deletePlant error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // CLEAR
    // ========================================
    clearPlant() {
      this.plant = null
    },
    clearPlants() {
      this.plants = []
    },
  },
})
