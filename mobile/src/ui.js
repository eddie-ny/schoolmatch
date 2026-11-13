import { createContext, useContext, useRef, useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from './lib/constants'

const topPad = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 60

export const InShell = createContext(false)
// Lets any screen open a menu page (for example Pricing) or switch tab without passing functions down.
export const ShellActions = createContext({ openPage: () => {}, goTab: () => {} })

export function Screen({ children, onRefresh, refreshing = false }) {
  const inShell = useContext(InShell) // inside the tabs, the header already covers the status bar
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.flex} contentContainerStyle={[styles.screen, { paddingTop: inShell ? 16 : topPad }]} keyboardShouldPersistTaps="handled" refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.orangeInk]} /> : undefined}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export function Title({ title, sub }) {
  return (
    <View style={styles.titleWrap}>
      <Text style={styles.title} accessibilityRole="header">{title}</Text>
      {!!sub && <Text style={styles.sub}>{sub}</Text>}
    </View>
  )
}

export const Card = ({ children }) => <View style={styles.card}>{children}</View>

export function Field({ label, hint, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {!!hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  )
}

export const Input = ({ style, ...rest }) => <TextInput placeholderTextColor="#9a9a9a" style={[styles.input, style]} {...rest} />

export function PasswordInput(props) {
  const [show, setShow] = useState(false)
  return (
    <View style={[styles.input, styles.passRow]}>
      <TextInput placeholderTextColor="#9a9a9a" style={styles.passInput} autoCapitalize="none" autoCorrect={false} secureTextEntry={!show} {...props} />
      <Pressable onPress={() => setShow(!show)} style={styles.eyeBtn} hitSlop={8} accessibilityRole="button" accessibilityLabel={show ? 'Hide password' : 'Show password'}>
        <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.muted} />
      </Pressable>
    </View>
  )
}

export function Button({ label, onPress, busy, disabled, variant = 'orange' }) {
  const off = busy || disabled
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      style={[styles.btn, variant === 'orange' ? styles.btnOrange : variant === 'green' ? styles.btnGreen : styles.btnOutline, off && { opacity: 0.55 }]}
    >
      {busy ? <ActivityIndicator color="#1f1f1f" /> : <Text style={styles.btnText}>{label}</Text>}
    </Pressable>
  )
}

export const ErrorText = ({ children }) => (children ? <Text style={styles.error} accessibilityRole="alert">{children}</Text> : null)

export const Notice = ({ children, tone = 'green' }) => (
  children ? <View style={[styles.notice, { backgroundColor: tone === 'green' ? colors.greenSoft : colors.orangeSoft }]}><Text style={styles.noticeText}>{children}</Text></View> : null
)

export const TextLink = ({ label, onPress }) => (
  <Pressable onPress={onPress} accessibilityRole="link" style={styles.linkWrap}><Text style={styles.link}>{label}</Text></Pressable>
)

// A box that opens a list to pick from (months, fields, levels).
export function SelectField({ value, options, onChange, placeholder, title }) {
  const [open, setOpen] = useState(false)
  const cur = options.find((o) => String(o.value) === String(value))
  return (
    <>
      <Pressable style={[styles.input, styles.selectRow]} onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel={title || placeholder}>
        <Text style={[styles.selectText, !cur && { color: '#9a9a9a' }]} numberOfLines={1}>{cur ? cur.label : placeholder}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.muted} />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            {!!title && <Text style={styles.sheetTitle}>{title}</Text>}
            <ScrollView>
              {options.map((o) => {
                const on = String(o.value) === String(value)
                return (
                  <Pressable key={String(o.value)} style={styles.option} onPress={() => { onChange(o.value); setOpen(false) }}>
                    <Text style={[styles.optionText, on && { fontWeight: '700' }]}>{o.label}</Text>
                    {on && <Ionicons name="checkmark" size={20} color={colors.orangeInk} />}
                  </Pressable>
                )
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

// The code from the email, one box per digit (like the website). One hidden input sits on top, so typing and pasting both work.
export function CodeBoxes({ value, onChange, length = 6, autoFocus }) {
  const [focused, setFocused] = useState(false)
  const ref = useRef(null)
  return (
    <View>
      <View style={styles.codeRow}>
        {Array.from({ length }).map((_, i) => {
          const active = focused && (i === value.length || (i === length - 1 && value.length === length))
          return (
            <View key={i} style={[styles.codeBox, active && styles.codeBoxActive]}>
              <Text style={styles.codeDigit}>{value[i] || ''}</Text>
            </View>
          )
        })}
      </View>
      <TextInput
        ref={ref} value={value} autoFocus={autoFocus} maxLength={length} caretHidden
        keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="sms-otp"
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={styles.codeHidden} accessibilityLabel={`${length}-digit code`}
      />
    </View>
  )
}

// Shown where the website says "Subscribe to see the full details".
export function Gate({ text }) {
  const { openPage } = useContext(ShellActions)
  return (
    <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: colors.orange, backgroundColor: 'rgba(255,176,46,0.1)', borderRadius: 12, padding: 16, gap: 12 }}>
      <Text style={styles.body}>{text || 'Subscribe to see the full details.'}</Text>
      <Button label="See pricing" onPress={() => openPage('pricing')} />
    </View>
  )
}

export const Badge = ({ children }) => (
  <View style={styles.badge}><Text style={styles.badgeText}>{children}</Text></View>
)

// One row of choices to tap (like the website's All schools / Universities / ...).
export function Chips({ value, options, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 8 }}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <Pressable key={o.value || 'all'} onPress={() => onChange(o.value)} accessibilityRole="button" accessibilityState={{ selected: on }} style={[styles.chip, on && styles.chipOn]}>
            <Text style={[styles.chipText, on && { fontWeight: '700' }]}>{o.label}</Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

export const BackLink = ({ label, onPress }) => (
  <Pressable onPress={onPress} accessibilityRole="button" style={styles.backLink} hitSlop={8}>
    <Ionicons name="arrow-back" size={20} color={colors.orangeInk} />
    <Text style={styles.link}>{label}</Text>
  </Pressable>
)

// Page x of y with Previous and Next, like the website's pagination.
export function Pager({ page, pages, onChange }) {
  if (pages <= 1) return null
  return (
    <View style={styles.pager}>
      <View style={{ flex: 1 }}><Button variant="outline" label="Previous" disabled={page <= 1} onPress={() => onChange(page - 1)} /></View>
      <Text style={styles.body}>Page {page} of {pages}</Text>
      <View style={{ flex: 1 }}><Button variant="outline" label="Next" disabled={page >= pages} onPress={() => onChange(page + 1)} /></View>
    </View>
  )
}

export const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.page },
  screen: { paddingHorizontal: 16, paddingBottom: 48 },
  titleWrap: { marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: colors.ink },
  sub: { fontSize: 15, color: colors.muted, marginTop: 6, lineHeight: 21 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 16, borderWidth: 1, borderColor: colors.line },
  field: { gap: 6 },
  label: { fontSize: 15, fontWeight: '600', color: colors.ink },
  hint: { fontSize: 13, color: colors.muted },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: colors.ink, backgroundColor: '#fff' },
  passRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 0, paddingRight: 8 },
  passInput: { flex: 1, fontSize: 16, color: colors.ink, paddingVertical: 12 },
  eyeBtn: { paddingHorizontal: 6, paddingVertical: 8 },
  btn: { minHeight: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  btnOrange: { backgroundColor: colors.orange },
  btnGreen: { backgroundColor: colors.green },
  btnOutline: { borderWidth: 2, borderColor: colors.green, backgroundColor: '#fff' },
  btnText: { fontSize: 16, fontWeight: '700', color: '#1f1f1f' },
  error: { color: colors.error, fontSize: 14, lineHeight: 20 },
  notice: { borderRadius: 12, padding: 12 },
  noticeText: { fontSize: 14, color: colors.ink, lineHeight: 20 },
  linkWrap: { paddingVertical: 10 },
  link: { color: colors.orangeInk, fontSize: 15, fontWeight: '600', textDecorationLine: 'underline' },
  body: { fontSize: 15, color: colors.ink, lineHeight: 22 },
  selectRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  selectText: { flex: 1, fontSize: 16, color: colors.ink },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  sheet: { backgroundColor: '#fff', borderRadius: 16, maxHeight: '75%', paddingVertical: 8 },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, paddingHorizontal: 16, paddingVertical: 10 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  optionText: { fontSize: 16, color: colors.ink, flex: 1 },
  codeRow: { flexDirection: 'row', gap: 8 },
  codeBox: { flex: 1, height: 56, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  codeBoxActive: { borderColor: colors.green, borderWidth: 2 },
  codeDigit: { fontSize: 24, fontWeight: '700', color: colors.ink },
  codeHidden: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.02, color: 'transparent' },
  badge: { backgroundColor: '#f3f1e4', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.line },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.ink },
  chip: { borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 },
  chipOn: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { fontSize: 14, color: colors.ink },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, marginBottom: 8, alignSelf: 'flex-start' },
  pager: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20 },
})
