<template>
  <div>
    <h3>Event Stats Details</h3>
    <h3>Route Params: {{ this.$route.params }}</h3>
    <h3>ROUTE: {{ $route.params.completed }} -- End</h3>
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <br />
    <!--Events: {{ events }} -- Completed: {{ events.completed }} -->
    <div class="eventAssigned">
      <table class="table-index-style">
        <tr>
          <th>Description</th>
          <th>Frequency</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        <tr
          v-for="event in events"
          :key="event.id"
          :event="event"
          @dblclick="onDoubleClick(event)"
          v-bind:class="{ 'is-complete': event.completed }"
        >
          <td>Description: {{ event.description }}</td>
          <td>Every {{ event.frequency }} days</td>
          <td>
            {{ event.completed ? "Completed" : "TBD" }}
          </td>
          <td>
            <span class="fa-stack">
              <router-link
                :to="{
                  name: 'EventEdit',
                  params: { id: `${event.id}` },
                }"
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
      </table>
    </div>
  </div>
</template>
<script>
import EventService from "@/services/EventService.js";
export default {
  name: "EventStatDetails",
  components: {},
  //props: { completed: { required: true } },
  props: ["completed"],
  data() {
    return {
      events: {},
      description: null,
      frequency: null,
    };
  },
  //created() {
  //  console.log(
  //    "EventStatDetails Created Store Dispatch - completed: ",
  //    this.completed
  //  );
  //  this.$store.dispatch("fetchEventStatDetails");
  //},
  created() {
    console.log("Created - prop: ", this.completed);
    EventService.getEventStatDetails(this.completed)
      .then((response) => {
        //commit("SET_EVENT_STAT_DETAILS", response.data);
        console.log("EVENT STAT DETAILS RESPONSE: ", response.data);
        this.events = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  computed: {
    eventStatDetails() {
      console.log("StatDetails Computed: ", this.$store.state.eventStatDetails);
      return this.$store.state.eventStatDetails;
    },
  },
  methods: {
    onDoubleClick(eventStatsDetail) {
      var updatedEvent = eventStatsDetail;
      updatedEvent.completed = !eventStatsDetail.completed;
      this.$store.dispatch("updateEvent", updatedEvent);
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
