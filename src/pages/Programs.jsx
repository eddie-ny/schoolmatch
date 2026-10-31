import { clearSearchCache } from '../lib/api'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useScope } from '../hooks/useScope'
import { useSaved } from '../hooks/useSaved'
import { PageTitle, Pagination, Spinner } from '../components/ui'
import { ProgramResult, SearchBar, useCountries, useFields, useProgramSearch, PAGE_SIZE } from '../components/Browse'

// Every programme, searched on the server one page at a time so the page opens fast however many there are.
export default function Programs() {
  useAuth()
  const { scope, base, international } = useScope()
  const saved = useSaved()
  const fields = useFields(scope)
  const countries = useCountries(scope)
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const field = params.get('field') || ''
  const level = params.get('level') || ''
  const country = params.get('country') || ''
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1)
  const { rows, total, loading, error } = useProgramSearch({ scope, q, field, level, country, page })
  const pages = Math.ceil(total / PAGE_SIZE)

  const setParam = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    next.delete('page')
    setParams(next, { replace: true })
  }
  const goPage = (n) => { const next = new URLSearchParams(params); if (n > 1) next.set('page', n); else next.delete('page'); setParams(next); window.scrollTo({ top: 0 }) }

  return (
    <div>
      <PageTitle title={field ? `${field} programs` : 'Programs'} sub={international ? 'Programs at universities abroad. Press the heart to keep one.' : 'Every program, at every university. Press the heart to keep one.'} />
      <SearchBar q={q} onQ={(v) => setParam('q', v)} />
      <div className="mt-5 grid lg:grid-cols-[16rem_1fr] gap-6 items-start">
        <aside className="card !p-4 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Field of study</span>
            <select className="input mt-1" value={field} onChange={(e) => setParam('field', e.target.value)}>
              <option value="">Any field</option>
              {fields.map((f) => <option key={f.field} value={f.field}>{f.field} ({Number(f.n).toLocaleString()})</option>)}
            </select>
          </label>
          {international && (
            <label className="block">
              <span className="text-sm font-semibold">Country</span>
              <select className="input mt-1" value={country} onChange={(e) => setParam('country', e.target.value)}>
                <option value="">Any country</option>
                {countries.map((c) => <option key={c.country} value={c.country}>{c.country}</option>)}
              </select>
            </label>
          )}
          <label className="block">
            <span className="text-sm font-semibold">Level</span>
            <select className="input mt-1" value={level} onChange={(e) => setParam('level', e.target.value)}>
              <option value="">All levels</option>
              <option>Undergraduate</option>
              <option>Diploma</option>
              <option>Certificate</option>
              <option>Masters</option>
              <option>Graduate Certificate</option>
            </select>
          </label>
          {(q || field || level || country) && <button type="button" className="underline text-sm" onClick={() => setParams({}, { replace: true })}>Clear all filters</button>}
        </aside>
        <div className="space-y-4">
          <p className="text-sm text-neutral-600" aria-live="polite">{loading ? 'Searching...' : `${total.toLocaleString()} program${total === 1 ? '' : 's'}${pages > 1 ? `, page ${Math.min(page, pages)} of ${pages.toLocaleString()}` : ''}`}</p>
          {saved.error && <p className="text-red-700 text-sm" role="alert">{saved.error}</p>}
          {error && <p className="text-red-700 text-sm" role="alert">{error} <button type="button" className="underline font-semibold" onClick={() => { clearSearchCache(); window.location.reload() }}>Try again</button></p>}
          {loading && rows.length === 0 ? <Spinner /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rows.map((p) => <ProgramResult key={p.id} p={p} base={base} saved={saved.isSaved(p)} onToggle={saved.toggleProgram} />)}
            </div>
          )}
          {!loading && rows.length === 0 && !error && <p className="text-neutral-600">No programs match these filters yet.</p>}
          <Pagination page={Math.min(page, pages || 1)} pages={pages} onChange={goPage} />
        </div>
      </div>
    </div>
  )
}
