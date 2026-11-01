import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { thumbUrl } from '../lib/thumb'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../hooks/useCatalog'
import { useScope } from '../hooks/useScope'
import { useSchoolScholarships } from '../hooks/useSchoolScholarships'
import { BackLink, Badge, Gate, PageTitle, Spinner, VerifiedBadges } from '../components/ui'
import { Monogram } from '../components/Cards'
import { getSchool } from '../lib/api'
import { buildSections, officialLink } from '../lib/scholarshipSections'

function Fact({ label, children }) {
  if (children == null || children === '' || children === false) return null
  return (
    <div className="min-w-[7.5rem]">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="font-semibold break-words">{children}</p>
    </div>
  )
}

// One scholarship on its own page: who gives it, what it covers, who can apply and where to apply.
// The details are split under short headings so they can be scanned, and an award from a school links to that school's page here.
export default function ScholarshipDetail() {
  const { id } = useParams()
  const { user, access } = useAuth()
  const { to } = useScope()
  const { scholarships, intl, loading } = useCatalog()
  const { schools } = useSchoolScholarships()
  const s = [...scholarships, ...(intl?.scholarships || [])].find((x) => String(x.id) === id)
  const school = s?.schoolId ? schools[s.schoolId] : null
  const [pic, setPic] = useState('')
  const [picBad, setPicBad] = useState(false)
  useEffect(() => {
    let live = true
    setPic(''); setPicBad(false)
    if (s?.schoolId) getSchool(s.schoolId).then((x) => live && setPic(x?.imageUrl || '')).catch(() => {})
    return () => { live = false }
  }, [s?.schoolId])
  const sections = useMemo(() => (s ? buildSections(s) : []), [s])
  if (loading) return <Spinner />
  if (!user) return <Gate />
  if (!s) return <div className="space-y-3"><BackLink to={to('/scholarships')}>Back to scholarships</BackLink><p>This scholarship could not be found.</p></div>
  const full = access.level === 'full'
  const link = officialLink(s.link)
  const schoolBase = school && String(school.country).toLowerCase() === 'ghana' ? '/local' : '/international'
  const showName = school?.name || s.funder

  return (
    <div className="space-y-6">
      <PageTitle title={s.name} />
      <BackLink to={to('/scholarships')}>Back to scholarships</BackLink>
      <div className="rounded-3xl overflow-hidden border border-neutral-200 bg-white">
        {pic && !picBad
          ? <img src={thumbUrl(pic, 960)} alt="" decoding="async" onError={() => setPicBad(true)} className="h-24 md:h-36 w-full object-cover" />
          : <div className="h-24 md:h-36 bg-gradient-to-br from-brand-green via-brand-green-soft to-brand-orange-soft" aria-hidden="true" />}
        <div className="p-5 md:p-6 -mt-10">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 md:p-5 max-w-xl space-y-3">
            <div className="flex items-start gap-3">
              <Monogram name={showName || s.name} logo={school?.logoUrl} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm leading-tight break-words">{showName}</p>
                <p className="text-sm text-neutral-600">{s.country}</p>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight break-words">{s.name}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge tone={s.fundingType === 'Not stated' ? 'gray' : 'green'}>{s.fundingType === 'Not stated' ? 'Funding not stated' : `${s.fundingType} funding`}</Badge>
              {s.gender && <Badge tone="orange">{s.gender === 'female' ? 'Women only' : 'Men only'}</Badge>}
              {s.level && full && <Badge>{s.level}</Badge>}
            </div>
            <VerifiedBadges item={s} />
            <div className="grid sm:grid-cols-2 gap-2 max-w-xl">
              {full && link && <a className="btn btn-orange w-full justify-center text-center" href={link} target="_blank" rel="noreferrer">Official page</a>}
              {school && <Link className="btn btn-outline w-full justify-center text-center" to={`${schoolBase}/schools/${school.id}`}>School and its programs</Link>}
            </div>
          </div>
        </div>
        {full && (
          <div className="border-t border-neutral-200 bg-neutral-50 p-4 md:px-6 flex flex-wrap gap-x-8 gap-y-3">
            <Fact label="Deadline">{s.deadline}</Fact>
            <Fact label="Funding">{s.fundingType === 'Not stated' ? 'Not stated by the funder' : s.fundingType}</Fact>
            <Fact label="Country">{s.country}</Fact>
            <Fact label="Level">{s.level}</Fact>
            <Fact label="Best aggregate">{s.minAggregate}</Fact>
          </div>
        )}
      </div>
      {!full ? <Gate text="Subscribe to see who can apply, the deadline and the link for this scholarship." /> : sections.length === 0 ? (
        <p className="text-neutral-800">The provider has not published detailed requirements. Use the link above to check with them.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((sec) => (
            <section key={sec.key} className="card !p-4 space-y-2">
              <h2 className="text-lg font-bold">{sec.heading}</h2>
              <ul className="list-disc pl-5 space-y-1 text-neutral-800 break-words">
                {sec.items.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
