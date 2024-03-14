<template>
  <div class="card">
    <p id="p-custom-left-u">{{ trail.trail_head_name}}</p>
    <ul>
      <li class="li-left">Location: <b>{{ trail.location }}</b></li>
      <li class="li-left">Distance: {{ trail.distance }}</li>
      <li class="li-left">When: {{ formatYearDate(trail.date_last_hiked) }}</li>
      <li class="li-left">Notes: <b>{{ trail.notes }}</b> </li>
    </ul>
  </div>
</template>
<script>

import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'TrailCard',
  props: {
    trail: {
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
.trail-card {
  width: 100%;
  margin: 1em auto 1em auto;
  padding: 1em;
  border: solid 1px #2c3e50;
  cursor: pointer;
  transition: all 0.2s linear;
}
.trail-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.trail-card h4 {
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.3em;
}
</style>
