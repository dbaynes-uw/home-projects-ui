<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <!--span v-if="garden.active == true"-->
  <div class="card">
    <!--Route: {{ this.$route.name }}-->
    <span v-if="this.$route.name == 'GardenList'">
      <!--As opposed to: span v-if="currentUrl.includes('/gardens/')"-->
      <h4>
        <router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
          {{ garden.garden_name }}
          </router-link>
      </h4>
      <ul>
        <li class="li-left">Notes:</li>
        <b class="li-left-none" v-for="(notes, idx) in splitList(garden, this.splitLength)" :key="idx">{{ notes }}</b>
      </ul>   
      <p id="p-custom-left">Waterings:</p>
      <span v-for="watering, wateringIndex in garden.waterings" :key="wateringIndex">
          <ul>
          <li class="li-left-bold">
            <router-link
            :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }"
            >
              {{watering.watering_name}}
            </router-link>
          </li>
          </ul>
      </span>
      <p id="p-custom-link">
        <router-link
        :to="{ name: 'WateringCreate', params: { id: `${garden.id}` } }"
        >
          Add Watering
      </router-link>
    </p>
    </span>
    <span v-else>
      <h4 id="p-custom-link">
        <router-link
          :to="{ name: 'GardenEdit', params: { id: `${garden.id}` } }"
        >
          Edit {{ garden.garden_name }}
        </router-link>
      </h4>
    </span>
    <span v-if="garden.plants && garden.plants.length > 0">
      <p id="p-custom-left">Plants:</p>
      <span v-for="(plant, plantIndex) in garden.plants" :key="plantIndex ">
        <ul class="ul-left">
          <li>
            <router-link
              :to="{ name: 'PlantDetails', params: { id: `${plant.id}`} }"
            >
            <b>{{plant.plant_name}}</b>
            </router-link>
          </li>
        </ul>          
      </span>
    </span>
    <br/>
    <p id="p-custom-link">
      <router-link
        :to="{ name: 'PlantCreate', params: { id: `${garden.id}` } }"
      >
        Add Plant
      </router-link>
    </p>
    <br/>
    <br/>
    <div id="spread">
      <span class="fa-stack">
        <router-link :to="{ name: 'GardenEdit', params: { id: `${garden.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-if="this.$route.name == 'GardenList'">
      <!--span v-if="currentUrl.includes('/gardens/')" class="fa-stack"-->
        <router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
          <i class="fa-solid fa-backward fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-else>
        <router-link :to="{ name: 'GardenList' }">
          <i class="fa-solid fa-eye fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteGarden(garden)" class="fas fa-trash-alt fa-stack-1x">
        </i>
      </span>
    </div>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import SplitStringService from "@/services/SplitStringService.js";
//import { useRoute } from 'vue-router'
export default {
  name: 'GardenCard',
  props: {
    garden: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    ConfirmDialogue,
  },
  setup() {},
  data() {
    return {
      splitLength: 30,
    };
  },
  computed: {
    //watering() {
    //  return this.$store.state.watering;
    //},
  },
  created() {
    //console.log("Created Watering by Garden ID: ", this.garden.id)
    //this.$store.dispatch("fetchWatering", this.garden.id);
  },
  methods: {
    async deleteGarden(garden) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Garden from List",
        message:
          "Are you sure you want to delete " +
          garden.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteGarden", garden);
        this.statusMessage =
          "Garden was Deleted for " +
          garden.title +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "GardenList" });
      }
    },
    splitList(gardenData, splitLength) {
      return SplitStringService.splitList(gardenData.notes, splitLength) 
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
  }
}
</script>
<style scoped></style>

