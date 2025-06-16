<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h3 id="h3-left">Total: {{ waterings.length }}</h3>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('name')">Name</th>
      <th id="background-blue" @click="sortList('name')">Target</th>
      <th id="background-blue" @click="sortList('start_time')">Start</th>
      <th id="background-blue" @click="sortList('end_time')">End</th>
      <th id="background-blue" @click="sortList('location')">Location</th>
      <th id="background-blue" @click="sortList('days')">Days</th>

      <th id="background-blue">Notes</th>
      <th class="th-center" id="background-blue">Actions</th>
    </tr>
    <tr v-for="watering in waterings" :key="watering.id" watering="watering">
      <td>{{ watering.name }}</td>
      <td>{{ watering.target }}</td>
      <td>{{ formatTime(watering.start_time) }}</td>
      <td>{{ formatTime(watering.end_time) }}</td>
      <td>{{ watering.location }}</td>
      <td>{{ watering.days }}</td>
      <td>{{ watering.notes }}</td>
      <td style="padding-left: 0">
        <!--span v-if="this.onlineStatus"-->
          <span class="fa-stack">
            <router-link
              :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }"
            >
              <i
                id="travel-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }"
              >
                <i class="fa fa-eye" id="action-eye-icon"></i>
              </router-link>
            </span>
            <span class="fa-table-stack" id="action-delete-icon">
              <i
                @click="deleteWatering(watering)"
                class="fas fa-trash-alt fa-stack-1x"
                id="travel-icon-delete"
              >
              </i>
            </span>
          </span>
      </td>
    </tr>
  </v-table>
  <br />
  <b>Online Status: {{ this.onlineStatus }}</b>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "WateringIndex",
  props: ["waterings"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      inputSearchText: "",
      onlineStatus: navigator.onLine,
    };
  },
  methods: {
    searchColumns() {
      this.filteredResults = [];
      this.columnDetails = null;
      if (
        this.inputSearchText == null ||
        (this.inputSearchText != null && this.inputSearchText.length === 0)
      ) {
        this.filteredResults = [];
        this.columnDetails = null;
      } else {
        if (
          this.waterings &&
          this.waterings.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.travels.forEach((watering) => {
            const searchHasWateringName =
              watering.name &&
              watering.name
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasNotes =
              watering.notes &&
              watering.notes
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasWateringName || searchHasNotes) {
              this.filteredResults.push(watering);
            }
          });
        }
      }
    },
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {
      this.sortedData = this.waterings;
      if (this.sortedbyASC) {
        this.sortedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.sortedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
    //async deleteTravel(travel) {
    //  const ok = await this.$refs.confirmDialogue.show({
    //    title: "Delete Travel from List",
    //    message:
    //      "Are you sure you want to delete " +
    //      travel.title +
    //      "? It cannot be undone.",
    //    okButton: "Delete",
    //  });
    //  // If you throw an error, the method will terminate here unless you surround it wil try/catch
    //  if (ok) {
    //    this.$store.dispatch("deleteTravel", travel);
    //    this.statusMessage =
    //      "Travel was Deleted for " +
    //      travel.title +
    //      "! Page will restore in 2 seconds";
    //    setTimeout(() => location.reload(), 2500);
    //  }
    //},
    formatTime(value) {
      return DateFormatService.formatTimejs(value);
    },
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDatejs(value);
    },
  },
};
</script>
<style scoped>
#action-eye-icon {
  top: 0.4rem;
  font-size: 18px;
}
#action-delete-icon {
  position: relative;
  top: 0.5rem;
  left: 2.3rem;
}
.fa-table-stack {
  position: relative;
  left: 2rem;
}
i {
  bottom: 0px;
  color: gray;
}
tr.is-complete {
  background: #35495e;
  color: #fff;
}
#status-message {
  text-align: center;
  color: navy;
}
</style>

