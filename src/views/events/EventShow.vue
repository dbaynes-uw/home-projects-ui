<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h3>Event Detail</h3>
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
      @dblclick="onDoubleClick(event)"
      v-bind:class="{ 'is-complete': event.completed }"
    >
      <h1>
        <b>{{ event.description }}</b>
      </h1>
      <ul class="ul-left">
        <li>
          <b>{{ event.notes }}</b>
        </li>
        <li v-if="event.assigned">
          Whose Turn?
          <router-link
            :to="{
              name: 'EventStatisticDetail',
              params: { statistic: 'assigned-' + event.assigned },
            }"
          >
            <b>{{ event.assigned }}</b>
          </router-link>
        </li>
        <li v-if="event.completed">
          Date completed:
          <b>{{ formatStandardDate(event.action_date) }}</b>
        </li>
        <li>
          Action Date:
          <b>{{ formatStandardDate(event.action_date) }}</b>
        </li>
        <li>
          How Often:
          <b>Every {{ event.frequency }} days</b>
        </li>
        <li>
          Date Due:
          <b>{{ formatStandardDate(event.action_due_date) }} - </b>
          <span v-if="datePastDue(event.action_date, event.frequency)">
            <span style="color: red; font-weight: bold">
              {{ calculateDue(event.action_date, event.frequency) }}
              {{ calculateDateDue(event.action_date, event.frequency) }}
            </span>
          </span>
          <span v-else>
            <span>
              {{ calculateDue(event.action_date, event.frequency) }}
              {{ calculateDateDue(event.action_date, event.frequency) }}
            </span>
          </span>
        </li>
        <li v-if="event.action_date">
          History:
          <!--ul
            v-for="(history, index) in event.histories.slice.reverse"
            :key="history.id"
          -->
          <!--ul
            v-for="(history, index) in event.histories.reverse"
            :key="history.id"
          -->
          <ul v-for="(history, index) in event.histories" :key="history.id">
            <span v-if="index < 5">
              <li>
                <!--b>{{ formatStandardDateTime(history.created_at) }}</b-->
                <span v-html="formatStandardDateTime(history.created_at)">
                </span>
                <br />
                <span v-html="history.notes"></span>
              </li>
            </span>
          </ul>
        </li>
        <li>
          Date Created:
          <b>{{ formatStandardDate(event.created_at) }}</b>
        </li>
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
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
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
    onDoubleClick(event) {
      var updatedEvent = event;
      updatedEvent.action_active = !event.action_active;
      this.$store.dispatch("updateEvent", updatedEvent);
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
    calculateDue(action_date, frequency) {
      return DateFormatService.calculateDuejs(action_date, frequency);
    },
    calculateDateDue(action_date, frequency) {
      return DateFormatService.calculateDateDuejs(action_date, frequency);
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
#align-right {
  text-align: center;
}
.right-align {
  text-align: right;
}
</style>
