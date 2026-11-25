import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import * as api from './lib/api'
import { supabase } from './lib/supabase'
import { getAccess } from './lib/access'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  // Bumped on sign out so a slow in-flight refresh can never put the old user back.
  const generation = useRef(0)

  const refresh = useCallback(async () => {
    const gen = generation.current
    try {
      const u = await api.getCurrentUser()
      if (u?.disabled) {
        // A disabled account is signed out straight away.
        generation.current += 1
        setUser(null)
        setNotice('This account is closed or disabled. Contact support if you think this is a mistake.')
        api.signOut().catch(() => {})
        return
      }
      if (gen === generation.current) setUser(u)
    } catch (e) {
      console.error(e)
      if (gen === generation.current) setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setUser(null)
        setLoading(false)
        return
      }
      // Do not call Supabase directly inside this callback; defer to avoid a deadlock (same as the web app).
      setTimeout(refresh, 0)
    })
    return () => data.subscription.unsubscribe()
  }, [refresh])

  // A plan or trial can end, or be bought on the website, while the app is open. Recheck the account each time the
  // app comes back to the screen, so it locks (or unlocks) without a restart. The database enforces the same rule anyway.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => { if (s === 'active' && user) refresh() })
    return () => sub.remove()
  }, [user, refresh])

  // If full access ends while the app stays open on screen, recheck at that moment (plus a second) so the screens lock.
  useEffect(() => {
    const end = getAccess(user).expiresAt
    if (!end) return undefined
    const wait = new Date(end).getTime() - Date.now() + 1000
    if (wait <= 0 || wait > 2 ** 31 - 1) return undefined // setTimeout cannot wait longer than about 24.8 days
    const t = setTimeout(refresh, wait)
    return () => clearTimeout(t)
  }, [user, refresh])

  const signOut = useCallback(async () => {
    generation.current += 1
    setUser(null) // the screen updates at once; the server call finishes in the background
    setNotice('You have been signed out.')
    try {
      await api.signOut()
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, notice, clearNotice: () => setNotice(''), refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
