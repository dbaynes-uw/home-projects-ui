import axios from "axios";
const api_url = "http://localhost:3000/api/v1/events/";

const state = {
  events: [],
};

const getters = {
  allEvents: (state) => state.events,
};

const actions = {
  /* From mapActions in Events.vue:
  'fetchEvents',
  'deleteEvent',
  */
  //async fetchEvents({ commit }) {
  //  console.log("EVENTS.js fetchEvents");
  //  const response = await axios.get(api_url);
  //  console.log("fetchEvents: ", response.data);
  //  commit("setEvents", response.data);
  //},
  async addEvent({ commit }, name, assigned, description, frequency, notes, histories) {
    console.log("EVENTS.js addEvents");
    const response = await axios.post(api_url, {
      event: {
        name,
        assigned,
        description,
        frequency,
        notes,
        completed: false,
        action_date: null,
        histories,
      },
    });
    commit("newEvent", response.data);
  },
  async filterEvents({ commit }, form) {
    const limit = parseInt(
      form.target.options[form.target.options.selectedIndex].innerText
    );
    const response = await axios.get(api_url + `?_limit=${limit}`);
    commit("setEvents", response.data);
  },
  async pastDue({ commit }, pastDue) {
    pastDue = true;
    const response = await axios.get(api_url + `?_pastDue=${pastDue}`);
    commit("setEvents", response.data);
  },
  async dueBy({ commit }, form) {
    const dueFilter =
      form.target.options[form.target.options.selectedIndex].innerText;
    const response = await axios.get(api_url + `?_dueFilter=${dueFilter}`);
    commit("setEvents", response.data);
  },
};
const mutations = {
  setEvents: (state, events) => (state.events = events),
  newEvent: (state, event) => state.events.unshift(event),
  removeEvent: (state, id) =>
    (state.events = state.events.filter((event) => event.id !== id)),
  setUpdatedEvent: (state, updatedEvent) => {
    const index = state.events.findIndex(
      (event) => event.id === updatedEvent.id
    );
    if (index !== -1) {
      state.events.splice(index, 1, updatedEvent);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
