// Staff pages live under a private address so they cannot be found by typing /admin or /support.
// Set VITE_STAFF_PATH in Vercel (for example team-1a2b3c4d5e6f). The repo is public, so the value is
// NOT written here. Without it the old /admin and /support addresses are used, as before.
// This only hides the address: the real protection is still the staff sign-in, the role check and the 2-step code.
const raw = (import.meta.env.VITE_STAFF_PATH || '').replace(/^\/+|\/+$/g, '')
export const STAFF_ROOT = raw ? `/${raw}` : ''
export const ADMIN_PATH = `${STAFF_ROOT}/admin`
export const SUPPORT_PATH = `${STAFF_ROOT}/support`
