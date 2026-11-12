import { useCallback, useEffect, useRef, useState } from 'react'
import { BackHandler, View } from 'react-native'
import HomeScreen from './HomeScreen'
import { SchoolDetail, SchoolsList } from './SchoolScreens'

// A very small "stack" of screens. Every screen stays alive under the one on top, so going back
// finds the search, filters and page exactly as they were left. The Android back button goes back one screen.
export default function Shell() {
  const key = useRef(1)
  const [stack, setStack] = useState([{ key: 0, name: 'home' }])
  const push = (s) => setStack((cur) => [...cur, { key: key.current++, ...s }])
  const back = useCallback(() => setStack((cur) => (cur.length > 1 ? cur.slice(0, -1) : cur)), [])

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) { back(); return true }
      return false
    })
    return () => sub.remove()
  }, [stack.length, back])

  return (
    <View style={{ flex: 1 }}>
      {stack.map((s, i) => (
        <View key={s.key} style={i === stack.length - 1 ? { flex: 1 } : { display: 'none' }}>
          {s.name === 'home' && <HomeScreen onFindSchool={() => push({ name: 'schools' })} />}
          {s.name === 'schools' && <SchoolsList onBack={back} onOpen={(p) => push({ name: 'school', ...p })} />}
          {s.name === 'school' && <SchoolDetail id={s.id} q={s.q} field={s.field} onBack={back} />}
        </View>
      ))}
    </View>
  )
}
