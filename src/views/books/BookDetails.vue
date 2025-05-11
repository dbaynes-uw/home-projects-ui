<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Book Card</h1>
  <router-link :to="{ name: 'BookList' }">
    <b>Back to Book List</b>
  </router-link>
  <br/>
  <br/>
   <div class="card-display">
    <BookCard
      :key="book.id"
      :book="book"
      :origin="origin"
      class="card"
      @dblclick="editBook(book)"
      />
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import BookCard from "@/components/books/BookCard.vue";
import { ref } from 'vue';
const successMessage = ref('')
export default {
  name: 'BookDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    BookCard,
  },
  mounted() {
    this.sortedData = this.books;      
    successMessage.value = this.$route.query.success;
    this.statusMessage = successMessage.value
  },
  data() {
    return {
      statusMessage: '',
      updatedBook: null,
    };
  },
  methods: {
    editBook(book) {
      this.$router.push({ name: 'BookEdit', params: { id: `${book.id}` } });
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
  created() {
    this.$store.dispatch("fetchBook", this.id);
  },
  computed: {
    book() {
      return this.$store.state.book;
    },
    origin() {
      return "BookDetails"
    }
  },
};
</script>