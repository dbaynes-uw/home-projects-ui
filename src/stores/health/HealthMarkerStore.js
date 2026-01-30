import { defineStore } from 'pinia';
import EventService from '@/services/EventService'; // ✅ Use EventService, not HealthMarkerService!

// ✅ HELPER FUNCTION: Normalize date format
function normalizeDate(dateString) {
  if (!dateString) return dateString;
  
  // If it's already YYYY-MM-DD format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // If it's an ISO timestamp, extract just the date part
  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }
  
  return dateString;
}

// ✅ HELPER FUNCTION: Format health marker for display
function formatHealthMarker(marker) {
  return {
    ...marker,
    marker_date: normalizeDate(marker.marker_date)
  };
}

export const useHealthMarkerStore = defineStore('healthMarker', {
  state: () => ({
    healthMarkers: [],
    healthMarker: null,
    loading: false,
    error: null
  }),

  getters: {
    // ========================================
    // BASIC GETTERS
    // ========================================
    allHealthMarkers: (state) => state.healthMarkers,
    
    healthMarkerCount: (state) => state.healthMarkers.length,
    
    isHealthMarkersEmpty: (state) => state.healthMarkers.length === 0,

    healthMarkerById: (state) => (id) => {
      return state.healthMarkers.find(marker => marker.id === id);
    },

    // ========================================
    // FILTERED GETTERS
    // ========================================
    getHealthMarkersByName: (state) => {
      return (markerName) => state.healthMarkers.filter(
        marker => marker.marker_name === markerName
      );
    },

    getHealthMarkersByLab: (state) => {
      return (lab) => state.healthMarkers.filter(
        marker => marker.marker_lab === lab
      );
    },

    getHealthMarkersByStatus: (state) => {
      return (status) => state.healthMarkers.filter(
        marker => marker.status === status
      );
    },

    // Get recent markers (last 30 days)
    recentHealthMarkers: (state) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      return state.healthMarkers.filter(marker => {
        const markerDate = new Date(marker.marker_date);
        return markerDate >= thirtyDaysAgo;
      }).sort((a, b) => new Date(b.marker_date) - new Date(a.marker_date));
    },

    // ========================================
    // STATISTICS GETTERS
    // ========================================
 
    // Get unique panel names (for markers that belong to panels)
    uniquePanelNames: (state) => {
      const panelNames = new Set(
        state.healthMarkers
          .filter(m => m.health_marker_panel_id)
          .map(m => m.panel_name)
          .filter(name => name) // Remove null/undefined
      );
      return Array.from(panelNames).sort();
    },

    // Get unique marker names
    uniqueMarkerNames: (state) => {
      const names = new Set(state.healthMarkers.map(m => m.marker_name));
      return Array.from(names).sort();
    },

    // Count by status
    statusCounts: (state) => {
      // Define allowed statuses as literals
        const STATUSES = ['Normal', 'Borderline', 'Borderline High', 'High', 'Low', 'Critical', 'Unknown'];
        const counts = Object.fromEntries(STATUSES.map(status => [status, 0]));
        state.healthMarkers.forEach(marker => {
          const markerStatus = marker && marker.status;
          if (STATUSES.includes(markerStatus)) {
            counts[markerStatus]++;
          } else {
            counts['Unknown']++;
          }
        });
        return counts;
    },

    // Get markers needing attention (High/Low/Critical)
    markersNeedingAttention: (state) => {
      return state.healthMarkers.filter(marker => 
        ['High', 'Low', 'Critical'].includes(marker.status)
      ).sort((a, b) => new Date(b.marker_date) - new Date(a.marker_date));
    },

    // Get latest marker for each type
    latestMarkersByType: (state) => {
      const latestMap = new Map();
      
      state.healthMarkers.forEach(marker => {
        const existing = latestMap.get(marker.marker_name);
        if (!existing || new Date(marker.marker_date) > new Date(existing.marker_date)) {
          latestMap.set(marker.marker_name, marker);
        }
      });

      return Array.from(latestMap.values());
    },

    // Average result for numeric markers
    averageResultByName: (state) => {
      return (markerName) => {
        const markers = state.healthMarkers.filter(m => m.marker_name === markerName);
        if (markers.length === 0) return 0;

        const numericMarkers = markers.filter(m => {
          const result = parseFloat(m.marker_result);
          return !isNaN(result);
        });

        if (numericMarkers.length === 0) return 0;

        const sum = numericMarkers.reduce((acc, m) => acc + parseFloat(m.marker_result), 0);
        return (sum / numericMarkers.length).toFixed(2);
      };
    },

    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error
  },

  actions: {
    // ========================================
    // FETCH ALL HEALTH MARKERS
    // ========================================
    async fetchHealthMarkers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await EventService.getHealthMarkers(); // ✅ Use EventService
        
        // ✅ HANDLE DIFFERENT RESPONSE FORMATS (like SleepMarkerStore)
        let healthMarkersArray = [];
        if (Array.isArray(response.data)) {
          healthMarkersArray = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          healthMarkersArray = response.data.data;
        }

        // ✅ FORMAT EACH MARKER
        this.healthMarkers = healthMarkersArray.map(marker => formatHealthMarker(marker));
        
        return this.healthMarkers;
        
      } catch (error) {
        console.error('❌ Error fetching health markers:', error);
        this.error = error.message || 'Failed to fetch health markers';
        this.healthMarkers = [];
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ========================================
    // FETCH SINGLE HEALTH MARKER
    // ========================================
    async fetchHealthMarker(id) {
      this.loading = true;
      this.error = null;

      try {
        console.log(`🔄 Fetching health marker ${id}...`);
        
        // Check if we already have it
        const existing = this.healthMarkerById(id);
        if (existing) {
          this.healthMarker = existing;
          return existing;
        }
        
        const response = await EventService.getHealthMarker(id); // ✅ Use EventService
        
        // ✅ FORMAT THE MARKER
        this.healthMarker = formatHealthMarker(response.data);
        
        console.log('✅ Health marker fetched:', this.healthMarker);
        return this.healthMarker;
        
      } catch (error) {
        console.error('❌ Error fetching health marker:', error);
        this.error = error.message || 'Failed to fetch health marker';
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ========================================
    // CREATE HEALTH MARKER
    // ========================================
    async createHealthMarker(markerData) {
      this.loading = true;
      this.error = null;

      try {
        console.log('🔄 Creating health marker...', markerData);
        const response = await EventService.postHealthMarker(markerData); // ✅ Use EventService
        
        // Refresh list to get updated data
        await this.fetchHealthMarkers();
        
        console.log('✅ Health marker created:', response.data);
        return response.data;
        
      } catch (error) {
        console.error('❌ Error creating health marker:', error);
        alert('Failed to create health marker. Please try again.');
        this.error = error.message || 'Failed to create health marker';
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ========================================
    // UPDATE HEALTH MARKER
    // ========================================
// ========================================
// UPDATE HEALTH MARKER
// ========================================
async updateHealthMarker(id, healthMarkerData) {
  this.loading = true;  // ✅ CHANGED: loading instead of isLoading
  this.error = null;

  try {
    // ✅ CREATE FULL OBJECT WITH ID AND DATA
    const updatedHealthMarker = {
      id: id,
      ...healthMarkerData
    };
    
    // ✅ PASS FULL OBJECT TO SERVICE
    const response = await EventService.putHealthMarker(updatedHealthMarker);
  
    // ✅ FORMAT THE RESPONSE DATA
    const formattedMarker = formatHealthMarker(response.data);
    
    // Update in store
    const index = this.healthMarkers.findIndex(m => m.id === id);
    if (index !== -1) {
      this.healthMarkers[index] = formattedMarker;
    }
  
    return formattedMarker;
  } catch (error) {
    console.error('❌ Update error:', error);
    this.error = error.message || 'Failed to update health marker';
    throw error;
  } finally {
    this.loading = false;  // ✅ CHANGED: loading instead of isLoading
  }
},
    // ========================================
    // DELETE HEALTH MARKER
    // ========================================
    async deleteHealthMarker(id) {
      console.log('🗑️ Deleting health marker with ID:', id);
      this.loading = true;
      this.error = null;

      try {
        await EventService.deleteHealthMarker(id); // ✅ Use EventService
        
        // Refresh list to get updated data
        await this.fetchHealthMarkers();
        
        console.log('✅ Health marker deleted');
        return true;
        
      } catch (error) {
        console.error('❌ Error deleting health marker:', error);
        alert('Failed to delete health marker. Please try again.');
        this.error = error.message || 'Failed to delete health marker';
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ========================================
    // UTILITY ACTIONS
    // ========================================
    clearError() {
      this.error = null;
    },

    cleanup() {
      this.$reset();
      console.log('🧹 HealthMarkerStore cleaned up');
    },

    $reset() {
      this.healthMarkers = [];
      this.healthMarker = null;
      this.loading = false;
      this.error = null;
    }
  }
});