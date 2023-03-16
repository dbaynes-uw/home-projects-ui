<template>
  <div>
    <h3>Event Stats Details</h3>
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <br />
    <div class="eventAssigned">
      <table class="table-index-style">
        <tr>
          <th>Description</th>
          <th>Frequency</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        <tr
          v-for="eventStatsDetail in eventStatsDetails"
          :key="eventStatsDetail.id"
          :eventStatsDetail="eventStatsDetail"
          @dblclick="onDoubleClick(eventStatsDetail)"
          v-bind:class="{ 'is-complete': eventStatsDetail.completed }"
        >
          <td>{{ eventStatsDetail.description }}</td>
          <td>Every {{ eventStatsDetail.frequency }} days</td>
          <td>
            {{ eventStatsDetail.completed ? "Completed" : "TBD" }}
          </td>
          <td>
            <span class="fa-stack">
              <router-link
                :to="{
                  name: 'EventEdit',
                  params: { id: `${eventStatsDetail.id}` },
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
export default {
  name: "EventStatsDetails",
  components: {},
  props: ["statsType"],
  data() {
    return {
      description: null,
      frequency: null,
      completed: 0,
    };
  },
  created() {
    console.log("Created Store Dispatch - StatsType: ", this.eventStatsDetails);
    this.$store.dispatch("fetchEventStatsDetails", this.statsType);
  },
  computed: {
    eventStatsDetails() {
      return this.$store.state.eventStatsDetails;
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
