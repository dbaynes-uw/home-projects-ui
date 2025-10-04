import EventService from '@/services/EventService'

// ✅ VUEX MODULE (No Pinia needed)
export default {
  namespaced: true,
  
  state: {
    books: [],
    book: {}
  },
  
  getters: {
    numberOfBooks: state => state.books.length,
    allBooks: state => state.books,
    bookById: state => id => state.books.find(book => book.id === id)
  },
  
  mutations: {
    SET_BOOKS(state, books) {
      state.books = books
    },
    SET_BOOK(state, book) {
      state.book = book
    },
    ADD_BOOK(state, book) {
      state.books.push(book)
    },
    UPDATE_BOOK(state, updatedBook) {
      const index = state.books.findIndex(book => book.id === updatedBook.id)
      if (index !== -1) {
        state.books.splice(index, 1, updatedBook)
      }
    },
    REMOVE_BOOK(state, bookId) {
      state.books = state.books.filter(book => book.id !== bookId)
    }
  },
  
  actions: {
    async fetchBooks({ commit }) {
      try {
        const response = await EventService.getBooks()
        commit('SET_BOOKS', response.data)
        return response.data
      } catch (error) {
        console.error("Books Fetch Error:", error.response?.data)
        throw error
      }
    },
    
    async fetchBook({ commit }, bookId) {
      try {
        const response = await EventService.getBook(bookId)
        commit('SET_BOOK', response.data)
        return response.data
      } catch (error) {
        console.error("Book Fetch Error:", error.response?.data)
        throw error
      }
    }
  }
}