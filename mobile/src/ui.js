import { useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors } from './lib/constants'

const topPad = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 60

export function Screen({ children }) {
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.flex} contentContainerStyle={[styles.screen, { paddingTop: topPad }]} keyboardShouldPersistTaps="handled">
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
    <View style={styles.passRow}>
      <TextInput placeholderTextColor="#9a9a9a" style={[styles.input, { flex: 1 }]} autoCapitalize="none" autoCorrect={false} secureTextEntry={!show} {...props} />
      <Pressable onPress={() => setShow(!show)} style={styles.showBtn} accessibilityRole="button" accessibilityLabel={show ? 'Hide password' : 'Show password'}>
        <Text style={styles.link}>{show ? 'Hide' : 'Show'}</Text>
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
      style={[styles.btn, variant === 'orange' ? styles.btnOrange : styles.btnOutline, off && { opacity: 0.55 }]}
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
  passRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  showBtn: { paddingHorizontal: 8, paddingVertical: 12 },
  btn: { minHeight: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  btnOrange: { backgroundColor: colors.orange },
  btnOutline: { borderWidth: 2, borderColor: colors.green, backgroundColor: '#fff' },
  btnText: { fontSize: 16, fontWeight: '700', color: '#1f1f1f' },
  error: { color: colors.error, fontSize: 14, lineHeight: 20 },
  notice: { borderRadius: 12, padding: 12 },
  noticeText: { fontSize: 14, color: colors.ink, lineHeight: 20 },
  linkWrap: { paddingVertical: 10 },
  link: { color: colors.orangeInk, fontSize: 15, fontWeight: '600', textDecorationLine: 'underline' },
  body: { fontSize: 15, color: colors.ink, lineHeight: 22 },
})
