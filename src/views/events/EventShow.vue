<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <router-link
      :to="{
          name: 'EventStatisticDetail',
          params: { statistic: 'assigned-' + event.assigned },
        }"
      >
      <h2>Event Detail</h2>
    </router-link>
    <div class="card-display">
      <EventCard
      class="card"
      :event="event"
      @dblclick="editEvent(event)"
      v-bind:class="{ 'is-complete': event.completed }"
      />
    </div>
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <br />
    <div
      v-if="event"
      class="event"
      id="center-align"
      @dblclick="editEvent(event)"
      v-bind:class="{ 'is-complete': event.completed }"
    >
      <h1>
        <b>{{ event.description }}</b>
      </h1>
      <p id="p-custom-left">Notes:</p>
      <ul class="ul-left">
        <li>
          {{ event.notes }}
        </li>
      </ul>
      <p id="p-custom-left">History:</p>
      <ul class="ul-left" v-for="(event_history) in event.histories" :key="event_history.id">
        <span v-if="event.id == event_history.event_id">
          <li>
            <span v-html="formatStandardDateTime(event_history.created_at)"></span> - <b><span v-html="event_history.notes"></span></b>
          </li>
        </span>
      </ul>
      <br />
      <router-link :to="{ name: 'EventList' }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
      <span class="fa-stack">
        <router-link :to="{ name: 'EventEdit', params: { id: `${event.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteEvent(event)" class="fas fa-trash-alt fa-stack-1x">
        </i>
      </span>
      <br />
      <router-link :to="{ name: 'EventList' }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
    </div>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import EventCard from '@/components/events/EventCard'

export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
    EventCard,
  },
  data() {
    return {
      history: null,
      assigned: "",
      updatedEvent: null,
      eventsAssigned: null,
    };
  },
  methods: {
    async deleteEvent(event) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Event",
        message:
          "Are you sure you want to delete " +
          event.description +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteEvent", event);
        alert("Event was Deleted for " + event.description);
        this.$router.push({ name: "EventList" });
      }
    },
    editEvent(event) {
      this.$router.push({ name: 'EventEdit', params: { id: `${event.id}` } });
      //var updatedEvent = event;
      //console.log("STATUS: ", event.status)
      //updatedEvent.status = event.status == 'active' ? 'inactive' : 'active';
      //this.$store.dispatch("updateEvent", updatedEvent);

    },
    datePastDue(value) {
      return DateFormatService.datePastDuejs(value);
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
    formatSystemDate(value) {
      return DateFormatService.formatSystemDatejs(value);
    },
    calculateDue(action_completed_date, frequency) {
      return DateFormatService.calculateDuejs(action_completed_date, frequency);
    },
    calculateDateDue(action_completed_date, frequency) {
      return DateFormatService.calculateDateDuejs(action_completed_date, frequency);
    },
  },
  created() {
    this.$store.dispatch("fetchEvent", this.id);
    //EventService.getEvent(this.id)
    //  .then((response) => {
    //    this.event = response.data;
    //  })
    //  .catch((error) => {
    //    console.log("ERROR: ", error);
    //    console.log(error);
    //  });
  },
  computed: {
    event() {
      return this.$store.state.event;
    },
  },
};
</script>
<style scoped>
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

#align-right {
  text-align: center;
}
.right-align {
  text-align: right;
}
</style>
