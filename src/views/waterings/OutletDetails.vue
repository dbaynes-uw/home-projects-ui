<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Outlet Details</h1>
  <br/>
  <ul>
    <li class="left">
      <button id="button-as-link">
        <router-link  :to="{ name: 'GardenDetails', params: { id: `${outlet.garden_id}` } }">
          Back to the Garden
        </router-link>
      </button>
    </li>
  </ul>
  <br/>
  <div class="card-display">
    <OutletCard
      :key="outlet.id"
      :outlet="outlet"
      :origin="origin"
      class="card"
      @dblclick="onDoubleClick(outlet)"
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
  data() {
    return {
      updatedOutlet: null,
    };
  },
  created() {
    this.$store.dispatch("fetchOutlet", this.id);
  },
  computed: {
    outlet() {
      return this.$store.state.outlet;
    },
    //origin() {
    //  return "OutletDetails"
    //}
  },
  methods: {
    onDoubleClick(outlet) {
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
