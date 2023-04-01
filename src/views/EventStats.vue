<template>
  <div class="event-stats">
    <h1 class="center">Event Stats</h1>
    <table>
      <tr>
        <td>
          <h2 class="h2-status">Event Assignments:</h2>
        </td>
      </tr>
      <tr v-for="(v, k) in events.assigned" :key="k">
        <td>
          <router-link
            :to="{ name: 'EventsAssigned', params: { assigned: k } }"
          >
            <h2 class="h2-status-category">{{ k }}:</h2>
          </router-link>
        </td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td>
          <h2>
            {{ v }}
          </h2>
        </td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventsPastDue',
              params: { statistic: completed },
            }"
          >
            <h2 class="h2-status">Events Completed:</h2>
          </router-link>
        </td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td>
          <h2 style="text-align: right">
            {{ events.completed }}
          </h2>
        </td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventsPastDue',
              params: { statistic: notCompleted },
            }"
          >
            <h2 class="h2-status">Events NOT Completed:</h2>
          </router-link>
        </td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td>
          <h2 style="text-align: right">
            {{ events.notCompleted }}
          </h2>
        </td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventsPastDue',
              params: { statistic: past },
            }"
          >
            <h2 class="h2-status">Events Past Due:</h2>
          </router-link>
        </td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td>
          <h2 style="text-align: right">
            {{ events.pastDue }}
          </h2>
        </td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventsPastDue',
              params: { statistic: dueToday },
            }"
          >
            <h2 class="h2-status">Events Due Today:</h2>
          </router-link>
        </td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td>
          <h2 style="text-align: right">
            {{ events.dueToday }}
          </h2>
        </td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventsPastDue',
              params: { statistic: dueThisWeek },
            }"
          >
            <h2 class="h2-status">Events Due This Week:</h2>
          </router-link>
        </td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td>
          <h2 style="text-align: right">
            {{ events.dueThisWeek }}
          </h2>
        </td>
      </tr>
      <tr>
        <td>
          <router-link
            :to="{
              name: 'EventsPastDue',
              params: { statistic: dueNextWeek },
            }"
          >
            <h2 class="h2-status">Events Due Next Week:</h2>
          </router-link>
        </td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td>
          <h2 style="text-align: right">
            {{ events.dueNextWeek }}
          </h2>
        </td>
      </tr>
    </table>
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
  name: "EventStats",
  components: {},
  props: ["assigned", "pastDue"],
  data() {
    return {
      eventStats: null,
      eventsAssigned: null,
      past: "past",
      completed: "completed",
      notCompleted: "not_completed",
      dueToday: "due_today",
      dueThisWeek: "due_this_week",
      dueNextWeek: "due_next_week",
    };
  },
  created() {
    console.log("Created Store Dispatch");
    this.$store.dispatch("fetchEventStats");
  },
  computed: {
    events() {
      return this.$store.state.eventStats;
    },
  },
};
</script>
<style>
.eventStats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
.eventStat {
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
tr {
  line-height: 0.5 !important;
}
.h2-status {
  text-decoration-line: underline;
}
.h2-status-category {
  text-align: right;
  font-size: 1.3rem;
}
</style>
