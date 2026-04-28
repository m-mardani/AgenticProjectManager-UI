// Backend API Response Wrappers
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  message?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: PaginationMeta
}

// Auth Types - Updated for new signup
export interface SignupRequest {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  organization?: string
}

export interface SignupResponse {
  userId: string
  username: string
  email: string
  role: string
}

// Project Types (Backend) - Updated with new fields
export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'

export interface ProjectSummary {
  id: string
  name: string
  code: string
  description?: string
  status: ProjectStatus
  start_date: string
  end_date: string
  location?: string
  planned_progress?: number | string
  actual_progress?: number | string
  discipline?: string
  created_at: string
  updated_at: string
}

// Alias for backward compatibility
export type Project = ProjectSummary

export interface ProjectDetail extends ProjectSummary {
  mdr_items: MdrItemOut[]
  s_curve_points: SCurvePointOut[]
}

export interface ProjectCreate {
  name: string
  code: string
  description?: string
  status: ProjectStatus
  start_date: string
  end_date: string
  location?: string
  planned_progress?: number | string
  actual_progress?: number | string
  discipline?: string
}

export interface ProjectUpdate extends Partial<ProjectCreate> {}

// MDR Types (Backend) - Updated with new fields
export type DisciplineType =
  | 'PIPING'
  | 'MECHANICAL'
  | 'ELECTRICAL'
  | 'INSTRUMENTATION'
  | 'CIVIL'
  | 'STRUCTURAL'
  | 'HVAC'
  | 'OTHER'

export type MDRStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED'

export interface MdrItemOut {
  id: string
  documentNumber: string
  title: string
  discipline: DisciplineType
  revision: string
  status: MDRStatus
  due_date?: string | null
  submitted_at?: string | null
  approved_at?: string | null
  total_documents: number
  issued: number
  approved: number
  delayed: number
  criticality_score?: number | null
}

// Alias for backward compatibility
export type MDRItem = MdrItemOut

export interface MdrItemCreate {
  documentNumber: string
  title: string
  discipline: DisciplineType
  revision: string
  status: MDRStatus
  due_date?: string
  submitted_at?: string
  approved_at?: string
  total_documents: number
  issued: number
  approved: number
  delayed: number
  criticality_score?: number
}

export interface MdrItemUpdate extends Partial<MdrItemCreate> {}

// S-Curve Types (Backend) - Updated with new EV/PV metrics
export interface SCurvePointOut {
  id: string
  date: string
  planned_progress?: number | string | null
  actual_progress?: number | string | null
  earned_value?: number | string | null
  planned_value?: number | string | null
  cost_variance?: number | string | null
  schedule_variance?: number | string | null
}

// Alias for backward compatibility
export type SCurveDataPoint = SCurvePointOut

export interface SCurvePointCreate {
  date: string
  planned_progress?: number | string
  actual_progress?: number | string
  earned_value?: number | string
  planned_value?: number | string
  cost_variance?: number | string
  schedule_variance?: number | string
}

// Alert Types (Legacy - keep for existing UI)
export interface Alert {
  id: string
  priority: 'P1' | 'P2' | 'P3'
  title: string
  description: string
  projectId: string
  projectName: string
  date: string
  isResolved: boolean
}

// Auth Types
export interface KeycloakToken {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  refresh_token: string
  token_type: string
  'not-before-policy': number
  session_state: string
  scope: string
}

export interface User {
  username: string
  email?: string
  roles: string[]
}
