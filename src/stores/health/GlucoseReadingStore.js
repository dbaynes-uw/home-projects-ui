import { defineStore } from 'pinia';
import EventService from '@/services/EventService';
import { notify } from '@/composables/useNotify';

export const useGlucoseReadingStore = defineStore('glucoseReadings', {
  state: () => ({
    glucoseReadings: [],
    glucoseReading: null,
    loading: false,
    error: null,
  }),

  getters: {
    allGlucoseReadings: (state) => state.glucoseReadings,
    currentGlucoseReading: (state) => state.glucoseReading,
    isLoading: (state) => state.loading,

    averageGlucose: (state) => {
      const valid = state.glucoseReadings.filter(r => r.reading || r.glucose_value);
      if (!valid.length) return '-';
      const total = valid.reduce((sum, r) => sum + parseFloat(r.reading || r.glucose_value || 0), 0);
      return Math.round(total / valid.length);
    },

    inRangePercentage: (state) => {
      if (!state.glucoseReadings.length) return '-';
      const inRange = state.glucoseReadings.filter(r => {
        const v = parseFloat(r.reading || r.glucose_value);
        return v >= 70 && v < 140;
      }).length;
      return Math.round((inRange / state.glucoseReadings.length) * 100);
    },

    lastReadingValue: (state) => {
      if (!state.glucoseReadings.length) return '-';
      const sorted = [...state.glucoseReadings].sort(
        (a, b) => new Date(b.reading_date) - new Date(a.reading_date)
      );
      return sorted[0]?.reading || sorted[0]?.glucose_value || '-';
    },
  },

  actions: {
    async fetchGlucoseReadings() {
      this.loading = true;
      this.error = null;
      try {
        const response = await EventService.getGlucoseReadings();
        this.glucoseReadings = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('❌ GlucoseReadingStore: fetchGlucoseReadings error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchGlucoseReading(id) {
      this.loading = true;
      this.error = null;
      try {
        // Cache-first: return existing if already loaded
        const cached = this.glucoseReadings.find(r => r.id === id || r.id === parseInt(id));
        if (cached) {
          this.glucoseReading = cached;
          return cached;
        }
        const response = await EventService.getGlucoseReading(id);
        this.glucoseReading = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('❌ GlucoseReadingStore: fetchGlucoseReading error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createGlucoseReading(readingData) {
      this.loading = true;
      try {
        const response = await EventService.postGlucoseReading(readingData);
        this.glucoseReadings.push(response.data);
        notify('Glucose reading added successfully', 'success');
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('❌ GlucoseReadingStore: createGlucoseReading error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateGlucoseReading(readingData) {
      this.loading = true;
      try {
        await EventService.putGlucoseReading(readingData);
        // Re-fetch all readings so the store always reflects server-authoritative data,
        // regardless of whether the API returns 200+body or 204 No Content.
        await this.fetchGlucoseReadings();
        const updated = this.glucoseReadings.find(
          r => r.id === readingData.id || r.id === parseInt(readingData.id)
        ) || readingData;
        this.glucoseReading = updated;
        notify('Glucose reading updated successfully', 'success');
        return updated;
      } catch (error) {
        this.error = error.message;
        console.error('❌ GlucoseReadingStore: updateGlucoseReading error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteGlucoseReading(reading) {
      this.loading = true;
      try {
        await EventService.deleteGlucoseReading(reading);
        this.glucoseReadings = this.glucoseReadings.filter(r => r.id !== reading.id);
        notify('Glucose reading deleted', 'info');
      } catch (error) {
        this.error = error.message;
        console.error('❌ GlucoseReadingStore: deleteGlucoseReading error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearGlucoseReading() {
      this.glucoseReading = null;
    },

    clearGlucoseReadings() {
      this.glucoseReadings = [];
      this.glucoseReading = null;
    },
  },
});
