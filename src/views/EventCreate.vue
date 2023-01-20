<template>
  <h1>Create an event</h1>
  <div class="form-container">
    <form class="add-form" @submit.prevent="onSubmit">
      <label>Description</label>
      <input
        v-model="event.description"
        type="text"
        placeholder="Description"
      />
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
      <label>Notes</label>
      <input v-model="event.notes" type="text" placeholder="Notes" />
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
import EventService from "@/services/EventService.js";

export default {
  data() {
    return {
      frequency: ["7", "10", "14", "21", "30", "60", "90", "120", "360"],
      event: {
        id: "",
        description: "",
        frequency: "",
        notes: "",
        created_by: "dbaynes in eventcreate",
      },
    };
  },
  methods: {
    //Vuex...mapActions(["addEvent"]),
    onSubmit() {
      const event = {
        ...this.event,
        id: uuidv4(),
        created_by: this.$store.state.created_by,
      };
      //0this.addEvent(event);
      //Vuex 2:
      EventService.postEvent(event)
        .then(() => {
          //this.$store.commit("ADD_EVENT", event);
          alert("Event was successfully created");
          this.$router.push({ name: "EventList" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    //...mapGetters(["allEvents"]),
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
.select-box {
  width: 102%;
  height: 44px;
  margin-bottom: -2px;
}
.select-number {
  width: 20%;
  height: 1.75rem;
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

legend {
  font-size: 28px;
  font-weight: 700;
  margin-top: 20px;
}
</style>
