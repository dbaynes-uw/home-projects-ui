<template>
   <div class="card">
    <p id="p-custom-u">
      <router-link
        :to="{ name: 'WateringEdit', params: { id: `${waterings.id}` } }"
      >
        {{ waterings.name }}
      </router-link>
    </p>
    <p id="p-custom-link">
      <router-link
        :to="{ name: 'OutletCreate' }"
      >
        Add Outlet
      </router-link>
    </p>
  </div>
</template>

<script>
//import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'WateringCard',
  props: {
    waterings: {
      type: Object,
      default: () => ({})
    },
    origin: {
      type: String,
      default: '',
    }
  },
  components: {
    //ConfirmDialogue,
  },
  setup() {
    //const vm = this.app.getCurrentInstance()
    //console.log("VM: ", vm)
  },
  methods: {
    async deleteWatering(watering) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Watering from List",
        message:
          "Are you sure you want to delete " +
          watering.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteWatering", watering);
        this.statusMessage =
          "Watering was Deleted for " +
          watering.title +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "WateringDisplay" });
      }
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  }
}
</script>

<style scoped>
</style>
