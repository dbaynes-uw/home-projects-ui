<template>
  <div id="required-to-prevent-vue-warning">
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
    <div class="card">
      <p id="p-custom-left-u">{{ film.title}}</p>
      <ul>
        <li class="li-left">Film Title: <b>{{ film.title }}</b></li>
        <li class="li-left">Nationality: <b>{{ film.nationality }}</b></li>
        <li class="li-left">Director: <b>{{ film.director }}</b></li>
        <li class="li-left">Seasons: <b>{{ film.seasons }}</b></li>
        <li class="li-left">Episodes: <b>{{ film.episodes }}</b></li>
        <li class="li-left">Date Released:<br/><b>{{ formatFullYearDate(film.date_released) }}</b></li>
        <li class="li-left">Date Watched:<br/><b>{{ formatFullYearDate(film.date_watched) }}</b></li>
        <li class="li-left">Film Rating: <b>{{ film.rating }}</b></li>
        <li class="li-left">URL to Review: <b><a :href="film.url_to_review" target="_blank">Review</a></b></li>
        <li class="li-left">Notes:</li>
        <b class="li-left-none" v-for="(notes, idx) in splitList(film, this.splitLength)" :key="idx">{{ notes }}</b>
      </ul>
      <br/>
      <span class="fa-stack">
        <router-link :to="{ name: 'FilmEdit', params: { id: `${film.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-if="currentUrl.includes('/films/')" class="fa-stack">
        <router-link :to="{ name: 'FilmList' }">
          <i class="fa-solid fa-backward fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-else>
        <router-link :to="{ name: 'FilmDetails', params: { id: `${film.id}` } }">
          <i class="fa-solid fa-eye fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteFilm(film)" class="fas fa-trash-alt fa-stack-1x">
        </i>
      </span>
      <br />
    </div>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import SplitStringService from "@/services/SplitStringService.js";
import { useRoute } from 'vue-router'
export default {
  name: 'FilmCard',
  props: {
    film: {
      type: Object,
      default: () => ({})
    },
    origin: {
      type: String,
      default: '',
    }
  },
  components: {
    ConfirmDialogue,
  },
  setup() {
    const route = useRoute()
    return {
      currentUrl: route.fullPath
    }
  },
  data() {
    return {
      splitLength: 30,
    }
  },
  methods: {
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
        this.$router.push({ name: "FilmList" });
      }
    },
    //Services:
    splitList(filmData, splitLength) {
      return SplitStringService.splitList(filmData.notes, splitLength) 
    },
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDatejs(value);
    },
  }
}
</script>

<style scoped>
</style>
