<template>
  <div
    v-if="event"
    class="event"
    id="center-align"
    @dblclick="onDoubleClick(event)"
    v-bind:class="{ 'is-complete': event.completed }"
  >
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
    <br />
    <router-link :to="{ name: 'EventList' }">
      <i class="fa-solid fa-backward fa-stack-1x"></i>
    </router-link>
    <span class="fa-stack">
      <i
        @click.prevent="removeEvent(event.id)"
        class="fa-solid fa-pen-to-square fa-stack-1x"
      >
      </i>
    </span>
    <span class="fa-stack">
      <i @click="deleteEvent(event.id)" class="fas fa-trash-alt fa-stack-1x">
      </i>
    </span>
    <br />
    <router-link :to="{ name: 'EventList' }">
      <i class="fa-solid fa-backward fa-stack-1x"></i>
    </router-link>
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";
import DateFormatService from "@/services/DateFormatService.js";
import { mapActions } from "vuex";
export default {
  props: ["id"],
  data() {
    return {
      event: null,
    };
  },
  methods: {
    ...mapActions(["updateEvent"]),
    deleteEvent(id) {
      console.log("EventDetails deleteEvent id = ", id);
      EventService.deleteEvent(id)
        .then((response) => {
          this.event = response.data;
          alert("Event was Deleted");
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          console.log("ERROR: ", error);
          console.log(error);
        });
    },
    onDoubleClick(currentEvent) {
      const updatedEvent = {
        id: currentEvent.id,
        description: currentEvent.description,
        notes: currentEvent.notes,
        completed: !currentEvent.completed,
        action_date: currentEvent.action_date,
      };
      //EventService.putEvent(updatedEvent);
      this.updateEvent(updatedEvent);
      console.log("Put Event executed: ", updatedEvent);
      location.reload();
    },
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
#align-right {
  text-align: center;
}
.right-align {
  text-align: right;
}
</style>
