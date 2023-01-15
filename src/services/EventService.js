import axios from "axios";
import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");

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
  postEvent(event) {
    console.log("postEvent id: ", event);
    return apiClient.post("/events", event);
  },
  putEvent(event) {
    return apiClient.put("events/" + event);
  },
  // async updateEvent({ commit }, updatedEvent) {
  //   const response = await axios.put(
  //     apiClient + `/${updatedEvent.id}`,
  //     updatedEvent
  //   );
  //   commit("setUpdatedEvent", response.data);
  // },
};
