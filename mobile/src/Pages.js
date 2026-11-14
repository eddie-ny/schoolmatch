import { Linking, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from './lib/constants'
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

// Same contact details and wording as the website's Contact us page.
export function ContactPage({ onBack }) {
  const Way = ({ icon, tint, title, text, action, onPress }) => (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [{ backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 14, opacity: pressed ? 0.85 : 1 }]}>
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: tint, alignItems: 'center', justifyContent: 'center' }}><Ionicons name={icon} size={26} color={colors.ink} /></View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.ink }}>{title}</Text>
        <Text style={{ fontSize: 15, color: colors.muted }}>{text}</Text>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.orangeInk, marginTop: 4 }}>{action}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  )
  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <View style={{ backgroundColor: colors.greenSoft, borderRadius: 22, padding: 22, marginBottom: 16, gap: 8 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.ink }}>We are here to help</Text>
        <Text style={{ fontSize: 15, color: '#444', lineHeight: 22 }}>Questions about your account, a payment or a school? Call or write to us and we will get back to you.</Text>
      </View>
      <View style={{ gap: 12 }}>
        <Way icon="call" tint={colors.orange} title="Call us" text="+233 20 565 8716" action="Call now" onPress={() => Linking.openURL('tel:+233205658716')} />
        <Way icon="mail" tint={colors.green} title="Email us" text="info@inbox.jambaconsult.com" action="Send an email" onPress={() => Linking.openURL('mailto:info@inbox.jambaconsult.com')} />
        <Way icon="flag" tint={colors.orangeSoft} title="Report a problem" text="Wrong information, something broken, or feedback." action="Email us the details" onPress={() => Linking.openURL('mailto:info@inbox.jambaconsult.com?subject=Problem%20report')} />
      </View>
      <View style={{ marginTop: 16 }}>
        <Card>
          <Text style={{ fontSize: 17, fontWeight: '700', color: colors.ink }}>To help us answer faster</Text>
          {['Tell us the email you signed up with.', 'For a payment question, send the payment reference from your Paystack receipt.', 'For a school or program question, send its name.'].map((x) => (
            <View key={x} style={{ flexDirection: 'row', gap: 8 }}><Text style={styles.body}>{'\u2022'}</Text><Text style={[styles.body, { flex: 1 }]}>{x}</Text></View>
          ))}
        </Card>
      </View>
    </Screen>
  )
}
