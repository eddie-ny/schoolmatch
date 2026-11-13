import { useEffect, useState } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from './lib/constants'
import { getAccess, timeLeft } from './lib/access'
import { Button } from './ui'

export const TABS = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'schools', label: 'Schools', icon: 'school' },
  { key: 'programs', label: 'Programs', icon: 'library' },
  { key: 'scholarships', label: 'Scholarships', icon: 'ribbon' },
  { key: 'eligibility', label: 'Eligibility', icon: 'checkmark-circle' },
]

const MENU = [['profile', 'Profile'], ['interested', 'Interested'], ['pricing', 'Pricing'], ['invite', 'Invite friends'], ['contact', 'Contact us'], ['settings', 'Account Settings']]
const HEADER_H = 56

// Top bar: the Jamba name on the left, the profile button (with its drop-down menu) on the right.
export function Header({ user, onHome, onPage, onSignOut }) {
  const insets = useSafeAreaInsets()
  const [open, setOpen] = useState(false)
  const initial = (user.fullName || user.email || '?').trim().charAt(0).toUpperCase()
  const pick = (fn) => () => { setOpen(false); fn() }
  return (
    <View style={{ backgroundColor: '#fff', paddingTop: insets.top, borderBottomWidth: 1, borderColor: colors.line }}>
      <View style={{ height: HEADER_H, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
        <Pressable onPress={onHome} accessibilityRole="button" accessibilityLabel="Jamba local, home">
          <Text style={{ fontSize: 22, fontWeight: '700' }}><Text style={{ color: colors.orange }}>Jam</Text><Text style={{ color: colors.green }}>ba</Text></Text>
          <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1, color: '#737373', marginTop: -2 }}>LOCAL</Text>
        </Pressable>
        <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel="Account menu" hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '700', fontSize: 17, color: '#1f1f1f' }}>{initial}</Text>
          </View>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.muted} />
        </Pressable>
      </View>
      <Modal visible={open} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)}>
          <Pressable onPress={() => {}} style={{ position: 'absolute', top: insets.top + HEADER_H - 4, right: 12, width: 264, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.line, elevation: 10, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, overflow: 'hidden' }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.line }}>
              <Text style={{ fontWeight: '700', fontSize: 15, color: colors.ink }} numberOfLines={1}>{user.fullName}</Text>
              <Text style={{ fontSize: 12, color: colors.muted }} numberOfLines={1}>{user.email}</Text>
            </View>
            {MENU.map(([k, label]) => (
              <Pressable key={k} onPress={pick(() => onPage(k))} accessibilityRole="menuitem" style={{ minHeight: 46, justifyContent: 'center', paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: colors.ink }}>{label}</Text>
              </Pressable>
            ))}
            <Pressable onPress={pick(onSignOut)} accessibilityRole="menuitem" style={{ minHeight: 46, justifyContent: 'center', paddingHorizontal: 16, borderTopWidth: 1, borderColor: colors.line }}>
              <Text style={{ fontSize: 15, fontWeight: '500', color: '#b91c1c' }}>Sign out</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

// Strip under the header, same words as the website: green during the free trial, orange when only summaries are allowed.
export function TrialBanner({ user, onPricing }) {
  const [, tick] = useState(0)
  useEffect(() => { const t = setInterval(() => tick((n) => n + 1), 60000); return () => clearInterval(t) }, [])
  const a = getAccess(user)
  if (a.level === 'summary') {
    const text = a.needsParent
      ? 'Waiting for your parent or guardian to confirm. You can see summaries only until then.'
      : a.noTrial ? 'No free trial on this account. You can see summaries only.' : 'Your trial has ended. You can see summaries only.'
    return (
      <View style={{ backgroundColor: 'rgba(255,176,46,0.25)', paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 13, color: colors.ink, textAlign: 'center' }}>
          {text}{' '}
          {!a.needsParent && <Text onPress={onPricing} style={{ fontWeight: '700', textDecorationLine: 'underline' }}>Subscribe</Text>}
        </Text>
      </View>
    )
  }
  if (!a.trial) return null
  return (
    <View style={{ backgroundColor: 'rgba(178,222,43,0.25)', paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center' }}>
      <Text style={{ fontSize: 13, color: colors.ink, textAlign: 'center' }}>
        Free trial: {timeLeft(user.trialEndsAt)} left.{' '}
        <Text onPress={onPricing} style={{ fontWeight: '700', textDecorationLine: 'underline' }}>See pricing</Text>
      </Text>
    </View>
  )
}

// Bottom bar with the five main places.
export function TabBar({ active, onPress }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderColor: colors.line, paddingTop: 6, paddingBottom: Math.max(insets.bottom, 6) }}>
      {TABS.map((t) => {
        const on = t.key === active
        const color = on ? colors.orangeInk : colors.muted
        return (
          <Pressable key={t.key} onPress={() => onPress(t.key)} accessibilityRole="tab" accessibilityState={{ selected: on }} style={{ flex: 1, alignItems: 'center', gap: 2, paddingVertical: 4 }}>
            <Ionicons name={on ? t.icon : `${t.icon}-outline`} size={24} color={color} />
            <Text style={{ fontSize: 11, fontWeight: on ? '700' : '500', color }} numberOfLines={1}>{t.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export function ConfirmDialog({ open, title, text, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  return (
    <Modal visible={open} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.ink }}>{title}</Text>
          <Text style={{ fontSize: 15, color: colors.muted, lineHeight: 21 }}>{text}</Text>
          <Button label={confirmLabel} onPress={onConfirm} />
          <Button variant="outline" label={cancelLabel} onPress={onCancel} />
        </View>
      </View>
    </Modal>
  )
}
