<template>
  <div v-if="event" class="event" id="center-align">
    <h1>{{ event.description }}</h1>
    <ul class="ul-left">
      <li>Notes: {{ event.notes }}</li>
      <li v-if="event.completed">
        Date completed:
        {{ formatStandardDate(event.action_date) }}
      </li>
      <li>{{ event.frequency }} day cycle</li>
      <li>
        {{ calculateDue(event.action_date, event.frequency) }}
        {{ calculateDateDue(event.action_date, event.frequency) }}
      </li>
      <li v-if="event.action_date">
        History:
        <ul v-for="(history, index) in event.histories" :key="history.id">
          <li v-if="index == event.histories.length - 1">
            {{ history.notes }}
            on
            {{ formatSystemDate(history.created_at) }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  props: ["id"],
  data() {
    return {
      event: null,
    };
  },
  methods: {
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
    formatSystemDate(value) {
      return DateFormatService.formatSystemDate(value);
    },
    calculateDue(action_date, frequency) {
      return DateFormatService.calculateDue(action_date, frequency);
    },
    calculateDateDue(action_date, frequency) {
      return DateFormatService.calculateDateDue(action_date, frequency);
    },
  },
  created() {
    EventService.getEvent(this.id)
      .then((response) => {
        this.event = response.data;
      })
      .catch((error) => {
        console.log("ERROR: ", error);
        console.log(error);
      });
  },
};
</script>
<style scoped>
#center-align {
  text-align: center;
}
</style>
