import { useCallback, useEffect, useRef, useState } from 'react'
import { BackHandler, View } from 'react-native'
import { useAuth } from './AuthContext'
import { ConfirmDialog, Header, TABS, TabBar, TrialBanner } from './Chrome'
import HomeScreen from './HomeScreen'
import { colors } from './lib/constants'
import EligibilityScreen from './EligibilityScreen'
import { InterestedPage, ProfilePage, SettingsPage } from './AccountPages'
import { ComingSoon, ContactPage } from './Pages'
import { SavedProvider } from './SavedContext'
import { ProgramDetail, ProgramsList } from './ProgramScreens'
import { ScholarshipDetail, ScholarshipsList } from './ScholarshipScreens'
import { SchoolDetail, SchoolsList } from './SchoolScreens'
import { InShell, ShellActions } from './ui'

const PAGES = { profile: 'Profile', interested: 'Interested', pricing: 'Pricing', invite: 'Invite friends', contact: 'Contact us', settings: 'Account Settings' }

// Five tabs along the bottom. Each tab keeps its own stack of screens, and every screen stays alive under the one on top,
// so going back finds the search, filters and page as they were left. The Android back button pops one screen,
// then goes to Home, then leaves the app.
export default function Shell() {
  const { user, signOut } = useAuth()
  const counter = useRef(1)
  const mk = (s) => ({ key: counter.current++, ...s })
  const [tab, setTab] = useState('home')
  const [seen, setSeen] = useState({ home: true })
  const [stacks, setStacks] = useState(() => Object.fromEntries(TABS.map((t) => [t.key, [{ key: `root-${t.key}`, name: 'root' }]])))
  const [confirmOut, setConfirmOut] = useState(false)

  const show = (k) => { setSeen((s) => (s[k] ? s : { ...s, [k]: true })); setTab(k) }
  const push = (s) => setStacks((cur) => ({ ...cur, [tab]: [...cur[tab], mk(s)] }))
  const pop = useCallback((k) => setStacks((cur) => (cur[k].length > 1 ? { ...cur, [k]: cur[k].slice(0, -1) } : cur)), [])
  const toRoot = (k) => setStacks((cur) => ({ ...cur, [k]: cur[k].slice(0, 1) }))
  // Go to a tab. With params the tab starts fresh with them (for example Schools with a kind already chosen).
  const goTab = (k, params) => {
    if (params) setStacks((cur) => ({ ...cur, [k]: [mk({ name: 'root', ...params })] }))
    show(k)
  }
  const openPage = (name) => push({ name })

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (confirmOut) { setConfirmOut(false); return true }
      if (stacks[tab].length > 1) { pop(tab); return true }
      if (tab !== 'home') { setTab('home'); return true }
      return false
    })
    return () => sub.remove()
  }, [tab, stacks, confirmOut, pop])

  const openSchool = (p) => push({ name: 'school', ...p })
  const openProgram = (p) => push({ name: 'program', ...p })
  const openScholarship = (p) => push({ name: 'scholarship', ...p })
  const back = () => pop(tab)

  const render = (t, s) => {
    if (s.name === 'school') return <SchoolDetail id={s.id} q={s.q} field={s.field} onBack={back} onOpenProgram={openProgram} />
    if (s.name === 'program') return <ProgramDetail id={s.id} onBack={back} onOpenSchool={openSchool} onCheck={(p) => goTab('eligibility', { program: p?.name || '' })} />
    if (s.name === 'scholarship') return <ScholarshipDetail id={s.id} onBack={back} onOpenSchool={openSchool} />
    if (PAGES[s.name]) {
      if (s.name === 'profile') return <ProfilePage onBack={back} />
      if (s.name === 'interested') return <InterestedPage onBack={back} onOpenProgram={openProgram} onOpenSchool={openSchool} />
      if (s.name === 'settings') return <SettingsPage onBack={back} />
      if (s.name === 'contact') return <ContactPage onBack={back} />
      return <ComingSoon title={PAGES[s.name]} onBack={back} />
    }
    if (t === 'home') return <HomeScreen goTab={goTab} onOpenSchool={openSchool} />
    if (t === 'schools') return <SchoolsList initialKind={s.kind} onOpen={openSchool} />
    if (t === 'eligibility') return <EligibilityScreen initialProgram={s.program} onOpenProgram={openProgram} />
    if (t === 'programs') return <ProgramsList initialQ={s.q} initialField={s.field} onOpen={openProgram} />
    if (t === 'scholarships') return <ScholarshipsList initialFunding={s.funding} onOpen={openScholarship} />
    return null
  }

  return (
    <SavedProvider>
    <InShell.Provider value>
      <ShellActions.Provider value={{ openPage, goTab }}>
      <View style={{ flex: 1, backgroundColor: colors.page }}>
        <Header user={user} onHome={() => { toRoot('home'); show('home') }} onPage={openPage} onSignOut={() => setConfirmOut(true)} />
        <TrialBanner user={user} onPricing={() => openPage('pricing')} />
        <View style={{ flex: 1 }}>
          {TABS.filter((t) => seen[t.key]).map((t) => (
            <View key={t.key} style={t.key === tab ? { flex: 1 } : { display: 'none' }}>
              {stacks[t.key].map((s, i) => (
                <View key={s.key} style={i === stacks[t.key].length - 1 ? { flex: 1 } : { display: 'none' }}>{render(t.key, s)}</View>
              ))}
            </View>
          ))}
        </View>
        <TabBar active={tab} onPress={(k) => (k === tab ? toRoot(k) : show(k))} />
        <ConfirmDialog
          open={confirmOut} title="Sign out?" text="You will need to sign in again to see your results."
          confirmLabel="Sign out" cancelLabel="Stay signed in"
          onConfirm={() => { setConfirmOut(false); signOut() }} onCancel={() => setConfirmOut(false)}
        />
      </View>
      </ShellActions.Provider>
    </InShell.Provider>
    </SavedProvider>
  )
}
