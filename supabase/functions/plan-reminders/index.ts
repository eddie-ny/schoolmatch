// Plan reminder emails, run once a day by a pg_cron job (see supabase/step214_plan_reminder_cron.sql).
//   POST /plan-reminders           sends what is due
//   POST /plan-reminders?dry=1     lists what would be sent, sends nothing
// Two emails per paid plan, and never more: one when the plan has 3 days or less left ("soon"), one after it ends
// ("ended", only within 7 days of the end so old plans are never emailed). Each is marked on the user's
// app_metadata.plan_notices with the plan's expires_at, so calling this again sends nothing new, and a renewed plan
// (new expires_at) gets its own two emails. Resend also gets an Idempotency-Key per user, kind and end date.
// These are account notices about a plan the person paid for. Payment happens on the website only; an email
// (outside the app) may link to the Pricing page.
// Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_INBOX_API_KEY (already set).
import { createClient } from 'npm:@supabase/supabase-js@2'

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const RESEND_KEY = Deno.env.get('RESEND_INBOX_API_KEY')!
const SITE = 'https://jambaconsult.com'
const DAY = 24 * 60 * 60 * 1000

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
const when = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Accra' })

type Kind = 'soon' | 'ended'

function words(kind: Kind, first: string, plan: string, end: string) {
  const hi = `Hi ${first || 'there'},`
  return kind === 'soon'
    ? { subject: `Your Jamba plan ends on ${end}`, title: 'Your plan ends soon', hi,
        lines: [`Your ${plan} plan gives you full access until ${end}.`, 'After that, Jamba goes back to the summary view: you will still see schools and programs, but not the full details, eligibility results and scholarship links.', 'If you want to keep full access, you can renew on the website before then. The new time is added to the end of your current plan.'],
        button: 'Renew on jambaconsult.com' }
    : { subject: 'Your Jamba plan has ended', title: 'Your plan has ended', hi,
        lines: [`Your ${plan} plan ended on ${end}, so your account is back to the summary view on the website and in the app.`, 'Your profile, results and saved programs are still there. When you renew, full access comes back straight away.'],
        button: 'See plans on jambaconsult.com' }
}

function html(w: ReturnType<typeof words>) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(w.subject)}</title></head>
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
<h1 style="margin:0 0 18px;font-family:Poppins,Segoe UI,Helvetica,Arial,sans-serif;font-size:26px;line-height:1.25;color:#1F1F1F">${esc(w.title)}</h1>
<p style="margin:0 0 14px">${esc(w.hi)}</p>
${w.lines.map((l) => `<p style="margin:0 0 14px">${esc(l)}</p>`).join('\n')}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0"><tr><td style="background:#FFB02E;border-radius:999px"><a href="${SITE}/pricing" style="display:inline-block;padding:11px 22px;font-weight:700;font-size:15px;line-height:20px;white-space:nowrap;color:#1F1F1F;text-decoration:none">${esc(w.button)}</a></td></tr></table>
<p style="margin:0">Questions? Reply to this email or message us on WhatsApp.<br><b>The Jamba team</b></p>
</td></tr>
<tr><td style="background:#F1FAD3;padding:22px 32px;font-size:13px;line-height:1.6;color:#4A4A4A">
<p style="margin:0">Call or WhatsApp: <a href="https://wa.me/233205658716" style="color:#6B8E0A;font-weight:600;text-decoration:none">+233 20 565 8716</a><br>
Email: <a href="mailto:info@inbox.jambaconsult.com" style="color:#6B8E0A;font-weight:600;text-decoration:none">info@inbox.jambaconsult.com</a><br>
Web: <a href="${SITE}" style="color:#6B8E0A;font-weight:600;text-decoration:none">jambaconsult.com</a></p>
</td></tr>
</table>
<p style="max-width:560px;margin:14px auto 0;font-size:12px;line-height:1.5;color:#7A7A7A">You got this email because you have a paid plan on Jamba. We send at most two emails per plan: a few days before it ends and when it ends.<br>&copy; Jamba</p>
</td></tr></table>
</body></html>`
}

const text = (w: ReturnType<typeof words>) =>
  [w.title, '', w.hi, '', ...w.lines.flatMap((l) => [l, '']), `${w.button}: ${SITE}/pricing`, '', 'Questions? Reply to this email or WhatsApp +233 20 565 8716.', 'The Jamba team'].join('\n')

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)
  const dry = new URL(req.url).searchParams.get('dry') === '1'
  const now = Date.now()

  // Plans ending in the next 3 days, or ended in the last 7.
  const { data: subs, error } = await admin.from('subscriptions').select('user_id, plan, status, expires_at')
    .gte('expires_at', new Date(now - 7 * DAY).toISOString()).lte('expires_at', new Date(now + 3 * DAY).toISOString())
  if (error) return json({ error: error.message }, 500)
  const { data: plans } = await admin.from('plans').select('id, label')
  const label = (id: string) => plans?.find((p) => p.id === id)?.label || 'Jamba'

  const out: unknown[] = []
  for (const s of subs || []) {
    if (s.status === 'cancelled' || s.status === 'refunded') continue
    const kind: Kind = Date.parse(s.expires_at) > now ? 'soon' : 'ended'
    const { data: got } = await admin.auth.admin.getUserById(s.user_id)
    const user = got?.user
    if (!user?.email) continue
    const notices = (user.app_metadata?.plan_notices ?? {}) as Record<string, string>
    if (notices[kind] === s.expires_at) continue // already sent for this plan
    const { data: p } = await admin.from('profiles').select('full_name').eq('id', s.user_id).maybeSingle()
    const first = String(p?.full_name ?? '').trim().split(/\s+/)[0].slice(0, 40)
    const w = words(kind, first, label(s.plan), when(s.expires_at))
    if (dry) { out.push({ user: s.user_id, kind, expires_at: s.expires_at, subject: w.subject }); continue }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `plan-${kind}-${s.user_id}-${s.expires_at}` },
      body: JSON.stringify({ from: 'Jamba <info@inbox.jambaconsult.com>', to: [user.email], subject: w.subject, html: html(w), text: text(w) }),
    })
    if (!res.ok) { console.error('Resend failed', s.user_id, res.status, await res.text()); out.push({ user: s.user_id, kind, sent: false }); continue }
    await admin.auth.admin.updateUserById(s.user_id, { app_metadata: { ...user.app_metadata, plan_notices: { ...notices, [kind]: s.expires_at } } })
    out.push({ user: s.user_id, kind, sent: true })
  }
  return json({ dry, checked: subs?.length ?? 0, results: out })
})
