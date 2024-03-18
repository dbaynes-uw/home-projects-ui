<template>
  <div class="card">
    <p id="p-custom-left-u">{{ med.description}}</p>
    <ul>
      <li class="li-left">Date: <b>{{ formatYearDate(med.date_of_occurrence) }}</b></li>
      <li class="li-left">Duration: {{ med.duration }}</li>
      <li class="li-left">Interval: {{ med.interval }} days</li>
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
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
  }
}
</script>
<style scoped>
</style>
