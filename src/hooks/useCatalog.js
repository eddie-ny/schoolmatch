import { useEffect, useState } from 'react'
import { loadCatalog } from '../lib/api'
import { SHOW_INTERNATIONAL } from '../lib/constants'

export function useCatalog() {
  const [data, setData] = useState({ schools: [], programs: [], scholarships: [], loading: true, error: '' })
  useEffect(() => {
    let live = true
    loadCatalog()
      .then((c) => {
        if (!live) return
        const local = SHOW_INTERNATIONAL ? c : {
          ...c,
          schools: c.schools.filter((s) => isLocal(s.country)),
          programs: c.programs.filter((p) => !p.international),
          scholarships: c.scholarships.filter((s) => isLocal(s.country)),
        }
        setData({ ...local, loading: false, error: '' })
      })
      .catch((e) => live && setData({ schools: [], programs: [], scholarships: [], loading: false, error: e.message }))
    return () => { live = false }
  }, [])
  return data
}

export const isLocal = (country) => (country || '').toLowerCase() === 'ghana'
