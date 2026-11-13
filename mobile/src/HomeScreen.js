import { useEffect, useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import * as api from './lib/api'
import { colors } from './lib/constants'
import { SCHOOL_CATEGORIES } from './lib/schoolCategory'
import { SchoolCard } from './SchoolParts'
import { Badge, Button, Chips, ErrorText, Screen, styles } from './ui'

const TASKS = [
  { tab: 'schools', title: 'Find a School', text: 'Search Ghanaian universities and their programs.', bar: colors.orange },
  { tab: 'programs', title: 'Find Programs', text: 'Every program, and the schools that offer it.', bar: colors.green },
  { tab: 'scholarships', title: 'Find Scholarships', text: 'Browse funding by type and country.', bar: colors.orange },
  { tab: 'eligibility', title: 'Check My Eligibility', text: 'Enter your results and see where you stand.', bar: colors.green },
]
const FIELDS = [
  ['Computing', 'Computer science, IT, data'], ['Engineering', 'Civil, electrical, mechanical'], ['Business', 'Management, finance, marketing'],
  ['Health', 'Medicine, nursing, pharmacy'], ['Science', 'Physics, chemistry, biology'], ['Arts', 'Humanities, languages, design'],
  ['Law', 'Law and public policy'], ['Education', 'Teaching and development'], ['Agriculture', 'Farming, food and natural resources'],
  ['Social Sciences', 'Economics, development, policy'],
]
const STEPS = [
  ['1', 'Create your account', 'Sign up free. Your 24-hour trial starts straight away.'],
  ['2', 'Complete your profile', 'Tell us the SHS you attended and the program you studied.'],
  ['3', 'Enter your results', 'Add your grades and we work out your aggregate.'],
  ['4', 'Pick what to study', 'Choose a program and see every school that offers it.'],
  ['5', 'See where you stand', 'Each school is labelled Strong match, Good chance or Worth a try.'],
]
const KINDS = [{ value: '', label: 'All schools' }, ...SCHOOL_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))]
const H2 = { fontSize: 22, fontWeight: '700', color: colors.ink }

// Local home page: same sections and order as the website (hero, tasks, browse, what to study, journey).
// Scholarships in Browse and the picture beside the hero text come later.
export default function HomeScreen({ goTab, onOpenSchool }) {
  const [kind, setKind] = useState('')
  const [st, setSt] = useState({ rows: [], total: 0, loading: true, error: '' })
  const [tries, setTries] = useState(0)
  const [study, setStudy] = useState('')

  useEffect(() => {
    let live = true
    setSt((s) => ({ ...s, loading: true, error: '' }))
    api.searchSchools({ scope: 'local', kind, limit: 6, offset: 0 })
      .then((r) => live && setSt({ ...r, loading: false, error: '' }))
      .catch((e) => live && setSt({ rows: [], total: 0, loading: false, error: e.message }))
    return () => { live = false }
  }, [kind, tries])

  const { rows, total, loading, error } = st
  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: 14, paddingTop: 8, paddingBottom: 28 }}>
        <View style={{ borderWidth: 1, borderColor: 'rgba(255,176,46,0.6)', backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 6 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink }}>Free for your first 24 hours</Text>
        </View>
        <Text style={{ fontSize: 34, fontWeight: '700', lineHeight: 42, textAlign: 'center', color: '#171717' }}>
          Find the <Text style={{ color: '#9CC722' }}>right school</Text> for <Text style={{ color: '#FFB02E' }}>your results</Text>
        </Text>
        <Text style={{ fontSize: 17, lineHeight: 25, textAlign: 'center', color: '#404040' }}>
          Check your eligibility for Ghanaian universities and find scholarships, all in one place.
        </Text>
        <View style={{ alignSelf: 'stretch', gap: 12, marginTop: 6 }}>
          <Button label="Check My Eligibility" onPress={() => goTab('eligibility')} />
          <Button variant="outline" label="Find a School" onPress={() => goTab('schools')} />
        </View>
      </View>

      <View style={{ gap: 10, marginBottom: 28 }}>
        <Text style={H2}>Your results, matched to schools</Text>
        <Text style={{ fontSize: 16, lineHeight: 24, color: '#525252' }}>Enter your grades, pick a program and see every school that offers it, labelled by your chances.</Text>
        <View style={{ alignSelf: 'flex-start' }}><Button variant="outline" label="Try it now" onPress={() => goTab('eligibility')} /></View>
      </View>

      <View style={{ gap: 12, marginBottom: 32 }}>
        {TASKS.map((t) => (
          <Pressable key={t.tab} onPress={() => goTab(t.tab)} accessibilityRole="button" style={{ borderWidth: 1, borderColor: '#e5e5e5', borderLeftWidth: 8, borderLeftColor: t.bar, borderRadius: 16, padding: 18, backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.ink }}>{t.title}</Text>
            <Text style={{ fontSize: 15, color: '#525252', marginTop: 2 }}>{t.text}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ gap: 12, marginBottom: 32 }}>
        <Text style={H2}>Browse</Text>
        <Chips value={kind} options={KINDS} onChange={setKind} />
        {!loading && <Text style={styles.hint}>{total.toLocaleString()} result{total === 1 ? '' : 's'}</Text>}
        {!!error && <View style={{ gap: 6 }}><ErrorText>{error}</ErrorText><Button variant="outline" label="Try again" onPress={() => setTries((n) => n + 1)} /></View>}
        {!error && rows.length === 0 && !loading && <Text style={styles.body}>Nothing matches these filters yet.</Text>}
        {rows.map(({ school, count }) => <SchoolCard key={school.id} s={school} count={count} onOpen={() => onOpenSchool({ id: school.id })} />)}
        {!loading && total > 6 && <Button variant="outline" label={`See all ${total.toLocaleString()} schools`} onPress={() => goTab('schools', { kind })} />}
      </View>

      <View style={{ gap: 12, marginBottom: 32 }}>
        <Text style={H2}>What do you want to study?</Text>
        <TextInput
          value={study} onChangeText={setStudy} onSubmitEditing={() => goTab('programs', { q: study.trim() })} returnKeyType="search" autoCorrect={false}
          placeholder="Type a program, for example nursing, law or computer science" placeholderTextColor="#9a9a9a" accessibilityLabel="Search programs"
          style={[styles.input, { borderWidth: 2, borderColor: colors.green }]}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {FIELDS.map(([f, blurb]) => (
            <Pressable key={f} onPress={() => goTab('programs', { field: f })} accessibilityRole="button" style={{ width: '48%', marginBottom: 10, minHeight: 96, borderWidth: 2, borderColor: '#e5e5e5', borderRadius: 16, padding: 14, backgroundColor: '#fff' }}>
              <Text style={{ fontWeight: '700', fontSize: 16, color: colors.ink }}>{f}</Text>
              <Text style={{ fontSize: 13, color: '#525252', marginTop: 4 }}>{blurb}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text style={[H2, { textAlign: 'center' }]}>Your journey</Text>
        {STEPS.map(([n, title, text]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.line }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontWeight: '700', fontSize: 16, color: '#1f1f1f' }}>{n}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', fontSize: 16, color: colors.ink }}>{title}</Text>
              <Text style={{ fontSize: 14, color: '#525252', marginTop: 2 }}>{text}</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  )
}
