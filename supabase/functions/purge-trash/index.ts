// Empties the trash: erases accounts that have been in the trash for 7 days or more (see supabase/step220_user_trash.sql).
// Run every hour by the pg_cron job "purge-trash".
//   POST /purge-trash           erases what is due
//   POST /purge-trash?dry=1     lists what is due, erases nothing
// For each account: note its uploaded file paths, call purge_trashed_account (which re-checks the 7 days, keeps a
// private copy in the Archive and erases the account), then remove the files from the private "documents" bucket.
// Calling it early or twice does nothing extra, because the database function only erases accounts that are due.
// Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (already set).
import { createClient } from 'npm:@supabase/supabase-js@2'

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)
  const dry = new URL(req.url).searchParams.get('dry') === '1'
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: due, error } = await admin.from('profiles').select('id').not('trashed_at', 'is', null).lte('trashed_at', cutoff).limit(50)
  if (error) { console.error(error); return json({ error: 'Could not read the trash.' }, 500) }
  if (dry) return json({ due: (due ?? []).length })

  let erased = 0, filesLeft = 0
  for (const { id } of due ?? []) {
    const { data: docs } = await admin.from('documents').select('file_path').eq('student_id', id)
    const paths = (docs ?? []).map((d: { file_path: string }) => d.file_path).filter(Boolean)
    const { data: done, error: rpcErr } = await admin.rpc('purge_trashed_account', { p_user: id })
    if (rpcErr) { console.error('purge failed', id, rpcErr); continue }
    if (!done) continue
    erased++
    if (paths.length) {
      const { error: rmErr } = await admin.storage.from('documents').remove(paths)
      if (rmErr) { console.error('files left', id, rmErr); filesLeft += paths.length }
    }
  }
  return json({ ok: true, erased, filesLeft })
})
