<template>
  <h1>Create an Event</h1>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Create an Event View</h3>
    </v-card-title>
  </v-card>
  <router-link :to="{ name: 'EventList' }">
    <h3>Back to Event List</h3>
  </router-link>
  <form class="card-display" @submit.prevent="onSubmit">
    <div class="form-container">
      <v-text-field
        label="Description"
        v-model="event.description"
        required
      />
      <v-text-field
        label="Action Date"
        v-model="event.action_due_date"
        type="date"
      />
      <v-select
        label="Whose Turn?"
        :items="ASSIGNEES"
        v-model="event.assigned"
      >
        <option
          v-for="option in ASSIGNEES"
          :value="option"
          :key="option"
          id="select-box"
          :selected="option === event.assigned"
        >
          {{ option }}
        </option>
      </v-select>
      <v-select
        label="Frequency in Days"
        :items="EVENT_FREQUENCY"
        v-model="event.frequency"
      >
        <option
          v-for="option in EVENT_FREQUENCY"
          :value="option"
          :key="option"
          id="select-box"
          :selected="option === event.frequency"
        >
          {{ option }}
        </option>
      </v-select>
      <v-textarea
        label="Notes"
        v-model="event.notes"
        rows="3"
        cols="40"
      />
      <br>
      <button class="button" id="link-as-button" type="submit">
        Submit
      </button>
    </div>
  </form>
  <!--Vuex:-->
  <!--div>{{ $store.state.events }}</div-->
</template>
<script setup>
import { ASSIGNEES, EVENT_FREQUENCY } from "@/services/constants";
import { v4 as uuidv4 } from "uuid";
</script>
<script>
//import { mapGetters, mapActions } from "vuex";
//Vuex
//import EventService from "@/services/EventService.js";
export default {
  data() {
    return {
      event: {
        description: "",
        assigned: "",
        assigned_email: "",
        frequency: "",
        action_completed_date: "",
        status: "",
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
        status: 'active',
        created_by: this.$store.state.user.resource_owner.email,
      };
      //Xthis.addEvent(event); in events.js
      //Vuex 2:
      this.$store.dispatch("createEvent", event);
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
