<template>
  <div class="div-frame">
    <h2>Film List</h2>
    <h2 id="status-message">
      <!--{{ this.statusMessage }}</-->
    </h2>
    <h2>
      <router-link :to="{ name: 'FilmCreate' }">Add Film</router-link>
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
    <div class="film-list">
      <span v-if="filteredResults.length == 0">
        <FilmIndex :films="films" />
      </span>
      <span v-if="filteredResults.length > 0">
        <FilmIndex :films="filteredResults" />
      </span>
    </div>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import FilmIndex from "@/components/films/FilmIndex.vue";
export default {
  name: "FilmList",
  props: ["filteredResults[]"],
  components: {
    FilmIndex,
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
    this.sortedData = this.films;
  },
  created() {
    this.$store.dispatch("fetchFilms");
    this.sortedData = this.films;
  },
  computed: {
    films() {
      return this.$store.state.films;
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
          this.films &&
          this.films.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.films.forEach((film) => {
            const searchHasTitle =
              film.title &&
              film.title
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasDirector =
              film.director &&
              film.director
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasTitle || searchHasDirector) {
              this.filteredResults.push(film);
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
      this.sortedData = this.films;
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
