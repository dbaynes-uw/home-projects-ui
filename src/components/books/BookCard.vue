<template>
  <div id="required-to-prevent-vue-warning">
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
    <div class="card">
      <p id="p-custom-left-u">{{ book.title}}</p>
      <ul>
        <li class="li-left">Author: <b>{{ book.author }}</b></li>
        <li class="li-left">Date Written:<br/><b>{{ formatFullYearDate(book.date_written) }}</b></li>
        <li class="li-left">Date Read:<br/><b>{{ formatFullYearDate(book.date_read) }}</b></li>
        <li class="li-left"><a :href="book.url_to_review" target="_blank">Link to Review</a></li>
        <li class="li-left">Notes:</li>
        <b class="li-left-none" v-for="(notes, idx) in splitList(book, this.splitLength)" :key="idx">{{ notes }}</b>
      </ul>
      <br/>
      <span class="fa-stack">
        <router-link :to="{ name: 'BookEdit', params: { id: `${book.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-if="currentUrl.includes('/books/')" class="fa-stack">
        <router-link :to="{ name: 'BookList' }">
          <i class="fa-solid fa-backward fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-else>
        <router-link :to="{ name: 'BookDetails', params: { id: `${book.id}` } }">
          <i class="fa-solid fa-eye fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteBook(book)" class="fas fa-trash-alt fa-stack-1x">
        </i>
      </span>
    </div>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import SplitStringService from "@/services/SplitStringService.js";
import { useRoute } from 'vue-router'
export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      default: () => ({})
    },
    origin: {
      type: String,
      default: '',
    }
  },
  components: {
    ConfirmDialogue,
  },
  setup() {
    const route = useRoute()
    return {
      currentUrl: route.fullPath
    }
  },
  data() {
    return {
      splitLength: 30,
    }
  },
  methods: {
    async deleteBook(book) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Book from List",
        message:
          "Are you sure you want to delete " +
          book.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteBook", book);
        this.statusMessage =
          "Book was Deleted for " +
          book.title +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "BookList" });
      }
    },
    //Services:
    splitList(bookData, splitLength) {
      return SplitStringService.splitList(bookData.notes, splitLength) 
    },
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDatejs(value);
    },
  }
}
</script>

<style scoped>
</style>
