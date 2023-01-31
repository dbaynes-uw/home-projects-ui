import { createStore } from "vuex";
import EventService from "@/services/EventService.js";
export default createStore({
  state: {
    user: "Adam Jahr",
    events: [],
    event: {},
  },
  mutations: {
    ADD_EVENT(state, event) {
      console.log("ADD_EVENT: ", event.id);
      state.events.push(event);
    },
    SET_EVENT(state, event) {
      console.log("SET_EVENT for ID: ", event.id);
      state.event = event;
    },
    SET_EVENTS(state, events) {
      state.events = events;
    },
    RESET_STATE(state) {
      Object.assign(state, createStore());
    },
  },
  actions: {
    fetchEvents({ commit }) {
      EventService.getEvents()
        .then((response) => {
          //commit("RESET_STATE", response.data);
          commit("SET_EVENTS", response.data);
          console.log("State after SET_EVENTS: ", this.state.events);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchEvent({ commit, state }, id) {
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
    async fetchLastEvent({ commit }) {
      console.log("fetchLastEvent entered");
      EventService.getLastEvent()
        .then((response) => {
          console.log("getLastEvent ID: ", response.data.id);
          commit("SET_EVENT", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  modules: {},
});
