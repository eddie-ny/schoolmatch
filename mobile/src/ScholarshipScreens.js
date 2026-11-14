import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Linking, Pressable, Text, View } from 'react-native'
import { useAuth } from './AuthContext'
import * as api from './lib/api'
import { getAccess } from './lib/access'
import { colors } from './lib/constants'
import { buildSections, fundingRank, officialLink } from './lib/scholarshipSections'
import { Monogram, cardStyle, usePull } from './SchoolParts'
import { useScholarships } from './ScholarshipContext'
import { Badge, BackLink, Button, Chips, ErrorText, Gate, Pager, Screen, Title, styles } from './ui'

const PAGE = 12
const isLocal = (c) => (c || '').toLowerCase() === 'ghana'
const Spinner = () => <View style={{ paddingVertical: 32 }}><ActivityIndicator color={colors.orangeInk} /></View>
const fundingBadge = (t) => <Badge tone={t === 'Not stated' ? undefined : 'green'}>{t === 'Not stated' ? 'Funding not stated' : `${t} funding`}</Badge>

function ScholarshipCard({ s, onOpen }) {
  return (
    <View style={cardStyle}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <Monogram name={s.schoolName || s.funder || s.name} logo={s.schoolLogo} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink, lineHeight: 19 }}>{s.schoolName || s.funder}</Text>
          <Text style={{ fontSize: 14, color: colors.muted }}>{s.country}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 19, fontWeight: '700', color: colors.ink, lineHeight: 25 }}>{s.name}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {fundingBadge(s.fundingType)}
        {!!s.gender && <Badge tone="orange">{s.gender === 'female' ? 'Women only' : 'Men only'}</Badge>}
      </View>
      <Button variant="outline" label="View scholarship information" onPress={onOpen} />
    </View>
  )
}

// ---------- Scholarships tab ----------
export function ScholarshipsList({ initialFunding = 'all', onOpen }) {
  const { user } = useAuth()
  const { rows, loading: sLoading, error: sError, reload } = useScholarships()
  const st = { rows, loading: sLoading, error: sError }
  const [f, setF] = useState({ funding: initialFunding, where: 'all', page: 1 })
  const full = getAccess(user).level === 'full'
  const pull = usePull(reload, st.loading)
  const set = (k) => (v) => setF((c) => ({ ...c, [k]: v, page: 1 }))

  // Fully funded first, then partial, then the rest. The sort is stable, so the database order holds inside each group.
  const list = useMemo(() => st.rows
    .filter((s) => f.funding === 'all' || s.fundingType.toLowerCase() === f.funding)
    .filter((s) => f.where === 'all' || (f.where === 'local' ? isLocal(s.country) : !isLocal(s.country)))
    .sort((a, b) => fundingRank(a.fundingType) - fundingRank(b.fundingType)), [st.rows, f.funding, f.where])
  const pages = Math.ceil(list.length / PAGE)
  const page = Math.min(f.page, pages || 1)

  return (
    <Screen onRefresh={pull.onRefresh} refreshing={pull.refreshing}>
      <Title title="Scholarships" sub="Funding for study in Ghana and abroad." />
      <View style={{ gap: 12, marginBottom: 16 }}>
        <Chips value={f.funding} onChange={set('funding')} options={[{ value: 'all', label: 'Any funding' }, { value: 'partial', label: 'Partial' }, { value: 'full', label: 'Fully funded' }]} />
        <Chips value={f.where} onChange={set('where')} options={[{ value: 'all', label: 'All' }, { value: 'local', label: 'Local' }, { value: 'intl', label: 'International' }]} />
        <Text style={styles.hint}>{st.loading ? 'Loading...' : `${list.length.toLocaleString()} scholarship${list.length === 1 ? '' : 's'}${pages > 1 ? `, page ${page} of ${pages}` : ''}`}</Text>
      </View>
      {!full && <View style={{ marginBottom: 16 }}><Gate /></View>}
      {!!st.error && <View style={{ marginBottom: 12, gap: 6 }}><ErrorText>{st.error}</ErrorText><Button variant="outline" label="Try again" onPress={reload} /></View>}
      {st.loading && st.rows.length === 0 ? <Spinner /> : (
        <View style={{ gap: 14 }}>
          {list.slice((page - 1) * PAGE, page * PAGE).map((s) => <ScholarshipCard key={s.id} s={s} onOpen={() => onOpen({ id: s.id })} />)}
          {!st.loading && list.length === 0 && !st.error && <Text style={styles.body}>No scholarships match these filters yet.</Text>}
        </View>
      )}
      <Pager page={page} pages={pages} onChange={(n) => setF((c) => ({ ...c, page: n }))} />
    </Screen>
  )
}

function Fact({ label, children }) {
  if (children == null || children === '' || children === false) return null
  return (
    <View style={{ width: '48%', marginBottom: 14 }}>
      <Text style={{ fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', color: '#737373' }}>{label}</Text>
      <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{children}</Text>
    </View>
  )
}

// ---------- One scholarship: who gives it, what it covers, who can apply, where to apply ----------
export function ScholarshipDetail({ id, onBack, onOpenSchool }) {
  const { user } = useAuth()
  const [st, setSt] = useState({ loading: true, s: null, error: '' })
  useEffect(() => {
    let live = true
    setSt({ loading: true, s: null, error: '' })
    api.getScholarship(id).then((s) => live && setSt({ loading: false, s, error: '' })).catch((e) => live && setSt({ loading: false, s: null, error: e.message }))
    return () => { live = false }
  }, [id])
  const s = st.s
  const sections = useMemo(() => (s ? buildSections(s) : []), [s])

  if (st.loading) return <Screen><BackLink label="Back" onPress={onBack} /><Spinner /></Screen>
  if (!s) return <Screen><BackLink label="Back" onPress={onBack} /><Text style={styles.body}>{st.error || 'This scholarship could not be found.'}</Text></Screen>
  const full = getAccess(user).level === 'full'
  const link = officialLink(s.link)
  const H2 = { fontSize: 18, fontWeight: '700', color: colors.ink }

  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <View style={cardStyle}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Monogram name={s.schoolName || s.funder || s.name} logo={s.schoolLogo} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '600', fontSize: 14, color: colors.ink }}>{s.schoolName || s.funder}</Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>{s.country}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink, lineHeight: 28 }}>{s.name}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {fundingBadge(s.fundingType)}
          {!!s.gender && <Badge tone="orange">{s.gender === 'female' ? 'Women only' : 'Men only'}</Badge>}
          {full && !!s.level && <Badge>{s.level}</Badge>}
        </View>
        {full && !!link && <Button label="Official page" onPress={() => Linking.openURL(link)} />}
        {!!s.schoolId && <Button variant="outline" label="School and its programs" onPress={() => onOpenSchool({ id: s.schoolId })} />}
      </View>

      {full && (
        <View style={[cardStyle, { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 2 }]}>
          <Fact label="Deadline">{s.deadline}</Fact>
          <Fact label="Funding">{s.fundingType === 'Not stated' ? 'Not stated by the funder' : s.fundingType}</Fact>
          <Fact label="Country">{s.country}</Fact>
          <Fact label="Level">{s.level}</Fact>
          <Fact label="Best aggregate">{s.minAggregate}</Fact>
        </View>
      )}

      <View style={{ marginTop: 16, gap: 12 }}>
        {!full ? <Gate text="Subscribe to see who can apply, the deadline and the link for this scholarship." /> : sections.length === 0 ? (
          <Text style={styles.body}>The provider has not published detailed requirements. Use the official page to check with them.</Text>
        ) : sections.map((sec) => (
          <View key={sec.key} style={cardStyle}>
            <Text style={H2}>{sec.heading}</Text>
            {sec.items.map((x) => (
              <View key={x} style={{ flexDirection: 'row', gap: 8 }}>
                <Text style={styles.body}>{'•'}</Text>
                <Text style={[styles.body, { flex: 1 }]}>{x}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </Screen>
  )
}
