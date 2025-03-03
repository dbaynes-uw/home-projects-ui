<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <!--span v-if="watering.active == true"-->
  <div class="card">
    <!--Route: {{ this.$route.name }}-->
    <span v-if="this.$route.name == 'WateringList'">
      <!--As opposed to: span v-if="currentUrl.includes('/waterings/')"-->
      <h4>
        <router-link :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }">
          {{ watering.watering_name }}
          </router-link>
      </h4>
      <ul>
        <li class="li-left">Notes:</li>
        <b class="li-left-none" v-for="(notes, idx) in splitList(watering, this.splitLength)" :key="idx">{{ notes }}</b>
      </ul>   
    </span>
    <span v-else>
      <h4 id="p-custom-link">
        <router-link
          :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }"
        >
          Edit {{ watering.watering_name }}
        </router-link>
      </h4>
    </span>
    <br/>
    <span v-if="watering.outlets && watering.outlets.length > 0">
      <p id="p-custom-left">Outlets:</p>
      <span v-for="(outlet, outletIndex) in watering.outlets" :key="outletIndex ">
        <ul class="ul-left">
          <li class="li-left-bold">
            <router-link
              :to="{ name: 'OutletDetails', params: { id: `${outlet.id}`} }"
            >
              <b>{{outlet.outlet_name}}</b>
            </router-link>
          </li>
        </ul>          
      </span>
    </span>
    <br/>
    Gardens:
    <span v-if="watering.gardens && watering.gardens.length > 0">
      <p id="p-custom-left">Outlets:</p>
      <span v-for="(outlet, outletIndex) in watering.outlets" :key="outletIndex ">
        <ul class="ul-left">
          <li class="li-left-bold">
            <router-link
              :to="{ name: 'OutletDetails', params: { id: `${outlet.id}`} }"
            >
              <b>{{outlet.outlet_name}}</b>
            </router-link>
          </li>
        </ul>          
      </span>
    </span>
    <br/>
    <p id="p-custom-link">
      <router-link
        :to="{ name: 'OutletCreate', params: { id: `${watering.id}` } }"
      >
        Add Outlet
      </router-link>
    </p> 
    <br/>
    <div id="spread">
      <span class="fa-stack">
        <router-link :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-if="this.$route.name == 'WateringList'">
      <!--span v-if="currentUrl.includes('/waterings/')" class="fa-stack"-->
        <router-link :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }">
          <i class="fa-solid fa-backward fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-else>
        <router-link :to="{ name: 'WateringList' }">
          <i class="fa-solid fa-eye fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteWatering(watering)" class="fas fa-trash-alt fa-stack-1x">
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
  computed: {
    //watering() {
    //  return this.$store.state.watering;
    //},
  },
  created() {
    //console.log("Created Watering by Watering ID: ", this.watering.id)
    //this.$store.dispatch("fetchWatering", this.watering.id);
  },
  methods: {
    async deleteWatering(watering) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Watering from List",
        message:
          "Are you sure you want to delete " +
          watering.watering_name +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteWatering", watering);
        this.statusMessage =
          "Watering was Deleted for " +
          watering.watering_name +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "WateringList" });
      }
    },
    splitList(wateringData, splitLength) {
      return SplitStringService.splitList(wateringData.notes, splitLength) 
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
