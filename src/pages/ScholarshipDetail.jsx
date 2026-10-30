import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../hooks/useCatalog'
import { useScope } from '../hooks/useScope'
import { BackLink, Badge, Gate, PageTitle, Spinner, VerifiedBadges } from '../components/ui'
import { Monogram } from '../components/Cards'

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
export default function ScholarshipDetail() {
  const { id } = useParams()
  const { user, access } = useAuth()
  const { to } = useScope()
  const { scholarships, intl, loading } = useCatalog()
  if (loading) return <Spinner />
  if (!user) return <Gate />
  const s = [...scholarships, ...(intl?.scholarships || [])].find((x) => String(x.id) === id)
  if (!s) return <div className="space-y-3"><BackLink to={to('/scholarships')}>Back to scholarships</BackLink><p>This scholarship could not be found.</p></div>
  const full = access.level === 'full'

  return (
    <div className="space-y-6">
      <PageTitle title={s.name} />
      <BackLink to={to('/scholarships')}>Back to scholarships</BackLink>
      <div className="rounded-3xl overflow-hidden border border-neutral-200 bg-white">
        <div className="h-24 md:h-36 bg-gradient-to-br from-brand-green via-brand-green-soft to-brand-orange-soft" aria-hidden="true" />
        <div className="p-5 md:p-6 -mt-10">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 md:p-5 max-w-xl space-y-3">
            <div className="flex items-start gap-3">
              <Monogram name={s.funder || s.name} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm leading-tight break-words">{s.funder}</p>
                <p className="text-sm text-neutral-600">{s.country}</p>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight break-words">{s.name}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge tone="green">{s.fundingType} funding</Badge>
              {s.gender && <Badge tone="orange">{s.gender === 'female' ? 'Women only' : 'Men only'}</Badge>}
              {s.level && full && <Badge>{s.level}</Badge>}
            </div>
            <VerifiedBadges item={s} />
            {full && s.link && <a className="btn btn-orange w-full sm:w-auto" href={s.link} target="_blank" rel="noreferrer">Apply or visit the site</a>}
          </div>
        </div>
        {full && (
          <div className="border-t border-neutral-200 bg-neutral-50 p-4 md:px-6 flex flex-wrap gap-x-8 gap-y-3">
            <Fact label="Deadline">{s.deadline}</Fact>
            <Fact label="Funding">{s.fundingType}</Fact>
            <Fact label="Country">{s.country}</Fact>
            <Fact label="Level">{s.level}</Fact>
            <Fact label="Best aggregate">{s.minAggregate}</Fact>
          </div>
        )}
      </div>
      {!full ? <Gate text="Subscribe to see who can apply, the deadline and the link for this scholarship." /> : (
        <section className="space-y-2">
          <h2 className="text-xl font-bold">Who can apply</h2>
          <p className="text-neutral-800 whitespace-pre-line break-words">{s.criteria || 'The provider has not published detailed requirements. Use the link above to check with them.'}</p>
        </section>
      )}
    </div>
  )
}
