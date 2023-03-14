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
    const dueFilter =
      form.target.options[form.target.options.selectedIndex].innerText;
    return apiClient.get("/events" + `?_dueFilter=${dueFilter}`);
  },
  getEventStats() {
    return apiClient.get("/event_stats");
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
  getUsers() {
    return apiClient.get("/users");
  },
  deleteEvent(id) {
    console.log("ES deleteEvent id: ", id);
    return axios.delete(api_url + `/${id}`);
  },
  deleteUser(id) {
    console.log("ES deleteUser id: ", id);
    return axios.delete(user_url + `/${id}`);
  },
  async putEvent(updatedEvent) {
    return axios.put(api_url + `/${updatedEvent.id}`, updatedEvent);
  },
};
