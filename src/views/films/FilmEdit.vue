<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <br/>
  <div class="filmEdit">
    <h2>Edit Film {{ film.title }}</h2>
    <div class="details-top-links">
      <router-link class="details-top-link" :to="{ name: 'FilmList' }">
        Back to Film List
      </router-link>
      <router-link class="details-top-link" :to="{ name: 'FilmDetails' }">
        View the Card
      </router-link>
    </div>
    <br/>
    <form class="card-display" @submit.prevent="updateFilm">
      <div class="form-container">
        <BaseTextField
          label="Film Title"
          v-model="film.title"
          required
        />
        <BaseTextField
          label="Nationality"
          v-model="film.nationality"
        />
        <BaseTextField
          label="Director"
          v-model="film.director"
          required
        />
        <BaseTextField
          label="Actors"
          v-model="film.actors"
        />
        <BaseTextField
          label="Seasons"
          v-model="film.seasons"
        />
        <BaseTextField
          label="Episodes"
          v-model="film.episodes"
        />
        <BaseTextField
          label="Date Released"
          v-model="film.date_released"
          type="date"
        />
        <BaseTextField
          label="Date Watched"
          v-model="film.date_watched"
          type="date"
        />
        <BaseSelect
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
        </BaseSelect> 
        <BaseTextarea
          label="URL to Review"
          v-model="film.url_to_review"
          rows="3"
          cols="40"
        />
        <BaseTextarea
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
<style scoped>
.details-top-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0 0.75rem;
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
