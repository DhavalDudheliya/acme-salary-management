import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from '../components/common/AppShell'
import { DashboardPage } from '../pages/DashboardPage'
import { EmployeeDetailPage } from '../pages/EmployeeDetailPage'
import { EmployeesPage } from '../pages/EmployeesPage'
import { FxRatesPage } from '../pages/FxRatesPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export function RootRoute() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/employees" replace />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/:id" element={<EmployeeDetailPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="settings/fx" element={<FxRatesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
