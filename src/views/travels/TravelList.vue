<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Travels</h2>
      <h2 id="status-message">
        <u>{{ this.statusMessage }}</u>
      </h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'TravelCreate'}">Add Trip</router-link>
        </button>
      </li>
      <li>
        <button id="button-as-link" @click="requestIndexDetail">
          <u>Index/Card View</u>
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
  <div class="travel-list">
    <span v-if="filteredResults.length == 0">
      <span v-if="searchResults == false">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
      <span v-else>
        <span v-if="requestIndexDetailFlag == false">
          <h3 id="h3-left">Total: {{ travels.length }}</h3>
            <!--span class="h3-left-total-child">Double click Item Below to Edit</!--span-->
          <div class="cards">
            <TravelCard
              v-for="travel in travels"
              :key="travel.id"
              :travel="travel"
            />
          </div>
        </span>
        <span v-else>
          <TravelIndex :travels="travels" />
        </span>
      </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>Double click to Edit</span>
        <div class="cards">
          <TravelCard
            v-for="travel in filteredResults"
            :key="travel.id"
            :travel="travel"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <TravelIndex :travels="filteredResults" />
      </span>
    </span>
  </div> 
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import TravelIndex from "@/components/travels/TravelIndex.vue";
import TravelCard from "@/components/travels/TravelCard.vue";

export default {
  name: "TravelList",
  components: {
    ConfirmDialogue,
    TravelIndex,
    TravelCard,
  },
  mounted() {
    this.sortedData = this.travels;
  },
  created() {
    this.$store.dispatch("fetchTravels");
    this.sortedData = this.$store.dispatch("fetchTravels");
  },
  computed: {
    travels() {
      return this.$store.state.travels;
    },
  },
  data() {
    return {
      requestIndexDetailFlag: false,
      searchResults: null,
      inputSearchText: "",
      filteredResults: [],
      columnDetails: null,
      sortedData: [],
      sortedbyASC: false,
      title: null,
      description: null,
      completed: 0,
      statusMessage: "",
    };
  },
  methods: {
    requestIndexDetail() {
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    editTravel(travel) {
      this.$router.push({ name: 'TravelEdit', params: { id: `${travel.id}` } });
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
            
            if (searchHasTitle|| searchHasDescription) {
              this.filteredResults.push(travel);
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
      this.sortedData = this.travels;
      if (this.sortedbyASC) {
        this.sortedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.sortedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
  },
};
</script>
<style scoped>
</style>
