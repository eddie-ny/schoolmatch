// Phone numbers: Ghana numbers must have 10 digits (024 123 4567) or +233 and 9 digits (+233 24 123 4567).
// Numbers from other countries must start with + and have 8 to 15 digits.
// Ghana numbers are stored as 10 digits starting with 0, the format most saved numbers already use
// (the free-trial check compares digits only, so one format keeps that check working).
export const PHONE_HINT = 'Ghana numbers: 10 digits, like 024 123 4567. Other countries: start with + and the country code.'

export function checkPhone(raw) {
  const s = String(raw ?? '').trim()
  if (!s) return { error: 'Please enter a phone number.' }
  if (/[^\d\s()+\-.]/.test(s)) return { error: 'A phone number can only have digits, spaces and a + at the start.' }
  const plus = s.startsWith('+') || s.startsWith('00')
  let d = s.replace(/\D/g, '')
  if (s.startsWith('00')) d = d.slice(2)
  if (plus || d.startsWith('233')) {
    if (d.startsWith('233')) {
      let rest = d.slice(3)
      if (rest.length === 10 && rest.startsWith('0')) rest = rest.slice(1) // +233 024... written with the 0
      if (rest.length !== 9 || rest.startsWith('0')) return { error: 'A Ghana number after +233 must have 9 digits, like +233 24 123 4567.' }
      return { value: '0' + rest }
    }
    if (d.length < 8 || d.length > 15) return { error: 'An international number must have 8 to 15 digits after the +.' }
    return { value: '+' + d }
  }
  if (d.length !== 10 || !d.startsWith('0')) return { error: 'A Ghana phone number must have 10 digits and start with 0, like 024 123 4567.' }
  return { value: d }
}
