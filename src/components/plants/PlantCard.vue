<template>
  <div id="required-to-prevent-vue-warning">
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
    <div class="card">
      <br/>
      <h2><u>{{ plant.plant_name}}</u></h2>
      <br/>
      <ul>
        <li class="li-left"><b>{{ plant.description }}</b></li>
        <li class="li-left">Date Planted: {{ formatYearDate(plant.date_planted) }}</li>
        <li class="li-left">Location: <b>{{plant.yard_location }}</b></li>
        <!--li class="li-left"><a :href="plant.online_link" target="_blank">Water Line</a></!--li-->
        <li class="li-left" @click="showOutlet(plant)"><b><u>Water Line: {{ plant.outlet_name }}</u></b></li>    
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
    </div>
    <div class="icon-stack">
      <span class="fa-stack">
        <router-link
          :to="{ name: 'PlantEdit', params: { id: `${plant.id}` } }"
        >
          <i
            id="card-medium-icon-edit"
            class="fa-solid fa-pen-to-square fa-stack-1x"
          >
          </i>
        </router-link>
        <router-link :to="{ name: 'GardenDetails', params: { id: this.garden.id } }">
          <i
            id="card-medium-icon-eye"
            class="fa-solid fa-backward fa-stack-1x"
          >
          </i>
        </router-link>
        <span class="fa-table-stack">
          <i
            @click="deletePlant(plant)"
            class="fas fa-trash-alt fa-stack-1x"
            id="card-medium-icon-delete"
          >
          </i>
        </span>
      </span>
    </div>
    <div> <!--span v-if="origin == 'PlantList'"-->
      <table>
        <thead>
        <tr>
          <td id="icon-block">
            <router-link
              :to="{ name: 'GardenEdit', params: { id: `${plant.id}` } }"
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
    <!--span-->
  </div>
</template>
<script>
let time = null; 
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'PlantCard',
  props: {
    garden: {
      type: Object,
      default: () => ({})
    },
    plant: {
      type: Object,
      default: () => ({})
    },
    origin: {
      type: String,
      default: '',
    },
  },
  components: {
    ConfirmDialogue,
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
    showOutlet(plant) {
      clearTimeout(time);
      this.$router.push({ name: 'OutletDetails', params: { id: `${plant.outlet_id}` } });
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
    getGardenName(garden_id) {
      console.log("Get Garden Name: ", garden_id)
    }
  }
}
</script>

<style scoped>
</style>
