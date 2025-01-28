<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>{{ travel.title }}</h1>
  <router-link :to="{ name: 'TravelList' }">
      <b>Back to List of Journies</b>
    </router-link>
  <br/>
  <br/>
  <h3>{{ this.statusMessage }}</h3>
  <span class="h3-left-total-child">Click to Change</span>
  <div class="cards-1-center">
    <TravelCard
      :key="travel.id"
      :travel="travel"
      class="card"
      @dblclick="editTravel(travel)"
      />
    <br />
  </div>
  <span class="h3-left-total-child">Double Click Item Below to Change</span>
  <br/>
  <div class="cards">
    <TravelEventCard
      v-for="travel_event in travel.travel_events"
      :key="travel_event.id"
      :travel_event="travel_event"
      class="card"
      @dblclick="editTravelEvent(travel_event)"
    />
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
    this.$store.dispatch("fetchTravel", this.id);
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
      updatedTravel: null,
    };
  },
  methods: {
    editTravel(travel) {
      this.$router.push({ name: 'TravelEdit', params: { id: `${travel.id}` } });
    },
    editTravelEvent(travel_event) {
      this.$router.push({ name: 'TravelEventEdit', params: { id: `${travel_event.id}` } });
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
};
</script>