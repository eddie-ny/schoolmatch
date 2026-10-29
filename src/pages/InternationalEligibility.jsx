import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../hooks/useCatalog'
import { useSaved } from '../hooks/useSaved'
import { useSearchParams } from 'react-router-dom'
import { PageTitle, Segmented, Spinner, Badge, RequireAuth } from '../components/ui'
import { ProgramCard } from '../components/Cards'
import { DEGREE_CLASSES, GRADES } from '../lib/constants'
import { useDebounced } from '../components/Browse'
import { getProgramsFull, searchPrograms } from '../lib/api'

// Eligibility for the International path.
// Bachelors: WASSCE grades, SAT score and English proof, checked against each school's published rules.
// Masters: first degree class.
// Only things that can be checked from results are asked. A rule the school has not published is shown as "not published", never guessed.
const rank = (c) => DEGREE_CLASSES.indexOf(c)
const gradeOk = (have, need) => GRADES.indexOf(have) !== -1 && GRADES.indexOf(need) !== -1 && GRADES.indexOf(have) <= GRADES.indexOf(need)

const SUBJECTS = ['English Language', 'Mathematics', 'Integrated Science or Social Studies', 'Best elective', 'Second elective', 'Third elective']
const TESTS = [
  { id: 'none', label: 'No English test yet' },
  { id: 'ielts', label: 'IELTS (0 to 9)' },
  { id: 'toefl', label: 'TOEFL iBT (0 to 120)' },
  { id: 'duolingo', label: 'Duolingo (10 to 160)' },
]

// One line per rule: pass, fail or unknown. Unknown means the school does not publish it, or we need an answer from you.
function bachelorsChecks(p, me) {
  const checks = []

  // WASSCE grade
  if (!p.minWassceGrade) checks.push({ k: 'WASSCE', state: 'unknown', text: 'Grade rule not published by the school' })
  else if (me.grades.some((g) => !g)) checks.push({ k: 'WASSCE', state: 'unknown', text: `Needs ${p.minWassceGrade} or better. Enter all six grades.` })
  else if (me.grades.every((g) => gradeOk(g, p.minWassceGrade))) checks.push({ k: 'WASSCE', state: 'pass', text: `All six counted subjects are ${p.minWassceGrade} or better` })
  else checks.push({ k: 'WASSCE', state: 'fail', text: `Needs ${p.minWassceGrade} or better. Some of your grades are lower.` })

  // SAT
  if (!p.satPolicy) checks.push({ k: 'SAT', state: 'unknown', text: 'SAT rule not published' })
  else if (p.satPolicy === 'required') {
    if (!me.sat) checks.push({ k: 'SAT', state: 'fail', text: 'SAT is required. Enter a score or take the practice test.' })
    else if (p.satLow != null && me.sat < p.satLow) checks.push({ k: 'SAT', state: 'fail', text: `SAT is required. Admitted students scored about ${p.satLow} to ${p.satHigh ?? p.satLow}. No official minimum.` })
    else checks.push({ k: 'SAT', state: 'pass', text: p.satLow != null ? `SAT is required. You are in or above the usual ${p.satLow} to ${p.satHigh ?? p.satLow} range.` : 'SAT is required and you have a score' })
  } else if (p.satPolicy === 'optional') checks.push({ k: 'SAT', state: 'pass', text: 'SAT is optional' })
  else checks.push({ k: 'SAT', state: 'pass', text: 'SAT is not considered' })

  // English
  if (p.englishTestWaiver) checks.push({ k: 'English', state: 'pass', text: 'No English test needed for Ghanaian citizens' })
  else {
    const need = { ielts: p.minIelts, toefl: p.minToefl, duolingo: p.minDuolingo }
    const any = Object.values(need).some((v) => v != null)
    if (!any) checks.push({ k: 'English', state: 'unknown', text: 'English rule not published' })
    else if (me.test === 'none' || !me.score) checks.push({ k: 'English', state: 'fail', text: `English test needed: ${[p.minIelts != null && `IELTS ${p.minIelts}`, p.minToefl != null && `TOEFL ${p.minToefl}`, p.minDuolingo != null && `Duolingo ${p.minDuolingo}`].filter(Boolean).join(', ')}` })
    else if (need[me.test] == null) checks.push({ k: 'English', state: 'unknown', text: 'This school does not list a minimum for that test' })
    else if (Number(me.score) >= need[me.test]) checks.push({ k: 'English', state: 'pass', text: `Your ${TESTS.find((t) => t.id === me.test).label.split(' ')[0]} score meets the minimum of ${need[me.test]}` })
    else checks.push({ k: 'English', state: 'fail', text: `Minimum ${need[me.test]} on that test` })
  }
  return checks
}

function summarise(checks) {
  if (checks.some((c) => c.state === 'fail')) return { text: 'Not yet', tone: 'orange', order: 3 }
  if (checks.every((c) => c.state === 'unknown')) return { text: 'Rules not published yet', tone: 'gray', order: 2 }
  if (checks.some((c) => c.state === 'unknown')) return { text: 'Meets what is published', tone: 'gray', order: 1 }
  return { text: 'Meets the requirements', tone: 'green', order: 0 }
}

function mastersLabel(p, cls) {
  if (!p.minDegreeClass) return { text: 'No minimum class stated', tone: 'gray', order: 2 }
  return rank(cls) !== -1 && rank(cls) <= rank(p.minDegreeClass)
    ? { text: 'Meets the stated class', tone: 'green', order: 0 }
    : { text: `Below the stated class (${p.minDegreeClass})`, tone: 'orange', order: 3 }
}

const tone = { pass: 'text-green-700', fail: 'text-red-700', unknown: 'text-neutral-500' }
const mark = { pass: '✓', fail: '✗', unknown: '?' }

// Grades saved from Local eligibility fill the six boxes, so the student enters them once.
// Science takes Integrated Science, or Social Studies if that is what they sat. Electives are the three best.
function gradesFromSaved(r) {
  const out = ['', '', '', '', '', '']
  if (!r?.grades) return out
  const g = r.grades
  out[0] = g['English Language'] || ''
  out[1] = g['Core Mathematics'] || ''
  out[2] = g['Integrated Science'] || g['Social Studies'] || ''
  const best = (r.electives || []).map((n) => g[n]).filter((x) => GRADES.includes(x)).sort((a, b) => GRADES.indexOf(a) - GRADES.indexOf(b)).slice(0, 3)
  best.forEach((x, i) => { out[3 + i] = x })
  return out
}

function InternationalEligibilityInner() {
  const [params] = useSearchParams()
  const { user, access, saveSat } = useAuth()
  const { intl, loading } = useCatalog()
  const saved = useSaved()
  const [level, setLevel] = useState('Undergraduate')
  const [sat, setSat] = useState(() => {
    let v = params.get('sat') || (user?.results?.sat ? String(user.results.sat) : '')
    if (!v) { try { v = sessionStorage.getItem('satScore') } catch { /* ignore */ } }
    return v && /^\d{3,4}$/.test(v) ? v : ''
  })
  const [cls, setCls] = useState('')
  const [grades, setGrades] = useState(() => gradesFromSaved(user?.results))
  const [note, setNote] = useState('')
  const [test, setTest] = useState('none')
  const [score, setScore] = useState('')
  const [go, setGo] = useState(false)
  const [study, setStudy] = useState('')
  const dStudy = useDebounced(study)
  const [pool, setPool] = useState({ items: [], total: 0, busy: false })
  const full = access.level === 'full'
  const schoolById = useMemo(() => Object.fromEntries(intl.schools.map((s) => [s.id, s])), [intl.schools])
  const masters = level === 'Masters'
  const satNum = sat === '' ? 0 : Number(sat)
  const satBad = sat !== '' && (satNum < 400 || satNum > 1600)
  const ready = masters ? !!cls : go && !satBad

  // The programmes come from the server, only those matching what the student wants to study (up to 60 at a time).
  useEffect(() => {
    if (!ready) { setPool({ items: [], total: 0, busy: false }); return }
    let live = true
    setPool((x) => ({ ...x, busy: true }))
    searchPrograms({ scope: 'intl', q: dStudy, level: masters ? 'Masters' : 'Undergraduate', limit: 60, offset: 0 })
      .then(async (r) => { const items = await getProgramsFull(r.rows.map((x) => x.id)); if (live) setPool({ items, total: r.total, busy: false }) })
      .catch(() => live && setPool({ items: [], total: 0, busy: false }))
    return () => { live = false }
  }, [ready, masters, dStudy])

  const rows = useMemo(() => {
    if (!ready) return []
    const me = { grades, sat: satNum, test, score }
    return pool.items
      .filter((p) => masters === (p.level === 'Masters'))
      .map((p) => {
        if (masters) return { p, lab: mastersLabel(p, cls), checks: [] }
        const checks = bachelorsChecks(p, me)
        return { p, lab: summarise(checks), checks }
      })
      .sort((a, b) => a.lab.order - b.lab.order || a.p.name.localeCompare(b.p.name))
  }, [pool.items, masters, cls, grades, satNum, test, score, ready])

  const setGrade = (i, v) => setGrades((g) => g.map((x, j) => (j === i ? v : x)))

  return (
    <div>
      <PageTitle title="International eligibility" sub="Bachelors use your WASSCE grades, SAT score and English proof. Masters use your first degree class." />
      <div className="card space-y-4 mb-6">
        <Segmented value={level} onChange={(v) => { setLevel(v); setGo(false) }} options={[{ value: 'Undergraduate', label: 'Bachelors' }, { value: 'Masters', label: 'Masters' }]} />
        <label className="block">
          <span className="block text-sm font-semibold mb-1">What do you want to study?</span>
          <input className="input" placeholder="For example nursing, computer science, law" value={study} onChange={(e) => setStudy(e.target.value)} />
        </label>
        {masters ? (
          <label className="block">
            <span className="block text-sm font-semibold mb-1">Your first degree class</span>
            <select className="input" value={cls} onChange={(e) => setCls(e.target.value)}>
              <option value="">Choose one</option>
              {DEGREE_CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
        ) : (
          <>
            <div>
              <p className="text-sm font-semibold mb-2">Your WASSCE grades</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {SUBJECTS.map((s, i) => (
                  <label key={s} className="block">
                    <span className="block text-xs text-neutral-600 mb-1">{s}</span>
                    <select className="input" value={grades[i]} onChange={(e) => setGrade(i, e.target.value)}>
                      <option value="">Grade</option>
                      {GRADES.map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </label>
                ))}
              </div>
              <p className="text-xs text-neutral-600 mt-1">English, Mathematics, Integrated Science or Social Studies, and your 3 best electives.{user?.results?.grades && Object.keys(user.results.grades).length > 0 ? ' Filled in from the results you saved in Local eligibility. Change them here if needed.' : ''}</p>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold mb-1">Your SAT score (400 to 1600), if you have one</span>
              <input className="input" type="number" inputMode="numeric" min="400" max="1600" step="10" placeholder="For example 1200" value={sat} onChange={(e) => setSat(e.target.value)} />
              {satBad && <span className="block text-xs text-red-700 mt-1">Enter a score from 400 to 1600, or leave it empty.</span>}
              <span className="block text-xs text-neutral-600 mt-1">No score yet? Take the short practice test first. It gives a practice score, not an official one.</span>
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-semibold mb-1">English test you have taken</span>
                <select className="input" value={test} onChange={(e) => setTest(e.target.value)}>
                  {TESTS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </label>
              {test !== 'none' && (
                <label className="block">
                  <span className="block text-sm font-semibold mb-1">Your score</span>
                  <input className="input" type="number" step="0.5" inputMode="decimal" value={score} onChange={(e) => setScore(e.target.value)} />
                </label>
              )}
            </div>
            <button className="btn btn-orange" onClick={async () => {
              setGo(true)
              setNote('')
              if (sat !== '' && !satBad && String(user?.results?.sat ?? '') !== sat) {
                try { await saveSat(sat) } catch (e) { setNote(`Your SAT score was used but could not be saved: ${e.message}`) }
              }
            }}>Check my eligibility</button>
            {note && <p role="alert" className="text-sm text-red-700">{note}</p>}
          </>
        )}
      </div>
      {loading || pool.busy ? <Spinner /> : !ready ? (
        <p className="text-neutral-700">{masters ? 'Choose your degree class to see the programs.' : 'Fill in what you have and press Check my eligibility. You can leave out the SAT and English test.'}</p>
      ) : rows.length === 0 ? (
        <p className="text-neutral-700">{study ? 'No programs match that search. Try a broader word.' : `We are adding international ${masters ? 'masters' : 'bachelors'} programs. Check back soon.`}</p>
      ) : (
        <>
        {pool.total > pool.items.length && <p className="text-sm text-neutral-600 mb-3">Showing the first {pool.items.length} of {pool.total.toLocaleString()} matching programs. Type what you want to study to narrow them.</p>}
        <div className="grid sm:grid-cols-2 gap-4">
          {rows.map(({ p, lab, checks }) => (
            <div key={p.id} className="space-y-2">
              <Badge tone={lab.tone}>{lab.text}</Badge>
              {checks.length > 0 && (
                <ul className="text-sm space-y-1">
                  {checks.map((c) => (
                    <li key={c.k} className={tone[c.state]}><span aria-hidden="true" className="font-bold mr-1">{mark[c.state]}</span><b>{c.k}:</b> {c.text}</li>
                  ))}
                </ul>
              )}
              <ProgramCard p={p} school={schoolById[p.schoolId]} full={full} saved={saved.isSaved(p)} onToggle={saved.toggleProgram} />
            </div>
          ))}
        </div>
        </>
      )}
      <p className="text-sm text-neutral-600 mt-6">This is guidance, not a guarantee of admission. A "?" means the school has not published that rule. Always confirm requirements with the school.</p>
    </div>
  )
}

export default function InternationalEligibility() {
  return (
    <RequireAuth>
      <InternationalEligibilityInner />
    </RequireAuth>
  )
}
