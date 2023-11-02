//import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'
import EventService from '@/services/EventService'
import router from '../router'
//Vuex.use(Vuex)
//const localStorage = new Vuex.localStorage({
var api_authenticate_url = "";
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
    vendors: [],
    vendor_group: [],
    vendor_locations_group: [],
    vendor_products_group: [],
    products: [],
    trails: [],
    travels: [],
    users: [],
    eventStatistics: [],
    eventsPastDue: [],
    eventsDueBy: [],
    eventsAssigned: [],
    event: {},
    trail: {},
  },
  plugins: [createPersistedState()],
  mutations: {
    ADD_BOOK(state, book) {
      state.books.push(book);
    },
    DELETE_BOOK(state, book) {
      state.book = book;
    },
    SET_BOOK(state, book) {
      state.book = book;
    },
    SET_BOOKS(state, books) {
      state.books = books;
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
    SET_PRODUCT(state, product) {
      state.product = product;
    },
    SET_VENDOR_PRODUCTS(state, vendor_products) {
      state.vendor_products = vendor_products;
    },
    SET_VENDOR_GROUP(state, vendor_group) {
      state.vendor_group = vendor_group;
    },
    SET_VENDOR_LOCATIONS_GROUP(state, vendor_locations_group) {
      state.vendor_locations_group = vendor_locations_group;
    },
    SET_VENDOR_PRODUCTS_GROUP(state, vendor_products_group) {
      state.vendor_products_group = vendor_products_group;
    },
    ADD_VENDOR(state, vendor) {
      state.vendors.push(vendor);
    },
    PUT_VENDOR(state, vendor) {
      state.vendors.push(vendor);
    },
    ADD_TRAIL(state, trail) {
      state.trails.push(trail);
    },
    DELETE_TRAIL(state, trail) {
      state.trail = trail;
    },
    SET_TRAIL(state, trail) {
      state.trail = trail;
    },
    SET_TRAILS(state, trail) {
      state.trails = trail;
    },
    ADD_TRAVEL(state, travel) {
      state.travels.push(travel);
    },
    DELETE_TRAVEL(state, travel) {
      state.travel = travel;
    },
    SET_TRAVEL(state, travel) {
      state.travel = travel;
    },
    SET_TRAVELS(state, travels) {
      state.travels = travels;
    },
    ADD_USER(state, user) {
      state.users.push(user);
    },
    SET_USER_DATA (state, userData) {
      state.user = userData
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
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_ERRORS(state, errors) {
      state.errors = errors
    },
  },
  actions: {
    async register ({ commit }, credentials) {
      this.init_authentication;
      if (window.location.port == "8080") {
        //api_url = "http://davids-macbook-pro.local:3000/api/v1/";
        api_authenticate_url = "//localhost:3000/api/v1/users/";
      } else {
        api_authenticate_url =
          "//peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/users/tokens/";
      }
      this.message = null
      if ( credentials.email.toLowerCase().includes('baynes')) {
        return axios
          .post(api_authenticate_url, credentials)
          .then(({ data }) => {
            commit('SET_USER_DATA', data)
          })
          .catch((error) => {
            console.log(error);
            if (this.message == null) {
              error = error.response.request.statusText + '!';
            } else {
              error = this.message
            }
            console.log("Message to be sent: ", error)
            router.push({name:'home', params: {message: this.message}})
          });
        } else {
          this.message = 'Contact Admin to Register: ';
          commit('SET_ERRORS', this.message)
          router.push({name:'home', params: {message: this.message}})
      }
    },
    async login ({ commit }, credentials) {
      if (window.location.port == "8080") {
        //api_url = "http://davids-macbook-pro.local:3000/...";
        api_authenticate_url = "//localhost:3000/users/tokens/";
      } else {
        api_authenticate_url =
          "//peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/users/tokens/";
      }
      console.log("api_authenticate_url: ", api_authenticate_url);
      this.init_authentication;
      return axios
       .post(api_authenticate_url + "sign_in", credentials)
       .then(({ data }) => {
         commit('SET_USER_DATA', data)
       })
       .catch((error) => {
         console.log(error);
         alert("Invalid Login Credentials or API problem - Please try again")
         //location.reload()
         //const message = error.response.request.statusText + '!';
         error = error.response.request.statusText + '!';
         console.log("Message to be sent: ", error)
         router.back(error)
       });
    },

    async logout ({ commit }) {
      console.log("LOGOUT - CLEAR_USER_DATA!");
      commit('CLEAR_USER_DATA')
      router.push({name:'home'})
    },
    async createBook({ commit }, book) {
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
    async createEvent({ commit }, event) {
      EventService.postEvent(event)
        .then(() => {
          commit("ADD_EVENT", event);
          alert("Event was successfully added for " + event.description);
        })
        .catch((error) => {
          alert("Error in postEvent of createEvent Action (index.js)");
          console.log(error);
        });
    },
    async deleteBook({ commit }, book) {
      EventService.deleteBook(book)
        .then((response) => {
          commit("DELETE_BOOK", response.data);
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
          console.log("FetchEvents response.data: ", response.data);
          return response.data;
        })
        //.catch((error) => {
        //  console.log(error);
        //  const message = error.response.request.statusText + '!';
        //  commit('SET_ERRORS', message)
        //  router.push({name:'home'})
        //});
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

    async eventsDueBy({ commit }, form) {
      console.log("eventsDueBy - dueBy: ");
      EventService.getEventsDueBy(form)
        .then((response) => {
      commit("SET_EVENTS", response.data);
      console.log("EVENT STATISTICS RESPONSE: ", response.data);
      return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    async eventsPastDue({ commit }, dueBy) {
      EventService.getEventsPastDue(dueBy)
        .then((response) => {
      commit("SET_EVENTS", response.data);
      console.log("EVENT STATISTICS RESPONSE: ", response.data);
      return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    async fetchEventStatistics({ commit }) {
      console.log("fetchEventStatistics Store!!!!");
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
    async fetchEventStatisticDetail({ commit }, statistic) {
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
    async createVendor({ commit }, vendor) {
      console.log("CREATE VENDOR: ", vendor)
      EventService.postVendor(vendor)
        .then(() => {
          commit("ADD_VENDOR", vendor);
          alert("Vendor was successfully updated for " + vendor.location + " - " + vendor.vendor_name);
        })
        .catch((error) => {
          /*console.log("ERRORS!!!!!!!!!!!@@@@@@@@@@@@@@@")
          console.log("Error Response: ", error.response)
          console.log("Error Response Status: ", error.response.status)
          console.log("Error Response Request: ", error.response.request)
          console.log("Error Response Headers: ", error.response.headers)
          console.log("Error Data: ", error.data)
          console.log("Error Response Data: ", error.response.data)
          console.log("error.response?.data?.message)", error.response?.data?.message)
          console.log("Error Response Data.message: ", error.response.data.message)
          console.log("error.response.data.error: ", error.response.data.error)
          console.log("Error Response Data Errors: ", error.response.data.errors)
          console.log("Error Message: ", error.message)
          console.log("Display Error: ", error.response.data.error);
          */
          alert(error.response.data.error + " for " + vendor.location + " - " + vendor.vendor_name);
        });
    },
    async editVendor({ commit }, vendor) {
      console.log("Edit VENDOR/putVendor: ", vendor)
      EventService.putVendor(vendor)
        .then(() => {
          commit("PUT_VENDOR", vendor);
          alert("Vendor was successfully updated.");
        })
        .catch((error) => {
          /*console.log("ERRORS!!!!!!!!!!!@@@@@@@@@@@@@@@")
          console.log("Error Response: ", error.response)
          console.log("Error Response Status: ", error.response.status)
          console.log("Error Response Request: ", error.response.request)
          console.log("Error Response Headers: ", error.response.headers)
          console.log("Error Data: ", error.data)
          console.log("Error Response Data: ", error.response.data)
          console.log("error.response?.data?.message)", error.response?.data?.message)
          console.log("Error Response Data.message: ", error.response.data.message)
          console.log("error.response.data.error: ", error.response.data.error)
          console.log("Error Response Data Errors: ", error.response.data.errors)
          console.log("Error Message: ", error.message)
          console.log("Display Error: ", error.response.data.error);
          */
          alert(error.response.data.error);
        });
    },

    async fetchVendorGroup({ commit }) {
      EventService.getVendorGroup()
        .then((response) => {
          commit("SET_VENDOR_GROUP", response.data);
          console.log("ES FetchVendorGroup response.data: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchVendorLocationsGroup({ commit }) {
      EventService.getVendorLocationsGroup()
        .then((response) => {
          commit("SET_VENDOR_LOCATIONS_GROUP", response.data);
          console.log("ES FetchVendorLocationsGroup response.data: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchVendorProductsGroup({ commit }) {
      EventService.getVendorProductsGroup()
        .then((response) => {
          commit("SET_VENDOR_PRODUCTS_GROUP", response.data);
          console.log("ES FetchVendorProductsGroup response.data: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchVendorProducts({ commit }) {
      EventService.getVendorProducts()
        .then((response) => {
          commit("SET_VENDOR_PRODUCTS", response.data);
          console.log("ES FetchVendorProducts response.data: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async putVendorProducts({ commit }, vendor_products) {
      console.log("STORE - update vendor_products: ", vendor_products)
      // alert("STORE - create product: ", vendor_products)
      EventService.putVendorProducts(vendor_products)
        .then(() => {
          commit("SET_VENDOR_PRODUCTS", vendor_products);
          alert("Vendor Products were successfully Set");
        })
        .catch((error) => {
          alert("Error in putVendorProducts");
          console.log(error);
        });
    },
    async createTrail({ commit }, trail) {
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
    async fetchTrails({ commit }) {
      EventService.getTrails()
        .then((response) => {
          commit("SET_TRAILS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log("STORE ERROR: ", error);
          const message = error.response.request.statusText + '!';
          commit('SET_ERRORS', message)
          router.push({name:'home'})
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
    async fetchTravels({ commit }) {
      EventService.getTravels()
        .then((response) => {
          commit("SET_TRAVELS", response.data);
          console.log("FetchTravels response.data: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
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
    async createUser({ commit }, user) {
      EventService.postUser(user)
        .then(() => {
          commit("ADD_USER", user);
        })
        .catch((error) => {
          alert("Error in postUser of createUser Action (index.js)");
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