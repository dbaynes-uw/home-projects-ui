<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h3 id="h3-left">Total: {{ sortedBooks.length }}</h3>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('title')">Title</th>
      <th id="background-blue" @click="sortList('author')">Author</th>
      <th id="background-blue" @click="sortList('date_written')">Date Written</th>
      <th id="background-blue" @click="sortList('date_read')">Date Read</th>
      <th id="background-blue">URL to Review</th>
      <th class="th-center" id="background-blue">Actions</th>
    </tr>
    <tr v-for="(result, resultIndex) in sortedBooks" :key="resultIndex">
      <td>{{ result.title }}</td>
      <td>{{ result.author }}</td>
      <td class="td-center">{{ formatFullYearDate(result.date_written) }}</td>
      <td class="td-center">{{ formatFullYearDate(result.date_read) }}</td>
      <td class="td-center">
        <a :href="result.url_to_review" target="_blank">Review</a>
      </td>
      <td class="td-center">
        <span v-if="onlineStatus">
          <span class="fa-stack" style="text-align: center">
            <router-link :to="{ name: 'BookEdit', params: { id: `${result.id}` } }">
              <i id="medium-icon-edit" class="fa-solid fa-pen-to-square fa-stack-1x"></i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link :to="{ name: 'BookDetails', params: { id: `${result.id}` } }">
                <i id="booklist-icon-eye" class="fa fa-eye"></i>
              </router-link>
            </span>
            <span class="fa-table-stack">
              <i @click="deleteBook(result)" class="fas fa-trash-alt fa-stack-1x" id="booklist-icon-delete"></i>
            </span>
          </span>
        </span>
        <span v-else>
          <router-link :to="{ name: 'BookDetails', params: { id: `${result.id}` } }">View | </router-link>
          <router-link :to="{ name: 'BookEdit', params: { id: `${result.id}` } }">Edit | </router-link>
          <span class="ok-btn" @click="deleteBook(result)"><u>Delete</u></span>
        </span>
      </td>
    </tr>
  </v-table>
  <br />
</template>

<script setup>
import { ref, watch } from 'vue'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import DateFormatService from '@/services/DateFormatService.js'
import { useBookStore } from '@/stores/books/BookStore.js'

const props = defineProps(['books'])
const bookStore = useBookStore()
const confirmDialogue = ref(null)
const onlineStatus = ref(navigator.onLine)
const sortedByAsc = ref(true)
const sortedBooks = ref([])

// Keep local sorted copy in sync with prop
watch(() => props.books, (val) => {
  sortedBooks.value = [...(val || [])]
}, { immediate: true })

function sortList(sortBy) {
  if (sortedByAsc.value) {
    sortedBooks.value.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1))
    sortedByAsc.value = false
  } else {
    sortedBooks.value.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1))
    sortedByAsc.value = true
  }
}

async function deleteBook(book) {
  const ok = await confirmDialogue.value.show({
    title: 'Delete Book from List',
    message: `Are you sure you want to delete "${book.title}"? It cannot be undone.`,
    okButton: 'Delete',
  })
  if (ok) {
    await bookStore.deleteBook(book)
  }
}

function formatFullYearDate(value) {
  return DateFormatService.formatFullYearDatejs(value)
}
</script>
