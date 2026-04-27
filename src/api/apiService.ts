import axios from 'axios'
import { API_BASE_URL } from './endpoints'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
    }
    return Promise.reject(error)
  }
)

export const apiGet = <T>(url: string) => apiClient.get<T>(url).then(r => r.data)
export const apiPost = <T>(url: string, data: unknown) => apiClient.post<T>(url, data).then(r => r.data)
export const apiPut = <T>(url: string, data: unknown) => apiClient.put<T>(url, data).then(r => r.data)
export const apiDelete = <T>(url: string) => apiClient.delete<T>(url).then(r => r.data)

export default apiClient
