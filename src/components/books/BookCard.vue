<template>
  <div class="card">
    <p id="p-custom-left-u">{{ book.title}}</p>
    <ul>
      <li class="li-left">Author: <b>{{ book.author }}</b></li>
      <li class="li-left">Date Written: {{ formatYearDate(book.date_written) }}</li>
      <li class="li-left">Date Read: {{ formatYearDate(book.date_read) }}</li>
      <li class="li-left"><a :href="book.url_to_review" target="_blank">Link to Review</a></li>
      <li class="li-left">Notes: <b>{{ book.notes }}</b> </li>
    </ul>
    <br/>
    <div class="icon-stack">
      <span v-if="origin == 'BookDetails'">
        <span class="fa-stack">
          <router-link
            :to="{ name: 'BookEdit', params: { id: `${book.id}` } }"
          >
            <i
              id="card-medium-icon-edit"
              class="fa-solid fa-pen-to-square fa-stack-1x"
            >
            </i>
          </router-link>
          <router-link :to="{ name: 'BookList'}">
            <i
              id="card-medium-icon-eye"
              class="fa-solid fa-backward fa-stack-1x"
            >
            </i>
          </router-link>
          <span class="fa-table-stack">
            <i
              @click="deleteBook(book)"
              class="fas fa-trash-alt fa-stack-1x"
              id="card-medium-icon-delete"
            >
            </i>
          </span>
        </span>
      </span>
      <span v-if="origin == 'BookList'">
        <span class="fa-stack">
          <router-link
            :to="{ name: 'BookEdit', params: { id: `${book.id}` } }"
          >
            <i
              id="card-medium-icon-edit"
              class="fa-solid fa-pen-to-square fa-stack-1x"
            >
            </i>
          </router-link>
          <router-link :to="{ name: 'BookDetails', params: { id: `${book.id}` } }">
            <i
              id="card-medium-icon-eye"
              class="fa fa-eye"
            >
            </i>
          </router-link>
          <span class="fa-table-stack">
            <i
              @click="deleteBook(book)"
              class="fas fa-trash-alt fa-stack-1x"
              id="card-medium-icon-delete"
            >
            </i>
          </span>
        </span>
      </span>
    </div>
  </div>
</template>
<script>

import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      default: () => ({})
    },
    origin: {
      type: String,
      default: '',
    }
  },
  setup() {
    //const vm = this.app.getCurrentInstance()
    //console.log("VM: ", vm)
  },
  methods: {
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
  }
}
</script>

<style scoped>
</style>
