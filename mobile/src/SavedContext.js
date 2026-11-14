import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import * as api from './lib/api'

// The programs the student hearted. One list for the whole app, so a heart on a program page and the Interested page always agree.
const SavedContext = createContext({ ids: new Set(), error: '', toggle: async () => {}, reload: () => {} })
export const useSaved = () => useContext(SavedContext)

export function SavedProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.id
  const [ids, setIds] = useState(new Set())
  const [error, setError] = useState('')
  const [n, setN] = useState(0)

  useEffect(() => {
    let live = true
    setIds(new Set())
    if (!uid) return undefined
    api.listSavedIds().then((x) => live && setIds(new Set(x))).catch((e) => live && setError(e.message))
    return () => { live = false }
  }, [uid, n])

  // programIds: every way of studying the program (one heart covers them all).
  const toggle = useCallback(async (programIds, on) => {
    setError('')
    const before = ids
    setIds((cur) => { const n = new Set(cur); programIds.forEach((i) => (on ? n.add(i) : n.delete(i))); return n })
    try { for (const i of programIds) await api.setSaved(i, on) } catch (e) { setIds(before); setError(e.message) }
  }, [ids])

  return <SavedContext.Provider value={{ ids, error, toggle, fail: setError, reload: () => setN((x) => x + 1) }}>{children}</SavedContext.Provider>
}
