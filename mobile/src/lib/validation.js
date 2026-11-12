// Copied from the web app (src/lib/api.js) so the phone checks passwords and ages the same way.

export const PASSWORD_RULE = 'Use at least 8 characters with upper case, lower case and numbers.'

export const passwordProblem = (pw) =>
  pw.length >= 8 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /[0-9]/.test(pw) ? '' : PASSWORD_RULE

export function isMinorFromDob(dob) {
  if (!dob) return false
  const d = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--
  return age < 18
}

// The phone form has three boxes (day, month, year). This returns "YYYY-MM-DD", or "" when the date is not a real past date.
export function dobFromParts(day, month, year) {
  const d = Number(day)
  const m = Number(month)
  const y = Number(year)
  if (![d, m, y].every(Number.isInteger) || y < 1900 || m < 1 || m > 12 || d < 1) return ''
  const dt = new Date(Date.UTC(y, m - 1, d))
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return ''
  if (dt > new Date()) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${y}-${pad(m)}-${pad(d)}`
}
