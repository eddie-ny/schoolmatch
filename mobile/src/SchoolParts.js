import { useEffect, useState } from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SITE, colors } from './lib/constants'
import { logoFor } from './lib/logos'
import { schoolCategory, schoolCategoryLabel } from './lib/schoolCategory'
import { thumbUrl } from './lib/thumb'
import { Badge, Button } from './ui'

export function useDebounced(value, ms = 350) {
  const [v, setV] = useState(value)
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t) }, [value, ms])
  return v
}

const ICONS = { 'Nursing college': 'heart', 'College of Education': 'school' }
const absolute = (u) => (u && u.startsWith('/') ? SITE + u : u)

// The school's logo when there is one, otherwise a square with its initials (or a shared icon for nursing and education colleges).
export function Monogram({ name, logo, kind, size = 48 }) {
  const [broken, setBroken] = useState(false)
  const url = absolute(logo || logoFor(name))
  const box = { width: size, height: size, borderRadius: size / 4, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }
  if ((!url || broken) && ICONS[kind]) {
    return <View style={[box, { backgroundColor: colors.greenSoft }]}><Ionicons name={ICONS[kind]} size={size / 2} color={colors.ink} /></View>
  }
  if (url && !broken) {
    return (
      <View style={[box, { backgroundColor: '#fff' }]}>
        <Image source={{ uri: thumbUrl(url, 250) }} resizeMode="contain" onError={() => setBroken(true)} style={{ width: size - 8, height: size - 8 }} />
      </View>
    )
  }
  const initials = (name || '?').replace(/\(.*?\)/g, '').split(/\s+/).filter((w) => /^[A-Za-z]/.test(w) && !['of', 'for', 'and', 'the'].includes(w.toLowerCase())).slice(0, 3).map((w) => w[0].toUpperCase()).join('')
  return <View style={[box, { backgroundColor: colors.greenSoft }]}><Text style={{ fontWeight: '700', fontSize: size / 3.4, color: colors.ink }}>{initials || '?'}</Text></View>
}

// One school in a list: the same facts as the website's card.
export function SchoolCard({ s, count, matches = [], matched, onOpen }) {
  const more = (matched ?? matches.length) - Math.min(matches.length, 3)
  const where = [s.city, s.country].filter(Boolean).join(', ')
  return (
    <View style={cardStyle}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <Monogram name={s.name} logo={s.logoUrl} kind={schoolCategory(s)} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink, lineHeight: 22 }}>{s.name}</Text>
          {!!where && <Text style={{ fontSize: 14, color: colors.muted }}>{where}</Text>}
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Badge>{schoolCategoryLabel(s)}</Badge>
        {!!s.type && <Badge>{s.type}</Badge>}
        <Badge>{count === 0 ? 'Programmes not listed yet' : `${count} program${count === 1 ? '' : 's'}`}</Badge>
      </View>
      {matches.length > 0 && (
        <View>
          <Text style={{ fontSize: 14, color: '#777' }}>Matching programs</Text>
          {matches.slice(0, 3).map((p, i) => <Text key={p.id || i} style={{ fontSize: 14, color: colors.ink }}>{'•  '}{p.name || p}</Text>)}
          {more > 0 && <Text style={{ fontSize: 14, color: '#777' }}>and {more} more</Text>}
        </View>
      )}
      <Button variant="outline" label={matches.length > 0 ? 'See these programs' : 'View programmes'} onPress={onOpen} />
    </View>
  )
}

export const cardStyle = { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: colors.line }
