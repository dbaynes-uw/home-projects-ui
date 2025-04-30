import { defineStore } from 'pinia'

export const useUserStore = defineStore('UserStore', {
  // state: () => ({
  //    return {
  //      user: 'DLB'
  //})
  //Short Hand of above
  state: () => ({
    user: 'DL Baynes'
  }),
  getters: {
    firstName() {
      return this.user.split(' ')[0]
    }
  }
})