<template>
  <div class="med-card">
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
.med-card {
  width: 100%;
  margin: 1em auto 1em auto;
  padding: 1em;
  border: solid 1px #2c3e50;
  cursor: pointer;
  transition: all 0.2s linear;
}
.med-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.med-card h4 {
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.3em;
}
</style>
