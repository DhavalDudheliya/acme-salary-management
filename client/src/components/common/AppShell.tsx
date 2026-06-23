import { NavLink, Outlet } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { primaryRoutes } from '@/controllers/navigation-controller'

export function AppShell() {
  return (
    <div className="grid min-h-svh bg-muted/30 lg:h-svh lg:grid-cols-[260px_minmax(0,1fr)] lg:overflow-hidden">
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
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 p-5 lg:overflow-auto lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
