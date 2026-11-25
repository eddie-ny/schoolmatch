import { useState } from 'react'
import { Linking, Pressable, Share, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SITE, colors } from './lib/constants'
import { BackLink, Button, Card, Screen, Title, styles } from './ui'

// Same money format as the website: whole amounts without decimals, others with two.
// ---------- Invite friends: the phone's share sheet plus direct links, same message as the website ----------
export function InvitePage({ onBack }) {
  const url = SITE
  const text = 'Check which Ghanaian school programs you qualify for, and find scholarships, on Jamba.'
  const [note, setNote] = useState('')
  const e = encodeURIComponent
  const targets = [
    { icon: 'logo-whatsapp', color: '#25D366', label: 'WhatsApp', href: `https://wa.me/?text=${e(`${text} ${url}`)}` },
    { icon: 'paper-plane', color: '#26A5E4', label: 'Telegram', href: `https://t.me/share/url?url=${e(url)}&text=${e(text)}` },
    { icon: 'logo-facebook', color: '#0866FF', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}` },
    { icon: 'logo-x', color: '#000', label: 'X', href: `https://twitter.com/intent/tweet?text=${e(text)}&url=${e(url)}` },
    { icon: 'chatbubble', color: '#34C759', label: 'Text message', href: `sms:?body=${e(`${text} ${url}`)}` },
    { icon: 'mail', color: '#EA4335', label: 'Email', href: `mailto:?subject=${e('Try Jamba')}&body=${e(`${text}\n\n${url}`)}` },
  ]
  const share = async () => {
    setNote('')
    try { await Share.share({ message: `${text} ${url}`, title: 'Jamba' }) } catch { setNote('Sharing did not open. Use one of the buttons below.') }
  }
  const open = (href) => Linking.openURL(href).catch(() => setNote('That app is not on this phone. Try another button or Share.'))
  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <Title title="Invite friends" sub="Know someone finishing senior high school? Send them the link." />
      <Card>
        <Text style={styles.body}>{text}</Text>
        <Text selectable style={{ fontWeight: '700', color: colors.ink }}>{url}</Text>
        <Button label="Share" onPress={share} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {targets.map((t) => (
            <Pressable key={t.label} onPress={() => open(t.href)} accessibilityRole="button"
              style={{ width: '48%', flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff' }}>
              <Ionicons name={t.icon} size={22} color={t.color} />
              <Text style={{ fontWeight: '600', color: colors.ink }}>{t.label}</Text>
            </Pressable>
          ))}
        </View>
        {!!note && <Text style={styles.hint}>{note}</Text>}
      </Card>
    </Screen>
  )
}
