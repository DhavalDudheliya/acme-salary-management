import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { formatMoney } from '@/modules/employees/utils/format'

import { compactMoney } from '../utils/format'
import { ChartCard } from './ChartCard'

export interface BreakdownDatum {
  name: string
  payroll: number
  headcount: number
}

export function BreakdownChart({
  title,
  data,
  currency,
}: {
  title: string
  data: BreakdownDatum[]
  currency: string
}) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={Math.max(240, data.length * 30)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
        >
          <XAxis
            type="number"
            tickFormatter={(value: number) => compactMoney(value, currency)}
            tick={{ fontSize: 11 }}
            stroke="var(--muted-foreground)"
          />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 12 }}
            stroke="var(--muted-foreground)"
          />
          <Tooltip
            cursor={{ fill: 'var(--muted)' }}
            formatter={(value, _name, item) => [
              `${formatMoney(String(value), currency)} · ${Number(item?.payload?.headcount ?? 0).toLocaleString()} people`,
              'Payroll',
            ]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="payroll" fill="var(--primary)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
