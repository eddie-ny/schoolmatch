import { useEffect, useState } from 'react'
import { AppState, Linking, Pressable, Share, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from './AuthContext'
import * as api from './lib/api'
import { getAccess } from './lib/access'
import { SITE, colors } from './lib/constants'
import { BackLink, Button, Card, ErrorText, Notice, Screen, Title, styles } from './ui'

// Same money format as the website: whole amounts without decimals, others with two.
const digits = (minor) => (minor % 100 ? 2 : 0)
const usd = (cents) => `USD ${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: digits(cents), maximumFractionDigits: 2 })}`
const money = (minor, currency) => `${currency} ${(minor / 100).toLocaleString(undefined, { minimumFractionDigits: digits(minor), maximumFractionDigits: 2 })}`

// ---------- Pricing: same plans, prices and Paystack checkout as the website's Pricing page ----------
export function PricingPage({ onBack }) {
  const { user, refresh } = useAuth()
  const access = getAccess(user)
  const [plans, setPlans] = useState([])
  const [rate, setRate] = useState(null)
  const [plan, setPlan] = useState('3m')
  const [agreed, setAgreed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [ref, setRef] = useState('')

  useEffect(() => { api.listPlans().then(setPlans).catch((e) => setError(e.message)); api.getRate().then(setRate).catch(() => {}) }, [])

  // Payment happens on Paystack's page in the phone's browser. When the person comes back to the app we ask the server to confirm it.
  const confirm = async (reference = ref) => {
    if (!reference) return
    setError('')
    setMsg('Confirming your payment...')
    try {
      const status = await api.verifyPayment(reference)
      await refresh()
      if (status === 'activated' || status === 'already_activated') { setMsg('Payment received. Your plan is active.'); setRef('') }
      else if (status === 'not_paid') setMsg('Paystack has not confirmed this payment yet. If you paid, wait a minute and tap "I have paid" again.')
      else setMsg(`We could not match this payment. Contact support with your payment reference: ${reference}`)
    } catch (e) { setMsg(''); setError(e.message) }
  }
  useEffect(() => {
    if (!ref) return undefined
    const sub = AppState.addEventListener('change', (s) => { if (s === 'active') confirm(ref) })
    return () => sub.remove()
  }, [ref]) // eslint-disable-line react-hooks/exhaustive-deps

  const chosen = plans.find((p) => p.id === plan)
  const pay = async () => {
    setError('')
    setMsg('')
    setBusy(true)
    try {
      const { url, reference } = await api.startCheckout(plan)
      setRef(reference)
      await Linking.openURL(url)
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  const base = plans.find((x) => x.months === 1)
  const longest = Math.max(0, ...plans.map((x) => x.months))

  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <Title title="Pricing" sub="Start with the 24-hour free trial. Subscribe for full details." />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        {plans.map((p) => {
          const hasUsd = p.price_usd_cents > 0
          const main = hasUsd ? p.price_usd_cents : p.price_minor
          const baseMain = hasUsd ? base?.price_usd_cents : base?.price_minor
          const perMonth = main / p.months
          const save = baseMain && p.months > 1 ? Math.round((1 - perMonth / baseMain) * 100) : 0
          const on = plan === p.id
          return (
            <Pressable key={p.id} onPress={() => setPlan(p.id)} accessibilityRole="radio" accessibilityState={{ checked: on }}
              style={{ width: '47.5%', backgroundColor: on ? colors.orangeSoft : '#fff', borderRadius: 18, borderWidth: 2, borderColor: on ? colors.orange : colors.line, padding: 14, paddingTop: 20, gap: 3 }}>
              {p.months === longest && longest > 1 && (
                <View style={{ position: 'absolute', top: -11, left: 12, backgroundColor: colors.orange, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 2 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff' }}>Best value</Text>
                </View>
              )}
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink }}>{p.label}</Text>
              <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink }}>{main ? (hasUsd ? usd(main) : money(main, p.currency)) : 'Price to be set'}</Text>
              {main > 0 && <Text style={{ fontSize: 11, fontWeight: '600', color: '#444' }}>Includes 20% VAT and levies</Text>}
              {hasUsd && p.price_minor > 0 && <Text style={styles.hint}>{money(p.price_minor, p.currency)} at checkout</Text>}
              {main > 0 && p.months > 1 && <Text style={styles.hint}>{hasUsd ? usd(Math.round(perMonth)) : money(Math.round(perMonth), p.currency)} a month</Text>}
              {save > 0 && <View style={{ alignSelf: 'flex-start', backgroundColor: colors.greenSoft, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 }}><Text style={{ fontSize: 11, fontWeight: '800', color: colors.ink }}>Save {save}%</Text></View>}
            </Pressable>
          )
        })}
      </View>
      <Card>
        {!!msg && <Notice>{msg}</Notice>}
        <ErrorText>{error}</ErrorText>
        <Pressable onPress={() => setAgreed(!agreed)} accessibilityRole="checkbox" accessibilityState={{ checked: agreed }} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          <Ionicons name={agreed ? 'checkbox' : 'square-outline'} size={24} color={agreed ? colors.greenInk : colors.muted} />
          <Text style={[styles.body, { flex: 1 }]}>
            I have read the <Text style={styles.link} onPress={() => Linking.openURL(`${SITE}/terms`)}>Terms of use</Text> and the <Text style={styles.link} onPress={() => Linking.openURL(`${SITE}/refunds`)}>Refund policy</Text>. I agree that my plan starts as soon as Paystack confirms my payment, and I understand this may end my 7-day right to cancel.
          </Text>
        </Pressable>
        <Button label={busy ? 'Opening Paystack...' : chosen?.price_minor ? `Pay ${money(chosen.price_minor, chosen.currency)} with Paystack` : 'This plan has no price yet'}
          busy={busy} disabled={busy || !agreed || !chosen?.price_minor} onPress={pay} />
        {!!ref && <Button variant="outline" label="I have paid" onPress={() => confirm(ref)} />}
        <Text style={[styles.body, { fontWeight: '700' }]}>All prices include 20% VAT and levies.</Text>
        <View style={{ backgroundColor: colors.orangeSoft, borderRadius: 12, padding: 12 }}>
          <Text style={styles.body}>For your safety: do not let your browser or phone save your card or Mobile Money details. Enter them each time on Paystack's page, and never share your PIN or OTP with anyone, including us.</Text>
        </View>
        {chosen?.price_usd_cents > 0 && rate && (
          <Text style={styles.hint}>Prices are in US dollars. Paystack charges the cedi amount shown, worked out at GHS {rate.perUsd.toFixed(2)} to USD 1 (updated {new Date(rate.updatedAt).toLocaleDateString()}). Your bank may add its own charges.</Text>
        )}
        <Text style={styles.hint}>You pay on Paystack's secure page by card or Mobile Money. It opens in your browser. Your plan starts only after Paystack confirms the payment to our server. Then come back to the app. If you subscribe again before your plan ends, the new time is added to the end of it. Auto-renew is not available yet.</Text>
        {access.level === 'full' && !access.trial && access.expiresAt && <Text style={styles.body}>Current plan runs until {new Date(access.expiresAt).toLocaleDateString()}.</Text>}
      </Card>
    </Screen>
  )
}

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
