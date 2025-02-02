<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="card">
    <p id="p-custom-link">
       <router-link
         :to="{ name: 'GardenEdit', params: { id: `${garden.id}` } }"
       >
         {{ garden.garden_name }}
       </router-link>
     </p>
     <!--router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
          Garden Details {{ garden.garden_name }}
      </!--router-link-->
    <ul>
      <li class="li-left">Garden: {{ garden.garden_name}}</li>
      <li class="li-left">Notes:</li>
      <b class="li-left-none" v-for="(notes, idx) in splitList(garden, this.splitLength)" :key="idx">{{ notes }}</b>
    </ul>
    <p id="p-custom-link">
       <router-link
         :to="{ name: 'PlantCreate', params: { id: `${garden.id}` } }"
       >
         Add a Garden Event for {{ garden.title }}
       </router-link>
     </p>
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
