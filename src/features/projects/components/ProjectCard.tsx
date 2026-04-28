import { Calendar, MapPin, TrendingDown, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../../lib/utils'
import type { ProjectStatus, ProjectSummary } from '../../../types'

const STATUS_LABELS: Record<ProjectStatus, string> = {
  ACTIVE: 'فعال',
  COMPLETED: 'تکمیل‌شده',
  ON_HOLD: 'متوقف',
  CANCELLED: 'لغو‌شده',
}

const STATUS_COLORS: Record<ProjectStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-700 border-green-200',
  COMPLETED: 'bg-blue-100 text-blue-700 border-blue-200',
  ON_HOLD: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  CANCELLED: 'bg-gray-100 text-gray-700 border-gray-200',
}

function parseNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  return parseFloat(String(value)) || 0
}

// Compute visual status based on progress
function getProgressStatus(planned: number, actual: number): 'on-track' | 'critical' | 'delayed' {
  const diff = actual - planned
  if (diff >= 0) return 'on-track'
  if (diff < -15) return 'critical'
  return 'delayed'
}

const PROGRESS_STATUS_COLORS = {
  'on-track': 'bg-gradient-to-r from-green-400 to-green-500',
  critical: 'bg-gradient-to-r from-red-400 to-red-500',
  delayed: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
}

function ProgressBar({ plan, actual }: { plan: number; actual: number }) {
  const isOnTrack = actual >= plan
  const progressStatus = getProgressStatus(plan, actual)
  const deviation = actual - plan

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-600">
        <span>
          برنامه: <span className="font-semibold text-blue-600">{plan.toFixed(1)}%</span>
        </span>
        <span>
          واقعی:{' '}
          <span className={cn('font-semibold', isOnTrack ? 'text-green-600' : 'text-red-600')}>
            {actual.toFixed(1)}%
          </span>
        </span>
      </div>
      <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div className="absolute top-0 right-0 h-full bg-blue-400/40 rounded-full" style={{ width: `${plan}%` }} />
        <div
          className={cn(
            'absolute top-0 right-0 h-full rounded-full transition-all duration-500',
            PROGRESS_STATUS_COLORS[progressStatus]
          )}
          style={{ width: `${actual}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className={cn('font-medium flex items-center gap-1', isOnTrack ? 'text-green-600' : 'text-red-600')}>
          {isOnTrack ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {deviation >= 0 ? `+${deviation.toFixed(1)}%` : `${deviation.toFixed(1)}%`} انحراف
        </span>
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return dateStr
  }
}

export default function ProjectCard({ project }: { project: ProjectSummary }) {
  const navigate = useNavigate()
  const plan = parseNumber(project.planned_progress)
  const actual = parseNumber(project.actual_progress)
  const progressStatus = getProgressStatus(plan, actual)

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-blue-700 transition-colors mb-1">
            {project.name}
          </h3>
          <p className="text-xs font-mono text-gray-400">{project.code}</p>
        </div>
        <span
          className={cn(
            'text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 mr-2',
            STATUS_COLORS[project.status]
          )}
        >
          {STATUS_LABELS[project.status]}
        </span>
      </div>

      {project.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>}

      <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 mb-4">
        {project.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{project.location}</span>
          </div>
        )}
        {project.discipline && (
          <div className="inline-flex items-center px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">
            {project.discipline}
          </div>
        )}
      </div>

      {(plan > 0 || actual > 0) && <ProgressBar plan={plan} actual={actual} />}

      <div className="flex items-center gap-1 mt-4 text-xs text-gray-400">
        <Calendar className="w-3 h-3" />
        <span>
          {formatDate(project.start_date)} – {formatDate(project.end_date)}
        </span>
      </div>

      {/* Status indicator bar at bottom */}
      <div className={cn('mt-4 h-1 rounded-full', PROGRESS_STATUS_COLORS[progressStatus])} />
    </div>
  )
}
