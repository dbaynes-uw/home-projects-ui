<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Watering System</h2>
      <v-img
          :src="require('../../assets/vegetable_garden_summer_2024.png')"
          class="my-3"
          contain
          height="400"
      />
      <h2 id="status-message">
        <u>{{ this.statusMessage }}</u>
      </h2>
    </v-card-title>
    <br/>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'WateringCreate' }">Add Watering</router-link>
        </button>
      </li>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'WateringCreate' }">Edit Watering</router-link>
        </button>
      </li>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'GardenPlantList' }">Vegetable Garden</router-link>
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
  <div class="watering-list">
    <span v-if="filteredResults.length == 0">
      <span v-if="searchResults == false">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
      <span v-else>
        <span v-if="requestIndexDetailFlag == true">
          <h3 id="h3-left">Total: {{ waterings.length }}</h3>
          <span class="h3-left-total-child">Double click Item Below to Edit</span>
          <div class="cards">
            <WateringCard
              v-for="watering in waterings"
              :key="watering.id"
              :watering="watering"
              :origin="origin"
              class="card"
              @dblclick="onDoubleClick(watering)"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <WateringIndex :waterings="waterings" />
        </span>
      </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>Double click to Edit</span>
        <div class="cards">
          <WateringCard
            v-for="watering in filteredResults"
            :key="watering.id"
            :watering="watering"
            class="card"
            :origin="origin"
            @dblclick="onDoubleClick(plant)"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <WateringSearchResults :filteredResults="filteredResults" />
      </span>
    </span>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import WateringCard from "@/components/waterings/WateringCard.vue";
import WateringIndex from "@/components/waterings/WateringIndex.vue";

import WateringSearchResults from "@/components/waterings/WateringSearchResults.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";

export default {
  name: "WateringDisplay",
  props: ["filteredResults[]"],
  components: {
    WateringCard,
    WateringSearchResults,
    WateringIndex,
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
    };
  },
  mounted() {
    this.sortedData = this.waterings;
  },
  created() {
    this.$store.dispatch("fetchWaterings");
    console.log("CREATED WATERINGS: ", this.waterings )
    this.sortedData = this.waterings;
  },
  computed: {
    waterings() {
      //console.log("COMPUTED WATERINGS: ", this.$store.state.waterings )
      //return this.$store.state.waterings;

      return [
      {   location: 'South',
          faucet_location: 'East',
          line_number: '1',
          description: 'Vegetable Garden',
          frequency: 'Everyday',
          start_time: '06:40',
          duration: '20mins',
          notes: 'Note or two',
        },
        { location: 'South',
          faucet_location: 'East',
          line_number: '2',
          description: 'Fense: Helibores, Daisies, Rhododendrons',
          frequency: 'Everyday',
          start_time: '6:40',
          duration: '20mins',
          notes: '',
        },
        { location: 'South',
          faucet_location: 'West',
          line_number: '1',
          description: 'Keyhole',
          frequency: 'T,Th,Sun',
          start_time: '6:00',
          duration: '30mins',
          notes: '',
        },
        { location: 'North',
          faucet_location: 'East',
          line_number: '1',
          description: 'Pots',
          frequency: 'Every 2 days',
          start_time: '9:00',
          duration: '20mins',
          notes: '',
        },
        { location: 'North',
          faucet_location: 'East',
          line_number: '2',
          description: 'Gate - Witch Hazel',
          frequency: 'Every 3 days',
          start_time: '7:00',
          duration: '20mins',
          notes: '',
        },
        { location: 'North',
          faucet_location: 'East',
          line_number: '3',
          description: 'West Fence - Hydrangeas',
          frequency: 'T,F,Sun',
          start_time: '7:30',
          duration: '20mins',
          notes: '',
        },
      ]
    },
    origin() {
      return "WateringDisplay"
    }
  },
  methods: {
    requestIndexDetail() {
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    onDoubleClick(watering) {
      console.log("watering Edit ")
      this.$router.push({ name: 'WateringEdit', params: { id: `${watering.id}` } });
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
          this.waterings &&
          this.waterings.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.waterings.forEach((watering) => {
            const searchHasWateringLocation =
              watering.location &&
              watering.location
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasLocationDirection =
              watering.faucet_location &&
              watering.faucet_location
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasWateringLocation || searchHasLocationDirection) {
              this.filteredResults.push(watering);
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
      //console.log("BOOK LIST sortBy: ", sortBy)
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
