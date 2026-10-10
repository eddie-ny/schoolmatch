import { useEffect, useState } from 'react'
import { loadCatalog } from '../lib/api'

export function useCatalog() {
  const [data, setData] = useState({ schools: [], programs: [], scholarships: [], loading: true, error: '' })
  useEffect(() => {
    let live = true
    loadCatalog()
      .then((c) => live && setData({ ...c, loading: false, error: '' }))
      .catch((e) => live && setData({ schools: [], programs: [], scholarships: [], loading: false, error: e.message }))
    return () => { live = false }
  }, [])
  return data
}

export const isLocal = (country) => (country || '').toLowerCase() === 'ghana'
