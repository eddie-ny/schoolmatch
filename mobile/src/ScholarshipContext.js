import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Pressable, Text } from 'react-native'
import * as api from './lib/api'
import { colors } from './lib/constants'
import { fundingRank } from './lib/scholarshipSections'
import { ShellActions } from './ui'

// All scholarships, loaded once for the whole app. The Scholarships tab, the school pages and the "Scholarship available" tags all read this list.
const Ctx = createContext({ rows: [], bySchool: {}, loading: true, error: '', reload: () => {} })
export const useScholarships = () => useContext(Ctx)

export function ScholarshipProvider({ children }) {
  const [st, setSt] = useState({ rows: [], loading: true, error: '' })
  const [n, setN] = useState(0)
  useEffect(() => {
    let live = true
    setSt((s) => ({ ...s, loading: true, error: '' }))
    api.listScholarships().then((rows) => live && setSt({ rows, loading: false, error: '' })).catch((e) => live && setSt({ rows: [], loading: false, error: e.message }))
    return () => { live = false }
  }, [n])
  const reload = useCallback(() => setN((x) => x + 1), [])
  const bySchool = useMemo(() => {
    const m = {}
    for (const s of st.rows) if (s.schoolId) (m[s.schoolId] ||= []).push(s)
    for (const k of Object.keys(m)) m[k].sort((a, b) => fundingRank(a.fundingType) - fundingRank(b.fundingType))
    return m
  }, [st.rows])
  return <Ctx.Provider value={{ ...st, bySchool, reload }}>{children}</Ctx.Provider>
}

// Narrow a school's scholarships to the level a student is looking at. A scholarship with no level stated is kept.
// The summary list carries no level, so this only matters once details are loaded; masters=null keeps everything.
export function forLevel(list = [], masters) {
  if (masters == null) return list
  return list.filter((s) => {
    const l = String(s.level || '').toLowerCase()
    if (!l) return true
    return masters ? /postgrad|master|graduate/.test(l) : /undergrad|bachelor|first-year/.test(l)
  })
}

// "Scholarship available" tag for a school or program card. One scholarship opens it; several open the school page where they are all listed.
export function ScholarshipBadge({ schoolId }) {
  const { bySchool } = useScholarships()
  const { openSchool, openScholarship } = useContext(ShellActions)
  const list = bySchool[schoolId]
  if (!list?.length) return null
  const best = list[0]
  const many = list.length > 1
  const label = many ? `${list.length} scholarships available` : best.fundingType === 'Full' ? 'Fully funded scholarship available' : 'Scholarship available'
  return (
    <Pressable onPress={() => (many ? openSchool({ id: schoolId }) : openScholarship({ id: best.id }))} accessibilityRole="button"
      style={{ alignSelf: 'flex-start', backgroundColor: best.fundingType === 'Full' ? colors.green : colors.orange, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.ink }}>{label}</Text>
    </Pressable>
  )
}
