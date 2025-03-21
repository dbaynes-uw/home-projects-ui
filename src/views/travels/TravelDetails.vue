<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Travels</h2>
      <h2 id="status-message">
        <u>{{ this.statusMessage }}</u>
      </h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'TravelCreate'}">Add Trip</router-link>
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
  <span class="h3-left-total-child">Click to Change</span>
  <div class="cards-1-center">
    <TravelCard
      :travel="travel"
      />
    <br />
  </div>
  <span class="h3-left-total-child">Double Click Item Below to Change</span>
  <br/>
  <div class="travel-list">
    <div class="cards">
      <TravelEventCard
        v-for="travel_event in travel.travel_events"
        :key="travel_event.id"
        :travel_event="travel_event"
      />
    </div>
    <p id="p-custom-link">
      <router-link
        :to="{ name: 'TravelEventCreate', params: { id: `${travel.id}` } }"
      >
        <b>Add Travel Event</b>
      </router-link>
    </p>
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import TravelCard from "@/components/travels/TravelCard.vue";
import TravelEventCard from "@/components/travel_events/TravelEventCard.vue";
import { ref } from 'vue';
const successMessage = ref('')
export default {
  name: 'TravelDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    TravelCard,
    TravelEventCard,
  },
  mounted() {
    this.sortedData = this.films;      
    successMessage.value = this.$route.query.success;
    this.statusMessage = successMessage.value
  },
  created() {
    this.$store.dispatch("fetchTravel", this.$route.params.id);
  },
  computed: {
    travel() {
      return this.$store.state.travel;
    },
  },
  data() {
    return {
      //For TESTING:
      //travel: {
      //  title: "TEST 1",
      //  description: "Test Desc",
      //  transport: 'Air France',
      //  booking_reference: 'TCUHEG',
      //  transport_url: 'https://wwws.airfrance.us/trip/trip-details/87c622c8-2ca6-49fe-939a-e94a77fb1d38',
      //  departure_date: "2025-10-10 15:32:22",
      //  return_date: "2025-11-12 12:30:22",
      //  notes: "Notes here...",
      //},
      travel_event: {
        id: "",
        travel_id: "",
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        transport: "",
        booking_reference: "",
        transport_url: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      statusMessage: '',
    };
  },
  methods: {
    editTravel(travel) {
      this.$router.push({ name: 'TravelEdit', params: { id: `${travel.id}` } });
    },
    editTravelEvent(travel_event) {
      this.$router.push({ name: 'TravelEventEdit', params: { id: `${travel_event.id}` } });
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
<style scoped>
.travel-list {
  width:auto
}
</style>