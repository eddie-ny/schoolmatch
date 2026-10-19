// A programme can be offered several ways at one school (regular, fee-paying, distance, another campus). The database keeps one row per
// way, because each has its own cut-off and requirements. Students see one card per programme, with the ways listed inside it.
const MODE_ORDER = ['Regular', 'Fee-paying', 'Distance', 'Evening', 'Weekend', 'Sandwich']

export function variantLabel(v) {
  const mode = v.mode && v.mode !== 'Regular' ? v.mode : ''
  return [mode, v.campus].filter(Boolean).join(', ') || (v.campus ? v.campus : 'Regular')
}

const rank = (v) => (v.campus ? 1 : 0) * 10 + Math.max(0, MODE_ORDER.indexOf(v.mode || 'Regular'))

// Returns one entry per school, programme name and level. The entry is the main variant plus `variants`, all of them in a sensible order.
export function groupPrograms(list) {
  const map = new Map()
  for (const p of list) {
    const key = `${p.schoolId}|${p.name}|${p.level || ''}`
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(p)
  }
  return [...map.values()].map((vs) => {
    const sorted = [...vs].sort((a, b) => rank(a) - rank(b))
    return { ...sorted[0], variants: sorted }
  })
}
