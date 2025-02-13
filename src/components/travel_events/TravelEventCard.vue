<template>
  <div class="card">
    <p id="p-custom-left-u">{{ travel_event.title}}</p>
    <ul>
      <li class="li-left">Description: {{ travel_event.description }}</li>
      <li class="li-left">Transportation: {{ travel_event.transport }}</li>
      <li class="li-left">Booking Reference: <b><a :href="travel_event.transport_url" target="_blank">{{ travel_event.booking_reference }}</a></b></li>

      <li class="li-left">Start: {{ formatStandardDateTime(travel_event.start_date) }}</li>
      <li class="li-left">End: {{ formatStandardDateTime(travel_event.end_date) }}</li>
      <li class="li-left">Notes:</li>
      <b class="li-left-none" v-for="(notes, idx) in splitList(travel_event, this.splitLength)" :key="idx">{{ notes }}</b>
    </ul>
  </div>
</template>
<script>

import DateFormatService from "@/services/DateFormatService.js";
import SplitStringService from "@/services/SplitStringService.js";

export default {
  name: 'TravelEventCard',
  props: {
    travel_event: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      splitLength: 30,
    };
  },
  methods: {
    splitList(travelData, splitLength) {
      return SplitStringService.splitList(travelData.notes, splitLength) 
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
  }
}
</script>

<style scoped>
.travel-card {
  width: 100%;
  margin: 1em auto 1em auto;
  padding: 1em;
  border: solid 1px #2c3e50;
  cursor: pointer;
  transition: all 0.2s linear;
}
.travel-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.travel-card h4 {
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.3em;
}
</style>
