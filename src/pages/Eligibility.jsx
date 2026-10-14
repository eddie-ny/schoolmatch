import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { listEligibilityPrograms, checkEligibility } from '../lib/api'
import { CORE_SUBJECTS, ELECTIVE_SUBJECTS, GRADES, DISCLAIMER, FIELDS, SHOW_INTERNATIONAL } from '../lib/constants'
import { Badge, Field, Gate, PageTitle, RequireAuth, Segmented, Spinner } from '../components/ui'

const labelTone = {
  'Strong match': 'green',
  'Good chance': 'green',
  'Worth a try': 'orange',
  'Requirements met': 'gray',
  'Long shot': 'orange',
  'No data yet': 'gray',
  'Not yet eligible': 'gray',
}

function GradeSelect({ value, onChange }) {
  return (
    <select className="input" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">Grade</option>
      {GRADES.map((g) => <option key={g}>{g}</option>)}
    </select>
  )
}

function ResultCard({ item, highlight }) {
  return (
    <div className={`card space-y-2 ${highlight ? 'border-2 border-brand-orange' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={labelTone[item.label]}>{item.label}</Badge>
        {item.projection && <Badge tone="orange">Projection</Badge>}
        {item.demo && <Badge tone="orange">Sample data</Badge>}
      </div>
      <h3 className="font-bold">{item.programName}</h3>
      <p className="text-sm text-neutral-600">{item.schoolName}</p>
      <div className="text-sm space-y-1">
        {item.aggregate != null && (
          <p>Your aggregate: <b>{item.aggregate}</b>{item.cutoff != null ? ` · Usual cut-off: ${item.cutoff}` : ' · No cut-off data yet'}</p>
        )}
        {item.failures.length > 0 && (
          <ul className="list-disc ml-5 text-neutral-700">{item.failures.map((f) => <li key={f}>{f}</li>)}</ul>
        )}
        {item.notes.map((n) => <p key={n} className="text-neutral-600">{n}</p>)}
      </div>
    </div>
  )
}

function EligibilityInner() {
  const { user, saveResults } = useAuth()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  useEffect(() => { listEligibilityPrograms().then(setPrograms).catch((e) => setError(e.message)).finally(() => setLoading(false)) }, [])
  const saved = user.results
  const [mode, setMode] = useState(saved?.mode || 'final')
  const [grades, setGrades] = useState(saved?.grades || {})
  const [electives, setElectives] = useState(saved?.electives || ['', '', ''])
  const [sat, setSat] = useState(saved?.sat || '')
  const [scope, setScope] = useState(SHOW_INTERNATIONAL ? 'both' : 'local')
  const [field, setField] = useState('')
  const [programName, setProgramName] = useState('')
  const [output, setOutput] = useState(null)
  const [error, setError] = useState('')

  const scoped = useMemo(
    () => programs.filter((p) => scope === 'both' || (scope === 'local' ? !p.international : p.international)),
    [programs, scope]
  )

  // Program names offered in the chosen field (a program can be offered by several schools).
  const programNames = useMemo(
    () => [...new Set(scoped.filter((p) => p.field === field).map((p) => p.name))].sort(),
    [scoped, field]
  )

  const setGrade = (s) => (g) => setGrades({ ...grades, [s]: g })
  const pickElective = (i, name) => {
    const next = [...electives]
    next[i] = name
    setElectives(next)
  }

  const run = async (e) => {
    e.preventDefault()
    setError('')
    const chosen = electives.filter(Boolean)
    if (new Set(chosen).size !== chosen.length) return setError('Each elective can only be picked once.')
    if (!programName) return setError('Choose a field and the program you want to study.')

    const clean = {}
    ;[...CORE_SUBJECTS, ...chosen].forEach((s) => { if (grades[s]) clean[s] = grades[s] })

    setBusy(true)
    try {
      const res = await checkEligibility({ programName, scope, mode, grades: clean, electives: chosen, sat })
      setOutput(res)
    } catch (err) {
      setBusy(false)
      return setError(err.message)
    }
    setBusy(false)

    // Saved results are reused everywhere. A failed save must not be silent.
    try {
      await saveResults({ mode, grades: clean, electives: chosen, sat })
    } catch (err) {
      setError(`Your results were checked but could not be saved: ${err.message}`)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-8 max-w-3xl">
      <PageTitle title="Check My Eligibility" sub="Choose what you want to study. We check it first, then show every school that offers it." />

      <form onSubmit={run} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-bold text-lg">1. Your results</h2>
          <Segmented value={mode} onChange={setMode} options={[{ value: 'final', label: 'Final WASSCE results' }, { value: 'terminal', label: 'Terminal or mock' }]} />
          {mode === 'terminal' && <p className="text-sm text-neutral-600">Results will be labelled as a projection.</p>}

          <h3 className="font-semibold">Core subjects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CORE_SUBJECTS.map((s) => (
              <Field key={s} label={s}><GradeSelect value={grades[s]} onChange={setGrade(s)} /></Field>
            ))}
          </div>

          <h3 className="font-semibold">Elective subjects (best 3 count)</h3>
          <div className="space-y-3">
            {electives.map((name, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <select className="input" value={name} onChange={(e) => pickElective(i, e.target.value)}>
                  <option value="">Choose subject</option>
                  {ELECTIVE_SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <GradeSelect value={name ? grades[name] : ''} onChange={(g) => name && setGrade(name)(g)} />
              </div>
            ))}
            {electives.length < 5 && (
              <button type="button" className="btn btn-outline" onClick={() => setElectives([...electives, ''])}>Add another elective</button>
            )}
          </div>

          {SHOW_INTERNATIONAL && (<Field label="SAT or ACT score (optional)" hint="Used for international schools that publish a score range.">
            <input className="input" type="number" inputMode="numeric" value={sat} onChange={(e) => setSat(e.target.value)} />
          </Field>)}
        </div>

        <div className="card space-y-4">
          <h2 className="font-bold text-lg">2. What do you want to study?</h2>
          {SHOW_INTERNATIONAL && <Segmented value={scope} onChange={(v) => { setScope(v); setProgramName('') }} options={[{ value: 'local', label: 'Local' }, { value: 'intl', label: 'International' }, { value: 'both', label: 'Both' }]} />}
          <Field label="Field">
            <select className="input" value={field} onChange={(e) => { setField(e.target.value); setProgramName('') }}>
              <option value="">Select a field</option>
              {FIELDS.map((f) => <option key={f.id}>{f.id}</option>)}
            </select>
          </Field>
          {field && (
            <Field label="Program" hint={programNames.length === 0 ? 'No programs added for this field yet.' : ''}>
              <select className="input" value={programName} onChange={(e) => setProgramName(e.target.value)} disabled={programNames.length === 0}>
                <option value="">Select a program</option>
                {programNames.map((n) => <option key={n}>{n}</option>)}
              </select>
            </Field>
          )}
        </div>

        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button className="btn btn-orange w-full sm:w-auto" disabled={busy}>{busy ? 'Checking...' : 'Check eligibility'}</button>
      </form>

      {output && output.locked && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Results</h2>
          <p>We found {output.targetCount} school{output.targetCount === 1 ? '' : 's'} offering this program and {output.otherCount} other option{output.otherCount === 1 ? '' : 's'}.</p>
          <Gate text="Subscribe to see your aggregate, your match labels and how you rank." />
        </section>
      )}

      {output && !output.locked && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Results</h2>
          {output.aggregate != null
            ? <>
                <p>Your aggregate: <b>{output.aggregate}</b> (lower is better, 6 is the best possible).</p>
                <p className="text-sm text-neutral-600">Counted from English, Mathematics, Integrated Science (science programs) or Social Studies (other programs), plus your 3 best electives. You need at least C6 in each of the three core subjects.</p>
              </>
            : <p className="text-neutral-600">{output.reason}</p>}
          {output.mode === 'terminal' && <p className="text-sm font-semibold">These are projections based on terminal or mock grades.</p>}

          <h3 className="font-semibold">Schools offering {output.programName}</h3>
          {output.targets.length === 0 && <p className="text-neutral-600">No schools offer this program yet.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {output.targets.map((r) => <ResultCard key={r.programId} item={r} highlight />)}
          </div>

          <h3 className="font-semibold">Other programs you could consider, best first</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {output.others.map((r) => <ResultCard key={r.programId} item={r} />)}
          </div>
          <p className="text-xs text-neutral-500">{DISCLAIMER}</p>
        </section>
      )}
    </div>
  )
}

export default function Eligibility() {
  return (
    <RequireAuth needProfile>
      <EligibilityInner />
    </RequireAuth>
  )
}
