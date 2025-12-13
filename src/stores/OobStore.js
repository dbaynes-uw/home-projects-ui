import { defineStore } from 'pinia';
import EventService from '@/services/EventService';

// ✅ HELPER FUNCTION: Normalize date format
function normalizeDate(dateString) {
  if (!dateString) return dateString;
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }
  
  return dateString;
}

// ✅ HELPER FUNCTION: Format OOB for display
function formatOob(oob) {
  return {
    ...oob,
    date_of_occurrence: normalizeDate(oob.date_of_occurrence)
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
      return state.oobs.find(oob => oob.id === id);
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
        console.log('🔄 Fetching OOBs from API...');
        const response = await EventService.getOobs();
        console.log('🔄 Raw OOBs response:', response);
        // ✅ HANDLE DIFFERENT RESPONSE FORMATS
        let oobsArray = [];
        if (Array.isArray(response.data)) {
          oobsArray = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          oobsArray = response.data.data;
        }

        // ✅ FORMAT EACH OOB
        this.oobs = oobsArray.map(oob => formatOob(oob));
        
        console.log(`✅ Fetched ${this.oobs.length} OOBs`);
        return this.oobs;
        
      } catch (error) {
        console.error('❌ Error fetching OOBs:', error);
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
        console.log(`🔄 Fetching OOB ${id}...`);
        
        // Check if we already have it
        const existing = this.oobById(id);
        if (existing) {
          this.oob = existing;
          return existing;
        }
        
        const response = await EventService.getOob(id);
        
        // ✅ FORMAT THE OOB
        this.oob = formatOob(response.data);
        
        console.log('✅ OOB fetched:', this.oob);
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
        console.log('🔄 Creating OOB...', oobData);
        const response = await EventService.postOob(oobData);
        
        // Refresh list to get updated data
        await this.fetchOobs();
        
        console.log('✅ OOB created:', response.data);
        return response.data;
        
      } catch (error) {
        console.error('❌ Error creating OOB:', error);
        alert('Failed to create OOB. Please try again.');
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
        console.log('🔄 Updating OOB...', oobData);
        const response = await EventService.putOob(oobData);
        
        // Refresh list to get updated data
        await this.fetchOobs();
        
        console.log('✅ OOB updated:', response.data);
        return response.data;
        
      } catch (error) {
        console.error('❌ Error updating OOB:', error);
        alert('Failed to update OOB. Please try again.');
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
      console.log('🗑️ Deleting OOB with ID:', id);
      this.loading = true;
      this.error = null;

      try {
        await EventService.deleteOob({ id });
        
        // Refresh list to get updated data
        await this.fetchOobs();
        
        console.log('✅ OOB deleted');
        return true;
        
      } catch (error) {
        console.error('❌ Error deleting OOB:', error);
        alert('Failed to delete OOB. Please try again.');
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
      console.log('🧹 OobStore cleaned up');
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