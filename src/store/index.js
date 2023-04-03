import { createStore } from "vuex";
import EventService from "@/services/EventService.js";
import axios from "axios";
const api_url = "http://localhost:3000/api/v1/events/";
export default createStore({
  state: {
    user: "David Baynes",
    events: [],
    users: [],
    eventStats: [],
    eventsPastDue: [],
    eventsAssigned: [],
    event: {},
  },
  mutations: {
    ADD_EVENT(state, event) {
      state.events.push(event);
    },
    ADD_USER(state, user) {
      state.events.push(user);
    },
    DELETE_USER(state, user) {
      state.user = user;
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
    SET_EVENT_STATISTIC_DETAIL(state, eventStatisticDetail) {
      state.eventStatisticDetail = eventStatisticDetail;
    },
    SET_EVENTS_PAST_DUE(state, eventsPastDue) {
      state.eventsPastDue = eventsPastDue;
    },
    RESET_STATE(state) {
      Object.assign(state, createStore());
    },
    SET_TRAILS(state, trails) {
      state.trails = trails;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
  },
  actions: {
    createEvent({ commit }, event) {
      console.log("createEvent from index.js");
      EventService.postEvent(event)
        .then(() => {
          commit("ADD_EVENT", event);
        })
        .catch((error) => {
          alert("Error in postEvent of createEvent Action (index.js)");
          console.log(error);
        });
    },
    createUser({ commit }, user) {
      console.log("createUser from index.js");
      EventService.postUser(user)
        .then(() => {
          commit("ADD_USER", user);
        })
        .catch((error) => {
          alert("Error in postUser of createUser Action (index.js)");
          console.log(error);
        });
    },

    async dueBy({ commit }, form) {
      console.log("Index.js: dueBy");
      EventService.eventDueBy(form)
        .then((response) => {
          commit("SET_EVENTS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //async pastDue({ commit }, pastDue) {
    //  console.log("Index.js: pastDue");
    //  EventService.eventDueBy(pastDue)
    //    .then((response) => {
    //      commit("SET_EVENTS", response.data);
    //      return response.data;
    //    })
    //    .catch((error) => {
    //      console.log(error);
    //    });
    //},
    async pastDue({ commit }, pastDue) {
      console.log("Index: pastDue: ", pastDue);
      pastDue = true;
      const response = await axios.get(api_url + `?pastDue=${pastDue}`);
      commit("SET_EVENTS", response.data);
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
    async fetchEventsPastDue({ commit }, statistic) {
      console.log("Index - Fetch Events Past Due statistic: ", statistic);
      EventService.getEventsPastDue(statistic)
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_EVENTS_PAST_DUE", response.data);
          console.log("EVENTS PAST DUE RESPONSE: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchEventStatisticDetail({ commit }, statistic) {
      console.log("Index - Fetch Events statistic: ", statistic);
      EventService.getEventStatisticDetail(statistic)
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_EVENT_STATISTIC_DETAIL", response.data);
          console.log("EVENTS STATISTIC DETAIL RESPONSE: ", response.data);
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
          console.log("EVENT STATS Assigned RESPONSE: ", response.data);
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
      console.log("updateEvent event from dbl click: ", event);
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
    async fetchTrails({ commit }) {
      EventService.getTrails()
        .then((response) => {
          commit("SET_TRAILS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchUsers({ commit }) {
      EventService.getUsers()
        .then((response) => {
          commit("SET_USERS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteUser({ commit }, user) {
      console.log("deleteUser: ", user);
      EventService.deleteUser(user.id)
        .then((response) => {
          commit("DELETE_USER", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async updateUser({ commit }, user) {
      console.log("updateUser user: ", user);
      EventService.putUser(user)
        .then((response) => {
          commit("SET_USER", response.data);
          alert("User was successfully Updated for " + user.description);
          location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  modules: {},
});
