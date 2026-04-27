import { useQuery } from '@tanstack/react-query'
import type { Project, SCurveDataPoint, MDRItem, Alert } from '../../../types'
import { MOCK_PROJECTS } from './useProjects'

export const MOCK_SCURVE: SCurveDataPoint[] = [
  { month: 'فروردین', planned: 5, actual: 4 },
  { month: 'اردیبهشت', planned: 12, actual: 10 },
  { month: 'خرداد', planned: 20, actual: 17 },
  { month: 'تیر', planned: 30, actual: 26 },
  { month: 'مرداد', planned: 40, actual: 35 },
  { month: 'شهریور', planned: 52, actual: 45 },
  { month: 'مهر', planned: 62, actual: 54 },
  { month: 'آبان', planned: 70, actual: 62 },
  { month: 'آذر', planned: 78, actual: null },
  { month: 'دی', planned: 85, actual: null },
  { month: 'بهمن', planned: 92, actual: null },
  { month: 'اسفند', planned: 100, actual: null },
]

export const MOCK_MDR: MDRItem[] = [
  { id: '1', discipline: 'فرآیند', totalDocuments: 145, issued: 130, approved: 118, delayed: 15, criticalityScore: 72, status: 'critical' },
  { id: '2', discipline: 'لوله‌کشی', totalDocuments: 289, issued: 245, approved: 210, delayed: 44, criticalityScore: 85, status: 'critical' },
  { id: '3', discipline: 'سازه', totalDocuments: 98, issued: 90, approved: 85, delayed: 8, criticalityScore: 35, status: 'on-track' },
  { id: '4', discipline: 'برق', totalDocuments: 134, issued: 115, approved: 98, delayed: 19, criticalityScore: 55, status: 'delayed' },
  { id: '5', discipline: 'ابزار دقیق', totalDocuments: 201, issued: 170, approved: 145, delayed: 31, criticalityScore: 65, status: 'delayed' },
  { id: '6', discipline: 'مکانیک', totalDocuments: 167, issued: 155, approved: 142, delayed: 12, criticalityScore: 42, status: 'on-track' },
]

export const MOCK_ALERTS: Alert[] = [
  { id: '1', priority: 'P1', title: 'تأخیر بحرانی در تحویل اسناد لوله‌کشی', description: 'تأخیر ۴۴ روزه در ارسال نقشه‌های ایزومتریک', projectId: '1', projectName: 'آسالویه فاز ۱۴', date: '1403/08/15', isResolved: false },
  { id: '2', priority: 'P1', title: 'کمبود منابع انسانی در بخش فرآیند', description: 'نیاز فوری به ۳ مهندس فرآیند ارشد', projectId: '1', projectName: 'آسالویه فاز ۱۴', date: '1403/08/12', isResolved: false },
  { id: '3', priority: 'P2', title: 'تأخیر در تأیید اسناد ابزار دقیق', description: 'اسناد در مرحله بررسی کارفرما بیش از ۲۱ روز', projectId: '2', projectName: 'ماهشهر پتروشیمی', date: '1403/08/10', isResolved: false },
  { id: '4', priority: 'P2', title: 'مشکلات هماهنگی با پیمانکار فرعی', description: 'تداخل در برنامه‌ریزی فعالیت‌های برق و ابزار دقیق', projectId: '3', projectName: 'بندر امام کمپلکس', date: '1403/08/08', isResolved: false },
  { id: '5', priority: 'P3', title: 'به‌روزرسانی نرم‌افزار مدیریت اسناد', description: 'نیاز به ارتقاء نسخه EDMS تا پایان ماه', projectId: '4', projectName: 'آسالویه LNG', date: '1403/08/05', isResolved: false },
]

interface ProjectDetail {
  project: Project
  scurve: SCurveDataPoint[]
  mdr: MDRItem[]
  alerts: Alert[]
}

async function fetchProjectDetail(id: string): Promise<ProjectDetail> {
  await new Promise(r => setTimeout(r, 600))
  const project = MOCK_PROJECTS.find(p => p.id === id) || MOCK_PROJECTS[0]
  return {
    project,
    scurve: MOCK_SCURVE,
    mdr: MOCK_MDR,
    alerts: MOCK_ALERTS.filter(a => a.projectId === id),
  }
}

export function useProjectDetail(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectDetail(id),
    enabled: !!id,
  })
}
