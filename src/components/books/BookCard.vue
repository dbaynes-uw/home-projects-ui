<template>
  <div class="card">
    <p id="p-custom-left-u">{{ book.title}}</p>
    <ul>
      <li class="li-left">Author: <b>{{ book.author }}</b></li>
      <li class="li-left">Date Written: {{ formatYearDate(book.date_written) }}</li>
      <li class="li-left">Date Read: {{ formatYearDate(book.date_read) }}</li>
      <li class="li-left">Link to Review: {{ book.url_to_review }}</li>
      <li class="li-left">Notes: <b>{{ book.notes }}</b> </li>
    </ul>
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
    }
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
