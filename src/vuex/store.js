//import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'
import EventService from '@/services/EventService'
import router from '../router'
//Vuex.use(Vuex)
//const localStorage = new Vuex.localStorage({

export default new Vuex.Store({
  props: ["message"],
  state: {
    token: "",
    errors: null,
    user: null,
    message: '',
    isNewUser: null,
    loggedIn: null,
    loggedOut: null,
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
  plugins: [createPersistedState()],
  mutations: {
    ADD_BOOK(state, book) {
      state.books.push(book);
    },
    SET_ERRORS(state, errors) {
      state.errors = errors
    },
    SET_USER_DATA (state, userData) {
      console.log("Mutations - SET_USER_DATA: ", userData)
      console.log("Token: ", userData.token);
      state.user = userData
      console.log("Mutations - STATE: ", state)
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${
        userData.token
      }`
    },
    CLEAR_USER_DATA () {
      var user = localStorage.getItem('user')
      console.log("CLEAR USER DATA!!! - ", user)
      localStorage.removeItem('user')
      console.log("Get User: ", localStorage.getItem('user'))

      axios.defaults.headers.common['Authorization'] = null
      location.reload()
    },
    SET_BOOKS(state, books) {
      state.books = books;
    },
    SET_EVENTS(state, events) {
      state.events = events;
    },
    SET_TRAILS(state, trails) {
      state.trails = trails;
    },
    SET_TRAVELS(state, travels) {
      state.travels = travels;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
  },
  actions: {
    async register ({ commit }, credentials) {
      console.log("Store.js REGISTER!");
      return axios
        //.post('//localhost:3001/users/tokens/sign_up', credentials)
        .post('//peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/users/tokens/sign_up', credentials)
        .then(({ data }) => {
          commit('SET_USER_DATA', data)
        })
    },
    async login ({ commit }, credentials) {
      console.log("Store.js LOGIN Credentials: ", credentials);
      return axios
        //.post('//localhost:3001/users/tokens/sign_in', credentials)
        .post('//peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/users/tokens/sign_in', credentials)
        .then(({ data }) => {
          commit('SET_USER_DATA', data)
        })
        //.catch((error) => {
        //  console.log("ERROR CATCH: ", error);
        //  console.log(error);
        //});
    },

    async logout ({ commit }) {
      console.log("LOGOUT - CLEAR_USER_DATA!");
      commit('CLEAR_USER_DATA')
    },
    async createBook({ commit }, book) {
      console.log("createBook from index.js BOOK: ", book);
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
      console.log("Store.js - fetchBooks!")
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
    async fetchEvents({ commit }) {
      console.log("Store.js - fetchEvents!")
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
    async fetchTravels({ commit }) {
      EventService.getTravels()
        .then((response) => {
          commit("SET_TRAVELS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log("fetchTravels ERROR: ", error);
          const message = error.response.request.statusText + '!';
          commit('SET_ERRORS', message)
          router.push({name:'home'})
        });
    },
    async fetchUsers({ commit }) {
      EventService.getUsers()
        .then((response) => {
          console.log("ES Users Response: ", response)
          commit("SET_USERS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log("fetchUsers ERROR: ", error);
          //!const message = error.response.data.error.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function(key) { return key.toUpperCase()}) + '!';
          const message = error.response.request.statusText + '!';
          commit('SET_ERRORS', message)
          //Xrouter.push({name:'home', params:{message}})
          router.push({name:'home'})
          //router.back()
        });
    },
  },
  getters: {
    loggedIn (state) {
      console.log("Getters: loggedIn state: ", state.user)
      return !!state.user
    },
    loggedOut () {
      console.log("Getters: loggedOut state:")
      //return state.user == null
    }
  },
})