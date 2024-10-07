<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Book Card</h1>
  {{ this.statusMessage }}
  <div class="card-display">
    <BookCard
      :key="book.id"
      :book="book"
      :origin="origin"
      class="card"
      @dblclick="onDoubleClick(book)"
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
    console.log("MOUNTED successMessage: ", successMessage.value )
    this.statusMessage = successMessage.value
    console.log("StatusMessage: ", this.statusMessage )
  },
  data() {
    return {
      statusMessage: '',
      updatedBook: null,
    };
  },
  methods: {
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
<style scoped>
.event {
  font-size: 1.5rem;
}
#align-right {
  text-align: center;
}
body {
  font-size: 1.6rem;
}
.right-align {
  text-align: right;
}
</style>
