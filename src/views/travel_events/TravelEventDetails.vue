<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Travel Event Details</h1>
  <router-link :to="{ name: 'TravelList' }">
     <h3>Back to Travel List</h3>
  </router-link>
    <router-link
      :to="{ name: 'TravelDetails', params: { id: this.travel_event.travel_id} }"
    >
      <h3>Back to {{ travel.title }} Travel</h3>
    </router-link>
  <br/>
  <div class="card-display">
    <TravelEventCard
      :key="travel_event.id"
      :travel_event="travel_event"
      />
  </div>
</template>
<script>

import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import TravelEventCard from "@/components/travel_events/TravelEventCard.vue";
export default {
  name: 'TravelEventDetails',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  components: {
    ConfirmDialogue,
    TravelEventCard,
  },
  created() {
    this.$store.dispatch("fetchTravelEvent", this.id)
  },
  computed: {
    travel_event() {
      return this.$store.state.travel_event;
    },
    travel() {
      return this.$store.state.travels.find((travel) => travel.id === this.travel_event.travel_id)
     },
  },
  data() {
    return {
      updatedTravelEvent: null,
    };
  },
  methods: {
    editTravelEvent(event) {
      this.$router.push({ name: 'TravelEventEdit', params: { id: `${event.id}` } });
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
};
</script>
<style scoped>
</style>
