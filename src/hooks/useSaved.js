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

  // A card stands for every way of studying a programme. It is kept if any of them is kept, and removing it removes them all.
  const idsOf = (p) => (p.variants || [p]).map((v) => v.id)
  const isSaved = (p) => idsOf(p).some((id) => ids.has(id))
  const toggleProgram = (p) => {
    const on = idsOf(p).filter((id) => ids.has(id))
    if (on.length) on.forEach((id) => toggle(id))
    else toggle(p.id)
  }

  return { ids, toggle, error, isSaved, toggleProgram }
}
