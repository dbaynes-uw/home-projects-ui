<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <br/>
  <h1>{{ garden.name }} Details</h1>
  <ul>
    <li class="left">
      <button id="button-as-link">
        <router-link :to="{ name: 'GardenList' }">
          <b>Back to Garden List</b>
        </router-link>
      </button>
    </li>
    <li>
      <button id="button-as-link" @click="requestIndexDetail">
        <router-link :to="{ name: 'WateringList' }">
          <b>Waterings for {{ garden.name }}</b>
        </router-link>
      </button>
    </li>
  </ul> 
  <br/>
  <h3>{{ this.statusMessage }}</h3>
  <div class="cards-1-center">
    <GardenCard
      :key="garden.id"
      :garden="garden"
      />
    <br />
  </div>
  <div class="cards">
    <WateringCard
      v-for="watering in garden.waterings"
      :key="watering.id"
      :watering="watering"
    />
    <br />
  </div>
  <span v-if="garden.plants" class="h3-left-total-child">Double Click Item Below to Change</span>
  <span v-for="(p, p_index) in garden.plants" :key="p_index">
    {{ p.name }}
    <br/>
  </span>
  <div class="cards">
    <PlantCard
      v-for="plant in garden.plants"
      :key="plant.id"
      :plant="plant"
    />
  </div>
  <br/>
  <h3>Need Specific Watering Details Here instead of Generic</h3>
  <v-img
    :src="require('../../assets/WateringSystemLayoutSummer2025.png')"
    class="my-3"
    height="500"
    contain
  />    
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import GardenCard from "@/components/gardens/GardenCard.vue";
import WateringCard from "@/components/waterings/WateringCard.vue";
import PlantCard from "@/components/plants/PlantCard.vue";
import { ref } from 'vue';
const successMessage = ref('')
export default {
  name: 'GardenDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    GardenCard,
    PlantCard,
    WateringCard,
  },
  mounted() {   
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
  },
  data() {
    return {
      //For TESTING:
      //garden: {
      //  name: "TEST 1",
      //  description: "Test Desc",
      //  transport: 'Air France',
      //  booking_reference: 'TCUHEG',
      //  transport_url: 'https://wwws.airfrance.us/trip/trip-details/87c622c8-2ca6-49fe-939a-e94a77fb1d38',
      //  departure_date: "2025-10-10 15:32:22",
      //  return_date: "2025-11-12 12:30:22",
      //  notes: "Notes here...",
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