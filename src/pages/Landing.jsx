import { Link } from 'react-router-dom'
import { HeroArt } from './Home'

const info = [
  { to: '/schools', title: 'Find a School', text: 'Search Ghanaian universities and colleges.', bar: 'border-l-brand-green' },
  { to: '/programs', title: 'Programs', text: 'Every program, at every school.', bar: 'border-l-brand-orange' },
  { to: '/scholarships', title: 'Scholarships', text: 'Funding you can apply for.', bar: 'border-l-brand-green' },
  { to: '/eligibility', title: 'Check My Eligibility', text: 'Enter your results and see where you stand.', bar: 'border-l-brand-orange' },
]

// The first page a visitor sees. Two paths, Local and International, then the SAT call and the shared tools.
export default function Landing() {
  return (
    <div className="space-y-10">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Find where you can study, and whether you qualify.</h1>
          <p className="text-lg text-neutral-700">Pick your path. We show the schools and programs you can get into.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link to="/local" className="card border-2 border-brand-green hover:bg-brand-green-soft block">
              <p className="text-xl font-bold">Local</p>
              <p className="text-sm text-neutral-700 mt-1">Ghanaian universities. Bachelors and masters. WASSCE based.</p>
              <span className="btn btn-green mt-3">Study in Ghana</span>
            </Link>
            <Link to="/international" className="card border-2 border-brand-orange hover:bg-brand-orange-soft block">
              <p className="text-xl font-bold">International</p>
              <p className="text-sm text-neutral-700 mt-1">Universities abroad. Bachelors and masters. SAT based.</p>
              <span className="btn btn-orange mt-3">Study abroad</span>
            </Link>
          </div>
        </div>
        <HeroArt />
      </section>

      <section className="rounded-3xl bg-brand-green text-neutral-900 p-6 md:p-10 shadow-md">
        <p className="inline-block rounded-full bg-neutral-900 text-white text-xs font-extrabold px-3 py-1 uppercase tracking-wide">SAT classes</p>
        <h2 className="text-3xl md:text-5xl font-extrabold mt-3 leading-tight">Ready for International Admission?</h2>
        <p className="text-lg md:text-xl mt-2 text-neutral-800">Take your SAT today. Get admission.</p>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link to="/international/sat" className="btn !bg-neutral-900 !text-white !text-lg">Take a short SAT test</Link>
          <Link to="/international" className="btn !bg-white !text-neutral-900">See international schools</Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">More on WEMK</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {info.map((t) => (
            <Link key={t.to} to={t.to} className={`card border-l-8 ${t.bar} hover:bg-neutral-50 block`}>
              <p className="font-bold">{t.title}</p>
              <p className="text-sm text-neutral-600 mt-1">{t.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
