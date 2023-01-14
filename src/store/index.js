import { createStore } from "vuex";
import events from "@/store/modules/events";
export default createStore({
  state: {
    created_by: "dbaynes",
    events: [],
  },
  getters: {},
  mutations: {
    ADD_EVENT(state, event) {
      state.events.push(event);
    },
  },
  actions: {},
  modules: {
    events,
  },
});
