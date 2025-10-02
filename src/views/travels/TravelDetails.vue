<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>{{ travel.title }} Details</h2>
      Date: {{ Date() }}
      <br/>
      <h2 id="status-message">
        <u>{{ this.statusMessage }}</u>
      </h2>
    </v-card-title>
    <h3><router-link :to="{ name: 'TravelList' }">
          <b>Back to List of Journies</b>
        </router-link>
    </h3>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'TravelEventCreate', params: { id: travel.id } }">Add Travel Event</router-link>
        </button>
      </li>
      <li>
        <button id="button-as-link" @click="requestIndexDetail">
          <u>Index/Card View</u>
        </button>
      </li>
    </ul> 
    <br/>
  </v-card>
  <br/>
  <h3>{{ this.statusMessage }}</h3>
  <div style="width: 100%">
    <div class="auto-search-container">
      <v-text-field
        clearable
        clear-icon="fas fa-close"
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
  <h3>Click Description to Edit</h3>
  <div class="travel-event-list">
    <span v-if="filteredResults.length == 0">
      <span v-if="searchResults == false">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
      <span v-else>
        <span v-if="requestIndexDetailFlag == false">
          <h3 id="h3-left">Total: {{ travel.travel_events.length }}</h3>
            <!--span class="h3-left-total-child">Double click Item Below to Edit</!--span-->
          <div class="cards">
            <TravelEventCard
              v-for="travel_event in travel.travel_events"
              :key="travel_event.id"
              :travel_event="travel_event"
            />
          </div>
        </span>
        <span v-else>
          <TravelEventIndex :travel_events="travel.travel_events" />
        </span>
      </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>Double click to Edit</span>
        <div class="cards">
          <TravelEventCard
            v-for="travel_event in filteredResults"
            :key="travel_event.id"
            :travel_event="travel_event"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <TravelEventIndex :travel_events="filteredResults" />
      </span>
    </span>
  </div> 
</template>
<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import TravelEventIndex from "@/components/travel_events/TravelEventIndex.vue";
import TravelEventCard from "@/components/travel_events/TravelEventCard.vue";
import { ref } from 'vue';
const successMessage = ref('')
export default {
  name: 'TravelDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    TravelEventIndex,
    TravelEventCard,
  },
  mounted() {
    this.sortedData = this.sortedData = this.travel_events;      
    successMessage.value = this.$route.query.success;
    this.statusMessage = successMessage.value
  },
  created() {
    this.$store.dispatch("fetchTravel", this.$route.params.id);
    this.$store.dispatch("fetchTravelEvents");
    this.sortedData = this.$store.dispatch("fetchTravelEvents");
  },
  computed: {
    travel() {
      return this.$store.state.travel;
    },
    travel_events() {
      return this.$store.state.travel_events;
    },
  },
  data() {
    return {
      requestIndexDetailFlag: false,
      searchResults: null,
      inputSearchText: "",
      filteredResults: [],
      columnDetails: null,
      sortedData: [],
      sortedbyASC: false,
      title: null,
      description: null,
      completed: 0,
      statusMessage: "",
    };
  },
  methods: {
    requestIndexDetail() {
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    editTravel(travel) {
      this.$router.push({ name: 'TravelEdit', params: { id: `${travel.id}` } });
    },
    editTravelEvent(travel_event) {
      this.$router.push({ name: 'TravelEventEdit', params: { id: `${travel_event.id}` } });
    },
    showIndex() {
      this.filteredResults = [];
    },
    searchColumns() {
      this.searchResults = true;
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
          this.travel_events &&
          this.travel_events.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.travel_events.forEach((travel_event) => {
            const searchHasTitle =
              travel_event.title &&
              travel_event.title
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasDescription =
              travel_event.description &&
              travel_event.description
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            
            if (searchHasTitle|| searchHasDescription) {
              this.filteredResults.push(travel_event);
            }
            if (this.filteredResults.length > 0) {
              this.searchResults = true;
            } else {
              this.searchResults = false;
            }
          });
        }
      }
    },
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {
      this.sortedData = this.travel_events;
      if (this.sortedbyASC) {
        this.sortedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.sortedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },

    hasEventPassed(te) {
      var dayjs = require('dayjs')
      let formatDateToday = dayjs(new Date()).format("MM-DD-YY");
      if (DateFormatService.formatYearDatejs(te.end_date) < formatDateToday) {
        return 'event-has-passed'
      } else {
        return 'card'
        }
      }
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
  };
</script>