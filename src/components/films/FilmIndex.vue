<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('title')">Title</th>
      <th id="background-blue" @click="sortList('author')">Author</th>
      <th id="background-blue" @click="sortList('date_written')">
        Date Written
      </th>
      <th id="background-blue" @click="sortList('date_read')">
        Date Read
      </th>
      <th id="background-blue">URL to Review</th>
      <th id="background-blue">Notes</th>
      <th id="background-blue" style="text-align: right">Actions</th>
    </tr>
    <tr v-for="(result, resultIndex) in films" :key="resultIndex">
      <td>{{ result.title }}</td>
      <td>{{ result.author }}</td>
      <td>{{ formatFullYearDate(result.date_written) }}</td>
      <td>{{ formatFullYearDate(result.date_read) }}</td>

      <td>
        <a :href="result.url_to_review" target="_blank">Review</a>
      </td>
      <td>{{ result.notes }}</td>
      <td>
        <span v-if="this.onlineStatus">
          <span class="fa-stack">
            <router-link
              :to="{ name: 'FilmEdit', params: { id: `${result.id}` } }"
            >
              <i
                id="film-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'FilmDetails', params: { id: `${result.id}` } }"
              >
                <i id="film-icon-eye" class="fa fa-eye"></i>
              </router-link>
            </span>
            <span class="fa-table-stack">
              <i
                @click="deleteFilm(result)"
                class="fas fa-trash-alt fa-stack-1x"
                id="film-icon-delete"
              >
              </i>
            </span>
          </span>
        </span>
        <span v-else>
          <router-link
            :to="{ name: 'FilmDetails', params: { id: `${result.id}` } }"
          >
            View |
          </router-link>
          <router-link
            :to="{ name: 'FilmEdit', params: { id: `${result.id}` } }"
          >
            Edit |
          </router-link>
          <span class="ok-btn" @click="deleteFilm(result)"><u>Del</u></span>
        </span>
      </td>
    </tr>
  </v-table>
  <br />
  <!--b>Online Status: {{ this.onlineStatus }}</b!-->
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "FilmIndex",
  props: ["films"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      inputSearchText: "",
      onlineStatus: navigator.onLine,
    };
  },
  methods: {
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
            const searchHasAuthor =
              film.author &&
              film.author
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasTitle || searchHasAuthor) {
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
      this.sortedData = this.films;
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
    async deleteFilm(film) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Film from List",
        message:
          "Are you sure you want to delete " +
          film.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteFilm", film);
        this.statusMessage =
          "Film was Deleted for " +
          film.title +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
      }
    },
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDate(value);
    },
  },
};
</script>
