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
        <!--
        <button id="link-as-button">
          <router-link  :to="{ name: 'MedChartView' }">MedChart</router-link>
        </button-->
      </li>
    </ul> 
    <br/>
  </v-card>
  <br/>
  <h4 style="text-align: center;">
    <a href="https://myhealthchart.com/" target="_blank">MyHealthChart dj.@./sen...NagoSalib2.@</a>
  </h4>
  <br />
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
  <span v-if="requestMedChartFlag == true">
    <MedChart :meds="meds" :chartLabels="chartLabels" :chartIntervals="chartIntervals"/>
  </span>
  <div class="med-list">
    <span v-if="filteredResults.length == 0">
      <span v-if="searchResults == false">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
      <span v-else>
        <span v-if="requestIndexDetailFlag == true">
          <h3 id="h3-left">Total: {{ meds.length }}</h3>
            <span class="h3-left-total-child">Double click Item Below to Edit</span>
          <div class="events">
            <MedCard
              v-for="med in meds"
              :key="med.id"
              :med="med"
              class="med"
              @dblclick="onDoubleClick(med)"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <MedIndex :meds="meds" />
        </span>
      </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>Double click to Edit</span>
        <div class="meds">
          <MedCard
            v-for="med in filteredResults"
            :key="med.id"
            :med="med"
            class="med"
            @dblclick="onDoubleClick(med)"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <MedSearchResults :filteredResults="filteredResults" />
      </span>
    </span>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import MedCard from "@/components/meds/MedCard.vue";
import MedChart from "@/components/meds/MedChart.vue";
import MedIndex from "@/components/meds/MedIndex.vue";
import MedSearchResults from "@/components/meds/MedSearchResults.vue";

export default {
  name: "MedList",
  props: ["filteredResults[]"],
  components: {
    MedCard,
    MedChart,
    MedIndex,
    MedSearchResults,
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
      //statusMessage: "",
    };
  },
  mounted() {
    this.sortedData = this.meds;
  },
  created() {
    this.$store.dispatch("fetchMeds");
    this.sortedData = this.meds;
    for (let i=0; i < this.meds.length; i++) {
      this.chartLabels[i] = DateFormatService.formatStandardDate(this.meds[i].date_of_occurrence)
      this.chartIntervals[i] = this.meds[i].interval
    }
  },
  computed: {
    meds() {
      return this.$store.state.meds;
    },
  },
  methods: {
    requestIndexDetail() {
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    requestMedChart() {
      this.requestMedChartFlag = this.requestMedChartFlag == true ? false : true;
    },
    onDoubleClick(med) {
      console.log("MED Edit ")
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
            med.date_of_occurrence = DateFormatService.formatYearDate(med.date_of_occurrence)
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
    formatYearDate(value) {
      return DateFormatService.formatYearDate(value);
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTime(value);
    },
  },
};
</script>
<!--style scoped>
.table-index-style {
  width: 100%;
  border-collapse: collapse;
}
th {
  background-color: #7ba8bd;
  text-align: left;
  padding-left: 1rem;
  padding-right: 1rem;
}
tr {
  line-height: 1.6 !important;
  border: none;
}
tr:nth-child(odd) {
  background-color: #41b88352;
  border: none !important;
}
td {
  padding-left: 1rem;
  padding-right: 1rem;
}
.eventAssigned {
  background: #e8f7f0;
}
.fa-table-stack {
  position: relative;
  left: 2rem;
}
i {
  bottom: 0px;
  color: gray;
}
tr.is-complete {
  background: #35495e;
  color: #fff;
}
#status-message {
  text-align: center;
  color: navy;
}
</style-->
<style>
.meds {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
.med {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
.med-link {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
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
