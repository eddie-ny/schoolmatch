import { AppState } from 'react-native'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  // Fail loudly in development so a missing .env is obvious.
  console.error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env and fill them in.')
}

// Only the public (anon) key is used here. Row-level security in the database decides what each user can read or write.
// The session is kept on the phone in AsyncStorage. There is no browser address bar, so detectSessionInUrl is off.
export const supabase = createClient(url || 'http://localhost', key || 'missing', {
  auth: { storage: AsyncStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
})

// Supabase's React Native guide: refresh the login only while the app is on screen.
AppState.addEventListener('change', (state) => {
  if (state === 'active') supabase.auth.startAutoRefresh()
  else supabase.auth.stopAutoRefresh()
})
