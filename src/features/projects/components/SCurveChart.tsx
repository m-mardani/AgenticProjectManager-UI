import { Calendar, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { cn } from '../../../lib/utils'
import type { SCurvePointOut } from '../../../types'

interface Props {
  data: SCurvePointOut[]
}

interface MetricCardProps {
  label: string
  value: string
  change?: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange'
}

function MetricCard({ label, value, change, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  }

  return (
    <div className={cn('rounded-lg border p-4', colorClasses[color])}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium opacity-80 mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change !== undefined && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium mt-1',
                change >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="opacity-60">{icon}</div>
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'short' })
  } catch {
    return dateStr
  }
}

function parseNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  return parseFloat(String(value)) || 0
}

export default function SCurveChart({ data }: Props) {
  const [activeView, setActiveView] = useState<'progress' | 'value'>('progress')

  // Transform data for chart
  const chartData = data.map(point => ({
    date: formatDate(point.date),
    fullDate: point.date,
    plannedProgress: parseNumber(point.planned_progress),
    actualProgress: parseNumber(point.actual_progress),
    earnedValue: parseNumber(point.earned_value),
    plannedValue: parseNumber(point.planned_value),
    costVariance: parseNumber(point.cost_variance),
    scheduleVariance: parseNumber(point.schedule_variance),
  }))

  // Calculate metrics from latest data point
  const latest = chartData[chartData.length - 1]
  const previous = chartData[chartData.length - 2]

  const metrics = {
    plannedProgress: latest?.plannedProgress || 0,
    actualProgress: latest?.actualProgress || 0,
    earnedValue: latest?.earnedValue || 0,
    scheduleVariance: latest?.scheduleVariance || 0,
    progressChange: previous ? (latest?.actualProgress || 0) - (previous?.actualProgress || 0) : 0,
  }

  return (
    <div className="space-y-4">
      {/* Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="پیشرفت برنامه"
          value={`${metrics.plannedProgress.toFixed(1)}%`}
          icon={<Calendar className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          label="پیشرفت واقعی"
          value={`${metrics.actualProgress.toFixed(1)}%`}
          change={metrics.progressChange}
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          label="ارزش کسب‌شده (EV)"
          value={`${metrics.earnedValue.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          label="انحراف زمانی (SV)"
          value={`${metrics.scheduleVariance >= 0 ? '+' : ''}${metrics.scheduleVariance.toFixed(1)}%`}
          icon={
            metrics.scheduleVariance >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />
          }
          color={metrics.scheduleVariance >= 0 ? 'green' : 'orange'}
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800">منحنی S – تحلیل پیشرفت</h3>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('progress')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                activeView === 'progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              پیشرفت (%)
            </button>
            <button
              onClick={() => setActiveView('value')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                activeView === 'value' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              ارزش (EV/PV)
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeView === 'progress' ? (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fontFamily: 'Vazirmatn', fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={v => `${v}%`}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  width={45}
                />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    const valueNum = typeof value === 'number' ? value : parseFloat(String(value)) || 0
                    return [`${valueNum.toFixed(1)}%`, name === 'plannedProgress' ? 'برنامه‌ریزی‌شده' : 'واقعی']
                  }}
                  contentStyle={{
                    fontFamily: 'Vazirmatn',
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                />
                <Legend
                  formatter={value => (value === 'plannedProgress' ? 'برنامه‌ریزی‌شده' : 'واقعی')}
                  wrapperStyle={{ fontFamily: 'Vazirmatn', fontSize: 12, paddingTop: 16 }}
                />
                <Area type="monotone" dataKey="plannedProgress" fill="url(#colorPlanned)" stroke="none" />
                <Area type="monotone" dataKey="actualProgress" fill="url(#colorActual)" stroke="none" />
                <Line
                  type="monotone"
                  dataKey="plannedProgress"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="actualProgress"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fontFamily: 'Vazirmatn', fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tickFormatter={v => v.toLocaleString()}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  width={65}
                />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    const valueNum = typeof value === 'number' ? value : parseFloat(String(value)) || 0
                    const labels: Record<string, string> = {
                      earnedValue: 'ارزش کسب‌شده',
                      plannedValue: 'ارزش برنامه',
                    }
                    return [valueNum.toLocaleString(), labels[name] || name]
                  }}
                  contentStyle={{
                    fontFamily: 'Vazirmatn',
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                />
                <Legend
                  formatter={value => {
                    const labels: Record<string, string> = {
                      earnedValue: 'ارزش کسب‌شده (EV)',
                      plannedValue: 'ارزش برنامه (PV)',
                    }
                    return labels[value] || value
                  }}
                  wrapperStyle={{ fontFamily: 'Vazirmatn', fontSize: 12, paddingTop: 16 }}
                />
                <Line
                  type="monotone"
                  dataKey="plannedValue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="earnedValue"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
