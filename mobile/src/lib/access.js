// Same wording as the website's timeLeft (src/lib/access.js in the web code).
export function timeLeft(iso) {
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return 'expired'
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  if (h >= 48) return `${Math.floor(h / 24)} days`
  return `${h}h ${m}m`
}
