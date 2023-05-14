<template>
  <v-table density="compact">
    <tr>
      <th @click="sortList('title')">Title</th>
      <th @click="sortList('author')">Author</th>
      <th @click="sortList('date_written')">Date Written</th>
      <th>URL to Review</th>
      <th>Notes</th>
      <th style="text-align: right">Actions</th>
    </tr>
    <tr v-for="(result, resultIndex) in filteredResult" :key="resultIndex">
      <td>{{ result.title }}</td>
      <td>{{ result.author }}</td>
      <td>{{ formatFullYearDate(result.date_written) }}</td>
      <td>
        <a :href="result.url_to_review" target="_blank">Review</a>
      </td>
      <td>{{ result.notes }}</td>
      <td>Action</td>
    </tr>
  </v-table>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "BookSearchResults",
  data() {
    return {
      inputSearchText: "",
      filteredResult: [],
    };
  },
  methods: {
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDate(value);
    },
    searchTitles() {
      console.log("SEARCH TITLES!!!");
      this.filteredResult = [];
      this.titleDetails = null;
      if (
        this.inputSearchText == null ||
        (this.inputSearchText != null && this.inputSearchText.length === 0)
      ) {
        console.log("Search Text is Null");
        this.filteredResult = [];
        this.titleDetails = null;
      } else {
        console.log("Search Text is NOT Null");
        console.log("this.books.length: ", this.books.length);
        console.log(
          "this.inputSearchText.length: ",
          this.inputSearchText.length
        );
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
            console.log("SearchHasTitle: ", searchHasTitle);
            const searchHasAuthor =
              book.author &&
              book.author
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            console.log("SearchHasAuthor: ", searchHasAuthor);
            if (searchHasTitle || searchHasAuthor) {
              this.filteredResult.push(book);
              console.log("this.filteredResult.push(book): ", book);
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
  },
};
</script>
