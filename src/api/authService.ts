import axios from 'axios'
import type { KeycloakToken, User } from '../types'
import { API_BASE_URL, ENDPOINTS, KEYCLOAK_CONFIG } from './endpoints'

const TOKEN_KEY = 'mcdss_access_token'
const REFRESH_TOKEN_KEY = 'mcdss_refresh_token'
const USER_KEY = 'mcdss_user'

export interface SignupData {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  organization?: string
}

export class AuthService {
  private static instance: AuthService
  private tokenEndpoint: string

  private constructor() {
    this.tokenEndpoint = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async signup(data: SignupData): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}${ENDPOINTS.SIGNUP}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error: any) {
      console.error('Signup failed:', error)
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        throw new Error('Cannot connect to server. Please ensure the backend is running on port 3000.')
      }
      throw new Error('Signup failed. Please try again.')
    }
  }

  async login(username: string, password: string): Promise<void> {
    const params = new URLSearchParams()
    params.append('grant_type', 'password')
    params.append('client_id', KEYCLOAK_CONFIG.clientId)
    params.append('username', username)
    params.append('password', password)

    try {
      const response = await axios.post<KeycloakToken>(this.tokenEndpoint, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const tokenData = response.data
      this.setTokens(tokenData.access_token, tokenData.refresh_token)

      // Decode JWT to extract user info
      const user = this.decodeToken(tokenData.access_token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch (error: any) {
      console.error('Login failed:', error)

      // Network error - Keycloak not running
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        throw new Error(
          `Cannot connect to Keycloak server at ${KEYCLOAK_CONFIG.url}. Please ensure Keycloak is running on port 8080.`
        )
      }

      // Invalid credentials
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password. Please check your credentials.')
      }

      // Other errors
      if (error.response?.data?.error_description) {
        throw new Error(error.response.data.error_description)
      }

      throw new Error('Login failed. Please try again.')
    }
  }

  async refreshToken(): Promise<void> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const params = new URLSearchParams()
    params.append('grant_type', 'refresh_token')
    params.append('client_id', KEYCLOAK_CONFIG.clientId)
    params.append('refresh_token', refreshToken)

    try {
      const response = await axios.post<KeycloakToken>(this.tokenEndpoint, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const tokenData = response.data
      this.setTokens(tokenData.access_token, tokenData.refresh_token)
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.logout()
      throw error
    }
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    window.location.href = '/login'
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    if (!token) return false

    // Check if token is expired
    try {
      const payload = this.decodeToken(token)
      const expiry = payload.exp ? payload.exp * 1000 : 0
      return Date.now() < expiry
    } catch {
      return false
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null

    try {
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user?.roles?.includes(role) ?? false
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser()
    return roles.some(role => user?.roles?.includes(role) ?? false)
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const payload = JSON.parse(jsonPayload)

      return {
        username: payload.preferred_username || payload.sub,
        email: payload.email,
        roles: payload.realm_access?.roles || [],
        exp: payload.exp,
      }
    } catch (error) {
      console.error('Failed to decode token:', error)
      return {}
    }
  }
}

export const authService = AuthService.getInstance()
