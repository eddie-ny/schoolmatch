import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../hooks/useCatalog'
import { useSaved } from '../hooks/useSaved'
import { Gate, PageTitle } from '../components/ui'
import { ProgramCard } from '../components/Cards'

// Programs the student hearted, grouped by university.
export default function Interested() {
  const { user, access } = useAuth()
  const { schools, programs, loading } = useCatalog()
  const saved = useSaved()
  const full = access.level === 'full'

  const groups = useMemo(() => {
    const byId = Object.fromEntries(schools.map((s) => [s.id, s]))
    const g = {}
    programs.filter((p) => saved.ids.has(p.id)).forEach((p) => { (g[p.schoolId] ||= { school: byId[p.schoolId], items: [] }).items.push(p) })
    return Object.values(g).sort((a, b) => (a.school?.name || '').localeCompare(b.school?.name || ''))
  }, [schools, programs, saved.ids])

  if (!user) return <Gate />
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <div className="space-y-6">
      <PageTitle title="Interested" sub="Programs you have marked with a heart, with their universities." />
      {saved.error && <p className="text-red-700 text-sm" role="alert">{saved.error}</p>}
      {loading ? <p>Loading...</p> : total === 0 ? (
        <div className="card space-y-3 max-w-xl">
          <p>You have not marked any programs yet. Press the heart on a program to keep it here.</p>
          <Link to="/schools" className="btn btn-orange">Find a school</Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-600">{total} program{total === 1 ? '' : 's'} at {groups.length} universit{groups.length === 1 ? 'y' : 'ies'}</p>
          {groups.map(({ school, items }) => (
            <section key={school?.id || items[0].schoolId} className="space-y-3">
              <h2 className="text-lg font-bold">{school?.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((p) => (
                  <ProgramCard key={p.id} p={p} school={school} full={full} saved onToggle={saved.toggle} hideSchool to={`/schools/${p.schoolId}?program=${p.id}`} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
