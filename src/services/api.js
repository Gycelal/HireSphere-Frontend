import axios from 'axios'
import { logout, setAccessToken } from '../store/slices/authSlice'
import appStore from '../store/store'


export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
})

export const privateApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
})

// Request interceptor
privateApi.interceptors.request.use(
  config => {
    const access = appStore.getState().auth.access
    if (access) {
      config.headers.Authorization = `Bearer ${access}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor
privateApi.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        const res = await privateApi.post('accounts/token/refresh/')
        appStore.dispatch(setAccessToken(res.data.access))
        error.config.headers.Authorization = `Bearer ${res.data.access}`
        return privateApi(error.config);
      } catch (err) {
        appStore.dispatch(logout())
      }
    }
    return Promise.reject(error)
  }
)
