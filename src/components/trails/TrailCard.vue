<template>
  <div class="card">
    <p id="p-custom-left-u">{{ trail.trail_head_name}}</p>
    <ul>
      <li class="li-left">Location: <b>{{ trail.location }}</b></li>
      <li class="li-left">Distance: {{ trail.distance }}</li>
      <li class="li-left">When: {{ formatYearDate(trail.date_last_hiked) }}</li>
      <li class="li-left">Notes:</li>
      <b class="li-left-none" v-for="(notes, idx) in splitList(trail, this.splitLength)" :key="idx">{{ notes }}</b>
    </ul>
  </div>
</template>
<script>

import DateFormatService from "@/services/DateFormatService.js";
import SplitStringService from "@/services/SplitStringService.js";

export default {
  name: 'TrailCard',
  props: {
    trail: {
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
    splitList(trailData, splitLength) {
      console.log("SplitList: ", trailData.notes)
      return SplitStringService.splitList(trailData.notes, splitLength) 
    },
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
