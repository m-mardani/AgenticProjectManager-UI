import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectDetail } from '../hooks/useProjectDetail'
import SCurveChart from './SCurveChart'
import MDRTable from './MDRTable'
import AlertsSection from './AlertsSection'
import { cn } from '../../../lib/utils'
import {
  ArrowRight,
  TrendingUp,
  Calendar,
  MapPin,
  FileText,
  AlertTriangle,
  Activity,
} from 'lucide-react'

const STATUS_LABELS = {
  critical: 'بحرانی',
  'on-track': 'در مسیر',
  delayed: 'تأخیر',
  completed: 'تکمیل‌شده',
}
const STATUS_COLORS = {
  critical: 'bg-red-100 text-red-700',
  'on-track': 'bg-green-100 text-green-700',
  delayed: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
}

const TABS = [
  { id: 'overview', label: 'نمای کلی', icon: Activity },
  { id: 'scurve', label: 'منحنی S', icon: TrendingUp },
  { id: 'mdr', label: 'MDR', icon: FileText },
  { id: 'alerts', label: 'هشدارها', icon: AlertTriangle },
] as const

type TabId = typeof TABS[number]['id']

function KPICard({ label, value, sub, color = 'blue' }: { label: string; value: string; sub?: string; color?: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700',
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="text-sm text-gray-500 mb-2">{label}</div>
      <div className={cn('text-2xl font-bold', colorMap[color]?.split(' ')[1] || 'text-gray-900')}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useProjectDetail(id || '')
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const { project, scurve, mdr, alerts } = data
  const deviation = project.actualProgress - project.plannedProgress
  const unresolved = alerts.filter(a => !a.isResolved).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-3 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت به داشبورد
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <span className={cn('text-sm font-medium px-3 py-1 rounded-full', STATUS_COLORS[project.status])}>
              {STATUS_LABELS[project.status]}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{project.startDate} – {project.endDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="پیشرفت واقعی" value={`${project.actualProgress}%`} color="blue" />
        <KPICard label="پیشرفت برنامه" value={`${project.plannedProgress}%`} color="purple" />
        <KPICard
          label="انحراف از برنامه"
          value={`${deviation > 0 ? '+' : ''}${deviation}%`}
          color={deviation >= 0 ? 'green' : 'red'}
          sub={deviation >= 0 ? 'جلوتر از برنامه' : 'عقب‌تر از برنامه'}
        />
        <KPICard
          label="هشدارهای فعال"
          value={String(unresolved)}
          color={unresolved > 0 ? 'red' : 'green'}
          sub="هشدار حل‌نشده"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-px',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {project.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">توضیحات پروژه</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">پیشرفت کلی</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>برنامه‌ریزی‌شده</span>
                        <span>{project.plannedProgress}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${project.plannedProgress}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>واقعی</span>
                        <span>{project.actualProgress}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', deviation >= 0 ? 'bg-green-500' : 'bg-red-500')}
                          style={{ width: `${project.actualProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">اطلاعات رشته</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">رشته اصلی:</span>
                      <span className="font-medium text-gray-800">{project.discipline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">موقعیت:</span>
                      <span className="font-medium text-gray-800">{project.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scurve' && <SCurveChart data={scurve} />}
          {activeTab === 'mdr' && <MDRTable items={mdr} />}
          {activeTab === 'alerts' && <AlertsSection alerts={alerts} />}
        </div>
      </div>
    </div>
  )
}
