<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h3 id="h3-left">SR Total: {{ filteredResults.length }}</h3>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('date_of_occurrence')">Date of Occcurrence</th>
      <th id="background-blue" @click="sortList('duration')">Duration</th>
      <th id="background-blue">Days since Last </th>
      <th id="background-blue">Hours since Last </th>
      <th id="background-blue">Minutes since Last </th>
      <th id="background-blue">Circumstances </th>
      <th class="th-center" id="background-blue">Actions</th>
    </tr>
    <tr v-for="(result, resultIndex) in filteredResults" :key="resultIndex">
      <td>{{ formatStandardDateTime(result.date_of_occurrence) }} </td>
      <td>{{ result.duration }}</td>
      <td>{{ result.interval_days }} days</td>
      <td>{{ result.interval_hours }} hours</td>
      <td>{{ result.interval_minutes }} minutes</td>
      <td>{{ result.circumstances }} </td>
      <td class="td-center" >
        <span v-if="this.onlineStatus">
          <span class="fa-stack">
            <router-link
              :to="{ name: 'MedEdit', params: { id: `${result.id}` } }"
            >
              <i
                id="medium-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'MedDetails', params: { id: `${result.id}` } }"
              >
                <i id="medlist-icon-eye" class="fa fa-eye"></i>
              </router-link>
            </span>
            <span class="fa-table-stack">
              <i
                @click="deleteMed(result)"
                class="fas fa-trash-alt fa-stack-1x"
                id="medlist-icon-delete"
              >
              </i>
            </span>
          </span>
        </span>
        <span v-else>
          <router-link
            :to="{ name: 'MedDetails', params: { id: `${result.id}` } }"
          >
            View |
          </router-link>
          <router-link
            :to="{ name: 'MedEdit', params: { id: `${result.id}` } }"
          >
            Edit |
          </router-link>
          <span class="ok-btn" @click="deleteMed(result)"><u>Delete</u></span>
        </span>
      </td>
    </tr>
  </v-table>
  <br />
  <!--b>Online Status: {{ this.onlineStatus }}</b!-->
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "MedSearchResults",
  props: ["filteredResults"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      med: {
        date_of_occurrence: "",
        duration: "",
        circumstances: "",
      },
      inputSearchText: "",
      onlineStatus: navigator.onLine,
    };
  },
  methods: {
    searchColumns() {
      this.filteredmeds = [];
      this.columnDetails = null;
      if (
        this.inputSearchText == null ||
        (this.inputSearchText != null && this.inputSearchText.length === 0)
      ) {
        this.filteredmeds = [];
        this.columnDetails = null;
      } else {
        if (
          this.meds &&
          this.meds.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.meds.forEach((med) => {
            const searchHasDateOfOccurrence =
              med.date_of_occurrence &&
              med.date_of_occurrence
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasDuration =
              med.duration &&
              med.duration
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasDateOfOccurrence || searchHasDuration) {
              this.filteredmeds.push(med);
            }
          });
        }
      }
    },
    showCharacterDetails(med) {
      this.characterDetails = med;
    },
    sortList(sortBy) {
      this.sortedData = this.meds;
      if (this.sortedbyASC) {
        this.sortedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.sortedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
    async deleteMed(med) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Med from List",
        message:
          "Are you sure you want to delete " +
          med.date_of_occurrence +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteMed", med);
        this.statusMessage =
          "Med was Deleted for " +
          med.title +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
      }
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
  },
};
</script>
