import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../hooks/useCatalog'
import { BackLink, Gate, Spinner } from '../components/ui'
import { useScope } from '../hooks/useScope'
import { ProgramBody } from '../components/Cards'
import { groupPrograms } from '../lib/variants'

// One programme on its own page: reached from the eligibility results.
export default function ProgramDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { schools, programs, loading, intl } = useCatalog()
  const { to } = useScope()
  if (loading) return <Spinner />
  if (!user) return <Gate />
  const all = [...programs, ...(intl?.programs || [])]
  const hit = all.find((p) => p.id === id)
  if (!hit) return <BackLink to={to('/programs')}>Back to programs</BackLink>
  const variants = groupPrograms(all.filter((p) => p.schoolId === hit.schoolId && p.name === hit.name && (p.level || '') === (hit.level || '')))[0]
  const school = [...schools, ...(intl?.schools || [])].find((s) => s.id === hit.schoolId)
  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex flex-wrap gap-3">
        <BackLink to={to('/eligibility')}>Back to my results</BackLink>
        <Link to={to(`/schools/${hit.schoolId}`)} className="btn btn-outline !min-h-10 !px-4 text-sm">More at {hit.schoolName}</Link>
      </div>
      <div className="card">
        <ProgramBody p={variants} variants={variants.variants} school={school} />
      </div>
    </div>
  )
}
