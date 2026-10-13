// Parent or guardian confirmation for under-18 students.
//   POST /parent-confirm/preview  { token }   public: who is being asked to confirm (first name only)
//   POST /parent-confirm/confirm  { token }   public: the parent agrees; the student's account opens
//   POST /parent-confirm/issue    { studentId }  staff only (owner, admin or support, second step done): creates a one-time link
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

    return json({ error: 'Not found' }, 404)
  } catch (e) {
    console.error(e)
    return json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})
