import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FIELDS, SHOW_INTERNATIONAL } from '../lib/constants'

const tasks = [
  { to: '/schools', title: 'Find a School', text: SHOW_INTERNATIONAL ? 'Search local and international schools and programs.' : 'Search Ghanaian universities and their programs.', bar: 'border-l-brand-orange' },
  ...(SHOW_INTERNATIONAL ? [{ to: '/abroad', title: 'Study Abroad', text: 'Compare entry rules, English waivers and costs.', bar: 'border-l-brand-green' }] : []),
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


// Original illustration drawn in the brand colours. The two floating cards describe real features only.
function HeroArt() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-brand-green-soft aspect-square w-full max-w-md mx-auto shadow-sm" aria-hidden="true">
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <circle cx="250" cy="140" r="95" fill="#FFD27A" />
        <path d="M30 400 V220 a115 115 0 0 1 230 0 V400 Z" fill="#B2DE2B" opacity="0.65" />
        {/* leaves */}
        <path d="M20 400 C40 330 90 300 150 290 C140 340 100 385 20 400 Z" fill="#5E9E4E" />
        <path d="M70 400 C90 350 130 330 180 330 C170 370 130 395 70 400 Z" fill="#9CCB6B" />
        {/* body */}
        <path d="M130 400 V300 a75 75 0 0 1 75 -75 h20 a75 75 0 0 1 75 75 V400 Z" fill="#FFB02E" />
        {/* arm */}
        <path d="M262 262 C290 270 312 300 328 340 L296 352 C284 322 270 304 250 296 Z" fill="#A9693F" />
        {/* neck and head */}
        <rect x="190" y="205" width="32" height="30" rx="10" fill="#A9693F" />
        <circle cx="206" cy="175" r="42" fill="#A9693F" />
        {/* hair */}
        <path d="M162 170 C158 128 190 112 214 116 C240 118 256 140 250 170 C240 150 220 144 196 146 C180 148 168 156 162 170 Z" fill="#26352B" />
        {/* plant pot */}
        <path d="M322 400 L330 366 H372 L378 400 Z" fill="#D9824E" />
        <path d="M350 366 C336 340 340 312 352 292 C368 316 366 344 350 366 Z" fill="#5E9E4E" />
        <path d="M352 366 C368 352 384 346 392 334 C388 356 376 366 352 366 Z" fill="#7FB55F" />
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
  const { user } = useAuth()

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
          <Link to="/eligibility" className="btn btn-orange !min-h-14 !px-8 text-lg">Check My Eligibility</Link>
          <Link to="/schools" className="btn btn-outline !min-h-14 !px-8 text-lg">Find a School</Link>
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

      {/* Pick a field: each tile opens the programs page for that field */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What do you want to study?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FIELDS.map((f) => (
            <Link
              key={f.id}
              to={`/programs?field=${encodeURIComponent(f.id)}`}
              className="text-left rounded-2xl border-2 border-neutral-200 p-4 min-h-24 transition hover:border-brand-orange hover:bg-brand-orange-soft"
            >
              <p className="font-heading font-bold">{f.id}</p>
              <p className="text-sm text-neutral-600 mt-1">{f.blurb}</p>
            </Link>
          ))}
        </div>
        <Link to="/programs" className="underline font-semibold">See all programs</Link>
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
