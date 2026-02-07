import { defineStore } from 'pinia';
import TravelService from '@/services/TravelService';

// ✅ HELPER FUNCTION: Calculate travel duration
function calculateTravelDuration(travel) {
  if (!travel.start_date || !travel.end_date) return travel;
  
  const start = new Date(travel.start_date);
  const end = new Date(travel.end_date);
  const diffMs = end - start;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  return {
    ...travel,
    duration_days: diffDays
  };
}

export const useTravelStore = defineStore('travel', {
  state: () => ({
    travels: [],
    travel: null,
    travel_events: [],
    travel_event: null,
    loading: false,
    error: null,
    searchQuery: '',
    filterOptions: {
      showPastTravels: true,
      showFutureTravels: true,
      showCurrentTravels: true
    },
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
    allTravels: (state) => state.travels,
    currentTravel: (state) => state.travel,
    allTravelEvents: (state) => state.travel_events,
    currentTravelEvent: (state) => state.travel_event,
    isLoading: (state) => state.loading,
    errorMessage: (state) => state.error,

    // ========================================
    // FILTERED GETTERS
    // ========================================
    filteredTravels: (state) => {
      let filtered = state.travels;
      
      // Apply search filter
      if (state.searchQuery) {
        filtered = filtered.filter(travel => 
          travel.title?.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          travel.description?.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          travel.notes?.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }
      
      // Apply date filters
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      filtered = filtered.filter(travel => {
        const endDate = travel.end_date || travel.return_date;
        const startDate = travel.start_date;
        
        if (!endDate || !startDate) return true; // Show if no dates
        
        const isPast = endDate < today;
        const isFuture = startDate > today;
        const isCurrent = startDate <= today && endDate >= today;
        
        return (
          (state.filterOptions.showPastTravels && isPast) ||
          (state.filterOptions.showFutureTravels && isFuture) ||
          (state.filterOptions.showCurrentTravels && isCurrent)
        );
      });
      
      return filtered;
    },

    // ========================================
    // TRAVEL STATUS GETTERS
    // ========================================
    upcomingTravels: (state) => {
      const today = new Date().toISOString().split('T')[0];
      return state.travels.filter(travel => 
        travel.start_date && travel.start_date > today
      );
    },

    currentTravels: (state) => {
      const today = new Date().toISOString().split('T')[0];
      return state.travels.filter(travel => {
        const endDate = travel.end_date || travel.return_date;
        return travel.start_date && endDate &&
               travel.start_date <= today && endDate >= today;
      });
    },

    pastTravels: (state) => {
      const today = new Date().toISOString().split('T')[0];
      return state.travels.filter(travel => {
        const endDate = travel.end_date || travel.return_date;
        return endDate && endDate < today;
      });
    },

    // ========================================
    // TRAVEL EVENTS GETTERS
    // ========================================
    travelEventsForTravel: (state) => (travelId) => {
      return state.travel_events
        .filter(event => event.travel_id === parseInt(travelId))
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    }
  },

  actions: {
    // ========================================
    // TRAVEL CRUD OPERATIONS
    // ========================================
    async fetchTravels() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await TravelService.fetchTravels();
        
        this.travels = (response.data || []).map(travel => 
          calculateTravelDuration(travel)
        );
        
        // Update pagination if provided
        if (response.pagination) {
          this.pagination = { ...response.pagination };
        }
        
      } catch (error) {
        console.error('❌ TravelStore: Error fetching travels:', error);
        this.error = 'Failed to load travels';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTravel(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await TravelService.fetchTravel(id);
        
        this.travel = response.data;
        return this.travel;
        
      } catch (error) {
        console.error('❌ TravelStore: Error fetching travel:', error);
        this.error = 'Failed to load travel';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createTravel(travelData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await TravelService.createTravel(travelData);
        
        const newTravel = calculateTravelDuration(response.data);
        this.travels.push(newTravel);
        
        return newTravel;
        
      } catch (error) {
        console.error('❌ TravelStore: Error creating travel:', error);
        this.error = 'Failed to create travel';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTravel(id, travelData) {
      this.loading = true;
      this.error = null;
      
      try {
        // Filter out read-only fields to avoid "Unpermitted parameters" warnings
        const {
          id: _id,
          user_id,
          travel_events,
          created_at,
          updated_at,
          ...cleanData
        } = travelData;
        
        const response = await TravelService.updateTravel(id, cleanData);
        
        const updatedTravel = calculateTravelDuration(response.data);
        
        // Update in travels array
        const index = this.travels.findIndex(t => t.id === parseInt(id));
        if (index !== -1) {
          // ✅ Preserve existing travel_events if they exist
          const existingEvents = this.travels[index].travel_events;
          this.travels[index] = {
            ...updatedTravel,
            travel_events: existingEvents || []
          };
        }
        
        // Update current travel if it's the same one
        if (this.travel && this.travel.id === parseInt(id)) {
          // ✅ Preserve existing travel_events if they exist
          const existingEvents = this.travel.travel_events;
          this.travel = {
            ...updatedTravel,
            travel_events: existingEvents || []
          };
        }
        
        return updatedTravel;
        
      } catch (error) {
        console.error('❌ TravelStore: Error updating travel:', error);
        this.error = 'Failed to update travel';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTravel(travel) {
      this.loading = true;
      this.error = null;
      
      try {
        await TravelService.deleteTravel(travel.id);
        
        // Remove from travels array
        this.travels = this.travels.filter(t => t.id !== travel.id);
        
        // Clear current travel if it's the deleted one
        if (this.travel && this.travel.id === travel.id) {
          this.travel = null;
        }
        
      } catch (error) {
        console.error('❌ TravelStore: Error deleting travel:', error);
        this.error = 'Failed to delete travel';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========================================
    // TRAVEL EVENTS CRUD OPERATIONS
    // ========================================
    async fetchTravelEvents(travelId = null) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await TravelService.fetchTravelEvents(travelId);
        
        this.travel_events = response.data || [];
        
      } catch (error) {
        console.error('❌ TravelStore: Error fetching travel events:', error);
        this.error = 'Failed to load travel events';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTravelEvent(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await TravelService.fetchTravelEvent(id);
        
        this.travel_event = response.data;
        return this.travel_event;
        
      } catch (error) {
        console.error('❌ TravelStore: Error fetching travel event:', error);
        this.error = 'Failed to load travel event';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createTravelEvent(travelEventData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await TravelService.createTravelEvent(travelEventData);
        console.log('✅ TravelStore: Travel event created:', response.data);
        
        this.travel_events.push(response.data);
        return response.data;
        
      } catch (error) {
        console.error('❌ TravelStore: Error creating travel event:', error);
        this.error = 'Failed to create travel event';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTravelEvent(id, travelEventData) {
      this.loading = true;
      this.error = null;
      
      try {
        // Filter out read-only fields to avoid "Unpermitted parameters" warnings
        const {
          id: _id,
          //user_id,
          //created_at,
          //updated_at,
          ...cleanData
        } = travelEventData;
        
        const response = await TravelService.updateTravelEvent(id, cleanData);
        
        // Update in travel_events array
        const index = this.travel_events.findIndex(te => te.id === parseInt(id));
        if (index !== -1) {
          this.travel_events[index] = response.data;
        }
        
        // Update current travel_event if it's the same one
        if (this.travel_event && this.travel_event.id === parseInt(id)) {
          this.travel_event = response.data;
        }
        
        return response.data;
        
      } catch (error) {
        console.error('❌ TravelStore: Error updating travel event:', error);
        this.error = 'Failed to update travel event';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTravelEvent(travelEvent) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔍 TravelStore: Deleting travel event:', travelEvent.id);
        await TravelService.deleteTravelEvent(travelEvent.id);
        console.log('✅ TravelStore: Travel event deleted:', travelEvent.id);
        
        // Remove from travel_events array
        this.travel_events = this.travel_events.filter(te => te.id !== travelEvent.id);
        
        // Clear current travel_event if it's the deleted one
        if (this.travel_event && this.travel_event.id === travelEvent.id) {
          this.travel_event = null;
        }
        
      } catch (error) {
        console.error('❌ TravelStore: Error deleting travel event:', error);
        this.error = 'Failed to delete travel event';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========================================
    // SEARCH AND FILTER ACTIONS
    // ========================================
    setSearchQuery(query) {
      this.searchQuery = query || '';
    },

    updateFilterOptions(options) {
      this.filterOptions = { ...this.filterOptions, ...options };
    },

    clearFilters() {
      this.searchQuery = '';
      this.filterOptions = {
        showPastTravels: true,
        showFutureTravels: true,
        showCurrentTravels: true
      };
    },

    // ========================================
    // UTILITY ACTIONS
    // ========================================
    clearError() {
      this.error = null;
    },

    clearCurrentTravel() {
      this.travel = null;
    },

    clearCurrentTravelEvent() {
      this.travel_event = null;
    },

    reset() {
      this.travels = [];
      this.travel = null;
      this.travel_events = [];
      this.travel_event = null;
      this.loading = false;
      this.error = null;
      this.searchQuery = '';
      this.filterOptions = {
        showPastTravels: true,
        showFutureTravels: true,
        showCurrentTravels: true
      };
      this.pagination = {
        current_page: 1,
        per_page: 20,
        total_count: 0,
        total_pages: 0
      };
    }
  }
});