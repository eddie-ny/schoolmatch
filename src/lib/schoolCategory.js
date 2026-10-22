// What kind of institution a school is. A school's own category field wins when it is one of these; otherwise the name decides.
export const SCHOOL_CATEGORIES = [
  { id: 'University', label: 'Universities', one: 'University' },
  { id: 'Technical University', label: 'Technical universities', one: 'Technical university' },
  { id: 'Nursing college', label: 'Nursing and midwifery colleges', one: 'Nursing and midwifery college' },
]

export function schoolCategory(s) {
  const own = SCHOOL_CATEGORIES.find((c) => c.id.toLowerCase() === String(s?.category || '').toLowerCase())
  if (own) return own.id
  const name = s?.name || ''
  if (/nursing|midwifery/i.test(name)) return 'Nursing college'
  if (/technical university/i.test(name)) return 'Technical University'
  return 'University'
}

export const schoolCategoryLabel = (s) => SCHOOL_CATEGORIES.find((c) => c.id === schoolCategory(s))?.one || 'University'
