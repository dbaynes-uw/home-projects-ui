<template>
  <div v-if="event">
    <h1>{{ event.description }}</h1>
    <p>{{ event.duration }}</p>
    <p>{{ event.frequency }} days</p>
    <p>{{ event.notes }}</p>
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";
export default {
  props: ["id"],
  data() {
    return {
      event: null,
    };
  },
  created() {
    EventService.getEvent(this.id)
      .then((response) => {
        this.event = response.data;
      })
      .catch((error) => {
        console.log("ERROR: ", error);
        console.log(error);
      });
  },
};
</script>
