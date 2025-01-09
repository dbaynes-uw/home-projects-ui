<template>
  <div class="div-frame">
    <h2>Events Created By:</h2>
    <h3>{{ user.email  }}</h3>
    <!--h2 id="status-message">
      <u>Status Message: {{ this.statusMessage }}</u>
    </h2-->
    <div>
      <h2>
        <router-link :to="{ name: 'EventStatistics' }">Statistics</router-link> |
        <router-link :to="{ name: 'EventCreate' }">Create Event</router-link>
      </h2>
      <br/>
      <ul>
        <li>
          <button id="button-as-link" @click="refreshPage"><u>Active Events</u></button>  
        </li>
        <li>
          <h1>
            <EventsPastDue/>
          </h1>
        </li>
        <li>
          <h1>
            <EventsInactive />
          </h1>
        </li>
      </ul>
    </div>
    <ul>
    <li><EventsDueBy v-model:selectedDueByValue="parentDueBy"/>
      &nbsp;
      &nbsp;
      <EventsLocations v-model:selectedLocationValue="parentLocation"/></li>
    </ul>
    <span v-if="$store.state.user.resource_owner.email.toLowerCase().includes('baynes')">
      <br/>
      <button id="button-as-link-wide" @click="notifyEventsDue"><u>Send Events Due Notification</u></button>  
      <br />
    </span>
    <div style="width: 100%">
      <div class="auto-search-container">
        <v-text-field
          clearable
          clear-icon="mdi-close"
          @click:clear="showIndex"
          type="text"
          class="np-input-search"
          v-model="inputSearchText"
          placeholder="Search"
          autocomplete="off"
          v-on:keyup="searchColumns"
        />
      </div>
    </div>
  
    <div class="event-list">
      <button id="button-as-link" @click="requestIndexDetail">
        <u>Detail for Edit/Delete</u>
      </button>
      <span v-if="filteredResults.length == 0">
        <span v-if="requestIndexDetailFlag == true">
          <span v-if="events_request == 'DueBy'">
            <p id="p-informational">{{ events.length }} events Due in the next {{ parentDueBy }} Days.</p>
          </span>
          <span v-if="events_request == 'Location'">
            <p id="p-informational">{{ events.length }} Active {{ parentLocation }} events </p>
          </span>
          <br/>
          <div class="legend">
            <span><b>Double click to mark as TBD/Done or Active/Inactive.</b></span>
            <span><span class="incomplete-box"></span> = Incomplete</span>
            <span><span class="complete-box"></span> = Complete</span>
          </div>
          <div class="cards">
            <EventCard
              v-for="event in events"
              :key="event.id"
              :event="event"
              :class="duePastDueOrInactive(event)"
              @dblclick="editEvent(event)"
            />
          </div>
          <div class="cards">
            <!--EventCard
              v-for="event in events"
              :key="event.id"
              :event="event"
              :class="inactive(event)"
              @dblclick="editEvent(event)"
            /-->
            <br />
          </div>
        </span>
        <span v-else>
          <br/>
          <EventIndex :events="events" />
        </span>
      </span>
  
      <span v-if="filteredResults.length > 0">
        <span v-if="requestIndexDetailFlag == true">
          <p id="p-informational">Number of events returned: {{ filteredResults.length }}</p>
          <div class="legend">
            <span>Double click to mark as complete.</span>
            <span><span class="incomplete-box"></span> = Incomplete</span>
            <span><span class="complete-box"></span> = Complete</span>
          </div>
          <div class="events">
            <EventCard
              v-for="event in filteredResults"
              :key="event.id"
              :event="event"
              class="card"
              @dblclick="editEvent(event)"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <EventIndex :events="filteredResults" />
        </span>
      </span>
    </div>
  </div>
</template>

<script setup>
//import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import { ref } from 'vue';
import EventCard from '@/components/events/EventCard'
import EventsDueBy from "@/components/events/EventsDueBy.vue";
import EventsInactive from "@/components/events/EventsInactive.vue";
import EventsLocations from "@/components/events/EventsLocations.vue";
import EventsPastDue from "@/components/events/EventsPastDue.vue";
import EventIndex from "@/components/events/EventIndex.vue";
//import EventSearchResults from "@/components/events/EventSearchResults.vue";
import axios from "axios";
const parentDueBy = ref('');
const parentLocation = ref('');
</script>
<script>
// @ is an alias to /src
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "EventList",
  components: {
    EventIndex,
    /*EventIndexDetail,*/
    EventCard,
    //EventSearchResults,
    EventsDueBy,
    EventsInactive,
    EventsLocations,
    EventsPastDue,
  },
  props: ["id", "pastDue", "eventCard", "filteredResults[]"],
  data() {
    return {
      isAdmin: false,
      requestIndexDetailFlag: true,
      assigned: "assigned",
      eventList: null,
      updatedEvent: null,
      inputSearchText: "",
      filteredResults: [],
      searchResults: false,
      columnDetails: null,
      //sortedData: [],
      sortedbyASC: false,
      statusMessage: "",
      user: null,
    };
  },
  async mounted() {
    // FOR URL:
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macbook-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/events/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/events/";
    }
    this.api_url = work_url
  },
  created() {
    this.$store.dispatch("fetchEvents");
    //this.sortedData = this.events;
    this.user = this.$store.state.user.resource_owner
    if (this.user.email == 'dlbaynes@gmail.com') {
      this.isAdmin = true;
    }
  },
  computed: {    
    events() {
      return this.$store.state.events;
    },
    events_request() {
      return this.$store.state.eventsRequest
    }
  },
  methods: {
    async notifyEventsDue(){
      alert("Email Notification Sent")
      const result = await axios.put(this.api_url + "notification_events_due");
      if (result.statusText.toLowerCase() == 'ok') {
        alert("Notification emails were successfully sent to assignees")
      } else {
        alert("There was an error send emails to assignees")
      }
    },
    duePastDueOrInactive(e) {
      var dayjs = require('dayjs')
      let formatDateToday = dayjs(new Date()).format("YYYY-MM-DD");
      if (e.status == 'active') {
        if (e.action_due_date < formatDateToday ){
          return 'event-pastdue'
        } else {
          return 'card'
        }
      } else {
        return 'event-inactive'
      }
      //e.status == 'inactive' ? 'event-inactive' : 'event'
      //return e.status
    },
    inactive(e) {
      return e.status == 'inactive'
    },
    requestIndexDetail() {
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    showIndex() {
      this.filteredResults = [];
    },
    searchColumns() {
      this.filteredResults = [];
      this.searchResults = true;
      this.columnDetails = null;
      if (
        this.inputSearchText == null ||
        (this.inputSearchText != null && this.inputSearchText.length === 0)
      ) {
        this.filteredResults = [];
        this.columnDetails = null;
      } else {
        if (
          this.events &&
          this.events.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.events.forEach((event) => {
            const searchHasDescription =
              event.description &&
              event.description
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasAssigned =
              event.assigned &&
              event.assigned
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasDescription || searchHasAssigned) {
              this.filteredResults.push(event);
            }
          });
        }
      }
    },
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    refreshPage() {
      //this.$router.push({ path: "/" });
      window.location.reload();
    },
    //async deleteEvent(event) {
    //  const ok = await this.$refs.confirmDialogue.show({
    //    title: "Delete Event from List",
    //    message:
    //      "Are you sure you want to delete " +
    //      event.description +
    //      "? It cannot be undone.",
    //    okButton: "Delete",
    //  });
    //  // If you throw an error, the method will terminate here unless you surround it wil try/catch
    //  if (ok) {
    //    this.$store.dispatch("deleteEvent", event);
    //    this.statusMessage =
    //      "Event was Deleted for " +
    //      event.description +
    //      "! Page will restore in 2 seconds";
    //    setTimeout(() => location.reload(), 2500);
    //  }
    //},
    editEvent(event) {
      //var updatedEvent = event;
      //updatedEvent.action_active = !event.action_active;
      //this.$store.dispatch("updateEvent", updatedEvent);
      this.$router.push({ name: 'EventEdit', params: { id: `${event.id}` } });
    },
    DatePastDue(value) {
      return DateFormatService.datePastDuejs(value);
    },

    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
    formatSystemDate(value) {
      return DateFormatService.formatSystemDatejs(value);
    },
    //Keep for now:
    calculateDue(action_date, frequency) {
      return DateFormatService.calculateDuejs(action_date, frequency);
    },
    calculateDateDue(action_date, frequency) {
      return DateFormatService.calculateDateDuejs(action_date, frequency);
    },
    //
  },
};
</script>
<style>
.events {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
i {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #fff;
  cursor: pointer;
}
select {
  border-color: darkgreen;
}
.fa-table {
  margin-top: 1rem;
}
/*
@media (max-width: 500px) {
  .events {
    grid-template.columns: 1fr;
  }
}
*/
</style>
