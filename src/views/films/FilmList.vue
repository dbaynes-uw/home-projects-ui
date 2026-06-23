<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <section class="page-shell mx-auto mt-5">
    <header class="page-shell-header pb-0">
      <h2>Film List</h2>
      <h2 id="status-message">
        <u>{{ this.$route.query.success }}</u>
      </h2>
    </header>
    <div class="details-top-links">
      <router-link class="details-top-link" :to="{ name: 'FilmCreate' }">
        Add Films Viewed
      </router-link>
      <button
        type="button"
        class="details-top-link details-top-toggle"
        @click="requestIndexDetail"
      >
        Film Marquee
      </button>
    </div>
    <br/>
  </section>
  <br/>
  <div style="width: 100%">
    <div class="auto-search-container">
      <BaseTextField
        clearable
        clear-icon="fas fa-close"
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
          <span class="list-intro-center">Double click Item Below to Edit</span>
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
            const searchHasDirector =
              film.director &&
              film.director
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasDateWatched = 
              film.date_watched
              .includes(this.inputSearchText)
            
            if (searchHasTitle || searchHasDirector || searchHasDateWatched) {
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
<style scoped>
.page-shell {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.page-shell-header {
  padding: 1rem 1.25rem 0.5rem;
}

.details-top-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 1.25rem 1rem;
}

.details-top-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  background: #f8fafc;
  color: #0f172a;
  text-decoration: none;
  font: inherit;
}

.details-top-link:hover {
  background: #e2e8f0;
}

.details-top-toggle {
  cursor: pointer;
}

@media (max-width: 600px) {
  .details-top-links {
    flex-direction: column;
    align-items: stretch;
  }

  .details-top-link {
    width: 100%;
  }
}
</style>
