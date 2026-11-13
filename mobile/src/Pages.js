import { Linking, Text, View } from 'react-native'
import { useAuth } from './AuthContext'
import { BackLink, Button, Card, Screen, Title, styles } from './ui'

// A page that is not built yet. Each one is a later step of the plan.
export function ComingSoon({ title, onBack }) {
  return (
    <Screen>
      {onBack && <BackLink label="Back" onPress={onBack} />}
      <Title title={title} sub="Coming soon. We are still building this page in the app." />
    </Screen>
  )
}

// The profile saved in the database (same facts as the sign-up check in step 4). The editable profile comes in step 8.
export function ProfilePage({ onBack }) {
  const { user } = useAuth()
  const rows = [
    ['Name', user.fullName], ['Email', user.email], ['Phone', user.phone], ['Date of birth', user.dateOfBirth],
    ['Under 18', user.isMinor ? 'Yes (a parent must confirm)' : 'No'],
    ['Free trial ends', user.trialEndsAt ? new Date(user.trialEndsAt).toString() : 'Not set'],
  ]
  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <Title title="Profile" />
      <Card>
        {rows.map(([k, v]) => (
          <View key={k}><Text style={styles.hint}>{k}</Text><Text style={styles.body}>{v || 'Not set'}</Text></View>
        ))}
      </Card>
    </Screen>
  )
}

// Same contact details as the website's Contact us page.
export function ContactPage({ onBack }) {
  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <Title title="Contact us" sub="Questions about the app, your account or a payment? Reach us here." />
      <Card>
        <Text style={styles.hint}>Phone</Text>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>+233 20 565 8716</Text>
        <Button label="Call us" onPress={() => Linking.openURL('tel:+233205658716')} />
        <Text style={[styles.hint, { marginTop: 8 }]}>Email</Text>
        <Text selectable style={{ fontSize: 18, fontWeight: '700' }}>info@inbox.jambaconsult.com</Text>
        <Button variant="outline" label="Send an email" onPress={() => Linking.openURL('mailto:info@inbox.jambaconsult.com')} />
      </Card>
    </Screen>
  )
}
