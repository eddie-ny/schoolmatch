// Staff-created student accounts.
//   POST /staff-users/create-student { fullName, phone, email, dateOfBirth, gender?, parentName?, parentPhone?, parentEmail? }
//   POST /staff-users/delete-account { userId }   super admin only: archives and erases the account, then removes their uploaded files from storage
//   POST /staff-users/activate-account { userId }  any staff: confirms the email of a student whose link failed
//   POST /staff-users/refund-email { paymentId }  owner or admin: emails the person that a recorded refund was made (D10).
//        Sends once per payment (logged as refund_email_sent). Uses RESEND_INBOX_API_KEY, like the plan emails.
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
const SITE = 'https://jambaconsult.com'
const esc = (x: string) => x.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
const longDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Accra' })
const cedis = (minor: number, cur: string) => `${cur || 'GHS'} ${(minor / 100).toFixed(2)}`

// Same look as the plan reminder emails (supabase/functions/plan-reminders).
function refundEmail(first: string, amount: string, plan: string, paidOn: string, ended: boolean) {
  const subject = 'Your Jamba refund'
  const lines = [
    `We have refunded ${amount} for your ${plan} plan (paid on ${paidOn}).`,
    'Depending on your bank or mobile money network, it can take several business days to reach you. If you have not received it after that, reply to this email.',
    ...(ended ? ['Your plan has ended, so your account is back to the summary view. Your profile, results and saved programs are still there.'] : []),
  ]
  const hi = `Hi ${first || 'there'},`
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#FBFAF1;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:#333333">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBFAF1"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #ECEADF">
<tr><td style="height:6px;background:#FFB02E;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:24px 32px 8px">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle"><img src="${SITE}/android-chrome-192x192.png" width="44" height="44" alt="Jamba" style="display:block;border-radius:10px"></td>
<td style="vertical-align:middle;padding-left:12px;font-family:Poppins,Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:24px;font-weight:700"><span style="color:#FFB02E">Jam</span><span style="color:#8DB51A">ba</span></td>
</tr></table></td></tr>
<tr><td style="padding:16px 32px 28px;font-size:16px;line-height:1.6">
<h1 style="margin:0 0 18px;font-family:Poppins,Segoe UI,Helvetica,Arial,sans-serif;font-size:26px;line-height:1.25;color:#1F1F1F">Your refund</h1>
<p style="margin:0 0 14px">${esc(hi)}</p>
${lines.map((l) => `<p style="margin:0 0 14px">${esc(l)}</p>`).join('\n')}
<p style="margin:0">Questions? Reply to this email or message us on WhatsApp.<br><b>The Jamba team</b></p>
</td></tr>
<tr><td style="background:#F1FAD3;padding:22px 32px;font-size:13px;line-height:1.6;color:#4A4A4A">
<p style="margin:0">Call or WhatsApp: <a href="https://wa.me/233205658716" style="color:#6B8E0A;font-weight:600;text-decoration:none">+233 20 565 8716</a><br>
Email: <a href="mailto:info@inbox.jambaconsult.com" style="color:#6B8E0A;font-weight:600;text-decoration:none">info@inbox.jambaconsult.com</a><br>
Web: <a href="${SITE}" style="color:#6B8E0A;font-weight:600;text-decoration:none">jambaconsult.com</a></p>
</td></tr>
</table>
<p style="max-width:560px;margin:14px auto 0;font-size:12px;line-height:1.5;color:#7A7A7A">You got this email because a payment you made on Jamba was refunded.<br>&copy; Jamba</p>
</td></tr></table>
</body></html>`
  const text = ['Your refund', '', hi, '', ...lines.flatMap((l) => [l, '']), 'Questions? Reply to this email or WhatsApp +233 20 565 8716.', 'The Jamba team'].join('\n')
  return { subject, html, text }
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
    if (path.endsWith('/refund-email')) {
      if (staff.role !== 'owner' && staff.role !== 'admin') return json({ error: 'Only an owner or admin can send this.' }, 403)
      const paymentId = String(body.paymentId ?? '')
      if (!/^[0-9a-f-]{36}$/i.test(paymentId)) return json({ error: 'Bad payment id.' }, 400)
      const { data: pay } = await admin.from('payments')
        .select('id, user_id, plan, status, currency, paid_at, created_at, refund_amount_minor').eq('id', paymentId).maybeSingle()
      if (!pay || !pay.user_id) return json({ error: 'Payment not found.' }, 404)
      if (pay.status !== 'refunded' && pay.status !== 'partially_refunded') return json({ error: 'Record the refund first.' }, 400)
      const { data: sent } = await admin.from('audit_log').select('id').eq('action', 'refund_email_sent')
        .eq('target_user', pay.user_id).eq('detail->>payment_id', paymentId).limit(1)
      if (sent?.length) return json({ ok: true, already: true })
      const { data: target } = await admin.auth.admin.getUserById(pay.user_id)
      const email = target?.user?.email
      if (!email) return json({ error: 'This person has no email address.' }, 400)
      const [{ data: prof }, { data: plan }, { data: sub }] = await Promise.all([
        admin.from('profiles').select('full_name').eq('id', pay.user_id).maybeSingle(),
        admin.from('plans').select('label').eq('id', pay.plan).maybeSingle(),
        admin.from('subscriptions').select('status').eq('user_id', pay.user_id).maybeSingle(),
      ])
      const first = String(prof?.full_name ?? '').trim().split(/\s+/)[0].slice(0, 40)
      const m = refundEmail(first, cedis(pay.refund_amount_minor, pay.currency), plan?.label || pay.plan || 'Jamba', longDate(pay.paid_at || pay.created_at), sub?.status === 'refunded')
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${Deno.env.get('RESEND_INBOX_API_KEY')}`, 'Content-Type': 'application/json', 'Idempotency-Key': `refund-${paymentId}` },
        body: JSON.stringify({ from: 'Jamba <info@inbox.jambaconsult.com>', to: [email], subject: m.subject, html: m.html, text: m.text }),
      })
      if (!res.ok) { console.error('Resend failed', paymentId, res.status, await res.text()); return json({ error: 'The email could not be sent. Try again.' }, 502) }
      await admin.from('audit_log').insert({
        actor_id: user.id, actor_role: staff.role, action: 'refund_email_sent', target_user: pay.user_id, detail: { payment_id: paymentId },
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
