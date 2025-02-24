<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Garden List</h2>
      <h2 id="status-message">
        <u>{{ this.statusMessage }}</u>
      </h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'WateringList' }">Waterings</router-link>
        </button>
      </li>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'GardenCreate' }">Add Garden</router-link>
        </button>
      </li>
      <li>
        <button id="button-as-link" @click="requestIndexDetail">
          <u>Card or Index View</u>
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
          v-on:keyup="searchCards"
        />
      </div>
  </div>
  <div class="garden-list">
    <span v-if="filteredResults.length == 0">
      <span v-if="searchResults == false">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
      <span v-else>
        <span v-if="requestIndexDetailFlag == false">
          <h3 id="h3-left">Total: {{ gardens.length }}</h3>
          <span class="h3-left-total-child">*Click Icons Below to Edit, Details or Delete</span>
          <div class="cards">
            <GardenCard
              v-for="garden in gardens"
              :key="garden.id"
              :garden="garden"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <GardenIndex :gardens="gardens" />
        </span>
      </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>*Click Icons Below to Edit, Details or Delete</span>
        <div class="cards">
          <GardenCard
            v-for="garden in filteredResults"
            :key="garden.id"
            :garden="garden"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <GardenIndex :gardens="filteredResults" />
      </span>
    </span>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import GardenIndex from "@/components/gardens/GardenIndex.vue";
import GardenCard from "@/components/gardens/GardenCard.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";

export default {
  name: "GardenList",
  components: {
    GardenIndex,
    GardenCard,
    ConfirmDialogue
  },
  mounted() {
    this.sortedData = this.gardens;
  },
  created() {
    this.$store.dispatch("fetchGardens");
    this.sortedData = this.$store.dispatch("fetchGardens");
  },
  computed: {
    gardens() {
      return this.$store.state.gardens;
    },
  },
  data() {
    return {
      requestIndexDetailFlag: false,
      searchResults: null,
      inputSearchText: "",
      filteredResults: [],
      cardDetails: null,
      sortedData: [],
      sortedbyASC: false,
      description: null,
      frequency: null,
      completed: 0,
      statusMessage: "",
    };
  },
  methods: {
    requestIndexDetail() {
      console.log("RequestIndexDetail: ",this.requestIndexDetailFlag)
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    editGarden(garden) {
      console.log("Edit Garden: ", garden)
      this.$router.push({ name: 'GardenEdit', params: { id: `${garden.id}` } });
    },
    showIndex() {
      this.filteredResults = [];
    },
    searchCards() {
      this.searchResults = true;
      this.filteredResults = [];
      this.cardDetails = null;
      if (
        this.inputSearchText == null ||
        (this.inputSearchText != null && this.inputSearchText.length === 0)
      ) {
        this.filteredResults = [];
        this.cardDetails = null;
      } else {
        if (
          this.gardens &&
          this.gardens.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.gardens.forEach((garden) => {
            garden.plants.forEach((plant) => {
              const searchHasPlantName =
                plant.plant_name &&
                plant.plant_name
                  .toLowerCase()
                  .includes(this.inputSearchText.toLowerCase());
              if (searchHasPlantName) {
                this.filteredResults.push(garden);
              }
              if (this.filteredResults.length > 0) {
                this.searchResults = true;
              } else {
                this.searchResults = false;
              }
            })
          });
        }
      }
    },
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {
      this.sortedData = this.gardens;
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
<style></style>
