<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1><Marquee>{{ film.title }}</Marquee></h1>
  <router-link :to="{ name: 'FilmList' }">
      <b>Back to Film List</b>
    </router-link>
  <br/>
  <br/>
  <h3>{{ this.statusMessage }}</h3>
  <div class="card-display">
    <FilmCard
      :key="film.id"
      :film="film"
      :origin="origin"
      class="card"
      @dblclick="editFilm(film)"
      />
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import FilmCard from "@/components/films/FilmCard.vue";
import { ref } from 'vue';
const successMessage = ref('')
export default {
  name: 'FilmDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    FilmCard,
  },
  mounted() {
    this.sortedData = this.films;      
    successMessage.value = this.$route.query.success;
    this.statusMessage = successMessage.value
  },
  data() {
    return {
      statusMessage: '',
      updatedFilm: null,
    };
  },
  methods: {
    editFilm(film) {
      this.$router.push({ name: 'FilmEdit', params: { id: `${film.id}` } });
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
  created() {
    this.$store.dispatch("fetchFilm", this.id);
  },
  computed: {
    film() {
      return this.$store.state.film;
    },
    origin() {
      return "FilmDetails"
    }
  },
};
</script>