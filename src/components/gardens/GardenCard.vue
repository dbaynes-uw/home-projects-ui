<template>
  <span v-if="garden.active == true">
    <div class="card">
      <p id="p-custom-u">
        <router-link
          :to="{ name: 'GardenDetails', params: { id: this.garden.id} }"
        >
         {{ garden.garden_name }}
        </router-link>
      </p>
      <span v-if="garden.plants.length > 0">
        <p id="p-custom-left">Plants:</p>
        <span v-for="(plant, plantIndex) in garden.plants" :key="plantIndex">
          <ul class="ul-left">
            <li>
              <router-link
                :to="{ name: 'PlantDetails', params: { id: `${plant.id}` } }"
              >
              <b>{{plant.plant_name}}</b>
              </router-link>
            </li>
          </ul>          
        </span>
      </span>
      <br/>
      <p id="p-custom-link">
        <router-link
          :to="{ name: 'PlantCreate' }"
        >
          Add Plant
        </router-link>
      </p>
    </div>
  </span>
</template>

<script>
//import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'GardenCard',
  props: {
    garden: {
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
  computed: {
    watering() {
    return this.$store.state.watering;
    },
  },
  setup() {
    //const vm = this.app.getCurrentInstance()
    //console.log("VM: ", vm)
  },
  methods: {
    async deleteWatering(garden) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Garden from List",
        message:
          "Are you sure you want to delete " +
          garden.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteWatering", garden);
        this.statusMessage =
          "Garden was Deleted for " +
          garden.title +
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
