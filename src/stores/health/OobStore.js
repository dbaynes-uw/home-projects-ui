import { defineStore } from 'pinia';
import EventService from '@/services/EventService';
import { notify } from '@/composables/useNotify' 

// ✅ HELPER FUNCTION: Format timestamp for datetime-local input
function formatDatetimeLocal(timestamp) {
  if (!timestamp) return timestamp;
  
  try {
    // Extract ONLY date and time, IGNORE timezone completely
    // Format: "2025-12-12 19:07:00.000000000 -0800"
    //          ^^^^ ^^^^^ ^^^^^  take only this part
    const match = timestamp.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/);
    
    if (match) {
      const [, date, time] = match;
      return `${date}T${time}`;  // "2025-12-12T19:07"
    }
    
    // Fallback: If already in ISO format, extract date and time
    if (timestamp.includes('T')) {
      const [datePart, timePart] = timestamp.split('T');
      const time = timePart.split(':').slice(0, 2).join(':'); // Get HH:mm
      return `${datePart}T${time}`;
    }
    
    // Last resort: return as-is
    return timestamp;
    
  } catch (error) {
    console.error('❌ Error formatting timestamp:', error);
    return timestamp;
  }
}

// ✅ HELPER FUNCTION: Calculate time intervals between OOBs
function calculateIntervals(oobs) {
  if (!oobs || oobs.length === 0) return oobs;
  
  // Sort by date descending (newest first)
  const sorted = [...oobs].sort((a, b) => {
    return new Date(b.date_of_occurrence) - new Date(a.date_of_occurrence);
  });
  
  // Calculate intervals
  return sorted.map((oob, index) => {
    if (index === sorted.length - 1) {
      // Last (oldest) entry - no previous entry
      return {
        ...oob,
        interval_days: 0,
        interval_hours: 0,
        interval_minutes: 0
      };
    }
    
    // Calculate difference from next entry (previous in time)
    const currentDate = new Date(oob.date_of_occurrence);
    const nextDate = new Date(sorted[index + 1].date_of_occurrence);
    
    const diffMs = currentDate - nextDate;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    return {
      ...oob,
      interval_days: diffDays,
      interval_hours: diffHours % 24,
      interval_minutes: diffMinutes % 60
    };
  });
}

// ✅ HELPER FUNCTION: Format OOB for display
function formatOob(oob) {
  return {
    ...oob,
    date_of_occurrence: formatDatetimeLocal(oob.date_of_occurrence)
  };
}

export const useOobStore = defineStore('oob', {
  state: () => ({
    oobs: [],
    oob: null,
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      per_page: 20,
      total_count: 0,
      total_pages: 0
    }
  }),

  getters: {
    // ========================================
    // BASIC GETTERS
    // ========================================
    allOobs: (state) => state.oobs,
    
    oobCount: (state) => state.oobs.length,
    
    isOobsEmpty: (state) => state.oobs.length === 0,

    oobById: (state) => (id) => {
      // ✅ Handle both string and number IDs (route params are strings!)
      const numId = parseInt(id);
      return state.oobs.find(oob => oob.id === numId || oob.id === id);
    },

    // ========================================
    // FILTERED GETTERS
    // ========================================
    
    // Get OOBs by date range
    oobsByDateRange: (state) => {
      return (startDate, endDate) => {
        return state.oobs.filter(oob => {
          const oobDate = new Date(oob.date_of_occurrence);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return oobDate >= start && oobDate <= end;
        }).sort((a, b) => new Date(b.date_of_occurrence) - new Date(a.date_of_occurrence));
      };
    },

    // Get recent OOBs (last 30 days)
    recentOobs: (state) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      return state.oobs.filter(oob => {
        const oobDate = new Date(oob.date_of_occurrence);
        return oobDate >= thirtyDaysAgo;
      }).sort((a, b) => new Date(b.date_of_occurrence) - new Date(a.date_of_occurrence));
    },

    // Get OOBs by type
    oobsByType: (state) => {
      return (type) => state.oobs.filter(
        oob => oob.type_of_occurrence === type
      );
    },

    // Get OOBs by severity
    oobsBySeverity: (state) => {
      return (severity) => state.oobs.filter(
        oob => oob.severity === severity
      );
    },

    // ========================================
    // STATISTICS GETTERS
    // ========================================
    
    // Count by type
    oobTypeCount: (state) => {
      const types = {};
      state.oobs.forEach(oob => {
        const type = oob.type_of_occurrence || 'Unknown';
        types[type] = (types[type] || 0) + 1;
      });
      return types;
    },

    // Count by severity
    oobSeverityCount: (state) => {
      const severities = {
        mild: 0,
        moderate: 0,
        severe: 0,
        unknown: 0
      };
      
      state.oobs.forEach(oob => {
        const severity = (oob.severity || 'unknown').toLowerCase();
        if (severities[severity] !== undefined) {
          severities[severity]++;
        } else {
          severities.unknown++;
        }
      });
      
      return severities;
    },

    // Average OOBs per month
    averageOobsPerMonth: (state) => {
      if (state.oobs.length === 0) return 0;
      
      const dates = state.oobs.map(oob => new Date(oob.date_of_occurrence));
      const oldestDate = new Date(Math.min(...dates));
      const newestDate = new Date(Math.max(...dates));
      
      const monthsDiff = (newestDate.getFullYear() - oldestDate.getFullYear()) * 12 
                        + (newestDate.getMonth() - oldestDate.getMonth()) + 1;
      
      return (state.oobs.length / monthsDiff).toFixed(2);
    },

    // Get OOBs grouped by month
    oobsByMonth: (state) => {
      const grouped = {};
      
      state.oobs.forEach(oob => {
        const date = new Date(oob.date_of_occurrence);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!grouped[monthKey]) {
          grouped[monthKey] = [];
        }
        grouped[monthKey].push(oob);
      });
      
      return grouped;
    },

    // Most common type
    mostCommonType: (state, getters) => {
      const counts = getters.oobTypeCount;
      let maxCount = 0;
      let mostCommon = 'Unknown';
      
      Object.entries(counts).forEach(([type, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostCommon = type;
        }
      });
      
      return mostCommon;
    },

    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    
    currentPage: (state) => state.pagination.current_page,
    totalPages: (state) => state.pagination.total_pages,
    totalCount: (state) => state.pagination.total_count
  },

  actions: {
    // ========================================
    // FETCH ALL OOBS
    // ========================================
    async fetchOobs() {
      this.loading = true;
      this.error = null;

      try {
        const response = await EventService.getOobs();
        
        // ✅ HANDLE DIFFERENT RESPONSE FORMATS
        let oobsArray = [];
        if (Array.isArray(response.data)) {
          oobsArray = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          oobsArray = response.data.data;
        }

        // ✅ FORMAT EACH OOB
        const formattedOobs = oobsArray.map(oob => formatOob(oob));
        
        // ✅ CALCULATE INTERVALS (THIS WAS MISSING!)
        this.oobs = calculateIntervals(formattedOobs);
        
        return this.oobs;
        
      } catch (error) {
        this.error = error.message || 'Failed to fetch OOBs';
        this.oobs = [];
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ========================================
    // FETCH SINGLE OOB
    // ========================================
    async fetchOob(id) {
      this.loading = true;
      this.error = null;
    
      try {
        
        // ✅ ENSURE WE HAVE ALL OOBS (with intervals already calculated)
        if (this.oobs.length === 0) {
          await this.fetchOobs();
        }
        
        // ✅ JUST FIND IT IN THE LIST - IT ALREADY HAS INTERVALS!
        const existing = this.oobById(id);
        if (existing) {
          this.oob = existing;
          return this.oob;
        }
        
        // ✅ IF NOT IN LIST (edge case), FETCH FROM API
        const response = await EventService.getOob(id);
        
        // ✅ FORMAT THE OOB
        const formattedOob = formatOob(response.data);
        
        // ✅ ADD DEFAULT INTERVALS (since it's not in the list)
        this.oob = {
          ...formattedOob,
          interval_days: 0,
          interval_hours: 0,
          interval_minutes: 0
        };
        
        return this.oob;
        
      } catch (error) {
        console.error('❌ Error fetching OOB:', error);
        this.error = error.message || 'Failed to fetch OOB';
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ========================================
    // CREATE OOB
    // ========================================
    async createOob(oobData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await EventService.postOob(oobData);
        
        // ✅ REFRESH LIST TO RECALCULATE INTERVALS
        await this.fetchOobs();
        
        return response.data;
        
      } catch (error) {
        notify('Failed to create OOB. Please try again.', 'error');
        this.error = error.message || 'Failed to create OOB';
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ========================================
    // UPDATE OOB
    // ========================================
    async updateOob(oobData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await EventService.putOob(oobData);
        
        // ✅ REFRESH LIST TO RECALCULATE INTERVALS
        await this.fetchOobs();
        
        return response.data;
        
      } catch (error) {
        notify('Failed to update OOB. Please try again.', 'error');
        this.error = error.message || 'Failed to update OOB';
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    // ========================================
    // DELETE OOB
    // ========================================
    async deleteOob(id) {
      this.loading = true;
      this.error = null;

      try {
        await EventService.deleteOob({ id });
        
        // ✅ REFRESH LIST TO RECALCULATE INTERVALS
        await this.fetchOobs();
        
        return true;
        
      } catch (error) {
        notify('Failed to delete OOB. Please try again.', 'error');
        this.error = error.message || 'Failed to delete OOB';
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
    },

    $reset() {
      this.oobs = [];
      this.oob = null;
      this.loading = false;
      this.error = null;
      this.pagination = {
        current_page: 1,
        per_page: 20,
        total_count: 0,
        total_pages: 0
      };
    }
  }
});