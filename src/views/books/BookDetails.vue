<template>
  <div class="list-view-container">
    <div class="breadcrumb-nav">
      <router-link :to="{ name: 'home' }" class="breadcrumb-link">
        <i class="fas fa-home"></i> Home
      </router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <router-link :to="{ name: 'BookList' }" class="breadcrumb-link">Books</router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-current">{{ book?.title || 'Book Details' }}</span>
    </div>

    <BaseCard class="header-card">
      <template #header>
        <div class="details-header-content">
          <h2><i class="fas fa-book"></i> Book Details</h2>
          <BaseButton variant="primary" size="small" icon="edit" @click="editBook(book)">
            Edit
          </BaseButton>
        </div>
      </template>
    </BaseCard>

    <div v-if="isLoading" class="loading-content">
      <div class="spinner"></div>
      <p>Loading book...</p>
    </div>
    <div v-else-if="book" class="book-card-display">
      <BookCard
        :key="book.id"
        :book="book"
        :origin="origin"
        @dblclick="editBook(book)"
      />
    </div>
    <div v-else class="empty-content">
      <p>Book not found.</p>
    </div>
  </div>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import BookCard from '@/components/books/BookCard.vue'
import { useBookStore } from '@/stores/books/BookStore.js'

const props = defineProps(['id'])
const router = useRouter()
const bookStore = useBookStore()
const confirmDialogue = ref(null)

const book = computed(() => bookStore.currentBook)
const isLoading = computed(() => bookStore.isLoading)
const origin = 'BookDetails'

onMounted(() => {
  bookStore.fetchBook(props.id)
})

function editBook(book) {
  router.push({ name: 'BookEdit', params: { id: `${book.id}` } })
}
</script>