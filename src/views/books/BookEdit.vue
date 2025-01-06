<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h2>Edit Book {{ book.title }}</h2>
  <br/>
  <div class="edit">
    <button id="link-as-button">
      <router-link  :to="{ name: 'BookList' }">Back to Book List</router-link>
    </button>
    <form class="add-form" @submit.prevent="updateBook">
      <div class="form-container">
        <v-text-field
          label="Title"
          v-model="book.title"
          required
        />
        <v-text-field
          label="Author"
          v-model="book.author"
          required
        />
        <p id="p-custom-left">Date Written: {{ formatStandardDate(book.date_written)}}</p>
        <v-text-field
          label="Click calendar at right to change Date Written"
          v-model="book.date_written"
          type="date"
        />
        <p id="p-custom-left">Date Read: {{ formatStandardDate(book.date_read)}}</p>
        <v-text-field
          label="Click calendar at right to change Date Read"
          v-model="book.date_read"
          type="date"
        />
        <v-text-field
          label="URL to Review"
          v-model="book.url_to_review"
        />        
        <v-textarea
          label="Notes"
          v-model="book.notes"
          rows="3"
          cols="40"
        />
        <br/>
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
import DateFormatService from "@/services/DateFormatService.js";
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
    //const result = await axios.get(this.api_url + +this.$route.params.id);
    //if (result.data) {
    //  this.book = result.data;
    //}
  },
  created() {
    this.$store.dispatch("fetchBook", this.id);
  },
  computed: {
    book() {
      return this.$store.state.book;
    },
  },

  data() {
    return {
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
          alert("Book has been updated for " + book.title);
          this.$router.push({ name: "BookDetails", params: { id: book.id }, query: {success: "Book Updated Successfully"} });
        } else {
          console.log("Error")
          //this.$router.push({ name: "BookDetails", params: { id: book.id }, query: {success: "ERROR in processing update - change did NOT take place"} });
        }
      }
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
};
</script>
<style></style>