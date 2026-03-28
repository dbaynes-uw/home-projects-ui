<template>
  <div class="list-view-container">

    <!-- BREADCRUMB -->
    <div class="breadcrumb-nav">
      <router-link :to="{ name: 'home' }" class="breadcrumb-link">
        <i class="fas fa-home"></i> Home
      </router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-current">Books</span>
    </div>

    <!-- HEADER -->
    <BaseCard class="header-card">
      <template #header>
        <div class="header-content">
          <div class="title-section">
            <h2>
              <i class="fas fa-book animated-icon"></i>
              {{ firstName }}'s Books
            </h2>
          </div>
          <div class="controls-section">
            <BaseButton variant="success" icon="plus" @click="goToCreate">
              Add Book
            </BaseButton>
            <div class="view-toggle">
              <button
                :class="['view-btn', { active: !requestIndexDetailFlag }]"
                @click="requestIndexDetailFlag = false"
              >
                <i class="fas fa-th-large"></i>
                <span>Cards</span>
              </button>
              <button
                :class="['view-btn', { active: requestIndexDetailFlag }]"
                @click="requestIndexDetailFlag = true"
              >
                <i class="fas fa-list"></i>
                <span>Index</span>
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- SEARCH -->
      <BookSearch
        ref="childRef"
        @search-array-returned="handleReturnArray"
        :inputSearchText="inputSearchText"
        :books="books"
      />

      <!-- STATS -->
      <div class="stats-row">
        <div class="stat-card stat-card-primary">
          <div class="stat-icon"><i class="fas fa-book"></i></div>
          <div class="stat-value">{{ numberOfBooks }}</div>
          <div class="stat-label">Total Books</div>
        </div>
        <div class="stat-card stat-card-success">
          <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
          <div class="stat-value">{{ booksReadThisYear }}</div>
          <div class="stat-label">Read This Year</div>
        </div>
        <div class="stat-card stat-card-info">
          <div class="stat-icon"><i class="fas fa-user-edit"></i></div>
          <div class="stat-value">{{ uniqueAuthors }}</div>
          <div class="stat-label">Authors</div>
        </div>
      </div>
    </BaseCard>

    <!-- LOADING -->
    <div v-if="isLoading" class="loading-content">
      <div class="spinner"></div>
      <p>Loading books...</p>
    </div>

    <!-- BOOKS -->
    <div v-else class="books-section">
      <div v-if="displayBooks.length === 0" class="empty-content">
        <i class="fas fa-book-open fa-3x empty-icon"></i>
        <p>No books yet — add your first one!</p>
        <BaseButton variant="primary" icon="plus" @click="goToCreate">Add Book</BaseButton>
      </div>
      <template v-else-if="!requestIndexDetailFlag">
        <p class="hint-text">Double-click a card to edit</p>
        <div class="books-grid">
          <BookCard
            v-for="book in displayBooks"
            :key="book.id"
            :book="book"
            @dblclick="editBook(book)"
          />
        </div>
      </template>
      <BookIndex v-else :books="displayBooks" />
    </div>

  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '@/stores/books/BookStore.js'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import dayjs from 'dayjs'

import BookIndex from "@/components/books/BookIndex.vue"
import BookCard from "@/components/books/BookCard.vue"
import BookSearch from "@/components/books/BookSearch.vue"
import ConfirmDialogue from "@/components/ConfirmDialogue.vue"

const store = useStore()
const bookStore = useBookStore()
const router = useRouter()

const firstName = computed(() => {
  const user = store.state.user
  const email = user?.resource_owner?.email ?? user?.email ?? ''
  return email.split('@')[0]
})

const books = computed(() => bookStore.allBooks)
const numberOfBooks = computed(() => bookStore.numberOfBooks)
const isLoading = computed(() => bookStore.isLoading)

const booksReadThisYear = computed(() => {
  const year = dayjs().year()
  return books.value.filter(b => b.date_read && dayjs(b.date_read).year() === year).length
})

const uniqueAuthors = computed(() =>
  new Set(books.value.map(b => b.author).filter(Boolean)).size
)

onMounted(() => {
  bookStore.fetchBooks()
})

const requestIndexDetailFlag = ref(false)
const inputSearchText = ref('')
const filteredResults = ref([])

const displayBooks = computed(() =>
  filteredResults.value.length > 0 ? filteredResults.value : books.value
)

const handleReturnArray = (array) => {
  filteredResults.value = array
}

function editBook(book) {
  router.push({ name: 'BookEdit', params: { id: `${book.id}` } })
}

function goToCreate() {
  router.push({ name: 'BookCreate' })
}
</script>

<style scoped>
.books-section {
  margin-top: 1.5rem;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  margin-top: 0.75rem;
}

.hint-text {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.5rem;
}

.loading-content {
  text-align: center;
  padding: 4rem 1.25rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(102, 126, 234, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-content {
  text-align: center;
  padding: 4rem 1.25rem;
}

.empty-icon {
  color: #cbd5e0;
  margin-bottom: 1rem;
  display: block;
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>