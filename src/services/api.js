import axios from 'axios'

// ✅ SMART API URL DETECTION
// If accessing via localhost, use localhost API
// If accessing via IP address (iPhone), use IP address API
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API_BASE_URL = isLocalhost 
  ? (import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:3000/api/v1')
  : (import.meta.env.VITE_API_URL || 'http://10.0.0.13:3000/api/v1')

const ROOT_URL = import.meta.env.VITE_ROOT_URL || window.location.origin

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
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