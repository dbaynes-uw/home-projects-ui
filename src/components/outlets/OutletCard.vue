<template>
  <!--Garden: {{ garden }}
  Outlet: {{ outlet }}
  -->
  <span v-if="outlet.active == 1">
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
    <div class="card">
      <ul>
        <li class="li-left"><b>{{ outlet.outlet_name }}</b></li>
        <span v-if="outlet.yard_location">
          <li class="li-left">Location: <b>{{  outlet.yard_location }}</b></li>
          <li class="li-left">Faucet: <b>{{  outlet.faucet_location }}</b></li>
          <li class="li-left">Line: <b>{{ outlet.line_number }}</b></li>
          <li class="li-left">Target: <b><u>{{ outlet.target }}</u></b></li>
          <li class="li-left">Frequency: <b><u>{{ outlet.target }}</u></b></li>
          <li class="li-left">Start: {{ formatTime(outlet.start_time)}}</li>
          <li class="li-left">Duration: {{ outlet.duration }}</li>
        </span>
        <li class="li-left">Status: <b>{{ outlet.active == 1 ? 'Active' : 'Inactive' }}</b></li>
        <li class="li-left">Notes:
          <span v-html="outlet.notes"></span>
        </li>
      </ul>
      <br/>
      <div class="icon-stack">
        <span class="fa-stack">
          <router-link
            :to="{ name: 'OutletEdit', params: { id: `${outlet.id}` } }"
          >
            <i
              id="card-medium-icon-edit"
              class="fa-solid fa-pen-to-square fa-stack-1x"
            >
            </i>
          </router-link>
          <span class="fa-table-stack">
            <i
              @click="deleteOutlet(outlet)"
              class="fas fa-trash-alt fa-stack-1x"
              id="card-outlet-icon-delete"
            >
            </i>
          </span>
        </span>
      </div>
    </div>
  </span>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'OutletCard',
  props: {
    outlet: {
      type: Object,
      default: () => ({})
    },
    //garden: {
    //  type: Object,
    //  default: () => ({})
    //}
  },
  components: {
    ConfirmDialogue,
  },
  mounted() {
    //console.log("Mounted this.outlet: ", this.$store.dispatch("fetchOutlet", this.plant.outlet_id ))
  },
  created() {
    //this.$store.dispatch("fetchWaterings")
  },
  computed: {
    //outlet() {
    //  return this.$store.state.outlet;
    //},
    outletsDisplayGroup() {
      return this.$store.state.outlets_group;
    },
    outletsHash() {
      return this.$store.state.outlets_hash;
    },
    //plant() {
    //  return this.$store.state.plant;
    //},
    waterings() {
      return this.$store.state.waterings;
    },
  },

  methods: {
    async deleteOutlet(outlet) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Outlet from List",
        message:
          "Are you sure you want to delete " +
          outlet.outlet_name +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteOutlet", outlet);
        this.statusMessage =
          "Outlet was Deleted for " +
          outlet.outlet_name +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "WateringDetails" });
      }
    },

    formatTime(value) {
      return DateFormatService.formatTimejs(value);
    },
  }
}
</script>
<style scoped>
</style>
