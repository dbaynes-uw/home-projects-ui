import { createStore } from "vuex";

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
  modules: {},
});
