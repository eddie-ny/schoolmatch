import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Linking, Text, View } from 'react-native'
import * as api from './lib/api'
import { FIELDS, PROGRAMS_PAGE, SCHOOLS_PAGE, colors } from './lib/constants'
import { SCHOOL_CATEGORIES, schoolCategory, schoolCategoryLabel } from './lib/schoolCategory'
import { thumbUrl } from './lib/thumb'
import { Monogram, SchoolCard, cardStyle, useDebounced } from './SchoolParts'
import { Badge, BackLink, Button, Chips, ErrorText, Input, Pager, Screen, SelectField, Title, styles } from './ui'

const LEVELS = [
  { value: '', label: 'Any level' },
  { value: 'Undergraduate', label: "Offers bachelor's degrees" },
  { value: 'Diploma', label: 'Offers diplomas and HND' },
  { value: 'Certificate', label: 'Offers certificates' },
  { value: 'Masters', label: 'Offers Masters' },
]
const KINDS = [{ value: '', label: 'All schools' }, ...SCHOOL_CATEGORIES.filter((c) => c.id !== 'Institute').map((c) => ({ value: c.id, label: c.label }))]

const Spinner = () => <View style={{ paddingVertical: 32 }}><ActivityIndicator color={colors.orangeInk} /></View>

// ---------- Find a School (local) ----------
export function SchoolsList({ onBack, onOpen, initialKind = '' }) {
  const [f, setF] = useState({ q: '', kind: initialKind, field: '', offers: '', page: 1 })
  const dq = useDebounced(f.q)
  const [state, setState] = useState({ rows: [], total: 0, loading: true, error: '' })
  const [tries, setTries] = useState(0)
  // Any change to a filter goes back to page 1, like the website.
  const set = (k) => (v) => setF((cur) => ({ ...cur, [k]: v, page: 1 }))

  useEffect(() => {
    let live = true
    setState((s) => ({ ...s, loading: true, error: '' }))
    api.searchSchools({ scope: 'local', q: dq, field: f.field, level: f.offers, kind: f.kind, limit: SCHOOLS_PAGE, offset: (f.page - 1) * SCHOOLS_PAGE })
      .then((r) => live && setState({ ...r, loading: false, error: '' }))
      .catch((e) => live && setState({ rows: [], total: 0, loading: false, error: e.message }))
    return () => { live = false }
  }, [dq, f.field, f.offers, f.kind, f.page, tries])

  const { rows, total, loading, error } = state
  const pages = Math.ceil(total / SCHOOLS_PAGE)
  return (
    <Screen>
      {onBack && <BackLink label="Back" onPress={onBack} />}
      <Title title="Find a School" sub="Ghanaian universities and their programs." />
      <View style={{ gap: 12, marginBottom: 16 }}>
        <Input placeholder="Search by school, program (for example law), city or country" value={f.q} onChangeText={set('q')} autoCorrect={false} />
        <Chips value={f.kind} options={KINDS} onChange={set('kind')} />
        <SelectField title="Field of study" placeholder="Any field" value={f.field} onChange={set('field')} options={[{ value: '', label: 'Any field' }, ...FIELDS.map((x) => ({ value: x, label: x }))]} />
        <SelectField title="Level offered" placeholder="Any level" value={f.offers} onChange={set('offers')} options={LEVELS} />
        <Text style={styles.hint}>{loading ? 'Searching...' : `${total.toLocaleString()} result${total === 1 ? '' : 's'}`}</Text>
      </View>
      {!!error && (
        <View style={{ marginBottom: 12, gap: 6 }}>
          <ErrorText>{error}</ErrorText>
          <Button variant="outline" label="Try again" onPress={() => setTries((n) => n + 1)} />
        </View>
      )}
      {loading && rows.length === 0 ? <Spinner /> : (
        <View style={{ gap: 14 }}>
          {rows.map(({ school, count, matches, matched }) => (
            <SchoolCard key={school.id} s={school} count={count} matches={matches} matched={matched} onOpen={() => onOpen({ id: school.id, q: f.q, field: f.field })} />
          ))}
          {!loading && rows.length === 0 && !error && <Text style={styles.body}>No schools match these filters yet.</Text>}
        </View>
      )}
      <Pager page={Math.min(f.page, pages || 1)} pages={pages} onChange={(n) => setF((cur) => ({ ...cur, page: n }))} />
    </Screen>
  )
}

// ---------- One school: who they are, then their programs ----------
const PROGRAM_LEVELS = [{ value: '', label: 'All levels' }, ...['Undergraduate', 'Diploma', 'Certificate', 'Masters', 'Graduate Certificate'].map((x) => ({ value: x, label: x }))]

export function SchoolDetail({ id, q: q0 = '', field: field0 = '', onBack }) {
  const [school, setSchool] = useState(undefined)
  const [imgBad, setImgBad] = useState(false)
  const [fields, setFields] = useState([])
  const [f, setF] = useState({ q: q0, field: field0, level: '', page: 1 })
  const dq = useDebounced(f.q)
  const [prog, setProg] = useState({ rows: [], total: 0, loading: true, error: '' })
  const set = (k) => (v) => setF((cur) => ({ ...cur, [k]: v, page: 1 }))

  useEffect(() => {
    let live = true
    api.getSchool(id).then((s) => live && setSchool(s)).catch(() => live && setSchool(null))
    api.listFields('local').then((r) => live && setFields(r))
    return () => { live = false }
  }, [id])

  useEffect(() => {
    let live = true
    setProg((s) => ({ ...s, loading: true, error: '' }))
    api.searchPrograms({ scope: 'all', q: dq, field: f.field, level: f.level, school: id, limit: PROGRAMS_PAGE, offset: (f.page - 1) * PROGRAMS_PAGE })
      .then((r) => live && setProg({ ...r, loading: false, error: '' }))
      .catch((e) => live && setProg({ rows: [], total: 0, loading: false, error: e.message }))
    return () => { live = false }
  }, [id, dq, f.field, f.level, f.page])

  if (school === undefined) return <Screen><BackLink label="Back" onPress={onBack} /><Spinner /></Screen>
  if (!school) return <Screen><BackLink label="Back" onPress={onBack} /><Text style={styles.body}>This school could not be found.</Text></Screen>

  const where = [school.city, school.country].filter(Boolean).join(', ')
  const pages = Math.ceil(prog.total / PROGRAMS_PAGE)
  const modes = (m) => (m || []).filter((x) => x && x !== 'Regular').join(', ')
  const credit = [school.descriptionCredit, school.imageCredit, school.logoCredit].filter(Boolean).join(' | ')
  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <View style={[cardStyle, { padding: 0, gap: 0, overflow: 'hidden' }]}>
        {school.imageUrl && !imgBad
          ? <Image source={{ uri: thumbUrl(school.imageUrl, 960) }} onError={() => setImgBad(true)} style={{ height: 130, width: '100%' }} resizeMode="cover" />
          : <View style={{ height: 90, backgroundColor: colors.greenSoft }} />}
        <View style={{ padding: 16, gap: 10 }}>
          <Monogram name={school.name} logo={school.logoUrl} kind={schoolCategory(school)} size={64} />
          <Text style={{ fontSize: 24, fontWeight: '800', color: colors.ink, lineHeight: 30 }}>{school.name}</Text>
          {!!where && <Text style={{ fontSize: 15, color: colors.muted }}>{where}</Text>}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Badge>{schoolCategoryLabel(school)}</Badge>
            {!!school.type && <Badge>{school.type}</Badge>}
            {school.verified === false && <Badge>Unverified</Badge>}
          </View>
          {!!school.website && <Button label="Visit university website" onPress={() => Linking.openURL(school.website)} />}
        </View>
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: colors.line, backgroundColor: '#fafaf5' }}>
          {[[school.programCount.toLocaleString(), 'Programs'], [school.country || '-', 'Country']].map(([a, b], i) => (
            <View key={b} style={{ flex: 1, padding: 14, alignItems: 'center', borderLeftWidth: i ? 1 : 0, borderColor: colors.line }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.ink }}>{a}</Text>
              <Text style={styles.hint}>{b}</Text>
            </View>
          ))}
        </View>
      </View>

      {!!school.description && (
        <View style={{ marginTop: 20, gap: 4 }}>
          <Text style={{ fontSize: 19, fontWeight: '700', color: colors.ink }}>About {school.name}</Text>
          <Text style={styles.body}>{school.description}</Text>
          {!!credit && <Text style={styles.hint}>{credit}</Text>}
        </View>
      )}

      <View style={{ marginTop: 24, gap: 12 }}>
        <Text style={{ fontSize: 19, fontWeight: '700', color: colors.ink }}>Programs at {school.name}</Text>
        <Input placeholder="Search this school's programs (for example law)" value={f.q} onChangeText={set('q')} autoCorrect={false} />
        <SelectField title="Field of study" placeholder="Any field" value={f.field} onChange={set('field')} options={[{ value: '', label: 'Any field' }, ...fields.map((x) => ({ value: x.field, label: x.field }))]} />
        <SelectField title="Level" placeholder="All levels" value={f.level} onChange={set('level')} options={PROGRAM_LEVELS} />
        {!!(f.q || f.field || f.level) && <Button variant="outline" label="Clear filters" onPress={() => setF({ q: '', field: '', level: '', page: 1 })} />}
        <Text style={styles.hint}>{prog.loading ? 'Searching...' : `${prog.total.toLocaleString()} program${prog.total === 1 ? '' : 's'}`}</Text>
        <ErrorText>{prog.error}</ErrorText>
        {prog.loading && prog.rows.length === 0 ? <Spinner /> : (
          <View style={{ gap: 12 }}>
            {prog.rows.map((p) => (
              <View key={p.id} style={cardStyle}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: colors.ink, lineHeight: 23 }}>{p.name}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {!!p.level && <Badge>{p.level}</Badge>}
                  {!!p.field && <Badge>{p.field}</Badge>}
                  {!!modes(p.modes) && <Badge>{modes(p.modes)}</Badge>}
                  {p.variantCount > 1 && <Badge>{`${p.variantCount} ways to study`}</Badge>}
                </View>
              </View>
            ))}
          </View>
        )}
        {!prog.loading && prog.rows.length === 0 && !prog.error && <Text style={styles.body}>No programs match. Clear the search to see them all.</Text>}
        <Pager page={Math.min(f.page, pages || 1)} pages={pages} onChange={(n) => setF((cur) => ({ ...cur, page: n }))} />
      </View>
    </Screen>
  )
}
