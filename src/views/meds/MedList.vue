<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Med List</h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'MedCreate' }">Add Med</router-link>
        </button>
      </li>
      <li>
        <button id="button-as-link" @click="requestIndexDetail">
          <u>Detail Index View</u>
        </button>
      </li>
      <li>
        <button id="link-as-button" @click="requestMedChart">
          <u>MedChart</u>
        </button>
      </li>
    </ul>
    <br/>
  </v-card>
  <br/>
  <h4 style="text-align: center;">
    <a href="https://myhealthchart.com/" target="_blank">MyHealthChart dj.@./sen...NagoSalib2.@</a>
  </h4>
  <br />
  <div class="div-select">
    Time Frame:
    <select class="border-select select-range" @change="filterTimeFrame($event)">
      <option></option>
      <option value="7">Week</option>
      <option value="14">2 Weeks</option>
      <option value="30">Month</option>
      <option value="90">Quarter</option>
      <option value="365">Year</option>
    </select>
  </div>
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
  TimeFrame: {{ timeFrame }} days
  <br>
  <span v-if="requestMedChartFlag == true">
    <span v-if="filteredResults.length > 0">
      <MedChart :meds="filteredResults" :timeFrame=this.timeFrame :chartLabels="chartLabels" :chartIntervals="chartIntervals"/>
    </span>
    <span v-else>
      <MedChart :meds="meds" :timeFrame="30" :chartLabels="chartLabels" :chartIntervals="chartIntervals"/>
    </span>
  </span>
  <div class="med-list">
    <span v-if="filteredResults.length == 0" >
      <span v-if="searchResults == false">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
    <span v-else>
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ meds.length }}</h3>
        <span class="h3-left-total-child">Double click Item Below to Edit</span>
        <!--No Long In Action???-->
        <div class="cards">
          <MedCard
            v-for="med in filteredResults"
            :key="med.id"
            :med="med"
            class="card"
            @dblclick="editMed(med)"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <MedIndex :meds="meds"/>
      </span>
    </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>Double click to Edit</span>
        <p># Meds: {{ meds.length }}</p>
        <p># filteredResults: {{ filteredResults.length }}</p>
        <div class="cards">
          <MedCard
            v-for="med in filteredResults"
            :key="med.id"
            :med="med"
            class="card"
            @dblclick="editMed(med)"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <MedIndex :meds="filteredResults" />
      </span>
    </span>
  </div>

</template>
<script setup>
import MedCard from "@/components/meds/MedCard.vue";
import MedChart from "@/components/meds/MedChart.vue";
import MedIndex from "@/components/meds/MedIndex.vue";
</script>
<script>
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "MedList",
  components: {
    MedCard,
    MedChart,
    MedIndex,
  },
  data() {
    return {
      chartLabels: [],
      chartIntervals: [],
      requestIndexDetailFlag: true,
      requestMedChartFlag: false,
      inputSearchText: "",
      searchResults: null,
      filteredResults: [],
      columnDetails: null,
      sortedData: [],
      sortedbyASC: false,
      description: null,
      frequency: null,
      completed: 0,
      timeFrame: 0,
      //statusMessage: "",
    };
  },
  mounted() {
    //Executed at start
    this.sortedData = this.meds;
    this.sortedbyASC = true
    this.sortList('date_of_occurrence')
    this.filterTimeFrame("30")
  },
  created() {
    this.$store.dispatch("fetchMeds");
    this.sortedData = this.meds;
    for (let i=0; i < this.meds.length; i++) {
      this.chartLabels[i] = DateFormatService.formatStandardDatejs(this.meds[i].date_of_occurrence)
      this.chartIntervals[i] = this.meds[i].interval_days
    }
  },

  computed: {
    meds() {
      return this.$store.state.meds;
    },
  },
  methods: {
    async filterTimeFrame(value) {
      this.filteredResults = []
      await this.$nextTick();
      this.timeFrameCount = 0
      let compareDate = new Date()
      if (!value.target) {
        // Default set to 30 days in mounted()
        compareDate.toISOString(compareDate.setDate(compareDate.getDate()-value)).slice(0, 10)
        this.timeFrame = value
      } else {
        this.timeFrame = value.target.value
        compareDate.toISOString(compareDate.setDate(compareDate.getDate()-value.target.value)).slice(0, 10)
      }
      for (let i=0; i < this.meds.length; i++) {
        if (DateFormatService.formatFullYearFirstjs(this.meds[i].date_of_occurrence) > 
            DateFormatService.formatFullYearFirstjs(compareDate))
          {
            this.timeFrameCount += 1
            this.filteredResults.push(this.meds[i])
          }
      }
    }, 
    requestIndexDetail() {
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    requestMedChart() {
      this.requestMedChartFlag = this.requestMedChartFlag == true ? false : true;
    },
    editMed(med) {
      this.$router.push({ name: 'MedEdit', params: { id: `${med.id}` } });
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
          this.meds &&
          this.meds.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.meds.forEach((med) => {
            med.date_of_occurrence = DateFormatService.formatDatejs(med.date_of_occurrence)
            const searchHasDate =
              med.date_of_occurrence &&
              med.date_of_occurrence
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasDuration =
              med.duration &&
              med.duration
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasCircumstances =
              med.circumstances &&
              med.circumstances
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());            
            if (searchHasDate || searchHasDuration || searchHasCircumstances) {
              this.filteredResults.push(med);
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
      this.sortedData = this.meds;
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
