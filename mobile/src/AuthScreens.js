import { useEffect, useState } from 'react'
import { Linking, Switch, Text, View } from 'react-native'
import { useAuth } from './AuthContext'
import * as api from './lib/api'
import { OTP_LENGTH, SITE, colors } from './lib/constants'
import { PASSWORD_RULE, dobFromParts, isMinorFromDob, passwordProblem } from './lib/validation'
import { Button, Card, CodeBoxes, ErrorText, Field, Input, Notice, PasswordInput, Screen, SelectField, TextLink, Title, styles } from './ui'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// ---------- Sign in ----------
export function Login({ goSignup }) {
  const { notice, clearNotice } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [needsCode, setNeedsCode] = useState(false)

  const submit = async () => {
    clearNotice()
    setError('')
    setBusy(true)
    try {
      await api.signIn(email.trim(), password)
      // On success the auth listener in AuthContext moves the app to the next screen.
    } catch (err) {
      if (/confirm your email/i.test(err.message)) setNeedsCode(true)
      else setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (needsCode) return <VerifyCode email={email.trim()} firstWait={0} onBack={() => setNeedsCode(false)} />
  return (
    <Screen>
      <Title title="Sign in" />
      {!!notice && <View style={{ marginBottom: 20 }}><Notice>{notice}</Notice></View>}
      <Card>
        <Field label="Email">
          <Input keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" value={email} onChangeText={setEmail} />
        </Field>
        <Field label="Password">
          <PasswordInput autoComplete="current-password" value={password} onChangeText={setPassword} />
        </Field>
        <ErrorText>{error}</ErrorText>
        <Button label={busy ? 'Signing in...' : 'Sign in'} busy={busy} disabled={!email.trim() || !password} onPress={submit} />
        <Text style={[styles.hint, { backgroundColor: '#f3f3f3', borderRadius: 12, padding: 12 }]}>
          On a phone that other people use, sign out when you finish.
        </Text>
        <View>
          <Text style={styles.body}>New here?</Text>
          <TextLink label="Create an account" onPress={goSignup} />
        </View>
      </Card>
    </Screen>
  )
}

// ---------- Step two of sign-up: the code from the email ----------
// OTP_LENGTH must match Supabase, Authentication, Email, "Email OTP Length".
export function VerifyCode({ email, firstWait = 60, onBack }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [wait, setWait] = useState(firstWait)

  useEffect(() => {
    if (wait <= 0) return
    const t = setTimeout(() => setWait(wait - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  const submit = async () => {
    setError('')
    setMsg('')
    const clean = code.replace(/\s+/g, '')
    if (clean.length !== OTP_LENGTH || !/^\d+$/.test(clean)) return setError('Enter the code from the email. It is made of numbers only.')
    setBusy(true)
    try {
      await api.verifySignupCode(email, clean)
      // On success the person is signed in and the auth listener moves the app on.
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const resend = async () => {
    setError('')
    setMsg('')
    setBusy(true)
    try {
      await api.resendConfirmation(email)
      setMsg('A new code is on its way. Use only the newest email. Older codes stop working.')
    } catch (err) {
      setError(err.message)
    } finally {
      setWait(60)
      setBusy(false)
    }
  }

  return (
    <Screen>
      <Title title="Enter your code" sub={`We sent a code to ${email}. Your 24-hour free trial starts when you sign up.`} />
      <Card>
        <Field label="Code from the email">
          <CodeBoxes value={code} onChange={setCode} length={OTP_LENGTH} autoFocus />
        </Field>
        <ErrorText>{error}</ErrorText>
        <Notice>{msg}</Notice>
        <Button label={busy ? 'Checking...' : 'Confirm and continue'} busy={busy} onPress={submit} />
        <Text style={styles.hint}>Emails can take a few minutes. Check your spam folder first. Only ask for a new code if nothing has arrived after a few minutes.</Text>
        <Button variant="outline" label={wait > 0 ? `Send a new code in ${wait}s` : 'Send a new code'} disabled={busy || wait > 0} onPress={resend} />
        {onBack && <TextLink label="Back to sign in" onPress={onBack} />}
      </Card>
    </Screen>
  )
}

// ---------- Sign up ----------
export function Signup({ goLogin }) {
  const [f, setF] = useState({ fullName: '', phone: '', email: '', password: '', day: '', month: '', year: '', parentName: '', parentPhone: '', parentEmail: '', consent: false })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sentTo, setSentTo] = useState('')
  const [exists, setExists] = useState(false)
  const set = (k) => (v) => setF((cur) => ({ ...cur, [k]: v }))
  const dateOfBirth = dobFromParts(f.day, f.month, f.year)
  const minor = isMinorFromDob(dateOfBirth)

  const submit = async () => {
    setError('')
    setExists(false)
    if (!dateOfBirth) return setError('Please enter your full date of birth (day, month and year) as a real date in the past.')
    if (passwordProblem(f.password)) return setError(PASSWORD_RULE)
    if (!f.consent) return setError('Please accept the terms and the privacy notice to continue.')
    if (minor && (!f.parentName.trim() || !f.parentPhone.trim() || !f.parentEmail.trim())) return setError('A parent or guardian name, phone and email are required for under 18s.')
    setBusy(true)
    try {
      const email = f.email.trim()
      const res = await api.signUp({
        fullName: f.fullName.trim(), phone: f.phone.trim(), email, password: f.password, dateOfBirth,
        parentName: f.parentName.trim(), parentPhone: f.parentPhone.trim(), parentEmail: f.parentEmail.trim(),
      })
      if (res.alreadyRegistered) setExists(true)
      else if (res.needsConfirm) setSentTo(email)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (sentTo) return <VerifyCode email={sentTo} onBack={goLogin} />

  const open = (path) => Linking.openURL(SITE + path)
  const ready = f.fullName.trim() && f.phone.trim() && f.email.trim() && f.password
  return (
    <Screen>
      <Title title="Create your account" sub="Your 24-hour free trial starts when you sign up. You can finish your profile later." />
      <Card>
        <Field label="Full name"><Input autoComplete="name" value={f.fullName} onChangeText={set('fullName')} /></Field>
        <Field label="Phone"><Input keyboardType="phone-pad" autoComplete="tel" placeholder="024 000 0000" value={f.phone} onChangeText={set('phone')} /></Field>
        <Field label="Email"><Input keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" value={f.email} onChangeText={set('email')} /></Field>
        <Field label="Password" hint="At least 8 characters, with upper case, lower case and numbers.">
          <PasswordInput autoComplete="new-password" value={f.password} onChangeText={set('password')} />
        </Field>
        <Field label="Date of birth" hint="We ask so we can get a parent or guardian to confirm accounts for under 18s.">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Input style={{ flex: 1, textAlign: 'center' }} keyboardType="number-pad" placeholder="Day" maxLength={2} value={f.day} onChangeText={set('day')} />
            <View style={{ flex: 2 }}><SelectField title="Month of birth" placeholder="Month" value={f.month} onChange={set('month')} options={MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))} /></View>
            <Input style={{ flex: 1.6, textAlign: 'center' }} keyboardType="number-pad" placeholder="Year" maxLength={4} value={f.year} onChangeText={set('year')} />
          </View>
        </Field>
        {minor && (
          <View style={{ borderWidth: 2, borderColor: colors.green, borderRadius: 12, padding: 12, gap: 14, backgroundColor: colors.greenSoft }}>
            <Text style={[styles.body, { fontWeight: '600' }]}>You are under 18. A parent or guardian must confirm your account. Your account stays limited until they do.</Text>
            <Field label="Parent or guardian name"><Input value={f.parentName} onChangeText={set('parentName')} /></Field>
            <Field label="Parent or guardian phone"><Input keyboardType="phone-pad" value={f.parentPhone} onChangeText={set('parentPhone')} /></Field>
            <Field label="Parent or guardian email"><Input keyboardType="email-address" autoCapitalize="none" autoCorrect={false} value={f.parentEmail} onChangeText={set('parentEmail')} /></Field>
          </View>
        )}
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <Switch value={f.consent} onValueChange={set('consent')} trackColor={{ true: colors.green }} />
          <Text style={[styles.body, { flex: 1, fontSize: 14 }]}>
            I agree to the{' '}
            <Text style={styles.link} onPress={() => open('/terms')}>Terms of use</Text>, the{' '}
            <Text style={styles.link} onPress={() => open('/acceptable-use')}>Acceptable use policy</Text> and the{' '}
            <Text style={styles.link} onPress={() => open('/privacy')}>Privacy notice</Text>
            {minor ? ', and my parent or guardian has been told about them' : ''}.
          </Text>
        </View>
        {exists && <Notice tone="orange">This email already has an account. Go back to sign in, or reset your password on the website if you forgot it.</Notice>}
        <ErrorText>{error}</ErrorText>
        <Button label={busy ? 'Creating account...' : 'Create account'} busy={busy} disabled={!ready} onPress={submit} />
        <View>
          <Text style={styles.body}>Already have an account?</Text>
          <TextLink label="Sign in" onPress={goLogin} />
        </View>
      </Card>
    </Screen>
  )
}

// ---------- Two-step verification at sign-in (only for students who turned it on) ----------
export function MfaChallenge() {
  const { signOut, refresh } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setError('')
    setBusy(true)
    try {
      const f = await api.mfaFactor()
      if (!f) throw new Error('No authenticator is set up on this account.')
      await api.mfaVerifyCode(f.id, code)
      await refresh()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <Screen>
      <Title title="Enter your code" sub="Open your authenticator app and type the 6-digit code for Jamba." />
      <Card>
        <Field label="6-digit code">
          <Input
            keyboardType="number-pad" textContentType="oneTimeCode" maxLength={7}
            value={code} onChangeText={(t) => setCode(t.replace(/[^\d ]/g, ''))}
            style={{ fontSize: 26, letterSpacing: 8, textAlign: 'center', fontWeight: '600' }}
          />
        </Field>
        <ErrorText>{error}</ErrorText>
        <Button label={busy ? 'Checking...' : 'Continue'} busy={busy} disabled={code.replace(/\s/g, '').length < 6} onPress={submit} />
        <TextLink label="Sign out" onPress={signOut} />
        <Text style={styles.hint}>Lost your phone? Contact support. We will check who you are before we reset anything.</Text>
      </Card>
    </Screen>
  )
}
