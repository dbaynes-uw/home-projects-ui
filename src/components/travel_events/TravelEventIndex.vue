<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('title')">Title</th>
      <th id="background-blue" @click="sortList('description')">Description</th>
      <th id="background-blue" @click="sortList('start_date')">
        Start Date
      </th>
      <th id="background-blue" @click="sortList('end_date')">End Date</th>
      <th id="background-blue">Reference</th>
      <th id="background-blue">Notes</th>
      <th id="background-blue" style="text-align: right">Actions</th>
    </tr>
    <tr v-for="travel_event in travel_events"
              :key="travel_event.id"
              travel_event="travel_event"
              :id="eventPassed(travel_event)"
      >
      <td>{{ travel_event.title }}</td>
      <td>{{ travel_event.description }}</td>
      <td>{{ formatFullYearDate(travel_event.start_date) }}</td>
      <td>{{ formatFullYearDate(travel_event.end_date) }}</td>
      <td>
        <a :href="travel_event.transport_url" target="_blank">Review</a>
      </td>
      <td>{{ travel_event.notes }}</td>
      <td style="padding-left: 0">
        <!--span v-if="this.onlineStatus"-->
          <span class="fa-stack">
            <router-link
              :to="{ name: 'TravelEventEdit', params: { id: `${travel_event.id}` } }"
            >
              <i
                id="travel-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'TravelEventDetails', params: { id: `${travel_event.id}` } }"
              >
                <i class="fa fa-eye" id="action-eye-icon"></i>
              </router-link>
            </span>
            <span class="fa-table-stack" id="action-delete-icon">
              <i
                @click="deleteTravelEvent(travel_event)"
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
  name: "TravelEventIndex",
  props: ["travel_events"],
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
    eventPassed(e) {
      var dayjs = require('dayjs')
      let formatDateToday = dayjs(new Date()).format("YYYY-MM-DD");
      console.log("formatDateToday: ", formatDateToday)
      if (e.end_date < formatDateToday ){
        console.log("Event Passed: ", e.end_date)
        return 'event-passed'
      } else {
        console.log("Event Current: ", e.end_date)
        return 'event-current'
      }
    },
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
          this.travel_events &&
          this.travel_events.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.travel_events.forEach((travel_event) => {
            const searchHasTitle =
              travel_event.title &&
              travel_event.title
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasDescription =
              travel_event.description &&
              travel_event.description
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasTitle || searchHasDescription) {
              this.filteredResults.push(travel_event);
            }
          });
        }
      }
    },
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {
      this.sortedData = this.travel_events;
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
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDatejs(value);
    },
  },
};
</script>
<style scoped>
#event-passed {
  color: #706e6e;
  font-weight: bold;
}
#event-current {
  font-weight: bold;
}
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
</style>

