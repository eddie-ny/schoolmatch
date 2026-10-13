import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { listUsers, importCatalog, deleteDemoData, setAccountDisabled, listAuditLog, importPlans, listPendingParents } from '../lib/api'
import { parseCsv, rowsToSchools, rowsToPrograms, rowsToScholarships } from '../lib/csv'
import { ConfirmDialog, PageTitle } from '../components/ui'
import { ActivityLog, NeedMfa, ParentsSection, SignupsSection, StatsPanel, TeamSection } from '../components/StaffParts'

const SHEETS = [
  { kind: 'schools', label: 'Schools sheet', cols: 'school_name, country, type, category, city, website, verified' },
  { kind: 'programs', label: 'Programs sheet', cols: 'school_name, program_name, level, field, fees_usd, duration_years, min_core_maths, min_core_english, min_core_science, required_electives, cutoff_aggregate, cutoff_year, sat_low, sat_high, english_test_waiver, foundation_available, verified' },
  { kind: 'plans', label: 'Plan prices sheet', cols: 'id, label, months, price, currency  (price in normal money, for example 49.50)' },
  { kind: 'scholarships', label: 'Scholarships sheet', cols: 'name, funder, country, funding_type, level, min_aggregate, min_sat, criteria, deadline, link, verified' },
]

function Importer({ sheet }) {
  const [msg, setMsg] = useState('')
  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const rows = parseCsv(await file.text())
    if (!rows.length) return setMsg('No rows found. Check the file is a CSV with a header row.')
    if (sheet.kind === 'plans') {
      setMsg('Importing...')
      try {
        const res = await importPlans(rows)
        setMsg(`Added ${res.added}, updated ${res.updated}.${res.skipped.length ? ` Skipped ${res.skipped.length}: ${res.skipped.slice(0, 5).join('; ')}` : ''}`)
      } catch (err) { setMsg(`Import stopped: ${err.message}`) }
      e.target.value = ''
      return
    }
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
    <div className="card space-y-2 min-w-0">
      <h3 className="font-bold">{sheet.label}</h3>
      <p className="text-xs text-neutral-600 break-words">Columns: {sheet.cols}</p>
      <div className="dropzone"><input type="file" accept=".csv" onChange={onFile} /></div>
      {msg && <p className="text-sm font-semibold">{msg}</p>}
    </div>
  )
}

export default function Admin() {
  const { user, loading, mfa } = useAuth()
  const [users, setUsers] = useState([])
  const [target, setTarget] = useState(null) // account waiting to be disabled or reactivated
  const [err, setErr] = useState('')
  const [log, setLog] = useState([])
  const [pending, setPending] = useState([])
  const load = () => Promise.all([listUsers().then(setUsers), listAuditLog().then(setLog).catch(() => {}), listPendingParents().then(setPending).catch(() => {})])
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
  if (mfa.current !== 'aal2') return <NeedMfa what="Admin" />

  return (
    <div className="space-y-8">
      <PageTitle title="Admin" sub={user.staffRole === 'owner' ? 'Super admin: numbers, sign-ups, parent confirmations, team, the activity log and data imports.' : 'Numbers, sign-ups, parent confirmations, the activity log and data imports.'} />

      <StatsPanel />

      <ConfirmDialog
        open={!!target}
        title={target?.disabled ? 'Reactivate this account?' : 'Disable this account?'}
        text={target ? `${target.fullName} (${target.email}). ${target.disabled ? 'They will be able to sign in again.' : 'They will be signed out and blocked. Records are kept.'}` : ''}
        confirmLabel={target?.disabled ? 'Reactivate' : 'Disable'}
        onConfirm={toggle}
        onCancel={() => setTarget(null)}
      />
      <SignupsSection users={users} canDisable onToggle={setTarget} err={err} />

      <ParentsSection pending={pending} canAccept reload={load} />

      {user.staffRole === 'owner' && <TeamSection />}

      <ActivityLog log={log} users={users} />

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Spreadsheet import (CSV)</h2>
        <p className="text-sm text-neutral-600">Import schools first, then programs so they link to the right school. Export your Excel sheet as CSV.</p>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">{SHEETS.map((s) => <Importer key={s.kind} sheet={s} />)}</div>
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
