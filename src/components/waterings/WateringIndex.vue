<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('plant_name')">Plant</th>
      <th id="background-blue" @click="sortList('description')">Description</th>
      <th id="background-blue" @click="sortList('location')">Location</th>
      <th id="background-blue" @click="sortList('date_planted')">
        Date Planted
      </th>
      <th id="background-blue" @click="sortList('date_harvest')">Harvest Date</th>
      <th id="background-blue">Link to Info</th>
      <th class="th-center" id="background-blue">Actions</th>
    </tr>
    <tr v-for="(result, resultIndex) in waterings" :key="resultIndex">
      <td>{{ result.plant_name }}</td>
      <td>{{ result.description }}</td>
      <td>{{ result.location }}</td>
      <td class="td-center">{{ formatFullYearDate(result.date_planted) }}</td>
      <td class="td-center">{{ formatFullYearDate(result.date_harvest) }}</td>
      <td class="td-center">
        <a :href="result.link_to_label" target="_blank">Review</a>
      </td>
       <td class="td-center" >
        <span v-if="this.onlineStatus">
          <span class="fa-stack" style="text-align: center">
            <router-link
              :to="{ name: 'WateringEdit', params: { id: `${result.id}` } }"
            >
              <i
                id="medium-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'WateringDetails', params: { id: `${result.id}` } }"
              >
                <i id="medium-icon-eye" class="fa fa-eye"></i>
              </router-link>
            </span>
            <span class="fa-table-stack">
              <i
                @click="deleteWatering(result)"
                class="fas fa-trash-alt fa-stack-1x"
                id="medium-icon-delete"
              >
              </i>
            </span>
          </span>
        </span>
        <span v-else>
          <router-link
            :to="{ name: 'WateringDetails', params: { id: `${result.id}` } }"
          >
            View |
          </router-link>
          <router-link
            :to="{ name: 'WateringEdit', params: { id: `${result.id}` } }"
          >
            Edit |
          </router-link>
          <span class="ok-btn" @click="deleteWatering(result)"><u>Delete</u></span>
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
          this.waterings.forEach((watering) => {
            const searchHasTitle =
              watering.plant_name &&
              watering.plant_name
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasAuthor =
              watering.description &&
              watering.description
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasTitle || searchHasAuthor) {
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
    async deleteWatering(watering) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Watering from List",
        message:
          "Are you sure you want to delete " +
          watering.plant_name +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteWatering", watering);
        this.statusMessage =
          "Watering was Deleted for " +
          watering.plant_name +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
      }
    },
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDatejs(value);
    },
  },
};
</script>
