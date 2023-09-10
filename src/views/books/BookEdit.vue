<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="bookEdit">
    <h2>Edit Book {{ book.head_name }}</h2>
    <form class="add-form" @submit.prevent="updateBook">
      <div class="form-container">
        <label>Title:</label>
        <input type="text" class="text-style" v-model="book.title" required />
        <label>Author:</label>
        <input type="text" class="text-style" v-model="book.author" required />
        <label for="date_written">Date Written:</label>
        <input
          type="date"
          class="text-style"
          v-model="book.date_written"
          required
        />
        <label for="url_to_review">URL to Review:</label>
        <input type="text" class="text-style" v-model="book.url_to_review" />
        <label>Notes:</label>
        <textarea
          v-model="book.notes"
          rows="3"
          cols="40"
          class="textarea-style"
        />
        <button class="button" type="submit" id="background-blue">
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
      // or: "http://davids-macbook-pro.local:3000/api/v1/";
      work_url = "http://localhost:3001/api/v1/books/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/books/";
    }
    console.log("Mounted: ", this.$route.params.id);
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.book = result.data;
    console.log("Returned book: ", this.book);
  },
  data() {
    return {
      book: {
        id: "",
        title: "",
        author: "",
        date_written: "",
        url_to_review: "",
        notes: "",
        updated_by: "dbaynes",
      },
      api_url: ""
    };
  },
  setup() {},
  methods: {
    async updateBook() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Book from List",
        message:
          "Are you sure you want to update " +
          this.book.title +
          "? It cannot be undone.",
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const book = {
          ...this.book,
          updated_by: this.$store.state.created_by,
        };
        console.log("This api_url: ", this.api_url);
        console.log("This book to PUT: ", this.book);
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            title: this.book.title,
            author: this.book.author,
            date_written: this.book.date_written,
            url_to_review: this.book.url_to_review,
            notes: this.book.notes,
          }
        );
        if (result.status >= 200) {
          alert("Book has been updated");
          this.$router.push({ name: "BookDetails", params: { id: book.id } });
        } else {
          alert("Update Error Code ", result.status);
          console.log("ERROR Result Status: ", result.status);
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
