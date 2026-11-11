import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { searchSchools } from './src/lib/api'

// Step 3 check screen: shows that the app can read schools from the database. Replaced by the real schools list in step 5.
export default function App() {
  const [state, setState] = useState({ loading: true, rows: [], total: 0, error: '' })

  useEffect(() => {
    searchSchools({ scope: 'local', limit: 3 })
      .then(({ rows, total }) => setState({ loading: false, rows, total, error: '' }))
      .catch((e) => setState({ loading: false, rows: [], total: 0, error: e.message }))
  }, [])

  return (
    <View style={styles.container}>
      {state.loading && <ActivityIndicator />}
      {!!state.error && <Text>{state.error}</Text>}
      {!state.loading && !state.error && (
        <>
          <Text style={styles.title}>{state.total} local schools</Text>
          {state.rows.map((r) => <Text key={r.school.id}>{r.school.name}</Text>)}
        </>
      )}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontWeight: 'bold', marginBottom: 8 },
})
