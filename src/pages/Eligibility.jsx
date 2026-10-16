import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { listEligibilityPrograms, checkEligibility, checkMastersEligibility } from '../lib/api'
import { CORE_SUBJECTS, ELECTIVE_SUBJECTS, GRADES, DISCLAIMER, FIELDS, SHOW_INTERNATIONAL, DEGREE_CLASSES } from '../lib/constants'
import { Badge, Field, Gate, PageTitle, RequireAuth, Segmented, Spinner } from '../components/ui'

const labelTone = {
  'Strong match': 'green',
  'Good chance': 'green',
  'Worth a try': 'orange',
  'Requirements met': 'gray',
  'Long shot': 'orange',
  'No data yet': 'gray',
  'Not yet eligible': 'gray',
  'Meets stated class': 'green',
  'Class not published': 'gray',
  'Below stated class': 'orange',
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
        {item.label === 'Meets stated class' || item.label === 'Below stated class' || item.label === 'Class not published' ? (
          <p>{item.requiredClass ? `Lowest first-degree class the school states: ${item.requiredClass}` : 'The school does not publish a minimum class. Check with the school.'}</p>
        ) : null}
        {item.entryNote && <p className="text-neutral-600">{item.entryNote}</p>}
        {item.aggregate != null && (
          <p>Your aggregate: <b>{item.aggregate}</b>{item.cutoff != null ? ` · Usual cut-off: ${item.cutoff}` : ' · No cut-off data yet'}</p>
        )}
        {item.failures && item.failures.length > 0 && (
          <ul className="list-disc ml-5 text-neutral-700">{item.failures.map((f) => <li key={f}>{f}</li>)}</ul>
        )}
        {(item.notes || []).map((n) => <p key={n} className="text-neutral-600">{n}</p>)}
      </div>
    </div>
  )
}


// Type to search the programs, then pick one from the matches.
function ProgramPicker({ options, value, onChange, disabled }) {
  const [text, setText] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  useEffect(() => { setText(value || '') }, [value])

  const words = text.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const matches = useMemo(
    () => (words.length ? options.filter((n) => words.every((w) => n.toLowerCase().includes(w))) : options),
    [options, text] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const shown = matches.slice(0, 10)

  const pick = (name) => { onChange(name); setText(name); setOpen(false) }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, shown.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter' && open && shown[active]) { e.preventDefault(); pick(shown[active]) }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className="relative">
      <input
        className="input" type="text" role="combobox" aria-expanded={open} aria-controls="program-list" aria-autocomplete="list"
        placeholder="Start typing, for example nursing or law" autoComplete="off" disabled={disabled}
        value={text}
        onChange={(e) => { setText(e.target.value); setActive(0); setOpen(true); if (value) onChange('') }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKey}
      />
      {open && !disabled && (
        <ul id="program-list" role="listbox" className="absolute z-10 left-0 right-0 mt-1 max-h-72 overflow-auto rounded-xl border border-neutral-300 bg-white shadow-lg">
          {shown.map((n, i) => (
            <li key={n} role="option" aria-selected={i === active}
              className={`px-4 py-3 cursor-pointer text-sm ${i === active ? 'bg-brand-green-soft' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); pick(n) }}>
              {n}
            </li>
          ))}
          {shown.length === 0 && <li className="px-4 py-3 text-sm text-neutral-500">No program matches. Try fewer letters.</li>}
          {matches.length > shown.length && <li className="px-4 py-2 text-xs text-neutral-500">{matches.length - shown.length} more. Keep typing to narrow it down.</li>}
        </ul>
      )}
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
  const [level, setLevel] = useState('undergraduate')
  const [degreeClass, setDegreeClass] = useState('')
  const masters = level === 'masters'
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
    () => programs
      .filter((p) => (masters ? p.level === 'Masters' : p.level !== 'Masters'))
      .filter((p) => scope === 'both' || (scope === 'local' ? !p.international : p.international)),
    [programs, scope, masters]
  )

  // Programs offered in the chosen field, each listed once by its common name (many schools can offer it).
  const programNames = useMemo(
    () => [...new Set(scoped.filter((p) => !field || p.field === field).map((p) => p.group))].sort((a, b) => a.localeCompare(b)),
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
    if (masters) {
      if (!degreeClass) return setError('Choose your first-degree class.')
      if (!programName) return setError('Type the masters program you want and choose it from the list.')
      setBusy(true)
      try { setOutput(await checkMastersEligibility({ programName, degreeClass })) } catch (err) { setError(err.message) }
      setBusy(false)
      return
    }
    const chosen = electives.filter(Boolean)
    if (new Set(chosen).size !== chosen.length) return setError('Each elective can only be picked once.')
    if (!programName) return setError('Type the program you want to study and choose it from the list.')

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

  const qualified = (output?.targets || []).filter((r) => r.label !== 'Not yet eligible')
  const notYet = (output?.targets || []).filter((r) => r.label === 'Not yet eligible')

  if (loading) return <Spinner />

  return (
    <div className="space-y-8 max-w-3xl">
      <PageTitle title="Check My Eligibility" sub="Choose what you want to study. We check it first, then show every school that offers it." />

      <Segmented value={level} onChange={(v) => { setLevel(v); setProgramName(''); setField(''); setOutput(null); setError('') }}
        options={[{ value: 'undergraduate', label: 'Undergraduate' }, { value: 'masters', label: 'Masters' }]} />

      <form onSubmit={run} className="space-y-6">
        {masters ? (
        <div className="card space-y-4">
          <h2 className="font-bold text-lg">1. Your first degree</h2>
          <Field label="Degree class" hint="Schools set their own minimum class. We compare yours with the class each school states, and we say so when a school does not publish one.">
            <select className="input" value={degreeClass} onChange={(e) => setDegreeClass(e.target.value)}>
              <option value="">Choose class</option>
              {DEGREE_CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        ) : (
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
        )}

        <div className="card space-y-4">
          <h2 className="font-bold text-lg">2. What do you want to study?</h2>
          {SHOW_INTERNATIONAL && <Segmented value={scope} onChange={(v) => { setScope(v); setProgramName('') }} options={[{ value: 'local', label: 'Local' }, { value: 'intl', label: 'International' }, { value: 'both', label: 'Both' }]} />}
          <Field label="Field (optional)" hint="Pick a field to shorten the list, or leave it and search all programs.">
            <select className="input" value={field} onChange={(e) => { setField(e.target.value); setProgramName('') }}>
              <option value="">All fields</option>
              {FIELDS.map((f) => <option key={f.id}>{f.id}</option>)}
            </select>
          </Field>
          <Field label="Program" hint={programNames.length === 0 ? (masters ? 'No masters programs added yet. We are adding them school by school.' : 'No programs added yet.') : 'Type part of the name, then choose from the list.'}>
            <ProgramPicker key={field + scope} options={programNames} value={programName} onChange={setProgramName} disabled={programNames.length === 0} />
          </Field>
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

      {output && !output.locked && output.yourClass && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Results</h2>
          <p>Your first-degree class: <b>{output.yourClass}</b>. Each school sets its own entry rules, so confirm with the school before you apply.</p>
          <h3 className="font-semibold">Schools offering {output.programName}</h3>
          {output.targets.length === 0 && <p className="text-neutral-600">No schools offer this masters program yet.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {output.targets.map((r) => <ResultCard key={r.programId} item={r} highlight />)}
          </div>
          {output.others.length > 0 && <h3 className="font-semibold">Other masters programs</h3>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {output.others.map((r) => <ResultCard key={r.programId} item={r} />)}
          </div>
        </section>
      )}

      {output && !output.locked && !output.yourClass && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Results</h2>
          {output.aggregate != null
            ? <>
                <p>Your aggregate: <b>{output.aggregate}</b> (lower is better, 6 is the best possible).</p>
                <p className="text-sm text-neutral-600">Counted from English, Mathematics, Integrated Science (science programs) or Social Studies (other programs), plus your 3 best electives. You need at least C6 in each of the three core subjects.</p>
              </>
            : <p className="text-neutral-600">{output.reason}</p>}
          {output.mode === 'terminal' && <p className="text-sm font-semibold">These are projections based on terminal or mock grades.</p>}

          <h3 className="font-semibold">Schools offering {output.programName} that you qualify for</h3>
          {output.targets.length === 0 && <p className="text-neutral-600">No schools offer this program yet.</p>}
          {output.targets.length > 0 && qualified.length === 0 && (
            <p className="text-neutral-600">You do not meet the entry requirements for any school offering this program yet. What is missing for each school is listed below.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {qualified.map((r) => <ResultCard key={r.programId} item={r} highlight />)}
          </div>
          {notYet.length > 0 && (
            <details className="card" open={qualified.length === 0}>
              <summary className="font-semibold cursor-pointer">Schools offering {output.programName} that you do not qualify for yet ({notYet.length})</summary>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {notYet.map((r) => <ResultCard key={r.programId} item={r} />)}
              </div>
            </details>
          )}

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
