<template>
  <div>
    <h3>Events Assigned to</h3>
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <br />
    <div class="eventAssigned">
      <table class="table-index-style">
        <thead>
          <tr>
            <th>Description</th>
            <th>Frequency</th>
            <th>Date Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        <tr
          v-for="event in events"
          :key="event.id"
          :event="event"
          @dblclick="onDoubleClick(event)"
          v-bind:class="{ 'is-complete': event.completed }"
        >
          <td>{{ event.description }}</td>
          <td>Every {{ event.frequency }} days</td>
          <td>{{ formatStandardDate(event.action_due_date) }}</td>
          <td>
            <span class="fa-stack">
              <router-link
                :to="{ name: 'EventEdit', params: { id: `${event.id}` } }"
              >
                <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
              </router-link>
              <span class="fa-stack fa-table-stack">
                <router-link :to="{ name: 'EventList' }">
                  <i class="fa-solid fa-backward fa-stack-1x"></i>
                </router-link>
              </span>
            </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "EventsAssigned",
  components: {},
  props: ["assigned"],
  data() {
    return {
      description: null,
      frequency: null,
      completed: 0,
    };
  },
  created() {
    this.$store.dispatch("fetchEventsAssigned", this.assigned);
  },
  computed: {
    events() {
      return this.$store.state.eventStatistics;
    },
  },
  methods: {
    onDoubleClick(event) {
      var updatedEvent = event;
      updatedEvent.completed = !event.completed;
      this.$store.dispatch("updateEvent", updatedEvent);
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
};
</script>
<style scoped>
.eventAssigned {
  background: #e8f7f0;
}
.fa-table-stack {
  position: relative;
  left: 2rem;
}
i {
  bottom: 0px;
  color: gray;
}
tr.is-complete {
  background: #35495e;
  color: #fff;
}
</style>
