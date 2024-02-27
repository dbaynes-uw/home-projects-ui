<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('title')">Title</th>
      <th id="background-blue" @click="sortList('nationality')">Nationality</th>
      <th id="background-blue" @click="sortList('director')">Director</th>
      <th id="background-blue">Seasons Episodes</th>
      <th id="background-blue" @click="sortList('date_released')">
        Date Released
      </th>
      <th id="background-blue" @click="sortList('date_watched')">
        Date Watched
      </th>
      <th id="background-blue">Rating</th>
      <th id="background-blue">URL to Review</th>
      <th class="th-center" id="background-blue">Actions</th>
    </tr>
    <tr v-for="(result, resultIndex) in films" :key="resultIndex">
      <td>{{ result.title }}</td>
      <td>{{ result.nationality }}</td>
      <td>{{ result.director }}</td>
      <td class="td-center">{{ result.seasons }}/{{ result.episodes }}</td>
      <td class="td-center">{{ formatYearOnly(result.date_released) }}</td>
      <td class="td-center">{{ formatStandardDate(result.date_watched) }}</td>
      <td class="td-center">{{ result.rating }}</td>
      <td class="td-center">
        <a :href="result.url_to_review" target="_blank">Review</a>
      </td>
       <td class="td-center" >
        <span v-if="this.onlineStatus">
          <span class="fa-stack" style="text-align: center">
            <router-link
              :to="{ name: 'FilmEdit', params: { id: `${result.id}` } }"
            >
              <i
                id="long-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'FilmDetails', params: { id: `${result.id}` } }"
              >
                <i id="long-icon-eye" class="fa fa-eye"></i>
              </router-link>
            </span>
            <span class="fa-table-stack">
              <i
                @click="deleteFilm(result)"
                class="fas fa-trash-alt fa-stack-1x"
                id="long-icon-delete"
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
          <span class="ok-btn" @click="deleteFilm(result)"><u>Delete</u></span>
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
      this.sortedData = this.films;
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
          "Film " +
          film.title +
          "will be Deleted in 2 seconds";
        setTimeout(() => location.reload(), 2500);
      }
    },
    formatYearOnly(value) {
      return DateFormatService.formatYearOnly(value);
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
  },
};
</script>
