<template>
  <div>
    <h2>
      <router-link :to="{ name: 'EventStatistics' }">Event Statistics</router-link>
    </h2>
    <br/>
    <button id="button-as-link" @click="requestIndexDetail">
        <u>Toggle Card/Index</u>
    </button>
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <br />
    <span v-if="requestIndexDetailFlag != true">
      <div class="cards">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          :class="duePastDueOrInactive(event)"
          @dblclick="editEvent(event)"
        />
      </div>
    </span>
    <span v-if="requestIndexDetailFlag == true">
      <div class="eventStatisticDetail">
        <table>
        <thead class="table-index-style">
          <tr>
            <th>Description</th>
            <th>Assigned</th>
            <th>Frequency</th>
            <th>Date Due</th>
            <th>Status</th>
            <th style="text-align: right">Actions</th>
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
            <td>{{ event.assigned }}</td>
            <td>Every {{ event.frequency }} days</td>
            <td>{{ formatStandardDate(event.action_due_date) }}</td>
            <td>{{ event.status[0].toUpperCase() + event.status.slice(1) }}</td>
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
                    :to="{ name: 'EventShow', params: { id: `${event.id}` } }"
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
        </tbody>
        </table>
      </div>
    </span>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import EventCard from '@/components/events/EventCard'
export default {
  name: "EventStatisticDetail",
  components: {
    EventCard,
  },
  props: ["statistic"],
  data() {
    return {
      requestIndexDetailFlag: false,
      description: null,
      frequency: null,
      completed: 0,
    };
  },
  created() {
    this.$store.dispatch("fetchEventStatisticDetail", this.statistic);
  },
  computed: {
    events() {
      return this.$store.state.eventStatisticDetail;
    },
  },
  methods: {
    editEvent(event) {
      this.$router.push({ name: 'EventEdit', params: { id: `${event.id}` } });
    },
    duePastDueOrInactive(e) {
      var dayjs = require('dayjs')
      let formatDateToday = dayjs(new Date()).format("YYYY-MM-DD");
      if (e.status == 'active') {
        if (e.action_due_date < formatDateToday ){
          return 'event-pastdue'
        } else {
          return 'event'
        }
      } else {
        return 'event-inactive'
      }
    },
    requestIndexDetail() {
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
};
</script>
<style scoped>
.events {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
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
.event-inactive {
  border: 1px solid #ccc;
  background: red;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
.event-link {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
i {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #fff;
  cursor: pointer;
}
.legend {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}
select {
  border-color: darkgreen;
}
.fa-table {
  margin-top: 1rem;
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
