<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Outlet Details By Name</h1>
  <!--ODBN Target: {{ outlet_details_by_name.outlet_details_by_name.target }}-->
  ODBN ID: {{ outlet_details_by_name.outlet_details_by_name.id }}
  <br/>
  <div class="card-display">
    <OutletDetailsByNameCard
      :key="outlet_details_by_name.outlet_details_by_name.id"
      :outlet="outlet_details_by_name.outlet_details_by_name"
      class="card"
      @dblclick="onDoubleClick(outlet_details_by_name)"
      />
  </div>
  <!--      :origin="origin"-->
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import OutletDetailsByNameCard from "@/components/outlets/OutletDetailsByNameCard.vue";
export default {
  name: 'OutletDetailsByName',
  props: {
    //outlet_name: {
    //  type: String, required: true
    //},
    //outlet_details_by_name: {
    //  type: String, required: true
    //}
  },
  components: {
    ConfirmDialogue,
    OutletDetailsByNameCard,
  },
  data() {
    return {
      outlet_name: null,
    };
  },
  created() {
    console.log("Created Outlet Details By Name: ", this.$store.dispatch("fetchOutletDetailsByName", this.$route.params.outlet_details_by_name))
    this.$store.dispatch("fetchOutletDetailsByName", this.$route.params.outlet_details_by_name);
  },
  computed: {
    outlet_details_by_name() {
      console.log("ODBN - Computed Outlet By Name: ", this.$store.state.outlet_details_by_name)
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