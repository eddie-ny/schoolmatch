import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../hooks/useCatalog'
import { useSaved } from '../hooks/useSaved'
import { PageTitle, Segmented, Spinner, PagedGrid } from '../components/ui'
import { ProgramCard, ScholarshipCard } from '../components/Cards'

// Home of the International path: bachelors and masters abroad, with the SAT call on top.
export default function International() {
  const { access } = useAuth()
  const { intl, loading } = useCatalog()
  const saved = useSaved()
  const [level, setLevel] = useState('Undergraduate')
  const full = access.level === 'full'
  const schoolById = useMemo(() => Object.fromEntries(intl.schools.map((s) => [s.id, s])), [intl.schools])
  const list = useMemo(() => intl.programs.filter((p) => (level === 'Masters') === (p.level === 'Masters')), [intl.programs, level])

  return (
    <div className="space-y-8">
      <PageTitle title="International" sub="Universities abroad, with entry requirements checked against your SAT score or degree." />
      <section className="rounded-3xl bg-neutral-900 text-white p-6 md:p-8 border-4 border-brand-orange">
        <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">Ready for International Admission?</h2>
        <p className="text-lg mt-1 text-white/90">Take your SAT today. Get admission.</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link to="/international/sat" className="btn btn-orange">Take a short SAT test</Link>
          <Link to="/international/eligibility" className="btn !bg-white !text-neutral-900">Check my eligibility</Link>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <Segmented value={level} onChange={setLevel} options={[{ value: 'Undergraduate', label: 'Bachelors' }, { value: 'Masters', label: 'Masters' }]} />
        </div>
        {loading ? <Spinner /> : list.length === 0 ? (
          <p className="text-neutral-700">We are adding international {level === 'Masters' ? 'masters' : 'bachelors'} programs. Check back soon.</p>
        ) : (
          <PagedGrid items={list} size={10} render={(p) => (
            <ProgramCard key={p.id} p={p} school={schoolById[p.schoolId]} full={full} saved={saved.isSaved(p)} onToggle={saved.toggleProgram} />
          )} />
        )}
        <p className="text-sm text-neutral-600 mt-4">International listings are still being added.</p>
      </section>

      {intl.scholarships.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3">International scholarships</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {intl.scholarships.map((s) => <ScholarshipCard key={s.id} s={s} full={full} />)}
          </div>
        </section>
      )}
    </div>
  )
}
