import { useQuery } from '@tanstack/react-query'
import { apiGetPaginated } from '../../../api/apiService'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ProjectSummary } from '../../../types'

interface ProjectFilters {
  page?: number
  limit?: number
  status?: string
  search?: string
}

async function fetchProjects(filters: ProjectFilters = {}): Promise<ProjectSummary[]> {
  const { page = 1, limit = 100, status, search } = filters
  const params: any = { page, limit }
  if (status) params.status = status
  if (search) params.search = search

  const response = await apiGetPaginated<ProjectSummary>(ENDPOINTS.PROJECTS, params)
  return response.data
}

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery<ProjectSummary[]>({
    queryKey: ['projects', filters],
    queryFn: () => fetchProjects(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
