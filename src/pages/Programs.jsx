import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useScopedCatalog } from '../hooks/useScope'
import { useSaved } from '../hooks/useSaved'
import { PageTitle, Pagination } from '../components/ui'
import { ProgramCard } from '../components/Cards'
import { FIELDS } from '../lib/constants'
import { groupPrograms } from '../lib/variants'

const PAGE = 24

// Every programme at every university, with search and a field filter. Hearts add to the Interested page.
export default function Programs() {
  const { access } = useAuth()
  const { schools, programs, loading } = useScopedCatalog()
  const saved = useSaved()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const field = params.get('field') || ''
  const level = params.get('level') || ''
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1)
  const full = access.level === 'full'

  const setParam = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    next.delete('page')
    setParams(next, { replace: true })
  }

  const schoolById = useMemo(() => Object.fromEntries(schools.map((s) => [s.id, s])), [schools])
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return groupPrograms(programs
      .filter((p) => !level || (p.level || 'Undergraduate').toLowerCase() === level.toLowerCase())
      .filter((p) => !field || (p.field || '').toLowerCase() === field.toLowerCase())
      .filter((p) => !needle || `${p.name} ${p.field || ''} ${p.schoolName}`.toLowerCase().includes(needle)))
      .sort((a, b) => a.name.localeCompare(b.name) || a.schoolName.localeCompare(b.schoolName))
  }, [programs, q, field, level])

  return (
    <div>
      <PageTitle title={field ? `${field} programs` : 'Programs'} sub="Every program we have, at every university. Press the heart to keep one." />
      <div className="space-y-3 mb-6">
        <input className="input" placeholder="Search by program, field or university (for example law, nursing, KNUST)" value={q} onChange={(e) => setParam('q', e.target.value)} aria-label="Search programs" />
        <select className="input !w-auto !border-brand-green" value={level} onChange={(e) => setParam('level', e.target.value)} aria-label="Level of study">
          <option value="">All levels</option>
          <option>Undergraduate</option>
          <option>Diploma</option>
          <option>Certificate</option>
          <option>Masters</option>
        </select>{' '}
        <select className="input !w-auto !border-brand-orange" value={field} onChange={(e) => setParam('field', e.target.value)} aria-label="Field of study">
          <option value="">Any field</option>
          {FIELDS.map((f) => <option key={f.id}>{f.id}</option>)}
        </select>
        <p className="text-sm text-neutral-600">{loading ? 'Loading...' : `${list.length} program${list.length === 1 ? '' : 's'}${list.length > PAGE ? `, page ${Math.min(page, Math.ceil(list.length / PAGE))} of ${Math.ceil(list.length / PAGE)}` : ''}`}</p>
        {saved.error && <p className="text-red-700 text-sm" role="alert">{saved.error}</p>}
      </div>
      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {list.slice((page - 1) * PAGE, page * PAGE).map((p) => (
              <ProgramCard
                key={p.id}
                p={p}
                school={schoolById[p.schoolId]}
                full={full}
                saved={saved.isSaved(p)}
                onToggle={saved.toggleProgram}
              />
            ))}
          </div>
          {list.length === 0 && <p className="text-neutral-600">No programs match these filters yet.</p>}
          <Pagination page={page} pages={Math.ceil(list.length / PAGE)} onChange={(n) => { const next = new URLSearchParams(params); if (n > 1) next.set('page', n); else next.delete('page'); setParams(next); window.scrollTo({ top: 0 }) }} />
        </>
      )}
    </div>
  )
}
