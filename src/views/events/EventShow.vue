<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <router-link :to="{name: 'EventList'}">
      <h2>Event Details</h2>
    </router-link>
    <router-link
      :to="{name: 'EventStatisticDetail',
            params: { statistic: 'assigned-' + event.assigned }}"
      >
      <h2>Events Assigned to {{ event.assigned }}</h2>
    </router-link>
    <br />
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>    
    <div class="card-display">
      <EventCard
      class="card"
      :event="event"
      @dblclick="editEvent(event)"
      v-bind:class="{ 'is-complete': event.completed }"
      />
    </div>
    <br />
    <div class="card-footer">
      <button 
        @click.stop="toggleHistory"
        id="button-as-link"
        class="history-btn"
        :class="{ 'active': showHistory }"
        v-if="event.histories && event.histories.length > 0"
      >
        <i :class="showHistory ? 'fa-eye-slash' : 'fa-eye'"></i>
        {{ showHistory ? 'Hide' : 'Show' }} History ({{ historyCount }})
      </button>
    </div>
    <br/> 
    <!-- ✅ HISTORY SECTION IN CARD -->
    <div v-if="showHistory" class="card-history">
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
      <p id="p-custom-left">History:</p>
      <ul class="ul-left" v-for="(event_history) in event.histories" :key="event_history.id">
        <span v-if="event.id == event_history.event_id">
          <li>
            <span v-html="formatStandardDateTime(event_history.created_at)"></span> - <b><span v-html="event_history.notes"></span></b>
          </li>
        </span>
      </ul>
    </div>    
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
      showHistory: false,
      history: null,
      assigned: "",
      updatedEvent: null,
      eventsAssigned: null,
    };
  },
  computed: {
    event() {
      return this.$store.state.event;
    },
    filteredHistory() {
      if (!this.event || !this.event.histories) {
        return [];
      }
      // Sort histories by created_at date descending
      return this.event.histories.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    historyCount() {
      return this.event && this.event.histories ? this.event.histories.length : 0;
    },
  },
  methods: {
    toggleHistory() {
      this.showHistory = !this.showHistory;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
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
