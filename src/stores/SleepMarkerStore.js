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
function minutesToHoursMinutes(minutes) {
  if (!minutes || minutes === 0) return '0m';
  
  const totalMinutes = parseInt(minutes);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
function hoursMinutesToMinutes(hoursMinutesString) {
  if (!hoursMinutesString || hoursMinutesString === '0m') return 0;
  
  try {
    let hours = 0;
    let minutes = 0;
    
    // Match patterns like "1h 30m", "1h", "30m"
    const hourMatch = hoursMinutesString.match(/(\d+)h/);
    const minuteMatch = hoursMinutesString.match(/(\d+)m/);
    
    if (hourMatch) hours = parseInt(hourMatch[1]);
    if (minuteMatch) minutes = parseInt(minuteMatch[1]);
    
    return (hours * 60) + minutes;
    
  } catch (error) {
    console.error('❌ Error converting to minutes:', hoursMinutesString, error);
    return 0;
  }
}

// ✅ NEW: Prepare data for API (convert back to minutes)
function prepareForApi(markerData) {
  return {
    ...markerData,
    deep_sleep: hoursMinutesToMinutes(markerData.deep_sleep),
    rem_sleep: hoursMinutesToMinutes(markerData.rem_sleep),
    core_sleep: hoursMinutesToMinutes(markerData.core_sleep),
    awake_sleep: hoursMinutesToMinutes(markerData.awake_sleep),
    time_in_bed: hoursMinutesToMinutes(markerData.time_in_bed),
    time_awake: hoursMinutesToMinutes(markerData.time_awake),
    time_asleep: hoursMinutesToMinutes(markerData.time_asleep),
  };
}

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

// ✅ UPDATE formatSleepMarker to use normalizeDate:
function formatSleepMarker(marker) {
  return {
    ...marker,
    sleep_date: normalizeDate(marker.sleep_date), // ✅ Just normalize, don't convert
    bed_time: extractTime(marker.bed_time),
    wake_time: extractTime(marker.wake_time),
    // ✅ Convert all sleep duration fields from minutes to "Xh Ym" format
    deep_sleep: minutesToHoursMinutes(marker.deep_sleep),
    rem_sleep: minutesToHoursMinutes(marker.rem_sleep),
    core_sleep: minutesToHoursMinutes(marker.core_sleep),
    awake_sleep: minutesToHoursMinutes(marker.awake_sleep),
    time_in_bed: minutesToHoursMinutes(marker.time_in_bed),
    time_awake: minutesToHoursMinutes(marker.time_awake),
    time_asleep: minutesToHoursMinutes(marker.time_asleep)
  };
}

function decimalHoursToHoursMinutes(decimalHours) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  
  if (hours === 0 && minutes === 0) return '0m';
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
// ✅ UPDATED: Handle BOTH decimal numbers AND "1h 30m" string format
function hoursMinutesToDecimal(value) {
  if (!value) return 0;
  
  // If it's already a number (old API format), return it
  if (typeof value === 'number') return value;
  
  // If it's a string that's just a number (like "1.5"), parse it
  if (typeof value === 'string' && /^\d+\.?\d*$/.test(value)) {
    return parseFloat(value);
  }
  
  // If it's the new format "1h 30m", parse it
  if (typeof value === 'string') {
    try {
      let hours = 0;
      let minutes = 0;
      
      // Match patterns like "1h 30m", "1h", "30m", "0m"
      const hourMatch = value.match(/(\d+)h/);
      const minuteMatch = value.match(/(\d+)m/);
      
      if (hourMatch) hours = parseInt(hourMatch[1]);
      if (minuteMatch) minutes = parseInt(minuteMatch[1]);
      
      return hours + (minutes / 60);
      
    } catch (error) {
      console.error('❌ Error parsing hours/minutes:', value, error);
      return 0;
    }
  }
  
  return 0;
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

    // ✅ UPDATED: Use time_asleep and return "Xh Ym" format
    averageSleepHours: (state) => {
      if (state.sleepMarkers.length === 0) return '0m';
      const total = state.sleepMarkers.reduce((sum, m) => {
        // Convert "1h 30m" string to decimal for averaging
        return sum + hoursMinutesToDecimal(m.time_asleep);
      }, 0);
      const average = total / state.sleepMarkers.length;
      return decimalHoursToHoursMinutes(average);
    },

    averageSleepQuality: (state) => {
      if (!state.sleepMarkers.length) return '0.0';
      const total = state.sleepMarkers.reduce((sum, m) => 
        sum + (parseFloat(m.sleep_quality) || 0), 0
      );
      return (total / state.sleepMarkers.length).toFixed(1);
    },
    
    averageAwakeSleep: (state) => {
      if (state.sleepMarkers.length === 0) return '0m';
      const total = state.sleepMarkers.reduce((sum, m) => {
        // Convert "1h 30m" string to decimal for averaging
        return sum + hoursMinutesToDecimal(m.awake_sleep);
      }, 0);
      const average = total / state.sleepMarkers.length;
      return decimalHoursToHoursMinutes(average);
    },
    
    averageRemSleep: (state) => {
      if (state.sleepMarkers.length === 0) return '0m';
      const total = state.sleepMarkers.reduce((sum, m) => {
        // Convert "1h 30m" string to decimal for averaging
        return sum + hoursMinutesToDecimal(m.rem_sleep);
      }, 0);
      const average = total / state.sleepMarkers.length;
      return decimalHoursToHoursMinutes(average);
    },
    
    averageCoreSleep: (state) => {
      if (state.sleepMarkers.length === 0) return '0m';
      const total = state.sleepMarkers.reduce((sum, m) => {
        return sum + hoursMinutesToDecimal(m.core_sleep);
      }, 0);
      const average = total / state.sleepMarkers.length;
      return decimalHoursToHoursMinutes(average);
    },
    
    averageDeepSleep: (state) => {
      if (state.sleepMarkers.length === 0) return '0m';
      const total = state.sleepMarkers.reduce((sum, m) => {
        return sum + hoursMinutesToDecimal(m.deep_sleep);
      }, 0);
      const average = total / state.sleepMarkers.length;
      return decimalHoursToHoursMinutes(average);
    },

    averageAwakeTime: (state) => {
      if (state.sleepMarkers.length === 0) return '0m';
      const total = state.sleepMarkers.reduce((sum, m) => {
        return sum + hoursMinutesToDecimal(m.time_awake);
      }, 0);
      const average = total / state.sleepMarkers.length;
      return decimalHoursToHoursMinutes(average);
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
        
        const response = await EventService.getSleepMarkers();
        // ✅ HANDLE DIFFERENT RESPONSE FORMATS
        let sleepMarkersArray = [];
        if (Array.isArray(response.data)) {
          sleepMarkersArray = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          sleepMarkersArray = response.data.data;
        }

        // ✅ FORMAT EACH MARKER (USE EXTERNAL FUNCTION)
        this.sleepMarkers = sleepMarkersArray.map(marker => formatSleepMarker(marker));
        
        return this.sleepMarkers;
        
      } catch (error) {
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
        // ✅ Convert hours/minutes to minutes for API
        const apiData = prepareForApi(sleepMarkerData);
        
        const response = await EventService.postSleepMarker(apiData);
        
        // Refresh list to get updated data
        await this.fetchSleepMarkers();
        
        return response.data;
        
      } catch (error) {
        alert('Failed to create sleep entry. Please try again.');
        this.error = error.message;
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ✅ UPDATE: Update sleep marker - convert to minutes before sending
    async updateSleepMarker(sleepMarkerData) {
      this.loading = true;
      this.error = null;
      
      try {
        
        // ✅ Convert hours/minutes to minutes for API
        const apiData = prepareForApi(sleepMarkerData);
        
        const response = await EventService.putSleepMarker(apiData);
        
        // Refresh list to get updated data
        await this.fetchSleepMarkers();
                
        return response.data;
        
      } catch (error) {
        alert('Failed to update sleep entry. Please try again.');
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
        await EventService.deleteSleepMarker(id);
        
        // Refresh list to get updated data
        await this.fetchSleepMarkers();
                
        return true;
        
      } catch (error) {
        alert('Failed to delete sleep entry. Please try again.');
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