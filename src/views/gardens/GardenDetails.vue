<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <br/>
  <h1>{{ garden.garden_name }} Details</h1>
  <br/>
  <router-link :to="{ name: 'GardenList' }">
    <b>Back to List of Gardens</b>
  </router-link>
    <!--span v-for="(outlet, outletIndex) in watering.outlets" :key="outletIndex">
    <span v-if="garden.garden_name == outlet.target">
      <router-link
          :to="{ name: 'OutletDetails', params: { id: `${outlet.id}` } }"
      >
      <b>See Watering Schedule</b>
      </router-link>
    </span>
  </!--span-->
  <br/>    
  <h3>{{ this.statusMessage }}</h3>
  <span class="h3-left-total-child">Click to Change</span>
  <div class="cards-1-center">
    <GardenCard
      :key="garden.id"
      :garden="garden"
      class="card"
      />
    <br />
  </div>
  <span class="h3-left-total-child">Double Click Item Below to Change</span>
  <span v-for="(p, p_index) in garden.plants" :key="p_index">
    {{ p.name }}
    <br/>
  </span>
  <div class="cards">
    <PlantCard
      v-for="plant in garden.plants"
      :key="plant.id"
      :plant="plant"
      class="card"
    />
  </div>
  <br/>
  <!--div class="cards">
    <WateringCard
      v-for="watering in garden.waterings"
      :key="watering.id"
      :watering="watering"
      class="card"
    />
  </!--div-->
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import GardenCard from "@/components/gardens/GardenCard.vue";
import PlantCard from "@/components/plants/PlantCard.vue";
//import WateringCard from "@/components/waterings/WateringCard.vue";
import { ref } from 'vue';
const successMessage = ref('')
export default {
  name: 'GardenDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    GardenCard,
    PlantCard,
    //WateringCard,
  },
  mounted() {
    this.sortedData = this.films;      
    successMessage.value = this.$route.query.success;
    this.statusMessage = successMessage.value
  },
  created() {
    this.$store.dispatch("fetchGarden", this.$route.params.id);
  },
  computed: {
    garden() {
      return this.$store.state.garden;
    },
    //watering() {
    //  return this.$store.state.watering;
    //},
  },
  data() {
    return {
      //For TESTING:
      //garden: {
      //  garden_name: "TEST 1",
      //  description: "Test Desc",
      //  transport: 'Air France',
      //  booking_reference: 'TCUHEG',
      //  transport_url: 'https://wwws.airfrance.us/trip/trip-details/87c622c8-2ca6-49fe-939a-e94a77fb1d38',
      //  departure_date: "2025-10-10 15:32:22",
      //  return_date: "2025-11-12 12:30:22",
      //  notes: "Notes here...",
      //},
      plant: {
        id: "",
        garden_id: "",
        outlet_id: "",
        name: "",
        yard_location: "",
        description: "",
        online_link: "",
        date_planted: "",
        date_harvested: "",
        duration: "",
        active: "",
        notes: "",
      },
      outlet: {
        outlet_name: "",
      },
      //watering: {
      //  id: "",
      //  garden_id: "",
      //  watering_name: "",
      //  notes: "",
      //},
      statusMessage: '',
    };
  },
  methods: {
    editGarden(garden) {
      this.$router.push({ name: 'GardenEdit', params: { id: `${garden.id}` } });
    },
    editPlant(plant) {
      this.$router.push({ name: 'PlantEdit', params: { id: `${plant.id}` } });
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
};
</script>