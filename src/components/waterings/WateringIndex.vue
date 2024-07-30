<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('plant_name')">Plant</th>
      <th id="background-blue" @click="sortList('description')">Description</th>
      <th id="background-blue" @click="sortList('location')">Location</th>
      <th id="background-blue" @click="sortList('water_line')">Water Line</th>
      <th id="background-blue" @click="sortList('date_planted')">
        Date Planted
      </th>
      <th id="background-blue" @click="sortList('date_harvest')">Harvest Date</th>
      <th id="background-blue">Link to Info</th>
      <th class="th-center" id="background-blue">Actions</th>
    </tr>
    <tr v-for="(result, resultIndex) in plants" :key="resultIndex">
      <td>{{ result.plant_name }}</td>
      <td>{{ result.description }}</td>
      <td>{{ result.location }}</td>
      <td>{{ result.water_line }}</td>
      <td class="td-center">{{ formatYearDate(result.date_planted) }}</td>
      <td class="td-center">{{ formatYearDate(result.date_harvest) }}</td>
      <td class="td-center">
        <a :href="result.link_to_label" target="_blank">Review</a>
      </td>
       <td class="td-center" >
        <span v-if="this.onlineStatus">
          <span class="fa-stack" style="text-align: center">
            <router-link
              :to="{ name: 'PlantEdit', params: { id: `${result.id}` } }"
            >
              <i
                id="medium-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'PlantDetails', params: { id: `${result.id}` } }"
              >
                <i id="medium-icon-eye" class="fa fa-eye"></i>
              </router-link>
            </span>
            <span class="fa-table-stack">
              <i
                @click="deletePlant(result)"
                class="fas fa-trash-alt fa-stack-1x"
                id="medium-icon-delete"
              >
              </i>
            </span>
          </span>
        </span>
        <span v-else>
          <router-link
            :to="{ name: 'PlantDetails', params: { id: `${result.id}` } }"
          >
            View |
          </router-link>
          <router-link
            :to="{ name: 'PlantEdit', params: { id: `${result.id}` } }"
          >
            Edit |
          </router-link>
          <span class="ok-btn" @click="deletePlant(result)"><u>Delete</u></span>
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
  name: "PlantIndex",
  props: ["plants"],
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
          this.plants &&
          this.plants.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.plants.forEach((plant) => {
            const searchHasTitle =
              plant.plant_name &&
              plant.plant_name
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasAuthor =
              plant.description &&
              plant.description
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasTitle || searchHasAuthor) {
              this.filteredResults.push(plant);
            }
          });
        }
      }
    },
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {
      this.sortedData = this.plants;
      if (this.sortedbyASC) {
        this.sortedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.sortedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
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
          "Plant was Deleted for " +
          plant.plant_name +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
      }
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
  },
};
</script>
