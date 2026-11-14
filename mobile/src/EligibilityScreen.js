import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { useAuth } from './AuthContext'
import * as api from './lib/api'
import { CORE_SUBJECTS, DISCLAIMER, ELECTIVE_SUBJECTS, FIELDS, GRADES, colors } from './lib/constants'
import { Badge, Button, Card, Chips, ErrorText, Field, Gate, Input, Screen, SelectField, Title, styles } from './ui'

// Check My Eligibility, local undergraduate (step 7). Copied from the website's src/pages/Eligibility.jsx.
// The labels come from the database (check_eligibility), so the app and the website give the same answer for the same grades.
// Masters and top-up checks are not in the app yet.

const labelTone = { 'Strong match': 'green', 'Good chance': 'green', 'Worth a try': 'orange', 'Long shot': 'orange' }
const H2 = { fontSize: 20, fontWeight: '700', color: colors.ink }
const H3 = { fontSize: 16, fontWeight: '700', color: colors.ink }
const gradeOptions = [{ value: '', label: 'Grade' }, ...GRADES.map((g) => ({ value: g, label: g }))]
const SHOW = 10

function ResultCard({ item, highlight, onOpen }) {
  const [more, setMore] = useState(false)
  const shortLabel = item.label === 'Requirements met' && item.cutoff == null ? 'Requirements met, no cut-off added' : item.label === 'Long shot' ? 'Long shot: well above the cut-off' : item.label
  const long = [item.entryNote, ...(item.notes || [])].filter(Boolean)
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 8, borderWidth: highlight ? 2 : 1, borderColor: highlight ? colors.orange : colors.line }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        <Badge tone={labelTone[item.label]}>{shortLabel}</Badge>
        {item.projection && <Badge tone="orange">Projection</Badge>}
        {item.demo && <Badge tone="orange">Sample data</Badge>}
      </View>
      <Text style={H3}>{item.programName}</Text>
      <Text style={styles.hint}>{item.schoolName}</Text>
      {item.aggregate != null && <Text style={styles.body}>Your aggregate: <Text style={{ fontWeight: '700' }}>{item.aggregate}</Text>{item.cutoff != null ? ` · Cut-off: ${item.cutoff}` : ''}</Text>}
      {(item.failures || []).slice(0, 3).map((f) => <Text key={f} style={styles.body}>{'•'} {f}</Text>)}
      {item.programId && <Button label="View program page" onPress={() => onOpen({ id: item.programId })} />}
      {long.length > 0 && (
        <Pressable onPress={() => setMore(!more)} accessibilityRole="button" hitSlop={8}>
          <Text style={styles.link}>{more ? 'Hide details' : 'Details'}</Text>
        </Pressable>
      )}
      {more && long.map((n) => <Text key={n} style={styles.hint}>{n}</Text>)}
    </View>
  )
}

// A list that shows 10 at a time with a Show more button (the website pages them).
function ResultList({ items, highlight, onOpen }) {
  const [n, setN] = useState(SHOW)
  useEffect(() => setN(SHOW), [items])
  return (
    <View style={{ gap: 12 }}>
      {items.slice(0, n).map((r) => <ResultCard key={r.programId} item={r} highlight={highlight} onOpen={onOpen} />)}
      {items.length > n && <Button variant="outline" label={`Show more (${items.length - n} left)`} onPress={() => setN(n + SHOW)} />}
    </View>
  )
}

// A section that opens and closes, like the website's <details>.
function Fold({ title, open: startOpen = false, children }) {
  const [open, setOpen] = useState(startOpen)
  return (
    <Card>
      <Pressable onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityState={{ expanded: open }} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
        <Text style={[H3, { flex: 1 }]}>{title}</Text>
        <Text style={styles.link}>{open ? 'Hide' : 'Show'}</Text>
      </Pressable>
      {open && children}
    </Card>
  )
}

// Type part of a program name, then tap one of the matches.
function ProgramPicker({ options, value, onChange, disabled }) {
  const [text, setText] = useState(value || '')
  useEffect(() => { setText(value || '') }, [value])
  const words = text.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const matches = useMemo(() => (words.length ? options.filter((n) => words.every((w) => n.toLowerCase().includes(w))) : options), [options, text]) // eslint-disable-line react-hooks/exhaustive-deps
  const shown = value ? [] : matches.slice(0, 8)
  return (
    <View style={{ gap: 6 }}>
      <Input placeholder="Start typing, for example nursing or law" autoCorrect={false} editable={!disabled} value={text}
        onChangeText={(t) => { setText(t); if (value) onChange('') }} />
      {!disabled && text.trim().length > 0 && !value && (
        <View style={{ borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: '#fff' }}>
          {shown.map((n) => (
            <Pressable key={n} onPress={() => { onChange(n); setText(n) }} accessibilityRole="button" style={{ paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <Text style={styles.body}>{n}</Text>
            </Pressable>
          ))}
          {shown.length === 0 && <Text style={[styles.hint, { padding: 12 }]}>No program matches. Try fewer letters.</Text>}
          {matches.length > shown.length && <Text style={[styles.hint, { padding: 12 }]}>{matches.length - shown.length} more. Keep typing to narrow it down.</Text>}
        </View>
      )}
    </View>
  )
}

export default function EligibilityScreen({ initialProgram = '', onOpenProgram, scopeSwitch = null }) {
  const { user } = useAuth()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('final')
  const [grades, setGrades] = useState({})
  const [electives, setElectives] = useState(['', '', ''])
  const [field, setField] = useState('')
  const [programName, setProgramName] = useState('')
  const [output, setOutput] = useState(null)
  const [tries, setTries] = useState(0)

  useEffect(() => {
    let live = true
    setLoading(true)
    setError('')
    api.listEligibilityPrograms().then((p) => live && setPrograms(p)).catch((e) => live && setError(e.message)).finally(() => live && setLoading(false))
    return () => { live = false }
  }, [tries])

  // Grades saved before (on the website or here) fill the form, the same as the website.
  useEffect(() => {
    let live = true
    api.getMyResults(user.id).then((r) => {
      if (!live || !r) return
      setMode(r.mode || 'final')
      setGrades(r.grades || {})
      const e = [...(r.electives || [])]
      while (e.length < 3) e.push('')
      setElectives(e.slice(0, 5))
    })
    return () => { live = false }
  }, [user.id])

  // Undergraduate programs only: not masters, diploma, certificate or top-up.
  const scoped = useMemo(() => programs.filter((p) => p.level !== 'Masters' && p.level !== 'Diploma' && p.level !== 'Certificate' && !p.entryQualification), [programs])
  const programNames = useMemo(() => [...new Set(scoped.filter((p) => !field || p.field === field).map((p) => p.group))].sort((a, b) => a.localeCompare(b)), [scoped, field])

  // Arriving from a program page: fill in that program by its common name once the list is loaded.
  useEffect(() => {
    if (!initialProgram || !scoped.length) return
    const low = initialProgram.toLowerCase()
    const hit = scoped.find((p) => p.name.toLowerCase() === low) || scoped.find((p) => p.group.toLowerCase() === low)
    if (hit) { setProgramName(hit.group); setField(hit.field || '') }
  }, [scoped, initialProgram])

  const setGrade = (s) => (g) => setGrades((cur) => ({ ...cur, [s]: g }))
  const pickElective = (i, name) => setElectives((cur) => cur.map((x, j) => (j === i ? name : x)))

  const run = async () => {
    setError('')
    const chosen = electives.filter(Boolean)
    if (new Set(chosen).size !== chosen.length) return setError('Each elective can only be picked once.')
    const missing = []
    if (!grades['English Language']) missing.push('English Language')
    if (!grades['Core Mathematics']) missing.push('Core Mathematics')
    if (!grades['Integrated Science'] && !grades['Social Studies']) missing.push('Integrated Science or Social Studies')
    const graded = chosen.filter((x) => grades[x])
    if (graded.length < 3) missing.push(`${3 - graded.length} more elective${3 - graded.length === 1 ? '' : 's'} with a grade`)
    if (missing.length) return setError(`We cannot work out your aggregate yet. Please add: ${missing.join(', ')}.`)
    // One of field or program is enough. A program gives a precise answer; a field alone shows your chances across every program in it.
    if (!programName && !field) return setError('Pick a field or type a program. One of them is enough.')

    const clean = {}
    ;[...CORE_SUBJECTS, ...chosen].forEach((s) => { if (grades[s]) clean[s] = grades[s] })
    setBusy(true)
    try {
      const res = await api.checkEligibility({ programName, scope: 'local', mode, grades: clean, electives: chosen, sat: '' })
      setOutput(programName ? res : { ...res, programName: '', fieldOnly: field })
    } catch (e) {
      setBusy(false)
      return setError(e.message)
    }
    setBusy(false)
    // Saved results are reused on the website too. A failed save must not be silent.
    try { await api.saveResults(user.id, { mode, grades: clean, electives: chosen, sat: '' }) } catch (e) { setError(`Your results were checked but could not be saved: ${e.message}`) }
  }

  // Qualify: meets the requirements and the aggregate is not far above the cut-off. Long shot: meets them but well above. Not yet: does not meet them.
  const bucket = (list, kind) => (list || []).filter((r) => (kind === 'not' ? r.label === 'Not yet eligible' : kind === 'long' ? r.label === 'Long shot' : r.label !== 'Not yet eligible' && r.label !== 'Long shot'))
  const qualified = bucket(output?.targets, 'yes')
  const longShots = bucket(output?.targets, 'long')
  const notYet = bucket(output?.targets, 'not')
  // Field only (no program chosen): programs in that field are the main list, the rest come after.
  const fieldIds = useMemo(() => (output?.fieldOnly ? new Set(programs.filter((p) => p.field === output.fieldOnly).map((p) => p.id)) : null), [programs, output])
  const inField = (list) => (fieldIds ? (list || []).filter((r) => fieldIds.has(r.programId)) : [])
  const outField = (list) => (fieldIds ? (list || []).filter((r) => !fieldIds.has(r.programId)) : list)
  const fq = bucket(inField(output?.others), 'yes')
  const fl = bucket(inField(output?.others), 'long')
  const fn = bucket(inField(output?.others), 'not')
  const othersQualify = bucket(outField(output?.others), 'yes')
  const othersLong = bucket(outField(output?.others), 'long')
  const othersNot = bucket(outField(output?.others), 'not')

  if (loading) return <Screen><View style={{ paddingVertical: 32 }}><ActivityIndicator color={colors.orangeInk} /></View></Screen>

  return (
    <Screen>
      <Title title="Check My Eligibility" sub="Choose a field, a program, or both. A program gives a precise answer. A field alone shows your chances across every program in it." />
      {scopeSwitch}
      {!programs.length && !!error && <View style={{ gap: 6, marginBottom: 12 }}><ErrorText>{error}</ErrorText><Button variant="outline" label="Try again" onPress={() => setTries((n) => n + 1)} /></View>}

      <View style={{ gap: 16 }}>
        <Card>
          <Text style={H2}>1. Your results</Text>
          <Chips value={mode} onChange={setMode} options={[{ value: 'final', label: 'Final WASSCE results' }, { value: 'terminal', label: 'Terminal or mock' }]} />
          {mode === 'terminal' && <Text style={styles.hint}>Results will be labelled as a projection.</Text>}
          <Text style={H3}>Core subjects</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {CORE_SUBJECTS.map((s) => (
              <View key={s} style={{ width: '47%' }}>
                <Field label={s}><SelectField title={s} placeholder="Grade" value={grades[s] || ''} onChange={setGrade(s)} options={gradeOptions} /></Field>
              </View>
            ))}
          </View>
          <Text style={H3}>Elective subjects (best 3 count)</Text>
          {electives.map((name, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 2 }}>
                <SelectField title={`Elective subject ${i + 1}`} placeholder="Choose subject" value={name} onChange={(v) => pickElective(i, v)} options={[{ value: '', label: 'Choose subject' }, ...ELECTIVE_SUBJECTS.map((s) => ({ value: s, label: s }))]} />
              </View>
              <View style={{ flex: 1 }}>
                <SelectField title={`Grade for elective ${i + 1}`} placeholder="Grade" value={name ? grades[name] || '' : ''} onChange={(g) => name && setGrade(name)(g)} options={gradeOptions} />
              </View>
            </View>
          ))}
          {electives.length < 5 && <Button variant="outline" label="Add another elective" onPress={() => setElectives([...electives, ''])} />}
        </Card>

        <Card>
          <Text style={H2}>2. What do you want to study?</Text>
          <Field label="Field" hint="Pick a field to see your chances across all its programs, or pick a program below for a precise answer. One is enough.">
            <SelectField title="Field" placeholder="All fields" value={field} onChange={(v) => { setField(v); setProgramName('') }} options={[{ value: '', label: 'All fields' }, ...FIELDS.map((f) => ({ value: f, label: f }))]} />
          </Field>
          <Field label="Program" hint={programNames.length === 0 ? 'No programs added yet.' : 'Type part of the name, then choose from the list.'}>
            <ProgramPicker key={field} options={programNames} value={programName} onChange={setProgramName} disabled={programNames.length === 0} />
          </Field>
        </Card>

        <ErrorText>{programs.length ? error : ''}</ErrorText>
        <Button label={busy ? 'Checking...' : 'Check eligibility'} busy={busy} disabled={busy} onPress={run} />
      </View>

      {output && output.locked && (
        <View style={{ gap: 12, marginTop: 24 }}>
          <Text style={H2}>Results</Text>
          <Text style={styles.body}>{output.fieldOnly ? `We found ${fieldIds ? fieldIds.size : 0} program${fieldIds && fieldIds.size === 1 ? '' : 's'} in ${output.fieldOnly}.` : `We found ${output.targetCount} school${output.targetCount === 1 ? '' : 's'} offering this program and ${output.otherCount} other option${output.otherCount === 1 ? '' : 's'}.`}</Text>
          <Gate text="Subscribe to see your aggregate, your match labels and how you rank." />
        </View>
      )}

      {output && !output.locked && (
        <View style={{ gap: 14, marginTop: 24 }}>
          <Text style={H2}>Results</Text>
          {output.aggregate != null ? (
            <>
              <Text style={styles.body}>Your aggregate: <Text style={{ fontWeight: '700' }}>{output.aggregate}</Text> (lower is better, 6 is the best possible).</Text>
              <Text style={styles.hint}>Counted from English, Mathematics, Integrated Science (science programs) or Social Studies (other programs), plus your 3 best electives. You need at least C6 in each of the three core subjects.</Text>
            </>
          ) : <Text style={styles.body}>{output.reason}</Text>}
          {output.mode === 'terminal' && <Text style={[styles.body, { fontWeight: '700' }]}>These are projections based on terminal or mock grades.</Text>}

          {output.fieldOnly && (
            <>
              <Text style={H3}>{output.fieldOnly} programs you qualify for, best first</Text>
              <Text style={styles.hint}>This shows your chances across the whole field. Pick a program above for a precise answer.</Text>
              {fq.length === 0 && <Text style={styles.body}>{fl.length > 0 ? 'None of these programs is a realistic match for your aggregate yet. The ones where you meet the requirements but are well above the cut-off are listed below.' : 'You do not meet the entry requirements for any program in this field yet. What is missing is listed below.'}</Text>}
              <ResultList items={fq} highlight onOpen={onOpenProgram} />
              {fl.length > 0 && (
                <Fold title={`${output.fieldOnly} programs where your aggregate is well above the cut-off (${fl.length})`} open={fq.length === 0 && fn.length === 0}>
                  <ResultList items={fl} onOpen={onOpenProgram} />
                </Fold>
              )}
              {fn.length > 0 && (
                <Fold title={`${output.fieldOnly} programs you do not qualify for yet (${fn.length})`} open={fq.length === 0 && fl.length === 0}>
                  <ResultList items={fn} onOpen={onOpenProgram} />
                </Fold>
              )}
              <Text style={H3}>Programs in other fields you qualify for</Text>
              {othersQualify.length === 0 && <Text style={styles.body}>No programs in other fields match your results yet.</Text>}
              <ResultList items={othersQualify} onOpen={onOpenProgram} />
              <Text style={styles.hint}>{DISCLAIMER}</Text>
            </>
          )}
          {!output.fieldOnly && (
          <>
          <Text style={H3}>Schools offering {output.programName} that you qualify for</Text>
          {output.targets.length === 0 && <Text style={styles.body}>No schools offer this program yet.</Text>}
          {output.targets.length > 0 && qualified.length === 0 && (
            <Text style={styles.body}>{longShots.length > 0 ? 'None of these schools is a realistic match for your aggregate yet. The ones where you meet the entry requirements but are well above the cut-off are listed below.' : 'You do not meet the entry requirements for any school offering this program yet. What is missing for each school is listed below.'}</Text>
          )}
          <ResultList items={qualified} highlight onOpen={onOpenProgram} />
          {longShots.length > 0 && (
            <Fold title={`Schools offering ${output.programName} where your aggregate is well above the cut-off (${longShots.length})`} open={qualified.length === 0 && notYet.length === 0}>
              <Text style={styles.hint}>You meet the entry requirements, but admission is unlikely with your aggregate.</Text>
              <ResultList items={longShots} onOpen={onOpenProgram} />
            </Fold>
          )}
          {notYet.length > 0 && (
            <Fold title={`Schools offering ${output.programName} that you do not qualify for yet (${notYet.length})`} open={qualified.length === 0 && longShots.length === 0}>
              <ResultList items={notYet} onOpen={onOpenProgram} />
            </Fold>
          )}

          <Text style={H3}>All programs you qualify for, best first</Text>
          <Text style={styles.hint}>{qualified.length === 0 ? `You do not meet the requirements for ${output.programName} yet. These are the programs you do qualify for.` : 'These are every program your results qualify for, including ones you did not choose.'}</Text>
          {othersQualify.length === 0 && <Text style={styles.body}>No other programs match your results yet.</Text>}
          <ResultList items={othersQualify} onOpen={onOpenProgram} />
          {othersLong.length > 0 && (
            <Fold title={`Other programs where your aggregate is well above the cut-off (${othersLong.length})`}>
              <ResultList items={othersLong} onOpen={onOpenProgram} />
            </Fold>
          )}
          {othersNot.length > 0 && (
            <Fold title={`Programs you do not qualify for yet (${othersNot.length})`}>
              <ResultList items={othersNot} onOpen={onOpenProgram} />
            </Fold>
          )}
          <Text style={styles.hint}>{DISCLAIMER}</Text>
          </>
          )}
        </View>
      )}
    </Screen>
  )
}
