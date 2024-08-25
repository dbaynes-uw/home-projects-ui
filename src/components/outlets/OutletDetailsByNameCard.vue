<template>
  OBN CARD - outlet_details_by_name? {{ outlet }}
  <!--span v-if="outlet.active == 1"-->
    <div class="card">
      <p id="p-custom-left-u">@@{{ outlet.outlet_name }} </p> 
      <ul>
        <!--li class="li-left">Status: <b>{{ outlet.active == 1 ? 'Active' : 'Inactive' }}</b></!--li-->
        <!--li class="li-left">Line: <b>{{ outlet.line_number }}</b></!--li-->
        <li class="li-left">Target: <b><u>{{ outlet.target }}</u></b></li>
        <li class="li-left">Frequency: {{ outlet.frequency }}</li>
        <li class="li-left">Start: {{ formatTime(outlet.start_time)}}</li>
        <li class="li-left">Duration: {{ outlet.duration }}</li>
        <li class="li-left">Notes: <b>{{ outlet.notes }}</b> </li>
        <li class="li-left">{{ formatTime(outlet.date_of_occurrence) }} </li>
      </ul>
    </div>
  <!--/~span-->
</template>
<script>

import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'OutletDetailsByNameCard',
  props: {
    outlet: {
      type: Object,
      default: () => ({})
    }
  },
  created() {
    console.log("Created Outlet Details By Name: ", this.$store.dispatch("fetchOutletDetailsByName", this.$route.params.outlet_details_by_name))
    this.$store.dispatch("fetchOutletDetailsByName", this.$route.params.outlet_details_by_name);
  },
  computed: {
    //outlet_details_by_name() {
    //  console.log("Computed Outlet By Name: ", this.$store.state.outlet_details_by_name, this.$route.params.outlet_details_by_name)
    //  return this.$store.state.outlet_details_by_name, this.$route.params.outlet_details_by_name;
    //},
  },
  methods: {
    formatTime(value) {
      return DateFormatService.formatTimejs(value);
    },
  }
}
</script>
<style scoped>
</style>