import axios from "axios";
import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");
//var apiClient = axios.create({
//  baseURL: "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/",
//  withCredentials: false,
//  headers: {
//    Accept: "application/json",
//    "Content-Type": "application/json",
//    "Authorization": axios.defaults.headers.common['Authorization']
//  },
//});
var environment = "";
var api_url = "";
export default {
  init() {
    console.log("Event Service Initialized.");
    console.log("UI PORT IS: ", window.location.port)
    if (window.location.port == "8080") {
      environment = "development";
      //api_url = "http://davids-macbook-pro.local:3000/api/v1/";
      //api_url = "http://localhost:3001/api/v1/";
      api_url = axios.create({
        baseURL: "https://localhost:3001/api/v1/",
        withCredentials: false,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": axios.defaults.headers.common['Authorization']
        },
      })
    } else {
      environment = "production";
      api_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/";
    }
    console.log("API_URL: ", api_url);
    //axios.defaults.headers.common = { 'Authorization': 'Bearer '+localStorage.getItem('accessToken') }
    console.log("AXIOS Defaults: ", axios.defaults.headers.common)
  },
  eventDueBy(form) {
    this.init();
    const dueFilter =
      form.target.options[form.target.options.selectedIndex].innerText;
    return axios.get(api_url + "events" + `?_dueFilter=${dueFilter}`);
  },
  async eventPastDue(pastDue) {
    this.init();
    pastDue = true;
    return axios.get(api_url + "events" + `?_pastDue=${pastDue}`);
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
    return axios.get(api_url + "books/" + `${book.id}`);
    //fetch(api_url + "books/" + `${book.id}`, {method: 'DELETE'})
    //.then(() => this.status = 'Delete successful');
  },
  getEventStatistics() {
    this.init();
    return axios.get(api_url + "event_statistics");
  },
  getEventsPastDue(statistic) {
    this.init();
    return axios.get(api_url + "events_past_due/" + `?statistic=${statistic}`);
  },
  getEventStatisticDetail(statistic) {
    this.init();
    return axios.get(api_url + "event_statistic_detail/" + `?statistic=${statistic}`)
  },
  getEventsAssigned(assigned) {
    this.init();
    return axios.get(api_url + "events_assigned/" + `?assigned=${assigned}`);
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
  getEvent(id) {
    this.init();
    return axios.get(api_url + "events/" + id);
  },
  async postEvent(event) {
    this.init();
    return axios.post(api_url + "events", event);
  },
  async putEvent(updatedEvent) {
    this.init();
    return axios.put(api_url + "books" + `/${updatedEvent.id}`, updatedEvent);
  },
  deleteEvent(id) {
    this.init();
    return axios.delete(api_url + "books" + `/${id}`);
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
    return axios.get(api_url + "traveles")
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
