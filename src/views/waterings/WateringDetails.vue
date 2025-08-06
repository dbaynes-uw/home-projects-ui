<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>{{ watering.name }} Details</h2>
    </v-card-title>
    <ul>
    <li class="left">
      <button id="button-as-link">
        <router-link :to="{ name: 'Gardens' }">
          <b>Back to Gardens</b>
        </router-link>
      </button>
    </li>
    <li>
      <button id="button-as-link">
        <router-link :to="{ name: 'GardenDetails', params: { id: `${watering.garden_id}` } }">
          {{ watering.name }} Details
        </router-link>
      </button>
    </li>
    <li>
      <button id="button-as-link" @click="requestIndexDetail">
        <router-link :to="{ name: 'WateringList' }">
          <b>All Waterings</b>
        </router-link>
      </button>
    </li>
  </ul> 
  <br/>
  </v-card>
  <br/>
  <div class="watering-display">
    <div class="cards-1-center">
      <WateringCard
        :key="watering.id"
        :watering="watering"
      />      
      <br />
    </div>
  </div>
</template>
<script>
import WateringCard from "@/components/waterings/WateringCard.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import { ref } from 'vue';
const successMessage = ref('')
export default {
  name: "WateringDetails",
  props: ["id"],
  components: {
    WateringCard,
    ConfirmDialogue,
  },
  mounted() {
    this.sortedData = this.films;      
    successMessage.value = this.$route.query.success;
    this.statusMessage = successMessage.value
  },
  created() {
    this.$store.dispatch("fetchWatering", this.$route.params.id);
    
  },
  computed: {
    watering() {
      return this.$store.state.watering;
    },
    garden() {
      return this.$store.state.garden.find((garden) => garden.id === this.watering.garden_id);
    },
    plant()
    {
      return this.$store.state.plants.find((plant) => plant.id === this.watering.plant_id);
    },
  },
  data() {
    return {
      statusMessage: "",
    };
  },
  methods: {},
};
</script>
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
th:hover {
  cursor: pointer;
  background: rgb(229, 255, 211);
}
tr:nth-child(even) {
  background-color: #f3f3f3;
}
tr:nth-child(odd) {
  background-color: #41b88352;
  border: none !important;
}
</style>
