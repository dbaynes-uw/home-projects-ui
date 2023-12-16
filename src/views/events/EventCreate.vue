<template>
  <h1>Create an Event</h1>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Create an Event View</h3>
    </v-card-title>
  </v-card>
  <div class="form-container">
    <form class="add-form" @submit.prevent="onSubmit">
      <label>Description</label>
      <input
        v-model="event.description"
        type="text"
        class="text-style"
        placeholder="Description"
        required
      />
      <label for="action_date">Action Date:</label>
      <input
        type="date"
        class="text-style"
        v-model="event.action_date"
        required
      />
      <label>Whose Turn? </label>
      <select
        id="select-box"
        class="text-style"
        v-model="event.assigned"
        required
      >
        <option
          v-for="option in assignees"
          :value="option"
          :key="option"
          id="select-box"
          :selected="option === event.assigned"
        >
          {{ option }}
        </option>
      </select>
      <br />
      <label>Select a Frequency: </label>
      <select
        id="select-box"
        class="text-style"
        v-model="event.frequency"
        required
      >
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
      <label>Notes</label>
      <input
        v-model="event.notes"
        type="text"
        placeholder="Notes"
        class="text-style"
        required
      />
      <button class="button" type="submit">Submit</button>
    </form>
    <!--Vuex:-->
    <!--div>{{ $store.state.events }}</div-->
  </div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
//import { mapGetters, mapActions } from "vuex";
//Vuex
//import EventService from "@/services/EventService.js";
export default {
  data() {
    return {
      assignees: ["David", "Jane", "Both", "Up for Grabs"],
      frequency: ["7", "10", "14", "21", "30", "60", "90", "120", "360"],
      event: {
        id: "",
        description: "",
        assigned: "",
        assigned_email: "",
        frequency: "",
        action_completed_date: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
    };
  },
  methods: {
    //Vuex...mapActions(["addEvent"]),
    onSubmit() {
      const event = {
        ...this.event,
        id: uuidv4(),
        created_by: this.$store.state.user.resource_owner.email,
      };
      //Xthis.addEvent(event); in events.js
      //Vuex 2:
      console.log("EVENT to be CREATED: ", event)
      this.$store.dispatch("createEvent", event);
      alert("Event was successfully added for " + event.description);
      this.$router.push({ name: "EventList" });
    },
  },
  event() {
    return this.$store.state.event;
  },
};
</script>
<style>
.add-form {
  display: flex;
  flex-direction: column;
  width: 425px;
  padding: 20px;
  margin: 40px;
  border: 2px solid #d8d8d8;
  background-color: white;
  -webkit-box-shadow: 0px 2px 15px -12px rgba(0, 0, 0, 0.57);
  -moz-box-shadow: 0px 2px 15px -12px rgba(0, 0, 0, 0.57);
  box-shadow: 2px 15px -12px rgba(0, 0, 0, 0.57);
}
#notes {
  width: 100%;
  height: 4rem;
}
.button {
  margin: 30px;
  background-color: #39495c;
  border-radius: 5px;
  font-size: 18px;
  width: 160px;
  height: 60px;
  color: white;
  padding: 20px;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
    inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
    inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
  text-align: center;
  cursor: pointer;
}
label {
  font-size: 20px;
  margin-bottom: 5px;
}
input {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
}
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}
select {
  border-color: darkgreen;
}
legend {
  font-size: 28px;
  font-weight: 700;
  margin-top: 20px;
}
</style>
