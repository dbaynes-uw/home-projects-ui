<template>
  <div class="card">
    
    <p id="p-custom-left-u">{{ outlet.yard_location }} - {{ outlet.faucet_location }}</p>
    <ul>
      <li class="li-left">Status: <b>{{ outlet.active == 1 ? 'Active' : 'Inactive' }}</b></li>
      <li class="li-left">Line: <b>{{ outlet.line_number }}</b></li>
      <li class="li-left">Target: {{ outlet.target }}</li>
      <li class="li-left">Frequency: {{ outlet.frequency }}</li>
      <li class="li-left">Start: {{ formatTime(outlet.start_time)}}</li>
      <li class="li-left">Duration: {{ outlet.duration }}</li>
      <li class="li-left">Notes: <b>{{ outlet.notes }}</b> </li>
      <!--{{ formatYearDate(outlet.date_of_occurrence) }}-->
    </ul>
  </div>
</template>
<script>

import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'OutletCard',
  props: {
    outlet: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    formatTime(value) {
      return DateFormatService.formatTimejs(value);
    },
  }
}
</script>
<style scoped>
</style>
