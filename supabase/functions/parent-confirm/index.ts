// Parent or guardian confirmation for under-18 students.
//   POST /parent-confirm/preview  { token }   public: who is being asked to confirm (first name only)
//   POST /parent-confirm/confirm  { token }   public: the parent agrees; the student's account opens
//   POST /parent-confirm/issue    { studentId }  staff only (owner, admin or support, second step done): creates a one-time link
//   POST /parent-confirm/email    { studentId }  staff only (same checks): creates a new link and emails it to the parent from Jamba
//   POST /parent-confirm/auto     (student's JWT) sent once after sign-up: emails the parent of an under-18 student a link
// Emails go through Resend from info@inbox.jambaconsult.com (secret RESEND_INBOX_API_KEY, same as welcome-email).
// The sign-up email is weaker proof than the staff phone check (a student could type their own second address),
// so staff still see every pending student and the parent email is shown next to the student email.
// The random code is shown only to the person who creates the link. The database keeps only a hash of it.
// All database work happens in functions that only the service role can run.
import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

async function sha256Hex(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}
const RESEND_KEY = Deno.env.get('RESEND_INBOX_API_KEY') ?? ''
const SITE = 'https://jambaconsult.com'
const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

// why: 'signup' (sent automatically when the student finishes signing up) or 'staff' (sent by a Jamba team member)
function parentEmail(parent: string, student: string, url: string, why: 'signup' | 'staff') {
  const hi = parent ? `Dear ${parent},` : 'Dear parent or guardian,'
  const reason = why === 'signup'
    ? `${student} has just created an account on Jamba (jambaconsult.com) and gave your name and this email address as their parent or guardian.`
    : `${student} has an account on Jamba (jambaconsult.com) and gave your name and this email address as their parent or guardian. A member of the Jamba team is sending you this email because your confirmation is still needed.`
  const paras = [
    reason,
    `Jamba helps students find the universities, programmes and scholarships their exam results can reach, in Ghana and abroad. Because ${student} is under 18, we need a parent or guardian to agree before their account is fully opened. Until then the account stays limited.`,
    'What we need from you: open the link below, read the short page, and press "I agree". It takes about a minute. You do not need to create an account or pay anything.',
    'The link works once and expires in 7 days. If it expires, reply to this email or contact us and we will send a new one.',
    `What Jamba keeps about ${student}: their name, contact details, date of birth, exam results and the schools they save. You can read how we use it in our Privacy notice (${SITE}/privacy).`,
    `If you are not ${student}'s parent or guardian, or you did not expect this email, do not press the link. Please tell us at info@inbox.jambaconsult.com or on +233 20 565 8716 so we can check.`,
  ]
  const btn = `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0"><tr><td style="background:#FFB02E;border-radius:999px"><a href="${esc(url)}" style="display:inline-block;padding:11px 22px;font-weight:700;font-size:15px;line-height:20px;white-space:nowrap;color:#1F1F1F;text-decoration:none">Review and confirm</a></td></tr></table>`
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Please confirm your child's Jamba account</title></head>
<body style="margin:0;padding:0;background:#FBFAF1;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:#333333">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBFAF1"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #ECEADF">
<tr><td style="height:6px;background:#FFB02E;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:24px 32px 8px;font-family:Poppins,Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:24px;font-weight:700"><span style="color:#FFB02E">Jam</span><span style="color:#8DB51A">ba</span></td></tr>
<tr><td style="padding:8px 32px 28px;font-size:16px;line-height:1.6">
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#1F1F1F">Please confirm ${esc(student)}'s Jamba account</h1>
<p style="margin:0 0 14px">${esc(hi)}</p>
${paras.slice(0, 3).map((t) => `<p style="margin:0 0 14px">${esc(t)}</p>`).join('\n')}
${btn}
${paras.slice(3).map((t) => `<p style="margin:0 0 14px;font-size:14px">${esc(t)}</p>`).join('\n')}
<p style="margin:0">Thank you,<br><b>The Jamba team</b></p>
</td></tr>
<tr><td style="background:#F1FAD3;padding:18px 32px;font-size:13px;line-height:1.6;color:#4A4A4A">Call or WhatsApp: +233 20 565 8716<br>Email: info@inbox.jambaconsult.com<br>Web: jambaconsult.com</td></tr>
</table>
<p style="max-width:560px;margin:14px auto 0;font-size:12px;line-height:1.5;color:#7A7A7A">You got this email because a student named you as their parent or guardian on jambaconsult.com.</p>
</td></tr></table></body></html>`
  const text = [hi, '', ...paras.slice(0, 3).flatMap((t) => [t, '']), `Review and confirm: ${url}`, '', ...paras.slice(3).flatMap((t) => [t, '']), 'Thank you,', 'The Jamba team', '+233 20 565 8716 | info@inbox.jambaconsult.com'].join('\n')
  return { subject: `Please confirm ${student}'s Jamba account`, html, text }
}

type SendResult = { sent: true; to: string } | { error: string }
async function sendParentEmail(studentId: string, createdBy: string | null, why: 'signup' | 'staff', idemKey: string): Promise<SendResult> {
  const { data: c } = await admin.from('parent_contacts').select('name, email').eq('student_id', studentId).maybeSingle()
  const { data: p } = await admin.from('profiles').select('full_name').eq('id', studentId).maybeSingle()
  if (!c?.email) return { error: 'No parent email on file.' }
  const token = randomToken()
  const { data: result, error } = await admin.rpc('issue_parent_token', {
    p_student: studentId, p_token_hash: await sha256Hex(token), p_method: 'email_link', p_created_by: createdBy,
  })
  if (error) throw error
  if (result !== 'ok') return { error: String(result) }
  const student = String(p?.full_name ?? '').trim().split(/\s+/)[0].slice(0, 40) || 'Your child'
  const mail = parentEmail(String(c.name ?? '').trim().slice(0, 60), student, `${SITE}/parent-confirm?token=${token}`, why)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': idemKey },
    body: JSON.stringify({ from: 'Jamba <info@inbox.jambaconsult.com>', to: [c.email], subject: mail.subject, html: mail.html, text: mail.text }),
  })
  if (!res.ok) {
    console.error('Resend failed', res.status, await res.text())
    return { error: 'send_failed' }
  }
  return { sent: true, to: String(c.email) }
}

function jwtClaims(token: string): Record<string, unknown> {
  try { return JSON.parse(atob(token.split('.')[1].replaceAll('-', '+').replaceAll('_', '/'))) } catch { return {} }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)
  const path = new URL(req.url).pathname
  const body = await req.json().catch(() => ({}))

  try {
    if (path.endsWith('/preview') || path.endsWith('/confirm')) {
      const token = String(body.token ?? '')
      if (token.length < 20 || token.length > 100) return json({ state: 'invalid' })
      const hash = await sha256Hex(token)
      if (path.endsWith('/preview')) {
        const { data, error } = await admin.rpc('preview_parent_token', { p_token_hash: hash })
        if (error) throw error
        const row = Array.isArray(data) ? data[0] : data
        return json({ state: row?.state ?? 'invalid', studentFirstName: row?.student_first_name ?? null, parentName: row?.parent_name ?? null })
      }
      const { data, error } = await admin.rpc('confirm_parent_token', { p_token_hash: hash })
      if (error) throw error
      return json({ state: data })
    }

    if (path.endsWith('/issue')) {
      const bearer = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
      const { data: auth } = await admin.auth.getUser(bearer)
      const user = auth?.user
      if (!user) return json({ error: 'Please sign in.' }, 401)
      // Staff only, and only after the authenticator step.
      const { data: staff } = await admin.from('admin_users').select('role').eq('user_id', user.id).maybeSingle()
      if (!staff || !['owner', 'admin', 'support'].includes(staff.role)) return json({ error: 'Not allowed.' }, 403)
      if (jwtClaims(bearer).aal !== 'aal2') return json({ error: 'Finish two-step verification first.' }, 403)

      let origin = ''
      try { const u = new URL(req.headers.get('origin') ?? ''); if (/^https?:$/.test(u.protocol)) origin = u.origin } catch { /* none */ }
      if (!origin) return json({ error: 'Could not tell which site to link to.' }, 400)

      const studentId = String(body.studentId ?? '')
      const token = randomToken()
      const { data: result, error } = await admin.rpc('issue_parent_token', {
        p_student: studentId, p_token_hash: await sha256Hex(token), p_method: 'staff_link', p_created_by: user.id,
      })
      if (error) throw error
      const messages: Record<string, string> = {
        no_student: 'Student not found.', not_minor: 'This student is not under 18.',
        no_parent: 'No parent details on file.', already_confirmed: 'A parent already confirmed this account.',
      }
      if (result !== 'ok') return json({ error: messages[String(result)] ?? 'Could not create the link.' }, 400)
      return json({ url: `${origin}/parent-confirm?token=${token}` })
    }

    if (path.endsWith('/auto')) {
      // Once per student, right after sign-up. The server decides; the browser only asks.
      const bearer = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
      const { data: auth } = await admin.auth.getUser(bearer)
      const user = auth?.user
      if (!user) return json({ error: 'Please sign in.' }, 401)
      if (user.app_metadata?.parent_email_sent_at) return json({ sent: false, reason: 'already sent' })
      if (!user.email_confirmed_at) return json({ sent: false, reason: 'email not confirmed' })
      const r = await sendParentEmail(user.id, null, 'signup', `parent-auto-${user.id}`)
      if ('error' in r) return json({ sent: false, reason: r.error })
      await admin.auth.admin.updateUserById(user.id, { app_metadata: { ...user.app_metadata, parent_email_sent_at: new Date().toISOString() } })
      return json({ sent: true })
    }

    if (path.endsWith('/email')) {
      const bearer = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
      const { data: auth } = await admin.auth.getUser(bearer)
      const user = auth?.user
      if (!user) return json({ error: 'Please sign in.' }, 401)
      const { data: staff } = await admin.from('admin_users').select('role').eq('user_id', user.id).maybeSingle()
      if (!staff || !['owner', 'admin', 'support'].includes(staff.role)) return json({ error: 'Not allowed.' }, 403)
      if (jwtClaims(bearer).aal !== 'aal2') return json({ error: 'Finish two-step verification first.' }, 403)
      const studentId = String(body.studentId ?? '')
      const r = await sendParentEmail(studentId, user.id, 'staff', `parent-staff-${studentId}-${crypto.randomUUID()}`)
      const messages: Record<string, string> = {
        no_student: 'Student not found.', not_minor: 'This student is not under 18.',
        no_parent: 'No parent details on file.', already_confirmed: 'A parent already confirmed this account.',
        send_failed: 'The email could not be sent. Try again, or use Create link and send it yourself.',
      }
      if ('error' in r) return json({ error: messages[r.error] ?? r.error }, 400)
      return json({ sent: true, to: r.to })
    }

    return json({ error: 'Not found' }, 404)
  } catch (e) {
    console.error(e)
    return json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})
