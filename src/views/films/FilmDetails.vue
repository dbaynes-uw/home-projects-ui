<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h1>Film Details</h1>
    <br />
    <div v-if="film" class="event" id="center-align">
      <h3>
        <b>{{ film.title }}</b>
      </h3>
      <ul class="ul-left">
        <li>
          Nationality:
          <b>{{ film.nationality }}</b>
        </li>
        <li>
          isDirectorValid:
          <b>{{ film.director }}</b>
        </li>
        <li>
          Actors:
          <b>{{ film.actors }}</b>
        </li>
        <li>Seasons: <b>{{ film.seasons }}</b></li> 
        <li>Episodes: <b>{{ film.episodes }}</b></li>         
        <li v-if="film.date_released">
          Date Film Released:
          <b>{{ formatStandardDate(film.date_released) }}</b>
        </li>
        <li v-if="film.date_watched">
          Date Film Watched:
          <b>{{ formatStandardDate(film.date_watched) }}</b>
        </li>
        <li>
          Rating:
          <b>{{ film.rating }}</b>
        </li>
        <li v-if="film.url_to_review">
          URL to Review:
          <a :href="film.url_to_review" target="_blank">Click</a>
        </li>
        <li>
          Notes:
          <b>{{ film.notes }}</b>
        </li>
        <li>
          Date Entered:
          <b>{{ formatStandardDate(film.created_at) }}</b>
        </li>
      </ul>
      <br />
      <router-link :to="{ name: 'FilmList' }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
      <span class="fa-stack">
        <router-link :to="{ name: 'FilmEdit', params: { id: `${film.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteFilm(film)" class="fas fa-trash-alt fa-stack-1x"></i>
      </span>
      <br />
      <router-link :to="{ name: 'FilmList' }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      updatedFilm: null,
    };
  },
  methods: {
    async deleteFilm(film) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Film",
        message:
          "Are you sure you want to delete " +
          film.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteFilm", film);
        alert("Film was Deleted for " + film.title);
        this.$router.push({ name: "FilmList" });
      }
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
  },
  created() {
    this.$store.dispatch("fetchFilm", this.id);
  },
  computed: {
    film() {
      return this.$store.state.film;
    },
  },
};
</script>
<style scoped>
.event {
  font-size: 1.5rem;
}
#align-right {
  text-align: center;
}
body {
  font-size: 1.6rem;
}
.right-align {
  text-align: right;
}
</style>
