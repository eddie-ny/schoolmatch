import { useLocation } from 'react-router-dom'
import { isLocal, useCatalog } from './useCatalog'

// The site has two sides, Local and International. Which one a page belongs to comes from the address.
export function scopeOf(pathname) {
  if (pathname === '/international' || pathname.startsWith('/international/')) return 'international'
  if (pathname === '/local' || pathname.startsWith('/local/')) return 'local'
  return null
}

export function useScope() {
  const { pathname } = useLocation()
  const scope = scopeOf(pathname) || 'local'
  const base = `/${scope}`
  return { scope, base, international: scope === 'international', to: (p = '') => `${base}${p}` }
}

// The catalogue for the side the visitor is on: Ghana for Local, schools abroad for International.
export function useScopedCatalog() {
  const c = useCatalog()
  const { international } = useScope()
  // Local shows only scholarships for study in Ghana; International shows only those for study abroad
  // (for example GETFund Local on Local, GETFund for foreign universities on International).
  if (!international) return { ...c, scholarships: c.scholarships.filter((s) => isLocal(s.country)) }
  return { ...c, schools: c.intl.schools, programs: c.intl.programs, scholarships: c.intl.scholarships }
}
