<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="filmEdit">
    <h2>Edit Film {{ film.title }}</h2>
    <form class="add-form" @submit.prevent="updateFilm">
      <div class="form-container">
        <label>Title:</label>
        <input type="text" class="text-style" v-model="film.title" required />
        <label>Nationality:</label>
        <input type="text" class="text-style" v-model="film.nationality" />
        <label>Director:</label>
        <input type="text" class="text-style" v-model="film.director" required />
        <label>Actors:</label>
        <input type="text" class="text-style" v-model="film.actors"/>
        <label>Seasons:</label>
        <input type="text" class="text-style" v-model="film.seasons" />
        <label>Episodes:</label>
        <input type="text" class="text-style" v-model="film.episodes" />
        <label for="date_written">Date Released:</label>
        <input
          type="date"
          class="text-style"
          v-model="film.date_released"
        />
        <label for="date_read">Date Watched:</label>
        <input
          type="date"
          class="text-style"
          v-model="film.date_watched"
        />
        <label for="rating">Rating</label>
        &nbsp;
        <select
          id="select-box"
          class="text-style"
          v-model="film.rating"
        >
          <option
            v-for="option in ratings"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === film.rating"
          >
            {{ option }}
          </option>
        </select>
        <br/>
        <br/>
        <label for="url_to_review">URL to Review:</label>
        <input type="text" class="text-style" v-model="film.url_to_review" />
        <label>Notes:</label>
        <textarea
          v-model="film.notes"
          rows="3"
          cols="40"
          class="textarea-style"
        />
        <button class="button" id="link-as-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
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
