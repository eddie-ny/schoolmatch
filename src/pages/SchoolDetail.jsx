import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useScope } from '../hooks/useScope'
import { useSaved } from '../hooks/useSaved'
import { BackLink, Badge, Gate, Pagination, Spinner } from '../components/ui'
import { Monogram } from '../components/Cards'
import { ProgramResult, SearchBar, useFields, useProgramSearch, PAGE_SIZE } from '../components/Browse'
import { getSchool } from '../lib/api'
import { schoolCategory, schoolCategoryLabel } from '../lib/schoolCategory'

// A school's own page: who they are, then their programmes, searched and paged on the server.
export default function SchoolDetail() {
  const { id } = useParams()
  const { user, access } = useAuth()
  const { scope, base, to } = useScope()
  const saved = useSaved()
  const [params, setParams] = useSearchParams()
  const [school, setSchool] = useState(undefined)
  const [imgBad, setImgBad] = useState(false)
  const q = params.get('q') || ''
  const field = params.get('field') || ''
  const level = params.get('level') || ''
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1)
  const full = access.level === 'full'
  const fields = useFields(scope)
  const { rows, total, loading, error } = useProgramSearch({ scope: 'all', q, field, level, school: id, page })
  const pages = Math.ceil(total / PAGE_SIZE)

  useEffect(() => { let live = true; getSchool(id).then((s) => live && setSchool(s)).catch(() => live && setSchool(null)); return () => { live = false } }, [id])

  const setParam = (k, v) => { const n = new URLSearchParams(params); if (v) n.set(k, v); else n.delete(k); n.delete('page'); setParams(n, { replace: true }) }
  const goPage = (n) => { const next = new URLSearchParams(params); if (n > 1) next.set('page', n); else next.delete('page'); setParams(next); window.scrollTo({ top: 0 }) }

  if (school === undefined) return <Spinner />
  if (!school) return <BackLink to={to('/schools')}>Back to schools</BackLink>
  if (!user) return <Gate />
  const where = [school.city, school.country].filter(Boolean).join(', ')

  return (
    <div className="space-y-6">
      <BackLink to={to('/schools')}>Back to schools</BackLink>
      <div className="rounded-3xl overflow-hidden border border-neutral-200 bg-white">
        {school.imageUrl && !imgBad
          ? <img src={school.imageUrl} alt="" loading="lazy" onError={() => setImgBad(true)} className="h-32 md:h-48 w-full object-cover" />
          : <div className="h-32 md:h-48 bg-gradient-to-br from-brand-green via-brand-green-soft to-brand-orange-soft" aria-hidden="true" />}
        <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-start gap-4">
          <Monogram name={school.name} logo={school.logoUrl} kind={schoolCategory(school)} className="!w-20 !h-20 md:!w-28 md:!h-28 !rounded-2xl shadow-md border border-neutral-200 bg-white -mt-14 md:-mt-16 md:order-last shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight break-words">{school.name}</h1>
            <p className="text-neutral-600">{where}</p>
            <div className="flex flex-wrap gap-2">
              <Badge>{schoolCategoryLabel(school)}</Badge>
              {school.type && <Badge>{school.type}</Badge>}
              {school.verified === false && <Badge>Unverified</Badge>}
            </div>
            {school.website && <a href={school.website} target="_blank" rel="noreferrer" className="btn btn-orange mt-2">Visit university website</a>}
          </div>
        </div>
        <div className="border-t border-neutral-200 bg-neutral-50 grid grid-cols-2 sm:grid-cols-3 text-center">
          <div className="p-4"><p className="text-2xl font-extrabold">{school.programCount.toLocaleString()}</p><p className="text-sm text-neutral-600">Programs</p></div>
          <div className="p-4 border-l border-neutral-200"><p className="text-2xl font-extrabold">{school.country || '-'}</p><p className="text-sm text-neutral-600">Country</p></div>
          <div className="p-4 border-l border-neutral-200 hidden sm:block"><p className="text-2xl font-extrabold">{school.city || '-'}</p><p className="text-sm text-neutral-600">City</p></div>
        </div>
      </div>

      {school.description && (
        <section className="space-y-1">
          <h2 className="text-xl font-bold">About {school.name}</h2>
          <p className="text-neutral-800 break-words">{school.description}</p>
          {(school.descriptionCredit || school.imageCredit || school.logoCredit) && <p className="text-xs text-neutral-500">{[school.descriptionCredit, school.imageCredit, school.logoCredit].filter(Boolean).join(' | ')}</p>}
        </section>
      )}

      {!full ? (
        <><p>{school.programCount} program{school.programCount === 1 ? '' : 's'} listed.</p><Gate /></>
      ) : (
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Programs at {school.name}</h2>
          <SearchBar q={q} onQ={(v) => setParam('q', v)} placeholder="Search this school's programs (for example law)" />
          <div className="flex flex-wrap gap-3">
            <select className="input !w-auto !border-brand-orange" value={field} onChange={(e) => setParam('field', e.target.value)} aria-label="Field of study">
              <option value="">Any field</option>
              {fields.map((f) => <option key={f.field} value={f.field}>{f.field}</option>)}
            </select>
            <select className="input !w-auto !border-brand-green" value={level} onChange={(e) => setParam('level', e.target.value)} aria-label="Level">
              <option value="">All levels</option>
              <option>Undergraduate</option><option>Diploma</option><option>Certificate</option><option>Masters</option><option>Graduate Certificate</option>
            </select>
            {(q || field || level) && <button type="button" className="underline text-sm" onClick={() => setParams({}, { replace: true })}>Clear filters</button>}
          </div>
          <p className="text-sm text-neutral-600" aria-live="polite">{loading ? 'Searching...' : `${total.toLocaleString()} program${total === 1 ? '' : 's'}`}</p>
          {error && <p className="text-red-700 text-sm" role="alert">{error}</p>}
          {loading && rows.length === 0 ? <Spinner /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rows.map((p) => <ProgramResult key={p.id} p={p} base={base} saved={saved.isSaved(p)} onToggle={saved.toggleProgram} />)}
            </div>
          )}
          {!loading && rows.length === 0 && !error && <p className="text-neutral-600">No programs match. Clear the search to see them all.</p>}
          <Pagination page={Math.min(page, pages || 1)} pages={pages} onChange={goPage} />
        </section>
      )}
    </div>
  )
}
