<template>
  <div class="div-frame">
    <h2>Event List!</h2>
    <!--h2 id="status-message">
      <u>Status Message: {{ this.statusMessage }}</u>
    </h2-->
    <div>
      <h2>
        <router-link :to="{ name: 'EventStatistics' }">Statistics</router-link> |
        <router-link :to="{ name: 'EventCreate' }">Create Event</router-link>
        <button id="button-as-link" @click="refreshPage"><u>Refresh</u></button>  
        <EventsPastDue />
      <!--button id="button-as-link" @click="requestIndexDetail">
        <u>Detail Index View</u>
      </button-->
        <EventsDueBy />
      </h2>
    </div>
    <br />
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
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
    <!--div class="events">
      <div
        v-for="event in events"
        :key="event.id"
        :event="event"
        class="event"
        @dblclick="onDoubleClick(event)"
      >
        <br />
      </div>
    </div-->
    <div class="event-list">
      <!--span v-if="this.requestIndexDetailFlag == true">
        console.log("Hell Yea! ", this.requestIndexDetailFlag)
      </!--span-->
      <span v-if="filteredResults.length == 0">
        FilteredResults == 0
        <EventIndex :events="events" />
      </span>
      <span v-if="filteredResults.length > 0">
        FilteredResults > 0
        <p>Search Results: {{ filteredResults.length }}</p>
        <EventSearchResults :filteredResults="filteredResults" />
      </span>
    </div>
    <!--div>{{ $store.state.events }}</div-->
  </div>
</template>

<script setup>
//import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import EventsDueBy from "@/components/EventsDueBy.vue";
import EventsPastDue from "@/components/EventsPastDue.vue";
import EventIndex from "@/components/events/EventIndex.vue";
import EventSearchResults from "@/components/events/EventSearchResults.vue";
</script>
<script>
// @ is an alias to /src
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "EventList",
  components: {
    EventIndex,
    EventSearchResults,
    EventsDueBy,
    EventsPastDue,
  },
  props: ["id", "pastDue", "filteredResults[]"],
  data() {
    return {
      //requestIndexDetailFlag: false,
      assigned: "assigned",
      eventList: null,
      updatedEvent: null,
      inputSearchText: "",
      filteredResults: [],
      columnDetails: null,
      sortedData: [],
      sortedbyASC: false,
      statusMessage: "",
    };
  },
  mounted() {
    this.sortedData = this.events;
  },
  created() {
    console.log("EventList created");
    this.$store.dispatch("fetchEvents");
    this.sortedData = this.events;
  },
  computed: {
    events() {
      return this.$store.state.events;
    },
  },
  methods: {
    requestIndexDetail() {
      /*console.log(
        "Before RequestDetailIndexFlag: ",
        this.requestIndexDetailFlag
      );
      this.requestIndexDetailFlag = true;
      console.log(
        "After RequestDetailIndexFlag: ",
        this.requestIndexDetailFlag
      );*/
    },
    showIndex() {
      this.filteredResults = [];
    },
    searchColumns() {
      this.filteredResults = [];
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
#button-as-link {
  background-color: #7ba8bd;
  border-radius: 5px;
  font-size: 18px;
  margin-left: 3.5rem;
}
</style>
