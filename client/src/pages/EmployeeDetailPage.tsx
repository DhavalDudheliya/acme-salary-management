import { Link, useParams } from 'react-router-dom'

export function EmployeeDetailPage() {
  const { id } = useParams()

  return (
    <div className="grid gap-2">
      <Link to="/employees" className="text-muted-foreground text-sm hover:underline">
        ← Back to directory
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight">Employee detail</h1>
      <p className="text-muted-foreground">Profile and salary history for {id} — coming next.</p>
    </div>
  )
}
