<script setup>
  import { useBookStore } from '@/stores/BookStore';
  import { ref } from 'vue';
  /* const */
  const emit = defineEmits(['searchArrayReturned'])
  const filteredResults = ref([])
  const inputSearchText = ref('')
  const searchResults = ref(null)
  const columnDetails =  ref(Object)
  const bookStore = useBookStore()
   /* functions */
  function resetSearch() {
    filteredResults.value = [];
    emit('searchArrayReturned', filteredResults.value)
    return
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
          if (searchHasTitle || searchHasAuthor ) {
            filteredResults.value.push(book);
          }
          if (filteredResults.value.length > 0) {
            searchResults.value = true;
            emit('searchArrayReturned', filteredResults.value)
          } else {
            searchResults.value = false;
          }
        });
      }
    }
  }
</script>
<template>
  <div style="width: 100%">
    <div class="auto-search-container">
      <v-text-field
        clearable
        clear-icon="fas fa-close"
        @click:clear="resetSearch"
        type="text"
        class="np-input-search"
        v-model="inputSearchText"
        placeholder="Search"
        autocomplete="off"
        v-on:keyup="searchColumns"
      />
    </div>
  </div>
</template>
