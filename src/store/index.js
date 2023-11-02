import { createStore } from "vuex";
import sessionManager from "@/store/modules/session_manager";
import EventService from "@/services/EventService.js";
import axios from "axios";
const api_url =
  "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/events/";
axios.defaults.headers.common = { 'Authorization': 'Bearer '+localStorage.getItem('accessToken') }
export default createStore({
  state: {
    user: null,
    isNewUser: true,
    books: [],
    events: [],
    trails: [],
    travels: [],
    users: [],
    eventStatistics: [],
    eventsPastDue: [],
    eventsAssigned: [],
    event: {},
    trail: {},
  },
  mutations: {
    SET_USER_DATA (state, userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${
        userData.token
      }`
      state.user = userData
    },
    LOGOUT () {
      console.log("Store/index.js - LOGOUT");
      localStorage.removeItem('user')
      location.reload()
    },
    IS_NEW_USER (state, isNewUser) {
      state.isNewUser = isNewUser
    },
    ADD_BOOK(state, book) {
      state.books.push(book);
    },
    SET_BOOKS(state, books) {
      state.books = books;
    },
    SET_BOOK(state, book) {
      state.book = book;
    },
    DELETE_BOOK(state, book) {
      state.book = book;
    },
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
    SET_EVENT_STATISTICS(state, eventStatistics) {
      state.eventStatistics = eventStatistics;
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
    ADD_TRAIL(state, trail) {
      state.trails.push(trail);
    },
    SET_TRAILS(state, trails) {
      state.trails = trails;
    },
    SET_TRAIL(state, trail) {
      state.trail = trail;
    },
    DELETE_TRAIL(state, trail) {
      state.trail = trail;
    },
    ADD_TRAVEL(state, travel) {
      state.travels.push(travel);
    },
    SET_TRAVELS(state, travels) {
      state.travels = travels;
    },
    SET_TRAVEL(state, travel) {
      state.travel = travel;
    },
    DELETE_TRAVEL(state, travel) {
      state.travel = travel;
    },
    ADD_USER(state, user) {
      state.events.push(user);
    },
    DELETE_USER(state, user) {
      state.user = user;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
  },
  actions: {

    async updateBook({ commit }, book) {
      console.log("updateBook event from dbl click: ", book);
      EventService.putBook(book)
        .then((response) => {
          commit("SET_BOOK", response.data);
          alert("Book was successfully Updated for " + book.title);
          location.reload();
        })
        .catch((error) => {
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
  modules: {
    sessionManager,
  },
});
