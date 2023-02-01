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
    <div>{{ $store.state.events }}</div>
  </div>
</template>

<script>
// @ is an alias to /src
import EventService from "@/services/EventService.js";
//import { mapActions } from "vuex";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "EventList",
  components: {
    //EventCard,
  },
  props: ["id"],
  //data() {},
  data() {
    return {
      eventList: null,
    };
  },
  //data: () => ({
  //  endDate: "",
  //  startDate: "",
  //  dateDiff: 0,
  //}),
  methods: {
    //...mapActions(["updateEvent"]),
    onDoubleClick(currentEvent) {
      const updatedEvent = {
        id: currentEvent.id,
        description: currentEvent.description,
        notes: currentEvent.notes,
        completed: !currentEvent.completed,
        action_date: currentEvent.action_date,
      };
      //Works:EventService.putEvent(updatedEvent)
      //Works, too:  .then((response) => {
      //Works, too:    this.event = response.data;
      //Works, too:    location.reload();
      //Works, too:  })
      //Works, too:  .catch((error) => {
      //Works, too:    console.log("ERROR: ", error);
      //Works, too:    console.log(error);
      //Works, too:  });
      //  this.updateEvent(updatedEvent);
      //console.log("EventList updatedEvent: ", updatedEvent);
      this.$store.dispatch("updateEvent", updatedEvent);
      alert("Event was successfully added for " + updatedEvent.description);
      location.reload();
    },
    deleteEvent(id) {
      EventService.deleteEvent(id)
        .then((response) => {
          this.event = response.data;
          alert("Event was Deleted");
          location.reload();
        })
        .catch((error) => {
          console.log("ERROR: ", error);
          console.log(error);
        });
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
    //this.fetchEvents();
    //EventService.getEvents()
    //  .then((response) => {
    //    this.commit("SET_EVENTS", response.data);
    //    //console.log("EventList created() events: ", response.data);
    //    //this.events = response.data;
    //    //this.events.forEach((eventState) => {
    //    //  this.$store.dispatch("addEventState", eventState);
    //    //  //this.$store.commit("ADD_EVENT", eventState);
    //    //  console.log("Event Committed: ", eventState);
    //    //  //return apiClient.post("/events", e);
    //    //});
    //  })
    //  .catch((error) => {
    //    console.log("Events Error: ", error);
    //  });
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
@media (max-width: 500px) {
  .events {
    grid-template.columns: 1fr;
  }
}
</style>
