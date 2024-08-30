<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Garden and Plants</h1>
  <router-link :to="{ name: 'GardenList' }">
      <b>Back to Garden List</b>
      <br>
    </router-link>
    <!--tr v-for="(result, resultIndex) in plants" :key="resultIndex"></!--tr-->
    <span v-for="(outlet, outletIndex) in watering.outlets" :key="outletIndex">
      <span v-if="garden.garden_name == outlet.target">
          <router-link
              :to="{ name: 'OutletDetails', params: { id: `${outlet.id}` } }"
              >
            <b>See Watering Schedule</b>
          </router-link>
      </span>
    </span>
    <br/>
    <br/>
  <div class="card-display">
    <GardenCard
      :key="garden.id"
      :garden="garden"
      :origin="origin"
      class="card"
      @dblclick="editGarden(garden)"
      />
  </div>
  <span v-if="garden.garden_name.toLowerCase().includes('vegetable')">
    <span class="h3-left-total-child"><b>See Vegetable Garden Layout Below</b></span>
  </span>
  <br/>
  <span class="h3-left-total-child"><b>Double Click Item to Change</b></span>

  <div class="cards">
    <PlantCard
      v-for="plant in garden.plants"
      :key="plant.id"
      :plant="plant"
      class="card"
      @dblclick="editPlant(plant)"
    />
  </div>
  <br>
  <span v-if="garden.garden_name.toLowerCase().includes('vegetable')">
    <v-img
      :src="require('../../assets/VegetableGardenLayoutSummer2024.png')"
      class="my-3"
      contain
      height="400"
    />
  </span>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import GardenCard from "@/components/gardens/GardenCard.vue";
import PlantCard from "@/components/plants/PlantCard.vue";
//>import EventService from '@/services/EventService'
export default {
  name: 'GardenDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    GardenCard,
    PlantCard,
  },
  data() {
    return {
      updatedGardenPlant: null,
    };
  },

  methods: {
    editGarden(garden) {
      this.$router.push({ name: 'GardenEdit', params: { id: `${garden.id}`} });
    },
    editPlant(plant) {
      this.$router.push({ name: 'PlantEdit', params: { id: `${plant.id}`} });
    },
    //>getOutlet(garden) {
    //>  console.log("Garden: ", garden)
    //>  EventService.getGardenOutlet(garden.id)
    //>    .then((response) => {
    //>      return response.data;
    //>    })
    //>    .catch((error) => {
    //>      console.log(error);
    //>    });
    //>},
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
  created() {
    this.$store.dispatch("fetchGarden", this.id);
    //this.$store.dispatch('resetModule', 'fetchOutletDetailsByName')
    this.sortedData = this.$store.dispatch("fetchGardens");
  },
  computed: {
    garden() {
      return this.$store.state.garden;
    },
    origin() {
      return "GardenDetails"
    },
    watering() {
      return this.$store.state.watering;
    },
  },
};
</script>
<style scoped>
.event {
  font-size: 1.5rem;
}
#align-right {
  text-align: center;
}
body {
  font-size: 1.6rem;
}
.right-align {
  text-align: right;
}
</style>
