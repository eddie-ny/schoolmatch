// Result cards shared by Home, Find a School, School pages, Scholarships and Interested.
import { useEffect, useRef, useState } from 'react'
import { schoolCategory, schoolCategoryLabel } from '../lib/schoolCategory'
import { Link, useLocation } from 'react-router-dom'
import { isLocal } from '../hooks/useCatalog'
import { Badge, LockedRows, VerifiedBadges } from './ui'
import { variantLabel } from '../lib/variants'
import { logoFor } from '../lib/logos'

// The school's logo when we have one, otherwise a square with its initials.
// Kinds of school that have too many members to collect a logo for each one get a shared icon instead of initials.
const KIND_ICONS = {
  'Nursing college': 'M12 21s-7.5-4.6-9.6-9.2C1 8.7 2.7 5 6.3 5c2.1 0 3.7 1.2 5.7 3.3C14 6.2 15.6 5 17.7 5c3.6 0 5.300 3.7 3.900 6.800C19.500 16.400 12 21 12 21z',
  'College of Education': 'M12 3 1 9l11 6 9-4.9V17h2V9L12 3zM5 13.200V17c0 1.700 3.100 3 7 3s7-1.300 7-3v-3.800l-7 3.800-7-3.800z',
}
export function Monogram({ name, logo, kind, className = '' }) {
  const [broken, setBroken] = useState(false)
  logo = logo || logoFor(name)
  if ((!logo || broken) && KIND_ICONS[kind]) {
    return (
      <span aria-hidden="true" className={`shrink-0 w-12 h-12 rounded-xl border border-neutral-200 bg-brand-green-soft flex items-center justify-center text-neutral-800 ${className}`}>
        <svg viewBox="0 0 24 24" className="w-1/2 h-1/2" fill="currentColor"><path d={KIND_ICONS[kind]} /></svg>
      </span>
    )
  }
  if (logo && !broken) {
    return (
      <span aria-hidden="true" className={`shrink-0 w-12 h-12 rounded-xl border border-neutral-200 bg-white flex items-center justify-center overflow-hidden ${className}`}>
        <img src={logo} alt="" loading="lazy" className="max-w-full max-h-full object-contain p-1" onError={() => setBroken(true)} />
      </span>
    )
  }
  const initials = (name || '?').replace(/\(.*?\)/g, '').split(/\s+/).filter((w) => /^[A-Za-z]/.test(w) && !['of', 'for', 'and', 'the'].includes(w.toLowerCase())).slice(0, 3).map((w) => w[0].toUpperCase()).join('')
  return (
    <span aria-hidden="true" className={`shrink-0 w-12 h-12 rounded-xl border border-neutral-200 bg-brand-green-soft flex items-center justify-center font-heading font-bold text-sm text-neutral-800 ${className}`}>
      {initials || '?'}
    </span>
  )
}

export function HeartButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `Remove ${label} from your interested list` : `Add ${label} to your interested list`}
      className="shrink-0 w-11 h-11 -mr-2 -mt-2 inline-flex items-center justify-center rounded-full hover:bg-neutral-100"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill={active ? '#E5484D' : 'none'} stroke={active ? '#E5484D' : 'currentColor'} strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21s-7.5-4.6-9.6-9.2C1 8.7 2.7 5 6.3 5c2.1 0 3.7 1.2 5.7 3.3C14 6.2 15.600 5 17.700 5c3.600 0 5.300 3.700 3.900 6.800C19.500 16.400 12 21 12 21z" />
      </svg>
    </button>
  )
}

// One programme at one university. The card keeps to the basics. Everything else opens when it is pressed.
export function ProgramCard({ p, school, full, saved, onToggle, hideSchool = false }) {
  const abroad = !!school?.country && school.country.toLowerCase() !== 'ghana'
  const variants = p.variants || [p]
  const many = variants.length > 1
  const masters = p.level === 'Masters' // masters entry is by degree class, so there is no WASSCE cut-off or subject list
  const heart = <HeartButton active={saved} onClick={() => onToggle(p)} label={p.name} />
  return (
    <>
      <article className="card flex flex-col gap-3 hover:border-brand-orange transition-colors">
        {hideSchool ? (
          <div className="flex items-start gap-3">
            <h3 className="text-lg font-bold leading-snug break-words flex-1">{p.name}</h3>
            {heart}
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <Monogram name={p.schoolName} logo={school?.logoUrl} kind={schoolCategory({ name: p.schoolName, category: school?.category })} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm leading-tight break-words">{p.schoolName}</p>
                <p className="text-sm text-neutral-600">{school?.city ? `${school.city}, ` : ''}{school?.country || 'Ghana'}</p>
              </div>
              {heart}
            </div>
            <h3 className="text-lg font-bold leading-snug break-words">{p.name}</h3>
          </>
        )}
        <div className="flex flex-wrap gap-2">
          {p.level && <Badge>{p.level}</Badge>}
          {p.field && <Badge>{p.field}</Badge>}
          {p.demo && <Badge tone="orange">Sample data</Badge>}
        </div>
        {full ? (
          masters ? (
            p.minDegreeClass && (
              <dl className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                <dt className="text-neutral-500">Degree class needed</dt>
                <dd>{p.minDegreeClass}</dd>
              </dl>
            )
          ) : p.entryQualification ? (
            <dl className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
              <dt className="text-neutral-500">You need</dt>
              <dd className="break-words">{p.entryQualification}</dd>
            </dl>
          ) : (
            variants.some((v) => v.cutoffAggregate != null) && (
              <ul className="text-sm space-y-1">
                {variants.filter((v) => v.cutoffAggregate != null).map((v) => (
                  <li key={v.id} className="flex justify-between gap-3">
                    <span className="text-neutral-500 break-words">{many || v.mode !== 'Regular' || v.campus ? variantLabel(v) : 'Cut-off aggregate'}</span>
                    <span className="font-medium shrink-0">{v.cutoffAggregate}</span>
                  </li>
                ))}
              </ul>
            )
          )
        ) : (
          <LockedRows rows={masters ? ['Degree class needed', 'Your chances'] : ['Cut-off aggregate', 'Entry requirements', 'Your chances']} />
        )}
        {full
          ? <Link to={`/${abroad ? 'international' : 'local'}/programs/${p.id}`} target="_blank" rel="noreferrer" className="btn btn-outline mt-auto">View programme information &rarr;</Link>
          : <Link to="/signup" className="btn btn-outline mt-auto">Read more</Link>}
      </article>
    </>
  )
}

export function ProgramBody({ p, variants = [p], school }) {
  const masters = p.level === 'Masters'
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Monogram name={p.schoolName} logo={school?.logoUrl} kind={schoolCategory({ name: p.schoolName, category: school?.category })} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm leading-tight break-words">{p.schoolName}</p>
          <p className="text-sm text-neutral-600">{school?.city ? `${school.city}, ` : ''}{school?.country || 'Ghana'}</p>
        </div>
      </div>
      <h2 className="text-xl font-bold leading-snug break-words">{p.name}</h2>
      <div className="flex flex-wrap gap-2">
        {p.level && <Badge>{p.level}</Badge>}
        {p.field && <Badge>{p.field}</Badge>}
        {p.demo && <Badge tone="orange">Sample data</Badge>}
      </div>
      {variants.map((v) => (
        <section key={v.id} className="rounded-xl border border-neutral-200 p-3 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{variantLabel(v)}</h3>
            {v.verified === false && !v.demo && <Badge>Unverified</Badge>}
          </div>
          <dl className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
            {v.entryQualification && (<><dt className="text-neutral-500">You need</dt><dd className="break-words">{v.entryQualification}</dd></>)}
            {!masters && (
              <>
                {v.cutoffAggregate != null && (<><dt className="text-neutral-500">Cut-off aggregate</dt><dd>{v.cutoffAggregate}{v.cutoffYear ? ` (${v.cutoffYear})` : ''}</dd></>)}
                {v.requirements?.length > 0 && (<><dt className="text-neutral-500">Requirements</dt><dd className="break-words">{v.requirements.map((r) => `${r.subject}${r.minGrade ? ' ' + r.minGrade : ''}`).join(', ')}</dd></>)}
              </>
            )}
            {v.satPolicy && (<><dt className="text-neutral-500">SAT</dt><dd>{{ required: 'Required', optional: 'Optional', not_considered: 'Not considered' }[v.satPolicy]}{v.satLow != null ? `. Usual range ${v.satLow} to ${v.satHigh ?? v.satLow}${v.cutoffYear ? ` (${v.cutoffYear})` : ''}` : ''}</dd></>)}
            {v.minWassceGrade && (<><dt className="text-neutral-500">WASSCE</dt><dd>{v.minWassceGrade} or better</dd></>)}
            {(v.minIelts != null || v.minToefl != null || v.minDuolingo != null || v.englishTestWaiver) && (<><dt className="text-neutral-500">English</dt><dd>{[v.englishTestWaiver && 'No test needed for Ghanaian citizens', v.minIelts != null && `IELTS ${v.minIelts}`, v.minToefl != null && `TOEFL ${v.minToefl}`, v.minDuolingo != null && `Duolingo ${v.minDuolingo}`].filter(Boolean).join(', ')}</dd></>)}
            {v.durationYears != null && (<><dt className="text-neutral-500">Duration</dt><dd>{v.durationYears} years</dd></>)}
            {v.minDegreeClass && (<><dt className="text-neutral-500">Degree class needed</dt><dd>{v.minDegreeClass}</dd></>)}
            {v.feesGhs != null && (<><dt className="text-neutral-500">Fees</dt><dd>GHS {Number(v.feesGhs).toLocaleString()}</dd></>)}
            {v.feesUsd != null && (<><dt className="text-neutral-500">Fees</dt><dd>USD {Number(v.feesUsd).toLocaleString()}</dd></>)}
          </dl>
          {v.entryNote && <p className="text-sm text-neutral-700 break-words">{v.entryNote}</p>}
        </section>
      ))}
      {school?.website && <a className="btn btn-orange" href={school.website} target="_blank" rel="noreferrer">School website</a>}
    </div>
  )
}

export function SchoolCard({ s, count, matches = [], matched, to, signedIn }) {
  const more = (matched ?? matches.length) - Math.min(matches.length, 3)
  return (
    <article className="card flex flex-col gap-3 hover:border-brand-orange transition-colors">
      <div className="flex items-start gap-3">
        <Monogram name={s.name} logo={s.logoUrl} kind={schoolCategory(s)} />
        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-snug break-words">{s.name}</h3>
          <p className="text-sm text-neutral-600">{[s.city, s.country].filter(Boolean).join(', ')}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge>{schoolCategoryLabel(s)}</Badge>
        {s.type && <Badge>{s.type}</Badge>}
        <Badge>{count === 0 ? 'Programmes not listed yet' : `${count} program${count === 1 ? '' : 's'}`}</Badge>
      </div>
      <VerifiedBadges item={s} />
      {matches.length > 0 && (
        <div className="text-sm">
          <p className="text-neutral-500">Matching programs</p>
          <ul className="list-disc pl-5">
            {matches.slice(0, 3).map((p) => <li key={p.id || p}>{p.name || p}</li>)}
          </ul>
          {more > 0 && <p className="text-neutral-500">and {more} more</p>}
        </div>
      )}
      {signedIn
        ? <Link to={to} className="btn btn-outline mt-auto">{matches.length > 0 ? 'See these programs' : 'View programmes'}</Link>
        : <Link to="/signup" className="btn btn-outline mt-auto">Sign in to see more</Link>}
    </article>
  )
}

export function ScholarshipCard({ s }) {
  const { pathname } = useLocation()
  const base = pathname.startsWith('/international') || !isLocal(s.country) ? '/international' : '/local'
  return (
    <article className="card flex flex-col gap-3 hover:border-brand-orange transition-colors">
      <div className="flex items-start gap-3">
        <Monogram name={s.funder || s.name} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm leading-tight break-words">{s.funder}</p>
          <p className="text-sm text-neutral-600">{s.country}</p>
        </div>
      </div>
      <h3 className="text-lg font-bold leading-snug break-words">
        <Link to={`${base}/scholarships/${s.id}`} target="_blank" rel="noreferrer" className="hover:underline">{s.name}</Link>
      </h3>
      <div className="flex flex-wrap gap-2">
        <Badge tone="green">{s.fundingType} funding</Badge>
        {s.gender && <Badge tone="orange">{s.gender === 'female' ? 'Women only' : 'Men only'}</Badge>}
      </div>
      <Link to={`${base}/scholarships/${s.id}`} target="_blank" rel="noreferrer" className="font-semibold text-sm text-brand-orange-ink hover:underline mt-auto self-end">View scholarship information &rarr;</Link>
    </article>
  )
}
