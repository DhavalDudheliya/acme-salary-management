import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { DistributionBucket } from '../api/dashboard-api'
import { bucketLabel } from '../utils/format'
import { ChartCard } from './ChartCard'

export function DistributionChart({
  data,
  currency,
}: {
  data: DistributionBucket[]
  currency: string
}) {
  const chartData = data.map((bucket) => ({
    label: bucketLabel(bucket, currency),
    count: bucket.count,
  }))

  return (
    <ChartCard title="Salary distribution">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} stroke="var(--muted-foreground)" />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" width={40} />
          <Tooltip
            cursor={{ fill: 'var(--muted)' }}
            formatter={(value) => [Number(value).toLocaleString(), 'Employees']}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
