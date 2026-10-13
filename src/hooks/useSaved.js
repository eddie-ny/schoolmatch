import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listSavedIds, setSaved } from '../lib/api'

// The signed-in student's hearted programs. Visitors who press the heart are sent to sign in.
export function useSaved() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [ids, setIds] = useState(() => new Set())
  const [error, setError] = useState('')
  const uid = user && !user.mfaPending ? user.id : null

  useEffect(() => {
    let live = true
    if (!uid) { setIds(new Set()); return }
    listSavedIds().then((x) => live && setIds(new Set(x))).catch((e) => live && setError(e.message))
    return () => { live = false }
  }, [uid])

  const toggle = useCallback(async (programId) => {
    if (!uid) { nav('/login'); return }
    const on = !ids.has(programId)
    setError('')
    setIds((cur) => { const n = new Set(cur); if (on) n.add(programId); else n.delete(programId); return n }) // show it at once
    try { await setSaved(programId, on) } catch (e) {
      setError(e.message)
      setIds((cur) => { const n = new Set(cur); if (on) n.delete(programId); else n.add(programId); return n }) // put it back
    }
  }, [uid, ids, nav])

  return { ids, toggle, error }
}
