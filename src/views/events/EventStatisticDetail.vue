<template>
  <div>
    <h3>Event Statistic Detail</h3>
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <br />
    <div class="eventStatisticDetail">
      <table class="table-index-style">
        <tr>
          <th>Description</th>
          <th>Frequency</th>
          <th>Date Due</th>
          <th>Assigned</th>
          <th style="text-align: right">Actions</th>
        </tr>
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
          <td>{{ event.assigned }}</td>
          <td>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'EventEdit', params: { id: `${event.id}` } }"
              >
                <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
              </router-link>
              <span
                class="fa-stack fa-table-stack"
                style="position: relative; top: -0.4rem"
              >
                <router-link
                  :to="{ name: 'EventDetails', params: { id: `${event.id}` } }"
                >
                  <i class="fa fa-eye" style="font-size: 18px"></i>
                </router-link>
              </span>
              <span
                class="fa-table-stack"
                style="position: relative; top: 0.5rem; left: 2.3rem"
              >
                <router-link :to="{ name: 'EventList' }">
                  <i class="fa-solid fa-backward fa-stack-1x"></i>
                </router-link>
              </span>
            </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "EventStatisticDetail",
  components: {},
  props: ["statistic"],
  data() {
    return {
      description: null,
      frequency: null,
      completed: 0,
    };
  },
  created() {
    console.log(
      "Created Store Dispatch - EventStatisticDetail: ",
      this.statistic
    );
    this.$store.dispatch("fetchEventStatisticDetail", this.statistic);
  },
  computed: {
    events() {
      return this.$store.state.eventStatisticDetail;
    },
  },
  methods: {
    onDoubleClick(event) {
      var updatedEvent = event;
      updatedEvent.action_active = !event.action_active;
      this.$store.dispatch("updateEvent", updatedEvent);
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
  },
};
</script>
<style scoped>
.table-index-style {
  width: 100%;
  border-collapse: collapse;
}
th {
  background-color: #7ba8bd;
  text-align: left;
  padding-left: 1rem;
  padding-right: 1rem;
}
tr {
  line-height: 1.6 !important;
  border: none;
}
tr:nth-child(odd) {
  background-color: #41b88352;
  border: none !important;
}
td {
  padding-left: 1rem;
  padding-right: 1rem;
}
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
