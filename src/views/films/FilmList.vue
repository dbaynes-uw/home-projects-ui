<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Film List</h2>
      <h2 id="status-message">
        <u>{{ this.$route.query.success }}</u>
      </h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'FilmCreate' }">Add Film To Films Viewed</router-link>
        </button>
      </li>
      <li>
        <button id="button-as-link" @click="requestIndexDetail">
          <u>Marquee or Index View</u>
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
  <div class="film-list">
    <span v-if="filteredResults.length == 0">
      <span v-if="searchResults == false">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
      <span v-else>
        <span v-if="requestIndexDetailFlag == false">
          <h3 id="h3-left">&nbsp;&nbsp;Total: {{ films.length }}</h3>
          <span class="h3-left-total-child">Double click Item Below to Edit</span>
          <div class="cards">
            <FilmCard
              v-for="film in films"
              :key="film.id"
              :film="film"
              class="card"
              @dblclick="editFilm(film)"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <FilmIndex :films="films" />
        </span>
      </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>Double click to Edit</span>
        <div class="cards">
          <FilmCard
            v-for="film in filteredResults"
            :key="film.id"
            :film="film"
            class="card"
            @dblclick="editFilm(film)"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <FilmIndex :films="filteredResults" />
      </span>
    </span>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import FilmIndex from "@/components/films/FilmIndex.vue";
import FilmCard from "@/components/films/FilmCard.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
export default {
  name: "FilmList",
  components: {
    FilmIndex,
    FilmCard,
    ConfirmDialogue
  },
  setup() {},
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
    requestIndexDetail() {
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    editFilm(film) {
      this.$router.push({ name: 'FilmEdit', params: { id: `${film.id}` } });
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
            const searchHasAuthor =
              film.author &&
              film.author
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasTitle || searchHasAuthor) {
              this.filteredResults.push(film);
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
      return DateFormatService.formatFullYearDatejs(value);
    },
  },
};
</script>
<style></style>
