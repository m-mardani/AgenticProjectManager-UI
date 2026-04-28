import axios, { AxiosError } from 'axios'
import type { ApiResponse, PaginatedResponse } from '../types'
import { authService } from './authService'
import { API_BASE_URL } from './endpoints'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  config => {
    const token = authService.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor - handle errors and token refresh
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiResponse<any>>) => {
    const originalRequest = error.config

    // Handle 401 - try to refresh token
    if (error.response?.status === 401 && originalRequest && !originalRequest.headers['X-Retry']) {
      try {
        await authService.refreshToken()

        // Retry original request with new token
        const token = authService.getAccessToken()
        originalRequest.headers['Authorization'] = `Bearer ${token}`
        originalRequest.headers['X-Retry'] = 'true'

        return apiClient(originalRequest)
      } catch (refreshError) {
        authService.logout()
        return Promise.reject(refreshError)
      }
    }

    // Handle 403 - insufficient permissions
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions')
    }

    return Promise.reject(error)
  }
)

// API helper functions - Standard single response
export const apiGet = async <T>(url: string, params?: any): Promise<T> => {
  const response = await apiClient.get<ApiResponse<T>>(url, { params })
  if (!response.data.success || response.data.data === null) {
    throw new Error(response.data.message || 'Request failed')
  }
  return response.data.data
}

export const apiPost = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await apiClient.post<ApiResponse<T>>(url, data)
  if (!response.data.success || response.data.data === null) {
    throw new Error(response.data.message || 'Request failed')
  }
  return response.data.data
}

export const apiPut = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await apiClient.put<ApiResponse<T>>(url, data)
  if (!response.data.success || response.data.data === null) {
    throw new Error(response.data.message || 'Request failed')
  }
  return response.data.data
}

export const apiDelete = async (url: string): Promise<void> => {
  await apiClient.delete(url)
  // 204 No Content - successful deletion
}

// Paginated list helper
export const apiGetPaginated = async <T>(url: string, params?: any): Promise<PaginatedResponse<T>> => {
  const response = await apiClient.get<PaginatedResponse<T>>(url, { params })
  if (!response.data.success) {
    throw new Error('Request failed')
  }
  return response.data
}

export default apiClient
