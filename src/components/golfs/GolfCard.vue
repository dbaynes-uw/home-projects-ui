<template>
  <div id="required-to-prevent-vue-warning">
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
    <div class="card">
      <p id="p-custom-left-u">{{ golf.course}}</p>
      <ul>
        <li class="li-left">Course: <b>{{ golf.course }}</b></li>
        <li class="li-left">Tees: <b>{{ golf.tees_played }}</b></li>
        <li class="li-left">Date Played: {{ formatYearDate(golf.date_played) }}</li>
        <li class="li-left"># Holes Played: <b>{{ determineHolesPlayed(golf) }}</b></li>
        <li class="li-left">Par: <b>{{ this.par = calculateTotalScore(golf)}}</b></li>
        <li class="li-left">URL to Course: <b> <a :href="golf.url_to_course" target="_blank">{{ golf.course }}</a></b></li>
        <li class="li-left">Notes:</li>
        <b class="li-left-none" v-for="(notes, idx) in splitList(golf, this.splitLength)" :key="idx">{{ notes }}</b>
      </ul>
      <br/>
      <span class="fa-stack">
        <router-link :to="{ name: 'GolfEdit', params: { id: `${golf.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-if="currentUrl.includes('/golfs/')" class="fa-stack">
        <router-link :to="{ name: 'GolfList' }">
          <i class="fa-solid fa-backward fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-else>
        <router-link :to="{ name: 'GolfDetails', params: { id: `${golf.id}` } }">
          <i class="fa-solid fa-eye fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteGolf(golf)" class="fas fa-trash-alt fa-stack-1x">
        </i>
      </span>
      <br />
    </div>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import SplitStringService from "@/services/SplitStringService.js";
import GolfCalculations from "@/components/golfs/GolfCalculations.js";
import { useRoute } from 'vue-router'
export default {
  name: 'GolfCard',
  props: {
    golf: {
      type: Object,
      default: () => ({})
    },
    origin: {
      type: String,
      default: '',
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
      par: 0,
    }
  },
  methods: {
    async deleteGolf(golf) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Golf from List",
        message:
          "Are you sure you want to delete " +
          golf.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteGolf", golf);
        this.statusMessage =
          "Golf was Deleted for " +
          golf.title +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "GolfList" });
      }
    },
    //Services:
    splitList(golfData, splitLength) {
      return SplitStringService.splitList(golfData.notes, splitLength) 
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
    determineHolesPlayed(golf) {
      return GolfCalculations.determineHolesPlayed(golf)
    },
    calculateTotalScore(golf) {
      return GolfCalculations.calculateTotalScore(golf)
    },
  }
}
</script>

<style scoped>
</style>
