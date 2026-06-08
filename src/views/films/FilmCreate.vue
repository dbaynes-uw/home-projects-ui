<template>
  <section class="create-shell mx-auto mt-5">
    <header class="create-shell-header pb-0">
      <h3>Add Film to Films Watched Collection</h3>
    </header>
    <div class="create-shell-body">
    <BaseForm @submit.prevent="onSubmit">
      <div id="form-container">
        <BaseTextField
          v-model="film.title"
          :rules="[requiredTitle]"
          label="Title"
        >
          <template v-slot:prepend-inner>
            <BaseIcon class="icon-css">mdi-magnify</BaseIcon>
          </template>
        </BaseTextField>
        <BaseTextField
          v-model="film.nationality"
          label="Film Nationality"
        >
          <template v-slot:prepend-inner>
            <BaseIcon class="icon-css">mdi-magnify</BaseIcon>
          </template>
        </BaseTextField>        
        <BaseTextField label="Film Director" v-model="film.director" :rules="[requiredDirector]">
          <template v-slot:prepend-inner>
            <BaseIcon class="icon-css">mdi-account-circle</BaseIcon>
          </template>
        </BaseTextField>
        <BaseTextField label="Actors" v-model="film.actors">
          <template v-slot:prepend-inner>
            <BaseIcon class="icon-css">mdi-note</BaseIcon>
          </template>
        </BaseTextField>  
        <BaseTextField label="Seasons" v-model="film.seasons">
          <template v-slot:prepend-inner>
            <BaseIcon class="icon-css">mdi-account-circle</BaseIcon>
          </template>
        </BaseTextField>
        <BaseTextField label="Episodes" v-model="film.episodes">
          <template v-slot:prepend-inner>
            <BaseIcon class="icon-css">mdi-account-circle</BaseIcon>
          </template>
        </BaseTextField>
        <BaseTextField label="Date Film Made"
          v-model="film.date_released"
          type="date"
        >
          <template v-slot:prepend-inner>
            <BaseIcon class="icon-css">mdi-calendar</BaseIcon>
          </template>
        </BaseTextField>
        <BaseTextField label="Date Watched"
          v-model="film.date_watched"
          type="date"
        >
          <template v-slot:prepend-inner>
            <BaseIcon class="icon-css">mdi-calendar</BaseIcon>
          </template>
        </BaseTextField>
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
        <BaseTextField
          v-model="film.url_to_review"
          label="URL to Review"
        >
          <template v-slot:prepend-inner>
            <BaseIcon class="icon-css">mdi-link</BaseIcon>
          </template>
        </BaseTextField>        
        <BaseTextField label="Notes" v-model="film.notes">
          <template v-slot:prepend-inner>
            <BaseIcon class="icon-css">mdi-note</BaseIcon>
          </template>
        </BaseTextField>
        <button type="submit" class="btn btn-primary mt-2 w-100">Submit</button>
      </div>
    </BaseForm>
    </div>
  </section>
</template>
<script setup>
  import { FILM_RATINGS } from "@/services/constants";
  import { v4 as uuidv4 } from "uuid";
</script>

<script>
export default {
  components: {
  },
  data() {
    return {
      film: {
        title: null,
        nationality: "",
        director: "",
        actors: "",
        seasons: "",
        episodes: "",
        date_released: null,
        date_watched: null,
        rating: '',
        url_to_review: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      ratings: ["1-Bad", "2-Less than Ok", "3-Ok", "4-Good", "5-Great"],
      isFormValid: false,
      isDirectorValid: false,
      isTitleValid: false,
      urlMaxLength: 255,
      num: 1,
    };
  },
  methods: {
    onSubmit() {
      this.checkValidations();
      if (this.isFormValid) {
        const film = {
          ...this.film,
          id: uuidv4(),
          created_by: this.$store.state.user.resource_owner.email,
        };
        if (this.$store.dispatch("createFilm", film)) {
          this.$router.push({ name: "FilmList" });
        } else {
          alert("Error adding Film Title" + film.title);
        } 
      } else {
        alert("Please correct required fields and resubmit");
      }
    },
    requiredDirector: function (value) {
      if (value) {
          this.isDirectorValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isDirectorValid = false
          return 'Please enter Director';
      }
    },
    requiredTitle: function (value) {
      if (value) {
          this.isTitleValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isTitleValid = false
          return 'Please enter Title';
      }
    },
    checkValidations() {

      if (this.isDirectorValid && this.isTitleValid) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
    }
  },
  film() {
    return this.$store.state.film;
  },
};
</script>
<style lang="css">

/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 33%;
  padding: 10px;
  /*height: 300px; /* Should be removed. Only for demonstration */
}

.create-shell {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.create-shell-header {
  padding: 1rem 1.25rem 0.5rem;
}

.create-shell-body {
  padding: 0.5rem 1.25rem 1rem;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
.v-icon {
  color: darkslategrey;
  top: -0.2rem;
}
#form-container {
  text-align: left;
  width: 75% !important;
}
[type="checkbox"],
#notes {
  width: 100%;
  height: 4rem;
}
.button {
  margin: 30px;
  background-color: #39495c;
  border-radius: 5px;
  font-size: 18px;
  width: 160px;
  height: 60px;
  color: white;
  padding: 20px;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
    inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
    inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
  text-align: center;
  cursor: pointer;
}
label {
  font-size: 20px;
  margin-bottom: 5px;
}
input {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
}
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}
select {
  border-color: darkgreen;
}
legend {
  font-size: 28px;
  font-weight: 700;
  margin-top: 20px;
}
.label-visible {
  top: -35px;
  left: 4px;
  visibility: visible;
}
.label-invisible {
  top: -10px;
  left: 4px;
  visibility: hidden;
}
.input-field {
  margin-top: 30px;
  position: relative;
}
.input-field > input {
  width: 100%;
}
.input-field > p {
  position: absolute;
  font-size: 14px;
  transition: 0.3s;
}
</style>
