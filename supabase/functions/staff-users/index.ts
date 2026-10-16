// Staff-created student accounts.
//   POST /staff-users/create-student { fullName, phone, email, dateOfBirth, gender?, parentName?, parentPhone?, parentEmail? }
//   POST /staff-users/delete-account { userId }   super admin only: archives and erases the account, then removes their uploaded files from storage
//   POST /staff-users/activate-account { userId }  any staff: confirms the email of a student whose link failed
// Allowed for any staff member (owner, admin, support) who finished the authenticator step.
// The account is created with a one-time temporary password that is shown once to the staff member.
// No subscription is created or changed here. Staff cannot assign subscriptions.
import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

function jwtClaims(token: string): Record<string, unknown> {
  try { return JSON.parse(atob(token.split('.')[1].replaceAll('-', '+').replaceAll('_', '/'))) } catch { return {} }
}
function tempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  const b = crypto.getRandomValues(new Uint8Array(14))
  return [...b].map((x) => chars[x % chars.length]).join('') + '#7'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)
  const path = new URL(req.url).pathname
  const body = await req.json().catch(() => ({}))
  try {
    const bearer = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
    const { data: auth } = await admin.auth.getUser(bearer)
    const user = auth?.user
    if (!user) return json({ error: 'Please sign in.' }, 401)
    const { data: staff } = await admin.from('admin_users').select('role').eq('user_id', user.id).maybeSingle()
    if (!staff || !['owner', 'admin', 'support'].includes(staff.role)) return json({ error: 'Not allowed.' }, 403)
    if (jwtClaims(bearer).aal !== 'aal2') return json({ error: 'Finish two-step verification first.' }, 403)

    if (path.endsWith('/create-student')) {
      const fullName = String(body.fullName ?? '').trim()
      const phone = String(body.phone ?? '').trim()
      const email = String(body.email ?? '').trim().toLowerCase()
      const dob = String(body.dateOfBirth ?? '').trim()
      if (!fullName || fullName.length > 120) return json({ error: 'Enter the full name.' }, 400)
      if (phone.replace(/\D/g, '').length < 9 || phone.length > 20) return json({ error: 'Enter a valid phone number.' }, 400)
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) return json({ error: 'Enter a valid email address.' }, 400)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dob) || Number.isNaN(Date.parse(dob))) return json({ error: 'Enter the date of birth.' }, 400)
      const meta: Record<string, string> = { full_name: fullName, phone, date_of_birth: dob }
      const gender = String(body.gender ?? '')
      if (gender === 'female' || gender === 'male') meta.gender = gender
      const cutoff = new Date(); cutoff.setFullYear(cutoff.getFullYear() - 18)
      if (new Date(dob) > cutoff) {
        meta.parent_name = String(body.parentName ?? '').trim()
        meta.parent_phone = String(body.parentPhone ?? '').trim()
        meta.parent_email = String(body.parentEmail ?? '').trim()
        if (!meta.parent_name || !meta.parent_email) return json({ error: 'This student is under 18. Add the parent or guardian name and email.' }, 400)
      }
      const password = tempPassword()
      const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: meta })
      if (error) {
        const exists = /already|registered|exists/i.test(error.message)
        return json({ error: exists ? 'An account with that email already exists.' : 'Could not create the account.' }, 400)
      }
      await admin.from('audit_log').insert({
        actor_id: user.id, actor_role: staff.role, action: 'student_created_by_staff', target_user: data.user.id, detail: {},
      })
      return json({ email, password })
    }
    if (path.endsWith('/activate-account')) {
      // Any staff member can confirm the email of a student whose confirmation link failed.
      const userId = String(body.userId ?? '')
      if (!/^[0-9a-f-]{36}$/i.test(userId)) return json({ error: 'Bad account id.' }, 400)
      const { data: target, error: getErr } = await admin.auth.admin.getUserById(userId)
      if (getErr || !target?.user) return json({ error: 'Account not found.' }, 404)
      if (target.user.email_confirmed_at) return json({ error: 'This account is already confirmed.' }, 400)
      const { error: upErr } = await admin.auth.admin.updateUserById(userId, { email_confirm: true })
      if (upErr) { console.error(upErr); return json({ error: 'Could not activate the account.' }, 400) }
      await admin.from('audit_log').insert({
        actor_id: user.id, actor_role: staff.role, action: 'account_activated_by_staff', target_user: userId, detail: {},
      })
      return json({ ok: true })
    }
    if (path.endsWith('/delete-account')) {
      if (staff.role !== 'owner') return json({ error: 'Only a super admin can delete accounts.' }, 403)
      const userId = String(body.userId ?? '')
      if (!/^[0-9a-f-]{36}$/i.test(userId)) return json({ error: 'Bad account id.' }, 400)
      // Note the file paths first; the database function removes the rows.
      const { data: docs } = await admin.from('documents').select('file_path').eq('student_id', userId)
      const paths = (docs ?? []).map((d: { file_path: string }) => d.file_path).filter(Boolean)
      // Run the database function as the signed-in super admin so its own checks and the audit log apply.
      const asCaller = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
        global: { headers: { Authorization: `Bearer ${bearer}` } },
      })
      const { error } = await asCaller.rpc('admin_delete_account', { p_user: userId })
      if (error) return json({ error: error.message }, 400)
      let filesLeft = 0
      if (paths.length) {
        const { error: rmErr } = await admin.storage.from('documents').remove(paths)
        if (rmErr) { console.error(rmErr); filesLeft = paths.length }
      }
      return json({ ok: true, filesRemoved: paths.length - filesLeft, filesLeft })
    }
    return json({ error: 'Not found' }, 404)
  } catch (e) {
    console.error(e)
    return json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})
