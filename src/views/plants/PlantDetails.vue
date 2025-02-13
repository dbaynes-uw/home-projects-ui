<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Plant Card</h1>
  <router-link :to="{ name: 'GardenList' }">
      <h2>Back to Garden List</h2>
    </router-link>
    <router-link
      :to="{ name: 'GardenDetails', params: { id: this.plant.garden_id} }"
    >
      <h2>Back to {{ garden.garden_name }}</h2>
    </router-link>
  <br/>
  <div class="card-display">
    <PlantCard
      :key="plant.id"
      :plant="plant"
      :origin="origin"
      class="card"
      @dblclick="onDoubleClick(plant)"
      />
  </div>
</template>
<script>

import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import PlantCard from "@/components/plants/PlantCard.vue";
export default {
  name: 'PlantDetails',
  props: {
    id: {
      type: String,
      default: '',
    },
    //xgarden: {
    //x  type: Object,
    //x  default: () => ({})
    //x},
  },
  components: {
    ConfirmDialogue,
    PlantCard,
  },
  data() {
    return {
      updatedPlant: null,
    };
  },
  methods: {
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
  created() {
    //this.$store.dispatch("fetchPlant", this.id);
  },
  computed: {
    plant() {
      return this.$store.state.plant;
    },
    garden() {
      return this.$store.state.gardens.find((garden) => garden.id === this.plant.garden_id)
     },
    origin() {
      return "PlantDetails"
    }
  },
};
</script>
<style scoped>
</style>
