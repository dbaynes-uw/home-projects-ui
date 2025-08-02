<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Garden Waterings for {{ garden.name }}</h2>
      <h2 id="status-message">
        <u>{{ this.statusMessage }}</u>
      </h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'Gardens' }">Gardens</router-link>
        </button>
      </li>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'WateringList' }">Waterings</router-link>
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
  <div class="watering-list">
    <span v-if="filteredResults.length == 0">
      <span v-if="searchResults == false">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
      <span v-else>
        <span v-if="requestIndexDetailFlag == false">
          <h3 id="h3-left">Total: {{ garden_waterings.length }}</h3>
          <div class="cards">
            <WateringCard
              v-for="watering in garden_waterings"
              :key="watering.id"
              :watering="watering"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <WateringIndex :waterings="garden.waterings" />
        </span>
      </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <div class="cards">
          <WateringCard
            v-for="watering in filteredResults"
            :key="watering.id"
            :watering="watering"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <WateringIndex :waterings="filteredResults" />
      </span>
    </span>
    <br/>
    <!--
    <h3>Need Specific Watering Details Here instead of Generic</h3>
    <v-img
      :src="require('../../assets/WateringSystemLayoutSummer2025.png')"
      class="my-3"
      height="500"
      contain
    />   
    -->
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import WateringIndex from "@/components/waterings/WateringIndex.vue";
import WateringCard from "@/components/waterings/WateringCard.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
export default {
  name: "GardenWaterings",
  props: ["id"],
  components: {
    WateringCard,
    WateringIndex,
    ConfirmDialogue
  },
  mounted() {
    //?this.sortedData = this.waterings;
  },
  created() {
    this.$store.dispatch("fetchGardenWaterings", this.$route.params.id);
    //?this.$store.dispatch("fetchWaterings");
    this.sortedData = this.$store.dispatch("fetchGardenWaterings", this.$route.params.id);
  },
  computed: {
    garden_waterings() {
      return this.$store.state.garden_waterings;
    },
    garden() {
      return this.$store.state.garden;
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
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    editWatering(watering) {
      this.$router.push({ name: 'WateringEdit', params: { id: `${watering.id}` } });
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
          this.waterings &&
          this.waterings.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.waterings.forEach((watering) => {
            watering.plants.forEach((plant) => {
              const searchHasPlantName =
                plant.plant_name &&
                plant.plant_name
                  .toLowerCase()
                  .includes(this.inputSearchText.toLowerCase());
              if (searchHasPlantName) {
                this.filteredResults.push(watering);
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
      this.sortedData = this.waterings;
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