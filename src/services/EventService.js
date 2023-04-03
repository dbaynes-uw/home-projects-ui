import axios from "axios";
import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");
const user_url = "http://localhost:3000/api/v1/users";
const api_url = "http://localhost:3000/api/v1/events/";
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
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
  getEventStats() {
    return apiClient.get("/event_stats");
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
    return apiClient.get("/events");
  },
  getEvent(id) {
    return apiClient.get("/events/" + id);
  },
  async postEvent(event) {
    return apiClient.post("/events", event);
  },
  async postUser(user) {
    return apiClient.post("/users", user);
  },
  getTrails() {
    return apiClient.get("/trails");
  },
  getUsers() {
    return apiClient.get("/users");
  },
  deleteEvent(id) {
    return axios.delete(api_url + `/${id}`);
  },
  deleteUser(id) {
    return axios.delete(user_url + `/${id}`);
  },
  async putEvent(updatedEvent) {
    return axios.put(api_url + `/${updatedEvent.id}`, updatedEvent);
  },
};
