<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="book-list">
    <v-table density="compact">
      <tr>
        <th @click="sortList('title')">Title</th>
        <th @click="sortList('author')">Author</th>
        <th @click="sortList('date_written')">Date Written</th>
        <th @click="sortList('date_read')">Date Read</th>
        <th>Link</th>
        <th>Notes</th>
        <th style="text-align: right">Actions</th>
      </tr>
      <tr v-for="(result, resultIndex) in filteredResults" :key="resultIndex">
        <td>{{ result.title }}</td>
        <td>{{ result.author }}</td>
        <td>{{ formatStandardDate(result.date_written) }}</td>
        <td>{{ formatStandardDate(result.date_read) }}</td>
        <td>
          <a :href="result.url_to_review" target="_blank">Map</a>
        </td>
        <td>{{ result.notes }}</td>
        <td style="padding-left: 0">
          <span class="fa-stack">
            <router-link
              :to="{ name: 'BookEdit', params: { id: `${result.id}` } }"
            >
              <i
                class="fa-solid fa-pen-to-square fa-stack-1x"
                id="book-icon-edit"
              ></i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'BookDetails', params: { id: `${result.id}` } }"
              >
                <i class="fa fa-eye" id="action-eye-icon"></i>
              </router-link>
            </span>
            <span class="fa-table-stack" id="action-delete-icon">
              <i
                @click="deleteBook(result)"
                class="fas fa-trash-alt fa-stack-1x"
              >
              </i>
            </span>
          </span>
        </td>
      </tr>
    </v-table>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "BookSearchResults",
  props: ["filteredResults"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      description: null,
      frequency: null,
      completed: 0,
      statusMessage: "",
    };
  },
  methods: {
    searchColumns() {
      this.filteredBooks = [];
      this.columnDetails = null;
      if (
        this.inputSearchText == null ||
        (this.inputSearchText != null && this.inputSearchText.length === 0)
      ) {
        this.filteredBooks = [];
        this.columnDetails = null;
      } else {
        if (
          this.books &&
          this.books.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.books.forEach((book) => {
            const searchHasTitle =
              book.title &&
              book.author
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasAuthor =
            book.title &&
              book.author
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasTitle || searchHasAuthor) {
              this.filteredBooks.push(book);
            }
          });
        }
      }
    },
    showCharacterDetails(book) {
      this.characterDetails = book;
    },
    sortList(sortBy) {
      this.sortedData = this.books;
      if (this.sortedbyASC) {
        this.sortedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.sortedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
    async deleteBookl(book) {
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
          "! Page will refresh in 2 seconds";
        setTimeout(() => location.reload(), 2500);
      }
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
};
</script>
<style scoped>
#action-eye-icon {
  top: 0.4rem;
  font-size: 18px;
}
#action-delete-icon {
  position: relative;
  top: 0.5rem;
  left: 2.3rem;
}
.table-index-style {
  width: 100%;
  border-collapse: collapse;
}
th {
  background-color: #7ba8bd;
  /*background-color: #41b883;*/
  text-align: left;
  padding-left: 1rem;
  padding-right: 1rem;
}
tr {
  line-height: 1.6 !important;
  border: none;
}
tr:nth-child(odd) {
  background-color: #41b88352;
  border: none !important;
}
td {
  padding-left: 1rem;
  padding-right: 1rem;
}
.eventAssigned {
  background: #e8f7f0;
}
.fa-table-stack {
  position: relative;
  left: 2rem;
}
i {
  bottom: 0px;
  color: gray;
}
tr.is-complete {
  background: #35495e;
  color: #fff;
}
#status-message {
  text-align: center;
  color: navy;
}
</style>
