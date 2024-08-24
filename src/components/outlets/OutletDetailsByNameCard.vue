<template>
  OBN CARD - outlet_details_by_name? {{ outlet_details_by_name }}
  <!--span v-if="outlet_by_name.active == 1"-->
    <div class="card">
      <p id="p-custom-left-u">{{ outlet_details_by_name.yard_location }} </p> 
      <ul>
        <li class="li-left">Status: <b>{{ outlet_details_by_name.active == 1 ? 'Active' : 'Inactive' }}</b></li>
        <li class="li-left">Line: <b>{{ outlet_details_by_name.line_number }}</b></li>
        <li class="li-left">Target: <b><u>{{ outlet_details_by_name.target }}</u></b></li>
        <li class="li-left">Frequency: {{ outlet_details_by_name.frequency }}</li>
        <li class="li-left">Start: {{ formatTime(outlet_details_by_name.start_time)}}</li>
        <li class="li-left">Duration: {{ outlet_details_by_name.duration }}</li>
        <li class="li-left">Notes: <b>{{ outlet_details_by_name.notes }}</b> </li>
        <!--{{ formatYearDate(outlet.date_of_occurrence) }}-->
      </ul>
    </div>
  <!--/span-->
</template>
<script>

import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'OutletDetailsByNameCard',
  props: {
   // outlet_details_by_name: {
   //   type: Object,
   //   default: () => ({})
   // }
  },
  created() {
    console.log("Created Outlet Details By Name: ", this.$store.dispatch("fetchOutletDetailsByName", this.$route.params.outlet_details_by_name))
    this.$store.dispatch("fetchOutletDetailsByName", this.$route.params.outlet_details_by_name);
  },
  computed: {
    outlet_details_by_name() {
      console.log("Computed Outlet By Name: ", this.$store.state.outlet_details_by_name, this.$route.params.outlet_details_by_name)
      return this.$store.state.outlet_details_by_name, this.$route.params.outlet_details_by_name;
    },
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
