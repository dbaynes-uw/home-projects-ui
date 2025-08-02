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
    garden: [],
    gardens: [],
    glucoseReadings: [],
    glucoseReading: null,
    watering: [],
    waterings: [],
    med: {},
    meds: [],
    plant: {},
    plants: [],
    location: {},
    outlets_display_group: [],
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
    ADD_GLUCOSE_READING(state, reading) {
      //state.glucoseReadings.push(reading);
      // Optionally update the glucoseResult if needed
      state.glucoseResult = reading;
    },
    DELETE_GLUCOSE_READING(state, reading) {
      state.glucoseReadings = state.glucoseReadings.filter(r => r.id !== reading.id);
    },
    SET_GLUCOSE_READINGS(state, readings) {
      state.glucoseReadings = readings; // Ensure state is updated correctly
    },
    SET_GLUCOSE_READING(state, reading) {
      state.glucoseReading = reading;
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
    SET_OUTLETS_DISPLAY_GROUP(state, outlets_display_group) {
      state.outlets_display_group = outlets_display_group;
    },
    SET_OUTLETS_HASH(state, outlets_hash) {
      state.outlets_hash = outlets_hash;
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
    DELETE_TRAVEL_EVENT(state, travel_event) {
      state.travel_event = travel_event;
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
    SET_TRAVEL_EVENTS(state, travel_events) {
      state.travel_events = travel_events;
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
    SET_WATERINGS(state, waterings) {
      state.waterings = waterings;
    },
    SET_GARDEN_WATERINGS(state, garden_waterings) {
      state.garden_waterings = garden_waterings;
    },
    ADD_WATERING(state, watering) {
      state.waterings.push(watering);
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
            alert("Book Fetch Error: ",error.response.request.statusText )
          });
      }
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
    //      alert("Garden Fetch Error: ", error.response.data )        });
    //},

    async fetchGardens({ commit }) {
      try {
        const response = await EventService.getGardens();
        commit("SET_GARDENS", response.data);
      } catch (error) {
        console.error("Error fetching gardens`:", error);
      }
    },
    /*
    async fetchGlucoseReadings({ commit }) {
      try {
        const response = await EventService.getGlucoseReadings();
        commit("SET_GLUCOSE_READINGS", response.data);
      } catch (error) {
        console.error("Error fetching glucose readings:", error);
      }
    },
    */
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
          alert("EventsAssigned Fetch Error: ", error.response.data )
        });
    },
    async eventsDueBy({ commit }, form) {
      EventService.getEventsDueBy(form)
        .then((response) => {
          //const dueBy = response.config.url.split('?')
          commit("SET_EVENTS_REQUEST", 'DueBy');
          commit("SET_EVENTS", response.data);
          //const q = response.config.url.split('=')
          //console.log("Reponse + Q: ", response.data + q[1])
          //console.log("Store Response Request responseURL : ", response.request.responseURL)
          //console.log("Store Response Data : ", response.data)
          return response.data;
        })
      .catch((error) => {
        alert("EventsDueBy Get Error: ", error.response.data )
      });
    },
    async eventsLocations({ commit }, form) {
      EventService.getEventsLocations(form)
        .then((response) => {
          //const location = response.config.url.split('?')
          commit("SET_EVENTS_REQUEST", 'Location');
          commit("SET_EVENTS", response.data);
          return response.data;
          })
      .catch((error) => {
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
          alert("Film Put Error for " + film.title + ": " + error.response.request.statusText)
          location.reload();
      });
    },
    async createGarden({ commit }, garden) {
      EventService.postGarden(garden)
        .then(() => {
          commit("ADD_GARDEN", garden);
          alert("Garden was successfully added for " + garden.name);
        })
        .catch((error) => {
          alert("Garden Post Error: ", error.response.data )
        });
    },
    async updateGarden({ commit }, garden) {
      EventService.putGarden(garden)
        .then((response) => {
          commit("SET_GARDEN", response.data);
          alert("Garden " + garden.name + " was Successfully Updated.")
        })
        .catch((error) => {
          alert("Garden Put Error for " + garden.name + ": " + error.response.request.statusText)
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
          alert("Plant Post Error: ", error.response.data )
        });
    },
    async updatePlant({ commit }, plant) {
      EventService.putPlant(plant)
        .then((response) => {
          commit("SET_PLANT", response.data);
          alert("Plant was successfully Updated for " + plant.plant_name);
          location.reload();
        })
        .catch((error) => {
          alert("Plant Put Error: ", error.response.data )
        });
    },
    async updateWatering({ commit }, watering) {
      EventService.putWatering(watering)
        .then((response) => {
          commit("SET_WATERING", response.data);
          alert("Watering " + watering.name + " was Successfully Updated.")
        })
        .catch((error) => {
          alert("Watering Put Error for " + watering.name + ": " + error.response.request.statusText)
          location.reload();
      });
    },
    async fetchGlucoseReadings({ commit }) {
      try {
        const response = await EventService.getGlucoseReadings();
        commit("SET_GLUCOSE_READINGS", response.data);
      } catch (error) {
        console.error("Error fetching glucose readings:", error);
      }
    },
    async fetchGlucoseReading({ commit }, id) {
      try {
        const response = await EventService.getGlucoseReading(id); // Call the API
        commit("SET_GLUCOSE_READING", response.data); // Commit the data to the state
      } catch (error) {
        console.error("Error fetching glucose reading: ");
        alert("Failed to fetch glucose reading. Please try again.");
      }
    },
    async createGlucoseReading({ commit, dispatch }, glucose_reading) {
      try {
        const response = await EventService.postGlucoseReading(glucose_reading);    
        // Commit the new reading to Vuex state
        commit("ADD_GLUCOSE_READING", response.data);
        // Optionally fetch the updated list of readings
        await dispatch("fetchGlucoseReadings");
      } catch (error) {
        console.error("Error creating glucose reading:", error.response.data);
        alert("Failed to create glucose reading. Please try again.");
      }
    },    
    async deleteGlucoseReading({ commit }, glucose_reading) {
      console.log("Deleting glucose reading with ID:", glucose_reading.id);
      try {
        await EventService.deleteGlucoseReading(glucose_reading);
        commit("DELETE_GLUCOSE_READING", glucose_reading); // <-- Pass the original reading!
        alert("Glucose Reading " + glucose_reading.reading + " was deleted.");
      } catch (error) {
        alert("GlucoseReading Delete Error: " + (error.response?.data || error.message));
      }
    },
    async updateGlucoseReading({ commit, dispatch }, glucose_reading) {
      try {
        const response = await EventService.putGlucoseReading(glucose_reading);   
        // Commit the new reading to Vuex state
        commit("SET_GLUCOSE_READING", response.data);
        // Optionally fetch the updated list of readings
        await dispatch("fetchGlucoseReadings");
      } catch (error) {
        console.error("Error creating glucose reading:", error.response.data);
        alert("Failed to create glucose reading. Please try again.");
      }
    },

    async createGolf({ commit }, golf) {
      EventService.postGolf(golf)
        .then(() => {
          commit("ADD_GOLF", golf);
          alert("Golf was successfully added for date " + DateFormatService.formatDatejs(golf.date_played));
        })
        .catch((error) => {
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
          alert("Golf Fetch Error: ", error.response.data )
        });
    },
    async createMed({ commit }, med) {
      EventService.postMed(med)
        .then(() => {
          commit("SET_MEDS", med);
        })
        .catch((error) => {
          alert("Med Create Error: ", error.response.data )
        });
    },

    async deleteMed({ commit }, med) {
      EventService.deleteMed(med)
        .then((response) => {
          commit("SET_MEDS", response.data);
        })
        .catch((error) => {
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
          alert("Watering Outlet Post Error: ", error.response.data )
        });
    },
    async updateOutlet({ commit }, outlet) {
      EventService.putOutlet(outlet)
        .then((response) => {
          commit("SET_OUTLET", response.data);
          alert("Outlet was successfully Updated for " + outlet.outlet_name);
          location.reload();
        })
        .catch((error) => {
          alert("Outlet Put Error: ", error.response.data )
        });
    },

    async deleteOutlet({ commit }, outlet) {
      EventService.deleteOutlet(outlet)
        .then((response) => {
          commit("DELETE_OUTLET", response.data);
          alert("Outlet " + outlet.outlet_name + " was deleted");
        })
        .catch((error) => {
          alert("Outlet Delete Error: ", error.response.data )
        });
    },
    async fetchOutlet({ commit }, id) {
        EventService.getOutlet(id)
          .then((response) => {
            commit("SET_OUTLET", response.data);
          })
          .catch((error) => {
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
          alert("Med Fetch Error: ", error.response.data )
        });
    },
    async fetchOutletsDisplayGroup({ commit }) {
      EventService.getOutletsDisplayGroup()
        .then((response) => {
          commit("SET_OUTLETS_DISPLAY_GROUP", response.data);
          return response.data;
        })
        .catch((error) => {
          alert("Outlet Fetch Group Error: ", error.response.data )
        });
    },
    async fetchOutletsHash({ commit }) {
      EventService.getOutletsHash()
        .then((response) => {
          commit("SET_OUTLETS_HASH", response.data);
          return response.data;
        })
        .catch((error) => {
          alert("Outlet Fetch Hash Error: ", error.response.data )
        });
    },
    async deletePlant({ commit }, plant) {
      EventService.deletePlant(plant)
        .then((response) => {
          commit("DELETE_PLANT", response.data);
          alert("Plant " + plant.plant_name + " was Successfully Deleted");
        })
        .catch((error) => {
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
          //  router.push({name:'About'})
          //}
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
          alert("Trail Create Error: ", error.response.data )
        });
    },
    async deleteTrail({ commit }, trail) {
      EventService.deleteTrail(trail.id)
        .then((response) => {
          commit("DELETE_TRAIL", response.data);
        })
        .catch((error) => {
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
          alert("Travel Event Post Error: ", error.response.data )
        });
    },

    async deleteTravel({ commit }, travel) {
      EventService.destroyTravel(travel.id)
        .then((response) => {
          commit("DELETE_TRAVEL", response.data);
        })
        .catch((error) => {
          alert("Travel Delete Error: ", error.response.data )
        });
    },
    async deleteTravelEvent({ commit }, travel_event) {
      EventService.destroyTravelEvent(travel_event.id)
        .then((response) => {
          commit("DELETE_TRAVEL_EVENT", response.data);
        })
        .catch((error) => {
          alert("Travel Event Delete Error: ", error.response.data )
        });
    },

    async fetchTravel({ commit, state }, id) {
      const existingTravel = state.travels.find((travel) => travel.id === id);
      if (existingTravel) {
        commit("SET_TRAVEL", existingTravel);
      } else {
        EventService.getTravel(id)
          .then((response) => {
            commit("SET_TRAVEL", response.data);
          })
          .catch((error) => {
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
          alert("Travels Fetch Error: ", error.response.data )
        });
    },
    async fetchTravelEvents({ commit }) {
      EventService.getTravelEvents()
        .then((response) => {
          commit("SET_TRAVEL_EVENTS", response.data);
          return response.data;
        })
        .catch((error) => {
          alert("Travel Events Fetch Error: ", error.response.data )
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
          alert("Travel Event Put Error: ", error.response.data )
        });
    },
    async createUser({ commit }, user) {
      EventService.postUser(user)
        .then(() => {
          commit("ADD_USER", user);
        })
        .catch((error) => {
          alert("User Post Error: ", error.response.data )
        });
    },
    async deleteUser({ commit }, user) {
      EventService.deleteUser(user.id)
        .then((response) => {
          commit("DELETE_USER", response.data);
        })
        .catch((error) => {
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
          //.log(error);
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
          //.log(error);
          alert("VendorsProducts Fetch Error: ", error.response.data )
        });
    },
    async updateVendorsProducts({ commit }, vendors_products) {
      EventService.putVendorsProducts(vendors_products)
        .then(() => {
          commit("SET_VENDORS_PRODUCTS", vendors_products);
        })
        .catch((error) => {
          //.log(error);
          alert("VendorsProducts Put Error: ", error.response.data )
        });
    },
    async createWatering({ commit }, watering) {
      EventService.postWatering(watering)
        .then(() => {
          commit("SET_WATERING", watering);
          alert("Watering was successfully added for " + watering.name);
        })
        .catch((error) => {
          alert("Watering Create Error: ", error.response.data )
        });
    },
    async deleteWatering({ commit }, watering) {
      EventService.deleteWatering(watering)
        .then((response) => {
          commit("DELETE_WATERING", response.data);
          alert("Watering " + watering.name + " was deleted");
        })
        .catch((error) => {
          alert("Watering Delete Error: ", error.response.data )
        });
    },

    async fetchWatering({ commit, state }, id) {
      const existingWatering = state.waterings.find((watering) => watering.id === id);
      if (existingWatering) {
        commit("SET_WATERING", existingWatering);
      } else {
        EventService.getWatering(id)
          .then((response) => {
            commit("SET_WATERING", response.data);
            return response.data;
          })
          .catch((error) => {
            alert("Watering Fetch Error", error.data)
          });
      }
    },

    async fetchWaterings({ commit }) {
      EventService.getWaterings()
        .then((response) => {
          commit("SET_WATERINGS", response.data);
          return response.data;
        })
        .catch((error) => {
          alert("Waterings Fetch Error: ", error.response.data )
        });
    },
    async fetchGardenWaterings({ commit }, garden_id) {
      EventService.getGardenWaterings(garden_id)
        .then((response) => {
          commit("SET_GARDEN_WATERINGS", response.data); 
          return response.data;
        })
        .catch((error) => {
          alert("Garden Waterings Fetch Error: ", error.response.data )
        });
      }
    },
  getters: {
    gardens(state) {
      return state.gardens || []; // Ensure it always returns an array
    },
    glucoseReadings(state) {
      return state.glucoseReadings || []; // Ensure it always returns an array
    },
    numberOfBooks(state) {
      return state.books.length
    },
    loggedIn (state) {
      return !!state.user
    },
    loggedOut () {
      //return state.user == null
    }
  },
})