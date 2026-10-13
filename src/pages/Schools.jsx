import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog, isLocal } from '../hooks/useCatalog'
import { Gate, PageTitle, Segmented, VerifiedBadges } from '../components/ui'
import { ProgramCard, SchoolCard } from '../components/Cards'
import { useSaved } from '../hooks/useSaved'
import { FIELDS, SHOW_INTERNATIONAL } from '../lib/constants'

export function Schools() {
  const { user } = useAuth()
  const { schools, programs, loading } = useCatalog()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const where = params.get('where') || 'all'
  const field = params.get('field') || ''

  const setParam = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  // A school is listed when its own details match the search OR one of its programs does.
  // `matched` holds the programs that fit the search and field, so the card can show them.
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return schools
      .filter((s) => where === 'all' || (where === 'local' ? isLocal(s.country) : !isLocal(s.country)))
      .map((s) => {
        const own = programs.filter((p) => p.schoolId === s.id)
        const schoolHit = !needle || (s.name + ' ' + (s.city || '') + ' ' + s.country).toLowerCase().includes(needle)
        const inField = (p) => !field || (p.field || '').toLowerCase() === field.toLowerCase()
        const progHit = (p) => !needle || ((p.name || '') + ' ' + (p.field || '')).toLowerCase().includes(needle)
        const matched = own.filter((p) => inField(p) && (schoolHit || progHit(p)))
        // Program names show on the card only when a program search or a field is narrowing the list.
        const show = field ? matched : needle ? own.filter((p) => progHit(p)) : []
        return { s, count: own.length, show, keep: matched.length > 0 || (!field && schoolHit) }
      })
      .filter((x) => x.keep)
  }, [schools, programs, q, where, field])

  return (
    <div>
      <PageTitle title="Find a School" sub={SHOW_INTERNATIONAL ? 'Local and international schools and programs.' : 'Ghanaian universities and their programs.'} />
      <div className="space-y-3 mb-6">
        <input className="input" placeholder="Search by school, program (for example law), city or country" value={q} onChange={(e) => setParam('q', e.target.value)} />
        <div className="flex flex-wrap items-center gap-3">
          {SHOW_INTERNATIONAL && <Segmented value={where} onChange={(v) => setParam('where', v === 'all' ? '' : v)} options={[{ value: 'all', label: 'All' }, { value: 'local', label: 'Local' }, { value: 'intl', label: 'International' }]} />}
          <select className="input !w-auto" value={field} onChange={(e) => setParam('field', e.target.value)} aria-label="Field of study">
            <option value="">Any field</option>
            {FIELDS.map((f) => <option key={f.id}>{f.id}</option>)}
          </select>
        </div>
        <p className="text-sm text-neutral-600">{loading ? 'Loading...' : `${list.length} result${list.length === 1 ? '' : 's'}`}</p>
      </div>
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map(({ s, count, show }) => {
            const query = new URLSearchParams()
            if (q) query.set('q', q)
            if (field) query.set('field', field)
            const qs = query.toString() ? `?${query.toString()}` : ''
            return <SchoolCard key={s.id} s={s} count={count} matches={show} to={`/schools/${s.id}${qs}`} signedIn={!!user} />
          })}
          {list.length === 0 && <p className="text-neutral-600">No schools match these filters yet.</p>}
        </div>
      )}
    </div>
  )
}

export function SchoolDetail() {
  const { id } = useParams()
  const { user, access } = useAuth()
  const { schools, programs, loading } = useCatalog()
  const saved = useSaved()
  const [params, setParams] = useSearchParams()
  const school = schools.find((s) => s.id === id)
  const q = params.get('q') || ''
  const field = params.get('field') || ''
  const only = params.get('program') || ''
  const setParam = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  if (loading) return <p>Loading...</p>
  if (!school) return <p>School not found. <Link to="/schools" className="underline">Back to schools</Link></p>
  if (!user) return <Gate />

  const allProgs = programs.filter((p) => p.schoolId === school.id)
  const needle = q.trim().toLowerCase()
  const progs = allProgs.filter((p) =>
    (!only || p.id === only) &&
    (!field || (p.field || '').toLowerCase() === field.toLowerCase()) &&
    (!needle || ((p.name || '') + ' ' + (p.field || '')).toLowerCase().includes(needle))
  )
  const filtered = !!(only || field || needle)
  const full = access.level === 'full'

  return (
    <div className="space-y-5">
      <Link to="/schools" className="text-sm underline">Back to schools</Link>
      <div>
        <h1 className="text-2xl font-bold">{school.name}</h1>
        <p className="text-neutral-600">{[school.city, school.country].filter(Boolean).join(', ')}</p>
        <div className="mt-2"><VerifiedBadges item={school} /></div>
      </div>

      {full ? (
        <>
          {school.website && <a href={school.website} target="_blank" rel="noreferrer" className="underline">{school.website}</a>}
          <h2 className="text-lg font-bold">Programs</h2>
          <input className="input" placeholder="Search this school's programs (for example law)" value={q} onChange={(e) => { setParam('q', e.target.value); setParam('program', '') }} aria-label="Search programs at this school" />
          <p className="text-sm text-neutral-600">
            {filtered ? `Showing ${progs.length} of ${allProgs.length} programs. ` : `${allProgs.length} programs. `}
            {filtered && <button type="button" className="underline" onClick={() => setParams({}, { replace: true })}>Show all programs</button>}
          </p>
          {allProgs.length === 0 && <p className="text-neutral-600">No programs added yet.</p>}
          {allProgs.length > 0 && progs.length === 0 && <p className="text-neutral-600">No programs match. Clear the search to see them all.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {progs.map((p) => (
              <ProgramCard key={p.id} p={p} school={school} full={full} saved={saved.ids.has(p.id)} onToggle={saved.toggle} hideSchool />
            ))}
          </div>
        </>
      ) : (
        <>
          <p>{allProgs.length} program{allProgs.length === 1 ? '' : 's'} listed.</p>
          <Gate />
        </>
      )}
    </div>
  )
}
