<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Book Card</h1>
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
export default {
  name: 'BookDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    BookCard,
  },
  data() {
    return {
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
