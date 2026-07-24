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
      <BaseForm @submit.prevent="onSubmit">
        <div class="form-container">
          <BaseTextField
            v-model="book.title"
            label="Title"
            required
            :error-messages="titleErrorMessage"
            @blur="titleTouched = true"
          >
            <template v-slot:prepend-inner>
              <BaseIcon class="icon-css">mdi-magnify</BaseIcon>
            </template>
          </BaseTextField>
          <BaseTextField
            v-model="book.author"
            label="Author"
            required
            :error-messages="authorErrorMessage"
            @blur="authorTouched = true"
          >
            <template v-slot:prepend-inner>
              <BaseIcon class="icon-css">mdi-account-circle</BaseIcon>
            </template>
          </BaseTextField>
          <BaseTextField
            label="Date Written"
            v-model="book.date_written"
            type="date"
          >
            <template v-slot:prepend-inner>
              <BaseIcon class="icon-css">mdi-calendar</BaseIcon>
            </template>
          </BaseTextField>
          <BaseTextField
            label="Date Read"
            v-model="book.date_read"
            type="date"
          >
            <template v-slot:prepend-inner>
              <BaseIcon class="icon-css">mdi-calendar</BaseIcon>
            </template>
          </BaseTextField>
          <BaseTextField
            v-model="book.url_to_review"
            label="URL to Review"
          >
            <template v-slot:prepend-inner>
              <BaseIcon class="icon-css">mdi-link</BaseIcon>
            </template>
          </BaseTextField>
          <BaseTextarea
            label="Notes"
            v-model="book.notes"
            clearable
          >
            <template v-slot:prepend-inner>
              <BaseIcon class="icon-css">mdi-note</BaseIcon>
            </template>
          </BaseTextarea>
          <div class="form-actions">
            <button type="submit" class="submit-btn">Submit</button>
            <router-link :to="{ name: 'BookList' }" class="cancel-link">Cancel</router-link>
          </div>
        </div>
      </BaseForm>
    </BaseCard>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { useBookStore } from '@/stores/books/BookStore.js'
import { notify } from '@/composables/useNotify.js'
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

const titleTouched = ref(false)
const authorTouched = ref(false)
const hasAttemptedSubmit = ref(false)

const isFormValid = computed(() => {
  const title = String(book.value.title ?? '').trim()
  const author = String(book.value.author ?? '').trim()
  return title.length > 0 && author.length > 0
})

const titleErrorMessage = computed(() => {
  const title = String(book.value.title ?? '').trim()
  if (title.length > 0) return ''
  return titleTouched.value || hasAttemptedSubmit.value ? 'Please enter Title' : ''
})

const authorErrorMessage = computed(() => {
  const author = String(book.value.author ?? '').trim()
  if (author.length > 0) return ''
  return authorTouched.value || hasAttemptedSubmit.value ? 'Please enter Author' : ''
})

// Submit
const onSubmit = async () => {
  hasAttemptedSubmit.value = true
  titleTouched.value = true
  authorTouched.value = true

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
  notify(`Book "${newBook.title}" was added successfully.`, 'success')
  router.push({ name: 'BookList' })
}
</script>
<style scoped>
.book-create-container {
  position: relative;
  max-width: 920px;
  margin: 0 auto;
  padding: 1.25rem;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(102, 126, 234, 0.16), transparent 32%),
    radial-gradient(circle at top right, rgba(118, 75, 162, 0.14), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #eef3ff 46%, #f7f6fb 100%);
}

.book-create-container::before,
.book-create-container::after {
  content: '';
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  opacity: 0.35;
}

.book-create-container::before {
  width: 220px;
  height: 220px;
  right: -70px;
  top: 120px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.35), transparent 68%);
}

.book-create-container::after {
  width: 280px;
  height: 280px;
  left: -110px;
  bottom: 60px;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.28), transparent 70%);
}

.book-create-container > * {
  position: relative;
  z-index: 1;
}

.header-content-create h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.25rem;
  color: #0f172a;
  font-size: 1.5rem;
}

.subtitle {
  margin: 0;
  color: #475569;
  font-size: 0.9rem;
}

.header-card {
  backdrop-filter: blur(8px);
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
  padding: 0.8rem 2.25rem;
  min-height: 3rem;
  border-radius: 999px;
  font-size: 1rem;
  letter-spacing: 0.01em;
}

.cancel-link {
  color: #718096;
  text-decoration: none;
  font-size: 0.9rem;
}
.cancel-link:hover { text-decoration: underline; }

.v-icon { color: #667eea; }
</style>
