//import axios from "axios";
//const api_url =
//  "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/events/";
//
//const state = {
//  events: [],
//};
//
//const getters = {
//  allEvents: (state) => state.events,
//};
//
//const actions = {
//  /* From mapActions in Events.vue:
//  'fetchEvents',
//  'deleteEvent',
//  */
//  //async fetchEvents({ commit }) {
//  //  const response = await axios.get(api_url);
//  //  commit("setEvents", response.data);
//  //},
//  async addEvent(
//    { commit },
//    name,
//    assigned,
//    description,
//    frequency,
//    notes,
//    histories
//  ) {
//    const response = await axios.post(api_url, {
//      event: {
//        name,
//        assigned,
//        description,
//        frequency,
//        notes,
//        completed: false,
//        action_date: null,
//        action_due_date: null,
//        histories,
//      },
//    });
//    console.log("EVENTS JS @@@@@@@@@@")
//    commit("newEvent", response.data);
//  },
//  //async filterEvents({ commit }, form) {
//  //  const limit = parseInt(
//  //    form.target.options[form.target.options.selectedIndex].innerText
//  //  );
//  //  const response = await axios.get(api_url + `?_limit=${limit}`);
//  //  commit("setEvents", response.data);
//  //},
//  // Replaced with vuex in store.js:
//  //async pastDue({ commit }, pastDue) {
//  //  pastDue = true;
//  //  const response = await axios.get(api_url + `?_pastDue=${pastDue}`);
//  //  commit("setEvents", response.data);
//  //},
//  //async eventsDueBy({ commit }, form) {
//  //  console.log("EVENTS")
//  //  const dueFilter =
//  //    form.target.options[form.target.options.selectedIndex].innerText;
//  //  const response = await axios.get(api_url + `?_dueFilter=${dueFilter}`);
//  //  commit("setEvents", response.data);
//  //},
//};
//const mutations = {
//  setEvents: (state, events) => (state.events = events),
//  newEvent: (state, event) => state.events.unshift(event),
//  removeEvent: (state, id) =>
//    (state.events = state.events.filter((event) => event.id !== id)),
//  setUpdatedEvent: (state, updatedEvent) => {
//    const index = state.events.findIndex(
//      (event) => event.id === updatedEvent.id
//    );
//    if (index !== -1) {
//      state.events.splice(index, 1, updatedEvent);
//    }
//  },
//};
//
//export default {
//  state,
//  getters,
//  actions,
//  mutations,
//};
