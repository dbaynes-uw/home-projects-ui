import { defineStore } from 'pinia';
import EventService from '@/services/EventService';

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
    // ✅ FETCH ALL SLEEP MARKERS - NO FORMATTING NEEDED!
    async fetchSleepMarkers() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔍 SleepMarkerStore: Fetching sleep markers...');
        
        const response = await EventService.getSleepMarkers();
        
        let sleepMarkersArray = [];
        if (Array.isArray(response.data)) {
          sleepMarkersArray = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          sleepMarkersArray = response.data.data;
        }
        
        // ✅ NO FORMATTING - API ALREADY RETURNS HH:MM
        this.sleepMarkers = sleepMarkersArray;
        
        console.log('✅ SleepMarkerStore: Fetched', this.sleepMarkers.length, 'markers');
        console.log('📊 SleepMarkerStore: Sample marker:', this.sleepMarkers[0]);
        
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

    // ✅ FETCH SINGLE SLEEP MARKER - NO FORMATTING NEEDED!
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
        
        // ✅ NO FORMATTING - API ALREADY RETURNS HH:MM
        this.sleepMarker = response.data;
        
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