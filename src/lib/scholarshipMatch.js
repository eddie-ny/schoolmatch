// Checks one scholarship against what the student gave. It only uses rules the scholarship states.
// A rule that is blank is never guessed. The student still confirms with the school before applying.
// Returns { state: 'meets' | 'below' | 'closed' | 'unknown', reasons: [plain words] }.
export function matchScholarship(s, me, now = new Date()) {
  const reasons = []
  let below = false
  let known = 0
  if (s.deadline && String(s.deadline).slice(0, 10) < now.toISOString().slice(0, 10)) return { state: 'closed', reasons: [`Closed on ${s.deadline}`] }
  if (s.gender) {
    known++
    const g = String(me.gender || '').toLowerCase()
    if (!g) reasons.push(`Open to ${s.gender === 'female' ? 'women' : 'men'} only. Add your gender in your profile to check this.`)
    else if (g.startsWith(s.gender === 'female' ? 'f' : 'm')) reasons.push(`Open to ${s.gender === 'female' ? 'women' : 'men'}: you fit`)
    else { below = true; reasons.push(`Open to ${s.gender === 'female' ? 'women' : 'men'} only`) }
  }
  if (s.minAggregate != null) {
    known++
    if (me.aggregate == null) reasons.push(`Needs an aggregate of ${s.minAggregate} or better`)
    else if (me.aggregate <= s.minAggregate) reasons.push(`Aggregate ${me.aggregate} is within the ${s.minAggregate} asked`)
    else { below = true; reasons.push(`Needs an aggregate of ${s.minAggregate} or better, yours is ${me.aggregate}`) }
  }
  if (s.minSat != null) {
    known++
    if (!me.sat) reasons.push(`Needs an SAT score of ${s.minSat} or more`)
    else if (Number(me.sat) >= s.minSat) reasons.push(`SAT ${me.sat} meets the ${s.minSat} asked`)
    else { below = true; reasons.push(`Needs an SAT score of ${s.minSat}, yours is ${me.sat}`) }
  }
  // A scholarship tied to courses lists them in `field`, separated by "|". The student's courses come from me.fields or me.field.
  const fields = String(s.field || '').split('|').map((x) => x.trim()).filter(Boolean)
  if (fields.length) {
    known++
    const mine = (me.fields || (me.field ? [me.field] : [])).map((x) => String(x).toLowerCase())
    const list = fields.join(' or ')
    if (!mine.length) reasons.push(`Only for ${list} programmes. Check yours is one of them.`)
    else if (fields.some((f) => mine.includes(f.toLowerCase()))) reasons.push(`For ${list} programmes: you fit`)
    else { below = true; reasons.push(`Only for ${list} programmes`) }
  }
  if (below) return { state: 'below', reasons }
  if (known === 0) return { state: 'unknown', reasons: ['No entry rules stated. Check the details with the school.'] }
  const open = reasons.some((r) => /Needs|Add your|Check yours/.test(r))
  return { state: open ? 'unknown' : 'meets', reasons }
}
