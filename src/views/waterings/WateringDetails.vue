<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Watering System Details</h2>
    </v-card-title>
<v-img
      :src="require('../../assets/WateringSystemLayoutSummer2024.png')"
      class="my-3"
      height="500"
      contain
    />    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'GardenList' }">Gardens</router-link>
            <!--router-link :to="{ name: 'GardenDetails', params: { id: `${watering.garden_id}` } }">Back to Garden</router-link-->
        </button>
      </li>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'WateringList' }">Waterings</router-link>
            <!--router-link :to="{ name: 'GardenDetails', params: { id: `${watering.garden_id}` } }">Back to Garden</router-link-->
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
          <!--div class="cards"-->
      <!--WateringCard
        v-for="watering in watering"
        :key="watering.id"
        :watering="watering"
        class="card"
      /-->
    </div>
    <h3 id="h3-left">Total Outlets: {{ watering.outlets.length }}</h3>
    <span class="h3-left-total-child">Double Click Item to Change</span>
    <div class="cards">
      <OutletCard
        v-for="outlet in watering.outlets"
        :key="outlet.id"
        :outlet="outlet"
        class="card"
      />
    </div>
    <p id="p-custom-link">
      <router-link
        :to="{ name: 'OutletCreate', params: { id: `${watering.id}` } }"
      >
        <b>Add Outlet</b>
      </router-link>
    </p>
  </span>
</template>
<script>
import WateringCard from "@/components/waterings/WateringCard.vue";
import OutletCard from "@/components/outlets/OutletCard.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import { ref } from 'vue';
const successMessage = ref('')
export default {
  name: "WateringDetails",
  props: ["id"],
  components: {
    WateringCard,
    OutletCard,
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
  },
  data() {
    return {
      outlet: {
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
  methods: {
    editOutlet(outlet) {
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
