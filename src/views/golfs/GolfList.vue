<template>
  <div class="div-frame">
    <h2>Golf Rounds Played</h2>
    <h2 id="status-message">
      <!--{{ this.statusMessage }}</-->
    </h2>
    <h2>
      <router-link :to="{ name: 'GolfCreate' }">Add Golf Round</router-link>
    </h2>
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
    <div class="golf-list">
      <span v-if="filteredResults.length == 0">
        <GolfIndex :golfs="golfs" />
      </span>
      <span v-if="filteredResults.length > 0">
        <GolfSearchResults :filteredResults="filteredResults" />
      </span>
    </div>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import GolfIndex from "@/components/golfs/GolfIndex.vue";
import GolfSearchResults from "@/components/golfs/GolfSearchResults.vue";
export default {
  name: "GolfList",
  props: ["filteredResults[]"],
  components: {
    GolfIndex,
    GolfSearchResults,
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
    this.sortedData = this.golfs;
  },
  created() {
    console.log("GolfList created");
    this.$store.dispatch("fetchGolfs");
    this.sortedData = this.golfs;
  },
  computed: {
    golfs() {
      return this.$store.state.golfs;
    },
  },
  methods: {
    showIndex() {
      this.filteredResults = [];
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
            const searchHasTitle =
              golf.title &&
              golf.title
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasAuthor =
              golf.author &&
              golf.author
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasTitle || searchHasAuthor) {
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
      console.log("SORTLIST - sortedData: ", this.sortedData);
      console.log("SORTLIST: ", sortBy);
      console.log("SORTLIST - sortedbyASC: ", this.sortedbyASC);
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
      return DateFormatService.formatFullYearDate(value);
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
