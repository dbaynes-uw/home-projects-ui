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
<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/books/BookSearch.vue -->
<script setup>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'

const store = useStore()

// ✅ PROPS (READ-ONLY)
const props = defineProps({
  inputSearchText: String,
  books: Array
})

const emit = defineEmits(['search-array-returned'])

// ✅ LOCAL REACTIVE VARIABLE (NOT PROP!)
const searchText = ref(props.inputSearchText || '')
const filteredBooks = ref([])

// ✅ GET BOOKS FROM VUEX OR PROPS
const books = computed(() => props.books || store.state.books || [])

// ✅ SEARCH LOGIC
const performSearch = () => {
  const booksToSearch = books.value
  
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

// ✅ SEARCH FUNCTION FOR KEYUP EVENT
const searchColumns = () => {
  performSearch()
}

// ✅ RESET SEARCH FUNCTION
const resetSearch = () => {
  searchText.value = ''
  performSearch()
}

// ✅ WATCH FOR SEARCH TEXT CHANGES
watch(searchText, performSearch)

// ✅ WATCH FOR PROP CHANGES
watch(() => props.inputSearchText, (newValue) => {
  searchText.value = newValue || ''
})

// ✅ INITIAL SEARCH
performSearch()
</script>
