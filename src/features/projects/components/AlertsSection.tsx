import { useState } from 'react'
import type { Alert } from '../../../types'
import { cn } from '../../../lib/utils'
import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react'

interface Props {
  alerts: Alert[]
}

const PRIORITY_LABELS = { P1: 'اولویت ۱', P2: 'اولویت ۲', P3: 'اولویت ۳' }
const PRIORITY_COLORS = {
  P1: { badge: 'bg-red-100 text-red-700 border-red-200', border: 'border-red-200', bg: 'bg-red-50' },
  P2: { badge: 'bg-orange-100 text-orange-700 border-orange-200', border: 'border-orange-200', bg: 'bg-orange-50' },
  P3: { badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', border: 'border-yellow-200', bg: 'bg-yellow-50' },
}

function AlertCard({ alert }: { alert: Alert }) {
  const [resolved, setResolved] = useState(alert.isResolved)
  const colors = PRIORITY_COLORS[alert.priority]

  return (
    <div className={cn('rounded-xl border p-4 transition-all', resolved ? 'opacity-60' : '', colors.border)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', colors.badge)}>
              {PRIORITY_LABELS[alert.priority]}
            </span>
            <span className="text-xs text-gray-400">{alert.date}</span>
            {resolved && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">حل‌شده</span>
            )}
          </div>
          <h4 className="font-semibold text-gray-900 text-sm leading-snug">{alert.title}</h4>
          <p className="text-gray-500 text-xs mt-1">{alert.description}</p>
          <div className="mt-2 text-xs text-gray-400">پروژه: <span className="text-gray-600 font-medium">{alert.projectName}</span></div>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setResolved(r => !r)}
          className={cn(
            'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors',
            resolved
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-green-600 text-white hover:bg-green-700'
          )}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          {resolved ? 'بازگشایی' : 'حل‌کردن'}
        </button>
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
          جزئیات
        </button>
      </div>
    </div>
  )
}

export default function AlertsSection({ alerts }: Props) {
  const p1 = alerts.filter(a => a.priority === 'P1')
  const p2 = alerts.filter(a => a.priority === 'P2')
  const p3 = alerts.filter(a => a.priority === 'P3')

  const groups = [
    { label: 'اولویت ۱ – بحرانی', alerts: p1, color: 'text-red-700', icon: 'bg-red-500' },
    { label: 'اولویت ۲ – مهم', alerts: p2, color: 'text-orange-700', icon: 'bg-orange-500' },
    { label: 'اولویت ۳ – معمولی', alerts: p3, color: 'text-yellow-700', icon: 'bg-yellow-500' },
  ]

  return (
    <div className="space-y-6">
      {groups.map(group => (
        group.alerts.length > 0 && (
          <div key={group.label}>
            <div className="flex items-center gap-2 mb-3">
              <div className={cn('w-2.5 h-2.5 rounded-full', group.icon)} />
              <h3 className={cn('text-sm font-bold', group.color)}>
                {group.label}
                <span className="mr-2 text-gray-400 font-normal">({group.alerts.length})</span>
              </h3>
            </div>
            <div className="space-y-3">
              {group.alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
            </div>
          </div>
        )
      ))}

      {alerts.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>هیچ هشداری وجود ندارد</p>
        </div>
      )}
    </div>
  )
}
