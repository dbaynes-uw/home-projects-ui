<template>
  <!--Garden: {{ garden }}
  Outlet: {{ outlet }}
  -->
  <span v-if="outlet.active == 1">
    <div class="card">
      <ul>
        <li class="li-left">Outlet Name: <b>{{ outlet.outlet_name }}</b></li>
        <li class="li-left">Yard Location: <b>{{  outlet.yard_location }}</b></li>
        <li class="li-left">Faucet Location: <b>{{  outlet.faucet_location }}</b></li>
        <li class="li-left">Line: <b>{{ outlet.line_number }}</b></li>
        <li class="li-left">Status: <b>{{ outlet.active == 1 ? 'Active' : 'Inactive' }}</b></li>
        <li class="li-left">Target: <b><u>{{ outlet.target }}</u></b></li>
        <li class="li-left">Frequency: {{ outlet.frequency }}</li>
        <li class="li-left">Start: {{ formatTime(outlet.start_time)}}</li>
        <li class="li-left">Duration: {{ outlet.duration }}</li>
        <li class="li-left">Notes: <b>{{ outlet.notes }}</b> </li>
        <!--{{ formatYearDate(outlet.date_of_occurrence) }}-->
      </ul>
    </div>
  </span>
</template>
<script>

import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'OutletCard',
  props: {
    outlet: {
      type: Object,
      default: () => ({})
    },
    garden: {
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
