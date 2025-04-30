import { defineStore } from 'pinia'
import EventService from '@/services/EventService'
//note: Use export so we can import it later
export const useBookStore = defineStore('BookStore', {
  state() {
    return {
      books: [],
      book: {}
    }
  },
  getters: {
    numberOfBooks: state => state.books.length
  },
  actions: {
    async fetchBooks() {
      EventService.getBooks()
        .then((response) => {
          this.books = response.data
          return response.data;
        })
        .catch((error) => {
          alert("Books Fetch Error: ", error.response.data )
        });
    },
  }
})