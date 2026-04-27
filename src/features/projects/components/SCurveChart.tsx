import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { SCurveDataPoint } from '../../../types'

interface Props {
  data: SCurveDataPoint[]
}

export default function SCurveChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-6">منحنی S – پیشرفت پروژه</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fontFamily: 'Vazirmatn' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={v => `${v}%`}
            tick={{ fontSize: 12 }}
            tickLine={false}
            width={45}
          />
          <Tooltip
            formatter={(value, name: string) => [
              value !== null && value !== undefined ? `${value}%` : 'N/A',
              name === 'planned' ? 'برنامه‌ریزی‌شده' : 'واقعی',
            ]}
            contentStyle={{
              fontFamily: 'Vazirmatn',
              fontSize: 12,
              borderRadius: 8,
              border: '1px solid #e5e7eb',
            }}
          />
          <Legend
            formatter={value => (value === 'planned' ? 'برنامه‌ریزی‌شده' : 'واقعی')}
            wrapperStyle={{ fontFamily: 'Vazirmatn', fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="planned"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={{ r: 3, fill: '#3b82f6' }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#22c55e"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#22c55e' }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
