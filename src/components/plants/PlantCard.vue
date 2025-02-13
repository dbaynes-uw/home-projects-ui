<template>
  <div id="required-to-prevent-vue-warning">
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
    <div class="card">
      <br/>
      <h4 id="p-custom-link">
        <router-link
          :to="{ name: 'PlantEdit', params: { id: `${plant.id}` } }"
        >
          {{ plant.plant_name }}
        </router-link>
      </h4>
      <br/>
      <ul>
        <li class="li-left"><b>Biological Name: {{ plant.biological_name }}</b></li>
        <li class="li-left">Date Planted: {{ formatYearDate(plant.date_planted) }}</li>
        <li class="li-left">Location: <b>{{plant.yard_location }}</b></li>
        <!--li class="li-left"><a :href="plant.online_link" target="_blank">Water Line</a></!--li-->
        <li class="li-left" @click="showOutlet(plant, outlet)"><b><u>Water Outlet: {{ showOutletName()}}</u></b></li>    
        <li class="li-left" @click="showWatering()"><b><u>Water Line: {{ showWateringName() }} </u></b></li>    
        <span v-if="plant.date_harvest">
          <li class="li-left">Date Harvest: {{ formatYearDate(plant.date_harvest) }}</li>
        </span>
        <span v-if="plant.actual_harvest">
          <li class="li-left">Actual Harvest: {{ formatYearDate(plant.date_actual_harvest) }}</li>
        </span>
        <li class="li-left"><a :href="plant.online_link" target="_blank">Link to Review</a></li>
        <span v-if="plant.notes">
          <li class="li-left">Notes: <b>{{ plant.notes }}</b> </li>
        </span>
      </ul>
      <br/>
      <table>
        <thead>
        <tr>
          <td id="icon-block">
            <router-link
              :to="{ name: 'PlantEdit', params: { id: `${plant.id}` } }"
            >
            <i
              id="card-medium-block-icon-edit"
              class="fa-solid fa-pen-to-square fa-stack-1x"
            >
            </i>
          </router-link>
          </td>
          <td id="icon-block">
            <router-link :to="{ name: 'PlantDetails', params: { id: `${plant.id}` } }">
              <i
                id="card-medium-block-icon-eye"
                class="fa fa-eye"
              >
              </i>
            </router-link>
          </td>
          <td id="icon-block">
            <span class="fa-table-stack">
              <i
                @click="deletePlant(plant)"
                class="fas fa-trash-alt fa-stack-1x"
                id="card-medium-block-icon-delete"
              >
              </i>
            </span>
          </td>
        </tr>
        </thead>
      </table>
    </div>
  </div>
</template>
<script>
let time = null; 
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'PlantCard',
  props: {
    //garden: {
    //  type: Object,
    //  default: () => ({})
    //},
    plant: {
      type: Object,
      default: () => ({})
    },
    //outlet: {
    //  type: Object,
    //  default: () => ({})
    //},
    //origin: {
    //  type: String,
    //  default: '',
    //},
    //watering: {
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
  data() {
    return {
      //outlet: null,
    }
  },
  created() {
    this.$store.dispatch("fetchWaterings")
  },
  computed: {
    outlet() {
      return this.$store.state.outlet;
    },
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
  setup() {},
  methods: {
    async deletePlant(plant) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Plant from List",
        message:
          "Are you sure you want to delete " +
          plant.plant_name +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deletePlant", plant);
        this.statusMessage =
          "Plant was Successfully Deleted for " +
          plant.plant_name +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "GardenDetails", params: { id: plant.garden.id } });
      }
    },
    showOutlet(plant,outlet) {
      clearTimeout(time);
      console.log("Outlet ID: ", outlet.id)
      console.log("Plant Outlet ID: ", this.plant.outlet_id)
      this.$router.push({ name: 'OutletDetails', params: { id: `${this.plant.outlet_id}` } });
    },
    showWatering(watering, outlet) {
      console.log("ShowWatering: ", watering)
      console.log("Outlet Watering ID: ", outlet.watering_id)
      clearTimeout(time);
      this.$router.push({ name: 'WateringDetails', params: { id: `${outlet.watering_id}` } });
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
    showOutletName(){
      var outletName = ""
      for (let i=0; i < this.outletsHash.outletsHash.length; i++) {
        if (this.plant.outlet_id == this.outletsHash.outletsHash[i].id) {
          outletName = this.outletsHash.outletsHash[i].outlet_name
          i = 99
        }
      }
      return outletName
    },
    showWateringName(){
      //console.log("ShowWateringName - waterings: ", this.waterings)
      var wateringName = ""
      for (let i=0; i < this.waterings.length; i++) {

        if (this.plant.garden_id == this.waterings[i].garden_id) {
          wateringName = this.waterings[i].watering_name
          i = 99
        }
      }
      return wateringName
    },
  }
}
</script>

<style scoped>
</style>
