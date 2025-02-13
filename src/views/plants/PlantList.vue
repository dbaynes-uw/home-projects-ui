<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Garden Details</h2>
      <h2 id="status-message">
        <u>{{ this.statusMessage }}</u>
      </h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'PlantCreate' }">Add Plant</router-link>
        </button>
      </li>
      <span v-if="watering.id">
        <li class="left">
          <button id="button-as-link">
            <router-link  :to="{ name: 'WateringDetails' }">Watering Layout</router-link>
          </button>
        </li>
      </span>
      <li>
        <button id="button-as-link" @click="requestIndexDetail">
          <u>Detail Index View</u>
        </button>
      </li>
    </ul> 
    <br/>
  </v-card>
  <br/>
  <div style="width: 100%">
      <div class="auto-search-container">
        <v-text-field
          clearable
          clear-icon="mdi-close"
          @click:clear="showIndex"
          type="text"
          class="np-input-search"
          v-model="inputSearchText"
          placeholder="Search"
          autocomplete="off"
          v-on:keyup="searchColumns"
        />
      </div>
  </div>
  <div class="plant-list">
    <span v-if="filteredResults.length == 0">
      <span v-if="searchResults == false">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
      <span v-else>
        <span v-if="requestIndexDetailFlag == true">
          <h3 id="h3-left">Total: {{ plants.length }}</h3>
          <span class="h3-left-total-child">Double click Item Below to Edit</span>
          <div class="cards">
            <PlantCard
              v-for="plant in plants"
              :key="plant.id"
              :plant="plant"
              :origin="origin"
              class="card"
              @dblclick="onDoubleClick(plant)"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <PlantIndex :plants="plants" />
        </span>
      </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>Double click to Edit</span>
        <div class="cards">
          <PlantCard
            v-for="plant in filteredResults"
            :key="plant.id"
            :plant="plant"
            class="card"
            :origin="origin"
            @dblclick="onDoubleClick(plant)"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <PlantSearchResults :filteredResults="filteredResults" />
      </span>
    </span>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import PlantIndex from "@/components/gardens/GardenIndex.vue";
import PlantCard from "@/components/plants/PlantCard.vue";
import PlantSearchResults from "@/components/gardens/GardenSearchResults.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";

export default {
  name: "PlantList",
  props: ["filteredResults[]", "garden_id"],
  components: {
    PlantIndex,
    PlantCard,
    PlantSearchResults,
    ConfirmDialogue,
  },
  data() {
    return {
      requestIndexDetailFlag: true,
      searchResults: null,
      inputSearchText: "",
      filteredResults: [],
      columnDetails: null,
      sortedData: [],
      sortedbyASC: false,
      description: null,
      frequency: null,
      completed: 0,
      statusMessage: "",
      showGardenLayout: true,
    };
  },
  mounted() {
    this.sortedData = this.plants;
  },
  created() {
    this.$store.dispatch("fetchWatering", this.garden_id);
    this.$store.dispatch("fetchPlants", this.garden_id);
    console.log("PlantList Created - Garden: ", this.garden_id)

    this.sortedData = this.plants;
  },
  computed: {
    watering() {
      return this.$store.state.watering;
    },
    plants() {
      return this.$store.state.plants;
      //return [
      //  { id: 1,
      //    name: 'Avacodes',
      //    description: 'Desc 1',
      //    location: '1-A-1',
      //    water_outlet: 'East Back',
      //    date_planted: '2023-04-15',
      //    date_harvest: '2023-05-15',
      //    date_actual_harvest: '2023-07-01',
      //    link_to_label: 'https://bonnieplants.com/blogs/how-to-grow/growing-cabbage',
      //    special_instructions: 'Bed - Section - Row',
      //    notes: 'Bed-Section-Position - Bed: North to South: 1,2,3 | Section East to West: A,B,C; Rows North to South 1,2,3 ex: 1-A-1 = Bed 1, Section A, Row 1 / OR Bed 1 Row 1 = B1 R1, etc.'
      //  },
      //  { id: 2,
      //    name: 'Broccoli',
      //    description: 'Desc 2',
      //    location: '2-A-1',
      //    water_outlet: 'West Back',
      //    date_planted: '2023-04-15',
      //    date_harvest: '2023-05-15',
      //    date_actual_harvest: '2023-07-01',
      //    link_to_label: 'www.facebook.com',
      //    special_instructions: 'Special Instrs 2',
      //    notes: 'Bed-Section-Position - E/W Row ex: 2-A-1, 2-B-1, 2-C-1 N/S ex: 2-A-1, 2-A-2 ',
      //  },
      //  { id: 3,
      //    name: 'Carrots',
      //    description: 'Desc 3',
      //    location: '3-A-1',
      //    water_outlet: 'West Front (Hydrangeas)',
      //    date_planted: '2023-04-15',
      //    date_harvest: '2023-05-15',
      //    date_actual_harvest: '2023-07-01',
      //    link_to_label: 'www.facebook.com',
      //    special_instructions: 'Special Instrs 3',
      //    notes: 'Bed-Section-Position - E/W Row ex: 3-A-1, 3-B-1, 3-C-1 N/S ex: 3-A-1, 3-A-2 ',
      //  },
      //]
    },
    origin() {
      return "PlantList"
    }
  },
  methods: {
    requestIndexDetail() {
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    onDoubleClick(plant) {
      console.log("plant Edit ")
      this.$router.push({ name: 'GardenEdit', params: { id: `${plant.id}` } });
    },
    showIndex() {
      this.filteredResults = [];
    },
    searchColumns() {
      this.searchResults = true;
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
            const searchHasPlantName =
              plant.plant_name &&
              plant.plant_name
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchNotes =
              plant.notes &&
              plant.notes
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasPlantName || searchNotes) {
              this.filteredResults.push(plant);
            }
            if (this.filteredResults.length > 0) {
              this.searchResults = true;
            } else {
              this.searchResults = false;
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
    //isOffline() {
    //  this.isOnline = false;
    //},
    //isOnline() {
    //  this.isOnline = true;
    //},
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDatejs(value);
    },
  },
};
</script>
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
th:hover {
  cursor: pointer;
  background: rgb(229, 255, 211);
}
tr:nth-child(even) {
  background-color: #f3f3f3;
}
tr:nth-child(odd) {
  background-color: #41b88352;
  border: none !important;
}
</style>
