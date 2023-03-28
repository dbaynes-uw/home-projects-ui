<template>
  <div class="eventEdit">
    <h2>Edit Event {{ event.description }}</h2>
    <form class="add-form" @submit.prevent="updateEvent">
      <div class="form-container">
        <label for="action_date">Action Date:</label>
        <input
          type="date"
          class="text-style"
          v-model="event.action_date"
          required
        />
        <label>Whose Turn? </label>
        <select class="text-style" v-model="event.assigned" required>
          <option
            v-for="option in assignees"
            :value="option"
            :key="option"
            :selected="option === event.assigned"
          >
            {{ option }}
          </option>
        </select>
        <br />
        <br />
        <label for="completed">Status: </label>
        <select class="text-style" v-model="event.completed">
          <option value="true">Completed</option>
          <option value="false">TBD</option>
        </select>
        <br />
        <br />
        <label>Select a Frequency: </label>
        <select class="text-style" v-model="event.frequency" required>
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
        <label for="notes">Notes:</label>
        <input
          type="text"
          v-model="event.notes"
          id="notes"
          class="text-style"
          required
        />
        <button class="button" type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
//import EventService from "@/services/EventService.js";
import axios from "axios";
export default {
  props: ["id", "assigned"],
  async mounted() {
    const result = await axios.get(
      "http://localhost:3000/api/v1/events/" + this.$route.params.id
    );
    this.event = result.data;
  },
  data() {
    return {
      assignees: ["David", "Jane", "Both", "Up for Grabs"],
      frequency: ["7", "10", "14", "21", "30", "60", "90", "120", "360"],
      event: {
        id: "",
        action_date: "",
        action_due_date: "",
        description: "",
        assigned: "",
        frequency: "",
        completed: "",
        notes: "",
        updated_by: "",
      },
    };
  },
  setup() {},
  methods: {
    async updateEvent() {
      const event = {
        ...this.event,
        updated_by: this.$store.state.created_by,
      };
      console.log("This event to PUT: ", this.event);
      const result = await axios.put(
        "http://localhost:3000/api/v1/events/" + this.$route.params.id,
        {
          action_date: this.event.action_date,
          description: this.event.description,
          completed: this.event.completed,
          assigned: this.event.assigned,
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
<style>
select {
  border-color: darkgreen;
}
</style>
