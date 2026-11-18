// Welcome email, sent once after a new user confirms their email with the sign-up code.
//   POST /welcome-email   (signed-in user's JWT; no body)
// The web app calls this right after the code is accepted. The function checks the account
// itself, so calling it again or from a script cannot send a second email:
//   - the email must be confirmed, and confirmed in the last 2 hours
//   - app_metadata.welcome_sent_at must be empty (users cannot edit app_metadata)
//   - Resend gets an Idempotency-Key per user
// Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_INBOX_API_KEY (already set for resend-inbox-forwarder).
import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const RESEND_KEY = Deno.env.get('RESEND_INBOX_API_KEY')!
const SITE = 'https://jambaconsult.com'

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

function html(first: string, trial: boolean, minor: boolean) {
  const btn = (href: string, label: string) =>
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0"><tr><td style="background:#FFB02E;border-radius:999px"><a href="${href}" style="display:inline-block;padding:11px 22px;font-weight:700;font-size:15px;line-height:20px;white-space:nowrap;color:#1F1F1F;text-decoration:none">${label}</a></td></tr></table>`
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to Jamba</title></head>
<body style="margin:0;padding:0;background:#FBFAF1;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:#333333">
<div style="display:none;max-height:0;overflow:hidden">Your Jamba account is ready. Add your results to see where you can get in.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBFAF1"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #ECEADF">
<tr><td style="height:6px;background:#FFB02E;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:24px 32px 8px">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle"><img src="${SITE}/android-chrome-192x192.png" width="44" height="44" alt="Jamba" style="display:block;border-radius:10px"></td>
<td style="vertical-align:middle;padding-left:12px;font-family:Poppins,Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:24px;font-weight:700"><span style="color:#FFB02E">Jam</span><span style="color:#8DB51A">ba</span></td>
</tr></table></td></tr>
<tr><td style="padding:16px 32px 28px;font-size:16px;line-height:1.6">
<h1 style="margin:0 0 12px;font-family:Poppins,Segoe UI,Helvetica,Arial,sans-serif;font-size:22px;color:#1F1F1F">Welcome to Jamba${first ? `, ${esc(first)}` : ''}!</h1>
<p style="margin:0 0 12px">Thank you for joining. Your account is ready.</p>
<p style="margin:0 0 8px">Here is how to get the most from it:</p>
<ol style="margin:0 0 4px;padding-left:20px">
<li style="margin-bottom:6px"><b>Add your results</b> (WASSCE, SAT or English test) on your profile.</li>
<li style="margin-bottom:6px"><b>See your matches:</b> schools and programmes your results can reach, each with a label such as Strong match or Good chance.</li>
<li><b>Check scholarships</b> you may qualify for, in Ghana and abroad.</li>
</ol>
${btn(`${SITE}/profile`, 'Go to my profile')}
${trial ? `<p style="margin:0 0 12px">Your 24-hour free trial has started. After it ends you can keep full access with a plan on the <a href="${SITE}/pricing" style="color:#6B8E0A;font-weight:600">Pricing page</a>.</p>` : ''}
${minor ? `<p style="margin:0 0 12px;padding:12px;background:#F1FAD3;border-radius:10px">You are under 18, so a parent or guardian must confirm your account. It stays limited until they do.</p>` : ''}
<p style="margin:0">Questions? Reply to this email or reach us on WhatsApp. We are happy to help.</p>
</td></tr>
<tr><td style="background:#F1FAD3;padding:22px 32px;font-size:13px;line-height:1.6;color:#4A4A4A">
<p style="margin:0 0 6px;font-weight:700;color:#333333">Jamba: find the schools, programmes and scholarships your results can reach.</p>
<p style="margin:0 0 10px">Ghana, USA, UK, Canada, Australia and more.</p>
<p style="margin:0">Call or WhatsApp: <a href="https://wa.me/233205658716" style="color:#6B8E0A;font-weight:600;text-decoration:none">+233 20 565 8716</a><br>
Email: <a href="mailto:info@inbox.jambaconsult.com" style="color:#6B8E0A;font-weight:600;text-decoration:none">info@inbox.jambaconsult.com</a><br>
Web: <a href="${SITE}" style="color:#6B8E0A;font-weight:600;text-decoration:none">jambaconsult.com</a></p>
</td></tr>
</table>
<p style="max-width:560px;margin:14px auto 0;font-size:12px;line-height:1.5;color:#7A7A7A">You got this email because you created an account on jambaconsult.com.<br>&copy; Jamba</p>
</td></tr></table>
</body></html>`
}

function text(first: string, trial: boolean, minor: boolean) {
  return [
    `Welcome to Jamba${first ? `, ${first}` : ''}!`,
    '',
    'Thank you for joining. Your account is ready.',
    '',
    '1. Add your results (WASSCE, SAT or English test) on your profile.',
    '2. See the schools and programmes your results can reach.',
    '3. Check scholarships you may qualify for, in Ghana and abroad.',
    '',
    `Go to your profile: ${SITE}/profile`,
    trial ? `\nYour 24-hour free trial has started. Plans: ${SITE}/pricing` : '',
    minor ? '\nYou are under 18, so a parent or guardian must confirm your account. It stays limited until they do.' : '',
    '',
    'Questions? Reply to this email, or call or WhatsApp +233 20 565 8716.',
  ].join('\n')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

  const jwt = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
  const { data: got, error: authErr } = await admin.auth.getUser(jwt)
  const user = got?.user
  if (authErr || !user?.email) return json({ error: 'Not signed in' }, 401)

  if (user.app_metadata?.welcome_sent_at) return json({ sent: false, reason: 'already sent' })
  const confirmedAt = user.email_confirmed_at ? Date.parse(user.email_confirmed_at) : NaN
  if (!confirmedAt) return json({ sent: false, reason: 'email not confirmed' })
  if (Date.now() - confirmedAt > 2 * 60 * 60 * 1000) return json({ sent: false, reason: 'not a new sign-up' })

  const { data: p } = await admin.from('profiles').select('full_name, is_minor, trial_ends_at').eq('id', user.id).maybeSingle()
  const first = String(p?.full_name ?? '').trim().split(/\s+/)[0].slice(0, 40)
  const trial = !!p?.trial_ends_at && Date.parse(p.trial_ends_at) > Date.now()
  const minor = !!p?.is_minor

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `welcome-${user.id}` },
    body: JSON.stringify({
      // Same sender the inbox forwarder already uses with this key, so replies land in the team inbox.
      from: 'Jamba <info@inbox.jambaconsult.com>',
      to: [user.email],
      subject: 'Welcome to Jamba',
      html: html(first, trial, minor),
      text: text(first, trial, minor),
    }),
  })
  if (!res.ok) {
    console.error('Resend failed', res.status, await res.text())
    return json({ error: 'Could not send' }, 502)
  }

  await admin.auth.admin.updateUserById(user.id, {
    app_metadata: { ...user.app_metadata, welcome_sent_at: new Date().toISOString() },
  })
  return json({ sent: true })
})
