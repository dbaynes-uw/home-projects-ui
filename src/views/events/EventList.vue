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
      <br>
      <h1>
        <button id="button-as-link" @click="refreshPage"><u>Refresh</u></button>  
      </h1>
      <br/>
      <h1>
        <EventsPastDue />
      </h1>
      <br/>
      <h1>
      <button id="button-as-link" @click="requestIndexDetail">
        <u>Detail Index View</u>
      </button>
        <EventsDueBy />
      </h1>
    </div>
    <br />
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
    <!--EventCard v-for="event in events" :key="event.id" :event="event" /-->
    <!--EventIndexDetail :events="events" /-->
      <span v-if="filteredResults.length == 0">
        <span v-if="requestIndexDetailFlag == true">
          <div class="legend">
            <span>Double click to mark as complete.</span>
            <span><span class="incomplete-box"></span> = Incomplete</span>
            <span><span class="complete-box"></span> = Complete</span>
          </div>
          <div class="events">
            <EventCard
              v-for="event in events"
              :key="event.id"
              :event="event"
              class="event"
              @dblclick="onDoubleClick(event)"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <EventIndex :events="events" />
        </span>
      </span>
      <span v-if="filteredResults.length > 0">
        <span v-if="requestIndexDetailFlag == true">
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
              class="event"
              @dblclick="onDoubleClick(event)"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <EventSearchResults :filteredResults="filteredResults" />
        </span>
      </span>
    </div>
    <!--div>{{ $store.state.events }}</div-->
  </div>
</template>

<script setup>
//import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import EventCard from '@/components/events/EventCard'
import EventsDueBy from "@/components/events/EventsDueBy.vue";
import EventsPastDue from "@/components/events/EventsPastDue.vue";
import EventIndex from "@/components/events/EventIndex.vue";
//import EventIndexDetail from "@/components/events/EventIndexDetail.vue";
import EventSearchResults from "@/components/events/EventSearchResults.vue";
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
    EventSearchResults,
    EventsDueBy,
    EventsPastDue,
  },
  props: ["id", "pastDue", "eventCard", "filteredResults[]"],
  data() {
    return {
      requestIndexDetailFlag: false,
      assigned: "assigned",
      eventList: null,
      updatedEvent: null,
      inputSearchText: "",
      filteredResults: [],
      searchResults: false,
      columnDetails: null,
      sortedData: [],
      sortedbyASC: false,
      statusMessage: "",
      user: null,
    };
  },
  mounted() {},
  created() {
    this.$store.dispatch("fetchEvents");
    this.sortedData = this.events;
    this.user = this.$store.state.user.resource_owner
  },
  computed: {    
    events() {
      return this.$store.state.events;
    },
  },
  methods: {
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
};
</script>
<style>
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
</style>
