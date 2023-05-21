<template>
  <div class="div-frame">
    <h2>Book List</h2>
    <h2 id="status-message">
      <u>{{ this.statusMessage }}</u>
    </h2>
    <h2>
      <router-link :to="{ name: 'BookCreate' }">Add Book</router-link>
    </h2>
    <br />
    <div style="width: 100%">
      <div class="auto-search-container">
        <v-text-field
          clearable
          clear-icon="mdi-close"
          @click:clear="showIndex"
          type="text"
          class="np-input-search"
          v-model="inputSearchText"
          placeholder="Search"
          autocomplete="off"
          v-on:keyup="searchColumns"
        />
      </div>
    </div>
    <div class="book-list">
      <span v-if="filteredResults.length == 0">
        <BookIndex :books="books" />
      </span>
      <span v-if="filteredResults.length > 0">
        <BookSearchResults :filteredResults="filteredResults" />
      </span>
    </div>
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
import BookIndex from "@/components/books/BookIndex.vue";
import BookSearchResults from "@/components/books/BookSearchResults.vue";
export default {
  name: "BookList",
  props: ["filteredResults[]"],
  components: {
    BookIndex,
    BookSearchResults,
  },
  data() {
    return {
      inputSearchText: "",
      filteredResults: [],
      columnDetails: null,
      sortedData: [],
      sortedbyASC: false,
      description: null,
      frequency: null,
      completed: 0,
      statusMessage: "",
    };
  },
  mounted() {
    this.sortedData = this.books;
  },
  created() {
    this.$store.dispatch("fetchBooks");
    this.sortedData = this.books;
  },
  computed: {
    books() {
      return this.$store.state.books;
    },
  },
  methods: {
    showIndex() {
      this.filteredResults = [];
    },
    searchColumns() {
      this.filteredResults = [];
      this.columnDetails = null;
      if (
        this.inputSearchText == null ||
        (this.inputSearchText != null && this.inputSearchText.length === 0)
      ) {
        this.filteredResults = [];
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
              book.title
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasAuthor =
              book.author &&
              book.author
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasTitle || searchHasAuthor) {
              this.filteredResults.push(book);
            }
          });
        }
      }
    },
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
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
tr:nth-child(odd) {
  background-color: #41b88352;
  border: none !important;
}
</style>
