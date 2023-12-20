<template>
  <div class="div-frame">
    <h2>Med List</h2>
    <h2>
      <router-link :to="{ name: 'MedCreate' }">Add Med</router-link>
    </h2>
    <h3 id="h3-left">
      <a href="https://myhealthchart.com/" target="_blank">MyHealthChart dj.@./sen...NagoSalib2.@</a>
    </h3>
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
    <div class="med-list">
      <span v-if="filteredResults.length == 0">
        <MedIndex :meds="meds" />
      </span>
      <span v-if="filteredResults.length > 0">
        <MedIndex :meds="filteredResults" />
      </span>
    </div>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import MedIndex from "@/components/meds/MedIndex.vue";
export default {
  name: "MedList",
  props: ["filteredResults[]"],
  components: {
    MedIndex,
  },
  data() {
    return {
      inputSearchText: "",
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
    console.log("MedList created");
    this.$store.dispatch("fetchMeds");
    this.sortedData = this.meds;
  },
  computed: {
    meds() {
      return this.$store.state.meds;
    },
  },
  methods: {
    showIndex() {
      this.filteredResults = [];
    },
    searchColumns() {
      console.log("Med LIST searchColumn: ")
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
          });
        }
      }
    },
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {
      //console.log("Med LIST sortBy: ", sortBy)
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
