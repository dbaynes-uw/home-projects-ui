<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>GardenPlant Card</h1>
  <div class="card-display">
    <GardenPlantCard
      :key="plant.id"
      :plant="plant"
      :origin="origin"
      class="card"
      @dblclick="onDoubleClick(plant)"
      />
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import GardenPlantCard from "@/components/plants/PlantCard.vue";
export default {
  name: 'PlantDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    GardenPlantCard,
  },
  data() {
    return {
      updatedGardenPlant: null,
    };
  },
  methods: {
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
  created() {
    this.$store.dispatch("fetchPlants", this.id);
  },
  computed: {
    plant() {
      return this.$store.state.plant;
    },
    origin() {
      return "PlantDetails"
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
