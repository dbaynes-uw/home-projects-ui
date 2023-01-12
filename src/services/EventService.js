import axios from "axios";

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
    return apiClient.get("/areas");
  },
  getEvent(id) {
    return apiClient.get("/areas/" + id);
  },
  postEvent(id) {
    console.log("postEvent id: ", id);
    return apiClient.post("/areas", id);
  },
  putEvent(event) {
    return apiClient.put("areas/" + event);
  },
  // async updateEvent({ commit }, updatedEvent) {
  //   const response = await axios.put(
  //     apiClient + `/${updatedEvent.id}`,
  //     updatedEvent
  //   );
  //   commit("setUpdatedArea", response.data);
  // },
};
