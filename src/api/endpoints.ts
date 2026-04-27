export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const ENDPOINTS = {
  PROJECTS: '/projects',
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
  ALERTS: '/alerts',
  MDR: (projectId: string) => `/projects/${projectId}/mdr`,
  SCURVE: (projectId: string) => `/projects/${projectId}/scurve`,
}
