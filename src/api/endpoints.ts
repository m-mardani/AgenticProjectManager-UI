export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const KEYCLOAK_CONFIG = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'mcdss',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'mcdss-api',
}

export const ENDPOINTS = {
  HEALTH: '/health',
  SIGNUP: '/api/v1/auth/signup',
  PROJECTS: '/api/v1/projects',
  PROJECT_DETAIL: (id: string) => `/api/v1/projects/${id}`,
  MDR: (projectId: string) => `/api/v1/projects/${projectId}/mdr`,
  SCURVE: (projectId: string) => `/api/v1/projects/${projectId}/scurve`,
}
