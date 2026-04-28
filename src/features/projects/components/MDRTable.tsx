import { Calendar, ChevronDown, ChevronUp, FileCheck, Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../../lib/utils'
import type { MdrItemOut } from '../../../types'

interface Props {
  items: MdrItemOut[]
}

type SortKey = keyof MdrItemOut
type SortDir = 'asc' | 'desc'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'در انتظار',
  IN_REVIEW: 'در حال بررسی',
  APPROVED: 'تأیید شده',
  REJECTED: 'رد شده',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  IN_REVIEW: 'bg-blue-100 text-blue-700 border-blue-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
}

const DISCIPLINE_LABELS: Record<string, string> = {
  PIPING: 'لوله‌کشی',
  MECHANICAL: 'مکانیک',
  ELECTRICAL: 'برق',
  INSTRUMENTATION: 'ابزار دقیق',
  CIVIL: 'عمران',
  STRUCTURAL: 'سازه',
  HVAC: 'تهویه مطبوع',
  OTHER: 'سایر',
}

function CriticalityBar({ score }: { score: number | null | undefined }) {
  const safeScore = score ?? 0
  const color = safeScore > 70 ? 'bg-red-500' : safeScore > 40 ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${safeScore}%` }} />
      </div>
      <span className="text-xs font-medium w-8 text-right">{safeScore}</span>
    </div>
  )
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fa-IR')
  } catch {
    return '—'
  }
}

export default function MDRTable({ items }: Props) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('criticality_score')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = items
    .filter(item => {
      const matchesSearch =
        search === '' ||
        item.documentNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        DISCIPLINE_LABELS[item.discipline].includes(search)
      const matchesDiscipline = selectedDiscipline === '' || item.discipline === selectedDiscipline
      const matchesStatus = selectedStatus === '' || item.status === selectedStatus
      return matchesSearch && matchesDiscipline && matchesStatus
    })
    .sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av
      if (typeof av === 'string' && typeof bv === 'string')
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      return 0
    })

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 text-gray-300" />
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-blue-500" />
    ) : (
      <ChevronDown className="w-3 h-3 text-blue-500" />
    )
  }

  const Th = ({ label, col }: { label: string; col: SortKey }) => (
    <th
      onClick={() => handleSort(col)}
      className="px-4 py-3 text-right text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-900 select-none transition-colors"
    >
      <div className="flex items-center gap-1 justify-end">
        <span>{label}</span>
        <SortIcon col={col} />
      </div>
    </th>
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header with Filters */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800">جدول MDR</h3>
          <span className="text-sm text-gray-500">{filtered.length} مورد</span>
        </div>

        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="جستجو در اسناد..."
              className="w-full pr-9 pl-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
            />
          </div>

          {/* Discipline Filter */}
          <select
            value={selectedDiscipline}
            onChange={e => setSelectedDiscipline(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="">همه رشته‌ها</option>
            {Object.entries(DISCIPLINE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="">همه وضعیت‌ها</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-l from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <Th label="شماره سند" col="documentNumber" />
              <Th label="عنوان" col="title" />
              <Th label="رشته" col="discipline" />
              <Th label="ویرایش" col="revision" />
              <Th label="کل اسناد" col="total_documents" />
              <Th label="صادرشده" col="issued" />
              <Th label="تأیید‌شده" col="approved" />
              <Th label="تأخیر" col="delayed" />
              <Th label="شاخص بحران" col="criticality_score" />
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">تاریخ سررسید</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                  هیچ موردی یافت نشد
                </td>
              </tr>
            ) : (
              filtered.map(item => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-blue-600">{item.documentNumber}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{item.title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                      {DISCIPLINE_LABELS[item.discipline]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{item.revision}</td>
                  <td className="px-4 py-3 text-center font-medium text-gray-900">{item.total_documents}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{item.issued}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                      <FileCheck className="w-3 h-3" />
                      {item.approved}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        'font-medium',
                        item.delayed > 20 ? 'text-red-600' : item.delayed > 0 ? 'text-yellow-600' : 'text-gray-400'
                      )}
                    >
                      {item.delayed}
                    </span>
                  </td>
                  <td className="px-4 py-3 w-40">
                    <CriticalityBar score={item.criticality_score} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.due_date)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn('text-xs px-2.5 py-1 rounded-full font-medium border', STATUS_COLORS[item.status])}
                    >
                      {STATUS_LABELS[item.status]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
