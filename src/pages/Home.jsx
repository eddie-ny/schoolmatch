import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog, isLocal } from '../hooks/useCatalog'
import { FIELDS } from '../lib/constants'
import { Badge, LockedRows, Segmented, VerifiedBadges } from '../components/ui'

const tasks = [
  { to: '/schools', title: 'Find a School', text: 'Search local and international schools and programs.', bar: 'border-l-brand-orange' },
  { to: '/abroad', title: 'Study Abroad', text: 'Compare entry rules, English waivers and costs.', bar: 'border-l-brand-green' },
  { to: '/scholarships', title: 'Find Scholarships', text: 'Browse funding by type and country.', bar: 'border-l-brand-orange' },
  { to: '/eligibility', title: 'Check My Eligibility', text: 'Enter your results and see where you stand.', bar: 'border-l-brand-green' },
]

const steps = [
  { n: '1', title: 'Create your account', text: 'Sign up free. Your 24-hour trial starts straight away.' },
  { n: '2', title: 'Complete your profile', text: 'Tell us the SHS you attended and the program you studied.' },
  { n: '3', title: 'Enter your results', text: 'Add your grades and we work out your aggregate.' },
  { n: '4', title: 'Pick what to study', text: 'Choose a program and see every school that offers it.' },
  { n: '5', title: 'See where you stand', text: 'Each school is labelled Strong match, Good chance or Worth a try.' },
]

// A sample of the result screen. It is an illustration only: generic names, no real school, no numbers.
const sample = [
  { name: 'School A', tag: 'Strong match', tone: 'bg-brand-green text-neutral-900' },
  { name: 'School B', tag: 'Good chance', tone: 'bg-brand-orange text-neutral-900' },
  { name: 'School C', tag: 'Worth a try', tone: 'bg-neutral-200 text-neutral-800' },
]

export default function Home() {
  const { user, access } = useAuth()
  const { schools, programs, scholarships, loading } = useCatalog()
  const [where, setWhere] = useState('all')
  const [funding, setFunding] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const [field, setField] = useState('')

  // One summary card per result. Schools count as self-funded options.
  const results = useMemo(() => {
    const out = []
    if (funding === 'all' || funding === 'self') {
      schools.forEach((x) => out.push({ kind: 'school', id: x.id, title: x.name, place: x.country, local: isLocal(x.country), tag: 'Self-funded', item: x }))
    }
    if (funding !== 'self') {
      scholarships.forEach((x) => {
        const ft = x.fundingType === 'Full' ? 'full' : 'partial'
        if (funding === 'all' || funding === ft) {
          out.push({ kind: 'scholarship', id: x.id, title: x.name, place: x.country, local: isLocal(x.country), tag: `${x.fundingType} funding`, item: x })
        }
      })
    }
    return out.filter((r) => where === 'all' || (where === 'local' ? r.local : !r.local))
  }, [schools, scholarships, where, funding])

  const fieldPrograms = useMemo(() => programs.filter((p) => p.field === field), [programs, field])
  const fieldSchoolCount = new Set(fieldPrograms.map((p) => p.schoolId)).size
  const full = access.level === 'full'
  const TEASE = 3 // how many programs a visitor sees before the rest are locked

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center pt-6 md:pt-12 max-w-3xl mx-auto">
        <span className="inline-block rounded-full bg-white border border-brand-orange/60 px-4 py-1.5 text-sm font-semibold">
          Free for your first 24 hours
        </span>
        <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-tight text-neutral-900">
          Find the right school for <span className="text-brand-orange">your results</span>
        </h1>
        <p className="mt-4 text-lg text-neutral-700 max-w-xl mx-auto">
          Check your eligibility for local and international schools, and find scholarships, all in one place.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/eligibility" className="btn btn-orange !min-h-14 !px-8 text-lg">Check My Eligibility</Link>
          <Link to="/schools" className="btn btn-outline !min-h-14 !px-8 text-lg">Find a School</Link>
        </div>
      </section>

      {/* What the result looks like */}
      <section className="max-w-xl mx-auto w-full space-y-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">Know exactly where you stand</h2>
        <p className="text-neutral-600">Pick a program and see each school that offers it, labelled by your chances.</p>
        <div className="card text-left shadow-sm space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Example only</p>
          {sample.map((r) => (
            <div key={r.name} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-4 py-3">
              <span className="font-semibold">{r.name}</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${r.tone}`}>{r.tag}</span>
            </div>
          ))}
          <p className="text-xs text-neutral-500">Your real results use your grades and each school's requirements.</p>
        </div>
      </section>

      {/* Four task cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tasks.map((t) => (
          <Link key={t.to} to={t.to} className={`rounded-2xl border border-neutral-200 border-l-8 ${t.bar} p-5 hover:shadow-md transition-shadow`}>
            <h2 className="text-lg font-bold">{t.title}</h2>
            <p className="text-neutral-600 mt-1">{t.text}</p>
          </Link>
        ))}
      </section>

      {/* Filters and one summary card per result */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Browse</h2>
        <div className="space-y-3">
          <Segmented
            value={where}
            onChange={setWhere}
            options={[{ value: 'all', label: 'All' }, { value: 'local', label: 'Local' }, { value: 'intl', label: 'International' }]}
          />
          <div>
            <Segmented
              value={funding}
              onChange={setFunding}
              options={[
                { value: 'all', label: 'Any funding' },
                { value: 'self', label: 'Self-funded' },
                { value: 'partial', label: 'Partial' },
                { value: 'full', label: 'Fully funded' },
              ]}
            />
          </div>
        </div>
        {!loading && <p className="text-sm text-neutral-600">{results.length} result{results.length === 1 ? '' : 's'}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-neutral-600">Nothing matches these filters yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(showAll ? results : results.slice(0, 6)).map((r) => (
              <div key={`${r.kind}-${r.id}`} className="card flex flex-col gap-3 hover:border-brand-orange transition-colors">
                <div className="flex flex-wrap gap-2">
                  <Badge tone={r.kind === 'school' ? 'orange' : 'green'}>{r.kind === 'school' ? 'School' : 'Scholarship'}</Badge>
                  <Badge>{r.tag}</Badge>
                </div>
                <div>
                  <h3 className="font-bold">{r.title}</h3>
                  <p className="text-sm text-neutral-600">{r.place}</p>
                </div>
                <VerifiedBadges item={r.item} />
                {!full && <LockedRows rows={r.kind === 'school' ? ['Entry requirements', 'Fees'] : ['Who can apply', 'Deadline']} />}
                {user ? (
                  <Link to={r.kind === 'school' ? `/schools/${r.id}` : '/scholarships'} className="btn btn-outline mt-auto">
                    {access.level === 'full' ? 'View details' : 'Read more'}
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-outline mt-auto">Sign in to see more</Link>
                )}
              </div>
            ))}
          </div>
        )}
        {!loading && results.length > 6 && (
          <button className="btn btn-outline" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show fewer' : `Show all ${results.length} results`}
          </button>
        )}
      </section>

      {/* Program first: pick a field, see a taste, the rest is locked */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What do you want to study?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FIELDS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setField(field === f.id ? '' : f.id)}
              aria-pressed={field === f.id}
              className={`text-left rounded-2xl border-2 p-4 min-h-24 transition ${
                field === f.id ? 'border-brand-orange bg-brand-orange-soft' : 'border-neutral-200 hover:border-brand-orange'
              }`}
            >
              <p className="font-heading font-bold">{f.id}</p>
              <p className="text-sm text-neutral-600 mt-1">{f.blurb}</p>
            </button>
          ))}
        </div>

        {field && (
          <div className="rounded-3xl border border-neutral-200 p-4 md:p-6 space-y-4">
            {fieldPrograms.length === 0 ? (
              <p className="text-neutral-600">No {field} programs have been added yet. Check back soon.</p>
            ) : (
              <>
                <p className="font-semibold">
                  {fieldPrograms.length} {field} program{fieldPrograms.length === 1 ? '' : 's'} at {fieldSchoolCount} school{fieldSchoolCount === 1 ? '' : 's'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(full ? fieldPrograms : fieldPrograms.slice(0, TEASE)).map((p) => (
                    <div key={p.id} className="card flex flex-col gap-3">
                      <div>
                        <h3 className="font-bold">{p.name}</h3>
                        <p className="text-sm text-neutral-600">{p.schoolName}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {p.level && <Badge>{p.level}</Badge>}
                        {p.demo && <Badge tone="orange">Sample data</Badge>}
                      </div>
                      {full ? (
                        <Link to={`/schools/${p.schoolId}`} className="btn btn-outline mt-auto">View details</Link>
                      ) : (
                        <LockedRows rows={['Entry requirements', 'Cut-off aggregate', 'Fees', 'Your chances']} />
                      )}
                    </div>
                  ))}
                  {!full && fieldPrograms.length > TEASE && (
                    <div className="card flex flex-col items-center justify-center text-center gap-2 bg-neutral-50 border-dashed">
                      <p className="font-heading text-2xl font-bold text-brand-orange">+{fieldPrograms.length - TEASE}</p>
                      <p className="text-sm text-neutral-600">more {field} programs are waiting for you</p>
                    </div>
                  )}
                </div>
                {!full && (
                  <div className="rounded-2xl bg-brand-orange-soft p-4 md:p-5 space-y-3">
                    <p className="font-semibold">
                      {user ? 'Subscribe to unlock requirements, fees, cut-offs and your chances.' : 'Sign up free to see requirements, fees, cut-offs and your chances.'}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {user ? (
                        <Link to="/pricing" className="btn btn-orange">See plans</Link>
                      ) : (
                        <>
                          <Link to="/signup" className="btn btn-orange">Sign up free</Link>
                          <Link to="/login" className="btn btn-outline">Sign in</Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>

      {/* Journey */}
      <section className="space-y-5 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Your journey</h2>
        <ol className="space-y-3">
          {steps.map((s) => (
            <li key={s.n} className="card flex items-start gap-4">
              <span className="shrink-0 inline-flex w-10 h-10 rounded-full bg-brand-green items-center justify-center font-heading font-bold">{s.n}</span>
              <div>
                <h3 className="font-bold">{s.title}</h3>
                <p className="text-sm text-neutral-600 mt-0.5">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {!user && (
        <section className="rounded-3xl bg-white border border-neutral-200 shadow-sm p-8 md:p-12 text-center space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold">Find your school. Know your chances.</h2>
          <p className="text-neutral-600">Create an account, add your grades and see where you stand. The first 24 hours are free.</p>
          <Link to="/signup" className="btn btn-orange !min-h-14 !px-8 text-lg">Create free account</Link>
        </section>
      )}
    </div>
  )
}
