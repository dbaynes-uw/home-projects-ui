<template>
  <div class="events">
    <div
      v-for="event in events"
      :key="event.id"
      :event="event"
      @dblclick="onDoubleClick(event)"
      class="event"
      v-bind:class="{ 'is-complete': event.completed }"
    >
      <!--div class="events">
        <EventCard v-for="event in events" :key="event.id" :event="event" />
      </div-->
      <router-link :to="{ name: 'EventDetails', params: { id: event.id } }">
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
          {{ format_date(event.action_date) }}
        </li>
        <li>{{ event.frequency }} day cycle</li>
        <li v-if="event.action_date">
          {{ format_date(event.action_date) }}
          <span v-for="(history, index) in event.histories" :key="history.id">
            <div v-if="index == event.histories.length - 1">
              History: {{ history.notes }}
              on
              {{ format_system_date(history.created_at) }}.
            </div>
          </span>
        </li>
        <li>
          {{ caculateDue(event.action_date, event.frequency) }}:
          {{ caculateDueDate(event.action_date, event.frequency) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import EventCard from "@/components/EventCard.vue";
import EventService from "@/services/EventService";
import moment from "moment-timezone";
moment.tz.setDefault("America/Los_Angeles");
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
    format_date(value) {
      if (value) {
        console.log("Format Date: ", value);
        value = moment(value).format("MM/DD/YY");
        return value;
      }
    },
    format_system_date(value) {
      if (value) {
        console.log("Format Date: ", value);
        value = moment(value).format("MM/DD/YY");
        return value;
      }
    },
    onDoubleClick(currentEvent) {
      const updatedEvent = {
        id: currentEvent.id,
        description: currentEvent.description,
        notes: currentEvent.notes,
        completed: !currentEvent.completed,
        action_date: currentEvent.action_date,
      };
      EventService.putEvent(updatedEvent);
      console.log("Put Event executed: ", updatedEvent);
      // location.reload();
    },
    caculateDueDate(action_date, frequency) {
      let returnMessage = "";
      let dateCompleted = moment(action_date);
      let dueDate = moment(dateCompleted).add(frequency, "days");
      returnMessage = `${moment(dueDate).format("MM/DD/YY")}`;
      return returnMessage;
    },
    caculateDue(action_date, frequency) {
      let returnMessage = "";
      let start = moment(new Date());
      let end = moment(action_date);
      let duration = end.diff(start, "days") + frequency;

      if (duration >= 0) {
        returnMessage = "Due: " + duration + " Days";
      } else {
        duration = duration * -1;
        returnMessage = "OverDue:" + duration + " Days!";
      }
      return returnMessage;
    },
  },
  created() {
    EventService.getEvents()
      .then((response) => {
        console.log("EventList created() events: ", response.data);
        this.events = response.data;
      })
      .catch((error) => {
        console.log("Events Error: ", error);
      });
  },
};
</script>
<style scoped>
.events {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
event-link {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
</style>
