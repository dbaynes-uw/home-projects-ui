<template>
  <div>
    <button id="button-as-link" @click="eventsInactive($event)">
      <u>Inactive Events</u>
    </button>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "EventsInactive",
  methods: mapActions(["eventsInactive"]),
};
</script>

<style scoped>
</style>
