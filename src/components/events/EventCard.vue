<template>
  <!--div class="legend">
    <span>Double click to mark as complete.</span>
    <span><span class="incomplete-box"></span> = Incomplete</span>
    <span><span class="complete-box"></span> = Complete</span>
  </div-->
  <div class="event-card">
    <h2><b>{{ formatDayOfWeek(event.action_due_date) }}</b></h2>

    <p id="p-custom-u">
      <router-link
        :to="{ name: 'EventEdit', params: { id: `${event.id}` } }"
      >
        {{ event.description }}
      </router-link>
    </p>
    <ul>
      <li class="li-left-capitalize">Active: <b>{{ event.status }}</b> </li>
      <li class="li-left">Assigned To: <b>{{ event.assigned }}</b></li>
      <li class="li-left">Last Action: {{ formatYearDate(event.action_completed_date) }}</li>
      <li class="li-left">Every {{ event.frequency }} days</li>
      <li class="li-left">Due: <b>{{ formatYearDate(event.action_due_date) }}</b> </li>
      <li class="li-left">Notes:</li>
      <b class="li-left-none" v-for="(notes, idx) in joinedNotes(event)" :key="idx">{{ notes }}</b>

    </ul>
  </div>
</template>
<script>

import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'EventCard',
  props: {
    event: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    joinedNotes(e) {
      return e.notes.split('\n');
    },
    formatDayOfWeek(value) {
      return DateFormatService.formatDayOfWeekjs(value);
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
  }
}
</script>

<style scoped>
.event-card {
  width: 100%;
  margin: 1em auto 1em auto;
  padding: 1em;
  border: solid 1px #2c3e50;
  cursor: pointer;
  /*transition: all 0.2s linear;*/
}
.event-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.event-card h4 {
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.3em;
}
</style>
