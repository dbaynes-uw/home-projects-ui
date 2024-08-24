<template>
  <div id="required-to-prevent-vue-warning">
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
    <div class="card">
      <p id="p-custom-left-u">{{ plant.plant_name}}</p>
      <ul>
        <li class="li-left">Description: <b>{{ plant.description }}</b></li>
        <li class="li-left">Date Planted: {{ formatYearDate(plant.date_planted) }}</li>
        <li class="li-left">Location: <b>{{plant.yard_location }}</b></li>
        <!--li class="li-left"><a :href="plant.online_link" target="_blank">Water Line</a></!--li-->
        <li class="li-left" @click="onClickOutlet(plant)">{{ plant.water_line }}</li>    
        <li class="li-left">Date Harvest: {{ formatYearDate(plant.date_harvest) }}</li>
        <li class="li-left">Actual Harvest: {{ formatYearDate(plant.date_actual_harvest) }}</li>
        <li class="li-left"><a :href="plant.online_link" target="_blank">Link to Review</a></li>
        <li class="li-left">Notes: <b>{{ plant.notes }}</b> </li>
      </ul>
      <br/>
      <div class="icon-stack">
        <span v-if="origin == 'PlantDetails'">
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
          <router-link :to="{ name: 'PlantList'}">
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
        </span>
        <span v-if="origin == 'PlantList'">
          <table>
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
              <!--span v-if="plant.id > 0"-->
                <td id="icon-block">
                  <router-link :to="{ name: 'PlantDetails', params: { id: `${plant.id}` } }">
                    <i
                      id="card-medium-block-icon-eye"
                      class="fa fa-eye"
                    >
                    </i>
                  </router-link>
                </td>
              <!--span-->
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
          </table>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'PlantCard',
  props: {
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
          plant.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deletePlant", plant);
        this.statusMessage =
          "Plant was Deleted for " +
          plant.title +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "PlantList" });
      }
    },
    onClickOutlet(plant) {
      console.log("onClickOutlet - Plant: ", `${plant}`)
      clearTimeout(time);
      this.$router.push({ name: 'OutletDetailsByName', params: { outlet_details_by_name: `${plant.water_line}` } });
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
  }
}
</script>

<style scoped>
</style>
