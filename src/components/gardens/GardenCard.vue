<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <span v-if="garden.active == true">
    <div class="card">
      <span v-if="currentUrl.includes('/gardens/')">
        <h1 id="p-custom-link">
         <router-link
           :to="{ name: 'GardenEdit', params: { id: `${garden.id}` } }"
         >
          {{ garden.garden_name }}
         </router-link>
        </h1>
      </span>
      <span v-else>
        <h1 id="p-custom-link">
          <router-link
            :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
              {{ garden.garden_name }}
          </router-link>
       </h1>
      </span>
      <ul>
        <li class="li-left">Notes:</li>
        <b class="li-left-none" v-for="(notes, idx) in splitList(garden, this.splitLength)" :key="idx">{{ notes }}</b>
      </ul>
       <span v-if="garden.plants.length > 0">
        <p id="p-custom-left">Plants:</p>
        <span v-for="(plant, plantIndex) in garden.plants" :key="plantIndex">
          <ul class="ul-left">
            <li>
              <router-link
                :to="{ name: 'PlantDetails', params: { id: `${plant.id}`}, props: { garden: `${garden}` } }"
              >
              <b>{{plant.plant_name}}</b>
              </router-link>
            </li>
          </ul>          
        </span>
      </span>
      <br/>
       <br/>
        <span class="fa-stack">
          <router-link :to="{ name: 'GardenEdit', params: { id: `${garden.id}` } }">
            <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
          </router-link>
        </span>
        <span v-if="currentUrl.includes('/gardens/')" class="fa-stack">
          <router-link :to="{ name: 'GardenList' }">
            <i class="fa-solid fa-backward fa-stack-1x"></i>
          </router-link>
        </span>
        <span v-else>
          <router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
            <i class="fa-solid fa-eye fa-stack-1x"></i>
          </router-link>
        </span>
        <span class="fa-stack">
          <i @click="deleteGarden(garden)" class="fas fa-trash-alt fa-stack-1x">
          </i>
        </span>
    </div>
  </span>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import SplitStringService from "@/services/SplitStringService.js";
import { useRoute } from 'vue-router'
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
  setup() {
    const route = useRoute()
    return {
      currentUrl: route.fullPath
    }
  },
  data() {
    return {
      splitLength: 30,
    };
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

<style scoped>
.garden-card {
  width: 100%;
  margin: 1em auto 1em auto;
  padding: 1em;
  border: solid 1px #2c3e50;
  cursor: pointer;
  transition: all 0.2s linear;
}
.garden-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.garden-card h4 {
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.3em;
}
</style>
