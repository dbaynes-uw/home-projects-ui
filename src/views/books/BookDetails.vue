<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h1>Book Details</h1>
    <br />
    <div v-if="book" class="event" id="center-align">
      <h3>
        <b>{{ book.title }}</b>
      </h3>
      <ul class="ul-left">
        <li>
          Author:
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
          Date Entered:
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
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      updatedBook: null,
    };
  },
  methods: {
    async deleteBook(book) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Book",
        message:
          "Are you sure you want to delete " +
          book.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteBook", book);
        alert("Book was Deleted for " + book.title);
        this.$router.push({ name: "BookList" });
      }
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
