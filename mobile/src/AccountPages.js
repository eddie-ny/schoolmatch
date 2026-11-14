import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Linking, Text, View } from 'react-native'
import { useAuth } from './AuthContext'
import { ConfirmDialog } from './Chrome'
import { useSaved } from './SavedContext'
import * as api from './lib/api'
import { getAccess, timeLeft } from './lib/access'
import { FIELDS, SHS_PROGRAMS, colors } from './lib/constants'
import { PASSWORD_RULE, passwordProblem } from './lib/validation'
import { groupPrograms } from './lib/variants'
import { ShellActions } from './ui'
import { Badge, BackLink, Button, Card, CodeBoxes, ErrorText, Field, Input, Notice, PasswordInput, Screen, SelectField, Title, styles } from './ui'
import { useContext } from 'react'

const opts = (list, any) => [{ value: '', label: any }, ...list.map((x) => ({ value: x, label: x }))]
const FUNDING = ['Self-funded', 'Partial funding', 'Fully funded']
const LEVELS = ['Bachelors', 'Masters', 'Diploma', 'Certificate', 'Graduate Certificate']
const Section = ({ children }) => <Text style={{ fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: colors.muted }}>{children}</Text>

// ---------- Profile (editable, same fields as the website) ----------
export function ProfilePage({ onBack }) {
  const { user, refresh } = useAuth()
  const { openPage } = useContext(ShellActions)
  const [p, setP] = useState({ ...user.profile, phone: user.phone || '' })
  const [msg, setMsg] = useState({ ok: '', err: '' })
  const [busy, setBusy] = useState(false)
  const set = (k) => (v) => setP((c) => ({ ...c, [k]: v }))
  const access = getAccess(user)
  const parentPending = user.isMinor && !user.parent?.confirmedAt
  const complete = !!(user.profile.shsAttended.trim() && user.profile.shsProgram)

  const save = async () => {
    setMsg({ ok: '', err: '' })
    if (!p.shsAttended.trim() || !p.shsProgram) return setMsg({ ok: '', err: 'SHS attended and the program you studied are required.' })
    setBusy(true)
    try {
      if (p.phone.trim() !== (user.phone || '')) await api.saveAccount(user.id, { fullName: user.fullName, phone: p.phone.trim() })
      await api.saveProfile(user.id, { ...p, shsAttended: p.shsAttended.trim() })
      await refresh()
      setMsg({ ok: 'Changes saved.', err: '' })
    } catch (e) { setMsg({ ok: '', err: e.message }) } finally { setBusy(false) }
  }

  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <Title title="Profile" />
      {!complete && <View style={{ marginBottom: 12 }}><Notice tone="orange">Complete your profile: tell us the SHS you attended and the program you studied to unlock the features.</Notice></View>}
      {parentPending && (
        <View style={{ marginBottom: 12 }}>
          <Card>
            <Text style={{ fontWeight: '700', fontSize: 16, color: colors.ink }}>Waiting for parent or guardian</Text>
            <Text style={styles.body}>A parent or guardian must confirm your account. Your account stays limited until they do. The team confirms with them directly, then pull down on this page or reopen the app.</Text>
          </Card>
        </View>
      )}
      {user.isMinor && !parentPending && <View style={{ marginBottom: 12, alignItems: 'flex-start' }}><Badge tone="green">Parent confirmed</Badge></View>}
      <Card>
        <Section>Personal information</Section>
        <Field label="Full name" hint="Cannot be changed. If it is wrong, contact support."><Input value={user.fullName || ''} editable={false} style={{ backgroundColor: '#f4f4f4', color: colors.muted }} /></Field>
        <Field label="Email" hint="Email cannot be changed."><Input value={user.email || ''} editable={false} style={{ backgroundColor: '#f4f4f4', color: colors.muted }} /></Field>
        <Field label="Phone number"><Input value={p.phone} onChangeText={set('phone')} keyboardType="phone-pad" /></Field>
        <Field label="Date of birth" hint="Cannot be changed. If it is wrong, contact support."><Input value={user.dateOfBirth || ''} editable={false} style={{ backgroundColor: '#f4f4f4', color: colors.muted }} /></Field>
        <Field label="Gender" hint="Used only to match you to scholarships. Some are open to one gender only.">
          <SelectField title="Gender" placeholder="Select" value={p.gender} onChange={set('gender')} options={[{ value: '', label: 'Select' }, { value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }]} />
        </Field>
        <Section>School details</Section>
        <Field label="SHS attended *"><Input value={p.shsAttended} onChangeText={set('shsAttended')} /></Field>
        <Field label="High school program studied *"><SelectField title="Program studied" placeholder="Select program" value={p.shsProgram} onChange={set('shsProgram')} options={opts(SHS_PROGRAMS, 'Select program')} /></Field>
        <Field label="Funding" hint={user.isMinor ? 'Under 18: funding goes through your sponsor.' : ''}><SelectField title="Funding" placeholder="Select" value={p.fundingType} onChange={set('fundingType')} options={opts(FUNDING, 'Select')} /></Field>
        <Field label="What do you want to study? (optional)"><SelectField title="Level" placeholder="Level" value={p.studyLevel} onChange={set('studyLevel')} options={opts(LEVELS, 'Level')} /></Field>
        <Field label="Field you are interested in (optional)"><SelectField title="Field" placeholder="Choose a field" value={p.studyField} onChange={set('studyField')} options={opts(FIELDS, 'Choose a field')} /></Field>
        <Field label="Desired programs (optional)"><Input placeholder="e.g. Computer Science, Engineering" value={p.desiredPrograms} onChangeText={set('desiredPrograms')} /></Field>
        <ErrorText>{msg.err}</ErrorText>
        {!!msg.ok && <Notice>{msg.ok}</Notice>}
        <Button label={busy ? 'Saving...' : 'Save changes'} busy={busy} onPress={save} />
      </Card>
      <View style={{ marginTop: 12 }}>
        <Card>
          <Section>Access</Section>
          <Text style={styles.body}>{access.detail}{access.expiresAt ? `, ${timeLeft(access.expiresAt)} left` : ''}</Text>
          <Button label="See pricing" onPress={() => openPage('pricing')} />
          <Text style={styles.hint}>Password, two-step verification and closing your account are in Account Settings. Documents upload comes later in the app; use the website for now.</Text>
        </Card>
      </View>
    </Screen>
  )
}

// ---------- Interested: hearted programs, grouped by university ----------
export function InterestedPage({ onBack, onOpenProgram, onOpenSchool }) {
  const { ids, error, toggle } = useSaved()
  const { goTab } = useContext(ShellActions)
  const [programs, setPrograms] = useState([])
  const [busy, setBusy] = useState(true)
  const key = [...ids].sort().join(',')
  useEffect(() => {
    let live = true
    if (!ids.size) { setPrograms([]); setBusy(false); return undefined }
    setBusy(true)
    api.getProgramsFull([...ids]).then((x) => live && setPrograms(x)).catch(() => live && setPrograms([])).finally(() => live && setBusy(false))
    return () => { live = false }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  const groups = useMemo(() => {
    const g = {}
    groupPrograms(programs.filter((p) => ids.has(p.id))).forEach((p) => { (g[p.schoolId] ||= { schoolId: p.schoolId, name: p.schoolName, items: [] }).items.push(p) })
    return Object.values(g).sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }, [programs, ids])
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <Title title="Interested" sub="Programs you have marked with a heart, with their universities." />
      <ErrorText>{error}</ErrorText>
      {busy ? <View style={{ paddingVertical: 32 }}><ActivityIndicator color={colors.orangeInk} /></View> : total === 0 ? (
        <Card>
          <Text style={styles.body}>You have not marked any programs yet. Press the heart on a program to keep it here.</Text>
          <Button label="Find a program" onPress={() => goTab('programs')} />
        </Card>
      ) : (
        <View style={{ gap: 20 }}>
          <Text style={styles.hint}>{total} program{total === 1 ? '' : 's'} at {groups.length} universit{groups.length === 1 ? 'y' : 'ies'}</Text>
          {groups.map((g) => (
            <View key={g.schoolId} style={{ gap: 10 }}>
              <Text onPress={() => onOpenSchool({ id: g.schoolId })} style={{ fontSize: 18, fontWeight: '700', color: colors.ink }}>{g.name}</Text>
              {g.items.map((p) => (
                <Card key={p.id}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.ink }}>{p.name}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{!!p.level && <Badge>{p.level}</Badge>}{!!p.field && <Badge>{p.field}</Badge>}</View>
                  <Button label="View programme information" onPress={() => onOpenProgram({ id: p.id })} />
                  <Button variant="outline" label="Remove from Interested" onPress={() => toggle(p.variants.map((v) => v.id), false)} />
                </Card>
              ))}
            </View>
          ))}
        </View>
      )}
    </Screen>
  )
}

// ---------- Account settings: password, two-step verification, close account ----------
function MfaSection() {
  const { user, refresh } = useAuth()
  const [factor, setFactor] = useState(undefined) // undefined loading, null off
  const [setup, setSetup] = useState(null)
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState({ ok: '', err: '' })
  const [busy, setBusy] = useState(false)
  const [confirmOff, setConfirmOff] = useState(false)
  const load = () => api.mfaFactor().then(setFactor).catch((e) => { setFactor(null); setMsg({ ok: '', err: e.message }) })
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const start = async () => {
    setMsg({ ok: '', err: '' }); setBusy(true)
    try { setSetup(await api.mfaStartEnroll()); setCode('') } catch (e) { setMsg({ ok: '', err: e.message }) } finally { setBusy(false) }
  }
  const confirm = async () => {
    setMsg({ ok: '', err: '' }); setBusy(true)
    try {
      await api.mfaVerifyCode(setup.factorId, code)
      setSetup(null); setCode('')
      await load(); await refresh()
      setMsg({ ok: 'Two-step verification is on. You will be asked for a code each time you sign in.', err: '' })
    } catch (e) { setMsg({ ok: '', err: e.message }) } finally { setBusy(false) }
  }
  const turnOff = async () => {
    setConfirmOff(false); setMsg({ ok: '', err: '' })
    try { await api.mfaRemove(factor.id); await load(); await refresh(); setMsg({ ok: 'Two-step verification is off.', err: '' }) } catch (e) { setMsg({ ok: '', err: e.message }) }
  }
  const openApp = () => Linking.openURL(setup.uri).catch(() => setMsg({ ok: '', err: 'No authenticator app opened. Type the setup key into your app instead.' }))
  const isStaff = user.staffRole === 'admin' || user.staffRole === 'support'

  return (
    <Card>
      <Section>Two-step verification</Section>
      {isStaff && <Text style={[styles.body, { fontWeight: '700' }]}>Staff accounts need this to use the Admin page.</Text>}
      {factor === undefined && <ActivityIndicator color={colors.orangeInk} />}
      {factor && !setup && (
        <>
          <Text style={styles.body}>On. Your authenticator app is needed each time you sign in.</Text>
          <Button variant="outline" label="Turn off" onPress={() => setConfirmOff(true)} />
        </>
      )}
      {factor === null && !setup && (
        <>
          <Text style={styles.body}>Add a second step with an authenticator app (Google Authenticator, Authy or 1Password). Even if someone learns your password, they cannot sign in without the code from your phone.</Text>
          <Button label={busy ? 'Starting...' : 'Turn on'} busy={busy} onPress={start} />
        </>
      )}
      {!!setup && (
        <>
          <Text style={styles.body}>1. Open your authenticator app on this phone and add the key below. The button tries to open it for you.</Text>
          <Button label="Open in authenticator app" onPress={openApp} />
          <Text style={styles.hint}>Or type this setup key into the app yourself:</Text>
          <Text selectable style={{ fontSize: 16, fontWeight: '700', color: colors.ink, letterSpacing: 1 }}>{setup.secret}</Text>
          <Text style={styles.body}>2. Type the 6-digit code the app shows.</Text>
          <CodeBoxes value={code} onChange={setCode} />
          <Button label={busy ? 'Checking...' : 'Turn on'} busy={busy} disabled={code.length < 6} onPress={confirm} />
          <Button variant="outline" label="Cancel" onPress={() => { setSetup(null); load() }} />
        </>
      )}
      <ErrorText>{msg.err}</ErrorText>
      {!!msg.ok && <Notice>{msg.ok}</Notice>}
      <Text style={styles.hint}>If you lose your phone you will need support to reset this. Staff must verify who you are first.</Text>
      <ConfirmDialog open={confirmOff} title="Turn off two-step verification?" text="Your account will be protected by your password only."
        confirmLabel="Turn off" cancelLabel="Keep it on" onConfirm={turnOff} onCancel={() => setConfirmOff(false)} />
    </Card>
  )
}

export function SettingsPage({ onBack }) {
  const { user, signOut } = useAuth()
  const { openPage } = useContext(ShellActions)
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [pwMsg, setPwMsg] = useState({ ok: '', err: '' })
  const [busy, setBusy] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const [closeErr, setCloseErr] = useState('')

  const changePassword = async () => {
    setPwMsg({ ok: '', err: '' })
    if (passwordProblem(pw)) return setPwMsg({ ok: '', err: PASSWORD_RULE })
    if (pw !== pw2) return setPwMsg({ ok: '', err: 'The two passwords do not match.' })
    setBusy(true)
    try { await api.setNewPassword(pw); setPw(''); setPw2(''); setPwMsg({ ok: 'Password changed.', err: '' }) } catch (e) { setPwMsg({ ok: '', err: e.message }) } finally { setBusy(false) }
  }
  const close = async () => {
    setCloseErr('')
    try { await api.closeMyAccount(); setConfirmClose(false); await signOut() } catch (e) { setConfirmClose(false); setCloseErr(e.message) }
  }

  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <Title title="Account Settings" sub="Manage your security and account" />
      <View style={{ gap: 12 }}>
        <Card>
          <Section>Account</Section>
          <Text style={{ fontWeight: '700', fontSize: 16, color: colors.ink }}>{user.fullName}</Text>
          <Text style={styles.body}>{user.email}</Text>
          <Text style={styles.hint}>Signed in with email and password</Text>
          <Button variant="outline" label="Open profile" onPress={() => openPage('profile')} />
        </Card>
        <Card>
          <Section>Password</Section>
          <Field label="New password" hint="At least 8 characters, with upper case, lower case and numbers."><PasswordInput value={pw} onChangeText={setPw} autoComplete="new-password" /></Field>
          <Field label="Confirm new password"><PasswordInput value={pw2} onChangeText={setPw2} autoComplete="new-password" /></Field>
          <ErrorText>{pwMsg.err}</ErrorText>
          {!!pwMsg.ok && <Notice>{pwMsg.ok}</Notice>}
          <Button label={busy ? 'Saving...' : 'Change password'} busy={busy} disabled={!pw || !pw2} onPress={changePassword} />
        </Card>
        <MfaSection />
        <Card>
          <Text style={{ fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: '#b91c1c' }}>Danger zone</Text>
          <Text style={{ fontWeight: '700', color: colors.ink }}>Close account</Text>
          <Text style={styles.body}>Signs you out and blocks sign-in. We keep your records for legal and security reasons; they are not erased.</Text>
          <Button variant="outline" label="Close account" onPress={() => setConfirmClose(true)} />
          <ErrorText>{closeErr}</ErrorText>
        </Card>
      </View>
      <ConfirmDialog open={confirmClose} title="Close your account?" text="You will be signed out and will not be able to sign in again until support reopens the account. Your records are kept."
        confirmLabel="Close account" cancelLabel="Keep my account" onConfirm={close} onCancel={() => setConfirmClose(false)} />
    </Screen>
  )
}
