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
      <li class="li-left">Notes:</li> <!-- {{med.circumstances}}</li>-->
      <b class="li-left-none" v-for="(circumstance, idx) in splitList(med, this.splitLength)" :key="idx">{{ circumstance }}</b>
    </ul>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import SplitStringService from "@/services/SplitStringService.js";
export default {
  name: 'MedCard',
  props: {
    med: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      splitLength: 30,
    }
  },
  methods: {
    splitList(medData, splitLength) {
      return SplitStringService.splitList(medData.circumstances, splitLength) 
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
  }
}
</script>
<style scoped>
</style>
