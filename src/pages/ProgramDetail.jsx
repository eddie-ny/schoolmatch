import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../hooks/useCatalog'
import { Gate, Spinner } from '../components/ui'
import { ProgramBody } from '../components/Cards'
import { groupPrograms } from '../lib/variants'

// One programme on its own page: reached from the eligibility results.
export default function ProgramDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { schools, programs, loading } = useCatalog()
  const { intl } = useCatalog()
  if (loading) return <Spinner />
  if (!user) return <Gate />
  const all = [...programs, ...(intl?.programs || [])]
  const hit = all.find((p) => p.id === id)
  if (!hit) return <p>Program not found. <Link to="/programs" className="underline">Back to programs</Link></p>
  const variants = groupPrograms(all.filter((p) => p.schoolId === hit.schoolId && p.name === hit.name && (p.level || '') === (hit.level || '')))[0]
  const school = [...schools, ...(intl?.schools || [])].find((s) => s.id === hit.schoolId)
  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex flex-wrap gap-4 text-sm">
        <Link to="/eligibility" className="underline">Back to my results</Link>
        <Link to={`/schools/${hit.schoolId}`} className="underline">More at {hit.schoolName}</Link>
      </div>
      <div className="card">
        <ProgramBody p={variants} variants={variants.variants} school={school} />
      </div>
    </div>
  )
}
