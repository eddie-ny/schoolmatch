import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isLocal } from '../hooks/useCatalog'
import { useScope, useScopedCatalog } from '../hooks/useScope'
import { PageTitle, Pagination, Segmented } from '../components/ui'
import { SchoolCard } from '../components/Cards'
import { FIELDS, SHOW_INTERNATIONAL } from '../lib/constants'
import { SCHOOL_CATEGORIES, schoolCategory } from '../lib/schoolCategory'

const PAGE = 12

export function Schools() {
  const { user } = useAuth()
  const { schools, programs, loading } = useScopedCatalog()
  const { to, international } = useScope()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const where = params.get('where') || 'all'
  const country = params.get('country') || ''
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
  const countryList = useMemo(() => [...new Set(schools.filter((x) => x.programCount > 0 && !isLocal(x.country)).map((x) => x.country).filter(Boolean))].sort(), [schools])
  const hasKind = useMemo(() => new Set(schools.filter((x) => x.programCount > 0).map(schoolCategory)), [schools, programs])

  // A school is listed when its own details match the search OR one of its programs does.
  // `matched` holds the programs that fit the search and field, so the card can show them.
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return schools
      .filter((s) => where === 'all' || (where === 'local' ? isLocal(s.country) : !isLocal(s.country)))
      .filter((s) => !kind || schoolCategory(s) === kind)
      .filter((s) => !country || s.country === country)
      .map((s) => {
        const own = programs.filter((p) => p.schoolId === s.id)
        const schoolHit = !needle || (s.name + ' ' + (s.city || '') + ' ' + s.country).toLowerCase().includes(needle)
        const inField = (p) => !field || (p.field || '').toLowerCase() === field.toLowerCase()
        const progHit = (p) => !needle || ((p.name || '') + ' ' + (p.field || '')).toLowerCase().includes(needle)
        const matched = own.filter((p) => inField(p) && (!offers || (p.level || 'Undergraduate') === offers) && (schoolHit || progHit(p)))
        // Program names show on the card only when a program search or a field is narrowing the list.
        const show = field ? matched : needle ? own.filter((p) => progHit(p)) : []
        return { s, count: s.programCount || own.length, show, keep: matched.length > 0 || (!field && !offers && schoolHit) }
      })
      .filter((x) => x.keep && x.count > 0)
  }, [schools, programs, q, where, field, kind, offers, country])

  return (
    <div>
      <PageTitle title="Find a School" sub={international ? 'Universities abroad and their programs.' : 'Ghanaian universities and their programs.'} />
      <div className="space-y-3 mb-6">
        <input className="input" placeholder="Search by school, program (for example law), city or country" value={q} onChange={(e) => setParam('q', e.target.value)} />
        {!international && <Segmented value={kind} onChange={(v) => setParam('kind', v)} options={[{ value: '', label: 'All schools' }, ...SCHOOL_CATEGORIES.filter((c) => hasKind.has(c.id)).map((c) => ({ value: c.id, label: c.label }))]} />}
        <div className="flex flex-wrap items-center gap-3">
          {SHOW_INTERNATIONAL && <Segmented value={where} onChange={(v) => setParam('where', v === 'all' ? '' : v)} options={[{ value: 'all', label: 'All' }, { value: 'local', label: 'Local' }, { value: 'intl', label: 'International' }]} />}
          {international && <select className="input !w-auto !border-brand-orange" value={country} onChange={(e) => setParam('country', e.target.value)} aria-label="Country">
            <option value="">Any country</option>
            {countryList.map((c) => <option key={c}>{c}</option>)}
          </select>}
          {!international && <select className="input !w-auto !border-brand-orange" value={field} onChange={(e) => setParam('field', e.target.value)} aria-label="Field of study">
            <option value="">Any field</option>
            {FIELDS.map((f) => <option key={f.id}>{f.id}</option>)}
          </select>}
          {!international && <select className="input !w-auto !border-brand-orange" value={offers} onChange={(e) => setParam('offers', e.target.value)} aria-label="Level offered">
            <option value="">Any level</option>
            <option value="Undergraduate">Offers bachelor's degrees</option>
            <option value="Diploma">Offers diplomas and HND</option>
            <option value="Certificate">Offers certificates</option>
            <option value="Masters">Offers Masters</option>
          </select>}
        </div>
        <p className="text-sm text-neutral-600">{loading ? 'Loading...' : `${list.length} result${list.length === 1 ? '' : 's'}`}</p>
      </div>
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
