import axios from "axios";
import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");
const apiClient = axios.create({
  baseURL: "https://davids-macbook-pro.local:3000/api/v1",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
const api_url =
  "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/events/";
const book_api_url =
  "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/books";
const trail_api_url =
  "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/trails";
const user_url =
  "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/users";
const travel_api_url =
  "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/travels";
export default {
  eventDueBy(form) {
    console.log("EventService - dueBy");
    const dueFilter =
      form.target.options[form.target.options.selectedIndex].innerText;
    console.log("EventService - dueFilter: ", dueFilter);
    return apiClient.get("/events" + `?_dueFilter=${dueFilter}`);
  },
  async eventPastDue(pastDue) {
    console.log("EventService - pastDue");
    pastDue = true;
    //const response = await axios.get(api_url + `?_pastDue=${pastDue}`);
    return apiClient.get("/events" + `?_pastDue=${pastDue}`);
    //commit("setAreas", response.data);
  },
  async postBook(book) {
    return apiClient.post("/books", book);
  },
  getBooks() {
    console.log("ES getBooks");
    return apiClient.get("/books");
  },
  getBook(id) {
    console.log("apiClient: ", apiClient);
    console.log("getBook - id: ", id);
    return apiClient.get("/books/" + id);
  },
  async putBook(updatedBook) {
    return axios.put(book_api_url + `/${updatedBook.id}`, updatedBook);
  },
  deleteBook(id) {
    console.log("ES Delete Book: ", id);
    // For Testing: setTimeout(5000);
    return axios.delete(book_api_url + `/${id}`);
  },
  getEventStatistics() {
    return apiClient.get("/event_statistics");
  },
  getEventsPastDue(statistic) {
    console.log("ES - statistic: ", statistic);
    return apiClient.get("/events_past_due/" + `?statistic=${statistic}`);
  },
  getEventStatisticDetail(statistic) {
    console.log("ES getEventStatisticDetail - statistic: ", statistic);
    return apiClient.get(
      "/event_statistic_detail/" + `?statistic=${statistic}`
    );
  },
  getEventsAssigned(assigned) {
    return apiClient.get("/events_assigned/" + `?assigned=${assigned}`);
  },
  getEvents() {
    console.log("ES get Events");
    return apiClient.get("/events");
  },
  getEvent(id) {
    console.log("apiClient: ", apiClient);
    console.log("getEdit - id: ", id);
    return apiClient.get("/events/" + id);
  },
  async postEvent(event) {
    return apiClient.post("/events", event);
  },
  async putEvent(updatedEvent) {
    console.log("putEvent updatedEvent.id: ", updatedEvent.id);
    return axios.put(api_url + `/${updatedEvent.id}`, updatedEvent);
  },
  deleteEvent(id) {
    return axios.delete(api_url + `/${id}`);
  },
  async postUser(user) {
    return apiClient.post("/users", user);
  },
  getUsers() {
    return apiClient.get("/users");
  },
  deleteUser(id) {
    return axios.delete(user_url + `/${id}`);
  },
  async postTrail(trail) {
    return apiClient.post("/trails", trail);
  },
  getTrails() {
    console.log("ES getTrails");
    return apiClient.get("/trails");
  },
  getTrail(id) {
    console.log("apiClient: ", apiClient);
    console.log("getTrail - id: ", id);
    return apiClient.get("/trails/" + id);
  },
  async putTrail(updatedTrail) {
    return axios.put(trail_api_url + `/${updatedTrail.id}`, updatedTrail);
  },
  deleteTrail(id) {
    return axios.delete(trail_api_url + `/${id}`);
  },
  async postTravel(travel) {
    return apiClient.post("/travels", travel);
  },
  getTravels() {
    console.log("ES getTravels");
    return apiClient.get("/travels");
  },
  getTravel(id) {
    console.log("apiClient: ", apiClient);
    console.log("getTravel - id: ", id);
    return apiClient.get("/travels/" + id);
  },
  async putTravel(updatedTravel) {
    return axios.put(travel_api_url + `/${updatedTravel.id}`, updatedTravel);
  },
  deleteTravel(id) {
    console.log("ES Delete Travel: ", id);
    // For Testing: setTimeout(5000);
    return axios.delete(travel_api_url + `/${id}`);
  },
};
