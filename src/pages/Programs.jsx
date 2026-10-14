import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../hooks/useCatalog'
import { useSaved } from '../hooks/useSaved'
import { PageTitle } from '../components/ui'
import { ProgramCard } from '../components/Cards'
import { FIELDS } from '../lib/constants'

const PAGE = 24

// Every programme at every university, with search and a field filter. Hearts add to the Interested page.
export default function Programs() {
  const { access } = useAuth()
  const { schools, programs, loading } = useCatalog()
  const saved = useSaved()
  const [params, setParams] = useSearchParams()
  const [shown, setShown] = useState(PAGE)
  const q = params.get('q') || ''
  const field = params.get('field') || ''
  const full = access.level === 'full'

  const setParam = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
    setShown(PAGE)
  }

  const schoolById = useMemo(() => Object.fromEntries(schools.map((s) => [s.id, s])), [schools])
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return programs
      .filter((p) => !field || (p.field || '').toLowerCase() === field.toLowerCase())
      .filter((p) => !needle || `${p.name} ${p.field || ''} ${p.schoolName}`.toLowerCase().includes(needle))
      .sort((a, b) => a.name.localeCompare(b.name) || a.schoolName.localeCompare(b.schoolName))
  }, [programs, q, field])

  return (
    <div>
      <PageTitle title="Programs" sub="Every program we have, at every university. Press the heart to keep one." />
      <div className="space-y-3 mb-6">
        <input className="input" placeholder="Search by program, field or university (for example law, nursing, KNUST)" value={q} onChange={(e) => setParam('q', e.target.value)} aria-label="Search programs" />
        <select className="input !w-auto" value={field} onChange={(e) => setParam('field', e.target.value)} aria-label="Field of study">
          <option value="">Any field</option>
          {FIELDS.map((f) => <option key={f.id}>{f.id}</option>)}
        </select>
        <p className="text-sm text-neutral-600">{loading ? 'Loading...' : `${list.length} program${list.length === 1 ? '' : 's'}`}</p>
        {saved.error && <p className="text-red-700 text-sm" role="alert">{saved.error}</p>}
      </div>
      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {list.slice(0, shown).map((p) => (
              <ProgramCard
                key={p.id}
                p={p}
                school={schoolById[p.schoolId]}
                full={full}
                saved={saved.ids.has(p.id)}
                onToggle={saved.toggle}
                to={full ? `/schools/${p.schoolId}?program=${p.id}` : null}
              />
            ))}
          </div>
          {list.length === 0 && <p className="text-neutral-600">No programs match these filters yet.</p>}
          {list.length > shown && (
            <div className="mt-6 text-center">
              <button className="btn btn-outline" onClick={() => setShown(shown + PAGE)}>Show more ({list.length - shown} left)</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
