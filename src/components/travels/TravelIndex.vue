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
    <tr v-for="travel in travels" :key="travel.id" travel="travel">
      <td>{{ travel.title }}</td>
      <td>{{ travel.description }}</td>
      <td>{{ formatFullYearDate(travel.start_date) }}</td>
      <td>{{ formatFullYearDate(travel.end_date) }}</td>
      <td>
        <a :href="travel.url_reference" target="_blank">Review</a>
      </td>
      <td>{{ travel.notes }}</td>
      <td style="padding-left: 0">
        <!--span v-if="this.onlineStatus"-->
          <span class="fa-stack">
            <router-link
              :to="{ name: 'TravelEdit', params: { id: `${travel.id}` } }"
            >
              <i
                id="travel-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'TravelDetails', params: { id: `${travel.id}` } }"
              >
                <i class="fa fa-eye" id="action-eye-icon"></i>
              </router-link>
            </span>
            <span class="fa-table-stack" id="action-delete-icon">
              <i
                @click="deleteTravel(travel)"
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
  name: "TravelIndex",
  props: ["travels"],
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
          this.travels &&
          this.travels.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.travels.forEach((travel) => {
            const searchHasTitle =
              travel.title &&
              travel.title
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasDescription =
              travel.description &&
              travel.description
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasTitle || searchHasDescription) {
              this.filteredResults.push(travel);
            }
          });
        }
      }
    },
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {
      this.sortedData = this.travels;
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

