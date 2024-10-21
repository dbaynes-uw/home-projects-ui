<template>
  <div class="card">
    <p id="p-custom-left-u">{{ med.description}}</p>
    <ul>
      <li class="li-left">Date: <b>{{ formatStandardDateTime(med.date_of_occurrence) }}</b></li>
      <li class="li-left">Duration: {{ med.duration }}</li>
      <li class="li-left">Since Last:</li>
      <li class="li-left">&nbsp;&nbsp;Days: {{ med.interval_days }} days</li>
      <li class="li-left">&nbsp;&nbsp;Hours: {{ med.interval_hours }} hours</li>
      <li class="li-left">&nbsp;&nbsp;Minutes: {{ med.interval_minutes }} minutes</li>
      <li class="li-left">Notes: <b>{{ med.circumstances }}</b> </li>
    </ul>
  </div>
</template>
<script>

import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'MedCard',
  props: {
    med: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
  }
}
</script>
<style scoped>
</style>
