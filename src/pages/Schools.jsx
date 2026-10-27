import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isLocal } from '../hooks/useCatalog'
import { useScope, useScopedCatalog } from '../hooks/useScope'
import { BackLink, Gate, PageTitle, Pagination, Segmented, VerifiedBadges, Spinner } from '../components/ui'
import { Monogram, ProgramCard, SchoolCard } from '../components/Cards'
import { groupPrograms } from '../lib/variants'
import { useSaved } from '../hooks/useSaved'
import { FIELDS, SHOW_INTERNATIONAL } from '../lib/constants'
import { SCHOOL_CATEGORIES, schoolCategory } from '../lib/schoolCategory'

const PAGE = 12

export function Schools() {
  const { user } = useAuth()
  const { schools, programs, loading } = useScopedCatalog()
  const { to } = useScope()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const where = params.get('where') || 'all'
  const field = params.get('field') || ''
  const kind = params.get('kind') || ''
  const offers = params.get('offers') || ''

  // Change several query values in one go. Two separate calls would each start from the old values and the second would undo the first.
  const setParam = (k, v, clear = []) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    clear.forEach((c) => next.delete(c))
    next.delete('page')
    setParams(next, { replace: true })
  }
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1)
  const goPage = (n) => { const next = new URLSearchParams(params); if (n > 1) next.set('page', n); else next.delete('page'); setParams(next); window.scrollTo({ top: 0 }) }

  // Only schools with programmes are listed, and only the kinds that have at least one.
  const hasKind = useMemo(() => new Set(schools.filter((x) => programs.some((p) => p.schoolId === x.id)).map(schoolCategory)), [schools, programs])

  // A school is listed when its own details match the search OR one of its programs does.
  // `matched` holds the programs that fit the search and field, so the card can show them.
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return schools
      .filter((s) => where === 'all' || (where === 'local' ? isLocal(s.country) : !isLocal(s.country)))
      .filter((s) => !kind || schoolCategory(s) === kind)
      .map((s) => {
        const own = programs.filter((p) => p.schoolId === s.id)
        const schoolHit = !needle || (s.name + ' ' + (s.city || '') + ' ' + s.country).toLowerCase().includes(needle)
        const inField = (p) => !field || (p.field || '').toLowerCase() === field.toLowerCase()
        const progHit = (p) => !needle || ((p.name || '') + ' ' + (p.field || '')).toLowerCase().includes(needle)
        const matched = own.filter((p) => inField(p) && (!offers || (p.level || 'Undergraduate') === offers) && (schoolHit || progHit(p)))
        // Program names show on the card only when a program search or a field is narrowing the list.
        const show = field ? matched : needle ? own.filter((p) => progHit(p)) : []
        return { s, count: own.length, show, keep: matched.length > 0 || (!field && !offers && schoolHit) }
      })
      .filter((x) => x.keep && x.count > 0)
  }, [schools, programs, q, where, field, kind, offers])

  return (
    <div>
      <PageTitle title="Find a School" sub={SHOW_INTERNATIONAL ? 'Local and international schools and programs.' : 'Ghanaian universities and their programs.'} />
      <div className="space-y-3 mb-6">
        <input className="input" placeholder="Search by school, program (for example law), city or country" value={q} onChange={(e) => setParam('q', e.target.value)} />
        <Segmented value={kind} onChange={(v) => setParam('kind', v)} options={[{ value: '', label: 'All schools' }, ...SCHOOL_CATEGORIES.filter((c) => hasKind.has(c.id)).map((c) => ({ value: c.id, label: c.label }))]} />
        <div className="flex flex-wrap items-center gap-3">
          {SHOW_INTERNATIONAL && <Segmented value={where} onChange={(v) => setParam('where', v === 'all' ? '' : v)} options={[{ value: 'all', label: 'All' }, { value: 'local', label: 'Local' }, { value: 'intl', label: 'International' }]} />}
          <select className="input !w-auto !border-brand-orange" value={field} onChange={(e) => setParam('field', e.target.value)} aria-label="Field of study">
            <option value="">Any field</option>
            {FIELDS.map((f) => <option key={f.id}>{f.id}</option>)}
          </select>
          <select className="input !w-auto !border-brand-orange" value={offers} onChange={(e) => setParam('offers', e.target.value)} aria-label="Level offered">
            <option value="">Any level</option>
            <option value="Undergraduate">Offers bachelor's degrees</option>
            <option value="Diploma">Offers diplomas and HND</option>
            <option value="Certificate">Offers certificates</option>
            <option value="Masters">Offers Masters</option>
          </select>
        </div>
        <p className="text-sm text-neutral-600">{loading ? 'Loading...' : `${list.length} result${list.length === 1 ? '' : 's'}`}</p>
      </div>
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.slice((page - 1) * PAGE, page * PAGE).map(({ s, count, show }) => {
            const query = new URLSearchParams()
            if (q) query.set('q', q)
            if (field) query.set('field', field)
            const qs = query.toString() ? `?${query.toString()}` : ''
            return <SchoolCard key={s.id} s={s} count={count} matches={show} to={to(`/schools/${s.id}${qs}`)} signedIn={!!user} />
          })}
          {list.length === 0 && <p className="text-neutral-600">No schools match these filters yet.</p>}
        </div>
      )}
      {!loading && <Pagination page={page} pages={Math.ceil(list.length / PAGE)} onChange={goPage} />}
    </div>
  )
}

export function SchoolDetail() {
  const { id } = useParams()
  const { user, access } = useAuth()
  const { schools, programs, loading } = useScopedCatalog()
  const { to } = useScope()
  const saved = useSaved()
  const [params, setParams] = useSearchParams()
  const school = schools.find((s) => s.id === id)
  const q = params.get('q') || ''
  const field = params.get('field') || ''
  const only = params.get('program') || ''
  const level = params.get('level') || ''
  const mode = params.get('mode') || ''
  const campus = params.get('campus') || ''
  const setParam = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    next.delete('page')
    setParams(next, { replace: true })
  }
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1)
  const goPage = (n) => { const next = new URLSearchParams(params); if (n > 1) next.set('page', n); else next.delete('page'); setParams(next); window.scrollTo({ top: 0 }) }

  if (loading) return <Spinner />
  if (!school) return <BackLink to={to('/schools')}>Back to schools</BackLink>
  if (!user) return <Gate />

  const allProgs = programs.filter((p) => p.schoolId === school.id)
  // Filters appear only where they can do something at this school: levels if it has both, then modes and campuses of the chosen level.
  const levelOf = (p) => p.level || 'Undergraduate'
  const levels = ['Undergraduate', 'Diploma', 'Certificate', 'Masters'].filter((l) => allProgs.some((p) => levelOf(p) === l))
  const inLevel = allProgs.filter((p) => !level || levelOf(p) === level)
  const modes = ['Regular', 'Fee-paying', 'Distance', 'Evening', 'Weekend', 'Sandwich'].filter((m) => inLevel.some((p) => (p.mode || 'Regular') === m))
  const campuses = [...new Set(inLevel.map((p) => p.campus).filter(Boolean))].sort()
  const needle = q.trim().toLowerCase()
  const progs = groupPrograms(allProgs.filter((p) =>
    (!only || p.id === only) &&
    (!level || levelOf(p) === level) &&
    (!mode || (p.mode || 'Regular') === mode) &&
    (!campus || p.campus === campus) &&
    (!field || (p.field || '').toLowerCase() === field.toLowerCase()) &&
    (!needle || ((p.name || '') + ' ' + (p.field || '')).toLowerCase().includes(needle))
  ))
  const filtered = !!(only || field || needle || level || mode || campus)
  const full = access.level === 'full'

  return (
    <div className="space-y-5">
      <BackLink to={to('/schools')}>Back to schools</BackLink>
      <div className="flex items-start gap-4">
        <Monogram name={school.name} logo={school.logoUrl} kind={schoolCategory(school)} className="!w-16 !h-16" />
        <div>
          <h1 className="text-2xl font-bold">{school.name}</h1>
          <p className="text-neutral-600">{[school.city, school.country].filter(Boolean).join(', ')}</p>
          <div className="mt-2"><VerifiedBadges item={school} /></div>
        </div>
      </div>

      {full ? (
        <>
          {school.website && <a href={school.website} target="_blank" rel="noreferrer" className="underline">{school.website}</a>}
          <h2 className="text-lg font-bold">Programs</h2>
          <input className="input" placeholder="Search this school's programs (for example law)" value={q} onChange={(e) => setParam('q', e.target.value, ['program'])} aria-label="Search programs at this school" />
          {levels.length > 1 && (
            <Segmented
              value={level}
              onChange={(v) => { const n = new URLSearchParams(params); n.delete('mode'); n.delete('campus'); n.delete('program'); n.delete('page'); if (v) n.set('level', v); else n.delete('level'); setParams(n, { replace: true }) }}
              options={[{ value: '', label: 'All levels' }, ...levels.map((l) => ({ value: l, label: l }))]}
            />
          )}
          {modes.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-neutral-600">Way of studying</span>
              <Segmented tone="sub" value={mode} onChange={(v) => setParam('mode', v)} options={[{ value: '', label: 'All' }, ...modes.map((m) => ({ value: m, label: m }))]} />
            </div>
          )}
          {campuses.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-neutral-600">Campus</span>
              <Segmented tone="sub" value={campus} onChange={(v) => setParam('campus', v)} options={[{ value: '', label: 'All' }, ...campuses.map((c) => ({ value: c, label: c }))]} />
            </div>
          )}
          <p className="text-sm text-neutral-600">
            {filtered ? `Showing ${progs.length} of ${new Set(allProgs.map((p) => `${p.name}|${p.level}`)).size} programs. ` : `${new Set(allProgs.map((p) => `${p.name}|${p.level}`)).size} programs. `}
            {filtered && <button type="button" className="underline" onClick={() => setParams({}, { replace: true })}>Show all programs</button>}
          </p>
          {allProgs.length === 0 && <p className="text-neutral-600">No programs added yet.</p>}
          {allProgs.length > 0 && progs.length === 0 && <p className="text-neutral-600">No programs match. Clear the search to see them all.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {progs.slice((page - 1) * PAGE, page * PAGE).map((p) => (
              <ProgramCard key={p.id} p={p} school={school} full={full} saved={saved.isSaved(p)} onToggle={saved.toggleProgram} hideSchool />
            ))}
          </div>
          <Pagination page={page} pages={Math.ceil(progs.length / PAGE)} onChange={goPage} />
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
