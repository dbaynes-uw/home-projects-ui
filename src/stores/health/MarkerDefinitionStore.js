import { defineStore } from 'pinia';
import EventService from '@/services/EventService';
import { HEALTH_MARKERS } from '@/services/health-marker-constants';

const MARKER_NAME_ALIASES = {
  'Total Cholesterol': 'Cholesterol',
  Cholesterol: 'Cholesterol'
};

function canonicalMarkerName(name) {
  const trimmed = String(name || '').trim();
  return MARKER_NAME_ALIASES[trimmed] || trimmed;
}

function withCanonicalCholesterol(definition) {
  if (!definition) return definition;

  const canonicalName = canonicalMarkerName(definition.name);
  const canonicalLabel = canonicalMarkerName(definition.label);
  if (canonicalName === definition.name && canonicalLabel === definition.label) {
    return definition;
  }

  return {
    ...definition,
    name: canonicalName || definition.name,
    label: canonicalLabel || definition.label
  };
}

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
        return state.definitions.map(withCanonicalCholesterol);
      }
      // Otherwise fallback to constants
      return HEALTH_MARKERS.map(withCanonicalCholesterol);
    },

    // Get definition by name
    getDefinitionByName: (state) => {
      return (name) => {
        const canonical = canonicalMarkerName(name);

        // Try database first
        const dbDef = state.definitions.find((d) => {
          const defName = canonicalMarkerName(d.name);
          const defLabel = canonicalMarkerName(d.label);
          return defName === canonical || defLabel === canonical;
        });
        if (dbDef) return dbDef;
        
        // Fallback to constants
        return HEALTH_MARKERS.find((m) => {
          const markerName = canonicalMarkerName(m.name);
          const markerLabel = canonicalMarkerName(m.label);
          return markerName === canonical || markerLabel === canonical;
        });
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
      const defs = (state.definitions.length > 0 ? state.definitions : HEALTH_MARKERS).map(withCanonicalCholesterol);
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
