<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="edit">
    <h2>Edit Book {{ book.head_name }}</h2>
    <router-link :to="{ name: 'BookList' }">
      <b>Back to Book List</b>
    </router-link>
    <br/>
    <br/>
    <form class="form-card-display" @submit.prevent="updateBook">
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
        />
        <label for="date_read">Date Read:</label>
        <input
          type="date"
          class="text-style"
          v-model="book.date_read"
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
      // or: "http://davids-macbook-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/books/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/books/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    if (result.data) {
      this.book = result.data;
    }
  },
  data() {
    return {
      book: {
        id: "",
        title: "",
        author: "",
        date_written: "",
        date_read: "",
        url_to_review: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      api_url: ""
    };
  },
  setup() {},
  methods: {
    async updateBook() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Book from List ",
        message:
          "Are you sure you want to update " + 
          this.book.title,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const book = {
          ...this.book,
          updated_by: this.$store.state.created_by,
        };
        console.log("book.id: ", book.id)
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            title: this.book.title,
            author: this.book.author,
            date_written: this.book.date_written,
            date_read: this.book.date_read,
            url_to_review: this.book.url_to_review,
            notes: this.book.notes,
          }
        );
        if (result){
          alert("Book has been updated");
          this.$router.push({ name: "BookDetails", params: { id: book.id }, query: {success: "Book Updated Successfully"} });
        } else {
          console.log("Error")
          //this.$router.push({ name: "BookDetails", params: { id: book.id }, query: {success: "ERROR in processing update - change did NOT take place"} });
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
