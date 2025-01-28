<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="card">
    <p id="p-custom-link">{{ travel.title}}</p>
    <!--p id="p-custom-link">
       <router-link
         :to="{ name: 'TravelEdit', params: { id: `${travel.id}` } }"
       >
         {{ travel.title }}
       </router-link>
     </!--p-->
    <ul>
      <li class="li-left">Description: {{ travel.description }}</li>
      <li class="li-left">Transportation: {{ travel.transport_type }}</li>
      <li class="li-left">Booking Reference: <b><a :href="travel.transport_url" target="_blank">{{ travel.booking_reference }}</a></b></li>

      <li class="li-left">Depart: {{ formatStandardDateTime(travel.departure_date) }}</li>
      <li class="li-left">Return: {{ formatStandardDateTime(travel.return_date) }}</li>

      <li class="li-left">Notes:</li>
      <b class="li-left-none" v-for="(notes, idx) in splitList(travel, this.splitLength)" :key="idx">{{ notes }}</b>
    </ul>
    <p id="p-custom-link">
       <router-link
         :to="{ name: 'TravelEventCreate', params: { id: `${travel.id}` } }"
       >
         Add a Travel Event for {{ travel.title }}
       </router-link>
     </p>
     <br/>
      <span class="fa-stack">
        <router-link :to="{ name: 'TravelEdit', params: { id: `${travel.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-if="currentUrl.includes('/travels/')" class="fa-stack">
        <router-link :to="{ name: 'TravelList' }">
          <i class="fa-solid fa-backward fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-else>
        <router-link :to="{ name: 'TravelDetails', params: { id: `${travel.id}` } }">
          <i class="fa-solid fa-eye fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteTravel(travel)" class="fas fa-trash-alt fa-stack-1x">
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
  name: 'TravelCard',
  props: {
    travel: {
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
    async deleteTravel(travel) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Travel from List",
        message:
          "Are you sure you want to delete " +
          travel.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteTravel", travel);
        this.statusMessage =
          "Travel was Deleted for " +
          travel.title +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "TravelList" });
      }
    },
    splitList(travelData, splitLength) {
      return SplitStringService.splitList(travelData.notes, splitLength) 
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
.travel-card {
  width: 100%;
  margin: 1em auto 1em auto;
  padding: 1em;
  border: solid 1px #2c3e50;
  cursor: pointer;
  transition: all 0.2s linear;
}
.travel-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.travel-card h4 {
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.3em;
}
</style>
