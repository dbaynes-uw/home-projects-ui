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
    book: [],
    books: [],
    events: [],
    eventStatistics: [],
    eventsPastDue: [],
    eventsDueBy: [],
    eventsAssigned: [],
    event: {},
    location: {},
    med: {},
    meds: [],
    products: [],
    shopping_list: [],
    trail: {},
    trails: [],
    travels: [],
    users: [],
    vendor: {},
    vendors: [],
    vendors_group: [],
    vendors_locations_group: [],
    vendors_products_group: [],  
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
    ADD_FILM(state, film) {
      state.films.push(film);
    },
    DELETE_FILM(state, film) {
      state.film = film;
    },
    SET_FILM(state, film) {
      state.film = film;
    },
    SET_FILMS(state, films) {
      state.films = films;
    },
    ADD_GOLF(state, golf) {
      state.golfs.push(golf);
    },
    DELETE_GOLF(state, golf) {
      state.golf = golf;
    },
    SET_GOLF(state, golf) {
      state.golf = golf;
    },
    SET_GOLFS(state, golfs) {
      state.golfs = golfs;
    },
    ADD_MED(state, med) {
      state.meds.push(med);
    },
    DELETE_MED(state, med) {
      state.med = med;
    },
    SET_MED(state, med) {
      state.med = med;
    },
    SET_MEDS(state, meds) {
      state.meds = meds;
    },
    DELETE_PRODUCT(state, product) {
      state.product = product;
    },    
    SET_PRODUCT(state, product) {
      state.product = product;
    },
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    SET_LOCATION_PRODUCTS(state, location_products_list) {
      state.location_products_list = location_products_list;
    },
    SET_SHOPPING_LIST(state, shopping_list) {
      state.shopping_list = shopping_list;
    },
    DELETE_VENDOR(state, vendor) {
      state.vendor = vendor;
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
      console.log("CLEAR USER DATA - ", user)
      localStorage.removeItem('user')
      axios.defaults.headers.common['Authorization'] = null
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_VENDORS(state, vendors) {
      state.vendors = vendors;
    },
    SET_VENDORS_PRODUCTS(state, vendors_products) {
      state.vendors_products = vendors_products;
    },
    SET_VENDORS_GROUP(state, vendors_group) {
      state.vendors_group = vendors_group;
    },
    SET_VENDORS_LOCATIONS_GROUP(state, vendors_locations_group) {
      state.vendors_locations_group = vendors_locations_group;
    },
    SET_VENDORS_PRODUCTS_GROUP(state, vendors_products_group) {
      state.vendors_products_group = vendors_products_group;
    },
    ADD_VENDOR(state, vendor) {
      state.vendors.push(vendor);
    },
    PUT_VENDOR(state, vendor) {
      state.vendors.push(vendor);
    },
    SET_ERRORS(state, errors) {
      state.errors = errors
    },
  },
  actions: {
    async register ({ commit }, credentials) {
      //this.init_authentication;
      if (window.location.port == "8080") {
        //api_url = "http://davids-macbook-pro.local:3000/api/v1/";
        api_authenticate_url = "//localhost:3000/api/v1/users/";
      } else {
        api_authenticate_url =
          "//peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/users/";
      }
      this.message = null
      // Comment ADMIN baynes check to register user.
      // Send New User link to site at Reset Password

      //if ( credentials.email.toLowerCase().includes('baynes')) {
      return axios
        .post(api_authenticate_url, credentials)
        .then(({ data }) => {
          this.message = data.name + " - You have Successfully Registered."
          commit('ADD_USER', data)
        })
        .catch((error) => {
          this.$store.state.errors = null
          if (this.message == null) {
            error = error.response.request.statusText + '!';
          } else {
            error = this.message
          }
          console.log("Message to be sent: ", error)
          router.push({name:'home', params: {message: this.message}})
        });
    },
    async login ({ commit }, credentials) {
      if (window.location.port == "8080") {
        //api_url = "http://davids-macbook-pro.local:3000/...";
        api_authenticate_url = "//localhost:3000/users/tokens/";
      } else {
        api_authenticate_url =
          "//peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/users/tokens/";
      }
      //this.init_authentication;
      return axios
        .post(api_authenticate_url + "sign_in", credentials)
        .then(({ data }) => {
          commit('SET_USER_DATA', data)
        })
        .catch((error) => {
          alert("Invalid Login Credentials or API problem - Please try again")
          //location.reload()
          //const message = error.response.request.statusText + '!';
          error = error.response.request.statusText + '!';
          router.back(error)
        });
    },

    async logout ({ commit }) {
      commit('CLEAR_USER_DATA')
      router.push({name: 'Login'});
    },

    async forgotPassword ({ commit }, email) {
      if (window.location.port == "8080") {
        //api_url = "http://davids-macbook-pro.local:3000/...";
        api_authenticate_url = "//localhost:3000/api/v1/password_resets/"
      } else {
        api_authenticate_url =
          "//peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/password_resets";
      }
      //this.init_authentication;
      return axios
        .post(api_authenticate_url, { email: email })
        //.post(api_authenticate_url, user )
        .then(({ data }) => {
         commit('SET_USER_DATA', data)
       })
       .catch((error) => {
         alert("Invalid Login Credentials or API problem - Please try again")
         //location.reload()
         //const message = error.response.request.statusText + '!';
         error = error.response.request.statusText + '!';
         router.back(error)
       });
    },
    async resetPassword ({ commit }, email) {
      console.log("ForgetPassword user: ", email)
      if (window.location.port == "8080") {
        //api_url = "http://davids-macbook-pro.local:3000/...";
        api_authenticate_url = "//localhost:3000/api/v1/password_resets/"
      } else {
        api_authenticate_url =
          "//peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/users/password/";
      }
      //this.init_authentication;
      return axios
        .patch(`api_authenticate_url + /${this.$route.params.token}`, { password: this.password, password_confirmation: this.password_confirmation })
        //.post(api_authenticate_url, user )
        .then(({ data }) => {
         commit('SET_USER_DATA', data)
       })
       .catch((error) => {
         alert("Invalid Login Credentials or API problem - Please try again")
         //location.reload()
         //const message = error.response.request.statusText + '!';
         error = error.response.request.statusText + '!';
         router.back(error)
       });
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
    async deleteBook({ commit }, book) {
      EventService.deleteBook(book)
        .then((response) => {
          commit("DELETE_BOOK", response.data);
          alert("Book " + book.title + " was deleted");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchBook({ commit, state }, id) {
      const existingBook = state.books.find((book) => book.id === id);
      if (existingBook) {
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
          return response.data;
        })
        .catch((error) => {
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
    async fetchEvents({ commit }) {
      EventService.getEvents()
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_EVENTS", response.data);
          return response.data;
        })
        //.catch((error) => {
        //  const message = error.response.request.statusText + '!';
        //  commit('SET_ERRORS', message)
        //  router.push({name:'home'})
        //});
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteEvent({ commit }, event) {
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
      EventService.getEventsAssigned(assigned)
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_EVENT_STATISTICS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async eventsDueBy({ commit }, form) {
      console.log("STORE@@@")
      EventService.getEventsDueBy(form)
        .then((response) => {
      commit("SET_EVENTS", response.data);
      return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    async eventsPastDue({ commit }, dueBy) {
      console.log("STORE@@@")
      EventService.getEventsPastDue(dueBy)
        .then((response) => {
      commit("SET_EVENTS", response.data);
      return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    async fetchEventStatistics({ commit }) {
      EventService.getEventStatistics()
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_EVENT_STATISTICS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchEventStatisticDetail({ commit }, eventStatisticDetail) {
      EventService.getEventStatisticDetail(eventStatisticDetail)
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_EVENT_STATISTIC_DETAIL", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async updateEvent({ commit }, event) {
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
    async createFilm({ commit }, film) {
      EventService.postFilm(film)
        .then(() => {
          commit("ADD_FILM", film);
          alert("Film was successfully added for " + film.title);
        })
        .catch((error) => {
          alert("Error in postFilm of createFilm Action (index.js)");
          console.log(error);
        });
    },
    async deleteFilm({ commit }, film) {
      EventService.deleteFilm(film)
        .then((response) => {
          commit("DELETE_FILM", response.data);
          alert("Film " + film.title + " was deleted");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchFilm({ commit, state }, id) {
      const existingFilm = state.films.find((film) => film.id === id);
      if (existingFilm) {
        commit("SET_FILM", existingFilm);
      } else {
        EventService.getFilm(id)
          .then((response) => {
            commit("SET_FILM", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async fetchFilms({ commit }) {
      EventService.getFilms()
        .then((response) => {
          commit("SET_FILMS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async createGolf({ commit }, golf) {
      EventService.postGolf(golf)
        .then(() => {
          commit("ADD_GOLF", golf);
          alert("Golf was successfully added for " + golf.course);
        })
        .catch((error) => {
          alert("Error in postGolf of createGolf Action (index.js)");
          console.log(error);
        });
    },
    async deleteGolf({ commit }, golf) {
      EventService.deleteGolf(golf)
        .then((response) => {
          commit("DELETE_GOLF", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchGolf({ commit, state }, id) {
      const existingGolf = state.golfs.find((golf) => golf.id === id);
      if (existingGolf) {
        commit("SET_GOLF", existingGolf);
      } else {
        EventService.getGolf(id)
          .then((response) => {
            commit("SET_GOLF", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async fetchGolfs({ commit }) {
      EventService.getGolfs()
        .then((response) => {
          commit("SET_GOLFS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async createMed({ commit }, med) {
      EventService.postMed(med)
        .then(() => {
          commit("ADD_MED", med);
          alert("Med was successfully added for " + med.date_of_occurrence);
        })
        .catch((error) => {
          alert("Error in postMed of createMed Action (index.js)");
          console.log(error);
        });
    },

    async deleteMed({ commit }, med) {
      EventService.deleteMed(med)
        .then((response) => {
          commit("DELETE_MED", response.data);
          alert("Med " + med.date_of_occurrence + " was deleted");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchMed({ commit, state }, id) {
      const existingMed = state.meds.find((med) => med.id === id);
      if (existingMed) {
        commit("SET_MED", existingMed);
      } else {
        EventService.getMed(id)
          .then((response) => {
            commit("SET_MED", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async fetchMeds({ commit }) {
      EventService.getMeds()
        .then((response) => {
          commit("SET_MEDS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteProduct({ commit }, product) {
      EventService.deleteProduct(product)
        .then((response) => {
          commit("DELETE_PRODUCT", response.data);
          alert("Product " + product.product_name + " was deleted");
        })
        .catch((error) => {
          console.log(error);
        });
    },


    async fetchProducts({ commit }) {
      EventService.getProducts()
        .then((response) => {
          commit("SET_PRODUCTS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          alert("Store getProducts Error from ES: " + error.response.data.error);
        });
    },
    async fetchLocationProducts({ commit }, location) {
      console.log("ES - Location: ", location )
      EventService.getLocationProducts(location)
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_LOCATION_PRODUCTS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchShoppingList({ commit }) {
      EventService.getShoppingList()
        .then((response) => {
          commit("SET_SHOPPING_LIST", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          if (!error.response) {
            alert("API Error - No data returned from Store getShoppingList")
            router.push({name:'About'})
          }else {
            alert("Store getShoppingList Error from ES: " + error.response.data.error);
            router.push({name:'About'})
          }
        });
    },
    async putProducts({ commit }, products) {
      EventService.putProducts(products)
        .then(() => {
          console.log("STORE - update products: ")
          commit("SET_PRODUCTS", products);
        })
        .catch((error) => {
          alert("Error in putProducts");
          console.log(error);
        });
    },
    async putProductsVendors({ commit }, products_vendors) {
      EventService.putVendorsProducts(products_vendors)
        .then(() => {
          console.log("STORE - update products_vendors: ")
          commit("SET_PRODUCTS_VENDORS", products_vendors);
        })
        .catch((error) => {
          alert("Error in putProductsVendors");
          console.log(error);
        });
    },
    async createVendor({ commit }, vendor) {
      EventService.postVendor(vendor)
        .then(() => {
          commit("PUT_VENDOR", vendor);
          console.log("Vendor was successfully updated for " + vendor.location + " - " + vendor.vendor_name);
        })
        .catch((error) => {
          //console.log("Error Response: ", error.response)
          //console.log("Error Response Status: ", error.response.status)
          //console.log("Error Response Request: ", error.response.request)
          //console.log("Error Response Headers: ", error.response.headers)
          //console.log("Error Response Data.message: ", error.response.data.message)
          //console.log("error.response.data.error: ", error.response.data.error)
          //console.log("Error Response Data Errors: ", error.response.data.errors)
          //console.log("Error Message: ", error.message)
          //console.log("Display Error: ", error.response.data.error);
          alert("Store: " + error.response.data.error + " for " + vendor.location + " - " + vendor.vendor_name);
        });
    },
    async deleteVendor({ commit }, vendor) {
      EventService.deleteVendor(vendor)
        .then((response) => {
          commit("DELETE_VENDOR", response.data);
          alert("Vendor " + vendor.title + " was deleted");
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async editVendor({ commit }, vendor) {
      EventService.putVendor(vendor)
        .then(() => {
          commit("PUT_VENDOR", vendor);
          alert("Vendor was successfully updated.");
        })
        .catch((error) => {
          alert(error.response.data.error);
        });
    },
    async fetchVendors({ commit }) {
      EventService.getVendors()
        .then((response) => {
          commit("SET_VENDORS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          alert("Store getVendors Error from ES: " + error.response.data.error);
          alert("Store getVendors Error: " + error);
        });
    },
    async fetchVendorsGroup({ commit }) {
      EventService.getVendorsGroup()
        .then((response) => {
          commit("SET_VENDORS_GROUP", response.data);
          console.log("ES FetchVendorsGroup response.data: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchVendorsLocationsGroup({ commit }) {
      EventService.getVendorsLocationsGroup()
        .then((response) => {
          commit("SET_VENDORS_LOCATIONS_GROUP", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          return;
        });
    },
    async fetchVendorsProductsGroup({ commit }) {
      EventService.getVendorsProductsGroup()
        .then((response) => {
          commit("SET_VENDORS_PRODUCTS_GROUP", response.data);
          console.log("ES FetchVendorsProductsGroup response.data: ", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          router.push({name:'home'})
        });
    },
    async fetchVendorsProducts({ commit }) {
      EventService.getVendorsProducts()
        .then((response) => {
          commit("SET_VENDORS_PRODUCTS", response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          alert("API Error - Store getVendorsProducts Error from ES: ", error);
        });
    },
    async putVendorsProducts({ commit }, vendors_products) {
      console.log("STORE - update vendors_products: ")
      EventService.putVendorsProducts(vendors_products)
        .then(() => {
          console.log("STORE - update vendors_products: ")
          commit("SET_VENDORS_PRODUCTS", vendors_products);
        })
        .catch((error) => {
          alert("Error in putVendorsProducts");
          console.log(error);
        });
    },
    async createTrail({ commit }, trail) {
      EventService.postTrail(trail)
        .then(() => {
          commit("ADD_TRAIL", trail);
          alert("Trail was successfully added for " + trail.location);
        })
        .catch((error) => {
          alert("Error in postTrail of createTrail Action (index.js)");
          console.log(error);
        });
    },
    async deleteTrail({ commit }, trail) {
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
      EventService.deleteUser(user.id)
        .then((response) => {
          commit("DELETE_USER", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchUser({ commit, state }, id) {
      const existingUser = state.users.find((user) => user.id === id);
      if (existingUser) {
        commit("SET_USER_DATA", existingUser);
      } else {
        EventService.getUser(id)
          .then((response) => {
            commit("SET_USER_DATA", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    //Could fetch user to get username
    async fetchUsers({ commit }) {
      EventService.getUsers()
        .then((response) => {
          console.log("ES Users Response: ", response)
          commit("SET_USERS", response.data);
          return response.data;
        })
        .catch((error) => {
          //!const message = error.response.data.error.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function(key) { return key.toUpperCase()}) + '!';
          const message = error.response.request.statusText + '!';
          commit('SET_ERRORS', message)
          //Xrouter.push({name:'home', params:{message}})
          router.push({name:'home'})
          //router.back()
        });
    },
    async updateUser({ commit }, user) {
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