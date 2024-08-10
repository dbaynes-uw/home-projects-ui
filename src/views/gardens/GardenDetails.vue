<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Garden and Plants</h1>
  <div class="card-display">
    <GardenCard
      :key="garden.id"
      :garden="garden"
      :origin="origin"
      class="card"
      @dblclick="editGarden(garden)"
      />
  </div>
  <span class="h3-left-total-child">Double Click Item to Change</span>
  <div class="cards">
    <PlantCard
      v-for="plant in garden.plants"
      :key="plant.id"
      :plant="plant"
      class="card"
      @dblclick="editPlant(plant)"
    />
  </div>
</template>

<script>
//import { ref, computed } from "vue";
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
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
  created() {
    this.$store.dispatch("fetchGarden", this.id);
  },
  computed: {
    garden() {
      return this.$store.state.garden;
    },
    origin() {
      return "GardenDetails"
    }
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
