import { createStore } from "vuex";
import sessionManager from "@/store/modules/session_manager";
import EventService from "@/services/EventService.js";
import axios from "axios";
const api_url =
  "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/events/";
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
      console.log("SET_USER_DATA - state: ", state);
      console.log("SET_USER_DATA - userData: ", userData);
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${
        userData.token
      }`
      state.user = userData
    },
    LOGOUT () {
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
    register ({ commit }, credentials) {
      console.log("Action Register - credentials: ", credentials);
      return axios
        .post('//localhost:3000/register', credentials)
        .then(({ data }) => {
          commit('SET_USER_DATA', data)
        })
    },
    login ({ commit }, credentials) {
      return axios
        .post('//localhost:3000/login', credentials)
        .then(({ data }) => {
          commit('SET_USER_DATA', data)
        })
    },
    logout ({ commit }) {
      commit('LOGOUT')
    },
    isNewUser ({ commit }, isNewUser) {
      commit('IS_NEW_USER', isNewUser)
    },
    createBook({ commit }, book) {
      console.log("createBook from index.js");
      EventService.postBook(book)
        .then(() => {
          commit("ADD_BOOK", book);
          alert("Book was successfully added for " + book.title);
        })
        .catch((error) => {
          alert("Error in postBook of createBook Action (index.js)");
          console.log(error);
        });
    },
    async fetchBooks({ commit }) {
      EventService.getBooks()
        .then((response) => {
          commit("SET_BOOKS", response.data);
          console.log("FetchBooks response.data: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchBook({ commit, state }, id) {
      const existingBook = state.books.find((book) => book.id === id);
      if (existingBook) {
        console.log("ExistingBook: ", existingBook);
        commit("SET_BOOK", existingBook);
      } else {
        EventService.getBook(id)
          .then((response) => {
            commit("SET_BOOK", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
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
    async deleteBook({ commit }, book) {
      console.log("Index.js: deleteBook title: ", book.title);
      EventService.deleteBook(book.id)
        .then((response) => {
          commit("DELETE_BOOK", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
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
    async fetchEventStatistics({ commit }) {
      console.log("Store!!!!");
      EventService.getEventStatistics()
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_EVENT_STATISTICS", response.data);
          console.log("EVENT STATISTICS RESPONSE: ", response.data);
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
          commit("SET_EVENT_STATISTICS", response.data);
          console.log("EVENT STATISTICS Assigned RESPONSE: ", response.data);
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
    createTrail({ commit }, trail) {
      console.log("createTrail from index.js");
      EventService.postTrail(trail)
        .then(() => {
          commit("ADD_TRAIL", trail);
        })
        .catch((error) => {
          alert("Error in postTrail of createTrail Action (index.js)");
          console.log(error);
        });
    },
    async fetchTrails({ commit }) {
      EventService.getTrails()
        .then((response) => {
          commit("SET_TRAILS", response.data);
          console.log("FetchTrails response.data: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchTrail({ commit, state }, id) {
      const existingTrail = state.trails.find((trail) => trail.id === id);
      if (existingTrail) {
        console.log("ExistingTrail: ", existingTrail);
        commit("SET_TRAIL", existingTrail);
      } else {
        EventService.getTrail(id)
          .then((response) => {
            commit("SET_TRAIL", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async updateTrail({ commit }, trail) {
      console.log("updateTrail event from dbl click: ", trail);
      EventService.putTrail(trail)
        .then((response) => {
          commit("SET_TRAIL", response.data);
          alert("Trail was successfully Updated for " + trail.head_name);
          location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteTrail({ commit }, trail) {
      console.log("deleteTrail event: ", trail);
      EventService.deleteTrail(trail.id)
        .then((response) => {
          commit("DELETE_TRAIL", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createTravel({ commit }, travel) {
      console.log("createTravel from index.js");
      EventService.postTravel(travel)
        .then(() => {
          commit("ADD_TRAVEL", travel);
          alert("Travel was successfully added for " + travel.title);
        })
        .catch((error) => {
          alert("Error in postTravel of createTravel Action (index.js)");
          console.log(error);
        });
    },
    async fetchTravels({ commit }) {
      console.log("Fetch Travels");
      EventService.getTravels()
        .then((response) => {
          commit("SET_TRAVELS", response.data);
          console.log("FetchTravel response.data: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchTravel({ commit, state }, id) {
      const existingTravel = state.travels.find((travel) => travel.id === id);
      if (existingTravel) {
        console.log("ExistingTravel: ", existingTravel);
        commit("SET_Travel", existingTravel);
      } else {
        EventService.getTravel(id)
          .then((response) => {
            commit("SET_TRAVEL", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async updateTravel({ commit }, travel) {
      console.log("updateTravel event from dbl click: ", travel);
      EventService.putTravel(travel)
        .then((response) => {
          commit("SET_TRAVEL", response.data);
          alert("Travel was successfully Updated for " + travel.title);
          location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteTravel({ commit }, travel) {
      console.log("Index.js: deleteTravel title: ", travel.title);
      EventService.deleteTravel(travel.id)
        .then((response) => {
          commit("DELETE_TRAVEL", response.data);
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
