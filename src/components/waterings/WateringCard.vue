<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="card">
    <h4>
      <router-link :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }">
        {{ watering.name }}
        </router-link>
    </h4>
    <ul>
      <span v-if="this.$route.name != 'GardenDetails'">
        <li class="li-left">Garden: <b>{{ watering.garden.name }}</b></li>
      </span>
      <li class="li-left">Status: <b>{{ watering.status }}</b></li>
    </ul>
    <span v-if="watering.notes">
      <ul>
        <li class="li-left">Notes:</li>
        <b class="li-left-none" v-for="(notes, idx) in 
          joinedNotes(watering)"
          :key="idx">{{ notes }}
        </b>
      </ul> 
    </span>
    <br/>
    <br/>
    <br/>
    <div id="spread">
      <span class="fa-stack">
        <router-link :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
        <router-link :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }">
          <i class="fa-solid fa-backward fa-stack-1x"></i>
        </router-link>
    </div>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import SplitStringService from "@/services/SplitStringService.js";
//import { useRoute } from 'vue-router'
export default {
  name: 'WateringCard',
  props: {
    watering: {
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
    async deleteWatering(watering) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Watering from List",
        message:
          "Are you sure you want to delete " +
          watering.name +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteWatering", watering);
        this.statusMessage =
          "Watering was Deleted for " +
          watering.name +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "WateringList" });
      }
    },
    splitList(wateringData, splitLength) {
      return SplitStringService.splitList(wateringData.notes, splitLength) 
    },
    joinedNotes(e) {
      return e.notes.split('\n');
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
.watering-card {
  width: 100%;
  margin: 1em auto 1em auto;
  padding: 1em;
  border: solid 1px #2c3e50;
  cursor: pointer;
  transition: all 0.2s linear;
}
.watering-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.watering-card h4 {
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.3em;
}
</style>
