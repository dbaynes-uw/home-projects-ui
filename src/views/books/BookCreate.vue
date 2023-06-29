<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Add Book to Collection</h3>
    </v-card-title>
  </v-card>
  <v-card-text>
    Rules: {{ [required] }}
    <v-form>
      <v-containter>
        <v-text-field
          v-model="book.title"
          :rules="[(v) => !!v || 'Required']"
          label="Title"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Author" v-model="book.author">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-account-circle</v-icon>
          </template>
        </v-text-field>
        <VueDatePicker
          v-model="book.date_written"
          placeholder="Date Written"
          :format="format"
        />
        <v-text-field label="Url to Review" v-model="book.url_to_review" />
        <span>
          {{ urlMaxLength - book.url_to_review.length }} / {{ urlMaxLength }}
        </span>
        <v-text-field label="Notes" v-model="book.notes">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-note</v-icon>
          </template>
        </v-text-field>
        <v-btn type="submit" block class="mt-2" @click="onSubmit">Submit</v-btn>
        <!--button class="button" type="submit">Submit</button-->
      </v-containter>
    </v-form>
  </v-card-text>
</template>
<script setup>
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  console.log("DATE: ", date);
  console.log("Month: ", month);
  console.log("Day: ", day);
  console.log("Year: ", year);
  return `${month}/${day}/${year}`;
};
</script>

<script>
import { v4 as uuidv4 } from "uuid";
//Himport VueDatePicker from "@vuepic/vue-datepicker";
//Himport "@vuepic/vue-datepicker/dist/main.css";
export default {
  components: {
    //VueDatePicker,
  },
  data() {
    return {
      book: {
        title: null,
        rules: {
          required: (value) => !!value || "Required",
        },
        author: "",
        date_written: null,
        url_to_review: "",
        notes: "",
        created_by: "dbaynes",
      },
      urlMaxLength: 255,
      num: 1,
    };
  },
  methods: {
    onSubmit() {
      const book = {
        ...this.book,
        id: uuidv4(),
        created_by: this.$store.state.user,
      };
      if (this.$store.dispatch("createBook", book)) {
        this.$router.push({ name: "BookList" });
      } else {
        alert("Error adding Book Location " + book.title);
      }
    },
  },
  book() {
    return this.$store.state.book;
  },
};
</script>
<style>
.add-form {
  display: flex;
  flex-direction: column;
  width: 425px;
  padding: 20px;
  margin: 40px;
  border: 2px solid #d8d8d8;
  background-color: white;
  -webkit-box-shadow: 0px 2px 15px -12px rgba(0, 0, 0, 0.57);
  -moz-box-shadow: 0px 2px 15px -12px rgba(0, 0, 0, 0.57);
  box-shadow: 2px 15px -12px rgba(0, 0, 0, 0.57);
}
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
