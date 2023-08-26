//import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'
import EventService from '@/services/EventService'
//Vuex.use(Vuex)
//const localStorage = new Vuex.localStorage({

export default new Vuex.Store({
  state: {
    user: null,
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
    SET_USER_DATA (state, userData) {
      console.log("Mutations - SET_USER_DATA: ", userData)
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
    SET_USERS(state, users) {
      state.users = users;
    },
  },
  actions: {
    async register ({ commit }, credentials) {
      console.log("Store.js REGISTER!");
      return axios
        .post('//localhost:3000/register', credentials)
        //.post('//localhost:3000/users/tokens/sign_up', credentials)
        .then(({ data }) => {
          commit('SET_USER_DATA', data)
        })
    },
    async login ({ commit }, credentials) {
      console.log("Store.js LOGIN!");
      return axios
        .post('//localhost:3000/login', credentials)
        //.post('//localhost:3000/users/tokens/sign_in', credentials)
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