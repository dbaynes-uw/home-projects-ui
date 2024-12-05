<template>
  <div class="event-statistics">
    <h1 class="center" style="padding-bottom: 2rem">Event Statistics</h1>
    <v-table>
      <tr>
        <td style="width: 30%">
          <h3>Event Assignments:</h3>
        </td>
        <td><h3>Count</h3></td>
      </tr> 
      <tr v-for="(v, k) in events.assigned" :key="k">
        <td>
          &nbsp;&nbsp;
          --
          <router-link
            :to="{
              name: 'EventStatisticDetail',
              params: { statistic: assigned + '-' + k },
            }"
          >
            {{ k }}:
          </router-link>
        </td>
        <td>{{ v }}</td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventStatisticDetail',
              params: { statistic: active },
            }"
          >
            Active Events:
          </router-link>
        </td>
        <td>
          {{ events.active }}
        </td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventStatisticDetail',
              params: { statistic: inactive },
            }"
          >
            Inactive Events:
          </router-link>
        </td>
        <td>
          {{ events.active }}
        </td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventStatisticDetail',
              params: { statistic: notAssigned },
            }"
          >
            Events NOT Assigned:
          </router-link>
        </td>
        <td>{{ events.notAssigned }}</td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventStatisticDetail',
              params: { statistic: pastDue },
            }"
          >
            Events Past Due:
          </router-link>
        </td>
        <td>{{ events.pastDue }}</td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventStatisticDetail',
              params: { statistic: dueToday },
            }"
          >
            Events Due Today:
          </router-link>
        </td>
        <td>
          {{ events.dueToday }}
        </td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventStatisticDetail',
              params: { statistic: dueThisWeek },
            }"
          >
            Events Due This Week:
          </router-link>
        </td>
        <td>
          {{ events.dueThisWeek }}
        </td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventStatisticDetail',
              params: { statistic: dueNextWeek },
            }"
          >
            Events Due Next Week:
          </router-link>
        </td>
        <td>
          {{ events.dueNextWeek }}
        </td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventStatisticDetail',
              params: { statistic: othersDue },
            }"
          >
            Other Events Due:
          </router-link>
        </td>
        <td>
          {{ events.othersDue }}
        </td>
      </tr>      
    </v-table>
    <br />
    <span class="fa-stack">
      <router-link :to="{ name: 'EventList' }">
        <i class="fa-solid fa-backward fa-stack-1x" id="fa-custom"></i>
      </router-link>
    </span>
  </div>
</template>
<script>
export default {
  name: "EventStatistics",
  components: {},
  props: ["statistic"],
  data() {
    return {
      eventStatistics: null,
      eventsAssigned: null,
      pastDue: "past_due",
      assigned: "assigned",
      notAssigned: "not_assigned",
      completed: "completed",
      active: "active",
      inactive: "inactive",
      dueToday: "due_today",
      dueThisWeek: "due_this_week",
      dueNextWeek: "due_next_week",
      othersDue: "others_due"
    };
  },
  created() {
    this.$store.dispatch("fetchEventStatistics");
  },
  computed: {
    events() {
      return this.$store.state.eventStatistics;
    },
  },
};
</script>
<style>
.eventStatistics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
.eventStatistics {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
#fa-custom {
  color: black;
  position: relative;
  left: 20rem;
}
.center {
  text-align: center;
}
/*
tr {
  line-height: 0.5 !important;
}
*/
.h2-status {
  text-decoration-line: underline;
}
.h2-status-category {
  text-align: right;
  font-size: 1.3rem;
}
</style>
