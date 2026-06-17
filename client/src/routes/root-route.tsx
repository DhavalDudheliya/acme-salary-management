import { AppShell } from '../components/common/AppShell'
import { EmployeesPage } from '../pages/EmployeesPage'

export function RootRoute() {
  return (
    <AppShell>
      <EmployeesPage />
    </AppShell>
  )
}
