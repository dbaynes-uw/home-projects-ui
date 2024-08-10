<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Watering System</h2>
      <h2 id="status-message">
        <u>{{ this.statusMessage }}</u>
      </h2>
    </v-card-title>
    <br/>
    <ul>
      <span v-if="!watering">
        <li class="left">
          <button id="button-as-link">
           <router-link  :to="{ name: 'WateringCreate' }">Create Watering</router-link>
          </button>
        </li>
      </span>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'GardenList' }">Gardens</router-link>
        </button>
      </li>
    </ul> 
    <br/>
  </v-card>
  <br/>
  <span v-if="watering.active == true">
    <div class="watering-display">
      <span class="h3-left-total-child">Click to Change</span>
      <div class="cards-1-center">
        <WateringCard
          :watering="watering"
        >      
        </WateringCard>
      <br />
      </div>
    </div>
    <!--h3 id="h3-left">Total Outlets: {{ watering.outlets.length }}</!--h3-->
    <span class="h3-left-total-child">Double Click Item to Change</span>
      <div class="cards">
        <OutletCard
          v-for="outlet in watering.outlets"
          :key="outlet.id"
          :outlet="outlet"
          class="card"
          @dblclick="onDoubleClick(outlet)"
        />
      </div>
      <v-img
          :src="require('../../assets/vegetable_garden_summer_2024.png')"
          class="my-3"
          contain
          height="400"
      />
  </span>
</template>
<script>
import axios from "axios";
import WateringCard from "@/components/watering/WateringCard.vue";
import OutletCard from "@/components/outlets/OutletCard.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
export default {
  name: "WateringDisplay",
  props: [],
  components: {
    WateringCard,
    OutletCard,
    ConfirmDialogue,
  },
  data() {
    return {
      outlets: {
        id: null,
        watering_id: null,
        yard_location: null,
        faucet_location: null,
        line_number: null,
        target: null,
        frequency: null,
        start_time: null,
        duration: null,
        active: null,
        notes: null,
        created_at: null,
        updated_at: null,
        created_by: this.$store.state.user.resource_owner.email,
        updated_by: this.$store.state.user.resource_owner.email,
      },
      statusMessage: "",
    };
  },
  mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macwatering-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/waterings/get_watering";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/waterings/get_watering";
    }
    this.api_url = work_url
    this.watering = axios.get(this.api_url);
  },
  created() {
    this.$store.dispatch("fetchWatering");
  },
  computed: {
    watering() {
      return this.$store.state.watering;
    },
      /* For local testing: Outlet
    watering() {
      return [
      { yard_location: 'South',
        faucet_location: 'East',
        line_number: '1',
        target: 'Vegetable Garden',
        frequency: 'Everyday',
        start_time: '06:40',
        duration: '20mins',
        notes: 'Note or two',
      },
    },
   */
    origin() {
      return "WateringDisplay"
    }
  },
  methods: {
    onDoubleClick(outlet) {
      console.log("DBL CLICK to Outlet Edit")
      this.$router.push({ name: 'OutletEdit', params: { id: `${outlet.id}`} });
    },
  },
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
