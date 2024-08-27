<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <span v-if="outlet">
    <!--span v-if="this.$route.params.outlet_details_by_name == outlet.outlet_name"-->
      <h2>Watering Outlet</h2>
      <h1>{{ outlet.yard_location }} {{ outlet.faucet_location }} Line - {{ outlet.line_number }}</h1>
      <br/>
      <div class="card-display">
        <OutletCard
          :key="outlet.id"
          :outlet="outlet"
          class="card"
          @dblclick="onDoubleClick(outlet)"
          />
      </div>
    <!--/span-->
  </span>
  <!--      :origin="origin"-->
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import OutletCard from "@/components/outlets/OutletCard.vue";
export default {
  name: 'OutletDetailsByName',
  props: {},
  components: {
    ConfirmDialogue,
    OutletCard,
  },
  data() {
    return {
      outlet_name: null,
    };
  },
  created() {
    this.$store.dispatch("fetchOutletDetailsByName", this.$route.params.outlet_details_by_name);
  },
  computed: {
    outlet() {
      console.log("STORE: ", this.$store.state.outlet_details_by_name)
      return this.$store.state.outlet_details_by_name //, this.$route.params.outlet_details_by_name;
    },
    //origin() {
    //  return "OutletDetails"
    //}
  },
  methods: {
    onDoubleClick(outlet) {
      console.log("DBL CLICK to Outlet Edit")
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