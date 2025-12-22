import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const ROOT_URL = import.meta.env.VITE_ROOT_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// ✅ FIXED: Synchronous token retrieval only
api.interceptors.request.use(
  (config) => {

    let token = null
    
    // Method 1: Try vuex-persistedstate
    const vuexState = localStorage.getItem('vuex')
    
    if (vuexState) {
      try {
        const state = JSON.parse(vuexState)
        
        token = state.user?.token || state.token
        
        if (!token) {
          console.warn('⚠️ vuex exists but no token found')
          console.log('Full vuex state:', state)
        }
      } catch (error) {
        console.error('❌ Error parsing vuex:', error)
      }
    } else {
      console.warn('⚠️ No vuex in localStorage')
    }
    
    // Method 2: Fallback to manual 'user' save
    if (!token) {
      const userString = localStorage.getItem('user')
      
      if (userString) {
        try {
          const userData = JSON.parse(userString)
          
          token = userData.token
          
        } catch (error) {
          console.error('❌ Error parsing user:', error)
        }
      }
    }
    
    // Add token to request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized - clearing user data')
      localStorage.removeItem('vuex')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export const getAuthUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:3000'
}

export const config = {
  apiUrl: API_BASE_URL,
  rootUrl: ROOT_URL,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE
}

export default api