import { useEffect, useState } from 'react'
import { loadCatalog } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { SHOW_INTERNATIONAL } from '../lib/constants'

// The catalogue is big, so it is loaded once and shared by every page for a few minutes instead of on each page visit.
// The cache is keyed by who is signed in and their access level, because the details a person may read depend on both.
const TTL = 5 * 60 * 1000
let cached = null // { key, at, promise, value }

function shape(c) {
  return SHOW_INTERNATIONAL ? c : {
    ...c,
    schools: c.schools.filter((s) => isLocal(s.country)),
    programs: c.programs.filter((p) => !p.international),
    scholarships: c.scholarships.filter((s) => isLocal(s.country)),
  }
}

function getCatalog(key) {
  if (cached && cached.key === key && Date.now() - cached.at < TTL) return cached
  const entry = { key, at: Date.now(), value: null }
  entry.promise = loadCatalog().then((c) => (entry.value = shape(c)))
  entry.promise.catch(() => { if (cached === entry) cached = null })
  cached = entry
  return entry
}

export function clearCatalogCache() { cached = null }

export function useCatalog() {
  const { user, access } = useAuth()
  const key = `${user?.id || 'anon'}|${access.level}`
  const hit = cached && cached.key === key && Date.now() - cached.at < TTL && cached.value
  const [data, setData] = useState(hit ? { ...hit, loading: false, error: '' } : { schools: [], programs: [], scholarships: [], loading: true, error: '' })
  useEffect(() => {
    let live = true
    const entry = getCatalog(key)
    if (entry.value) { setData({ ...entry.value, loading: false, error: '' }); return }
    setData((d) => (d.loading ? d : { ...d, loading: true }))
    entry.promise
      .then((c) => live && setData({ ...c, loading: false, error: '' }))
      .catch((e) => live && setData({ schools: [], programs: [], scholarships: [], loading: false, error: e.message }))
    return () => { live = false }
  }, [key])
  return data
}

export const isLocal = (country) => (country || '').toLowerCase() === 'ghana'
