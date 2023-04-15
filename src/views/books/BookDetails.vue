<template>
  <div>
    <h3>Book Details</h3>
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <br />
    <div v-if="book" class="event" id="center-align">
      <h1>
        <b>{{ book.title }}</b>
      </h1>
      <ul class="ul-left">
        <li>
          <b>{{ book.author }}</b>
        </li>
        <li v-if="book.date_written">
          Date Book Written:
          <b>{{ formatStandardDate(book.date_written) }}</b>
        </li>
        <li v-if="book.url_to_review">
          URL to Review:
          <a :href="book.url_to_review" target="_blank">Click</a>
        </li>
        <li>
          Notes:
          <b>{{ book.notes }}</b>
        </li>
        <li>
          Date Created:
          <b>{{ formatStandardDate(book.created_at) }}</b>
        </li>
      </ul>
      <br />
      <router-link :to="{ name: 'BookList' }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
      <span class="fa-stack">
        <router-link :to="{ name: 'BookEdit', params: { id: `${book.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteBook(book)" class="fas fa-trash-alt fa-stack-1x"></i>
      </span>
      <br />
      <router-link :to="{ name: 'BookList' }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  props: ["id"],
  data() {
    return {
      updatedBook: null,
    };
  },
  methods: {
    deleteBook(book) {
      this.$store.dispatch("deleteBook", book);
      alert("Book was Deleted for " + book.head_name);
      this.$router.push({ name: "BookList" });
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
  },
  created() {
    this.$store.dispatch("fetchBook", this.id);
  },
  computed: {
    book() {
      return this.$store.state.book;
    },
  },
};
</script>
<style scoped>
#align-right {
  text-align: center;
}
.right-align {
  text-align: right;
}
</style>
