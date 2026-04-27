export interface Project {
  id: string
  name: string
  location: string
  status: 'critical' | 'on-track' | 'delayed' | 'completed'
  plannedProgress: number
  actualProgress: number
  discipline: string
  startDate: string
  endDate: string
  description?: string
}

export interface SCurveDataPoint {
  month: string
  planned: number
  actual: number | null
}

export interface MDRItem {
  id: string
  discipline: string
  totalDocuments: number
  issued: number
  approved: number
  delayed: number
  criticalityScore: number
  status: 'on-track' | 'delayed' | 'critical'
}

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
