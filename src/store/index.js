import { createStore } from "vuex";
import sessionManager from "@/store/modules/session_manager";
import EventService from "@/services/EventService.js";
import axios from "axios";
//const api_url =
//  "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/events/";
axios.defaults.headers.common = { 'Authorization': 'Bearer '+localStorage.getItem('accessToken') }
export default createStore({
  state: {
    user: null,
    isNewUser: true,
    users: [],
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
    RESET_STATE(state) {
      Object.assign(state, createStore());
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
