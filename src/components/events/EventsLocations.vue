<template>
  <span class="div-select">
    Location:
    <select v-model="selectedLocationValue" class="border-select" @change="eventsLocations($event)">
      <option></option>
      <option>All Locations</option>
      <option>Home</option>
      <option>Birch Bay</option>
      <option>Seattle</option>
    </select>
  </span>
</template>
<script setup>
import { mapActions } from "vuex";
</script>
<script>
export default {
  name: "EventsLocations",
  methods: mapActions(["eventsLocations"]),
};
</script>
