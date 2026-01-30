import { defineStore } from 'pinia';
import EventService from '@/services/EventService';
import { HEALTH_MARKERS } from '@/services/health-marker-constants';

export const useMarkerDefinitionStore = defineStore('markerDefinition', {
  state: () => ({
    definitions: [],
    loading: false,
    error: null
  }),

  getters: {
    // Get all available definitions (database + constants fallback)
    allDefinitions: (state) => {
      // If we have database definitions, use those
      if (state.definitions.length > 0) {
        return state.definitions;
      }
      // Otherwise fallback to constants
      return HEALTH_MARKERS;
    },

    // Get definition by name
    getDefinitionByName: (state) => {
      return (name) => {
        // Try database first
        const dbDef = state.definitions.find(d => d.name === name);
        if (dbDef) return dbDef;
        
        // Fallback to constants
        return HEALTH_MARKERS.find(m => m.name === name);
      };
    },

    // Get definitions by category
    getDefinitionsByCategory: (state) => {
      return (category) => {
        const defs = state.definitions.length > 0 ? state.definitions : HEALTH_MARKERS;
        return defs.filter(d => d.category === category);
      };
    },

    // Get dropdown options
    definitionOptions: (state) => {
      const defs = state.definitions.length > 0 ? state.definitions : HEALTH_MARKERS;
      return defs.map(d => ({
        name: d.name,
        label: d.label,
        subtitle: `${d.category || 'Other'} • ${d.unit || ''}`,
        icon: d.icon
      })).sort((a, b) => a.label.localeCompare(b.label));
    },

    // Get unique categories
    categories: (state) => {
      const defs = state.definitions.length > 0 ? state.definitions : HEALTH_MARKERS;
      const cats = new Set(defs.map(d => d.category).filter(c => c));
      return Array.from(cats).sort();
    }
  },

  actions: {
    async fetchDefinitions() {
      this.loading = true;
      this.error = null;

      try {
        const response = await EventService.getMarkerDefinitions();
        this.definitions = response.data || [];
        return this.definitions;
      } catch (error) {
        console.error('❌ Error fetching marker definitions:', error);
        this.error = error.message || 'Failed to fetch marker definitions';
        // Don't throw - fallback to constants
        this.definitions = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    async createDefinition(definition) {
      try {
        const response = await EventService.postMarkerDefinition(definition);
        this.definitions.push(response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error creating marker definition:', error);
        throw error;
      }
    },

    async updateDefinition(definition) {
      try {
        const response = await EventService.putMarkerDefinition(definition);
        const index = this.definitions.findIndex(d => d.id === definition.id);
        if (index !== -1) {
          this.definitions[index] = response.data;
        }
        return response.data;
      } catch (error) {
        console.error('❌ Error updating marker definition:', error);
        throw error;
      }
    },

    async deleteDefinition(id) {
      try {
        await EventService.deleteMarkerDefinition({ id });
        this.definitions = this.definitions.filter(d => d.id !== id);
      } catch (error) {
        console.error('❌ Error deleting marker definition:', error);
        throw error;
      }
    }
  }
});
