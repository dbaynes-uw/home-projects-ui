import { defineStore } from 'pinia'
import EventService from '@/services/EventService'

export const useBookStore = defineStore('books', {
  state: () => ({
    books: [],
    book: null,
    loading: false,
    error: null,
  }),

  getters: {
    allBooks: (state) => state.books,
    currentBook: (state) => state.book,
    isLoading: (state) => state.loading,
    errorMessage: (state) => state.error,
    numberOfBooks: (state) => state.books.length,

    sortedByTitle: (state) =>
      [...state.books].sort((a, b) => (a.title || '').localeCompare(b.title || '')),

    sortedByAuthor: (state) =>
      [...state.books].sort((a, b) => (a.author || '').localeCompare(b.author || '')),

    sortedByDateRead: (state) =>
      [...state.books].sort((a, b) => {
        if (!a.date_read) return 1
        if (!b.date_read) return -1
        return new Date(b.date_read) - new Date(a.date_read)
      }),
  },

  actions: {
    // ========================================
    // FETCH ALL BOOKS
    // ========================================
    async fetchBooks() {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.getBooks()
        this.books = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to fetch books'
        console.error('BookStore fetchBooks error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // FETCH SINGLE BOOK
    // ========================================
    async fetchBook(id) {
      this.loading = true
      this.error = null
      try {
        // Check cache first
        const existing = this.books.find(b => b.id == id)
        if (existing) {
          this.book = existing
          return existing
        }
        const response = await EventService.getBook(id)
        this.book = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to fetch book'
        console.error('BookStore fetchBook error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // CREATE BOOK
    // ========================================
    async createBook(book) {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.postBook(book)
        this.books.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to create book'
        console.error('BookStore createBook error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // UPDATE BOOK
    // ========================================
    async updateBook(book) {
      this.loading = true
      this.error = null
      try {
        const response = await EventService.putBook(book)
        const idx = this.books.findIndex(b => b.id === book.id)
        if (idx !== -1) this.books[idx] = response.data
        this.book = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data || 'Failed to update book'
        console.error('BookStore updateBook error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // DELETE BOOK
    // ========================================
    async deleteBook(book) {
      this.loading = true
      this.error = null
      try {
        await EventService.deleteBook(book)
        this.books = this.books.filter(b => b.id !== book.id)
        if (this.book?.id === book.id) this.book = null
      } catch (error) {
        this.error = error.response?.data || 'Failed to delete book'
        console.error('BookStore deleteBook error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // CLEAR
    // ========================================
    clearBook() {
      this.book = null
    },
    clearBooks() {
      this.books = []
    },
  },
})
