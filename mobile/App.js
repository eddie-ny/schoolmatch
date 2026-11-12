import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View } from 'react-native'
import { AuthProvider, useAuth } from './src/AuthContext'
import { Login, MfaChallenge, Signup } from './src/AuthScreens'
import HomeScreen from './src/HomeScreen'
import { colors } from './src/lib/constants'

function Root() {
  const { user, loading } = useAuth()
  const [view, setView] = useState('login')

  if (loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.page }}><ActivityIndicator color={colors.orangeInk} /></View>
  }
  if (!user) return view === 'signup' ? <Signup goLogin={() => setView('login')} /> : <Login goSignup={() => setView('signup')} />
  if (user.mfaPending) return <MfaChallenge />
  return <HomeScreen />
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
      <StatusBar style="dark" />
    </AuthProvider>
  )
}
