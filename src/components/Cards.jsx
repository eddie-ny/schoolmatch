// Result cards shared by Home, Find a School, School pages, Scholarships and Interested.
import { useEffect, useRef, useState } from 'react'
import { schoolCategoryLabel } from '../lib/schoolCategory'
import { Link } from 'react-router-dom'
import { Badge, LockedRows, VerifiedBadges } from './ui'
import { variantLabel } from '../lib/variants'
import { logoFor } from '../lib/logos'

// The school's logo when we have one, otherwise a square with its initials.
export function Monogram({ name, logo, className = '' }) {
  const [broken, setBroken] = useState(false)
  logo = logo || logoFor(name)
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
  const [open, setOpen] = useState(false)
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
              <Monogram name={p.schoolName} logo={school?.logoUrl} />
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
          ? <button type="button" className="btn btn-outline mt-auto" onClick={() => setOpen(true)} aria-haspopup="dialog">View details</button>
          : <Link to="/signup" className="btn btn-outline mt-auto">Read more</Link>}
      </article>
      {open && <ProgramDetails p={p} variants={variants} school={school} onClose={() => setOpen(false)} />}
    </>
  )
}

// Everything we know about the programme, with each way of studying it in its own block.
function ProgramDetails({ p, variants, school, onClose }) {
  const box = useRef(null)
  const masters = p.level === 'Masters'
  useEffect(() => {
    const opener = document.activeElement
    box.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); if (opener && document.contains(opener)) opener.focus() }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        ref={box} tabIndex={-1} role="dialog" aria-modal="true" aria-label={p.name}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-auto p-5 space-y-4 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <Monogram name={p.schoolName} logo={school?.logoUrl} />
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
              {v.durationYears != null && (<><dt className="text-neutral-500">Duration</dt><dd>{v.durationYears} years</dd></>)}
              {v.minDegreeClass && (<><dt className="text-neutral-500">Degree class needed</dt><dd>{v.minDegreeClass}</dd></>)}
              {v.feesGhs != null && (<><dt className="text-neutral-500">Fees</dt><dd>GHS {Number(v.feesGhs).toLocaleString()}</dd></>)}
              {v.feesUsd != null && (<><dt className="text-neutral-500">Fees</dt><dd>USD {Number(v.feesUsd).toLocaleString()}</dd></>)}
            </dl>
            {v.entryNote && <p className="text-sm text-neutral-700 break-words">{v.entryNote}</p>}
          </section>
        ))}
        <div className="flex flex-wrap gap-3">
          {school?.website && <a className="btn btn-orange" href={school.website} target="_blank" rel="noreferrer">School website</a>}
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export function SchoolCard({ s, count, matches = [], to, signedIn }) {
  return (
    <article className="card flex flex-col gap-3 hover:border-brand-orange transition-colors">
      <div className="flex items-start gap-3">
        <Monogram name={s.name} logo={s.logoUrl} />
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
            {matches.slice(0, 3).map((p) => <li key={p.id}>{p.name}</li>)}
          </ul>
          {matches.length > 3 && <p className="text-neutral-500">and {matches.length - 3} more</p>}
        </div>
      )}
      {signedIn
        ? <Link to={to} className="btn btn-outline mt-auto">{matches.length > 0 ? 'See these programs' : 'View programmes'}</Link>
        : <Link to="/signup" className="btn btn-outline mt-auto">Sign in to see more</Link>}
    </article>
  )
}

export function ScholarshipCard({ s, full }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <article className="card flex flex-col gap-3 hover:border-brand-orange transition-colors">
        <div className="flex items-start gap-3">
          <Monogram name={s.funder || s.name} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm leading-tight break-words">{s.funder}</p>
            <p className="text-sm text-neutral-600">{s.country}</p>
          </div>
        </div>
        <h3 className="text-lg font-bold leading-snug break-words">{s.name}</h3>
        <div className="flex flex-wrap gap-2">
          <Badge tone="green">{s.fundingType} funding</Badge>
          {s.gender && <Badge tone="orange">{s.gender === 'female' ? 'Women only' : 'Men only'}</Badge>}
        </div>
        <button className="btn btn-outline mt-auto" onClick={() => setOpen(true)} aria-haspopup="dialog">See details</button>
      </article>
      {open && <ScholarshipDetails s={s} full={full} onClose={() => setOpen(false)} />}
    </>
  )
}

// Full details and the site link, opened from the card.
function ScholarshipDetails({ s, full, onClose }) {
  const box = useRef(null)
  useEffect(() => {
    const opener = document.activeElement
    box.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); if (opener && document.contains(opener)) opener.focus() }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        ref={box} tabIndex={-1} role="dialog" aria-modal="true" aria-label={s.name}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-auto p-5 space-y-4 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <Monogram name={s.funder || s.name} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm leading-tight break-words">{s.funder}</p>
            <p className="text-sm text-neutral-600">{s.country}</p>
          </div>
        </div>
        <h2 className="text-xl font-bold leading-snug break-words">{s.name}</h2>
        <div className="flex flex-wrap gap-2">
          <Badge tone="green">{s.fundingType} funding</Badge>
          {s.level && full && <Badge>{s.level}</Badge>}
        </div>
        <VerifiedBadges item={s} />
        {full ? (
          <dl className="text-sm grid grid-cols-2 gap-x-4 gap-y-2">
            {s.minAggregate != null && <><dt className="text-neutral-500">Best aggregate</dt><dd>{s.minAggregate}</dd></>}
            {s.deadline && <><dt className="text-neutral-500">Deadline</dt><dd>{s.deadline}</dd></>}
            {s.criteria && <><dt className="text-neutral-500">Who can apply</dt><dd className="break-words">{s.criteria}</dd></>}
          </dl>
        ) : (
          <LockedRows rows={['Who can apply', 'Deadline']} />
        )}
        <div className="flex flex-wrap gap-3">
          {full && s.link && <a className="btn btn-orange" href={s.link} target="_blank" rel="noreferrer">Visit site</a>}
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
