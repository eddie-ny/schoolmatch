import { useContext, useState } from 'react'
import { Linking, Pressable, Text, View } from 'react-native'
import { colors } from './lib/constants'
import { SAT_CLASSES } from './lib/satClasses'
import { SAT_SAMPLE } from './lib/satSample'
import { BackLink, Button, Card, Screen, ShellActions, Title, styles, useScope } from './ui'

// Short SAT practice test and SAT classes. Same content as the website's SatTest.jsx and SatClasses.jsx.
// The score is a practice score on the 400 to 1600 scale from the share of answers right. It is NOT an official SAT score.
const practiceScore = (right, total) => 400 + Math.round(((right / total) * 1200) / 10) * 10
const H2 = { fontSize: 20, fontWeight: '800', color: colors.ink }

export function SatTestPage({ onBack }) {
  const { goTab, openPage } = useContext(ShellActions)
  const { setScope } = useScope()
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState([])
  const [done, setDone] = useState(false)
  const total = SAT_SAMPLE.length
  const q = SAT_SAMPLE[i]
  const right = picked.filter((a, n) => a === SAT_SAMPLE[n].answer).length
  const choose = (n) => setPicked((p) => { const c = [...p]; c[i] = n; return c })
  const restart = () => { setI(0); setPicked([]); setDone(false) }

  if (done) {
    const score = practiceScore(right, total)
    return (
      <Screen>
        <BackLink label="Back" onPress={onBack} />
        <Title title="Your practice result" />
        <Card>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={styles.hint}>Practice score</Text>
            <Text style={{ fontSize: 48, fontWeight: '800', color: colors.ink }}>{score}</Text>
            <Text style={[styles.body, { textAlign: 'center' }]}>{right} of {total} right. This is a practice score, not an official SAT score.</Text>
          </View>
          <Button label="Check my eligibility" onPress={() => { setScope('intl'); goTab('eligibility', { sat: String(score) }) }} />
          <Button variant="outline" label="Try again" onPress={restart} />
        </Card>
        <View style={{ backgroundColor: colors.green, borderRadius: 22, padding: 20, gap: 10, marginTop: 16 }}>
          <Text style={H2}>Get ready for the real SAT</Text>
          <Text style={{ fontSize: 15, color: colors.ink, lineHeight: 22 }}>This was a short sample. The real SAT is much longer and harder, and the timing is strict. Classes, tutoring and full practice tests help you prepare, whatever your score here. Contact us and we will help you get ready.</Text>
          <Pressable onPress={() => openPage('satclasses')} accessibilityRole="button" style={{ backgroundColor: '#1f1f1f', borderRadius: 999, paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Get SAT training</Text>
          </Pressable>
        </View>
        <View style={{ gap: 12, marginTop: 16 }}>
          {SAT_SAMPLE.map((s, n) => (
            <Card key={s.id}>
              <Text style={styles.hint}>{s.section}</Text>
              <Text style={{ fontWeight: '700', color: colors.ink, fontSize: 15 }}>{s.q}</Text>
              <Text style={{ fontSize: 14, color: picked[n] === s.answer ? '#166534' : '#b91c1c' }}>
                {picked[n] === s.answer ? 'Right.' : `Your answer: ${picked[n] == null ? 'none' : s.options[picked[n]]}. Right answer: ${s.options[s.answer]}.`}
              </Text>
              <Text style={styles.body}>{s.why}</Text>
            </Card>
          ))}
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <Title title="Short SAT test" sub={`Question ${i + 1} of ${total}. ${q.section}.`} />
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.ink, lineHeight: 25 }}>{q.q}</Text>
        <View style={{ gap: 10 }} accessibilityRole="radiogroup">
          {q.options.map((o, n) => {
            const on = picked[i] === n
            return (
              <Pressable key={o} onPress={() => choose(n)} accessibilityRole="radio" accessibilityState={{ checked: on }}
                style={{ flexDirection: 'row', gap: 10, alignItems: 'center', minHeight: 48, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 2, borderColor: on ? colors.orange : colors.line, backgroundColor: on ? colors.orangeSoft : '#fff' }}>
                <Text style={{ fontWeight: '800', color: colors.ink }}>{'ABCD'[n]}</Text>
                <Text style={{ flex: 1, fontSize: 15, color: colors.ink, fontWeight: on ? '700' : '400' }}>{o}</Text>
              </Pressable>
            )
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><Button variant="outline" label="Back" disabled={i === 0} onPress={() => setI(Math.max(0, i - 1))} /></View>
          <View style={{ flex: 1 }}><Button label={i + 1 < total ? 'Next' : 'See my result'} disabled={picked[i] == null} onPress={() => (i + 1 < total ? setI(i + 1) : setDone(true))} /></View>
        </View>
      </Card>
      <Text style={[styles.hint, { marginTop: 12 }]}>Practice questions written for this app. They are not official SAT questions.</Text>
    </Screen>
  )
}

// What is offered comes from lib/satClasses.js (the client fills it in; empty items are not shown, so nothing is made up).
// The website's message form is not connected yet (no Formspree id), so the app offers the Jamba contact details instead.
export function SatClassesPage({ onBack }) {
  const c = SAT_CLASSES
  const { openPage } = useContext(ShellActions)
  return (
    <Screen>
      <BackLink label="Back" onPress={onBack} />
      <Title title="SAT classes and tutoring" sub={c.intro} />
      <View style={{ backgroundColor: colors.green, borderRadius: 22, padding: 20, gap: 8, marginBottom: 16 }}>
        <Text style={H2}>Get ready for the real SAT</Text>
        <Text style={{ fontSize: 15, color: colors.ink, lineHeight: 22 }}>Whether you are starting out or already scoring well, a short sample is not the real exam. Tell us where you are and where you want to be.</Text>
        {!!c.price && <Text style={{ fontWeight: '700', color: colors.ink }}>{c.price}</Text>}
      </View>
      {c.offerings.length > 0 && (
        <View style={{ gap: 12, marginBottom: 16 }}>
          {c.offerings.map((o) => (
            <Card key={o.title}><Text style={{ fontWeight: '700', color: colors.ink }}>{o.title}</Text><Text style={styles.body}>{o.text}</Text></Card>
          ))}
        </View>
      )}
      <Card>
        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.ink }}>Contact us</Text>
        {!!c.whatsapp && <Button label="WhatsApp us" onPress={() => Linking.openURL(`https://wa.me/${c.whatsapp}`)} />}
        {!!c.phone && <Button variant="outline" label={`Call ${c.phone}`} onPress={() => Linking.openURL(`tel:${c.phone}`)} />}
        {!!c.email && <Button variant="outline" label={c.email} onPress={() => Linking.openURL(`mailto:${c.email}`)} />}
        {!c.whatsapp && !c.phone && !c.email && (
          <>
            <Text style={styles.body}>Call or email the Jamba team and say you want SAT help. Tell us your practice score or goal.</Text>
            <Button label="Call +233 20 565 8716" onPress={() => Linking.openURL('tel:+233205658716')} />
            <Button variant="outline" label="Email us" onPress={() => Linking.openURL('mailto:info@inbox.jambaconsult.com?subject=SAT%20classes')} />
          </>
        )}
      </Card>
      <View style={{ marginTop: 12 }}><Button variant="outline" label="Take the practice test" onPress={() => openPage('sat')} /></View>
    </Screen>
  )
}
