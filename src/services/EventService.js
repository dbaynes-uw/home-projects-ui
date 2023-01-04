import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api/v1/areas/",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
export default {
  getEvents() {
    return apiClient.get("/");
  },
  getEvent(id) {
    return apiClient.get("/" + id);
  },
  postEvent(event) {
    return apiClient.post("/", event);
  },
};
