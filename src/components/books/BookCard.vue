<template>
  <div @dblclick="navigateToDetails">
  <BaseCard class="book-card">
    <template #header>
      <div class="book-card-header">
        <h3 class="book-title">
          <router-link
            :to="{ name: 'BookDetails', params: { id: `${book.id}` } }"
            class="title-link"
          >
            {{ book.title }}
          </router-link>
        </h3>
      </div>
    </template>

    <div class="book-details">
      <div v-if="book.author" class="detail-row">
        <span class="detail-label">Author:</span>
        <span class="detail-value">{{ book.author }}</span>
      </div>
      <div v-if="book.date_written" class="detail-row">
        <span class="detail-label">Written:</span>
        <span class="detail-value">{{ formatFullYearDate(book.date_written) }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date Read:</span>
        <span class="detail-value">{{ book.date_read ? formatFullYearDate(book.date_read) : '—' }}</span>
      </div>
      <div v-if="book.url_to_review" class="detail-row">
        <span class="detail-label">Review:</span>
        <a :href="book.url_to_review" target="_blank" class="detail-link">Link to Review</a>
      </div>
      <div v-if="book.notes" class="detail-row notes-row">
        <span class="detail-label">Notes:</span>
        <div class="detail-value notes-content">
          <span v-for="(note, idx) in splitNotes" :key="idx">{{ note }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="book-footer">
        <span :class="['status-badge', statusClass]">{{ statusLabel }}</span>
        <div class="book-actions">
          <router-link :to="{ name: 'BookEdit', params: { id: `${book.id}` } }" class="action-icon">
            <i class="fa-solid fa-pen-to-square"></i>
          </router-link>
          <router-link
            v-if="currentUrl.includes('/books/')"
            :to="{ name: 'BookList' }"
            class="action-icon"
          >
            <i class="fa-solid fa-backward"></i>
          </router-link>
          <router-link
            v-else
            :to="{ name: 'BookDetails', params: { id: `${book.id}` } }"
            class="action-icon"
          >
            <i class="fa-solid fa-eye"></i>
          </router-link>
          <span class="action-icon danger" @click="deleteBook(book)">
            <i class="fas fa-trash-alt"></i>
          </span>
        </div>
      </div>
    </template>
  </BaseCard>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import DateFormatService from '@/services/DateFormatService.js'
import SplitStringService from '@/services/SplitStringService.js'
import { useBookStore } from '@/stores/books/BookStore.js'

const props = defineProps({
  book: {
    type: Object,
    default: () => ({})
  },
  origin: {
    type: String,
    default: '',
  }
})

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()
const confirmDialogue = ref(null)
const splitLength = 30

const currentUrl = computed(() => route.fullPath)
const splitNotes = computed(() => SplitStringService.splitList(props.book.notes, splitLength))
const statusLabel = computed(() => props.book.date_read ? 'Read' : 'Unread')
const statusClass = computed(() => props.book.date_read ? 'status-read' : 'status-unread')

function navigateToDetails() {
  router.push({ name: 'BookDetails', params: { id: props.book.id } })
}

async function deleteBook(book) {
  const ok = await confirmDialogue.value.show({
    title: 'Delete Book from List',
    message: `Are you sure you want to delete "${book.title}"? It cannot be undone.`,
    okButton: 'Delete',
  })
  if (ok) {
    await bookStore.deleteBook(book)
    router.push({ name: 'BookList' })
  }
}

function formatFullYearDate(value) {
  return DateFormatService.formatFullYearDatejs(value)
}
</script>

<style scoped>
.book-card { font-size: 1rem; cursor: pointer; }

.book-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.book-title { margin: 0; font-size: 1.1rem; font-weight: 700; }

.title-link {
  color: #667eea;
  text-decoration: none;
  transition: opacity 0.2s;
}
.title-link:hover { opacity: 0.8; }

.book-details {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin: 0.5rem 0;
}

.detail-row {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.detail-label {
  font-weight: 700;
  color: #718096;
  min-width: 80px;
  flex-shrink: 0;
  font-size: 0.875rem;
}

.detail-value {
  color: #2d3748;
  flex: 1;
  font-size: 0.9rem;
}

.detail-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}
.detail-link:hover { text-decoration: underline; }

.notes-row { align-items: flex-start; }
.notes-content {
  display: flex;
  flex-direction: column;
  white-space: pre-wrap;
  line-height: 1.5;
  color: #4a5568;
  font-size: 0.875rem;
}

.book-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.action-icon {
  color: #667eea;
  text-decoration: none;
  font-size: 1rem;
  transition: opacity 0.2s;
  cursor: pointer;
}
.action-icon:hover { opacity: 0.7; }
.action-icon.danger { color: #e53e3e; }

.status-badge {
  padding: 0.2rem 0.65rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.status-read { background: rgba(72, 187, 120, 0.15); color: #276749; }
.status-unread { background: rgba(102, 126, 234, 0.12); color: #434190; }

@media (max-width: 480px) {
  .detail-row { flex-direction: column; gap: 0.2rem; }
  .detail-label { min-width: auto; }
  .book-footer { flex-direction: column; gap: 0.5rem; align-items: stretch; }
}
</style>
