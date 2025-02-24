<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Golf List</h2>
      <h2 id="status-message">
        <u>{{ this.$route.query.success }}</u>
      </h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'GolfCreate' }">Add Golf Round Played</router-link>
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
        v-on:keyup="searchColumns"
      />
    </div>
  </div>

  <div class="golf-list">
    <span v-if="filteredResults.length == 0">
      <span v-if="searchResults == false">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
      <span v-else>
        <span v-if="requestIndexDetailFlag == false">
          <h3 id="h3-left">&nbsp;&nbsp;Total: {{ golfs.length }}</h3>
          <span class="h3-left-total-child">Double click Item Below to Edit</span>
          <div class="cards">
            <GolfCard
              v-for="golf in golfs"
              :key="golf.id"
              :golf="golf"
              class="card"
              @dblclick="editGolf(golf)"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <GolfIndex :golfs="golfs" />
        </span>
      </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>Double click to Edit</span>
        <div class="cards">
          <GolfCard
            v-for="golf in filteredResults"
            :key="golf.id"
            :golf="golf"
            class="card"
            @dblclick="editGolf(golf)"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <GolfIndex :golfs="filteredResults" />
      </span>
    </span>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import GolfIndex from "@/components/golfs/GolfIndex.vue";
import GolfCard from "@/components/golfs/GolfCard.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";

//import GolfSearchResults from "@/components/golfs/GolfSearchResults.vue";
export default {
  name: "GolfList",
  props: ["filteredResults[]"],
  components: {
    GolfIndex,
    GolfCard,
    ConfirmDialogue
  //  GolfSearchResults,
  },
  data() {
    return {
      onlineStatus: navigator.onLine,
      requestIndexDetailFlag: false,
      searchResults: null,
      inputSearchText: "",
      filteredResults: [],
      columnDetails: null,
      sortedData: [],
      sortedbyASC: false,
      description: null,
      frequency: null,
      completed: 0,
      var_number: null,
      statusMessage: "",
    };
  },
  mounted() {
    this.sortedData = this.golfs;
  },
  created() {
    this.$store.dispatch("fetchGolfs");
    this.sortedData = this.golfs;
  },
  computed: {
    golfs() {
      return this.$store.state.golfs;
    },
  },
  methods: {
    editGolf(golf) {
      this.$router.push({ name: 'GolfEdit', params: { id: `${golf.id}` } });
    },
    showIndex() {
      this.filteredResults = [];
    },
    requestIndexDetail() {
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    showVarNumber(var_num){
      this.filteredResults = [];
      if (
        this.golfs &&
        this.golfs.length > 0
      ){
        if (var_num > this.golfs.length ) {
          var_num = this.golfs.length
        }
        for (let i = 0; i < var_num; i++) {
          this.filteredResults.push(this.golfs[i]);
        }
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
          this.golfs &&
          this.golfs.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.golfs.forEach((golf) => {
            const searchHasCourse =
              golf.course &&
              golf.course
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasTeesPlayed =
              golf.tees_played &&
              golf.tees_played
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase()); 
            var dayjs = require('dayjs')
            const searchHasDatePlayed =
              golf.date_played &&
              dayjs(golf.date_played).format("MM-DD-YY")
                .includes(this.inputSearchText);
            if (searchHasCourse ||searchHasTeesPlayed || searchHasDatePlayed) {
              this.filteredResults.push(golf);
            }
          });
        }
      }
    },
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {

      this.sortedData = this.golfs;
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
    //  console.log("isOffline - this.isOnline = ", this.isOnline);
    //},
    //isOnline() {
    //  this.isOnline = true;
    //  console.log("isOnline - this.isOnline = ", this.isOnline);
    //},
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDatejs(value);
    },
  },
};
</script>
<style></style>
