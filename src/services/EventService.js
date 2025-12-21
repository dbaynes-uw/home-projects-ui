import api from './api'

var api_url = "";

export default {
  data() {
    //return {
    //  plants: [
    //    {author: 'A1'},
    //    {author: 'A2'},
    //  ],
    //}
  },
  init() {
    if (window.location.port == "8080") {
      //api_url = "http://davids-macbook-pro.local:3000/api/v1/";
      api_url = "http://localhost:3000/api/v1/";
      //api.defaults.baseURL = '//localhost:3000/';
    } else {
      api_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/";
    }
  },
  deleteBook(book) {
    this.init();
    // For Testing: setTimeout(5000);
    return api.delete(api_url + "books/" + `${book.id}`);
  },
  getBook(id) {
    this.init();
    return api.get(api_url + "books/" + id);
  },
  getBooks() {
    this.init();
    return api.get(api_url + "books")
  },
  async postBook(book) {
    this.init();
    return api.post(api_url + 'books', book);
  },
  async putBook(updatedBook) {
    this.init();
    return api.put(api_url + "books" + `/${updatedBook.id}`, updatedBook);
  },

  getEvent(id) {
    this.init();
    return api.get(api_url + "events/" + id);
  },
  async getEvents() {
    this.init();
    return api.get(api_url + "events")
    //.catch(error=>{
      //this.$router.push({ name: 'About' })
      //this.router.push({name:'home'})
    //})
  },
  getEventsAssigned(assigned) {
    this.init();
    return api.get(api_url + "events_assigned/" + `?assigned=${assigned}`);
  },
  getEventsDueBy(form) {
    this.init();
    const dueFilter =
      form.target.options[form.target.options.selectedIndex].innerText;
    //form.target.options[form.target.options.selectedIndex].innerText = null
    form.target.options.selectedIndex = 0
    return api.get(api_url + "events/" + `?due_by=${dueFilter}`)
  },
  getEventsActive() {
    this.init();
    return api.get(api_url + "events/" + `?active=true`)
  },
  getEventsStatus(status) {
    this.init();
    return api.get(api_url + "events/" + `?status=${status}`)
  },
  getEventsLocations(form) {
    this.init();
    console.log("EventService Form: ", form)
    const location =
      form.target.options[form.target.options.selectedIndex].innerText;
    form.target.options.selectedIndex = 0
    return api.get(api_url + "events/" + `?location=${location}`)
  },
  getEventsPastDue() {
    this.init();
    return api.get(api_url + "events/" + `?past_due=true`)
  },
  getEventStatistics() {
    this.init();
    return api.get(api_url + "events/statistics/");
  },
  getEventStatisticDetail(statistic) {
    this.init();
    return api.get(api_url + "events/statistic_detail/" + `?statistic=${statistic}`)
  },
  async postEvent(event) {
    this.init();
    return api.post(api_url + "events", event);
  },
  async putEvent(updatedEvent) {
    this.init();
    return api.put(api_url + "events" + `/${updatedEvent.id}`, updatedEvent);
  },
  deleteEvent(id) {
    this.init();
    return api.delete(api_url + "events" + `/${id}`);
  },
  deleteFilm(film) {
    this.init();
    // For Testing: setTimeout(5000);
    return api.delete(api_url + "films/" + `${film.id}`);
  },
  getFilm(id) {
    this.init();
    return api.get(api_url + "films/" + id);
  },
  getFilms() {
    this.init();
    return api.get(api_url + "films")
  },
  async putFilm(updatedFilm) {
    this.init();
    return api.put(api_url + "films" + `/${updatedFilm.id}`, updatedFilm);
  },
  async postFilm(film) {
    this.init();
    return api.post(api_url + 'films', film);
  },
  getGarden(id) {
    this.init();
    return api.get(api_url + "gardens/" + id);
  },
  getGardens() {
    this.init();
    return api.get(api_url + "gardens")
  },
  deleteGarden(garden) {
    this.init();
    console.log("Deleting garden with ID:", garden.id);
    // For Testing: setTimeout(5000);
    return api.delete(api_url + "gardens/" + `${garden.id}`);
  },
  async postGarden(garden) {
    this.init();
    return api.post(api_url + 'gardens', garden);
  },
  async putGarden(updatedGarden) {
    this.init();
    return api.put(api_url + "gardens" + `/${updatedGarden.id}`, updatedGarden);
  },
  getGolf(id) {
    this.init();
    return api.get(api_url + "golfs/" + id);
  },
  getGolfs() {
    this.init();
    return api.get(api_url + "golfs")
  },
  deleteGolf(golf) {
    this.init();
    // For Testing: setTimeout(5000);
    return api.delete(api_url + "golfs/" + `${golf.id}`);
  },
  async putGolf(updatedGolf) {
    this.init();
    return api.put(api_url + "golfs" + `/${updatedGolf.id}`, updatedGolf);
  },
  async postGolf(golf) {
    this.init();
    return api.post(api_url + 'golfs', golf);
  },

  async putPlant(updatedPlant) {
    this.init();
    return api.put(api_url + "plants" + `/${updatedPlant.id}`, updatedPlant);
  },
  deleteGlucoseReading(glucose_reading) {
    this.init();
    console.log("Deleting glucose reading with ID:", glucose_reading.id);
    // For Testing: setTimeout(5000);
    return api.delete(api_url + "glucose_readings/" + `${glucose_reading.id}`);
  },
  getGlucoseReading(id) {
    this.init();
    return api.get(api_url + "glucose_readings/" + id);
  },
  getGlucoseReadings() {
    this.init();
    return api.get(api_url + "glucose_readings")
  },
  async putGlucoseReading(updatedGlucoseReading) {
    this.init();
    return api.put(api_url + "glucose_readings" + `/${updatedGlucoseReading.id}`, updatedGlucoseReading);
  },
  async postGlucoseReading(glucose_reading) {
    this.init();
    // For Testing: setTimeout(5000);
    //*if (glucose_reading.glucose_reading === null || glucose_reading.glucose_reading === undefined) {
    //*  console.error("ES: postGlucoseReading - glucose_reading is null or undefined");
    //*  throw new Error("Glucose reading is required");
    //*}
    //*if (glucose_reading.meal === null || glucose_reading.meal === undefined) {
    //*  console.error("ES: postGlucoseReading - meal is null or undefined");
    //*  throw new Error("Meal is required");
    //*}
    return api.post(api_url + 'glucose_readings', glucose_reading);
  },
  getHealthMarker(id) {
    console.log("ES GET Health Marker with ID:", id);
    this.init();
    const response = api.get(api_url + "health_markers/" + id);
    console.log("ES GET Health Marker response:", response);
    return response;
  },
  getHealthMarkers() {
    this.init();
    return api.get(api_url + "health_markers")
  },
  postHealthMarker(healthMarker) {
    this.init();
    return api.post(api_url + 'health_markers', healthMarker);
  },
  async putHealthMarker(updatedHealthMarker) {
    this.init();
    return api.put(api_url + "health_markers" + `/${updatedHealthMarker.id}`, updatedHealthMarker);
  },
  deleteHealthMarker(healthMarker) {
    this.init();
    // For Testing: setTimeout(5000);
    return api.delete(api_url + "health_markers/" + `${healthMarker.id}`);
  },
  deleteOob(oob) {
    this.init();
       // For Testing: setTimeout(5000);
    return api.delete(api_url + "oobs/" + `${oob.id}`);
  },
  getOob(id) {
    this.init();
    //return api.get(api_url + "Oobs/" + id);
    return api.get(api_url + "oobs/" + id);
  },
  getOobs() {
    this.init();
    //return api.get(api_url + "Oobs")
    return api.get(api_url + "oobs")

  },
  async putOob(updatedOob) {
    this.init();
    //return api.put(api_url + "Oobs" + `/${updatedOob.id}`, updatedOob);
    return api.put(api_url + "oobs" + `/${updatedOob.id}`, updatedOob);
  },
  async postOob(oob) {
    this.init();
    //return api.post(api_url + 'Oobs', oob);
    return api.post(api_url + 'oobs', oob);

  },
  deletePlant(plant) {
    this.init();
    // For Testing: setTimeout(5000);
    return api.delete(api_url + "plants/" + `${plant.id}`);
  },
  getPlant(plant) {
    this.init();
    // For Testing: setTimeout(5000);
    return api.get(api_url + "plants/" + `${plant}`);
  },
  getPlants(garden) {
    this.init();
    return api.get(api_url + "plants",`${garden}`);
  },
  async postPlant(plant) {
    this.init();
    return api.post(api_url + 'plants', plant);
  },
  async deleteProduct(product) {
    this.init();
    return api.delete(api_url + "products/" + `${product.id}`);
  },
  async getProducts() {
    this.init();
    return api.get(api_url + "products")
  },
  async getShoppingList() {
    this.init();
    return api.get(api_url + "shopping_list")
  },
  async postProduct(product) {
    this.init();
    return await api.post(api_url + 'products', product);
  },
  async putProduct(updatedProduct) {
    this.init();
    return api.put(api_url + "products" + `/${updatedProduct.id}`, updatedProduct);
  },
  // ✅ UPDATE YOUR EventService.js
  async putProducts(products) {
    try {
      const response = await api.patch(api_url + "products/update", products);

      return response;

    } catch (error) {
      console.error('❌ EventService putProducts error:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });

      throw error;
    }
  },
  getSleepMarker(id) {
    console.log("ES GET Sleep Marker with ID:", id);
    this.init();
    const response = api.get(api_url + "sleep_markers/" + id);
    console.log("ES GET Sleep Marker response:", response);
    return response;
  },
  getSleepMarkers() {
    this.init();
    return api.get(api_url + "sleep_markers")
  },
  postSleepMarker(sleepMarker) {
    this.init();
    return api.post(api_url + 'sleep_markers', sleepMarker);
  },
  async putSleepMarker(updatedSleepMarker) {
    this.init();
    return api.put(api_url + "sleep_markers" + `/${updatedSleepMarker.id}`, updatedSleepMarker);
  },
  deleteSleepMarker(id) {
    this.init();
    // For Testing: setTimeout(5000);
    return api.delete(api_url + "sleep_markers/" + `${id}`);
  },

  async postTrail(trail) {
    this.init();
    return api.post(api_url + "trails", trail);
  },
  getTrails() {
    this.init();
    return api.get(api_url + "trails");
  },
  getTrail(id) {
    this.init();
    return api.get(api_url + "trails/" + id);
  },
  async putTrail(updatedTrail) {
    this.init();
    return api.put(api_url + "trails" + `/${updatedTrail.id}`, updatedTrail);
  },
  deleteTrail(id) {
    this.init();
    return api.delete(api_url + "trails" + `/${id}`);
  },
  async postTravel(travel) {
    this.init();
    return api.post(api_url + "travels", travel);
  },
  async postTravelEvent(travel_event) {
    this.init();
    return api.post(api_url + 'create_travel_event', travel_event);
  },
  getTravels() {
    this.init();
    return api.get(api_url + "travels")
  },
  getTravelEvents() {
    this.init();
    return api.get(api_url + "travel_events")
  },
  getTravel(id) {
    this.init();
    return api.get(api_url + "travels/" + id);
  },
  getTravelEvent(id) {
    this.init();
    return api.get(api_url + "travel_events/" + id);
  },
  async putTravel(updatedTravel) {
    this.init();
    return api.put(api_url + "travels" + `/${updatedTravel.id}`, updatedTravel);
  },
  async putTravelEvent(updatedTravelEvent) {
    this.init();
    return api.put(api_url + "travel_events" + `/${updatedTravelEvent.id}`, updatedTravelEvent);
  },
  destroyTravel(id) {
    this.init();
    return api.delete(api_url + "travels" + `/${id}`);
  },
  destroyTravelEvent(id) {
    this.init();
    return api.delete(api_url + "travel_events" + `/${id}`);
  },
  async postUser(user) {
    this.init();
    return api.get(api_url + "users", user);
  },
  getUser(id) {
    this.init();
    return api.get(api_url + "users" + id);
  },
  getUsers() {
    this.init();
    return api.get(api_url + "users")
  },
  deleteUser(id) {
    this.init();
    return api.delete(api_url + "users" + `/${id}`);
  },
  async putUser(user) {
    this.init();
    return api.put(api_url + "users" + `/${user.id}`, user);
  },
  async deleteVendor(vendor) {
    this.init();
    return api.delete(api_url + "vendors/" + `${vendor.id}`);
  },
  async getVendor(id) {
    this.init();
    return api.get(api_url + "vendors/" + id);
  },
  async getVendors() {
    this.init();
    return api.get(api_url + "vendors")
  },
  async getVendorsGroup() {
    this.init();
    return api.get(api_url + "vendors_group")
  },
  async getVendorsProducts() {
    this.init();
    return api.get(api_url + "vendors_products")
  },
  async getProductsByLocation(location) {
    this.init();
    return api.get(api_url + "products_by_location/" + `?location=${location}`)
  },
  async getVendorsLocationsGroup() {
    this.init();
    return api.get(api_url + "vendors_locations_group")
  },
  async getVendorsProductsGroup() {
    this.init();
    return api.get(api_url + "vendors_products_group")
  },
  async postVendor(vendor) {
    this.init();
    return await api.post(api_url + 'vendors', vendor);
  },
  async putVendor(updatedVendor) {
    this.init();
    return api.put(api_url + "vendors" + `/${updatedVendor.id}`, updatedVendor);
  },
  async postVendorsProduct(vendors_products) {
    this.init();
    return api.post(api_url + 'vendors_products', vendors_products);
  },
  async putVendorsProducts(vendors_products) {
    this.init();
    return api.put(api_url + "vendors/update", vendors_products) //, { params: {vendors_products}});
  },
  async postWatering(watering) {
    this.init();
    return api.post(api_url + 'waterings', watering);
  },
  async putWatering(updatedWatering) {
    this.init();
    return api.put(api_url + "waterings" + `/${updatedWatering.id}`, updatedWatering);
  },
  async getWatering(id) {
    this.init();
    return api.get(api_url + "waterings/" + id)
  },
  async getWaterings() {
    this.init();
    return api.get(api_url + "waterings")
  },
  async getGardenWaterings(id) {
    this.init();
    return api.get(api_url + "waterings/garden/" + `${id}`)
  },
  deleteWatering(watering) {
    this.init();
    // For Testing: setTimeout(5000);
    return api.delete(api_url + "waterings/" + `${watering.id}`);
  },
};
