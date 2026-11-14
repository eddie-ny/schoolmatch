import { useCallback, useContext, useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from './AuthContext'
import * as api from './lib/api'
import { colors } from './lib/constants'
import { SCHOOL_CATEGORIES, schoolCategory, schoolCategoryLabel } from './lib/schoolCategory'
import { Monogram } from './SchoolParts'
import { Screen, ShellActions, useScope } from './ui'

const FIELDS = [
  ['Computing', 'laptop-outline'], ['Engineering', 'construct-outline'], ['Business', 'briefcase-outline'], ['Health', 'medkit-outline'],
  ['Science', 'flask-outline'], ['Arts', 'color-palette-outline'], ['Law', 'scale-outline'], ['Education', 'school-outline'],
  ['Agriculture', 'leaf-outline'], ['Social Sciences', 'people-outline'],
]
const KINDS = [{ value: '', label: 'All schools' }, ...SCHOOL_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))]
const H2 = { fontSize: 19, fontWeight: '700', color: colors.ink }
const press = ({ pressed }) => ({ opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })

// App-style home: greeting, search bar, swipe rows. Same data as the website, none of its marketing text.
export default function HomeScreen({ goTab, onOpenSchool }) {
  const { user } = useAuth()
  const first = (user?.fullName || '').trim().split(/\s+/)[0]
  const { scope } = useScope()
  const { openPage } = useContext(ShellActions)
  const [kind, setKind] = useState('')
  useEffect(() => { setKind('') }, [scope])
  const [st, setSt] = useState({ rows: [], total: 0, loading: true, error: '' })
  const [tries, setTries] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    let live = true
    setSt((s) => ({ ...s, loading: true, error: '' }))
    api.searchSchools({ scope, kind: scope === 'local' ? kind : '', limit: 8, offset: 0 })
      .then((r) => live && setSt({ ...r, loading: false, error: '' }))
      .catch((e) => live && setSt({ rows: [], total: 0, loading: false, error: e.message }))
      .finally(() => live && setRefreshing(false))
    return () => { live = false }
  }, [kind, scope, tries])

  const onRefresh = useCallback(() => { setRefreshing(true); setTries((n) => n + 1) }, [])
  const { rows, total, loading, error } = st

  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.ink }}>{first ? `Hi, ${first}` : 'Welcome'}</Text>
        <Text style={{ fontSize: 15, color: colors.muted, marginTop: 2 }}>Find the right school for your results.</Text>
      </View>

      <Pressable onPress={() => goTab('programs')} accessibilityRole="search" accessibilityLabel="Search schools or programs" style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 999, borderWidth: 2, borderColor: colors.green, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20 }, pressed && { opacity: 0.7 }]}>
        <Ionicons name="search" size={20} color={colors.greenInk} />
        <Text style={{ fontSize: 16, color: '#8a8a8a', flex: 1 }}>Search programs, for example nursing</Text>
      </Pressable>

      <Pressable onPress={() => goTab('eligibility')} accessibilityRole="button" style={(s) => [{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.greenSoft, borderRadius: 18, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: colors.green }, press(s)]}>
        <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="checkmark-circle" size={26} color="#1f1f1f" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', letterSpacing: 0.6, color: colors.greenInk }}>YOUR NEXT STEP</Text>
          <Text style={{ fontSize: 17, fontWeight: '700', color: colors.ink }}>Check what you qualify for</Text>
          <Text style={{ fontSize: 14, color: '#525252' }}>Enter your results and see where you stand.</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.ink} />
      </Pressable>

      {scope === 'intl' && (
        <Pressable onPress={() => openPage('sat')} accessibilityRole="button" style={(s) => [{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.orangeSoft, borderRadius: 18, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: colors.orange }, press(s)]}>
          <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="create" size={24} color="#1f1f1f" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.ink }}>Take a short SAT test</Text>
            <Text style={{ fontSize: 14, color: '#525252' }}>10 questions. Get a practice score, then check your eligibility.</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.ink} />
        </Pressable>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={H2}>{scope === 'local' ? 'Schools' : 'International schools'}</Text>
        <Text onPress={() => goTab('schools', { kind })} style={{ fontSize: 14, fontWeight: '700', color: colors.orangeInk }}>See all{!loading && total ? ` ${total.toLocaleString()}` : ''}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 16 }} style={{ marginHorizontal: -16, paddingLeft: 16, marginBottom: 12, flexGrow: 0 }}>
        {scope === 'local' && KINDS.map((k) => {
          const on = k.value === kind
          return (
            <Pressable key={k.value || 'all'} onPress={() => setKind(k.value)} accessibilityRole="button" accessibilityState={{ selected: on }} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: on ? colors.green : colors.line, backgroundColor: on ? colors.green : '#fff' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink }}>{k.label}</Text>
            </Pressable>
          )
        })}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 16 }} style={{ marginHorizontal: -16, paddingLeft: 16, marginBottom: 24, flexGrow: 0 }}>
        {loading && rows.length === 0 && [0, 1, 2].map((i) => <View key={i} style={{ width: 200, height: 150, borderRadius: 16, backgroundColor: '#ebe9dc' }} />)}
        {!loading && !!error && <Pressable onPress={() => setTries((n) => n + 1)}><Text style={{ color: colors.error, paddingVertical: 12 }}>{error} Tap to try again.</Text></Pressable>}
        {!loading && !error && rows.length === 0 && <Text style={{ color: colors.muted, paddingVertical: 12 }}>Nothing matches yet.</Text>}
        {rows.map(({ school, count }) => (
          <Pressable key={school.id} onPress={() => onOpenSchool({ id: school.id })} accessibilityRole="button" style={(s) => [{ width: 200, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 8 }, press(s)]}>
            <Monogram name={school.name} logo={school.logoUrl} kind={schoolCategory(school)} size={52} />
            <Text numberOfLines={2} style={{ fontSize: 15, fontWeight: '700', color: colors.ink, lineHeight: 20, minHeight: 40 }}>{school.name}</Text>
            <Text numberOfLines={1} style={{ fontSize: 13, color: colors.muted }}>{[school.city, schoolCategoryLabel(school)].filter(Boolean).join(' · ')}</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.greenInk }}>{count === 0 ? 'Programs not listed yet' : `${count} program${count === 1 ? '' : 's'}`}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={[H2, { marginBottom: 12 }]}>What do you want to study?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingRight: 16 }} style={{ marginHorizontal: -16, paddingLeft: 16, marginBottom: 8, flexGrow: 0 }}>
        {FIELDS.map(([f, icon]) => (
          <Pressable key={f} onPress={() => goTab('programs', { field: f })} accessibilityRole="button" accessibilityLabel={f} style={(s) => [{ alignItems: 'center', width: 78 }, press(s)]}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.orangeSoft, borderWidth: 1, borderColor: 'rgba(255,176,46,0.6)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={icon} size={28} color={colors.orangeInk} />
            </View>
            <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: '600', color: colors.ink, textAlign: 'center', marginTop: 6 }}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable onPress={() => goTab('scholarships')} accessibilityRole="button" style={(s) => [{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.orangeSoft, borderRadius: 18, padding: 16, marginTop: 16, borderWidth: 1, borderColor: 'rgba(255,176,46,0.6)' }, press(s)]}>
        <Ionicons name="ribbon" size={28} color={colors.orangeInk} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: colors.ink }}>Find scholarships</Text>
          <Text style={{ fontSize: 14, color: '#525252' }}>Browse funding by type and country.</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.ink} />
      </Pressable>
    </Screen>
  )
}
