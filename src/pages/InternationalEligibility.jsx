import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../hooks/useCatalog'
import { useSaved } from '../hooks/useSaved'
import { PageTitle, Segmented, Spinner, Badge } from '../components/ui'
import { ProgramCard } from '../components/Cards'
import { DEGREE_CLASSES } from '../lib/constants'

// Eligibility for the International path. Bachelors go by SAT score, masters by degree class.
// Every program is listed with a plain label, so the student sees what they qualify for and what is out of reach.
const rank = (c) => DEGREE_CLASSES.indexOf(c)

function bachelorsLabel(p, sat) {
  if (p.satLow == null) return { text: 'SAT range not added yet', tone: 'gray', order: 2 }
  if (sat >= p.satLow) return { text: sat >= (p.satHigh ?? p.satLow) ? 'Meets the SAT range' : 'Within the SAT range', tone: 'green', order: 0 }
  return { text: `Below the SAT range (needs about ${p.satLow})`, tone: 'orange', order: 3 }
}
function mastersLabel(p, cls) {
  if (!p.minDegreeClass) return { text: 'No minimum class stated', tone: 'gray', order: 2 }
  return rank(cls) !== -1 && rank(cls) <= rank(p.minDegreeClass)
    ? { text: 'Meets the stated class', tone: 'green', order: 0 }
    : { text: `Below the stated class (${p.minDegreeClass})`, tone: 'orange', order: 3 }
}

export default function InternationalEligibility() {
  const { access } = useAuth()
  const { intl, loading } = useCatalog()
  const saved = useSaved()
  const [level, setLevel] = useState('Undergraduate')
  const [sat, setSat] = useState('')
  const [cls, setCls] = useState('')
  const full = access.level === 'full'
  const schoolById = useMemo(() => Object.fromEntries(intl.schools.map((s) => [s.id, s])), [intl.schools])
  const ready = level === 'Masters' ? !!cls : sat !== '' && Number(sat) >= 400 && Number(sat) <= 1600

  const rows = useMemo(() => {
    if (!ready) return []
    return intl.programs
      .filter((p) => (level === 'Masters') === (p.level === 'Masters'))
      .map((p) => ({ p, lab: level === 'Masters' ? mastersLabel(p, cls) : bachelorsLabel(p, Number(sat)) }))
      .sort((a, b) => a.lab.order - b.lab.order || a.p.name.localeCompare(b.p.name))
  }, [intl.programs, level, sat, cls, ready])

  return (
    <div>
      <PageTitle title="International eligibility" sub="Bachelors use your SAT score. Masters use your first degree class." />
      <div className="card space-y-4 mb-6">
        <Segmented value={level} onChange={setLevel} options={[{ value: 'Undergraduate', label: 'Bachelors' }, { value: 'Masters', label: 'Masters' }]} />
        {level === 'Masters' ? (
          <label className="block">
            <span className="block text-sm font-semibold mb-1">Your first degree class</span>
            <select className="input" value={cls} onChange={(e) => setCls(e.target.value)}>
              <option value="">Choose one</option>
              {DEGREE_CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
        ) : (
          <label className="block">
            <span className="block text-sm font-semibold mb-1">Your SAT score (400 to 1600)</span>
            <input className="input" type="number" inputMode="numeric" min="400" max="1600" step="10" placeholder="For example 1200" value={sat} onChange={(e) => setSat(e.target.value)} />
            <span className="block text-xs text-neutral-600 mt-1">No score yet? Take the short practice test first. It gives a practice score, not an official one.</span>
          </label>
        )}
      </div>
      {loading ? <Spinner /> : !ready ? (
        <p className="text-neutral-700">Enter your {level === 'Masters' ? 'degree class' : 'SAT score'} to see the programs.</p>
      ) : rows.length === 0 ? (
        <p className="text-neutral-700">We are adding international {level === 'Masters' ? 'masters' : 'bachelors'} programs. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {rows.map(({ p, lab }) => (
            <div key={p.id} className="space-y-2">
              <Badge tone={lab.tone}>{lab.text}</Badge>
              <ProgramCard p={p} school={schoolById[p.schoolId]} full={full} saved={saved.isSaved(p)} onToggle={saved.toggleProgram} />
            </div>
          ))}
        </div>
      )}
      <p className="text-sm text-neutral-600 mt-6">This is guidance, not a guarantee of admission. Always confirm requirements with the school.</p>
    </div>
  )
}
