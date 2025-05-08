<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Book List for {{ userStore.firstName }} - {{ bookStore.numberOfBooks }} Books Read</h2>
      <h2 id="status-message">
        <u>{{ this.$route.query.success }}</u>
      </h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'BookCreate' }">Add Book</router-link>
        </button> 
      </li>
      <li>
        <button id="button-as-link" @click="requestIndexDetail">
          <u>Card or Index View</u>
        </button>
      </li>
    </ul> 
    <br/>
  </v-card>
  <br/>
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
  <br>
  <br>
  <div class="book-list">
    <span v-if="isEmptyResultsArray">
      <span v-if="searchResults == false">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
      <span v-else>
        <span v-if="requestIndexDetailFlag == false">
          <h3 id="h3-left">&nbsp;&nbsp;Total: {{ bookStore.books.length }}</h3>
          <span class="h3-left-total-child">Double click Item Below to Edit</span>
          <div class="cards">
            <BookCard
              v-for="book in bookStore.books"
              :key="book.id"
              :book="book"
              class="card"
              @dblclick="editBook(book)"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <BookIndex :books="bookStore.books" />
        </span>
      </span>
    </span>
    <span v-if="!isEmptyResultsArray">
      <span v-if="requestIndexDetailFlag == false">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>Double click to Edit</span>
        <div class="cards">
          <BookCard
            v-for="book in filteredResults"
            :key="book.id"
            :book="book"
            @dblclick="editBook(book)"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <BookIndex :books="filteredResults.value" />
      </span>
    </span>
  </div>
</template>
<script>
import { useUserStore } from '@/stores/UserStore'
import { useBookStore } from '@/stores/BookStore.js'
import BookIndex from "@/components/books/BookIndex.vue";
import BookCard from "@/components/books/BookCard.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
//Composition API Imports:
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
//
export default {
  name: "BookList",
  setup() {
    const userStore = useUserStore()
    const bookStore = useBookStore()
    const requestIndexDetailFlag = ref(false)
    /*    */
    const searchResults = ref(null)
    const inputSearchText = ref('')
    const filteredResults = ref([])
    const isEmptyResultsArray = computed(() => filteredResults.value.length === 0);
    const columnDetails =  ref(null)

    const route = useRoute()
    const router = useRouter()

    function requestIndexDetail() {
      requestIndexDetailFlag.value = !requestIndexDetailFlag.value;
    }
    function editBook(book) {
      console.log("ROUTE: ", route)
      console.log("ROUTE FULLPATH: ", route.fullPath)
      console.log("ROUTE Name: ", route.name)
      console.log("ROUTE PATH: ", route.path)
      router.push({ name: 'BookEdit', params: { id: `${book.id}` } });
    }
    /**/
    function showIndex() {
      filteredResults.value = [];
    }
    function searchColumns() {
      searchResults.value = true;
      filteredResults.value = [];
      columnDetails.value = null;
      if (
        inputSearchText.value == null ||
        (inputSearchText.value != null && inputSearchText.value.length === 0)
      ) {
        filteredResults.value = [];
        columnDetails.value = null;
      } else {
        if (
          bookStore.books &&
          bookStore.books.length > 0 &&
          inputSearchText.value.length >= 2
        ) {
          bookStore.books.forEach((book) => {
            const searchHasTitle =
              book.title &&
              book.title
                .toLowerCase()
                .includes(inputSearchText.value.toLowerCase()); 
            const searchHasAuthor =
              book.author &&
              book.author
                .toLowerCase()
                .includes(inputSearchText.value.toLowerCase());
            //const searchHasDateRead = 
            //  book.date_read
            //  .includes(inputSearchText.value)
            
            if (searchHasTitle || searchHasAuthor ) {
              filteredResults.value.push(book);
            }
            if (filteredResults.value.length > 0) {
              searchResults.value = true;
              return filteredResults.value
            } else {
              searchResults.value = false;
            }
          });
        }
      }
    }
    /**/
    return {
      userStore,
      bookStore,
      requestIndexDetail,
      requestIndexDetailFlag,
      editBook,
      showIndex,
      searchColumns,
      searchResults,
      inputSearchText,
      filteredResults,
      isEmptyResultsArray,
      columnDetails: null,
    }
  },
  components: {
    BookIndex,
    BookCard,
    ConfirmDialogue
  },
  data() {
    return {};
  },
  mounted() {
    this.sortedData = this.bookStore.fetchBooks()
  },
  created() {
    this.bookStore.fetchBooks()
    this.sortedData = this.bookStore.fetchBooks()
  },
  methods: {},
};
</script>
<style></style>
