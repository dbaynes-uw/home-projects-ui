<template>
  <div class="eventEdit">
    <h4>Event Edit:</h4>
    <form class="add-form" @submit.prevent="updateEvent">
      <div class="form-container">
        <label for="description">Event Description</label>
        <input
          type="text"
          id="descripton"
          class="form-control"
          v-model="event.description"
          required
        />
        <label for="completed">Status</label>
        <p v-if="event.completed === true">Complete</p>
        <p v-if="event.completed != true">TBD</p>
        <label>Select a Frequency: </label>
        <select class="select-number" v-model="event.frequency">
          <option
            v-for="option in frequency"
            :value="option"
            :key="option"
            :selected="option === event.frequency"
          >
            {{ option }}
          </option>
        </select>
        <br />
        <br />
        <label for="notes">Notes</label>
        <input type="text" v-model="event.notes" id="notes" class="notes" />
        <button class="button" type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
//import EventService from "@/services/EventService.js";
import axios from "axios";
export default {
  async mounted() {
    const result = await axios.get(
      "http://localhost:3000/api/v1/events/" + this.$route.params.id
    );
    this.event = result.data;
  },
  data() {
    return {
      frequency: ["7", "10", "14", "21", "30", "60", "90", "120", "360"],
      event: {
        id: "",
        description: "",
        frequency: "",
        notes: "",
        updated_by: "",
      },
    };
  },
  setup() {
    //description
    //notes
  },
  methods: {
    async updateEvent() {
      const event = {
        ...this.event,
        updated_by: this.$store.state.created_by,
      };
      const result = await axios.put(
        "http://localhost:3000/api/v1/events/" + this.$route.params.id,
        {
          description: this.event.description,
          frequency: this.event.frequency,
          notes: this.event.notes,
        }
      );
      if (result.status >= 200) {
        alert("Event has been updated");
        this.$router.push({ name: "EventDetails", params: { id: event.id } });
      } else {
        alert("Update Error Code ", result.status);
        console.log("ERROR Result Status: ", result.status);
      }
      //Not Yet:console.warn("Edit Event: ", event),
      //Not Yet:  EventService.putEvent(event)
      //Not Yet:    //{
      //Not Yet:    //  description: this.event.description,
      //Not Yet:    //  notes: this.event.notes,
      //Not Yet:    //}
      //Not Yet:    .then(() => {
      //Not Yet:      //this.$store.commit("ADD_EVENT", event);
      //Not Yet:      alert("Event was successfully updated");
      //Not Yet:      this.$router.push({ name: "EventList" });
      //Not Yet:    })
      //Not Yet:    .catch((error) => {
      //Not Yet:      console.log(error);
      //Not Yet:    });
    },
  },
};
</script>
