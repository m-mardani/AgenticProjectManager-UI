import { useState } from 'react'
import type { MDRItem } from '../../../types'
import { cn } from '../../../lib/utils'
import { Search, ChevronUp, ChevronDown } from 'lucide-react'

interface Props {
  items: MDRItem[]
}

type SortKey = keyof MDRItem
type SortDir = 'asc' | 'desc'

const STATUS_LABELS = {
  critical: 'بحرانی',
  delayed: 'تأخیر',
  'on-track': 'در مسیر',
}

const STATUS_COLORS = {
  critical: 'bg-red-100 text-red-700',
  delayed: 'bg-yellow-100 text-yellow-700',
  'on-track': 'bg-green-100 text-green-700',
}

function CriticalityBar({ score }: { score: number }) {
  const color = score > 70 ? 'bg-red-500' : score > 40 ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-medium w-8 text-right">{score}</span>
    </div>
  )
}

export default function MDRTable({ items }: Props) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('criticalityScore')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = items
    .filter(item => item.discipline.includes(search))
    .sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number')
        return sortDir === 'asc' ? av - bv : bv - av
      return 0
    })

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 text-gray-300" />
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-blue-500" />
      : <ChevronDown className="w-3 h-3 text-blue-500" />
  }

  const Th = ({ label, col }: { label: string; col: SortKey }) => (
    <th
      onClick={() => handleSort(col)}
      className="px-4 py-3 text-right text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-900 select-none"
    >
      <div className="flex items-center gap-1 justify-end">
        <span>{label}</span>
        <SortIcon col={col} />
      </div>
    </th>
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">جدول MDR</h3>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجو در رشته‌ها..."
            className="pr-9 pl-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-52 text-right"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th label="رشته" col="discipline" />
              <Th label="کل اسناد" col="totalDocuments" />
              <Th label="صادرشده" col="issued" />
              <Th label="تأیید‌شده" col="approved" />
              <Th label="تأخیر" col="delayed" />
              <Th label="شاخص بحران" col="criticalityScore" />
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{item.discipline}</td>
                <td className="px-4 py-3 text-gray-700">{item.totalDocuments}</td>
                <td className="px-4 py-3 text-gray-700">{item.issued}</td>
                <td className="px-4 py-3 text-gray-700">{item.approved}</td>
                <td className="px-4 py-3">
                  <span className={cn('font-medium', item.delayed > 20 ? 'text-red-600' : 'text-yellow-600')}>
                    {item.delayed}
                  </span>
                </td>
                <td className="px-4 py-3 w-40">
                  <CriticalityBar score={item.criticalityScore} />
                </td>
                <td className="px-4 py-3">
                  <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', STATUS_COLORS[item.status])}>
                    {STATUS_LABELS[item.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
