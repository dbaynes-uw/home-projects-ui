<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="filmEdit">
    <h2>Edit Film {{ film.title }}</h2>
    <router-link :to="{ name: 'FilmList' }">
      <h3>Back to Film List</h3>
    </router-link>
    <form class="add-form" @submit.prevent="updateFilm">
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
import axios from "axios";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
</script>
<script>
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macfilm-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/films/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/films/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.film = result.data;
  },
  data() {
    return {
      film: {
        id: "",
        title: "",
        nationality: "",
        director: "",
        actors: "",
        seasons: "",
        episodes: "",
        date_released: "",
        date_watched: "",
        rating: "",
        url_to_review: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      ratings: ["1-Bad", "2-Less than Ok", "3-Ok", "4-Good", "5-Great"],
      api_url: ""
    };
  },
  setup() {},
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
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            title: this.film.title,
            nationality: this.film.nationality,
            director: this.film.director,
            actors: this.film.actors,
            date_released: this.film.date_released,
            seasons: this.film.seasons,
            episodes: this.film.episodes,
            rating: this.film.rating,
            date_watched: this.film.date_watched,
            url_to_review: this.film.url_to_review,
            notes: this.film.notes,
          }
        );
        if (result.status >= 200) {
          alert("Film has been updated");
          this.$router.push({ name: "FilmDetails", params: { id: film.id } });
        } else {
          alert("Update Error Code ", result.status);
        }
      }
    },
  },
};
</script>
<style>
select {
  border-color: darkgreen;
}
</style>
