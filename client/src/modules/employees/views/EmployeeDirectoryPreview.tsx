import { Button } from '@/components/ui/button'

const previewRows = [
  {
    name: 'Maya Shah',
    department: 'Engineering',
    country: 'India',
    salary: 'INR 3,200,000',
    status: 'Active',
  },
  {
    name: 'Elena Garcia',
    department: 'People',
    country: 'Spain',
    salary: 'EUR 92,000',
    status: 'Active',
  },
  {
    name: 'Noah Kim',
    department: 'Finance',
    country: 'United States',
    salary: 'USD 148,000',
    status: 'Active',
  },
]

export function EmployeeDirectoryPreview() {
  return (
    <section className="bg-card text-card-foreground overflow-hidden rounded-lg border" aria-labelledby="directory-heading">
      <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Employee directory</p>
          <h2 id="directory-heading" className="mt-1 text-xl font-semibold">
            Salary records at a glance
          </h2>
        </div>
        <Button type="button" variant="outline">
          Export CSV
        </Button>
      </div>

      <div className="grid gap-3 p-4 md:grid-cols-[2fr_1fr_1fr]" aria-label="Directory filters">
        <input
          className="border-input bg-background rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          type="search"
          placeholder="Search employees"
          aria-label="Search employees"
        />
        <select
          className="border-input bg-background rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Country"
        >
          <option>All countries</option>
        </select>
        <select
          className="border-input bg-background rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Department"
        >
          <option>All departments</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-muted-foreground border-b px-4 py-3 text-left text-xs font-semibold whitespace-nowrap">
                Name
              </th>
              <th className="text-muted-foreground border-b px-4 py-3 text-left text-xs font-semibold whitespace-nowrap">
                Department
              </th>
              <th className="text-muted-foreground border-b px-4 py-3 text-left text-xs font-semibold whitespace-nowrap">
                Country
              </th>
              <th className="text-muted-foreground border-b px-4 py-3 text-left text-xs font-semibold whitespace-nowrap">
                Current salary
              </th>
              <th className="text-muted-foreground border-b px-4 py-3 text-left text-xs font-semibold whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row) => (
              <tr key={row.name}>
                <td className="border-b px-4 py-3 whitespace-nowrap">{row.name}</td>
                <td className="border-b px-4 py-3 whitespace-nowrap">{row.department}</td>
                <td className="border-b px-4 py-3 whitespace-nowrap">{row.country}</td>
                <td className="border-b px-4 py-3 whitespace-nowrap">{row.salary}</td>
                <td className="border-b px-4 py-3 whitespace-nowrap">
                  <span className="bg-secondary text-secondary-foreground inline-flex rounded-full px-2 py-1 text-xs font-semibold">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
