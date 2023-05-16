<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
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
      <td>
        <span v-if="this.onlineStatus">
          <span class="fa-stack fa-table-stack">
            <i
              class="fa-solid fa-pen-to-square fa-stack-1x fa-sm"
              id="book-icon-edit"
            >
            </i>
            <router-link
              :to="{ name: 'BookEdit', params: { id: `${result.id}` } }"
            >
            </router-link>
            &nbsp;
            <i class="fa-regular fa-eye fa-sm" id="book-icon-eye"></i>
            <router-link
              :to="{
                name: 'BookDetails',
                params: { id: `${result.id}` },
              }"
            >
            </router-link>
            &nbsp;
            <i
              @click="deleteBook(result)"
              class="fas fa-trash-alt fa-stack-1x"
              id="book-icon-delete"
            >
            </i>
          </span>
        </span>
        <span v-else>
          <router-link
            :to="{ name: 'BookDetails', params: { id: `${result.id}` } }"
          >
            View |
          </router-link>
          <router-link
            :to="{ name: 'BookEdit', params: { id: `${result.id}` } }"
          >
            Edit |
          </router-link>
          <span class="ok-btn" @click="deleteBook(result)"><u>Del</u></span>
        </span>
      </td>
    </tr>
  </v-table>
  <br />
  <b>Online Status: {{ this.onlineStatus }}</b>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "BookSearchResults",
  props: ["filteredResult"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      inputSearchText: "",
      onlineStatus: navigator.onLine,
    };
  },
  methods: {
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {
      this.sortedData = this.filteredResult;
      if (this.sortedbyASC) {
        this.sortedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.sortedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDate(value);
    },
  },
};
</script>
