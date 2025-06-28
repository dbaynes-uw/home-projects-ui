<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="card">
    <span v-if="this.$route.name == 'GardenList'">
      <router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
        <h4><b>{{garden.name}}</b></h4>
      </router-link>
    </span>
    <span v-else>
      <router-link :to="{ name: 'GardenEdit', params: { id: `${garden.id}` } }">
        <h4><b>{{garden.name}}</b></h4>
      </router-link>
    </span>
    <p id="p-custom-left">Notes:</p>
    <b class="li-left-none" v-for="(notes, idx) in splitList(garden, this.splitLength)" :key="idx">{{ notes }}</b>
    <br/>
    <p id="p-custom-left">Waterings:</p>
    <span v-for="watering, wateringIndex in garden.waterings" :key="wateringIndex">
        <ul>
        <li class="li-left-bold">
          <router-link
          :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }"
          >
            {{watering.name}}
          </router-link>
        </li>
        </ul>
    </span>
    <p id="p-custom-link">
      <router-link
        :to="{ name: 'WateringCreate', params: { garden_id: `${garden.id}` } }"
        >
          Add Watering for {{ garden.name }}
      </router-link>
    </p>
    <br/>
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
    <p id="p-custom-link">
      <router-link
        :to="{ name: 'PlantCreate', params: { id: `${garden.id}` } }"
      >
        Add Plant
      </router-link>
    </p>

    <div id="spread">
      <span class="fa-stack">
        <router-link :to="{ name: 'GardenEdit', params: { id: `${garden.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-if="this.$route.name == 'GardenList'">
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
import SplitStringService from "@/services/SplitStringService.js";
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
  computed: {},
  created() {},
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
          garden.name +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "GardenList" });
      }
    },
    splitList(gardenData, splitLength) {
      return SplitStringService.splitList(gardenData.notes, splitLength) 
    },
  }
}
</script>
<style scoped></style>

