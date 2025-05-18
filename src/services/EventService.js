import axios from "axios";
import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");
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
      //axios.defaults.baseURL = '//localhost:3000/';
    } else {
      api_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/";
    }
  },
  deleteBook(book) {
    this.init();
    // For Testing: setTimeout(5000);
    return axios.delete(api_url + "books/" + `${book.id}`);
  },
  getBook(id) {
    this.init();
    return axios.get(api_url + "books/" + id);
  },
  getBooks() {
    this.init();
    return axios.get(api_url + "books")
  },
  async postBook(book) {
    this.init();
    return axios.post(api_url + 'books', book);
  },
  async putBook(updatedBook) {
    this.init();
    return axios.put(api_url + "books" + `/${updatedBook.id}`, updatedBook);
  },
  getGarden(id) {
    this.init();
    return axios.get(api_url + "gardens/" + id);
  },
  getGardens() {
    this.init();
    return axios.get(api_url + "gardens")
  },
  getEvent(id) {
    this.init();
    return axios.get(api_url + "events/" + id);
  },
  async getEvents() {
    this.init();
    return axios.get(api_url + "events")
    //.catch(error=>{
      //this.$router.push({ name: 'About' })
      //this.router.push({name:'home'})
    //})
  },
  getEventsAssigned(assigned) {
    this.init();
    return axios.get(api_url + "events_assigned/" + `?assigned=${assigned}`);
  },
  getEventsDueBy(form) {
    this.init();
    const dueFilter =
      form.target.options[form.target.options.selectedIndex].innerText;
    //form.target.options[form.target.options.selectedIndex].innerText = null
    form.target.options.selectedIndex = 0
    return axios.get(api_url + "events/" + `?due_by=${dueFilter}`)
  },
  getEventsInactive() {
    this.init();
    return axios.get(api_url + "events/" + `?inactive=true`)
  },
  getEventsLocations(form) {
    this.init();
    const location =
      form.target.options[form.target.options.selectedIndex].innerText;
    form.target.options.selectedIndex = 0
    return axios.get(api_url + "events/" + `?location=${location}`)
  },
  getEventsPastDue() {
    this.init();
    return axios.get(api_url + "events/" + `?past_due=true`)
  },
  getEventStatistics() {
    this.init();
    return axios.get(api_url + "events/statistics/");
  },
  getEventStatisticDetail(statistic) {
    this.init();
    return axios.get(api_url + "events/statistic_detail/" + `?statistic=${statistic}`)
  },
  async postEvent(event) {
    this.init();
    return axios.post(api_url + "events", event);
  },
  async putEvent(updatedEvent) {
    this.init();
    return axios.put(api_url + "events" + `/${updatedEvent.id}`, updatedEvent);
  },
  deleteEvent(id) {
    this.init();
    return axios.delete(api_url + "events" + `/${id}`);
  },
  deleteFilm(film) {
    this.init();
    // For Testing: setTimeout(5000);
    return axios.delete(api_url + "films/" + `${film.id}`);
  },
  getFilm(id) {
    this.init();
    return axios.get(api_url + "films/" + id);
  },
  getFilms() {
    this.init();
    return axios.get(api_url + "films")
  },
  async putFilm(updatedFilm) {
    this.init();
    return axios.put(api_url + "films" + `/${updatedFilm.id}`, updatedFilm);
  },
  async postFilm(film) {
    this.init();
    return axios.post(api_url + 'films', film);
  },
  deleteGolf(golf) {
    this.init();
    // For Testing: setTimeout(5000);
    return axios.delete(api_url + "golfs/" + `${golf.id}`);
  },
  getGolf(id) {
    this.init();
    return axios.get(api_url + "golfs/" + id);
  },
  getGolfs() {
    this.init();
    return axios.get(api_url + "golfs")
  },
  async putGolf(updatedGolf) {
    this.init();
    return axios.put(api_url + "golfs" + `/${updatedGolf.id}`, updatedGolf);
  },
  async postGolf(golf) {
    this.init();
    return axios.post(api_url + 'golfs', golf);
  },
  async postGarden(garden) {
    this.init();
    return axios.post(api_url + 'gardens', garden);
  },
  async putGarden(updatedGarden) {
    this.init();
    return axios.put(api_url + "gardens" + `/${updatedGarden.id}`, updatedGarden);
  },
  async putPlant(updatedPlant) {
    this.init();
    return axios.put(api_url + "plants" + `/${updatedPlant.id}`, updatedPlant);
  },
  async putWatering(updatedWatering) {
    this.init();
    return axios.put(api_url + "waterings" + `/${updatedWatering.id}`, updatedWatering);
  },

  deleteMed(med) {
    this.init();
       // For Testing: setTimeout(5000);
    return axios.delete(api_url + "meds/" + `${med.id}`);
  },
  getMed(id) {
    this.init();
    return axios.get(api_url + "meds/" + id);
  },
  getMeds() {
    this.init();
    return axios.get(api_url + "meds")
  },
  async putMed(updatedMed) {
    this.init();
    return axios.put(api_url + "meds" + `/${updatedMed.id}`, updatedMed);
  },
  async postMed(med) {
    this.init();
    return axios.post(api_url + 'meds', med);
  },
  deleteOutlet(outlet) {
    this.init();
    // For Testing: setTimeout(5000);
    return axios.delete(api_url + "outlets/" + `${outlet.id}`);
  },
  deletePlant(plant) {
    this.init();
    // For Testing: setTimeout(5000);
    return axios.delete(api_url + "plants/" + `${plant.id}`);
  },
  getPlant(plant) {
    this.init();
    // For Testing: setTimeout(5000);
    return axios.get(api_url + "plants/" + `${plant}`);
  },
  getPlants(garden) {
    this.init();
    return axios.get(api_url + "plants",`${garden}`);
  },
  async getGardenOutlet(garden) {
    this.init();
    return axios.get(api_url + "gardens/garden_outlet", `${garden}`)
  },
  async getOutletsDisplayGroup() {
    this.init();
    return axios.get(api_url + "outlets_display_group")
  },
  async getOutletsHash() {
    this.init();
    return axios.get(api_url + "outlets_hash")
  },
  async postPlant(plant) {
    this.init();
    return axios.post(api_url + 'plants', plant);
  },
  async deleteProduct(product) {
    this.init();
    return axios.delete(api_url + "products/" + `${product.id}`);
  },
  async getProducts() {
    this.init();
    return axios.get(api_url + "products")
  },
  async getShoppingList() {
    this.init();
    return axios.get(api_url + "shopping_list")
  },
  async putProduct(updatedProduct) {
    this.init();
    return axios.put(api_url + "products" + `/${updatedProduct.id}`, updatedProduct);
  },
  async putProducts(products) {
    this.init();
    return axios.put(api_url + "products/update", products) //, { params: {vendors_products}});
  },
  async postTrail(trail) {
    this.init();
    return axios.post(api_url + "trails", trail);
  },
  getTrails() {
    this.init();
    return axios.get(api_url + "trails");
  },
  getTrail(id) {
    this.init();
    return axios.get(api_url + "trails/" + id);
  },
  async putTrail(updatedTrail) {
    this.init();
    return axios.put(api_url + "trails" + `/${updatedTrail.id}`, updatedTrail);
  },
  deleteTrail(id) {
    this.init();
    return axios.delete(api_url + "trails" + `/${id}`);
  },
  async postTravel(travel) {
    this.init();
    return axios.post(api_url + "travels", travel);
  },
  async postTravelEvent(travel_event) {
    this.init();
    return axios.post(api_url + 'create_travel_event', travel_event);
  },
  getTravels() {
    this.init();
    return axios.get(api_url + "travels")
  },
  getTravelEvents() {
    this.init();
    return axios.get(api_url + "travel_events")
  },
  getTravel(id) {
    this.init();
    return axios.get(api_url + "travels/" + id);
  },
  getTravelEvent(id) {
    this.init();
    return axios.get(api_url + "travel_events/" + id);
  },
  async putTravel(updatedTravel) {
    this.init();
    return axios.put(api_url + "travels" + `/${updatedTravel.id}`, updatedTravel);
  },
  async putTravelEvent(updatedTravelEvent) {
    this.init();
    return axios.put(api_url + "travel_events" + `/${updatedTravelEvent.id}`, updatedTravelEvent);
  },
  destroyTravel(id) {
    this.init();
    return axios.delete(api_url + "travels" + `/${id}`);
  },
  destroyTravelEvent(id) {
    this.init();
    return axios.delete(api_url + "travel_events" + `/${id}`);
  },
  async postUser(user) {
    this.init();
    return axios.get(api_url + "users", user);
  },
  getUser(id) {
    this.init();
    return axios.get(api_url + "users" + id);
  },
  getUsers() {
    this.init();
    return axios.get(api_url + "users")
  },
  deleteUser(id) {
    this.init();
    return axios.delete(api_url + "users" + `/${id}`);
  },
  async putUser(user) {
    this.init();
    return axios.put(api_url + "users" + `/${user.id}`, user);
  },
  async deleteVendor(vendor) {
    this.init();
    return axios.delete(api_url + "vendors/" + `${vendor.id}`);
  },
  async getVendors() {
    this.init();
    return axios.get(api_url + "vendors")
  },
  async getVendorsGroup() {
    this.init();
    return axios.get(api_url + "vendors_group")
  },
  async getVendorsProducts() {
    this.init();
    return axios.get(api_url + "vendors_products")
  },
  async getProductsByLocation(location) {
    this.init();
    return axios.get(api_url + "products_by_location/" + `?location=${location}`)
  },
  async getVendorsLocationsGroup() {
    this.init();
    return axios.get(api_url + "vendors_locations_group")
  },
  async getVendorsProductsGroup() {
    this.init();
    return axios.get(api_url + "vendors_products_group")
  },
  async postVendor(vendor) {
    this.init();
    return await axios.post(api_url + 'vendors', vendor);
  },
  async putVendor(updatedVendor) {
    this.init();
    return axios.put(api_url + "vendors" + `/${updatedVendor.id}`, updatedVendor);
  },
  async postVendorsProduct(vendors_products) {
    this.init();
    return axios.post(api_url + 'vendors_products', vendors_products);
  },
  async putVendorsProducts(vendors_products) {
    this.init();
    return axios.put(api_url + "vendors/update", vendors_products) //, { params: {vendors_products}});
  },
  async postWatering(watering) {
    this.init();
    return axios.post(api_url + 'create_watering', watering);
  },
  async postWateringOutlet(watering_outlet) {
    this.init();
    return axios.post(api_url + 'outlets', watering_outlet);
  },
  async getWatering(id) {
    this.init();
    return axios.get(api_url + "waterings/" + id)
  },
  async getWaterings() {
    this.init();
    return axios.get(api_url + "waterings")
  },
  deleteWatering(watering) {
    this.init();
    // For Testing: setTimeout(5000);
    return axios.delete(api_url + "waterings/" + `${watering.id}`);
  },
  getOutlet(id) {
    this.init();
    return axios.get(api_url + "outlets/" + id);
  },
  async putOutlet(updatedOutlet) {
    this.init();
    return axios.put(api_url + "outlets" + `/${updatedOutlet.id}`, updatedOutlet);
  },
  getOutletDetailsByName(name) {
    this.init();
    return axios.get(api_url + "outlets/get_plant_watering_outlet/" + `?name=${name}`);
  },
};
