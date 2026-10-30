// Building blocks for browsing programmes, in the style students expect from big study sites:
// a result card, a search hook that asks the server for one page, and a field filter list.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from './ui'
import { Monogram, HeartButton } from './Cards'
import { searchPrograms } from '../lib/api'
import { supabase } from '../lib/supabase'

export const PAGE_SIZE = 20

export function useDebounced(value, ms = 350) {
  const [v, setV] = useState(value)
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t) }, [value, ms])
  return v
}

// One page of programmes from the server. Reloads when the search, filters or page change.
export function useProgramSearch({ scope, q, field, level, school = null, country = '', page, size = PAGE_SIZE }) {
  const [state, setState] = useState({ rows: [], total: 0, loading: true, error: '' })
  const dq = useDebounced(q)
  useEffect(() => {
    let live = true
    setState((s) => ({ ...s, loading: true, error: '' }))
    searchPrograms({ scope, q: dq, field, level, school, country, limit: size, offset: (page - 1) * size })
      .then((r) => live && setState({ ...r, loading: false, error: '' }))
      .catch((e) => live && setState({ rows: [], total: 0, loading: false, error: e.message }))
    return () => { live = false }
  }, [scope, dq, field, level, school, country, page, size])
  return state
}

// The fields that exist for this side of the site, with how many programmes each has.
export function useFields(scope) {
  const [fields, setFields] = useState([])
  useEffect(() => {
    let live = true
    supabase.rpc('program_fields', { p_scope: scope === 'international' ? 'intl' : 'local' }).then(({ data }) => live && setFields(data || []))
    return () => { live = false }
  }, [scope])
  return fields
}

// The countries that have schools on this side of the site.
export function useCountries(scope) {
  const [list, setList] = useState([])
  useEffect(() => {
    let live = true
    supabase.rpc('program_countries', { p_scope: scope === 'international' ? 'intl' : 'local' }).then(({ data }) => live && setList(data || []))
    return () => { live = false }
  }, [scope])
  return list
}

const modeText = (modes) => (modes || []).filter((m) => m && m !== 'Regular').join(', ')

// A result card. The programme page opens in a new tab so the list stays where it was.
export function ProgramResult({ p, base, saved, onToggle }) {
  const where = [p.schoolCity, p.schoolCountry].filter(Boolean).join(', ')
  return (
    <article className="card !p-4 flex flex-col gap-3 hover:border-brand-orange transition-colors">
      <div className="flex items-start gap-3">
        <Monogram name={p.schoolName} logo={p.schoolLogo} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight break-words">{p.schoolName}</p>
          {where && <p className="text-sm text-neutral-600">{where}</p>}
        </div>
        <HeartButton active={saved} onClick={() => onToggle(p)} label={p.name} />
      </div>
      <h3 className="text-lg md:text-xl font-bold leading-snug break-words">
        <Link to={`${base}/programs/${p.id}`} target="_blank" rel="noreferrer" className="hover:underline">{p.name}</Link>
      </h3>
      <div className="flex flex-wrap gap-2">
        {p.level && <Badge>{p.level}</Badge>}
        {p.field && <Badge>{p.field}</Badge>}
        {modeText(p.modes) && <Badge>{modeText(p.modes)}</Badge>}
        {p.variantCount > 1 && <Badge>{p.variantCount} ways to study</Badge>}
      </div>
      <div className="mt-auto flex justify-end">
        <Link to={`${base}/programs/${p.id}`} target="_blank" rel="noreferrer" className="font-semibold text-sm text-brand-orange-ink hover:underline">View programme information &rarr;</Link>
      </div>
    </article>
  )
}

// The search box. Lime green border, no extra colours.
export function SearchBar({ q, onQ, placeholder = 'What do you want to study? (for example nursing, computer science, law)' }) {
  return <input className="input !border-2 !border-brand-green" placeholder={placeholder} value={q} onChange={(e) => onQ(e.target.value)} aria-label="Search programs" />
}

// Turns a full programme record plus its school into the shape the result card shows, so every list looks the same.
export function asResult(p, school) {
  return { ...p, schoolName: school?.name || p.schoolName, schoolCity: school?.city, schoolCountry: school?.country, schoolLogo: school?.logoUrl || p.schoolLogo,
    modes: [p.mode || 'Regular'], variantCount: p.variants?.length || 1 }
}
