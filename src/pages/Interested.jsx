import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../hooks/useCatalog'
import { useSaved } from '../hooks/useSaved'
import { Gate, PagedGrid, PageTitle, Spinner } from '../components/ui'
import { ProgramResult, asResult } from '../components/Browse'
import { groupPrograms } from '../lib/variants'
import { getProgramsFull } from '../lib/api'

// Programs the student hearted, grouped by university.
export default function Interested() {
  const { user, access } = useAuth()
  const cat = useCatalog()
  const saved = useSaved()
  const [programs, setPrograms] = useState([])
  const [busy, setBusy] = useState(false)
  const key = [...saved.ids].sort().join(',')
  // Only the hearted programmes are fetched, not the whole catalogue.
  useEffect(() => {
    let live = true
    setBusy(true)
    getProgramsFull([...saved.ids]).then((x) => live && setPrograms(x)).catch(() => live && setPrograms([])).finally(() => live && setBusy(false))
    return () => { live = false }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  const loading = cat.loading || busy
  const schools = [...cat.schools, ...cat.intl.schools]
  const full = access.level === 'full'

  const groups = useMemo(() => {
    const byId = Object.fromEntries(schools.map((s) => [s.id, s]))
    const g = {}
    groupPrograms(programs.filter((p) => saved.ids.has(p.id))).forEach((p) => { (g[p.schoolId] ||= { school: byId[p.schoolId], items: [] }).items.push(p) })
    return Object.values(g).sort((a, b) => (a.school?.name || '').localeCompare(b.school?.name || ''))
  }, [schools, programs, saved.ids])

  if (!user) return <Gate />
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <div className="space-y-6">
      <PageTitle title="Interested" sub="Programs you have marked with a heart, with their universities." />
      {saved.error && <p className="text-red-700 text-sm" role="alert">{saved.error}</p>}
      {loading ? <Spinner /> : total === 0 ? (
        <div className="card space-y-3 max-w-xl">
          <p>You have not marked any programs yet. Press the heart on a program to keep it here.</p>
          <Link to="/local/schools" className="btn btn-orange">Find a school</Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-600">{total} program{total === 1 ? '' : 's'} at {groups.length} universit{groups.length === 1 ? 'y' : 'ies'}</p>
          <PagedGrid
            items={groups}
            size={5}
            className="space-y-6"
            render={({ school, items }) => (
              <section key={school?.id || items[0].schoolId} className="space-y-3">
                <h2 className="text-lg font-bold">{school?.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((p) => (
                    <ProgramResult key={p.id} p={asResult(p, school)} base={school && school.country?.toLowerCase() !== 'ghana' ? '/international' : '/local'} saved onToggle={saved.toggleProgram} />
                  ))}
                </div>
              </section>
            )}
          />
        </>
      )}
    </div>
  )
}
