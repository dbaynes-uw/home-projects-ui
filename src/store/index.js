import { createStore } from "vuex";
import EventService from "@/services/EventService.js";
export default createStore({
  state: {
    user: "Adam Jahr",
    events: [],
    eventStats: [],
    eventsAssigned: [],
    event: {},
  },
  mutations: {
    ADD_EVENT(state, event) {
      state.events.push(event);
    },
    DELETE_EVENT(state, event) {
      state.event = event;
    },
    SET_EVENT(state, event) {
      state.event = event;
    },
    SET_EVENTS(state, events) {
      state.events = events;
    },
    SET_EVENT_STATS(state, eventStats) {
      state.eventStats = eventStats;
    },
    RESET_STATE(state) {
      Object.assign(state, createStore());
    },
  },
  actions: {
    createEvent({ commit }, event) {
      EventService.postEvent(event)
        .then(() => {
          commit("ADD_EVENT", event);
        })
        .catch((error) => {
          alert("Error in postEvent of createEvent Action (index.js)");
          console.log(error);
        });
    },
    async dueBy({ commit }, form) {
      EventService.eventDueBy(form)
        .then((response) => {
          commit("SET_EVENTS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchEvents({ commit }) {
      EventService.getEvents()
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_EVENTS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchEventStats({ commit }) {
      console.log("Store!!!!");
      EventService.getEventStats()
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_EVENT_STATS", response.data);
          console.log("EVENT STATS RESPONSE: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchEventsAssigned({ commit }, assigned) {
      console.log("Assigned to: ", assigned);
      EventService.getEventsAssigned(assigned)
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_EVENT_STATS", response.data);
          console.log("EVENT STATS RESPONSE: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async fetchEvent({ commit, state }, id) {
      const existingEvent = state.events.find((event) => event.id === id);
      if (existingEvent) {
        console.log("ExistingEVENT: ", existingEvent);
        commit("SET_EVENT", existingEvent);
      } else {
        EventService.getEvent(id)
          .then((response) => {
            commit("SET_EVENT", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async updateEvent({ commit }, event) {
      console.log("updateEvent event: ", event);
      EventService.putEvent(event)
        .then((response) => {
          commit("SET_EVENT", response.data);
          alert("Event was successfully Updated for " + event.description);
          location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteEvent({ commit }, event) {
      console.log("deleteEvent event: ", event);
      EventService.deleteEvent(event.id)
        .then((response) => {
          commit("DELETE_EVENT", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  modules: {},
});
