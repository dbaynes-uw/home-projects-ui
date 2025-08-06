<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Plant Card</h1>
  <router-link :to="{ name: 'Gardens' }">
      <h2>Back to Gardens</h2>
    </router-link>
    <router-link
      :to="{ name: 'GardenDetails', params: { id: this.plant.garden_id} }"
    >
      <h2>Back to {{ garden.name }}</h2>
    </router-link>
  <br/>
  <div class="card-display">
    <PlantCard
      :key="plant.id"
      :plant="plant"
      :watering="watering"
      class="card"
      @dblclick="editPlant(plant)"
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
  },
  components: {
    ConfirmDialogue,
    PlantCard,
  },
  created() {
    this.$store.dispatch("fetchPlant", this.id)
  },
  computed: {
    plant() {
      return this.$store.state.plant;
    },
    garden() {
      return this.$store.state.gardens.find((garden) => garden.id === this.plant.garden_id)
     },
    watering() {
      return this.$store.state.waterings.find((watering) => watering.id === this.plant.watering_id);
    },
  },
  data() {
    return {
      updatedPlant: null,
    };
  },
  methods: {
    editPlant(plant) {
      this.$router.push({ name: 'PlantEdit', params: { id: `${plant.id}` } });
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
};
</script>
<style scoped>
</style>
