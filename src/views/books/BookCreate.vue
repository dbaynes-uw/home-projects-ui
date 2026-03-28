<template>
  <div class="book-create-container">
    <div class="breadcrumb-nav">
      <router-link :to="{ name: 'home' }" class="breadcrumb-link">
        <i class="fas fa-home"></i> Home
      </router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <router-link :to="{ name: 'BookList' }" class="breadcrumb-link">Books</router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-current">Add Book</span>
    </div>

    <BaseCard class="header-card">
      <template #header>
        <div class="header-content-create">
          <h2><i class="fas fa-book animated-icon"></i> Add Book to Collection</h2>
          <p class="subtitle">Track your reading journey</p>
        </div>
      </template>
    </BaseCard>

    <BaseCard class="form-card">
      <template #header><h3>Book Details</h3></template>
      <v-form @submit.prevent="onSubmit">
        <v-container class="form-container">
        <v-text-field
          v-model="book.title"
          :rules="[requiredTitle]"
          label="Title"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Author" v-model="book.author" :rules="[requiredAuthor]">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-account-circle</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Date Written"
          v-model="book.date_written"
          type="date"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Date Read"
          v-model="book.date_read"
          type="date"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>
        <v-text-field
          v-model="book.url_to_review"
          label="URL to Review"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-link</v-icon>
          </template>
        </v-text-field>        
        <v-textarea
          label="Notes"
          v-model="book.notes"
          clearable
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-note</v-icon>
          </template>
        </v-textarea>
          <div class="form-actions">
            <v-btn type="submit" class="submit-btn">Submit</v-btn>
            <router-link :to="{ name: 'BookList' }" class="cancel-link">Cancel</router-link>
          </div>
        </v-container>
      </v-form>
    </BaseCard>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { useBookStore } from '@/stores/books/BookStore.js'
import BaseCard from '@/components/ui/BaseCard.vue'

const store = useStore()
const bookStore = useBookStore()
const router = useRouter()

// Reactive form data
const book = ref({
  title: null,
  author: '',
  date_written: null,
  date_read: null,
  vendor_product: [],
  audio_format: false,
  print_format: false,
  url_to_review: '',
  notes: '',
})

const isAuthorValid = ref(false)
const isTitleValid = ref(false)

const isFormValid = computed(() => isAuthorValid.value && isTitleValid.value)

// Validation rules
const requiredTitle = (value) => {
  isTitleValid.value = !!value
  return !!value || 'Please enter Title'
}

const requiredAuthor = (value) => {
  isAuthorValid.value = !!value
  return !!value || 'Please enter Author'
}

// Submit
const onSubmit = async () => {
  if (!isFormValid.value) {
    alert('Please correct required fields and resubmit')
    return
  }
  const newBook = {
    ...book.value,
    id: uuidv4(),
    created_by: store.state.user?.resource_owner?.email ?? store.state.user?.email,
  }
  await bookStore.createBook(newBook)
  router.push({ name: 'BookList' })
}
</script>
<style scoped>
.book-create-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.header-content-create h2 {
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

.form-card {
  margin-top: 1.25rem;
}

.form-container {
  max-width: 560px;
  padding: 0.5rem 0;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-top: 1rem;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  font-weight: 600;
  padding: 0 2rem;
}

.cancel-link {
  color: #718096;
  text-decoration: none;
  font-size: 0.9rem;
}
.cancel-link:hover { text-decoration: underline; }

.v-icon { color: #667eea; }
</style>
