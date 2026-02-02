import EventService from './EventService'

export default {
  // ========================================
  // TRAVEL CRUD OPERATIONS
  // ========================================
  async fetchTravels() {
    try {
      const response = await EventService.getTravels();
      return {
        data: response.data,
        pagination: response.pagination
      };
    } catch (error) {
      console.error('❌ TravelService: Error fetching travels:', error);
      throw error;
    }
  },

  async fetchTravel(id) {
    try {
      const response = await EventService.getTravel(id);
      return {
        data: response.data
      };
    } catch (error) {
      console.error('❌ TravelService: Error fetching travel:', error);
      throw error;
    }
  },

  async createTravel(travelData) {
    try {
      const response = await EventService.postTravel(travelData);
      return {
        data: response.data
      };
    } catch (error) {
      console.error('❌ TravelService: Error creating travel:', error);
      throw error;
    }
  },

  async updateTravel(id, travelData) {
    try {
      const travelWithId = { ...travelData, id: parseInt(id) };
      const response = await EventService.putTravel(travelWithId);
      return {
        data: response.data
      };
    } catch (error) {
      console.error('❌ TravelService: Error updating travel:', error);
      throw error;
    }
  },

  async deleteTravel(id) {
    try {
      const response = await EventService.destroyTravel(id);
      return response;
    } catch (error) {
      console.error('❌ TravelService: Error deleting travel:', error);
      throw error;
    }
  },

  // ========================================
  // TRAVEL EVENT CRUD OPERATIONS
  // ========================================
  async fetchTravelEvents(travelId = null) {
    try {
      const response = await EventService.getTravelEvents();
      let data = response.data;
      
      // Filter by travel ID if provided
      if (travelId) {
        data = data.filter(event => event.travel_id === parseInt(travelId));
      }
      
      return {
        data: data,
        pagination: response.pagination
      };
    } catch (error) {
      console.error('❌ TravelService: Error fetching travel events:', error);
      throw error;
    }
  },

  async fetchTravelEvent(id) {
    try {
      const response = await EventService.getTravelEvent(id);
      return {
        data: response.data
      };
    } catch (error) {
      console.error('❌ TravelService: Error fetching travel event:', error);
      throw error;
    }
  },

  async createTravelEvent(travelEventData) {
    try {
      const response = await EventService.postTravelEvent(travelEventData);
      return {
        data: response.data
      };
    } catch (error) {
      console.error('❌ TravelService: Error creating travel event:', error);
      throw error;
    }
  },

  async updateTravelEvent(id, travelEventData) {
    try {
      const eventWithId = { ...travelEventData, id: parseInt(id) };
      const response = await EventService.putTravelEvent(eventWithId);
      return {
        data: response.data
      };
    } catch (error) {
      console.error('❌ TravelService: Error updating travel event:', error);
      throw error;
    }
  },

  async deleteTravelEvent(id) {
    try {
      const response = await EventService.destroyTravelEvent(id);
      return response;
    } catch (error) {
      console.error('❌ TravelService: Error deleting travel event:', error);
      throw error;
    }
  }
};