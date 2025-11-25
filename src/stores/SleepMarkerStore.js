import { defineStore } from 'pinia';
import EventService from '@/services/EventService';

// ✅ HELPER FUNCTION OUTSIDE STORE (NO 'this' needed)
function extractTime(isoString) {
  if (!isoString) return '';
  
  try {
    // Check if it's already HH:MM format
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(isoString)) {
      return isoString.substring(0, 5); // Return just HH:MM
    }
    
    // Extract from ISO format: "2000-01-01T17:50:00.000-08:00" → "17:50"
    if (isoString.includes('T')) {
      const date = new Date(isoString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    return isoString;
    
  } catch (error) {
    console.error('❌ Error extracting time from:', isoString, error);
    return '';
  }
}

// ✅ HELPER FUNCTION OUTSIDE STORE
function formatSleepMarker(marker) {
  return {
    ...marker,
    bed_time: extractTime(marker.bed_time),
    wake_time: extractTime(marker.wake_time)
  };
}

export const useSleepMarkerStore = defineStore('sleepMarker', {
  state: () => ({
    sleepMarkers: [],
    sleepMarker: null,
    loading: false,
    error: null
  }),

  getters: {
    allSleepMarkers: (state) => state.sleepMarkers,
    
    sleepMarkerById: (state) => (id) => {
      return state.sleepMarkers.find(marker => marker.id === id);
    },

    averageSleepHours: (state) => {
      if (!state.sleepMarkers.length) return '0.0';
      const total = state.sleepMarkers.reduce((sum, m) => 
        sum + (parseFloat(m.total_sleep_hours) || 0), 0
      );
      return (total / state.sleepMarkers.length).toFixed(1);
    },

    averageSleepQuality: (state) => {
      if (!state.sleepMarkers.length) return '0.0';
      const total = state.sleepMarkers.reduce((sum, m) => 
        sum + (parseFloat(m.sleep_quality) || 0), 0
      );
      return (total / state.sleepMarkers.length).toFixed(1);
    },

    averageDeepSleep: (state) => {
      if (!state.sleepMarkers.length) return '0.0';
      const total = state.sleepMarkers.reduce((sum, m) => 
        sum + (parseFloat(m.deep_sleep) || 0), 0
      );
      return (total / state.sleepMarkers.length).toFixed(1);
    },

    averageAwakenings: (state) => {
      if (!state.sleepMarkers.length) return '0';
      const total = state.sleepMarkers.reduce((sum, m) => 
        sum + (parseInt(m.awakenings) || 0), 0
      );
      return Math.round(total / state.sleepMarkers.length);
    },

    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error
  },

  actions: {
    // ✅ FETCH ALL SLEEP MARKERS
    async fetchSleepMarkers() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔍 SleepMarkerStore: Fetching sleep markers...');
        
        const response = await EventService.getSleepMarkers();
        
        console.log('📦 Raw API Response:', response.data);
        
        let sleepMarkersArray = [];
        if (Array.isArray(response.data)) {
          sleepMarkersArray = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          sleepMarkersArray = response.data.data;
        }
        
        // ✅ FORMAT EACH MARKER (USE EXTERNAL FUNCTION)
        this.sleepMarkers = sleepMarkersArray.map(marker => formatSleepMarker(marker));
        
        console.log('✅ SleepMarkerStore: Fetched', this.sleepMarkers.length, 'markers');
        console.log('📊 SleepMarkerStore: First marker AFTER formatting:', this.sleepMarkers[0]);
        console.log('🕐 SleepMarkerStore: bed_time AFTER formatting:', this.sleepMarkers[0]?.bed_time);
        console.log('🕐 SleepMarkerStore: wake_time AFTER formatting:', this.sleepMarkers[0]?.wake_time);
        
        return this.sleepMarkers;
        
      } catch (error) {
        console.error('❌ SleepMarkerStore: Fetch error:', error);
        this.error = error.message;
        this.sleepMarkers = [];
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ✅ FETCH SINGLE SLEEP MARKER
    async fetchSleepMarker(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const existing = this.sleepMarkerById(id);
        if (existing) {
          this.sleepMarker = existing;
          return existing;
        }
        
        const response = await EventService.getSleepMarker(id);
        
        // ✅ FORMAT THE MARKER (USE EXTERNAL FUNCTION)
        this.sleepMarker = formatSleepMarker(response.data);
        
        return this.sleepMarker;
        
      } catch (error) {
        console.error('❌ SleepMarkerStore: Fetch single error:', error);
        this.error = error.message;
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ✅ CREATE SLEEP MARKER
    async createSleepMarker(sleepMarkerData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔍 SleepMarkerStore: Creating sleep marker:', sleepMarkerData);
        
        const response = await EventService.postSleepMarker(sleepMarkerData);
        
        // Refresh list to get updated data
        await this.fetchSleepMarkers();
        
        console.log('✅ SleepMarkerStore: Created successfully');
        
        return response.data;
        
      } catch (error) {
        console.error('❌ SleepMarkerStore: Create error:', error);
        this.error = error.message;
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ✅ UPDATE SLEEP MARKER
    async updateSleepMarker(sleepMarkerData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔍 SleepMarkerStore: Updating sleep marker:', sleepMarkerData.id);
        
        const response = await EventService.putSleepMarker(sleepMarkerData);
        
        // Refresh list to get updated data
        await this.fetchSleepMarkers();
        
        console.log('✅ SleepMarkerStore: Updated successfully');
        
        return response.data;
        
      } catch (error) {
        console.error('❌ SleepMarkerStore: Update error:', error);
        this.error = error.message;
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ✅ DELETE SLEEP MARKER
    async deleteSleepMarker(id) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔍 SleepMarkerStore: Deleting sleep marker:', id);
        
        await EventService.deleteSleepMarker(id);
        
        // Refresh list to get updated data
        await this.fetchSleepMarkers();
        
        console.log('✅ SleepMarkerStore: Deleted successfully');
        
        return true;
        
      } catch (error) {
        console.error('❌ SleepMarkerStore: Delete error:', error);
        this.error = error.message;
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ✅ CLEANUP METHOD
    cleanup() {
      this.$reset();
      console.log('🧹 SleepMarkerStore cleaned up');
    },

    clearError() {
      this.error = null;
    },

    $reset() {
      this.sleepMarkers = [];
      this.sleepMarker = null;
      this.loading = false;
      this.error = null;
    }
  }
});