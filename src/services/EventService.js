import axios from "axios";
import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");
var apiClient = axios.create({
  baseURL: "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Authorization": axios.defaults.headers.common['Authorization']
  },
});
//const devApiClient = axios.create({
// //baseURL: "http://davids-macbook-pro.local:3000/api/v1/",
// baseURL: "http://localhost:3001/api/v1/",
//  withCredentials: true,
//  headers: {
//    Accept: "application/json",
//    "Content-Type": "application/json",
//    "Authorization": axios.defaults.headers.common['Authorization']
//  },
//});
var environment = "";
var api_url = "";
//const app_token = access_token
export default {
  init() {
    console.log("Event Service Initialized.");
    if (window.location.port == "8080") {
      environment = "development";
      //api_url = "http://davids-macbook-pro.local:3000/api/v1/";
      api_url = "http://localhost:3001/api/v1/";
    } else {
      environment = "production";
      api_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/";
    }
  },
  eventDueBy(form) {
    this.init();
    console.log("environment: ", environment);
    console.log("EventService - dueBy");
    const dueFilter =
      form.target.options[form.target.options.selectedIndex].innerText;
    console.log("EventService - dueFilter: ", dueFilter);
    return apiClient.get("/events" + `?_dueFilter=${dueFilter}`);
  },
  async eventPastDue(pastDue) {
    this.init();
    console.log("environment: ", environment);
    console.log("EventService - pastDue");
    pastDue = true;
    //const response = await axios.get(api_url + `?_pastDue=${pastDue}`);
    return apiClient.get(api_url + "/events" + `?_pastDue=${pastDue}`);
    //commit("setAreas", response.data);
  },
  //async postBook(book) {
  //  this.init();
  //  console.log("environment: ", environment);
  //  return apiClient.post("/books", book);
  //},
  async postBook(book) {
    this.init();
    console.log("ES Post Book: ", book);
    console.log("ES Post Book environment: ", environment);
    console.log("ES Post Book: ", book);
    return axios.post(api_url + 'books', book);
  },
  getBooks() {
    this.init();
    console.log("environment: ", environment);
    console.log("ES get Books with apiClient.get('/books') ");
    console.log("currentPORT: ", window.location.port);
    console.log("TEST USER: ", localStorage.getItem('user'))
    console.log("environment: ", environment);
    if (environment == "production") {
      return apiClient.get("/books");
    } else {
      //return devApiClient.get("/events");
      return axios.get(api_url + "books")
      .catch((error) => {
        console.error("ERROR: ", error)
      })
    }
  },
  getBook(id) {
    this.init();
    console.log("environment: ", environment);
    console.log("apiClient: ", apiClient);
    console.log("getBook - id: ", id);
    return apiClient.get("/books/" + id);
  },
  async putBook(updatedBook) {
    this.init();
    console.log("environment: ", environment);
    return axios.put(api_url + "/books" + `/${updatedBook.id}`, updatedBook);
  },
  deleteBook(id) {
    this.init();
    console.log("environment: ", environment);
    console.log("ES Delete Book: ", id);
    // For Testing: setTimeout(5000);
    return axios.delete(api_url + "/books"`/${id}`);
  },
  getEventStatistics() {
    this.init();
    console.log("environment: ", environment);
    return apiClient.get("/event_statistics");
  },
  getEventsPastDue(statistic) {
    this.init();
    console.log("environment: ", environment);
    console.log("ES - statistic: ", statistic);
    return apiClient.get("/events_past_due/" + `?statistic=${statistic}`);
  },
  getEventStatisticDetail(statistic) {
    this.init();
    console.log("environment: ", environment);
    console.log("ES getEventStatisticDetail - statistic: ", statistic);
    return apiClient.get(
      "/event_statistic_detail/" + `?statistic=${statistic}`
    );
  },
  getEventsAssigned(assigned) {
    this.init();
    console.log("environment: ", environment);
    return apiClient.get("/events_assigned/" + `?assigned=${assigned}`);
  },
  getEvents() {
    this.init();
    console.log("environment: ", environment);
    console.log("ES get Events with apiClient.get('/events') ");
    console.log("currentPORT: ", window.location.port);
    console.log("TEST USER: ", localStorage.getItem('user'))
    console.log("environment: ", environment);
    return axios.get(api_url + "users")
  },
  getEvent(id) {
    this.init();
    console.log("environment: ", environment);
    console.log("apiClient: ", apiClient);
    console.log("getEdit - id: ", id);
    return apiClient.get("/events/" + id);
  },
  async postEvent(event) {
    this.init();
    console.log("environment: ", environment);
    return apiClient.post("/events", event);
  },
  async putEvent(updatedEvent) {
    this.init();
    console.log("environment: ", environment);
    console.log("putEvent updatedEvent.id: ", updatedEvent.id);
    return axios.put(api_url + "books" + `/${updatedEvent.id}`, updatedEvent);
  },
  deleteEvent(id) {
    this.init();
    console.log("environment: ", environment);
    return axios.delete(api_url + "books" + `/${id}`);
  },
  async postUser(user) {
    this.init();
    console.log("environment: ", environment);
    return apiClient.post("/users", user);
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
    console.log("environment: ", environment);
    return apiClient.post("/trails", trail);
  },
  getTrails() {
    this.init();
    console.log("environment: ", environment);
    console.log("ES getTrails");
    return apiClient.get("/trails");
  },
  getTrail(id) {
    this.init();
    console.log("environment: ", environment);
    console.log("apiClient: ", apiClient);
    console.log("getTrail - id: ", id);
    return apiClient.get("/trails/" + id);
  },
  async putTrail(updatedTrail) {
    this.init();
    console.log("environment: ", environment);
    return axios.put(api_url + "trails" + `/${updatedTrail.id}`, updatedTrail);
  },
  deleteTrail(id) {
    this.init();
    console.log("environment: ", environment);
    return axios.delete(api_url + "trails" + `/${id}`);
  },
  async postTravel(travel) {
    this.init();
    console.log("environment: ", environment);
    return apiClient.post("/travels", travel);
  },
  getTravels() {
    this.init();
    console.log("environment: ", environment);
    console.log("ES getTravels");
    //return apiClient.get("/travels");
    return axios.get(api_url + "/traveles")
  },
  getTravel(id) {
    this.init();
    console.log("environment: ", environment);
    console.log("apiClient: ", apiClient);
    console.log("getTravel - id: ", id);
    return apiClient.get("/travels/" + id);
  },
  async putTravel(updatedTravel) {
    this.init();
    console.log("environment: ", environment);
    return axios.put(
      api_url + "travels" + `/${updatedTravel.id}`,
      updatedTravel
    );
  },
  deleteTravel(id) {
    this.init();
    console.log("environment: ", environment);
    console.log("ES Delete Travel: ", id);
    // For Testing: setTimeout(5000);
    return axios.delete(api_url + "travels" + `/${id}`);
  },
};
