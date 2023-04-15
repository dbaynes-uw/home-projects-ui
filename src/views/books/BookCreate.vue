<template>
  <h1>Create a Book to Track</h1>
  <div class="form-container">
    <form class="add-form" @submit.prevent="onSubmit">
      <label>Title</label>
      <input
        v-model="book.title"
        type="text"
        class="text-style"
        placeholder="Book Title"
        required
      />
      <label>Author</label>
      <input
        v-model="book.author"
        type="text"
        class="text-style"
        placeholder="Author"
        required
      />
      <label for="date_last_hiked">Date Written:</label>
      <input type="date" class="text-style" v-model="book.date_written" />
      <label>Url to Review</label>
      <input
        v-model="book.url_to_review"
        type="text"
        :maxlength="urlMaxLength"
        class="text-style"
        placeholder="URL to Review"
      />
      <span>
        {{ urlMaxLength - book.url_to_review.length }} / {{ urlMaxLength }}
      </span>
      <label>Notes</label>
      <input
        v-model="book.notes"
        type="text"
        placeholder="Notes"
        class="text-style"
      />
      <button class="button" type="submit">Submit</button>
    </form>
  </div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  data() {
    return {
      book: {
        title: "",
        author: "",
        date_written: "",
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
</style>
