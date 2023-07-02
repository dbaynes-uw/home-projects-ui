<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div id="body-outline">
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <!--Index Detail Flag: {{ this.RequestDetailIndexFlag }} -->
    <div class="events">
      <div
        v-for="event in eventsIndexDetail"
        :key="event.id"
        :event="event"
        class="event"
        @dblclick="onDoubleClick(event)"
      >
        <router-link :to="{ name: 'EventDetails', params: { id: event.id } }">
          <p class="p-align-left">
            <b>
              <u>{{ event.description }}</u>
            </b>
          </p>
        </router-link>
        <ul class="ul-left-dash">
          <li v-if="event.assigned">
            <router-link
              :to="{
                name: 'EventStatisticDetail',
                params: { statistic: assigned + '-' + event.assigned },
              }"
            >
              <b>{{ event.assigned }}</b>
            </router-link>
          </li>
          <li>{{ event.notes }}</li>
          <li :class="event.action_active ? 'is-active' : 'is-inactive'">
            Status:
            {{ event.action_active ? "Active" : "InActive" }}
          </li>
          <li v-bind:class="{ 'is-active': event.action_active }">
            Last Completed:
            {{ formatStandardDate(event.action_date) }}
          </li>
          <li>{{ event.frequency }} day cycle</li>
          <li>
            Action Date:
            {{ formatStandardDate(event.action_date) }}
          </li>
          <li>
            Date Due:
            <span
              v-if="
                DateFormatService.datePastDue(
                  event.action_date,
                  event.frequency
                )
              "
            >
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
          <li>
            Latest Changes:
            <ul
              class="ul-indented-left-dash"
              v-for="(history, index) in event.histories"
              :key="history.id"
            >
              <span v-if="index == 0">
                <li class="li-left-dash" v-html="history.notes"></li>
              </span>
            </ul>
          </li>
        </ul>
        <br />
        <span class="fa-stack">
          <router-link
            :to="{ name: 'EventEdit', params: { id: `${event.id}` } }"
          >
            <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
          </router-link>
        </span>
        <span class="fa-stack">
          <i @click="deleteEvent(event)" class="fas fa-trash-alt fa-stack-1x">
          </i>
        </span>
      </div>
    </div>
    <!--div>{{ $store.state.events }}</div-->
  </div>
</template>

<script setup>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
</script>
<script>
// @ is an alias to /src
import DateFormatService from "@/services/DateFormatService.js";
export default {
  components: {
    ConfirmDialogue,
  },
  props: ["id", "requestIndexDetailFlag", "eventsIndexDetail"],
  //data() {},
  data() {
    return {
      DueBy: null,
      assigned: "assigned",
      eventList: null,
      updatedEvent: null,
      //statusMessage: "",
    };
  },
  methods: {
    refreshPage() {
      //this.$router.push({ path: "/" });
      window.location.reload();
    },
    async deleteEvent(event) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Event from List",
        message:
          "Are you sure you want to delete " +
          event.description +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteEvent", event);
        /*this.statusMessage =
          "Event was Deleted for " +
          event.description +
          "! Page will restore in 2 seconds";
        */
        setTimeout(() => location.reload(), 2500);
      }
    },
    onDoubleClick(event) {
      var updatedEvent = event;
      updatedEvent.action_active = !event.action_active;
      this.$store.dispatch("updateEvent", updatedEvent);
    },
    DatePastDue(value) {
      return DateFormatService.datePastDue(value);
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
    formatSystemDate(value) {
      return DateFormatService.formatSystemDate(value);
    },
    calculateDue(action_date, frequency) {
      return DateFormatService.calculateDue(action_date, frequency);
    },
    calculateDateDue(action_date, frequency) {
      return DateFormatService.calculateDateDue(action_date, frequency);
    },
  },
  created() {
    this.$store.dispatch("fetchEvents");
  },
  computed: {
    events() {
      return this.$store.state.events;
    },
  },
};
</script>
<style>
#body-outline {
  margin: 0.25;
}
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
.complete-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #35495e;
}
.is-active {
  background: #41b882;
  color: #000;
}
.incomplete-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #41b882;
}
.is-inactive {
  background: #35495e;
  color: #fff;
}
.is-complete-for-link {
  color: #41b883;
}
select {
  border-color: darkgreen;
}
.fa-table {
  margin-top: 1rem;
}
@media (max-width: 500px) {
  .events {
    grid-template.columns: 1fr;
  }
}
#button-as-link {
  background-color: #7ba8bd;
  border-radius: 5px;
  font-size: 18px;
}
</style>
