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
      <div class="search-row">
        <input
          type="text"
          class="np-input-search"
          v-model="inputSearchText"
          placeholder="Search"
          autocomplete="off"
          @keyup="searchColumns"
        />
        <button
          v-if="inputSearchText"
          type="button"
          class="btn btn-outline-secondary btn-sm clear-btn"
          @click="resetSearch"
        >
          <i class="fas fa-times"></i>
          Clear
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.np-input-search {
  width: 100%;
  min-height: 38px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
}

.np-input-search:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.15);
}

.clear-btn {
  white-space: nowrap;
}
</style>
