import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Linking, Pressable, Text, View } from 'react-native'
import { useAuth } from './AuthContext'
import { useSaved } from './SavedContext'
import { ScholarshipBadge } from './ScholarshipContext'
import { Ionicons } from '@expo/vector-icons'
import * as api from './lib/api'
import { getAccess } from './lib/access'
import { PROGRAMS_PAGE, colors } from './lib/constants'
import { fullDegreeName } from './lib/degreeNames'
import { SAT, keyFacts, money } from './lib/programFacts'
import { thumbUrl } from './lib/thumb'
import { variantLabel } from './lib/variants'
import { Monogram, cardStyle, useDebounced, usePull } from './SchoolParts'
import { Badge, BackLink, Button, ErrorText, Gate, Input, Pager, Screen, SelectField, Title, styles } from './ui'

const LEVELS = [{ value: '', label: 'All levels' }, ...['Undergraduate', 'Diploma', 'Certificate', 'Masters', 'Graduate Certificate'].map((x) => ({ value: x, label: x }))]
const Spinner = () => <View style={{ paddingVertical: 32 }}><ActivityIndicator color={colors.orangeInk} /></View>
const modeText = (modes) => (modes || []).filter((m) => m && m !== 'Regular').join(', ')
const H2 = { fontSize: 20, fontWeight: '700', color: colors.ink }

// ---------- Programs tab (local) ----------
export function ProgramsList({ initialQ = '', initialField = '', onOpen }) {
  const [f, setF] = useState({ q: initialQ, field: initialField, level: '', page: 1 })
  const dq = useDebounced(f.q)
  const [fields, setFields] = useState([])
  const [st, setSt] = useState({ rows: [], total: 0, loading: true, error: '' })
  const [tries, setTries] = useState(0)
  const set = (k) => (v) => setF((cur) => ({ ...cur, [k]: v, page: 1 }))

  useEffect(() => { let live = true; api.listFields('local').then((r) => live && setFields(r)); return () => { live = false } }, [])
  useEffect(() => {
    let live = true
    setSt((s) => ({ ...s, loading: true, error: '' }))
    api.searchPrograms({ scope: 'local', q: dq, field: f.field, level: f.level, limit: PROGRAMS_PAGE, offset: (f.page - 1) * PROGRAMS_PAGE })
      .then((r) => live && setSt({ ...r, loading: false, error: '' }))
      .catch((e) => live && setSt({ rows: [], total: 0, loading: false, error: e.message }))
    return () => { live = false }
  }, [dq, f.field, f.level, f.page, tries])

  const { rows, total, loading, error } = st
  const pull = usePull(() => setTries((n) => n + 1), loading)
  const pages = Math.ceil(total / PROGRAMS_PAGE)
  return (
    <Screen onRefresh={pull.onRefresh} refreshing={pull.refreshing}>
      <Title title={f.field ? `${f.field} programs` : 'Programs'} sub="Every program, at every university." />
      <View style={{ gap: 12, marginBottom: 16 }}>
        <Input placeholder="What do you want to study? (for example nursing, law)" value={f.q} onChangeText={set('q')} autoCorrect={false} style={{ borderWidth: 2, borderColor: colors.green }} />
        <SelectField title="Field of study" placeholder="Any field" value={f.field} onChange={set('field')} options={[{ value: '', label: 'Any field' }, ...fields.map((x) => ({ value: x.field, label: `${x.field} (${Number(x.n).toLocaleString()})` }))]} />
        <SelectField title="Level" placeholder="All levels" value={f.level} onChange={set('level')} options={LEVELS} />
        {!!(f.q || f.field || f.level) && <Button variant="outline" label="Clear all filters" onPress={() => setF({ q: '', field: '', level: '', page: 1 })} />}
        <Text style={styles.hint}>{loading ? 'Searching...' : `${total.toLocaleString()} program${total === 1 ? '' : 's'}${pages > 1 ? `, page ${Math.min(f.page, pages)} of ${pages.toLocaleString()}` : ''}`}</Text>
      </View>
      {!!error && <View style={{ marginBottom: 12, gap: 6 }}><ErrorText>{error}</ErrorText><Button variant="outline" label="Try again" onPress={() => setTries((n) => n + 1)} /></View>}
      {loading && rows.length === 0 ? <Spinner /> : (
        <View style={{ gap: 14 }}>
          {rows.map((p) => <ProgramCard key={p.id} p={p} onOpen={() => onOpen({ id: p.id })} />)}
          {!loading && rows.length === 0 && !error && <Text style={styles.body}>No programs match these filters yet.</Text>}
        </View>
      )}
      <Pager page={Math.min(f.page, pages || 1)} pages={pages} onChange={(n) => setF((cur) => ({ ...cur, page: n }))} />
    </Screen>
  )
}

function ProgramCard({ p, onOpen }) {
  const where = [p.schoolCity, p.schoolCountry].filter(Boolean).join(', ')
  const saved = useSaved()
  const [busy, setBusy] = useState(false)
  const isSaved = saved.ids.has(p.id)
  // One heart covers every way of studying the program, so look the others up before saving.
  const heart = async () => {
    if (busy) return
    setBusy(true)
    try { saved.toggle(await api.programVariantIds(p), !isSaved) } catch (e) { saved.fail?.(e.message) } finally { setBusy(false) }
  }
  return (
    <View style={cardStyle}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <Monogram name={p.schoolName} logo={p.schoolLogo} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink, lineHeight: 19 }}>{p.schoolName}</Text>
          {!!where && <Text style={{ fontSize: 14, color: colors.muted }}>{where}</Text>}
        </View>
      </View>
      <Text style={{ fontSize: 19, fontWeight: '700', color: colors.ink, lineHeight: 25 }}>{p.name}</Text>
      <ScholarshipBadge schoolId={p.schoolId} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {!!p.level && <Badge>{p.level}</Badge>}
        {!!p.field && <Badge>{p.field}</Badge>}
        {!!modeText(p.modes) && <Badge>{modeText(p.modes)}</Badge>}
        {p.variantCount > 1 && <Badge>{`${p.variantCount} ways to study`}</Badge>}
      </View>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <View style={{ flex: 1 }}><Button variant="outline" label="View programme information" onPress={onOpen} /></View>
        <Pressable onPress={heart} accessibilityRole="button" accessibilityLabel={isSaved ? 'Remove from Interested' : 'Add to Interested'} accessibilityState={{ selected: isSaved }} hitSlop={6} style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, borderWidth: 1, borderColor: colors.line }}>
          <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={26} color={isSaved ? '#dc2626' : colors.muted} />
        </Pressable>
      </View>
    </View>
  )
}

function Fact({ label, children }) {
  if (children == null || children === '') return null
  return (
    <View style={{ width: '48%', marginBottom: 14 }}>
      <Text style={{ fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', color: '#737373' }}>{label}</Text>
      <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{children}</Text>
    </View>
  )
}

// ---------- One program: facts first, then entry requirements and fees ----------
export function ProgramDetail({ id, onBack, onOpenSchool, onCheck }) {
  const { user } = useAuth()
  const saved = useSaved()
  const [st, setSt] = useState({ loading: true, data: null, error: '' })
  const [imgBad, setImgBad] = useState(false)
  const [more, setMore] = useState(false)

  useEffect(() => {
    let live = true
    setSt({ loading: true, data: null, error: '' })
    api.getProgramGroup(id).then((data) => live && setSt({ loading: false, data, error: '' })).catch((e) => live && setSt({ loading: false, data: null, error: e.message }))
    return () => { live = false }
  }, [id])

  if (st.loading) return <Screen><BackLink label="Back" onPress={onBack} /><Spinner /></Screen>
  const { data } = st
  if (!data || !data.variants.length) return <Screen><BackLink label="Back" onPress={onBack} /><Text style={styles.body}>{st.error || 'This program could not be found.'}</Text></Screen>

  const { school, variants } = data
  const alt = variants.find((v) => v.cutoffAggregate != null)
  const p = variants[0].cutoffAggregate == null && alt ? { ...variants[0], cutoffFrom: alt } : variants[0]
  const full = getAccess(user).level === 'full'
  const isSaved = variants.some((v) => saved.ids.has(v.id))
  const masters = p.level === 'Masters'
  const feeUsd = variants.find((v) => v.feesUsd != null)?.feesUsd
  const feeGhs = variants.find((v) => v.feesGhs != null)?.feesGhs
  const feeOther = variants.find((v) => v.feeAmount != null)
  const duration = variants.find((v) => v.durationYears != null)?.durationYears
  const satPolicy = variants.find((v) => v.satPolicy)?.satPolicy
  const where = [school?.city, school?.country].filter(Boolean).join(', ')
  const modes = [...new Set(variants.map((v) => v.mode).filter((m) => m && m !== 'Regular'))]
  const summary = [
    `${fullDegreeName(p.name)} is ${/^[aeiou]/i.test(p.level || 'u') ? 'an' : 'a'} ${(p.level || 'undergraduate').toLowerCase()} programme${p.field ? ` in ${p.field}` : ''} at ${school?.name}${where ? ` (${where})` : ''}.`,
    duration != null ? `It takes ${duration} years.` : '',
    modes.length ? `It can also be studied by ${modes.map((m) => m.toLowerCase()).join(', ')}.` : '',
  ].filter(Boolean).join(' ')
  const abroad = !!school?.country && school.country.toLowerCase() !== 'ghana'
  const feeText = feeUsd != null ? `${money(feeUsd, 'USD')} per year.${abroad ? ' This is the price international students usually pay.' : ''}`
    : feeOther ? `${money(feeOther.feeAmount, feeOther.feeCurrency)} per year, worked out from the full course fee and the course length.`
    : feeGhs != null ? `${money(feeGhs, 'GHS')} per year.` : 'The fee has not been added yet. Check with the school.'

  const schoolRow = (
    <Pressable onPress={() => onOpenSchool({ id: p.schoolId })} accessibilityRole="button" style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Monogram name={school?.name} logo={school?.logoUrl} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '600', fontSize: 14, color: colors.ink }}>{school?.name}</Text>
        <Text style={{ fontSize: 12, color: colors.muted }}>{where}</Text>
      </View>
    </Pressable>
  )

  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <View style={[cardStyle, { padding: 0, gap: 0, overflow: 'hidden' }]}>
        {school?.imageUrl && !imgBad
          ? <Image source={{ uri: thumbUrl(school.imageUrl, 960) }} onError={() => setImgBad(true)} style={{ height: 130, width: '100%' }} resizeMode="cover" />
          : <View style={{ height: 90, backgroundColor: colors.greenSoft }} />}
        <View style={{ padding: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {!!p.level && <Badge>{p.level}</Badge>}
            {!!p.field && <Badge>{p.field}</Badge>}
          </View>
          {schoolRow}
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink, lineHeight: 28 }}>{p.name}</Text>
          <Pressable onPress={() => saved.toggle(variants.map((v) => v.id), !isSaved)} accessibilityRole="button" accessibilityState={{ selected: isSaved }} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 }}>
            <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={26} color={isSaved ? '#dc2626' : colors.muted} />
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{isSaved ? 'In your Interested list' : 'Add to Interested'}</Text>
          </Pressable>
          {!!saved.error && <ErrorText>{saved.error}</ErrorText>}
          {!!school?.website && <Button label="Visit school website" onPress={() => Linking.openURL(school.website)} />}
        </View>
      </View>

      <View style={[cardStyle, { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 2 }]}>
        <Fact label="Tuition per year">{feeUsd != null ? money(feeUsd, 'USD') : feeOther ? money(feeOther.feeAmount, feeOther.feeCurrency) : feeGhs != null ? money(feeGhs, 'GHS') : 'Not added yet'}</Fact>
        <Fact label="Duration">{duration != null ? `${duration} years` : 'Not added yet'}</Fact>
        <Fact label="Level">{p.level || 'Undergraduate'}</Fact>
        <Fact label="Campus location">{where}</Fact>
        <Fact label="SAT">{satPolicy ? SAT[satPolicy] : abroad ? 'Check the school' : 'Not needed'}</Fact>
      </View>

      <View style={{ marginTop: 20, gap: 8 }}>
        <Text style={H2}>About</Text>
        <Text style={styles.body}>{summary}</Text>
        {!!school?.description && <Text style={styles.body}>{school.description}</Text>}
        {!!(school?.descriptionCredit || school?.imageCredit) && <Text style={styles.hint}>{[school.descriptionCredit, school.imageCredit].filter(Boolean).join(' | ')}</Text>}
      </View>

      <View style={[cardStyle, { marginTop: 16 }]}>
        {schoolRow}
        {school?.programCount > 0 && <Text style={styles.hint}>{school.programCount.toLocaleString()} programmes at this school</Text>}
        <Button variant="outline" label="See the school" onPress={() => onOpenSchool({ id: p.schoolId })} />
      </View>

      <View style={{ marginTop: 24, gap: 12 }}>
        {!full ? <Gate text="Subscribe to see entry requirements, fees and chances for this program." /> : (
          <>
            <Text style={H2}>Key information</Text>
            {keyFacts(p, masters).map(([h, t]) => (
              <View key={h} style={{ borderTopWidth: 1, borderColor: colors.line, paddingTop: 10 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, color: colors.ink }}>{h}</Text>
                <Text style={styles.body}>{t}</Text>
              </View>
            ))}
            {variants.length > 1 && (
              <View style={{ borderTopWidth: 1, borderColor: colors.line, paddingTop: 10 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, color: colors.ink }}>Ways to study</Text>
                {variants.map((v) => <Text key={v.id} style={styles.body}>{'•  '}{variantLabel(v)}{!masters && v.cutoffAggregate != null ? `: last cut-off ${v.cutoffAggregate}` : ''}</Text>)}
              </View>
            )}
            {!!p.entryNote && (
              <View style={{ borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 14, backgroundColor: '#fff' }}>
                <Pressable onPress={() => setMore(!more)} accessibilityRole="button"><Text style={{ fontWeight: '700', color: colors.ink }}>{more ? 'Hide' : 'More about this programme'}</Text></Pressable>
                {more && <Text style={[styles.body, { marginTop: 8 }]}>{p.entryNote}</Text>}
              </View>
            )}
            <Button variant="green" label="Check if I qualify" onPress={() => onCheck(p)} />
            <Text style={[H2, { marginTop: 12 }]}>Fees and funding</Text>
            <Text style={styles.body}>{feeText}</Text>
          </>
        )}
      </View>
    </Screen>
  )
}
