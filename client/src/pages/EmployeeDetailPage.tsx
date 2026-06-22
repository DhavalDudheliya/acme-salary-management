import { useParams } from 'react-router-dom'

import { EmployeeDetail } from '../modules/employees/views/EmployeeDetail'

export function EmployeeDetailPage() {
  const { id } = useParams()
  return <EmployeeDetail id={id} />
}
