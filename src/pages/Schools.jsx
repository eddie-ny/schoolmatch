import { clearSearchCache } from '../lib/api'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useScope } from '../hooks/useScope'
import { PageTitle, Pagination, Segmented, Spinner } from '../components/ui'
import { SchoolCard } from '../components/Cards'
import { useCountries, useDebounced } from '../components/Browse'
import { searchSchools } from '../lib/api'
import { FIELDS } from '../lib/constants'
import { SCHOOL_CATEGORIES } from '../lib/schoolCategory'

const PAGE = 12

// Schools are searched and paged on the server, so only 12 are downloaded at a time.
export function Schools() {
  const { user } = useAuth()
  const { scope, to, international } = useScope()
  const countries = useCountries(scope)
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const country = params.get('country') || ''
  const field = params.get('field') || ''
  const kind = params.get('kind') || ''
  const offers = params.get('offers') || ''
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1)
  const dq = useDebounced(q)
  const [state, setState] = useState({ rows: [], total: 0, loading: true, error: '' })

  useEffect(() => {
    let live = true
    setState((s) => ({ ...s, loading: true, error: '' }))
    searchSchools({ scope, q: dq, field, level: offers, kind, country, limit: PAGE, offset: (page - 1) * PAGE })
      .then((r) => live && setState({ ...r, loading: false, error: '' }))
      .catch((e) => live && setState({ rows: [], total: 0, loading: false, error: e.message }))
    return () => { live = false }
  }, [scope, dq, field, offers, kind, country, page])

  const setParam = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    next.delete('page')
    setParams(next, { replace: true })
  }
  const goPage = (n) => { const next = new URLSearchParams(params); if (n > 1) next.set('page', n); else next.delete('page'); setParams(next); window.scrollTo({ top: 0 }) }
  const { rows, total, loading, error } = state

  return (
    <div>
      <PageTitle title="Find a School" sub={international ? 'Universities abroad and their programs.' : 'Ghanaian universities and their programs.'} />
      <div className="space-y-3 mb-6">
        <input className="input" placeholder="Search by school, program (for example law), city or country" value={q} onChange={(e) => setParam('q', e.target.value)} />
        {!international && <Segmented value={kind} onChange={(v) => setParam('kind', v)} options={[{ value: '', label: 'All schools' }, ...SCHOOL_CATEGORIES.filter((c) => c.id !== 'Institute').map((c) => ({ value: c.id, label: c.label }))]} />}
        <div className="flex flex-wrap items-center gap-3">
          {international && <select className="input !w-auto !border-brand-orange" value={country} onChange={(e) => setParam('country', e.target.value)} aria-label="Country">
            <option value="">Any country</option>
            {countries.map((c) => <option key={c.country} value={c.country}>{c.country}</option>)}
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
        <p className="text-sm text-neutral-600" aria-live="polite">{loading ? 'Searching...' : `${total.toLocaleString()} result${total === 1 ? '' : 's'}`}</p>
      </div>
      {error && <p className="text-red-700 text-sm mb-3" role="alert">{error} <button type="button" className="underline font-semibold" onClick={() => { clearSearchCache(); window.location.reload() }}>Try again</button></p>}
      {loading && rows.length === 0 ? <Spinner /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map(({ school, count, matches, matched }) => {
            const query = new URLSearchParams()
            if (q) query.set('q', q)
            if (field) query.set('field', field)
            const qs = query.toString() ? `?${query.toString()}` : ''
            return <SchoolCard key={school.id} s={school} count={count} matches={matches} matched={matched} to={to(`/schools/${school.id}${qs}`)} signedIn={!!user} />
          })}
          {!loading && rows.length === 0 && !error && <p className="text-neutral-600">No schools match these filters yet.</p>}
        </div>
      )}
      <Pagination page={Math.min(page, Math.ceil(total / PAGE) || 1)} pages={Math.ceil(total / PAGE)} onChange={goPage} />
    </div>
  )
}
