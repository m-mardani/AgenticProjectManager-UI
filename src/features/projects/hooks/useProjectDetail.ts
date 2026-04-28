import { useQuery } from '@tanstack/react-query'
import { apiGet, apiGetPaginated } from '../../../api/apiService'
import { ENDPOINTS } from '../../../api/endpoints'
import type { MdrItemOut, ProjectDetail, SCurvePointOut } from '../../../types'

async function fetchProjectDetail(id: string): Promise<ProjectDetail> {
  const project = await apiGet<ProjectDetail>(ENDPOINTS.PROJECT_DETAIL(id))
  return project
}

async function fetchProjectMDR(
  id: string,
  discipline?: string,
  status?: string,
  page = 1,
  limit = 50
): Promise<MdrItemOut[]> {
  const params: any = { page, limit }
  if (discipline) params.discipline = discipline
  if (status) params.status = status

  const response = await apiGetPaginated<MdrItemOut>(ENDPOINTS.MDR(id), params)
  return response.data
}

async function fetchProjectSCurve(id: string, startDate?: string, endDate?: string): Promise<SCurvePointOut[]> {
  const params: any = {}
  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate

  const data = await apiGet<SCurvePointOut[]>(ENDPOINTS.SCURVE(id), params)
  return data
}

export function useProjectDetail(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectDetail(id),
    enabled: !!id,
  })
}

export function useProjectMDR(id: string, discipline?: string, status?: string) {
  return useQuery({
    queryKey: ['projectMDR', id, discipline, status],
    queryFn: () => fetchProjectMDR(id, discipline, status),
    enabled: !!id,
  })
}

export function useProjectSCurve(id: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['projectSCurve', id, startDate, endDate],
    queryFn: () => fetchProjectSCurve(id, startDate, endDate),
    enabled: !!id,
  })
}
