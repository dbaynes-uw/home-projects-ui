<template>
  <div>
    <h3>Events</h3>
    <div>
      <DueBy />
    </div>
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <br />
    <div class="events">
      <div
        v-for="event in events"
        :key="event.id"
        :event="event"
        class="event"
        @dblclick="onDoubleClick(event)"
        v-bind:class="{ 'is-complete': event.completed }"
      >
        <router-link
          :to="{ name: 'EventDetails', params: { id: event.id } }"
          v-bind:class="{ 'is-complete-for-link': event.completed }"
        >
          <p class="p-align-left">
            <b>
              <u>Event Details for {{ event.description }}</u>
            </b>
          </p>
        </router-link>
        <ul class="ul-left">
          <li>
            <router-link
              :to="{
                name: 'EventsAssigned',
                params: { assigned: event.assigned },
              }"
              v-bind:class="{ 'is-complete-for-link': event.completed }"
            >
              <b>{{ event.assigned }}</b>
            </router-link>
          </li>
          <li>{{ event.notes }}</li>
          <li v-if="event.completed">
            Date completed:
            {{ formatStandardDate(event.action_date) }}
          </li>
          <li>{{ event.frequency }} day cycle</li>
          <li>
            Action Date:
            {{ formatStandardDate(event.action_date) }}
          </li>
          <li>
            Date Due:
            {{ calculateDue(event.action_date, event.frequency) }}
            {{ calculateDateDue(event.action_date, event.frequency) }}
          </li>
          <li>
            Latest Changes:
            <ul v-for="(history, index) in event.histories" :key="history.id">
              <span v-if="index >= event.histories.length - 1">
                <li v-html="history.notes"></li>
              </span>
            </ul>
          </li>
        </ul>
        <br />
        <span class="fa-stack">
          <router-link
            :to="{ name: 'EventEdit', params: { id: `${event.id}` } }"
          >
            <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
          </router-link>
        </span>
        <span class="fa-stack">
          <i @click="deleteEvent(event)" class="fas fa-trash-alt fa-stack-1x">
          </i>
        </span>
      </div>
    </div>
    <!--div>{{ $store.state.events }}</div-->
  </div>
</template>

<script setup>
import DueBy from "@/components/DueBy.vue";
</script>
<script>
// @ is an alias to /src
import DateFormatService from "@/services/DateFormatService.js";
export default {
  components: {
    DueBy,
  },
  props: ["id", "assigned"],
  //data() {},
  data() {
    return {
      DueBy: null,
      eventList: null,
      updatedEvent: null,
    };
  },
  methods: {
    onDoubleClick(event) {
      var updatedEvent = event;
      updatedEvent.completed = !event.completed;
      this.$store.dispatch("updateEvent", updatedEvent);
    },
    deleteEvent(event) {
      this.$store.dispatch("deleteEvent", event);
      alert("Event was Deleted for " + event.description);
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
    this.$store.dispatch("fetchEvents");
  },
  computed: {
    events() {
      return this.$store.state.events;
    },
  },
};
</script>
<style>
.events {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
.event {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
.event-link {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
i {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #fff;
  cursor: pointer;
}
.legend {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}
.complete-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #35495e;
}
.incomplete-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #41b882;
}
.is-complete {
  background: #35495e;
  color: #fff;
}
.is-complete-for-link {
  color: #41b883;
}
select {
  border-color: darkgreen;
}
.fa-table {
  margin-top: 1rem;
}
@media (max-width: 500px) {
  .events {
    grid-template.columns: 1fr;
  }
}
</style>
