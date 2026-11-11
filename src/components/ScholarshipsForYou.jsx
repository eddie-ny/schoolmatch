import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSchoolScholarships, forLevel } from '../hooks/useSchoolScholarships'
import { isLocal } from '../hooks/useCatalog'
import { matchScholarship } from '../lib/scholarshipMatch'
import { Badge, PagedGrid } from './ui'

const stateBadge = { meets: ['You fit', 'green'], unknown: ['Check details', 'gray'] }

// Scholarships the student may qualify for, checked against the same answers used for the school results.
// Only rules a scholarship states are used. Scholarships you do not fit or that have closed are left out.
// `me` is { gender, aggregate, sat }. `fields` is the course group(s) the student chose, for scholarships tied to a course.
export default function ScholarshipsForYou({ me, fields, masters, scope = 'local' }) {
  const { bySchool, external, loading } = useSchoolScholarships()
  const rows = useMemo(() => {
    const all = [...Object.values(bySchool).flat(), ...external]
    const mine = { ...me, fields: (fields || []).filter(Boolean) }
    const order = { meets: 0, unknown: 1 }
    return forLevel(all, masters)
      .filter((s) => (scope === 'local' ? isLocal(s.country) : !isLocal(s.country)))
      .map((s) => ({ s, m: matchScholarship(s, mine) }))
      .filter((r) => r.m.state === 'meets' || r.m.state === 'unknown')
      .sort((a, b) => order[a.m.state] - order[b.m.state] || Number(!!b.s.field) - Number(!!a.s.field))
  }, [bySchool, external, me, fields, masters, scope])
  if (loading) return null
  const base = scope === 'local' ? '/local' : '/international'
  return (
    <section className="space-y-3">
      <h3 className="font-semibold">Scholarships you may qualify for ({rows.length})</h3>
      <p className="text-sm text-neutral-600">Checked against your answers and the entry rules each scholarship states. "Check details" means the rules are not published, so confirm with the funder. Some scholarships are tied to a course and say so.</p>
      {rows.length === 0 && <p className="text-neutral-600">No open scholarships match your answers yet.</p>}
      <PagedGrid items={rows} render={({ s, m }) => (
        <div key={s.id} className="card space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={stateBadge[m.state][1]}>{stateBadge[m.state][0]}</Badge>
            <Badge>{s.fundingType === 'Not stated' ? 'Funding not stated' : `${s.fundingType} funding`}</Badge>
            {s.field && <Badge tone="orange">{String(s.field).split('|').join(' or ')} only</Badge>}
          </div>
          <Link to={`${base}/scholarships/${s.id}`} className="font-bold leading-snug hover:underline">{s.name}</Link>
          {s.funder && <p className="text-sm text-neutral-600">{s.funder}</p>}
          <ul className="list-disc ml-5 text-sm text-neutral-700">{m.reasons.slice(0, 3).map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      )} />
    </section>
  )
}
