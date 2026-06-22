import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="grid gap-2">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <Link to="/employees" className="text-primary text-sm hover:underline">
        Go to the employee directory
      </Link>
    </div>
  )
}
