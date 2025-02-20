<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Outlet Details</h1>
  <br/>
  <ul>
    <li class="left">
      <button id="button-as-link">
        <router-link  :to="{ name: 'WateringDetails', params: { id: `${outlet.watering_id}` } }">
          Back to the Watering: {{ outlet.watering_id }}
        </router-link>
      </button>
    </li>
    <li class="left">
      <button id="button-as-link">
        <router-link  :to="{ name: 'PlantDetails', params: { id: `${plant.outlet_id}` } }">
          Back to the Plant: {{ plant.plant_name }}
        </router-link>
      </button>
    </li>
    Plant: {{ plant.outlet_id }}
  </ul>
  <br/>
  <div class="card-display">
    <OutletCard
      :key="outlet.id"
      :outlet="outlet"
      class="card"
      @dblclick="editOutlet(outlet)"
      />
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import OutletCard from "@/components/outlets/OutletCard.vue";
export default {
  name: 'OutletDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    OutletCard,
  },
  created() {
    this.$store.dispatch("fetchOutlet", this.id);
    //this.$store.dispatch("fetchPlant", this.outlet_id);
  },
  computed: {
    outlet() {
      return this.$store.state.outlet;
    },
    plant() {
      return this.$store.state.plant;
    },
  },
  data() {
    return {
      updatedOutlet: null,
    };
  },
  methods: {
    editOutlet(outlet) {
      this.$router.push({ name: 'OutletEdit', params: { id: `${outlet.id}`} });
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
};
</script>
<style scoped>
.event {
  font-size: 1.5rem;
}
#align-right {
  text-align: center;
}
body {
  font-size: 1.6rem;
}
.right-align {
  text-align: right;
}
</style>
