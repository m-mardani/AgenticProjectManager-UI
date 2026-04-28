import { Activity, AlertTriangle, ArrowRight, Calendar, Clock, FileText, Hash, MapPin, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cn } from '../../../lib/utils'
import { useProjectDetail } from '../hooks/useProjectDetail'
import AlertsSection from './AlertsSection'
import MDRTable from './MDRTable'
import SCurveChart from './SCurveChart'

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'فعال',
  COMPLETED: 'تکمیل‌شده',
  ON_HOLD: 'معلق',
  CANCELLED: 'لغو شده',
}
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700 border-green-200',
  COMPLETED: 'bg-blue-100 text-blue-700 border-blue-200',
  ON_HOLD: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
}

const TABS = [
  { id: 'overview', label: 'نمای کلی', icon: Activity },
  { id: 'scurve', label: 'منحنی S', icon: TrendingUp },
  { id: 'mdr', label: 'MDR', icon: FileText },
  { id: 'alerts', label: 'هشدارها', icon: AlertTriangle },
] as const

type TabId = (typeof TABS)[number]['id']

function parseNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  return parseFloat(String(value)) || 0
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fa-IR')
  } catch {
    return dateStr
  }
}

function KPICard({
  label,
  value,
  sub,
  color = 'blue',
}: {
  label: string
  value: string
  sub?: string
  color?: string
}) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-50 to-blue-100 text-blue-700',
    green: 'from-green-50 to-green-100 text-green-700',
    red: 'from-red-50 to-red-100 text-red-700',
    yellow: 'from-yellow-50 to-yellow-100 text-yellow-700',
    purple: 'from-purple-50 to-purple-100 text-purple-700',
  }
  return (
    <div className={cn('bg-gradient-to-br rounded-xl border shadow-sm p-5', colorMap[color])}>
      <div className="text-sm font-medium opacity-80 mb-2">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
      {sub && <div className="text-xs opacity-70 mt-2">{sub}</div>}
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading } = useProjectDetail(id || '')
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

  if (!project) return null

  const plannedProgress = parseNumber(project.planned_progress)
  const actualProgress = parseNumber(project.actual_progress)
  const deviation = actualProgress - plannedProgress
  const unresolved = 0 // TODO: Get from alerts API when available

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
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <span className={cn('text-sm font-medium px-3 py-1.5 rounded-full border', STATUS_COLORS[project.status])}>
              {STATUS_LABELS[project.status]}
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="font-mono text-blue-600">{project.code}</span>
            </div>
            {project.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{project.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>
                {formatDate(project.start_date)} – {formatDate(project.end_date)}
              </span>
            </div>
            {project.discipline && (
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-gray-400" />
                <span>{project.discipline}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="پیشرفت واقعی" value={`${actualProgress.toFixed(1)}%`} color="blue" />
        <KPICard label="پیشرفت برنامه" value={`${plannedProgress.toFixed(1)}%`} color="purple" />
        <KPICard
          label="انحراف از برنامه"
          value={`${deviation > 0 ? '+' : ''}${deviation.toFixed(1)}%`}
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px',
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
            <div className="space-y-6">
              {/* Description */}
              {project.description && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-5 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    توضیحات پروژه
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Progress Overview */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-lg p-5 border border-blue-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    پیشرفت کلی
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span className="font-medium">برنامه‌ریزی‌شده</span>
                        <span className="font-bold text-blue-600">{plannedProgress.toFixed(1)}%</span>
                      </div>
                      <div className="h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${plannedProgress}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span className="font-medium">واقعی</span>
                        <span className={cn('font-bold', deviation >= 0 ? 'text-green-600' : 'text-red-600')}>
                          {actualProgress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            deviation >= 0 ? 'bg-green-500' : 'bg-red-500'
                          )}
                          style={{ width: `${actualProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50/30 rounded-lg p-5 border border-purple-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    اطلاعات پروژه
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5" />
                        کد پروژه:
                      </span>
                      <span className="font-mono font-medium text-gray-800 bg-white px-2 py-1 rounded">
                        {project.code}
                      </span>
                    </div>
                    {project.discipline && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">رشته اصلی:</span>
                        <span className="font-medium text-gray-800">{project.discipline}</span>
                      </div>
                    )}
                    {project.location && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" />
                          موقعیت:
                        </span>
                        <span className="font-medium text-gray-800">{project.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        ایجاد شده:
                      </span>
                      <span className="font-medium text-gray-800">{formatDate(project.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scurve' && <SCurveChart data={project.s_curve_points || []} />}
          {activeTab === 'mdr' && <MDRTable items={project.mdr_items || []} />}
          {activeTab === 'alerts' && <AlertsSection alerts={[]} />}
        </div>
      </div>
    </div>
  )
}
