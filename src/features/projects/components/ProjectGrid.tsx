import { useProjects } from '../hooks/useProjects'
import ProjectCard from './ProjectCard'
import { AlertTriangle, CheckCircle, TrendingUp, Layers } from 'lucide-react'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
      <div className="h-2 bg-gray-200 rounded w-full mb-2" />
      <div className="h-2 bg-gray-100 rounded w-full" />
    </div>
  )
}

export default function ProjectGrid() {
  const { data: projects, isLoading, isError } = useProjects()

  const totalProjects = projects?.length ?? 0
  const criticalCount = projects?.filter(p => p.status === 'critical').length ?? 0
  const avgProgress = projects
    ? Math.round(projects.reduce((sum, p) => sum + p.actualProgress, 0) / projects.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">داشبورد پروژه‌ها</h1>
        <p className="text-gray-500 text-sm mt-1">نمای کلی از وضعیت پروژه‌های جاری PIDMCO</p>
      </div>

      {/* Summary Stats */}
      {!isLoading && projects && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalProjects}</div>
              <div className="text-xs text-gray-500">کل پروژه‌ها</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
              <div className="text-xs text-gray-500">پروژه بحرانی</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{avgProgress}%</div>
              <div className="text-xs text-gray-500">میانگین پیشرفت</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-xs text-gray-500">تکمیل‌شده</div>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
          خطا در بارگذاری پروژه‌ها. لطفاً صفحه را رفرش کنید.
        </div>
      )}

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : projects?.map(project => <ProjectCard key={project.id} project={project} />)}
      </div>
    </div>
  )
}
