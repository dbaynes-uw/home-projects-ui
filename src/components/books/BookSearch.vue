<template>
  <div style="width: 100%">
    <div class="auto-search-container">
      <v-text-field
        clearable
        clear-icon="mdi-close"
        @click:clear="resetSearch"
        type="text"
        class="np-input-search"
        v-model="searchText"
        placeholder="Search"
        autocomplete="off"
        @keyup="searchColumns"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useBookStore } from '@/stores/books/BookStore.js'

const bookStore = useBookStore()

const props = defineProps({
  inputSearchText: String,
  books: Array
})

const emit = defineEmits(['search-array-returned'])

const searchText = ref(props.inputSearchText || '')
const filteredBooks = ref([])

// Props take priority; fall back to store if parent doesn't pass books
const allBooks = computed(() => props.books?.length ? props.books : bookStore.allBooks)

const performSearch = () => {
  const booksToSearch = allBooks.value
  
  if (!searchText.value || searchText.value.length < 2) {
    filteredBooks.value = booksToSearch
  } else {
    const searchLower = searchText.value.toLowerCase()
    filteredBooks.value = booksToSearch.filter(book => {
      return (
        (book.title && book.title.toLowerCase().includes(searchLower)) ||
        (book.author && book.author.toLowerCase().includes(searchLower)) ||
        (book.description && book.description.toLowerCase().includes(searchLower))
      )
    })
  }
  
  emit('search-array-returned', filteredBooks.value)
}

const searchColumns = () => {
  performSearch()
}

const resetSearch = () => {
  searchText.value = ''
  performSearch()
}

watch(searchText, performSearch)

watch(() => props.inputSearchText, (newValue) => {
  searchText.value = newValue || ''
})

performSearch()
</script>
