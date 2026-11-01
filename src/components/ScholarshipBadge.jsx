import { Link } from 'react-router-dom'
import { forLevel, useSchoolScholarships } from '../hooks/useSchoolScholarships'

// "Scholarship available" tag for a programme or school card. It opens the best scholarship at that school (fully funded first).
// With more than one it says how many, and opens the school page where they are all listed.
export function ScholarshipBadge({ schoolId, base, masters = null }) {
  const { bySchool } = useSchoolScholarships()
  const all = bySchool[schoolId]
  if (!all?.length) return null
  const list = masters == null ? all : forLevel(all, masters)
  if (!list.length) return null
  const best = list[0]
  const many = list.length > 1
  const label = many ? `${list.length} scholarships available` : best.fundingType === 'Full' ? 'Fully funded scholarship available' : 'Scholarship available'
  const to = many ? `${base}/schools/${schoolId}#scholarships` : `${base}/scholarships/${best.id}`
  return (
    <Link to={to} target="_blank" rel="noreferrer" className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full hover:underline text-neutral-900 shadow-sm ${best.fundingType === 'Full' ? 'bg-brand-green' : 'bg-brand-orange'}`}>
      {label}
    </Link>
  )
}
