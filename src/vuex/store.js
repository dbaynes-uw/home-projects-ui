//import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'
import EventService from '@/services/EventService'
import router from '../router'
import DateFormatService from "@/services/DateFormatService.js";

//Vuex.use(Vuex)
//const localStorage = new Vuex.localStorage({
var api_authenticate_url = "";
export default new Vuex.Store({
  props: ["message"],
  state: {
    id: "",
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
    eventsRequest: [],
    eventsInactive: [],
    eventStatistics: [],
    eventsPastDue: [],
    eventsDueBy: [],
    eventsAssigned: [],
    event: {},
    film: [],
    films: [],
    med: {},
    meds: [],
    plants: [],
    location: {},
    outlets_group: [],
    products: [],
    products_by_location: [],
    shopping_list: [],
    trail: {},
    trails: [],
    travel: [],
    travels: [],
    travel_event: [],
    travel_events: [],
    users: [],
    vendor: {},
    vendors: [],
    vendors_group: [],
    vendors_locations_group: [],
    vendors_products_group: [],
    //plants: [
    //  {author: 'Test Author 1'},
    //  {author: 'Test Author 2'},
    //]  
  },
  data() {
    return {
      //plants: [
      //  {author: 'A1'},
      //  {author: 'A2'},
      //],
    }
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
    SET_EVENTS_REQUEST(state, request) {
      state.eventsRequest = request;
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
    SET_GARDEN(state, garden) {
      state.garden = garden;
    },
    SET_GARDENS(state, gardens) {
      state.gardens = gardens;
    },
    //SET_GARDEN_PLANTS(state, garden_plants) {
    //  state.garden_plants = garden_plants
    //},
    ADD_GARDEN(state, garden) {
      state.gardens.push(garden);
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
    DELETE_OUTLET(state, outlet) {
      state.outlet = outlet;
    },
    SET_OUTLETS_GROUP(state, outlets_group) {
      state.outlets_group = outlets_group;
    },
    DELETE_PLANT(state, plant) {
      state.plant = plant;
    },
    SET_PLANT(state, plant) {
      state.plant = plant;
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
    SET_PRODUCTS_BY_LOCATION(state, products_by_location) {
      state.products_by_location = products_by_location;
    },
    DELETE_VENDOR(state, vendor) {
      state.vendor = vendor;
    },
    DELETE_WATERING(state, watering) {
      state.watering = watering;
    },
    SET_SHOPPING_LIST(state, shopping_list) {
      state.shopping_list = shopping_list;
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
    SET_TRAVEL_EVENT(state, travel_event) {
      state.travel_event = travel_event;
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
      //var user = localStorage.getItem('user')
      //console.log("CLEAR USER DATA - ", user)
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
    SET_WATERING(state, watering) {
      state.watering = watering;
    },
    ADD_OUTLET(state, outlet) {
      state.outlets.push(outlet);
    },
    SET_OUTLET(state, outlet) {
      state.outlet = outlet;
    },
    SET_OUTLET_DETAILS_BY_NAME(state, outlet_details_by_name) {
      state.outlet_details_by_name = outlet_details_by_name;
    },
    DELETE_OUTLET_DETAILS_BY_NAME(state, outlet_details_by_name) {
      state.outlet_details_by_name = outlet_details_by_name;
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
          alert("Registration error: ", error.response.request.statusText)
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
          //alert("Invalid Login Credentials or API problem - Please try again")
          //location.reload()
          //const message = error.response.request.statusText + '!';
          error = error.response.request.statusText + '!';
          //!!!router.back(error)
          error
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
         alert("Invalid Login Credentials or API problem - Please try again for " + email)
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
          //console.log(error);
          alert("Book Post Error: ", error.response.data )
        });
    },
    async updateBook({ commit }, book) {
      EventService.putBook(book)
        .then((response) => {
          commit("SET_BOOK", response.data);
          alert("Book " + book.title + " was Successfully Updated.")
        })
        .catch((error) => {
          //console.log(error);
          alert("Book Put Error for " + book.title + ": " + error.response.request.statusText)
          location.reload();
      });
    },

    async deleteBook({ commit }, book) {
      EventService.deleteBook(book)
        .then((response) => {
          commit("SET_BOOKS", response.data);
        })
        .catch((error) => {
          //console.log(error);
          alert("Book Delete Error: ", error.response.data )
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
            //console.log(error);
            alert("Book Fetch Error: ",error.response.request.statusText )
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
          //console.log(error);
          alert("Books Fetch Error: ", error.response.data )
        });
    },
    async fetchGarden({ commit, state }, id) {
      const existingGarden = state.gardens.find((garden) => garden.id === id);
      if (existingGarden) {
        commit("SET_GARDEN", existingGarden);
      } else {
        EventService.getGarden(id)
          .then((response) => {
            commit("SET_GARDEN", response.data);
          })
          .catch((error) => {
            //console.log(error);
            alert("Garden Fetch Error", error.data)
          });
      }
    },
    //Like Watering / Outlet:
    //async fetchGarden({ commit }, garden) {
    //  EventService.getGarden(garden)
    //    .then((response) => {
    //      commit("SET_GARDEN", response.data);
    //      return response.data;
    //    })
    //    .catch((error) => {
    //      //console.log(error);
    //      alert("Garden Fetch Error: ", error.response.data )        });
    //},

    async fetchGardens({ commit }) {
      //const gardens = [
      //  {garden_name: 'A1'},
      //  {garden_name: 'A2'}
      //]
      EventService.getGardens()
        .then((response) => {
          commit("SET_GARDENS", response.data);
          
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("Gardens Fetch Error: ", error.response.data )
        });
    },
    async createEvent({ commit }, event) {
      EventService.postEvent(event)
        .then(() => {
          commit("ADD_EVENT", event);
          alert("Event was successfully added for " + event.description);
        })
        .catch((error) => {
          alert("Event Post Error for " + event.description + ": " + error.response.request.statusText)
        });
    },
    async fetchEvents({ commit }) {
      EventService.getEvents()
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_EVENTS", response.data);
          commit("SET_EVENTS_REQUEST", '');
          return response.data;
        })
        //.catch((error) => {
        //  const message = error.response.request.statusText + '!';
        //  commit('SET_ERRORS', message)
        //  router.push({name:'home'})
        //});
        .catch((error) => {
          //console.log(error);
          alert("Events Fetch Error: ", error.response.data )
        });
    },
    async deleteEvent({ commit }, event) {
      EventService.deleteEvent(event.id)
        .then((response) => {
          commit("DELETE_EVENT", response.data);
          alert("Event was successfully Deleted for " + event.description);
        })
        .catch((error) => {
          alert("Event Delete Error: " + event.description + " " + error.response.request.statusText)
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
            //console.log(error);
            alert("Event Fetch Error: ", error.response.data )
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
          //console.log(error);
          alert("EventsAssigned Fetch Error: ", error.response.data )
        });
    },
    async eventsDueBy({ commit }, form) {
      EventService.getEventsDueBy(form)
        .then((response) => {
          //const dueBy = response.config.url.split('?')
          //console.log("Response dueBY: ", dueBy[1])
          commit("SET_EVENTS_REQUEST", 'DueBy');
          commit("SET_EVENTS", response.data);
          //const q = response.config.url.split('=')
          //console.log("Reponse + Q: ", response.data + q[1])
          //console.log("Store Response Request responseURL : ", response.request.responseURL)
          //console.log("Store Response Data : ", response.data)
          return response.data;
        })
      .catch((error) => {
        //console.log(error);
        alert("EventsDueBy Get Error: ", error.response.data )
      });
    },
    async eventsLocations({ commit }, form) {
      EventService.getEventsLocations(form)
        .then((response) => {
          //const location = response.config.url.split('?')
          //console.log("Response Location: ", location[1])
          commit("SET_EVENTS_REQUEST", 'Location');
          commit("SET_EVENTS", response.data);
          return response.data;
          })
      .catch((error) => {
        //console.log(error);
        alert("EventsLocations Get Error: ", error.response.data )
      });
    },
    async eventsPastDue({ commit }, dueBy) {
      EventService.getEventsPastDue(dueBy)
        .then((response) => {
      commit("SET_EVENTS", response.data);
      commit("SET_EVENTS_REQUEST", '');
      return response.data;
      })
      .catch((error) => {
        //console.log(error);
        alert("EventsPastDue Get Error: ", error.response.data )
      });
    },
    async eventsInactive({ commit }, inactive) {
      EventService.getEventsInactive(inactive)
        .then((response) => {
      commit("SET_EVENTS", response.data);
      commit("SET_EVENTS_REQUEST", '');
      return response.data;
      })
      .catch((error) => {
        //console.log(error);
        alert("EventsInactive Get Error: ", error.response.data )
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
          //console.log(error);
          alert("EventsStatistics Fetch Error: ", error.response.data )
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
          //console.log(error);
          alert("EventsStatisticsDetail Get Error: ", error.response.data )
        });
    },
    async updateEvent({ commit }, event) {
      EventService.putEvent(event)
        .then((response) => {
          commit("SET_EVENT", response.data);
          alert("Event " + event.description + " was Successfully Updated.")
        })
        .catch((error) => {
          //console.log(error);
          alert("Event Put Error for " + event.description + ": " + error.response.request.statusText)
          location.reload();
        });
    },
    async createFilm({ commit }, film) {
      EventService.postFilm(film)
        .then(() => {
          commit("ADD_FILM", film);
          alert("Film was successfully added for " + film.title);
        })
        .catch((error) => {
          //console.log(error);
          alert("Film Post Error: ", error.response.data )
        });
    },
    async deleteFilm({ commit }, film) {
      EventService.deleteFilm(film)
        .then((response) => {
          commit("DELETE_FILM", response.data);
          alert("Film " + film.title + " was deleted");
        })
        .catch((error) => {
          //console.log(error);
          alert("Film Delete Error: ", error.response.data )
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
            //console.log(error);
            alert("Film Fetch Error: ", error.response.data )
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
          //console.log(error);
          alert("Films Fetch Error: ", error.response.data )
        });
    },
    async updateFilm({ commit }, film) {
      EventService.putFilm(film)
        .then((response) => {
          commit("SET_FILM", response.data);
          alert("Film " + film.title + " was Successfully Updated.")
        })
        .catch((error) => {
          //console.log(error);
          alert("Film Put Error for " + film.title + ": " + error.response.request.statusText)
          location.reload();
      });
    },
    async createGarden({ commit }, garden) {
      EventService.postGarden(garden)
        .then(() => {
          commit("ADD_GARDEN", garden);
          alert("Garden was successfully added for " + garden.garden_name);
        })
        .catch((error) => {
          //console.log(error);
          alert("Garden Post Error: ", error.response.data )
        });
    },
    async updateGarden({ commit }, garden) {
      EventService.putGarden(garden)
        .then((response) => {
          commit("SET_GARDEN", response.data);
          alert("Garden " + garden.garden_name + " was Successfully Updated.")
        })
        .catch((error) => {
          //console.log(error);
          alert("Garden Put Error for " + garden.garden_name + ": " + error.response.request.statusText)
          location.reload();
      });
    },

    async createPlant({ commit }, plant) {
      EventService.postPlant(plant)
        .then(() => {
          commit("SET_PLANT", plant);
          alert("Plant was successfully added for " + plant.plant_name);
        })
        .catch((error) => {
          //console.log(error);
          alert("Plant Post Error: ", error.response.data )
        });
    },

    async createGolf({ commit }, golf) {
      EventService.postGolf(golf)
        .then(() => {
          commit("ADD_GOLF", golf);
          alert("Golf was successfully added for date " + DateFormatService.formatDatejs(golf.date_played));
        })
        .catch((error) => {
          //console.log(error);
          alert("Golf Post Error: ", error.response.data )
        });
    },
    async deleteGolf({ commit }, golf) {
      EventService.deleteGolf(golf)
        .then((response) => {
          commit("DELETE_GOLF", response.data);
          alert("Golf Round at " + golf.course + " on " + golf.date_played + " was deleted.")
        })
        .catch((error) => {
          //console.log(error);
          alert("Golf Delete Error: ", error.response.data )
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
          //console.log(error);
          alert("Golf Get Error: ", error.response.data )
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
          //console.log(error);
          alert("Golf Fetch Error: ", error.response.data )
        });
    },
    async createMed({ commit }, med) {
      EventService.postMed(med)
        .then(() => {
          commit("SET_MEDS", med);
        })
        .catch((error) => {
          //console.log(error);
          alert("Med Create Error: ", error.response.data )
        });
    },

    async deleteMed({ commit }, med) {
      EventService.deleteMed(med)
        .then((response) => {
          commit("SET_MEDS", response.data);
        })
        .catch((error) => {
          //console.log(error);
          alert("Med Delete Error: ", error.response.data )

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
            //console.log(error);
            alert("Med Get Error: ", error.response.data )
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
          //console.log(error);
          alert("Med Fetch Error: ", error.response.data )

        });
    },
    async updateMed({ commit }, med) {
      EventService.putMed(med)
        .then((response) => {
          commit("SET_MED", response.data);
          alert("Med " + med.description + " was Successfully Updated.")
        })
        .catch((error) => {
          //console.log(error);
          alert("Med Put Error: ", error.response.data )
        });
    },

    async createWateringOutlet({ commit }, outlet) {
      EventService.postWateringOutlet(outlet)
        .then(() => {
          commit("SET_OUTLET", outlet);
          alert("Outlet was successfully added for " + outlet.outlet_name);
        })
        .catch((error) => {
          alert("Error in postBook of createOutlet Action (index.js)");
          //console.log(error);
          alert("Med Post Error: ", error.response.data )
        });
    },
    async deleteOutlet({ commit }, outlet) {
      EventService.deleteOutlet(outlet)
        .then((response) => {
          commit("DELETE_OUTLET", response.data);
          alert("Outlet " + outlet.outlet_name + " was deleted");
        })
        .catch((error) => {
          //console.log(error);
          alert("Outlet Delete Error: ", error.response.data )
        });
    },
    async fetchOutlet({ commit }, id) {
        EventService.getOutlet(id)
          .then((response) => {
            commit("SET_OUTLET", response.data);
          })
          .catch((error) => {
            //console.log(error);
            alert("Outlet Fetch Error: ", error.response.data )
          });
      //}
    },
    async fetchOutletDetailsByName({ commit }, outlet_name) {
      EventService.getOutletDetailsByName(outlet_name)
        .then((response) => {
          commit("SET_OUTLET_DETAILS_BY_NAME", response.data);
          return response.data;
        })
        .catch((error) => {
          commit("DELETE_OUTLET_DETAILS_BY_NAME"); 
          //router.push({ name: 'GardenList'});
          //console.log(error);
          alert("Med Fetch Error: ", error.response.data )
        });
    },
    async fetchOutletsGroup({ commit }) {
      EventService.getOutletsGroup()
        .then((response) => {
          commit("SET_OUTLETS_GROUP", response.data);
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("Outlet Fetch Group Error: ", error.response.data )
        });
    },
    async deletePlant({ commit }, plant) {
      EventService.deletePlant(plant)
        .then((response) => {
          commit("DELETE_PLANT", response.data);
          alert("Plant " + plant.plant_name + " was Successfully Deleted");
        })
        .catch((error) => {
          //console.log(error);
          alert("Plant Delete Error: ", error.response.data )
        });
    },
    async fetchPlant({ commit }, plant) {
      EventService.getPlant(plant)
        .then((response) => {
          commit("SET_PLANT", response.data);
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("Plant Fetch Error: ", error.response.data )
        });
    },

    async fetchPlants({ commit }, garden) {
      EventService.getPlants(garden)
        .then((response) => {
          commit("SET_PLANTS", response.data);
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("Plant Fetch Error: ", error.response.data )
        });
    },
    async deleteProduct({ commit }, product) {
      EventService.deleteProduct(product)
        .then((response) => {
          commit("DELETE_PRODUCT", response.data);
          alert("Product " + product.product_name + " was deleted");
        })
        .catch((error) => {
          //console.log(error);
          alert("Product Delete Error: ", error.response.data )
        });
    },
    async fetchProducts({ commit }) {
      EventService.getProducts()
        .then((response) => {
          commit("SET_PRODUCTS", response.data);
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("Product Fetch: ", error.response.data )
        });
    },
    async fetchProductsByLocation({ commit }, products_by_location) {
      EventService.getProductsByLocation(products_by_location)
        .then((response) => {
          // No longer needed:
          //commit("RESET_STATE", response.data);
          commit("SET_PRODUCTS_BY_LOCATION", response.data);
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("Products Get by Location Error: ", error.response.data )
        });
    },
    async fetchShoppingList({ commit }) {
      EventService.getShoppingList()
        .then((response) => {
          commit("SET_SHOPPING_LIST", response.data);
          return response.data;
        })
        .catch((error) => {
          //if (!error.response) {
          //  router.push({name:'About'})
          //}else {
          //  console.log("Store getShoppingList error.response from ES: " + error.response);
          //  router.push({name:'About'})
          //}
          //console.log(error);
          alert("Shopping List Fetch Error: ", error.response.data )
        });
    },
    async updateProduct({ commit }, product) {
      EventService.putProduct(product)
        .then((response) => {
          commit("SET_PRODUCT", response.data);
          alert("Product " + product.product_name + " was Successfully Updated.")
        })
        .catch((error) => {
          //console.log(error);
          alert("Product Put Error for " + product.product_name + ": " + error.response.request.statusText)
          location.reload();
        });
    },

    async putProducts({ commit }, products) {
      EventService.putProducts(products)
        .then(() => {
          commit("SET_PRODUCTS", products);
        })
        .catch((error) => {
          //console.log(error);
          alert("Products Put Error: ", error.response.data )
        });
    },
    async updateProductsVendors({ commit }, products_vendors) {
      EventService.putVendorsProducts(products_vendors)
        .then(() => {
          commit("SET_PRODUCTS_VENDORS", products_vendors);
          alert("Product " + products_vendors.product_name + " was successfully updated")
        })
        .catch((error) => {
          //console.log(error);
          alert("ProductsVendors Put Error: ", error.response.data )
        });
    },
    async createTrail({ commit }, trail) {
      EventService.postTrail(trail)
        .then(() => {
          commit("ADD_TRAIL", trail);
          alert("Trail was successfully added for " + trail.location);
        })
        .catch((error) => {
          //console.log(error);
          alert("Trail Create Error: ", error.response.data )
        });
    },
    async deleteTrail({ commit }, trail) {
      EventService.deleteTrail(trail.id)
        .then((response) => {
          commit("DELETE_TRAIL", response.data);
        })
        .catch((error) => {
          //console.log(error);
          alert("Trail Delete Error: ", error.response.data )
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
            //console.log(error);
            alert("Trail Get Error: ", error.response.data )
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
      EventService.postTravel(travel)
        .then(() => {
          commit("ADD_TRAVEL", travel);
          alert("Travel was successfully added for " + travel.title);
        })
        .catch((error) => {
          //console.log(error);
          alert("Travel Post Error: ", error.response.data )       
        });
    },
    async createTravelEvent({ commit }, travel_event) {
      EventService.postTravelEvent(travel_event)
        .then(() => {
          commit("SET_TRAVEL_EVENT", travel_event);
          alert("Travel Event was successfully added for " + travel_event.title);
        })
        .catch((error) => {
          alert("Error in postTravelEvent of createTravelEvent Action (index.js)");
          //console.log(error);
          alert("Travel Event Post Error: ", error.response.data )
        });
    },

    async deleteTravel({ commit }, travel) {
      EventService.destroyTravel(travel.id)
        .then((response) => {
          commit("DELETE_TRAVEL", response.data);
        })
        .catch((error) => {
          //console.log(error);
          alert("Travel Delete Error: ", error.response.data )
        });
    },
    async fetchTravel({ commit, state }, id) {
      const existingTravel = state.travels.find((travel) => travel.id === id);
      if (existingTravel) {
        commit("SET_Travel", existingTravel);
      } else {
        EventService.getTravel(id)
          .then((response) => {
            commit("SET_TRAVEL", response.data);
          })
          .catch((error) => {
            //console.log(error);
            alert("Travel Fetch Error: ", error.response.data )
          });
      }
    },
    async fetchTravelEvent({ commit, state }, id) {
      const existingTravelEvent = state.travels.find((travel_event) => travel_event.id === id);
      if (existingTravelEvent) {
        commit("SET_TRAVEL_EVENT", existingTravelEvent);
      } else {
        EventService.getTravelEvent(id)
          .then((response) => {
            commit("SET_TRAVEL_EVENT", response.data);
          })
          .catch((error) => {
            //console.log(error);
            alert("Travel Fetch Error: ", error.response.data )
          });
      }
    },
    async fetchTravels({ commit }) {
      EventService.getTravels()
        .then((response) => {
          commit("SET_TRAVELS", response.data);
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("Travels Fetch Error: ", error.response.data )
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
          //console.log(error);
          alert("Travel Put Error: ", error.response.data )
        });
    },
    async updateTravelEvent({ commit }, travel_event) {
      EventService.putTravelEvent(travel_event)
        .then((response) => {
          commit("SET_TRAVEL_EVENT", response.data);
          alert("Travel Event was successfully Updated for " + travel_event.title);
          location.reload();
        })
        .catch((error) => {
          //console.log(error);
          alert("Travel Event Put Error: ", error.response.data )
        });
    },
    async createUser({ commit }, user) {
      EventService.postUser(user)
        .then(() => {
          commit("ADD_USER", user);
        })
        .catch((error) => {
          //console.log(error);
          alert("User Post Error: ", error.response.data )
        });
    },
    async deleteUser({ commit }, user) {
      EventService.deleteUser(user.id)
        .then((response) => {
          commit("DELETE_USER", response.data);
        })
        .catch((error) => {
          //console.log(error);
          alert("User Delete Error: ", error.response.data )
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
            //console.log(error);
            alert("User Fetch Error: ", error.response.data )
          });
      }
    },
    //Could fetch user to get username
    async fetchUsers({ commit }) {
      EventService.getUsers()
        .then((response) => {
          commit("SET_USERS", response.data);
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("Users Fetch Error: ", error.response.data )
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
          //console.log(error);
          alert("Users Put Error: ", error.response.data )
        });
    },
    async createVendor({ commit }, vendor) {
      EventService.postVendor(vendor)
        .then(() => {
          commit("PUT_VENDOR", vendor);
          router.push({name:'ProductsByLocations'})
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
          alert("Vendor Create Error: " + error.response.data.error + " for " + vendor.location + " - " + vendor.vendor_name);
        });
    },
    async deleteVendor({ commit }, vendor) {
      EventService.deleteVendor(vendor)
        .then((response) => {
          commit("DELETE_VENDOR", response.data);
          alert("Vendor " + vendor.title + " was deleted");
        })
        .catch((error) => {
          //console.log(error);
          alert("Vendor Delete Error: ", error.response.data )
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
          //console.log(error);
          alert("Vendors Fetch Error: ", error.response.data )
        });
    },
    async fetchVendorsGroup({ commit }) {
      EventService.getVendorsGroup()
        .then((response) => {
          commit("SET_VENDORS_GROUP", response.data);
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("VendorsGroup Fetch Error: ", error.response.data )
        });
    },
    async fetchVendorsLocationsGroup({ commit }) {
      EventService.getVendorsLocationsGroup()
        .then((response) => {
          commit("SET_VENDORS_LOCATIONS_GROUP", response.data);
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("VendorsLocationsGroup Get Error: ", error.response.data )
        });
    },
    async fetchVendorsProductsGroup({ commit }) {
      EventService.getVendorsProductsGroup()
        .then((response) => {
          commit("SET_VENDORS_PRODUCTS_GROUP", response.data);
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("VendorsProductsGroup Fetch Error: ", error.response.data )
        });
    },
    async fetchVendorsProducts({ commit }) {
      EventService.getVendorsProducts()
        .then((response) => {
          commit("SET_VENDORS_PRODUCTS", response.data);
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("VendorsProducts Fetch Error: ", error.response.data )
        });
    },
    async updateVendorsProducts({ commit }, vendors_products) {
      EventService.putVendorsProducts(vendors_products)
        .then(() => {
          commit("SET_VENDORS_PRODUCTS", vendors_products);
        })
        .catch((error) => {
          //console.log(error);
          alert("VendorsProducts Put Error: ", error.response.data )
        });
    },
    async createWatering({ commit }, watering) {
      EventService.postWatering(watering)
        .then(() => {
          commit("SET_WATERING", watering);
          alert("Watering was successfully added for " + watering.watering_name);
        })
        .catch((error) => {
          //console.log(error);
          alert("Watering Create Error: ", error.response.data )
        });
    },
    async deleteWatering({ commit }, watering) {
      EventService.deleteWatering(watering)
        .then((response) => {
          commit("DELETE_WATERING", response.data);
          alert("Watering " + watering.title + " was deleted");
        })
        .catch((error) => {
          //console.log(error);
          alert("Watering Delete Error: ", error.response.data )
        });
    },

    async fetchWatering({ commit }, watering) {
      EventService.getWatering(watering)
        .then((response) => {
          commit("SET_WATERING", response.data);
          return response.data;
        })
        .catch((error) => {
          //console.log(error);
          alert("Watering Fetch Error: ", error.response.data )        });
    },
  },
  getters: {
    loggedIn (state) {
      return !!state.user
    },
    loggedOut () {
      //console.log("Getters: loggedOut state:")
      //return state.user == null
    }
  },
})