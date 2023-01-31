import axios from "axios";
import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");
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
  getEvents() {
    return apiClient.get("/events");
  },
  getEvent(id) {
    return apiClient.get("/events/" + id);
  },
  async postEvent(event) {
    return apiClient.post("/events", event);
  },
  putEvent(updatedEvent) {
    console.log("putEvent: updated");
    return apiClient.put("events/" + `/${updatedEvent.id}`);
  },
  //Not Used
  deleteEvent(id) {
    return axios.delete(api_url + `/${id}`);
  },
  // async updateEvent({ commit }, updatedEvent) {
  //   const response = await axios.put(
  //     apiClient + `/${updatedEvent.id}`,
  //     updatedEvent
  //   );
  //   commit("setUpdatedEvent", response.data);
  // },
};
