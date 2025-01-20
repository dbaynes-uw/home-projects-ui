<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <br/>
  <div class="filmEdit">
    <h2>Edit Film {{ film.title }}</h2>
    <button id="link-as-button">
      <router-link  :to="{ name: 'FilmList' }">Back to Film List</router-link>
    </button>
    <button id="link-as-button">
      <router-link  :to="{ name: 'FilmDetails' }">View the Card</router-link>
    </button>
    <br/>
    <form class="card-display" @submit.prevent="updateFilm">
      <div class="form-container">
        <v-text-field
          label="Film Title"
          v-model="film.title"
          required
        />
        <v-text-field
          label="Nationality"
          v-model="film.nationality"
        />
        <v-text-field
          label="Director"
          v-model="film.director"
          required
        />
        <v-text-field
          label="Actors"
          v-model="film.actors"
        />
        <v-text-field
          label="Seasons"
          v-model="film.seasons"
        />
        <v-text-field
          label="Episodes"
          v-model="film.episodes"
        />
        <v-text-field
          label="Date Released"
          v-model="film.date_released"
          type="date"
        />
        <v-text-field
          label="Date Watched"
          v-model="film.date_watched"
          type="date"
        />
        <v-select
          label="Rating(1-5)"
          :items="FILM_RATINGS"
          v-model="film.rating"
        >
          <option
            v-for="option in FILM_RATINGS"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === film.rating"
          >
            {{ option }}
          </option>
        </v-select> 
        <v-textarea
          label="URL to Review"
          v-model="film.url_to_review"
          rows="3"
          cols="40"
        />
        <v-textarea
          label="Notes"
          v-model="film.notes"
          rows="3"
          cols="40"
        />
        <button class="button" id="link-as-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { FILM_RATINGS } from "@/services/constants";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
</script>
<script>
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  created() {
    this.$store.dispatch("fetchFilm", this.id);
  },
  computed: {
    film() {
    return this.$store.state.film;
    }
  },
  data() {},
  methods: {
    async updateFilm() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Film from List ",
        message:
          "Are you sure you want to update " + 
          this.film.title,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const film = {
          ...this.film,
          updated_by: this.$store.state.created_by,
        };
        if (this.$store.dispatch("updateFilm", film)) {
          this.$router.push({ name: "FilmDetails", params: { id: film.id } });
        }
      }
    },
  },
};
</script>
<style></style>
