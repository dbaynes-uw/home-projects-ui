import axios from "axios";
import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");
var environment = "";
var api_url = "";
export default {
  init() {
    console.log("UI PORT IS: ", window.location.port)
    if (window.location.port == "8080") {
      environment = "development";
      //api_url = "http://davids-macbook-pro.local:3000/api/v1/";
      api_url = "http://localhost:3000/api/v1/";
    } else {
      environment = "production";
      api_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/";
    }
    console.log("API_URL: ", api_url);
  },
  eventsDueBy(form) {
    this.init();
    const dueFilter =
      form.target.options[form.target.options.selectedIndex].innerText;
    return axios.get(api_url + "events" + `?_dueFilter=${dueFilter}`);
  },
  async eventsPastDue() {
    this.init();
    return axios.get(api_url + "events_past_due" + `'true'`);
  },
  async postBook(book) {
    this.init();
    return axios.post(api_url + 'books', book);
  },
  getBooks() {
    this.init();
    return axios.get(api_url + "books")
  },
  getBook(id) {
    this.init();
    console.log("environment: ", environment);
    return axios.get(api_url + "books/" + id);
  },
  async putBook(updatedBook) {
    this.init();
    return axios.put(api_url + "books" + `/${updatedBook.id}`, updatedBook);
  },
  deleteBook(book) {
    this.init();
    console.log("environment: ", environment);
    console.log("ES Delete Book: ", book.id);
    // For Testing: setTimeout(5000);
    return axios.delete(api_url + "books/" + `${book.id}`);
  },
  getEvent(id) {
    this.init();
    return axios.get(api_url + "events/" + id);
  },
  async getEvents() {
    this.init();
    return axios.get(api_url + "events")
    //.catch(error=>{
    // console.log("ERROR!!!", error)
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
    console.log("SERVICE.JS dueBY: ", dueFilter)
    return axios.get(api_url + "events/" + `?due_by=${dueFilter}`)
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
  async postUser(user) {
    this.init();
    return axios.get(api_url + "users", user);
  },
  getUsers() {
    this.init();
    return axios.get(api_url + "users")
  },
  deleteUser(id) {
    this.init();
    console.log("environment: ", environment);
    return axios.delete(api_url + "users" + `/${id}`);
  },
  async putUser(user) {
    this.init();
    return axios.put(api_url + "users" + `/${user.id}`, user);
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
  getTravels() {
    this.init();
    return axios.get(api_url + "travels")
  },
  getTravel(id) {
    this.init();
    return axios.get(api_url + "travels/" + id);
  },
  async putTravel(updatedTravel) {
    this.init();
    return axios.put(api_url + "travels" + `/${updatedTravel.id}`)
  },
  deleteTravel(id) {
    this.init();
    return axios.delete(api_url + "travels" + `/${id}`);
  },
};
