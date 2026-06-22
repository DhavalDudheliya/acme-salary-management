import type { ReactNode } from 'react'

export function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-card text-card-foreground rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  )
}
