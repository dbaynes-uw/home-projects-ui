//import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'
import EventService from '@/services/EventService'
import router from '../router'
//import DateFormatService from "@/services/DateFormatService.js";

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
    //book: [],
    //books: [],
    events: [],
    eventsRequest: [],
    eventsStatus: [],
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
    oob: {},
    oobs: [],
    oobsLoading: false,
    oobsPagination: {
      current_page: 1,
      per_page: 20,
      total_count: 0,
      total_pages: 0
    },
    oobsPage: 1,
    oobsTotal: 0,
    oobsPerPage: 20,
    plant: {},
    plants: [],
    location: {},
    product: [],
    products: [],
    products_by_location: [],
    shopping_list: [],
    //sleepMarkers: [],
    //sleepMarker: {},
    //trail: {},
    //trails: [],
    //travel: [],
    //travels: [],
    //travel_event: [],
    //travel_events: [],
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
    //ADD_BOOK(state, book) {
    //  state.books.push(book);
    //},
    //DELETE_BOOK(state, book) {
    //  state.book = book;
    //},
    //SET_BOOK(state, book) {
    //  state.book = book;
    //},
    //SET_BOOKS(state, books) {
    //  state.books = books;
    //},

    //CLEAR_BOOKS(state) {
    //  state.books = [];
    //},
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
    //ADD_FILM(state, film) {
    //  state.films.push(film);
    //},
    //DELETE_FILM(state, film) {
    //  state.film = film;
    //},
    //SET_FILM(state, film) {
    //  state.film = film;
    //},
    //SET_FILMS(state, films) {
    //  state.films = films;
    //},
    //CLEAR_FILMS(state) { 
    //  state.films = [];
    //}, 
    SET_GARDEN(state, garden) {
      state.garden = garden;
    },
    SET_GARDENS(state, gardens) {
      state.gardens = gardens;
    },
    SET_GARDEN_PLANTS(state, garden_plants) {
      state.garden_plants = garden_plants
    },
    ADD_GARDEN(state, garden) {
      state.gardens.push(garden);
    },
    DELETE_GARDEN(state, garden) {
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
    //ADD_GOLF(state, golf) {
    //  state.golfs.push(golf);
    //},
    //DELETE_GOLF(state, golf) {
    //  state.golf = golf;
    //},
    //SET_GOLF(state, golf) {
    //  state.golf = golf;
    //},
    //SET_GOLFS(state, golfs) {
    //  state.golfs = golfs;
    //},
    ADD_HEALTH_MARKER(state, healthMarker) {
      state.healthMarkers.push(healthMarker);
    },
    DELETE_HEALTH_MARKER(state, health_marker) {
      state.healthMarker = health_marker;
    },
    SET_HEALTH_MARKER(state, health_marker) {
      state.healthMarker = health_marker;
    },
    SET_HEALTH_MARKERS(state, health_markers) {
      state.healthMarkers = health_markers;
    },
    ADD_OOB(state, oob) {
      state.oobs.push(oob);
    },
    DELETE_OOB(state, oob) {
      state.oob = oob;
    },
    SET_OOB(state, oob) {
      state.oob = oob;
    },
    // ✅ FIXED SET_OOBS MUTATION
    SET_OOBS(state, response) {
      // ✅ HANDLE DIFFERENT RESPONSE FORMATS
      if (Array.isArray(response)) {
        // ✅ DIRECT ARRAY (YOUR CURRENT API FORMAT)
        state.oobs = response;
      } else if (response && Array.isArray(response.data)) {
        // ✅ NESTED IN response.data
        state.oobs = response.data;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        // ✅ DOUBLE NESTED
        state.oobs = response.data.data;
      } else {
        // ✅ FALLBACK FOR UNEXPECTED FORMATS
        console.error('❌ Unexpected oobs response format:', response);
        console.error('❌ Response type:', typeof response);
        console.error('❌ Response keys:', response && typeof response === 'object' ? Object.keys(response) : 'N/A');
        state.oobs = []; // ✅ Fallback to empty array
      }
    },

    SET_OOBS_PAGINATION(state, pagination) {
      if (pagination && typeof pagination === 'object') {
        state.oobsPagination = {
          current_page: pagination.current_page || 1,
          per_page: pagination.per_page || 20,
          total_count: pagination.total_count || 0,
          total_pages: pagination.total_pages || 0
        };
      } else {
        console.warn('⚠️ SET_OOBS_PAGINATION: Invalid pagination data:', pagination);
      }
    },
    // ✅ SLEEP_MARKER MUTATIONS
    /*
    ADD_SLEEP_MARKER(state, sleepMarker) {
      state.sleepMarkers.push(sleepMarker);
    },
    DELETE_SLEEP_MARKER(state, sleepMarker) {
      state.sleepMarkers = state.sleepMarkers.filter(marker => marker.id !== sleepMarker.id);
    },
    SET_SLEEP_MARKER(state, sleepMarker) {
      state.sleepMarker = sleepMarker;
    },
    SET_SLEEP_MARKERS(state, sleepMarkers) {
      state.sleepMarkers = sleepMarkers;
    },

    */
    CLEAR_EVENTS(state) {
      state.events = [];
    },

    SET_OOBS_TOTAL(state, total) {
      state.oobsTotal = total;
    }, 
    APPEND_OOBS(state, newOobs) {
      state.oobs = [...state.oobs, ...newOobs];
    },    
    DELETE_PLANT(state, plantId) {
      state.plants = state.plants.filter(plant => plant.id !== plantId);
    },
    SET_PLANT(state, plant) {
      state.plant = plant;
    },
    SET_PLANTS(state, plants) {
      state.plants = plants;
    },
    ADD_PRODUCT(state, product) {
      state.products.push(product);
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
    UPDATE_PRODUCT_ACTIVE(state, updatedProduct) {
      console.log('📝 Mutation: Updating product active state', updatedProduct);
    
    // Update in products array
    const productIndex = state.products.findIndex(p => p.id === updatedProduct.id);
    if (productIndex !== -1) {
      state.products[productIndex] = {
        ...state.products[productIndex],
        active: updatedProduct.active
      };
      console.log(`✅ Updated products[${productIndex}]:`, state.products[productIndex]);
    }
    
    // Update in shopping_list array if exists
    const shoppingListIndex = state.shopping_list.findIndex(p => p.id === updatedProduct.id);
    if (shoppingListIndex !== -1) {
      state.shopping_list[shoppingListIndex] = {
        ...state.shopping_list[shoppingListIndex],
        active: updatedProduct.active
      };
      console.log(`✅ Updated shopping_list[${shoppingListIndex}]:`, state.shopping_list[shoppingListIndex]);
      }
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
    //ADD_TRAIL(state, trail) {
    //  state.trails.push(trail);
    //},
    //DELETE_TRAIL(state, trail) {
    //  state.trail = trail;
    //},
    //SET_TRAIL(state, trail) {
    //  state.trail = trail;
    //},
    //SET_TRAILS(state, trail) {
    //  state.trails = trail;
    //},
    //ADD_TRAVEL(state, travel) {
    //  state.travels.push(travel);
    //},
    //DELETE_TRAVEL(state, travel) {
    //  state.travel = travel;
    //},
    //DELETE_TRAVEL_EVENT(state, travel_event) {
    //  state.travel_event = travel_event;
    //},
    //SET_TRAVEL(state, travel) {
    //  state.travel = travel;
    //},
    //SET_TRAVEL_EVENT(state, travel_event) {
    //  state.travel_event = travel_event;
    //},
    //SET_TRAVELS(state, travels) {
    //  state.travels = travels;
    //},
    //SET_TRAVEL_EVENTS(state, travel_events) {
    //  state.travel_events = travel_events;
    //},
    ADD_USER(state, user) {
      state.users.push(user);
    },

    SET_USER_DATA (state, userData) {
      if (userData && typeof userData === 'object') {
        state.user = userData;
        state.loggedIn = true;
        state.token = userData.token || '';
        state.id = userData.id || '';

        // ✅ SAVE TO LOCALSTORAGE
        try {
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('❌ SET_USER_DATA: Failed to save to localStorage:', error);
        }

        // ✅ SET AUTH HEADER FOR FUTURE REQUESTS
        if (userData.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }
      } else {
        console.error('❌ SET_USER_DATA: Invalid user data:', userData);
      }
    },

    CLEAR_PLANT() {
      localStorage.removeItem('plant')
    },
    
    CLEAR_USER_DATA (state) {
      console.log('🔍 CLEAR_USER_DATA: Clearing user data: ', state);
      state.user = null;
      state.loggedIn = false;
      state.token = '';
      state.id = '';

      localStorage.removeItem('user')
      //axios.defaults.headers.common['Authorization'] = null
      // ✅ CLEAR AUTH HEADER
      delete axios.defaults.headers.common['Authorization'];
  
    },

    CLEAR_WATERING() {
      localStorage.removeItem('watering')
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_VENDOR(state, vendor) {
      state.vendor = vendor;
    },
    SET_VENDORS(state, vendors) {
      state.vendors = vendors;
    },
    SET_VENDORS_PRODUCTS(state, vendors_products) {
      state.vendors_products = vendors_products;
    },
    SET_VENDORS_GROUP(state, data) {
      state.vendors_group = data;
    },

    // ✅ FIXED - PARAdeleteTER NAME MISMATCH
    SET_VENDORS_LOCATIONS_GROUP(state, data) {
      state.vendors_locations_group = data;
    },

    // ✅ FIXED - PARAMETER NAME MISMATCH  
    SET_VENDORS_PRODUCTS_GROUP(state, data) {
      state.vendors_products_group = data;
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
    ADD_WATERING(state, watering) {
      state.waterings.push(watering);
    },
    
    RESET_STATE(state) {
      //state.books = [];
      //state.films = [];
      //state.golfs = [];
      state.events = [];
      state.oobs = [];
      state.plants = [];
      state.products = [];
      //state.trails = [];
      //state.travels = [];
      state.glucoseReadings = [];
      state.waterings = [];
    }
  
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

    // Update your login action to handle the resource_owner format:
    async login ({ commit }, credentials) {
      // ✅ SET API URL BASED ON ENVIRONMENT (or use your utility)
      let api_authenticate_url;
      if (window.location.port == "8080") {
        api_authenticate_url = "http://localhost:3000/users/tokens/";
      } else {
        api_authenticate_url = "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/users/tokens/";
      }
    
      try {
        console.log('🔍 Store login: Attempting with:', {
          email: credentials.email,
          password: '[HIDDEN]'
        });
        console.log('🔍 Store login: API URL:', api_authenticate_url + "sign_in");
        
        const response = await axios.post(api_authenticate_url + "sign_in", credentials);
        
        console.log('✅ Store login: Full API response:', response.data);
        
        // ✅ HANDLE YOUR SPECIFIC API RESPONSE FORMAT (resource_owner)
        let userData;
        
        if (response.data.resource_owner) {
          // ✅ YOUR API FORMAT: resource_owner contains user data
          userData = {
            // ✅ FLATTEN THE USER DATA FROM resource_owner
            id: response.data.resource_owner.id,
            email: response.data.resource_owner.email,
            created_at: response.data.resource_owner.created_at,
            updated_at: response.data.resource_owner.updated_at,
            // ✅ ADD TOKEN DATA FROM ROOT LEVEL
            token: response.data.token,
            refresh_token: response.data.refresh_token,
            expires_in: response.data.expires_in,
            token_type: response.data.token_type,
            // ✅ KEEP ORIGINAL STRUCTURE FOR REFERENCE
            resource_owner: response.data.resource_owner
          };
          console.log('✅ Store login: Extracted userData from resource_owner:', userData);
        } else if (response.data.user) {
          // Fallback: user object at root level
          userData = { ...response.data.user };
          userData.token = response.data.token;
          console.log('✅ Store login: Using user format:', userData);
        } else {
          // Fallback: direct response data
          userData = { ...response.data };
          console.log('✅ Store login: Using direct response format:', userData);
        }
        
        console.log('✅ Store login: Final userData before commit:', userData);
        
        // ✅ COMMIT USER DATA TO STORE
        commit('SET_USER_DATA', userData);
        
        // ✅ VERIFY IT WAS SET
        console.log('✅ Store login: User in state after commit:', this.state.user);
        
        return { success: true, user: userData };
      
      } catch (error) {
        console.error('❌ Store login: Error:', error);
        console.error('❌ Store login: Error response:', error.response?.data);
        
        let errorMessage = 'Login failed';
        
        if (error.response?.data) {
          const errorData = error.response.data;
          
          if (errorData.error_description && Array.isArray(errorData.error_description)) {
            errorMessage = errorData.error_description.join(', ');
          } else if (errorData.error) {
            errorMessage = errorData.error.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        }
        
        throw new Error(errorMessage);
      }
    },

    async logout ({ commit }) {
      commit('CLEAR_USER_DATA')
      router.push({name: 'Login'});
    },

    async forgotPassword ({ commit }, email) {
      console.log("Forgot Password for " + email)
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
      console.log("Reset Password for " + email)  
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
    /*
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

    async fetchBooks({ commit }) {
      try {
        // ✅ REPLACE WITH YOUR ACTUAL API ENDPOINT
        const response = await EventService.getBooks()
        commit('SET_BOOKS', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch books:', error);
        commit('SET_BOOKS', []); // Set empty array on error
      }
    },
    */
    async fetchGarden({ commit }, id) {
      //const existingGarden = state.gardens.find((garden) => garden.id === id);
      //if (existingGarden) {
      //  commit("SET_GARDEN", existingGarden);
      //} else {
        try {
          const response = await EventService.getGarden(id);
          commit("SET_GARDEN", response.data);
        } catch (error) {
            alert("Garden Fetch Error", error.data)
          }
      //}
    },
    async fetchGardens({ commit }) {
      try {
        const response = await EventService.getGardens();
        commit("SET_GARDENS", response.data);
      } catch (error) {
        console.error("Error fetching gardens`:", error);
      }
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
      console.log("Store EventsLocations Form: ", form)
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
    async eventsStatus({ commit }, status) {
      EventService.getEventsStatus(status)
        .then((response) => {
      commit("SET_EVENTS", response.data);
      commit("SET_EVENTS_REQUEST", '');
      return response.data;
      })
      .catch((error) => {
        alert("EventsStatus Get Error: ", error.response.data )
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
    // ✅ FIXED VERSION:
    async updateEvent({ commit }, event) {
      try {

        const response = await EventService.putEvent(event);

        if (response && response.data) {
          commit("SET_EVENT", response.data);

          // ✅ RETURN SUCCESS OBJECT
          return {
            success: true,
            data: response.data,
            message: 'Event updated successfully'
          };
        } else {
          return {
            success: false,
            message: 'No data returned from server'
          };
        }

      } catch (error) {
        console.error('🏪 Store: Update failed:', error);

        // ✅ RETURN ERROR OBJECT
        return {
          success: false,
          error: error.message,
          message: 'Failed to update event'
        };
      }
    },
    setEventsRequest({ commit }, requestType) {
      commit('SET_EVENTS_REQUEST', requestType);
    },
    /*
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
    */
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
        async deleteGarden({ commit }, garden) {
      console.log("Deleting garden with ID:", garden.id);
      try {
        await EventService.deleteGarden(garden);
        commit("DELETE_GARDEN", garden);
        alert("Garden " + garden.name + " was deleted.");
      } catch (error) {
        alert("Garden Delete Error: " + (error.response?.data || error.message));
      }
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
    async deletePlant({ commit }, plant) {
      try {
        const response = await EventService.deletePlant(plant);
        commit('DELETE_PLANT', plant.id);
        return response.data;
      } catch (error) {
        console.error('❌ Store: Delete plant error:', error);
        throw error;
      }
    },

    async fetchPlant({ commit }, id) {
      commit('CLEAR_PLANT'); // Clear old data first
      const response = await EventService.getPlant(id);
      commit('SET_PLANT', response.data);
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

    async createPlant({ commit, state }, plant) {
      try {
        const response = await EventService.postPlant(plant);    
        // ✅ Add to plants array, don't just set single plant
        const updatedPlants = [...state.plants, response.data];
        commit('SET_PLANTS', updatedPlants);

        // Or refresh from server
        // await dispatch('fetchPlants');

        return response.data;

      } catch (error) {
        console.error('❌ Store: Create plant error:', error);
        throw error;
      }
    },
    async updatePlant({ commit }, plant) {
      try {
        const response = await EventService.putPlant(plant);

        commit('SET_PLANT', response.data);
        return response.data; // ✅ IMPORTANT: Return something truthy!

      } catch (error) {
        console.error('❌ Store: Update plant error:', error);
        throw error; // Re-throw so component can catch it
      }
    },
    async updateWatering({ commit }, watering) {
      try {
        const response = await EventService.putWatering(watering);      
        // Commit the updated watering to state
        commit('SET_WATERING', response.data); 
        // ✅ IMPORTANT: Return something truthy!
        return response.data; // or return true;

      } catch (error) {
        console.error('❌ Store: Update watering error:', error);
        throw error; // Re-throw so component can catch it
      }
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
    /*
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
    */
    // ✅ HealthMarkers ACTIONS
    async createHealthMarker({ commit }, healthMarker) {
      EventService.postHealthMarker(healthMarker)
        .then(() => {
          commit("ADD_HEALTH_MARKER", healthMarker);
          alert("Health Marker was successfully added.");
        })
        .catch((error) => {
          alert("Health Marker Post Error: ", error.response.data )
        });
    },

    async deleteHealthMarker({ commit, dispatch }, healthMarker) {
      try {
        const response = await EventService.deleteHealthMarker(healthMarker);
        // ✅ REFRESH THE ENTIRE HEALTH MARKERS LIST TO GET UPDATED DATA
        await dispatch('fetchHealthMarker');

        return response.data; // ✅ RETURN SUCCESS

      } catch (error) {
        console.error('❌ Store: Health Marker delete error:', error);
        throw error;
      }
    },

    async fetchHealthMarker({ commit, state }, id) {
      console.log("Fetching Health Marker with ID:", id);
      const existingHealthMarker = state.healthMarkers.find((marker) => marker.id === id);
      if (existingHealthMarker) {
        commit("SET_HEALTH_MARKER", existingHealthMarker);
      } else {
        EventService.getHealthMarker(id)
          .then((response) => {
            commit("SET_HEALTH_MARKER", response.data);
          })
          .catch((error) => {
            alert("Health Marker Get Error: ", error.response.data )
          });
      }
    },

    async fetchHealthMarkers({ commit }) {
      try {
        commit('SET_HEALTH_MARKERS', []);

        const response = await EventService.getHealthMarkers();

        // ✅ HANDLE BOTH OLD (PAGINATED) AND NEW (SIMPLE) FORMATS
        let healthMarkersArray = [];

        if (Array.isArray(response.data)) {
          // ✅ NEW FORMAT: Direct array
          healthMarkersArray = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          // ✅ OLD FORMAT: Paginated (fallback)
          healthMarkersArray = response.data.data;
        } else {
          console.error('❌ Store: Unexpected response format:', response);
          healthMarkersArray = [];
        }

        commit('SET_HEALTH_MARKERS', healthMarkersArray);

        return healthMarkersArray;

      } catch (error) {
        console.error('❌ Store: Error fetching health markers:', error);
        commit('SET_HEALTH_MARKERS', []);
        throw error;
      }
    },
    async updateHealthMarker({ commit, dispatch }, healthMarker) {
      try {
        const response = await EventService.putHealthMarker(healthMarker);
        // Commit the updated marker to Vuex state
        commit("SET_HEALTH_MARKER", response.data);
        // Optionally fetch the updated list of markers
        await dispatch("fetchHealthMarkers");
      } catch (error) {
        console.error("Error updating health marker:", error.response.data);
        alert("Failed to update health marker. Please try again.");
      }
    },
    // ✅ FIXED createOOB ACTION (around line 980)
    async createOob({ commit, dispatch }, oob) {
      try {
        const response = await EventService.postOob(oob);

        // ✅ REFRESH THE ENTIRE OOBS LIST TO GET UPDATED DATA
        await dispatch('fetchOobs');
        return response.data; // ✅ RETURN SUCCESS

      } catch (error) {
        console.error('❌ Store: OOB create error:', error);
        throw error;
      }
    },

    async deleteOob({ commit, dispatch }, oob) {
      try {
        const response = await EventService.deleteOob(oob);
        // ✅ REFRESH THE ENTIRE OOBS LIST TO GET UPDATED DATA
        await dispatch('fetchOobs');

        return response.data; // ✅ RETURN SUCCESS

      } catch (error) {
        console.error('❌ Store: OOB delete error:', error);
        throw error;
      }
    },

    async fetchOob({ commit, state }, id) {
      const existingOob = state.oobs.find((oob) => oob.id === id);
      if (existingOob) {
        commit("SET_OOB", existingOOB);
      } else {
        EventService.getOob(id)
          .then((response) => {
            commit("SET_OOB", response.data);
          })
          .catch((error) => {
            alert("OOB Get Error: ", error.response.data )
          });
      }
    },
    // ✅ SIMPLIFIED fetchOobs ACTION
    async fetchOobs({ commit }) {
      try {
        commit('SET_OOBS', []);

        const response = await EventService.getOobs();
        // ✅ HANDLE BOTH OLD (PAGINATED) AND NEW (SIMPLE) FORMATS
        let oobsArray = [];

        if (Array.isArray(response.data)) {
          // ✅ NEW FORMAT: Direct array
          oobsArray = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          // ✅ OLD FORMAT: Paginated (fallback)
          oobsArray = response.data.data;
        } else {
          console.error('❌ Store: Unexpected response format:', response);
          oobsArray = [];
        }

        commit('SET_OOBS', oobsArray);

        return oobsArray;

      } catch (error) {
        console.error('❌ Store: Error fetching oobs:', error);
        commit('SET_OOBS', []);
        throw error;
      }
    },
    // ✅ ENHANCED updateOob ACTION (around line 1020)
    async updateOob({ commit, dispatch }, oob) {
      try {
        const response = await EventService.putOob(oob);
        // ✅ REFRESH THE ENTIRE OOBS LIST TO GET UPDATED DATA
        await dispatch('fetchOobs');

        return response.data; // ✅ RETURN SUCCESS

      } catch (error) {
        console.error('❌ Store: OOB update error:', error);
        throw error;
      }
    },

    async createProduct({ commit }, product) {
      EventService.postProduct(product)
        .then((response) => {
          commit("ADD_PRODUCT", response.data);
          alert("Product was successfully added for " + product.product_name);})
        .catch((error) => {
          alert("Product Create Error: ", error.response.data )
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

    // ✅ UPDATE YOUR store.js putProducts ACTION
    async putProducts({ commit }, products) {
      try {

        const response = await EventService.putProducts(products);

        // ✅ RETURN TRUE ON SUCCESS
        if (response && (response.status === 200 || response.status === 201)) {

          // ✅ UPDATE STORE STATE IF NEEDED
          if (response.data) {
            commit('SET_PRODUCTS', response.data);
          }

          return true; // ✅ SUCCESS
        }

        console.error('❌ Store putProducts: Invalid response');
        return false;

      } catch (error) {
        console.error('❌ Store putProducts error:', error);

        if (error.response) {
          console.error('❌ Error response:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('❌ No response received:', error.request);
        } else {
          console.error('❌ Error setting up request:', error.message);
        }

        return false; // ✅ FAILURE
      }
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

    // ✅ SleepMarkers ACTIONS
        async createSleepMarker({ commit }, sleepMarker) {
      try {
        const response = await EventService.postSleepMarker(sleepMarker);
        commit("ADD_SLEEP_MARKER", response.data);
        return response.data;
      } catch (error) {
        console.error("Sleep Marker Post Error:", error);
        throw error;
      }
    },

    async deleteSleepMarker({ commit, dispatch }, sleepMarker) {
      try {
        const response = await EventService.deleteSleepMarker(sleepMarker);
        await dispatch('fetchSleepMarkers');
        return response.data;
      } catch (error) {
        console.error('Sleep Marker delete error:', error);
        throw error;
      }
    },

    async fetchSleepMarker({ commit }, id) {
      try {
        const response = await EventService.getSleepMarker(id);
        commit("SET_SLEEP_MARKER", response.data);
        return response.data;
      } catch (error) {
        console.error("Sleep Marker Get Error:", error);
        throw error;
      }
    },

    async fetchSleepMarkers({ commit }) {
      try {
        commit('SET_SLEEP_MARKERS', []);
        const response = await EventService.getSleepMarkers();
        
        let sleepMarkersArray = [];
        if (Array.isArray(response.data)) {
          sleepMarkersArray = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          sleepMarkersArray = response.data.data;
        }
        
        commit('SET_SLEEP_MARKERS', sleepMarkersArray);
        return sleepMarkersArray;
      } catch (error) {
        console.error('Error fetching sleep markers:', error);
        commit('SET_SLEEP_MARKERS', []);
        throw error;
      }
    },
    
    async updateSleepMarker({ commit, dispatch }, sleepMarker) {
      try {
        const response = await EventService.putSleepMarker(sleepMarker);
        commit("SET_SLEEP_MARKER", response.data);
        await dispatch("fetchSleepMarkers");
        return response.data;
      } catch (error) {
        console.error("Error updating sleep marker:", error);
        throw error;
      }
    },
    // ✅ Trails ACTIONS    
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
    /*
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
    */
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

    // ✅ FIXED fetchVendor ACTION - ADD THE MISSING RETURN!
    async fetchVendor({ commit }, vendorId) {
      try {
        console.log('Store fetchVendor ID: ', vendorId);

        if (!vendorId) {
          throw new Error('Vendor ID is required');
        }

        const response = await EventService.getVendor(vendorId);

        // ✅ THIS IS THE MISSING LINE - RETURN THE DATA!
        if (response && response.data) {
          return response.data; // ✅ ADD THIS RETURN STATEMENT!
        } else {
          console.error('❌ Store fetchVendor: No data in response');
          return null;
        }

      } catch (error) {
        console.error('❌ Store fetchVendor error:', error);
        throw error;
      }
    },

    async updateVendor({ commit }, vendor) {
      EventService.putVendor(vendor)
        .then((response) => {
          commit("SET_VENDOR", response.data);
          alert("Vendor " + vendor.vendor_name + " was Successfully Updated.")
        })
        .catch((error) => {
          alert("Vendor Put Error for " + vendor.vendor_name + ": " + error.response.request.statusText)
          location.reload();
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
    async updateVendorsProducts({ commit }, payload) {
      try {
        const response = await EventService.putVendorsProducts(payload);

        // ✅ RETURN SUCCESS INDICATOR
        if (response && (response.status === 200 || response.data)) {
          // Update state if needed
          if (response.data) {
            commit('SET_VENDORS_PRODUCTS', response.data);
          }
          return true; // ✅ EXPLICIT SUCCESS
        }

        return false; // ✅ EXPLICIT FAILURE

      } catch (error) {
        console.error('Store action error:', error);
        return false; // ✅ RETURN FALSE ON ERROR
      }
    },
    async createWatering({ commit, dispatch }, watering) {
      EventService.postWatering(watering)
        .then(async () => {
          commit("ADD_WATERING", watering);
          //OLD: await dispatch("fetchGarden", watering.garden_id);
          if (watering.garden_id) {
            await dispatch("fetchGarden", watering.garden_id);
          } else {
            await dispatch("fetchWaterings");
          }      
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

    async fetchWatering({ commit }, id) {
      commit('CLEAR_WATERING'); // Clear old data first
      const response = await EventService.getWatering(id);
      commit('SET_WATERING', response.data);
    },

    async fetchWaterings({ commit }) {
      EventService.getWaterings()
        .then((response) => {
          commit("SET_WATERINGS", response.data);
          return response.data;
        })
        .catch((error) => {
          alert("Waterings Fetch Error: ", error.response.data)
        });
    },  
    // ✅ NEW: CLEAR LARGE DATASETS WHEN CHANGING ROUTES
    clearLargeDatasets({ commit }) {
      console.log('🧹 Clearing large datasets from memory...');
      
      // Clear arrays but keep essential data
      //commit('SET_BOOKS', []);
      //commit('SET_FILMS', []);
      //commit('SET_GOLFS', []);
      commit('SET_EVENTS', []);
      commit('SET_OOBS', []);
      commit('SET_PLANTS', []);
      commit('SET_PRODUCTS', []);
      //commit('SET_TRAILS', []);
      //commit('SET_TRAVELS', []);
      commit('SET_GLUCOSE_READINGS', []);
      commit('SET_WATERINGS', []);
      
      // Force garbage collection hint
      if (global.gc) {
        global.gc();
      }
    },

    // ✅ NEW: FORCE CLEANUP ON PAGE UNLOAD
    forceCleanup({ commit }) {
      console.log('🧹 Force cleanup on unload...');
      commit('RESET_STATE');
    },

  },
  getters: {
    gardens(state) {
      return state.gardens || []; // Ensure it always returns an array
    },
    glucoseReadings(state) {
      return state.glucoseReadings || []; // Ensure it always returns an array
    },
    plants(state) {
      return state.plants || []; // Ensure it always returns an array
    },
    waterings(state) {
      return state.waterings || []; // Ensure it always returns an array
    },
    //numberOfBooks(state) {
    //  return state.books.length
    //},
    loggedIn (state) {
      return !!state.user
    },
    loggedOut () {
      //return state.user == null
    }
  }
})