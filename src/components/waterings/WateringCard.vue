<template>
   <div class="card">
    <p id="p-custom-u">
      <router-link
        :to="{ name: 'PlantList' }"
      >
        {{ watering.location }} - {{ watering.faucet_location }} - {{ watering.line_number }}
      </router-link>
    </p>
    <ul>
      <li class="li-left">Description: <b>{{watering.description }}</b></li>
      <li class="li-left">Frequency: <b>{{watering.frequency }}</b></li>  
      <li class="li-left">Start: <b>{{ formatTime(watering.start_time) }}</b></li>
      <li class="li-left">duration: <b>{{ watering.duration }}</b></li>
      <li class="li-left">Notes: <b>{{ watering.notes }}</b> </li>
    </ul>
    <br/>
    <div class="icon-stack">
      <span v-if="origin == 'WateringDetails'">
        <span class="fa-stack">
          <router-link
            :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }"
          >
            <i
              id="card-medium-icon-edit"
              class="fa-solid fa-pen-to-square fa-stack-1x"
            >
            </i>
          </router-link>
          <router-link :to="{ name: 'WateringList'}">
            <i
              id="card-medium-icon-eye"
              class="fa-solid fa-backward fa-stack-1x"
            >
            </i>
          </router-link>
          <span class="fa-table-stack">
            <i
              @click="deleteWatering(watering)"
              class="fas fa-trash-alt fa-stack-1x"
              id="card-medium-icon-delete"
            >
            </i>
          </span>
        </span>
      </span>
      <span v-if="origin == 'WateringList'">
        <table>
          <tr>
            <td id="icon-block">
                <router-link
                  :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }"
                >
                <i
                  id="card-medium-block-icon-edit"
                  class="fa-solid fa-pen-to-square fa-stack-1x"
                >
                </i>
              </router-link>
            </td>
            <!--span v-if="watering.id > 0"-->
            <td id="icon-block">
              <router-link :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }">
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
                  @click="deleteWatering(watering)"
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
</template>

<script>
//import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'WateringCard',
  props: {
    watering: {
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
        this.$router.push({ name: "WateringList" });
      }
    },

    formatTime(time) {
      var today = new Date()
      var today_date = (today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate());
      return DateFormatService.formatTimejs(today_date + ' ' + time);
    },
  }
}
</script>

<style scoped>
</style>
