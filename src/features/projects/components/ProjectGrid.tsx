import { AlertTriangle, CheckCircle, Filter, Layers, Plus, Search, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import type { ProjectStatus } from '../../../types'
import { useProjects } from '../hooks/useProjects'
import ProjectCard from './ProjectCard'

function parseNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  return parseFloat(String(value)) || 0
}

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

const STATUS_OPTIONS: { value: ProjectStatus | ''; label: string }[] = [
  { value: '', label: 'همه' },
  { value: 'ACTIVE', label: 'فعال' },
  { value: 'COMPLETED', label: 'تکمیل‌شده' },
  { value: 'ON_HOLD', label: 'معلق' },
  { value: 'CANCELLED', label: 'لغو شده' },
]

export default function ProjectGrid() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('')

  const {
    data: projects,
    isLoading,
    isError,
  } = useProjects({
    status: statusFilter || undefined,
    search: searchQuery || undefined,
  })

  const totalProjects = projects?.length ?? 0

  // Count projects with critical delay (actual < planned - 15%)
  const criticalCount =
    projects?.filter(p => {
      const plan = parseNumber(p.planned_progress)
      const actual = parseNumber(p.actual_progress)
      return actual < plan - 15
    }).length ?? 0

  const avgProgress =
    projects && projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + parseNumber(p.actual_progress), 0) / projects.length)
      : 0

  const completedCount = projects?.filter(p => p.status === 'COMPLETED').length ?? 0
  const activeCount = projects?.filter(p => p.status === 'ACTIVE').length ?? 0

  return (
    <div className="space-y-6">
      {/* Page header with action button */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">داشبورد پروژه‌ها</h1>
          <p className="text-gray-500 text-sm mt-2">نمای کلی از وضعیت پروژه‌های جاری PIDMCO</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          onClick={() => {
            /* TODO: Add project creation */
          }}
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">پروژه جدید</span>
        </button>
      </div>

      {/* Summary Stats */}
      {!isLoading && projects && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-900">{totalProjects}</div>
            </div>
            <div className="text-sm text-blue-700 font-medium">کل پروژه‌ها</div>
            <div className="text-xs text-blue-600 mt-1">{activeCount} پروژه فعال</div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center shadow-sm">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-red-900">{criticalCount}</div>
            </div>
            <div className="text-sm text-red-700 font-medium">پروژه بحرانی</div>
            <div className="text-xs text-red-600 mt-1">نیاز به توجه فوری</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center shadow-sm">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-900">{avgProgress}%</div>
            </div>
            <div className="text-sm text-green-700 font-medium">میانگین پیشرفت</div>
            <div className="text-xs text-green-600 mt-1">پیشرفت کلی پروژه‌ها</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center shadow-sm">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-900">{completedCount}</div>
            </div>
            <div className="text-sm text-purple-700 font-medium">تکمیل‌شده</div>
            <div className="text-xs text-purple-600 mt-1">پروژه‌های موفق</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="w-4 h-4" />
            <span>فیلترها:</span>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="جستجو در پروژه‌ها..."
              className="w-full pr-10 pl-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ProjectStatus | '')}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Active filters count */}
          {(searchQuery || statusFilter) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('')
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              پاک کردن فیلترها
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-900 mb-1">خطا در بارگذاری پروژه‌ها</h3>
          <p className="text-sm text-red-600">لطفاً صفحه را رفرش کنید یا با پشتیبانی تماس بگیرید.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && projects?.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">هیچ پروژه‌ای یافت نشد</h3>
          <p className="text-sm text-gray-500">
            {searchQuery || statusFilter
              ? 'فیلترهای خود را تغییر دهید یا جستجوی جدیدی انجام دهید'
              : 'برای شروع، پروژه جدیدی ایجاد کنید'}
          </p>
        </div>
      )}

      {/* Project grid */}
      {!isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : projects?.map(project => <ProjectCard key={project.id} project={project} />)}
        </div>
      )}
    </div>
  )
}
