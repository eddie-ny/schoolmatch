import { Text, View } from 'react-native'
import { useAuth } from './AuthContext'
import { Button, Card, Screen, Title, styles } from './ui'

// Placeholder for step 4: shows what the database holds for the signed-in student, so the sign-up can be checked.
// The real home page (fields of study, search, eligibility) is built in the next steps.
export default function HomeScreen() {
  const { user, signOut } = useAuth()
  const rows = [
    ['Name', user.fullName],
    ['Email', user.email],
    ['Phone', user.phone],
    ['Date of birth', user.dateOfBirth],
    ['Under 18', user.isMinor ? 'Yes (a parent must confirm)' : 'No'],
    ['Free trial ends', user.trialEndsAt ? new Date(user.trialEndsAt).toString() : 'Not set'],
  ]
  return (
    <Screen>
      <Title title={`Welcome, ${(user.fullName || '').trim().split(/\s+/)[0] || 'student'}`} sub="You are signed in. This is the profile saved for you in the database." />
      <Card>
        {rows.map(([k, v]) => (
          <View key={k}>
            <Text style={styles.hint}>{k}</Text>
            <Text style={styles.body}>{v || 'Not set'}</Text>
          </View>
        ))}
        <Button label="Sign out" variant="outline" onPress={signOut} />
      </Card>
    </Screen>
  )
}
