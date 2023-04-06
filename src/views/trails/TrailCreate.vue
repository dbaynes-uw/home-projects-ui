<template>
  <h1>Create a Trail to Track</h1>
  <div class="form-container">
    <form class="add-form" @submit.prevent="onSubmit">
      <label>Name</label>
      <input
        v-model="trail.head_name"
        type="text"
        class="text-style"
        placeholder="Trail Head Name"
        required
      />
      <label>Trail Location</label>
      <input
        v-model="trail.location"
        type="text"
        class="text-style"
        placeholder="Location"
        required
      />
      <label>Distance</label>
      <input
        v-model="trail.distance"
        type="text"
        class="text-style"
        placeholder="Distance"
        required
      />
      <label>Url to Map</label>
      <input
        v-model="trail.url_to_map"
        type="text"
        class="text-style"
        placeholder="URL to Map"
      />
      <label for="date_last_hiked">Date Last Hiked:</label>
      <input type="date" class="text-style" v-model="trail.date_last_hiked" />
      <label>Notes</label>
      <input
        v-model="trail.notes"
        type="text"
        placeholder="Notes"
        class="text-style"
        required
      />
      <button class="button" type="submit">Submit</button>
    </form>
    <!--Vuex:-->
    <!--div>{{ $store.state.trails }}</div-->
  </div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
//import { mapGetters, mapActions } from "vuex";
//Vuex
//import TrailService from "@/services/TrailService.js";
export default {
  data() {
    return {
      trail: {
        id: "",
        head_name: "",
        location: "",
        distance: "",
        url_to_map: "",
        date_last_hiked: "",
        notes: "",
        created_by: "dbaynes",
      },
    };
  },
  methods: {
    onSubmit() {
      const trail = {
        ...this.trail,
        id: uuidv4(),
        created_by: this.$store.state.user,
      };
      this.$store.dispatch("createTrail", trail);
      alert("Trail was successfully added for" + trail.location);
      this.$router.push({ name: "TrailList" });
    },
  },
  trail() {
    return this.$store.state.trail;
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
