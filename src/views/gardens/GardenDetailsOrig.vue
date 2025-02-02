<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Garden Details and Plants </h1>
  <br/>
  <h1>{{ garden.garden_name }}</h1>
  <br/>
  <router-link :to="{ name: 'GardenList' }">
      <h2>Back to Garden List</h2>
  </router-link>
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
  Garden 1: {{ garden.garden_name }}
  <div class="cards-1-center">
    <GardenCard
      :key="garden.id"
      :garden="garden"
      class="card"
      @dblclick="editGarden(garden)"
      />
  </div>
  Garden: {{ garden.garden_name }}
  <!--span v-if="garden.garden_name">
    <span v-if="garden.garden_name == 'Vegetable'"> <toLowerCase().includes('vegetable')"></span>
      <span class="h3-left-total-child"><b>See Vegetable Garden Layout at bottom of page</b></span>
    </span-->
  <!--span-->
  <br/>
  <span class="h3-left-total-child"><b>Double Click Plant to Change</b></span>

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
  <!--span v-if="garden.garden_name.toLowerCase().includes('vegetable')">
    <v-img
      :src="require('../../assets/VegetableGardenLayoutSummer2024.png')"
      class="my-3"
      contain
      height="400"
    />
  </!--span-->
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import GardenCard from "@/components/gardens/GardenCard.vue";
import PlantCard from "@/components/plants/PlantCard.vue";
export default {
  name: 'GardenDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    GardenCard,
    PlantCard,
  },
  created() {
    this.$store.dispatch("fetchGarden", this.id);
    //this.$store.dispatch('resetModule', 'fetchOutletDetailsByName')
    //this.sortedData = this.$store.dispatch("fetchGardens");
  },
  computed: {
    garden() {
      return this.$store.state.garden;
    },
    watering() {
      return this.$store.state.watering;
    },
  },

  data() {
    return {
      plant: {
        id: "",
        garden_id: "",
        outlet_id: "",
        plant_name: "",
        outlet_name: "",
        yard_location: "",
        description: "",
        online_link: "",
        date_planted: "",
        date_harvested: "",
        duration: "",
        active: "",
        notes: "",
      }
    };
  },
  methods: {
    editGarden(garden) {
      this.$router.push({ name: 'GardenEdit', params: { id: `${garden.id}`} });
    },
    editPlant(plant) {
      this.$router.push({ name: 'PlantEdit', params: { id: `${plant.id}`} });
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
};
</script>
