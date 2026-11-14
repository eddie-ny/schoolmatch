import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { useAuth } from './AuthContext'
import EligibilityScreen from './EligibilityScreen'
import { useSaved } from './SavedContext'
import { forLevel, useScholarships } from './ScholarshipContext'
import { matchScholarship } from './lib/scholarshipMatch'
import { useContext } from 'react'
import * as api from './lib/api'
import { getAccess } from './lib/access'
import { DEGREE_CLASSES, GRADES, colors } from './lib/constants'
import { fundingRank } from './lib/scholarshipSections'
import { useDebounced } from './SchoolParts'
import { Badge, Button, Card, Chips, ErrorText, Field, Gate, Input, ScopeSwitch, Screen, SelectField, ShellActions, Title, styles, useScope } from './ui'

// Check My Eligibility: Local or International (the app-wide choice). Local is EligibilityScreen; International is below.
export default function EligibilityTab({ initialProgram = '', onOpenProgram }) {
  const { scope } = useScope()
  const sw = <View style={{ marginBottom: 16 }}><ScopeSwitch /></View>
  return scope === 'local'
    ? <EligibilityScreen initialProgram={initialProgram} onOpenProgram={onOpenProgram} scopeSwitch={sw} />
    : <IntlEligibility onOpenProgram={onOpenProgram} scopeSwitch={sw} />
}

// ---------- International. Same rules as the website's src/pages/InternationalEligibility.jsx ----------
// Bachelors: WASSCE grades, SAT and English proof, checked against each program's published rules. Masters: first degree class and GPA.
// A rule the school has not published is shown as "not published", never guessed.
const rank = (c) => DEGREE_CLASSES.indexOf(c)
const gradeOk = (have, need) => GRADES.indexOf(have) !== -1 && GRADES.indexOf(need) !== -1 && GRADES.indexOf(have) <= GRADES.indexOf(need)
const SUBJECTS = ['English Language', 'Mathematics', 'Integrated Science or Social Studies', 'Best elective', 'Second elective', 'Third elective']
const TESTS = [
  { value: 'none', label: 'No English test yet' },
  { value: 'ielts', label: 'IELTS (0 to 9)' },
  { value: 'toefl', label: 'TOEFL iBT (0 to 120)' },
  { value: 'duolingo', label: 'Duolingo (10 to 160)' },
]
const MAX_COUNTRIES = 5
const H3 = { fontSize: 16, fontWeight: '700', color: colors.ink }

function bachelorsChecks(p, me) {
  const checks = []
  if (!p.minWassceGrade) checks.push({ k: 'WASSCE', state: 'unknown', text: 'Grade rule not published by the school' })
  else if (me.grades.some((g) => !g)) checks.push({ k: 'WASSCE', state: 'unknown', text: `Needs ${p.minWassceGrade} or better. Enter all six grades.` })
  else if (me.grades.every((g) => gradeOk(g, p.minWassceGrade))) checks.push({ k: 'WASSCE', state: 'pass', text: `All six counted subjects are ${p.minWassceGrade} or better` })
  else checks.push({ k: 'WASSCE', state: 'fail', text: `Needs ${p.minWassceGrade} or better. Some of your grades are lower.` })

  if (!p.satPolicy) checks.push({ k: 'SAT', state: 'unknown', text: 'SAT rule not published' })
  else if (p.satPolicy === 'required') {
    if (!me.sat) checks.push({ k: 'SAT', state: 'fail', text: 'SAT is required. Enter a score.' })
    else if (p.satLow != null && me.sat < p.satLow) checks.push({ k: 'SAT', state: 'fail', text: `SAT is required. Admitted students scored about ${p.satLow} to ${p.satHigh ?? p.satLow}. No official minimum.` })
    else checks.push({ k: 'SAT', state: 'pass', text: p.satLow != null ? `SAT is required. You are in or above the usual ${p.satLow} to ${p.satHigh ?? p.satLow} range.` : 'SAT is required and you have a score' })
  } else if (p.satPolicy === 'optional') checks.push({ k: 'SAT', state: 'pass', text: 'SAT is optional' })
  else checks.push({ k: 'SAT', state: 'pass', text: 'SAT is not considered' })

  if (p.englishTestWaiver) checks.push({ k: 'English', state: 'pass', text: 'No English test needed for Ghanaian citizens' })
  else {
    const need = { ielts: p.minIelts, toefl: p.minToefl, duolingo: p.minDuolingo }
    const any = Object.values(need).some((v) => v != null)
    if (!any) checks.push({ k: 'English', state: 'unknown', text: 'English rule not published' })
    else if (me.test === 'none' || !me.score) checks.push({ k: 'English', state: 'fail', text: `English test needed: ${[p.minIelts != null && `IELTS ${p.minIelts}`, p.minToefl != null && `TOEFL ${p.minToefl}`, p.minDuolingo != null && `Duolingo ${p.minDuolingo}`].filter(Boolean).join(', ')}` })
    else if (need[me.test] == null) checks.push({ k: 'English', state: 'unknown', text: 'This school does not list a minimum for that test' })
    else if (Number(me.score) >= need[me.test]) checks.push({ k: 'English', state: 'pass', text: `Your ${TESTS.find((t) => t.value === me.test).label.split(' ')[0]} score meets the minimum of ${need[me.test]}` })
    else checks.push({ k: 'English', state: 'fail', text: `Minimum ${need[me.test]} on that test` })
  }
  return checks
}

function summarise(checks) {
  if (checks.some((c) => c.state === 'fail')) return { text: 'Not yet', tone: 'orange', order: 3 }
  if (checks.every((c) => c.state === 'unknown')) return { text: 'Rules not published yet', tone: undefined, order: 2 }
  if (checks.some((c) => c.state === 'unknown')) return { text: 'Meets what is published', tone: undefined, order: 1 }
  return { text: 'Meets the requirements', tone: 'green', order: 0 }
}

function mastersLabel(p, cls, gpa) {
  const g = parseFloat(gpa)
  if (p.minGpa != null && Number.isFinite(g) && g < p.minGpa) return { text: `Below the stated GPA (${p.minGpa.toFixed(2)})`, tone: 'orange', order: 3 }
  if (!p.minDegreeClass) {
    if (p.minGpa != null) return Number.isFinite(g) ? { text: 'Meets the stated GPA', tone: 'green', order: 0 } : { text: `Needs a GPA of ${p.minGpa.toFixed(2)}. Enter yours to check.`, tone: undefined, order: 2 }
    return { text: 'No minimum class stated', tone: undefined, order: 2 }
  }
  return rank(cls) !== -1 && rank(cls) <= rank(p.minDegreeClass)
    ? { text: 'Meets the stated class', tone: 'green', order: 0 }
    : { text: `Below the stated class (${p.minDegreeClass})`, tone: 'orange', order: 3 }
}

const markColor = { pass: '#15803d', fail: '#b91c1c', unknown: '#737373' }
const mark = { pass: '✓', fail: '✗', unknown: '?' }

// Grades saved in the local check fill the six boxes, so the student enters them once.
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

function IntlResult({ p, lab, checks, onOpen }) {
  const saved = useSaved()
  const isSaved = saved.ids.has(p.id)
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 8, borderWidth: 1, borderColor: colors.line }}>
      <View style={{ flexDirection: 'row' }}><Badge tone={lab.tone}>{lab.text}</Badge></View>
      <Text style={H3}>{p.name}</Text>
      <Text style={styles.hint}>{p.schoolName}{p.level ? ` · ${p.level}` : ''}</Text>
      {checks.map((c) => (
        <Text key={c.k} style={[styles.body, { color: markColor[c.state] }]}><Text style={{ fontWeight: '700' }}>{mark[c.state]} {c.k}:</Text> {c.text}</Text>
      ))}
      <Button label="View program page" onPress={() => onOpen({ id: p.id })} />
      <Pressable onPress={() => saved.toggle([p.id], !isSaved)} accessibilityRole="button" hitSlop={6}>
        <Text style={styles.link}>{isSaved ? 'In your Interested list (tap to remove)' : 'Add to Interested'}</Text>
      </Pressable>
    </View>
  )
}

// Scholarships the student may qualify for, checked against the same answers. Same rules as the website's ScholarshipsForYou:
// only rules a scholarship states are used; ones the student does not fit, or that have closed, are left out.
const stateBadge = { meets: ['You fit', 'green'], unknown: ['Check details', undefined] }
function ScholarshipsForYou({ me, fields, masters }) {
  const { openScholarship } = useContext(ShellActions)
  const [st, setSt] = useState({ list: [], busy: true, error: '' })
  const [shown, setShown] = useState(12)
  useEffect(() => {
    let live = true
    api.listScholarshipsFull().then((list) => live && setSt({ list, busy: false, error: '' })).catch((e) => live && setSt({ list: [], busy: false, error: e.message }))
    return () => { live = false }
  }, [])
  const rows = useMemo(() => {
    const mine = { ...me, fields: (fields || []).filter(Boolean) }
    const order = { meets: 0, unknown: 1 }
    return forLevel(st.list, masters)
      .filter((s) => (s.country || '').toLowerCase() !== 'ghana')
      .map((s) => ({ s, m: matchScholarship(s, mine) }))
      .filter((r) => r.m.state === 'meets' || r.m.state === 'unknown')
      .sort((a, b) => order[a.m.state] - order[b.m.state] || fundingRank(a.s.fundingType) - fundingRank(b.s.fundingType) || Number(!!b.s.field) - Number(!!a.s.field))
  }, [st.list, me, fields, masters])
  if (st.busy) return <View style={{ paddingVertical: 32 }}><ActivityIndicator color={colors.orangeInk} /></View>
  return (
    <View style={{ gap: 12 }}>
      <Text style={H3}>Scholarships you may qualify for ({rows.length})</Text>
      <Text style={styles.hint}>Checked against your answers and the entry rules each scholarship states. "Check details" means the rules are not published, so confirm with the funder.</Text>
      <ErrorText>{st.error}</ErrorText>
      {!st.error && rows.length === 0 && <Text style={styles.body}>No open scholarships match your answers yet.</Text>}
      {rows.slice(0, shown).map(({ s, m }) => (
        <Pressable key={s.id} onPress={() => openScholarship({ id: s.id })} accessibilityRole="button" style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 8, borderWidth: 1, borderColor: colors.line }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            <Badge tone={stateBadge[m.state][1]}>{stateBadge[m.state][0]}</Badge>
            <Badge tone={s.fundingType === 'Not stated' ? undefined : 'green'}>{s.fundingType === 'Not stated' ? 'Funding not stated' : `${s.fundingType} funding`}</Badge>
            {!!s.field && <Badge tone="orange">{String(s.field).split('|').join(' or ')} only</Badge>}
          </View>
          <Text style={H3}>{s.name}</Text>
          {!!s.funder && <Text style={styles.hint}>{s.funder}</Text>}
          {m.reasons.slice(0, 3).map((r) => <Text key={r} style={styles.body}>{'\u2022'} {r}</Text>)}
          <Text style={styles.link}>View scholarship</Text>
        </Pressable>
      ))}
      {rows.length > shown && <Button variant="outline" label={`Show more (${rows.length - shown} left)`} onPress={() => setShown((n) => n + 12)} />}
    </View>
  )
}

function IntlEligibility({ onOpenProgram, scopeSwitch }) {
  const { user } = useAuth()
  const full = getAccess(user).level === 'full'
  const { bySchool } = useScholarships()
  const [level, setLevel] = useState('Undergraduate')
  const masters = level === 'Masters'
  const [study, setStudy] = useState('')
  const dStudy = useDebounced(study)
  const [countries, setCountries] = useState([])
  const [picked, setPicked] = useState([])
  const [grades, setGrades] = useState(['', '', '', '', '', ''])
  const [sat, setSat] = useState('')
  const [test, setTest] = useState('none')
  const [score, setScore] = useState('')
  const [cls, setCls] = useState('')
  const [gpa, setGpa] = useState('')
  const [go, setGo] = useState(false)
  const [note, setNote] = useState('')
  const [pool, setPool] = useState({ items: [], total: 0, busy: false, error: '' })
  const [view, setView] = useState('schools')

  useEffect(() => { let live = true; api.listCountries('intl').then((r) => live && setCountries(r)); return () => { live = false } }, [])
  // Saved WASSCE results and SAT fill the form once.
  useEffect(() => {
    let live = true
    api.getMyResults(user.id).then((r) => {
      if (!live || !r) return
      setGrades(gradesFromSaved(r))
      if (r.sat) setSat(String(r.sat))
    }).catch(() => {})
    return () => { live = false }
  }, [user.id])

  const satNum = sat === '' ? 0 : Number(sat)
  const satBad = sat !== '' && (!Number.isFinite(satNum) || satNum < 400 || satNum > 1600)
  const ready = full && (masters ? go && !!cls : go && !satBad)
  const pickedKey = picked.join('|')
  const aidKey = Object.keys(bySchool).length

  useEffect(() => {
    if (!ready) { setPool({ items: [], total: 0, busy: false, error: '' }); return undefined }
    let live = true
    setPool((x) => ({ ...x, busy: true, error: '' }))
    const places = picked.length ? picked : ['']
    const lvl = masters ? 'Masters' : 'Undergraduate'
    Promise.all([
      Promise.all(places.map((country) => api.searchPrograms({ scope: 'intl', q: dStudy, level: lvl, country, limit: Math.max(12, Math.floor(60 / places.length)), offset: 0 }))),
      api.listProgramsAtSchools({ schoolIds: Object.keys(bySchool), q: dStudy, level: lvl, limit: 60 }),
    ])
      .then(async ([rs, aidIds]) => {
        const ids = [...new Set([...rs.flatMap((r) => r.rows.map((x) => x.id)), ...aidIds])]
        let items = await api.getProgramsWithRules(ids)
        items = items.filter((p) => p.international && (!picked.length || picked.includes(p.schoolCountry)))
        if (live) setPool({ items, total: rs.reduce((n, r) => n + r.total, 0), busy: false, error: '' })
      })
      .catch((e) => live && setPool({ items: [], total: 0, busy: false, error: e.message }))
    return () => { live = false }
  }, [ready, masters, dStudy, pickedKey, aidKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const rows = useMemo(() => {
    if (!ready) return []
    const me = { grades, sat: satNum, test, score }
    return pool.items
      .filter((p) => masters === (p.level === 'Masters'))
      .map((p) => (masters ? { p, lab: mastersLabel(p, cls, gpa), checks: [] } : (() => { const checks = bachelorsChecks(p, me); return { p, lab: summarise(checks), checks } })()))
      // Programs at a school with a scholarship come first, fully funded before partial; then the closest fit.
      .map((r) => ({ ...r, aid: Math.min(9, ...(bySchool[r.p.schoolId] || []).map((x) => fundingRank(x.fundingType))) }))
      .sort((a, b) => a.aid - b.aid || a.lab.order - b.lab.order || a.p.name.localeCompare(b.p.name))
  }, [pool.items, masters, cls, gpa, grades, satNum, test, score, ready, bySchool])

  const check = async () => {
    setGo(true)
    setNote('')
    if (!masters && sat !== '' && !satBad) {
      try { await api.saveSat(user.id, sat) } catch (e) { setNote(`Your SAT score was used but could not be saved: ${e.message}`) }
    }
  }
  const setGrade = (i) => (v) => setGrades((g) => g.map((x, j) => (j === i ? v : x)))
  const gradeOpts = [{ value: '', label: 'Grade' }, ...GRADES.map((g) => ({ value: g, label: g }))]

  return (
    <Screen>
      <Title title="Check My Eligibility" sub="International. Bachelors use your WASSCE grades, SAT score and English proof. Masters use your first degree class." />
      {scopeSwitch}
      {!full ? <Gate text="Subscribe to check your eligibility for international universities." /> : (
        <View style={{ gap: 16 }}>
          <Card>
            <Chips value={level} onChange={(v) => { setLevel(v); setGo(false) }} options={[{ value: 'Undergraduate', label: 'Bachelors' }, { value: 'Masters', label: 'Masters' }]} />
            <Field label="What do you want to study?"><Input placeholder="For example nursing, computer science, law" value={study} onChangeText={setStudy} autoCorrect={false} /></Field>
            <Field label={`Countries you want (up to ${MAX_COUNTRIES})`} hint="None chosen means every country.">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: picked.length ? 8 : 0 }}>
                {picked.map((c) => (
                  <Pressable key={c} onPress={() => setPicked((p) => p.filter((x) => x !== c))} accessibilityRole="button" accessibilityLabel={`Remove ${c}`} style={{ borderRadius: 999, borderWidth: 2, borderColor: colors.orange, backgroundColor: colors.orangeSoft, paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Text style={{ fontWeight: '600', color: colors.ink }}>{c} {'✕'}</Text>
                  </Pressable>
                ))}
              </View>
              {picked.length < MAX_COUNTRIES && (
                <SelectField title="Add a country" placeholder={picked.length ? 'Add another country' : 'Any country. Choose to narrow.'} value="" onChange={(v) => v && setPicked((p) => [...p, v])}
                  options={countries.filter((c) => !picked.includes(c.country)).map((c) => ({ value: c.country, label: c.country }))} />
              )}
            </Field>
            {masters ? (
              <>
                <Field label="Your first degree class"><SelectField title="Degree class" placeholder="Choose one" value={cls} onChange={setCls} options={DEGREE_CLASSES.map((c) => ({ value: c, label: c }))} /></Field>
                <Field label="Your GPA out of 4.0 (optional)" hint="Some schools state a minimum GPA. Leave it blank if you do not know it."><Input keyboardType="decimal-pad" placeholder="For example 3.4" value={gpa} onChangeText={(v) => setGpa(v.replace(/[^0-9.]/g, '').slice(0, 4))} /></Field>
                <Button label="Check my eligibility" disabled={!cls} onPress={check} />
              </>
            ) : (
              <>
                <Text style={H3}>Your WASSCE grades</Text>
                {SUBJECTS.map((s, i) => (
                  <Field key={s} label={s}><SelectField title={s} placeholder="Grade" value={grades[i]} onChange={setGrade(i)} options={gradeOpts} /></Field>
                ))}
                <Text style={styles.hint}>English, Mathematics, Integrated Science or Social Studies, and your 3 best electives. Saved results fill these in.</Text>
                <Field label="Your SAT score (400 to 1600), if you have one">
                  <Input keyboardType="number-pad" placeholder="For example 1200" value={sat} onChangeText={(v) => setSat(v.replace(/[^0-9]/g, '').slice(0, 4))} />
                </Field>
                {satBad && <ErrorText>Enter a score from 400 to 1600, or leave it empty.</ErrorText>}
                <Field label="English test you have taken"><SelectField title="English test" placeholder="No English test yet" value={test} onChange={setTest} options={TESTS} /></Field>
                {test !== 'none' && <Field label="Your score"><Input keyboardType="decimal-pad" value={score} onChangeText={(v) => setScore(v.replace(/[^0-9.]/g, '').slice(0, 5))} /></Field>}
                <Button label="Check my eligibility" disabled={satBad} onPress={check} />
              </>
            )}
            <ErrorText>{note}</ErrorText>
          </Card>

          <ErrorText>{pool.error}</ErrorText>
          {ready && !pool.busy && <Chips value={view} onChange={setView} options={[{ value: 'schools', label: 'Schools' }, { value: 'scholarships', label: 'Scholarships' }]} />}
          {ready && !pool.busy && view === 'scholarships' ? (
            <ScholarshipsForYou me={{ gender: user?.profile?.gender || '', sat: satNum || '' }} fields={study ? [...new Set(pool.items.map((p) => p.field).filter(Boolean))] : []} masters={masters} />
          ) : pool.busy ? <View style={{ paddingVertical: 32 }}><ActivityIndicator color={colors.orangeInk} /></View> : !ready ? (
            <Text style={styles.body}>{masters ? 'Choose your degree class, then press Check my eligibility.' : 'Fill in what you have and press Check my eligibility. You can leave out the SAT and English test.'}</Text>
          ) : rows.length === 0 ? (
            <Text style={styles.body}>{study ? 'No programs match that search. Try a broader word.' : `No international ${masters ? 'masters' : 'bachelors'} programs found yet.`}</Text>
          ) : (
            <View style={{ gap: 14 }}>
              {pool.total > pool.items.length && <Text style={styles.hint}>Showing {rows.length} programs. Type what you want to study, or pick countries, to narrow them.</Text>}
              {rows.map(({ p, lab, checks }) => <IntlResult key={p.id} p={p} lab={lab} checks={checks} onOpen={onOpenProgram} />)}
            </View>
          )}
          <Text style={styles.hint}>This is guidance, not a guarantee of admission. A "?" means the school has not published that rule. Always confirm requirements with the school.</Text>
        </View>
      )}
    </Screen>
  )
}
