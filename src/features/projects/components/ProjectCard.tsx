import { useNavigate } from 'react-router-dom'
import type { Project } from '../../../types'
import { cn } from '../../../lib/utils'
import { MapPin, Calendar } from 'lucide-react'

const STATUS_LABELS: Record<Project['status'], string> = {
  critical: 'بحرانی',
  'on-track': 'در مسیر',
  delayed: 'تأخیر',
  completed: 'تکمیل‌شده',
}

const STATUS_COLORS: Record<Project['status'], string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  'on-track': 'bg-green-100 text-green-700 border-green-200',
  delayed: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200',
}

const STATUS_BAR_COLORS: Record<Project['status'], string> = {
  critical: 'bg-red-500',
  'on-track': 'bg-green-500',
  delayed: 'bg-yellow-500',
  completed: 'bg-blue-500',
}

function ProgressBar({ plan, actual }: { plan: number; actual: number }) {
  const isOnTrack = actual >= plan
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-500">
        <span>برنامه: {plan}%</span>
        <span>واقعی: {actual}%</span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 right-0 h-full bg-gray-400 rounded-full opacity-60"
          style={{ width: `${plan}%` }}
        />
        <div
          className={cn('absolute top-0 right-0 h-full rounded-full', isOnTrack ? 'bg-green-500' : 'bg-red-500')}
          style={{ width: `${actual}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className={cn('font-medium', isOnTrack ? 'text-green-600' : 'text-red-600')}>
          {actual >= plan ? `+${actual - plan}%` : `${actual - plan}%`} انحراف
        </span>
      </div>
    </div>
  )
}

export default function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-blue-700 transition-colors">
          {project.name}
        </h3>
        <span
          className={cn(
            'text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 mr-2',
            STATUS_COLORS[project.status]
          )}
        >
          {STATUS_LABELS[project.status]}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{project.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-700">{project.discipline}</span>
        </div>
      </div>

      <ProgressBar plan={project.plannedProgress} actual={project.actualProgress} />

      <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
        <Calendar className="w-3 h-3" />
        <span>{project.startDate} – {project.endDate}</span>
      </div>

      {/* Status indicator bar at bottom */}
      <div className={cn('mt-4 h-1 rounded-full', STATUS_BAR_COLORS[project.status])} />
    </div>
  )
}
