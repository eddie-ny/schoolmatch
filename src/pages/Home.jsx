import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog, isLocal, clearCatalogCache } from '../hooks/useCatalog'
import { FIELDS, SHOW_INTERNATIONAL } from '../lib/constants'
import { Segmented, Spinner } from '../components/ui'
import { SchoolCard, ScholarshipCard } from '../components/Cards'
import { SCHOOL_CATEGORIES, schoolCategory } from '../lib/schoolCategory'

const tasks = [
  { to: '/local/schools', title: 'Find a School', text: SHOW_INTERNATIONAL ? 'Search local and international schools and programs.' : 'Search Ghanaian universities and their programs.', bar: 'border-l-brand-orange' },
  ...(SHOW_INTERNATIONAL ? [{ to: '/abroad', title: 'Study Abroad', text: 'Compare entry rules, English waivers and costs.', bar: 'border-l-brand-green' }] : []),
  { to: '/local/programs', title: 'Find Programs', text: 'Every program, and the schools that offer it.', bar: 'border-l-brand-green' },
  { to: '/local/scholarships', title: 'Find Scholarships', text: 'Browse funding by type and country.', bar: 'border-l-brand-orange' },
  { to: '/local/eligibility', title: 'Check My Eligibility', text: 'Enter your results and see where you stand.', bar: 'border-l-brand-green' },
]

const steps = [
  { n: '1', title: 'Create your account', text: 'Sign up free. Your 24-hour trial starts straight away.' },
  { n: '2', title: 'Complete your profile', text: 'Tell us the SHS you attended and the program you studied.' },
  { n: '3', title: 'Enter your results', text: 'Add your grades and we work out your aggregate.' },
  { n: '4', title: 'Pick what to study', text: 'Choose a program and see every school that offers it.' },
  { n: '5', title: 'See where you stand', text: 'Each school is labelled Strong match, Good chance or Worth a try.' },
]


// Original illustration drawn in the brand colours. The two floating cards describe real features only.
export function HeroArt() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-brand-green-soft aspect-square w-full max-w-md mx-auto shadow-sm" aria-hidden="true">
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <circle cx="290" cy="110" r="52" fill="#FFD27A" />
        <path d="M0 400 V330 C80 300 160 310 400 320 V400 Z" fill="#B2DE2B" opacity="0.65" />
        {/* campus building */}
        <path d="M70 190 L200 120 L330 190 Z" fill="#26352B" />
        <rect x="86" y="190" width="228" height="14" fill="#3A4F40" />
        <rect x="100" y="204" width="24" height="104" rx="4" fill="#fff" />
        <rect x="150" y="204" width="24" height="104" rx="4" fill="#fff" />
        <rect x="226" y="204" width="24" height="104" rx="4" fill="#fff" />
        <rect x="276" y="204" width="24" height="104" rx="4" fill="#fff" />
        <path d="M184 308 V250 a16 16 0 0 1 32 0 V308 Z" fill="#FFB02E" />
        <rect x="70" y="308" width="260" height="14" rx="3" fill="#D9D9D9" />
        <rect x="56" y="322" width="288" height="14" rx="3" fill="#BDBDBD" />
        <circle cx="200" cy="168" r="9" fill="#FFB02E" />
        {/* trees */}
        <rect x="30" y="296" width="8" height="40" fill="#8A5A36" />
        <circle cx="34" cy="284" r="26" fill="#5E9E4E" />
        <rect x="364" y="300" width="8" height="36" fill="#8A5A36" />
        <circle cx="368" cy="288" r="24" fill="#7FB55F" />
        {/* books */}
        <rect x="120" y="352" width="90" height="16" rx="3" fill="#FFB02E" />
        <rect x="130" y="368" width="96" height="16" rx="3" fill="#5E9E4E" />
        {/* graduation cap */}
        <path d="M290 330 L340 346 L290 362 L240 346 Z" fill="#26352B" />
        <path d="M262 352 V366 C274 374 306 374 318 366 V352 L290 360 Z" fill="#3A4F40" />
      </svg>
      <div className="absolute top-5 left-4 bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl bg-brand-orange-soft flex items-center justify-center text-brand-orange font-bold">&#10022;</span>
        <div>
          <p className="font-heading font-bold text-sm">Scholarships</p>
          <p className="text-xs text-neutral-500">Browse by funding type</p>
        </div>
      </div>
      <div className="absolute bottom-5 right-4 bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-3 max-w-[70%]">
        <span className="w-9 h-9 rounded-full bg-brand-green-soft flex items-center justify-center font-bold">&#10003;</span>
        <div>
          <p className="font-heading font-bold text-sm">Check eligibility</p>
          <p className="text-xs text-neutral-500">See where you stand</p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { user, access } = useAuth()
  const nav = useNavigate()
  const { schools, scholarships, loading, error } = useCatalog()
  const progCount = useMemo(() => Object.fromEntries(schools.map((x) => [x.id, x.programCount || 0])), [schools])
  const [where, setWhere] = useState('all')
  const [funding, setFunding] = useState('all')
  const [browse, setBrowse] = useState('schools')
  const [kind, setKind] = useState('')

  // One summary card per result: either schools (filtered by kind of school) or scholarships (filtered by how much they pay).
  const results = useMemo(() => {
    const out = []
    if (browse === 'schools') {
      schools.filter((x) => (progCount[x.id] || 0) > 0 && (!kind || schoolCategory(x) === kind)).forEach((x) => out.push({ kind: 'school', id: x.id, local: isLocal(x.country), item: x }))
    } else {
      scholarships.forEach((x) => {
        const ft = x.fundingType === 'Full' ? 'full' : 'partial'
        if (funding === 'all' || funding === ft) out.push({ kind: 'scholarship', id: x.id, local: isLocal(x.country), item: x })
      })
    }
    return out.filter((r) => where === 'all' || (where === 'local' ? r.local : !r.local))
  }, [schools, scholarships, where, funding, browse, kind, progCount])

  const full = access.level === 'full'

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center pt-6 md:pt-12 max-w-3xl mx-auto">
        <span className="inline-block rounded-full bg-white border border-brand-orange/60 px-4 py-1.5 text-sm font-semibold">
          Free for your first 24 hours
        </span>
        <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-tight text-neutral-900">
          Find the <span className="text-[#9CC722]">right school</span> for <span className="text-[#FFB02E]">your results</span>
        </h1>
        <p className="mt-4 text-lg text-neutral-700 max-w-xl mx-auto">
          {SHOW_INTERNATIONAL ? 'Check your eligibility for local and international schools, and find scholarships, all in one place.' : 'Check your eligibility for Ghanaian universities and find scholarships, all in one place.'}
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/local/eligibility" className="btn btn-orange !min-h-14 !px-8 text-lg">Check My Eligibility</Link>
          <Link to="/local/schools" className="btn btn-outline !min-h-14 !px-8 text-lg">Find a School</Link>
        </div>
      </section>

      {/* Illustration */}
      <section className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto w-full">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-bold">Your results, matched to schools</h2>
          <p className="text-neutral-600 text-lg">
            Enter your grades, pick a program and see every school that offers it, labelled by your chances.
          </p>
          <Link to="/local/eligibility" className="btn btn-green">Try it now</Link>
        </div>
        <HeroArt />
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
          {SHOW_INTERNATIONAL && (
            <Segmented
              value={where}
              onChange={setWhere}
              options={[{ value: 'all', label: 'All' }, { value: 'local', label: 'Local' }, { value: 'intl', label: 'International' }]}
            />
          )}
          <Segmented value={browse} onChange={setBrowse} options={[{ value: 'schools', label: 'Schools' }, { value: 'scholarships', label: 'Scholarships' }]} />
          <div>
            {browse === 'schools' ? (
              <Segmented tone="sub" value={kind} onChange={setKind} options={[{ value: '', label: 'All schools' }, ...SCHOOL_CATEGORIES.filter((c) => schools.some((x) => progCount[x.id] > 0 && schoolCategory(x) === c.id)).map((c) => ({ value: c.id, label: c.label }))]} />
            ) : (
              <Segmented tone="sub" value={funding} onChange={setFunding} options={[{ value: 'all', label: 'Any scholarship' }, { value: 'partial', label: 'Covers part of the cost' }, { value: 'full', label: 'Covers all of the cost' }]} />
            )}
          </div>
        </div>
        {!loading && <p className="text-sm text-neutral-600">{results.length} result{results.length === 1 ? '' : 's'}</p>}

        {loading ? (
          <Spinner />
        ) : error ? (
          <div role="alert" className="space-y-2">
            <p className="text-red-700 text-sm">{error}</p>
            <button type="button" className="btn btn-outline" onClick={() => { clearCatalogCache(); window.location.reload() }}>Try again</button>
          </div>
        ) : results.length === 0 ? (
          <p className="text-neutral-600">Nothing matches these filters yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.slice(0, 6).map((r) => (
              r.kind === 'school'
                ? <SchoolCard key={`school-${r.id}`} s={r.item} count={progCount[r.id] || 0} to={`/local/schools/${r.id}`} signedIn={!!user} />
                : <ScholarshipCard key={`sch-${r.id}`} s={r.item} full={full} />
            ))}
          </div>
        )}
        {!loading && results.length > 6 && (
          <Link
            className="btn btn-outline"
            to={browse === 'schools' ? (kind ? `/local/schools?kind=${encodeURIComponent(kind)}` : '/local/schools') : (funding === 'all' ? '/local/scholarships' : `/local/scholarships?funding=${funding}`)}
          >
            {`See all ${results.length} ${browse === 'schools' ? 'schools' : 'scholarships'}`}
          </Link>
        )}
      </section>

      {/* Program first: pick a field, see a taste, the rest is locked */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What do you want to study?</h2>
        <form onSubmit={(e) => { e.preventDefault(); const v = e.currentTarget.elements.study.value.trim(); nav(`/local/programs${v ? `?q=${encodeURIComponent(v)}` : ''}`) }}>
          <input name="study" className="input !border-2 !border-brand-green" placeholder="Type a program, for example nursing, law or computer science, then press Enter" aria-label="Search programs" />
        </form>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FIELDS.map((f) => (
            <Link
              key={f.id}
              to={`/local/programs?field=${encodeURIComponent(f.id)}`}
              className="text-left rounded-2xl border-2 border-neutral-200 p-4 min-h-24 transition hover:border-brand-orange hover:bg-brand-orange-soft"
            >
              <p className="font-heading font-bold">{f.id}</p>
              <p className="text-sm text-neutral-600 mt-1">{f.blurb}</p>
            </Link>
          ))}
        </div>
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
