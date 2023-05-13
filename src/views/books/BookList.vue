<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h2>Book List</h2>
    <h2 id="status-message">
      <u>{{ this.statusMessage }}</u>
    </h2>
    <h2>
      <router-link :to="{ name: 'BookCreate' }">Add Book</router-link>
    </h2>
    <br />
    <div class="book-list">
      <!--table class="table-index-style"-->
      <v-table density="compact">
        <tr>
          <th @click="sortList('title')">Title</th>
          <th @click="sortList('author')">Author</th>
          <th @click="sortList('date_written')">Date Written</th>
          <th>URL to Review</th>
          <th>Notes</th>
          <th style="text-align: right">Actions</th>
        </tr>
        <tr v-for="book in books" :key="book.id" :book="book">
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ formatFullYearDate(book.date_written) }}</td>
          <td>
            <a :href="book.url_to_review" target="_blank">Review</a>
          </td>
          <td>{{ book.notes }}</td>
          <td style="padding-left: 0">
            <span v-if="this.onlineStatus">
              <span class="fa-stack" style="left: -0.5rem !important">
                <router-link
                  :to="{ name: 'BookEdit', params: { id: `${book.id}` } }"
                >
                  <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
                </router-link>
                <span class="fa-stack fa-table-stack">
                  <router-link
                    :to="{ name: 'BookDetails', params: { id: `${book.id}` } }"
                  >
                    <i class="fa fa-eye" style="top: 0.4rem; font-size: 18px">
                    </i>
                  </router-link>
                </span>
                <span
                  class="fa-table-stack"
                  style="position: relative; top: 0.5rem; left: 2.3rem"
                >
                  <i
                    @click="deleteBook(book)"
                    class="fas fa-trash-alt fa-stack-1x"
                  >
                  </i>
                </span>
              </span>
            </span>
            <span v-else>
              <router-link
                :to="{ name: 'BookDetails', params: { id: `${book.id}` } }"
              >
                View |
              </router-link>
              <router-link
                :to="{ name: 'BookEdit', params: { id: `${book.id}` } }"
              >
                Edit |
              </router-link>
              <span class="ok-btn" @click="deleteBook(book)"><u>Del</u></span>
            </span>
          </td>
        </tr>
        <!--/table-->
      </v-table>
      Online Status: {{ this.onlineStatus }}
    </div>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "BookList",
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      sortedData: [],
      sortedbyASC: false,
      description: null,
      frequency: null,
      completed: 0,
      statusMessage: "",
      onlineStatus: navigator.onLine,
    };
  },
  mounted() {
    this.sortedData = this.books;
    console.log("Mounted - this.sortedData: ", this.sortedData);
  },
  created() {
    console.log("Created Store Dispatch - fetchBooks. ");
    this.$store.dispatch("fetchBooks");
    this.sortedData = this.books;
    console.log("Created - this.sortedData: ", this.sortedData);
  },
  computed: {
    books() {
      console.log("Computed Store Dispatch - fetchBooks. ");
      return this.$store.state.books;
    },
  },
  methods: {
    sortList(sortBy) {
      this.sortedData = this.books;
      console.log("SORTLIST - sortedData: ", this.sortedData);
      console.log("SORTLIST: ", sortBy);
      console.log("SORTLIST - sortedbyASC: ", this.sortedbyASC);
      if (this.sortedbyASC) {
        this.sortedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.sortedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
    //isOffline() {
    //  this.isOnline = false;
    //  console.log("isOffline - this.isOnline = ", this.isOnline);
    //},
    //isOnline() {
    //  this.isOnline = true;
    //  console.log("isOnline - this.isOnline = ", this.isOnline);
    //},
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
      }
    },
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDate(value);
    },
  },
};
</script>
<!--style scoped>
.table-index-style {
  width: 100%;
  border-collapse: collapse;
}
th {
  background-color: #7ba8bd;
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
</style-->
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

th:hover {
  cursor: pointer;
  background: rgb(229, 255, 211);
}

tr:nth-child(even) {
  background-color: #f3f3f3;
}
</style>
