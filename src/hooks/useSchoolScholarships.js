import { useMemo } from 'react'
import { useCatalog } from './useCatalog'
import { fundingRank } from '../lib/scholarshipSections'

// Which schools have scholarships, so cards can say "Scholarship available" and link to it.
// Best first: fully funded, then partial, then the rest.
export function useSchoolScholarships() {
  const cat = useCatalog()
  return useMemo(() => {
    const all = [...cat.scholarships, ...(cat.intl?.scholarships || [])]
    const seen = new Set()
    const bySchool = {}
    const external = []
    for (const s of all) {
      if (seen.has(s.id)) continue
      seen.add(s.id)
      if (!s.schoolId) { external.push(s); continue }
      ;(bySchool[s.schoolId] ||= []).push(s)
    }
    for (const k of Object.keys(bySchool)) bySchool[k].sort((a, b) => fundingRank(a.fundingType) - fundingRank(b.fundingType))
    const schools = Object.fromEntries([...cat.schools, ...(cat.intl?.schools || [])].map((x) => [x.id, x]))
    external.sort((a, b) => fundingRank(a.fundingType) - fundingRank(b.fundingType))
    return { bySchool, external, schools, loading: cat.loading }
  }, [cat])
}

// Narrow a school's scholarships to the level a student is looking at. A scholarship with no level stated is kept.
export function forLevel(list = [], masters) {
  return list.filter((s) => {
    const l = String(s.level || '').toLowerCase()
    if (!l) return true
    return masters ? /postgrad|master|graduate/.test(l) : /undergrad|bachelor|first-year/.test(l)
  })
}
