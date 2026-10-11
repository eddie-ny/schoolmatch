import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { listUsers, importCatalog, deleteDemoData, setAccountDisabled, listAuditLog } from '../lib/api'
import { parseCsv, rowsToSchools, rowsToPrograms, rowsToScholarships } from '../lib/csv'
import { Badge, ConfirmDialog, Field, PageTitle } from '../components/ui'

const SHEETS = [
  { kind: 'schools', label: 'Schools sheet', cols: 'school_name, country, type, category, city, website, verified' },
  { kind: 'programs', label: 'Programs sheet', cols: 'school_name, program_name, level, field, fees_usd, duration_years, min_core_maths, min_core_english, min_core_science, required_electives, cutoff_aggregate, cutoff_year, sat_low, sat_high, english_test_waiver, foundation_available, verified' },
  { kind: 'scholarships', label: 'Scholarships sheet', cols: 'name, funder, country, funding_type, level, min_aggregate, min_sat, criteria, deadline, link, verified' },
]

function Importer({ sheet }) {
  const [msg, setMsg] = useState('')
  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const rows = parseCsv(await file.text())
    if (!rows.length) return setMsg('No rows found. Check the file is a CSV with a header row.')
    let converted
    if (sheet.kind === 'schools') converted = rowsToSchools(rows)
    else if (sheet.kind === 'programs') converted = rowsToPrograms(rows)
    else converted = rowsToScholarships(rows)
    setMsg('Importing...')
    try {
      const res = await importCatalog(sheet.kind, converted)
      setMsg(`Added ${res.added}, updated ${res.updated}.${res.skipped.length ? ` Skipped ${res.skipped.length}: ${res.skipped.slice(0, 5).join('; ')}` : ''}`)
    } catch (err) {
      setMsg(`Import stopped: ${err.message}`)
    }
    e.target.value = ''
  }
  return (
    <div className="card space-y-2">
      <h3 className="font-bold">{sheet.label}</h3>
      <p className="text-xs text-neutral-500">Columns: {sheet.cols}</p>
      <div className="dropzone"><input type="file" accept=".csv" onChange={onFile} /></div>
      {msg && <p className="text-sm font-semibold">{msg}</p>}
    </div>
  )
}

export default function Admin() {
  const { user, loading } = useAuth()
  const [users, setUsers] = useState([])

  const [target, setTarget] = useState(null) // account waiting for confirmation
  const [err, setErr] = useState('')
  const [log, setLog] = useState([])
  const load = () => Promise.all([listUsers().then(setUsers), listAuditLog().then(setLog).catch(() => {})])
  useEffect(() => { load() }, [])
  const toggle = async () => {
    try {
      await setAccountDisabled(target.id, !target.disabled)
      setTarget(null)
      await load()
    } catch (e) { setTarget(null); setErr(e.message) }
  }

  if (loading) return <p>Loading...</p>
  if (user?.role !== 'admin') return <p>Admins only.</p>

  return (
    <div className="space-y-8">
      <PageTitle title="Admin" sub="Sign-ups come from the database. Authenticator 2FA for admins is not added yet." />

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Sign-ups ({users.length})</h2>
        <p className="text-sm text-neutral-600">Accounts are never deleted. Disabling blocks sign-in and keeps every record.</p>
        {err && <p className="text-red-700 text-sm" role="alert">{err}</p>}
        <ConfirmDialog
          open={!!target}
          title={target?.disabled ? 'Reactivate this account?' : 'Disable this account?'}
          text={target ? `${target.fullName} (${target.email}). ${target.disabled ? 'They will be able to sign in again.' : 'They will be signed out and blocked. Records are kept.'}` : ''}
          confirmLabel={target?.disabled ? 'Reactivate' : 'Disable'}
          onConfirm={toggle}
          onCancel={() => setTarget(null)}
        />
        <div className="overflow-x-auto card !p-0">
          <table className="w-full text-sm">
            <thead className="text-left bg-neutral-50">
              <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Access</th><th className="p-3">Profile</th><th className="p-3">Account</th></tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const now = Date.now()
                const subbed = u.subscription?.status === 'active' && new Date(u.subscription.expiresAt).getTime() > now
                const trial = u.trialEndsAt && new Date(u.trialEndsAt).getTime() > now
                const label = subbed ? 'Subscriber' : trial ? 'Trial' : u.trialEndsAt ? 'Expired' : 'No trial'
                return (
                  <tr key={u.id} className="border-t border-neutral-200">
                    <td className="p-3">{u.fullName}{u.isMinor && ' (under 18)'}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.phone}</td>
                    <td className="p-3"><Badge tone={subbed || trial ? 'green' : 'orange'}>{label}</Badge></td>
                    <td className="p-3">{u.profileComplete ? 'Complete' : 'Incomplete'}</td>
                    <td className="p-3 whitespace-nowrap">
                      {u.disabled && <Badge tone="orange">Disabled</Badge>}{' '}
                      <button className="underline min-h-11 px-1" onClick={() => setTarget(u)}>{u.disabled ? 'Reactivate' : 'Disable'}</button>
                    </td>
                  </tr>
                )
              })}
              {users.length === 0 && (
                <tr><td className="p-3 text-neutral-500" colSpan={6}>No sign-ups yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Activity log</h2>
        <p className="text-sm text-neutral-600">Admin actions and payments, newest first. It cannot be edited or deleted. It never holds passwords or card details.</p>
        <div className="overflow-x-auto card !p-0">
          <table className="w-full text-sm">
            <thead className="text-left bg-neutral-50"><tr><th className="p-3">When</th><th className="p-3">Who</th><th className="p-3">Action</th><th className="p-3">Account</th></tr></thead>
            <tbody>
              {log.map((e) => {
                const who = users.find((u) => u.id === e.actor_id)
                const target = users.find((u) => u.id === e.target_user)
                return (
                  <tr key={e.id} className="border-t border-neutral-200">
                    <td className="p-3 whitespace-nowrap">{new Date(e.at).toLocaleString()}</td>
                    <td className="p-3">{who?.email || (e.actor_id ? e.actor_id.slice(0, 8) : 'system')}{e.actor_role ? ` (${e.actor_role})` : ''}</td>
                    <td className="p-3">{e.action.replaceAll('_', ' ')}</td>
                    <td className="p-3">{target?.email || (e.target_user ? e.target_user.slice(0, 8) : '')}</td>
                  </tr>
                )
              })}
              {log.length === 0 && <tr><td className="p-3 text-neutral-500" colSpan={4}>Nothing logged yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Spreadsheet import (CSV)</h2>
        <p className="text-sm text-neutral-600">Import schools first, then programs so they link to the right school. Export your Excel sheet as CSV.</p>
        <div className="grid gap-4 md:grid-cols-3">{SHEETS.map((s) => <Importer key={s.kind} sheet={s} />)}</div>
        <button
          className="btn btn-outline"
          onClick={async () => {
            if (!window.confirm('Delete all sample (demo) schools, programs and scholarships? Real rows are not touched.')) return
            try { await deleteDemoData(); location.reload() } catch (err) { alert(err.message) }
          }}
        >
          Delete sample (demo) data
        </button>
      </section>
    </div>
  )
}
