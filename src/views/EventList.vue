<template>
  <div>
    <h3>ToDos</h3>
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <br />
    <div class="events">
      <div
        v-for="event in allEvents"
        :key="event.id"
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
              <u>{{ event.description }}</u>
            </b>
          </p>
        </router-link>
        <ul class="ul-left">
          <li>{{ event.notes }}</li>
          <li v-if="event.completed">
            Date completed:
            {{ formatStandardDate(event.action_date) }}
          </li>
          <li>{{ event.frequency }} day cycle</li>
          <li v-if="event.action_date">
            {{ formatStandardDate(event.action_date) }}
          </li>
          <li>
            History:
            <ul v-for="(history, index) in event.histories" :key="history.id">
              <li v-if="index == event.histories.length - 1">
                {{ history.notes }}
                on
                {{ formatSystemDate(history.created_at) }}.
              </li>
            </ul>
          </li>
          <li>
            {{ calculateDue(event.action_date, event.frequency) }}
            {{ calculateDateDue(event.action_date, event.frequency) }}
          </li>
        </ul>
        <i @click="deleteEvent(event.id)" class="fas fa-trash-alt"></i>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import EventCard from "@/components/EventCard.vue";
import { mapGetters, mapActions } from "vuex";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "EventList",
  components: {
    //EventCard,
  },
  data() {
    return {
      events: null,
    };
  },
  //data: () => ({
  //  endDate: "",
  //  startDate: "",
  //  dateDiff: 0,
  //}),
  methods: {
    ...mapActions(["fetchEvents", "deleteEvent", "updateEvent"]),
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
  computed: {
    ...mapGetters(["allEvents"]),
  },
  created() {
    this.fetchEvents();
    //EventService.getEvents()
    //  .then((response) => {
    //    console.log("EventList created() events: ", response.data);
    //    this.events = response.data;
    //  })
    //  .catch((error) => {
    //    console.log("Events Error: ", error);
    //  });
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
@media (max-width: 500px) {
  .events {
    grid-template.columns: 1fr;
  }
}
</style>
