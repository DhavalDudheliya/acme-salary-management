import type { ReactNode } from 'react'

import { primaryRoutes } from '@/controllers/navigation-controller'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="grid min-h-svh bg-muted/30 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="border-border bg-background border-b p-5 lg:border-r lg:border-b-0" aria-label="Primary navigation">
        <div className="mb-8 flex items-center gap-3">
          <span className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-lg font-bold">
            A
          </span>
          <div>
            <strong className="block leading-tight">ACME Salary</strong>
            <span className="text-muted-foreground block text-sm">HR management</span>
          </div>
        </div>

        <nav className="grid gap-1">
          {primaryRoutes.map((route) => (
            <a
              key={route.path}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
              href={route.path}
              aria-current={route.path === '/employees' ? 'page' : undefined}
            >
              {route.label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 p-5 lg:p-8">{children}</main>
    </div>
  )
}
