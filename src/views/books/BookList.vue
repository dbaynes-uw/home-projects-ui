<script setup>
  import { useUserStore } from '@/stores/UserStore'
  import { useBookStore } from '@/stores/BookStore.js'
  import BookIndex from "@/components/books/BookIndex.vue";
  import BookCard from "@/components/books/BookCard.vue";
  import BookSearch from "@/components/books/BookSearch.vue";
  //import ChildComponent from "@/components/books/ChildComponent.vue";
  import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router'
  onMounted(() => {
    bookStore.fetchBooks()
  })
  const userStore = useUserStore()
  const bookStore = useBookStore()
  const requestIndexDetailFlag = ref(false)
  const searchResults = ref(null)
  const inputSearchText = ref('')
  //const receivedArray = ref([]);
  const filteredResults = ref([])
  /*
  const handleReturnArray = (array) => {
    receivedArray.value = array;
  }
  */
  //?defineExpose({searchColumns, returnArray})
  //const emit = defineEmits(['update:modelValue'])
  //const props = defineProps({
  //  modelValue: {
  //    type: Boolean,
  //    default: false
  //  }
  //})
  const handleReturnArray = (array) => {
    filteredResults.value = array;
  }

  const isEmptyResultsArray = computed(() => filteredResults.value.length === 0);
  const route = useRoute()
  const router = useRouter()
  function requestIndexDetail() {
    requestIndexDetailFlag.value = !requestIndexDetailFlag.value;
  }
  function editBook(book) {
    console.log("ROUTE: ", route)
    router.push({ name: 'BookEdit', params: { id: `${book.id}` } });
  }
</script>
<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Book List for {{ userStore.firstName }} - {{ bookStore.numberOfBooks }} Books Read</h2>
      <!--h2 id="status-message">
        u>Status: {{ $route.query.success }}</u>
      </h2-->
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
    <!--BookSearch :message="bookListMessage" :test="test"></BookSearch-->
    <!--ChildComponent
      ref="childRef"
      @array-returned="handleReturnArray" 
    /-->  
    <!--ChildComponent ref="childRef" @array-returned="handleArrayReturned" /-->  
    <br/>
    <BookSearch
      ref="childRef"
      @search-array-returned="handleReturnArray"
      :inputSearchText="inputSearchText"
      :bookStore="bookStore"
      >
    </BookSearch>
    <!--div class="auto-search-container">
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
    </div-->
  </div>
  filteredResults from Search: {{ filteredResults }}
  <br/>
  isEmptyResultsArray: {{ isEmptyResultsArray }}
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
      <br/>
      not isEmptyResultsArray
      <br/>
      requestIndexDetailFlag: {{ requestIndexDetailFlag }}
      <span v-if="requestIndexDetailFlag == false">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>Double click to Edit!</span>
        <br/>
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
        <BookIndex :books="filteredResults" />
      </span>
    </span>
  </div>
</template>
<style></style>
