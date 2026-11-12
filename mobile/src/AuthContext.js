import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import * as api from './lib/api'
import { supabase } from './lib/supabase'

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
