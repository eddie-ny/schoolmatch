// Paystack payments. One function, three routes:
//   POST /paystack/init     signed-in user starts a payment for a plan
//   POST /paystack/verify   signed-in user comes back from Paystack; we ask Paystack if it was paid
//   POST /paystack/webhook  Paystack tells us a charge succeeded (signature checked)
// The price always comes from the plans table, never from the browser. A plan is activated only after
// Paystack itself confirms the payment, and only by the activate_payment() database function.
import { createClient } from 'npm:@supabase/supabase-js@2'

const PAYSTACK = 'https://api.paystack.co'
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const secret = () => Deno.env.get('PAYSTACK_SECRET_KEY') ?? ''

async function hmacSha512Hex(key: string, data: string) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(data))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function paystack(path: string, init?: RequestInit) {
  const res = await fetch(`${PAYSTACK}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${secret()}`, 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
  return res.json()
}

// Ask Paystack whether the payment really succeeded, then let the database activate the plan.
async function settle(reference: string): Promise<string> {
  const out = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`)
  const tx = out?.data
  if (!out?.status || !tx || tx.status !== 'success') return 'not_paid'
  const { data, error } = await admin.rpc('activate_payment', {
    p_reference: reference, p_amount_minor: tx.amount, p_currency: tx.currency,
  })
  if (error) throw error
  return data as string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)
  if (!secret()) return json({ error: 'Payments are not configured yet.' }, 503)
  const path = new URL(req.url).pathname

  try {
    // ---- Paystack -> us ----
    if (path.endsWith('/webhook')) {
      const raw = await req.text()
      const sig = req.headers.get('x-paystack-signature') ?? ''
      if (!safeEqual(await hmacSha512Hex(secret(), raw), sig)) return json({ error: 'Bad signature' }, 401)
      const evt = JSON.parse(raw)
      if (evt.event === 'charge.success' && evt.data?.reference) await settle(String(evt.data.reference))
      return json({ ok: true })
    }

    // ---- Signed-in user -> us ----
    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
    const { data: auth } = await admin.auth.getUser(token)
    const user = auth?.user
    if (!user) return json({ error: 'Please sign in.' }, 401)
    const body = await req.json().catch(() => ({}))

    if (path.endsWith('/init')) {
      const { data: plan } = await admin.from('plans').select('*').eq('id', String(body.plan ?? '')).maybeSingle()
      if (!plan) return json({ error: 'Unknown plan.' }, 400)
      if (!plan.price_minor) return json({ error: 'This plan has no price yet.' }, 400)
      if (!user.email) return json({ error: 'Your account has no email.' }, 400)

      let origin = ''
      try { const u = new URL(req.headers.get('origin') ?? ''); if (/^https?:$/.test(u.protocol)) origin = u.origin } catch { /* no origin */ }
      if (!origin) return json({ error: 'Could not tell where to send you back to.' }, 400)

      const reference = 'sm_' + crypto.randomUUID().replaceAll('-', '')
      const ins = await admin.from('payments').insert({
        user_id: user.id, provider: 'paystack', reference, status: 'pending',
        plan: plan.id, amount_minor: plan.price_minor, currency: plan.currency,
      })
      if (ins.error) throw ins.error

      const out = await paystack('/transaction/initialize', {
        method: 'POST',
        body: JSON.stringify({
          email: user.email, amount: plan.price_minor, currency: plan.currency, reference,
          callback_url: `${origin}/pricing`, metadata: { user_id: user.id, plan: plan.id },
        }),
      })
      if (!out?.status) {
        await admin.from('payments').update({ status: 'failed' }).eq('reference', reference)
        return json({ error: out?.message || 'Paystack could not start the payment.' }, 502)
      }
      return json({ url: out.data.authorization_url, reference })
    }

    if (path.endsWith('/verify')) {
      const reference = String(body.reference ?? '')
      const { data: pay } = await admin.from('payments').select('user_id,status').eq('reference', reference).maybeSingle()
      if (!pay || pay.user_id !== user.id) return json({ error: 'Payment not found.' }, 404)
      if (pay.status === 'success') return json({ status: 'activated' })
      return json({ status: await settle(reference) })
    }

    return json({ error: 'Not found' }, 404)
  } catch (e) {
    console.error(e)
    return json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})
