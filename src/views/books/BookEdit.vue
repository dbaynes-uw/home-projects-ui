<template>
  <div class="book-edit-container">
    <div class="breadcrumb-nav">
      <router-link :to="{ name: 'home' }" class="breadcrumb-link">
        <i class="fas fa-home"></i> Home
      </router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <router-link :to="{ name: 'BookList' }" class="breadcrumb-link">Books</router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <router-link :to="{ name: 'BookDetails', params: { id } }" class="breadcrumb-link">{{ editableBook.title || 'Book' }}</router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-current">Edit</span>
    </div>

    <BaseCard class="header-card">
      <template #header>
        <div class="header-content-edit">
          <h2><i class="fas fa-pen animated-icon"></i> Edit Book</h2>
          <p class="subtitle">{{ editableBook.title }}</p>
        </div>
      </template>
    </BaseCard>

    <BaseCard class="form-card">
      <template #header><h3>Book Details</h3></template>
      <form @submit.prevent="updateBook">
        <div class="form-container">
        <v-text-field
          label="Title"
          v-model="editableBook.title"
          required
        />
        <v-text-field
          label="Author"
          v-model="editableBook.author"
          required
        />
        <v-text-field
          label="Click calendar at right to change Date Written"
          v-model="editableBook.date_written"
          type="date"
        />
        <v-text-field
          label="Click calendar at right to change Date Read"
          v-model="editableBook.date_read"
          type="date"
        />
        <v-text-field
          label="URL to Review"
          v-model="editableBook.url_to_review"
        />
        <v-textarea
          label="Notes"
          v-model="editableBook.notes"
          rows="3"
          cols="40"
        />
          <div class="form-actions">
            <button class="submit-btn" type="submit">Update Book</button>
            <router-link :to="{ name: 'BookDetails', params: { id } }" class="cancel-link">Cancel</router-link>
          </div>
        </div>
      </form>
    </BaseCard>
  </div>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import BaseCard from '@/components/ui/BaseCard.vue'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import { useBookStore } from '@/stores/books/BookStore.js'

const props = defineProps(['id'])
const router = useRouter()
const store = useStore()
const bookStore = useBookStore()
const confirmDialogue = ref(null)

// Local editable copy — never mutate Pinia state directly with v-model
const editableBook = ref({})

onMounted(async () => {
  await bookStore.fetchBook(props.id)
  editableBook.value = { ...bookStore.currentBook }
})

// Sync if cache hit resolves before onMounted finishes
watch(() => bookStore.currentBook, (val) => {
  if (val && !editableBook.value.id) {
    editableBook.value = { ...val }
  }
})

async function updateBook() {
  const ok = await confirmDialogue.value.show({
    title: 'Update Book',
    message: `Are you sure you want to update "${editableBook.value.title}"?`,
    okButton: 'Update',
  })
  if (!ok) return

  const userEmail = store.state.user?.resource_owner?.email ?? store.state.user?.email ?? ''
  const book = {
    ...editableBook.value,
    updated_by: userEmail,
  }

  await bookStore.updateBook(book)
  router.push({ name: 'BookDetails', params: { id: book.id } })
}
</script>

<style scoped>
.book-edit-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.header-content-edit h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.25rem;
  color: white;
  font-size: 1.5rem;
}

.subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
}

.form-card { margin-top: 1.25rem; }

.form-container {
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-top: 1rem;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.submit-btn:hover { opacity: 0.9; }

.cancel-link {
  color: #718096;
  text-decoration: none;
  font-size: 0.9rem;
}
.cancel-link:hover { text-decoration: underline; }
</style>