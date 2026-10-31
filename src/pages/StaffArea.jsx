import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { clearCatalogCache } from '../hooks/useCatalog'
import { listUsers, importCatalog, deleteDemoData, setAccountDisabled, listAuditLog, importPlans, listPendingParents } from '../lib/api'
import { parseCsv, rowsToSchools, rowsToPrograms, rowsToScholarships } from '../lib/csv'
import { ConfirmDialog, PageTitle, Spinner } from '../components/ui'
import { ActivityLog, ActivityPage, ArchivePage, NeedMfa, ParentsSection, SignupsSection, StatsPanel, TeamSection } from '../components/StaffParts'

const SHEETS = [
  { kind: 'schools', label: 'Schools sheet', cols: 'school_name, country, type, category, city, website, logo_url (optional, a picture address or a path like /logos/ug.png), verified' },
  { kind: 'programs', label: 'Programs sheet', cols: 'school_name, program_name, level, field, fees_usd, duration_years, min_core_maths, min_core_english, min_core_science, required_electives, cutoff_aggregate, cutoff_year, sat_low, sat_high, english_test_waiver, foundation_available, verified. International extras (all optional): sat_policy (required, optional or not_considered), min_wassce_grade (for example C5), min_ielts, min_toefl, min_duolingo, intl_source_url, entry_note' },
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
      clearCatalogCache()
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


function DataSection() {
  return (
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
  )
}

function Overview({ base, isAdmin, users, pending, log, canSeeAll, canRate }) {
  return (
    <div className="space-y-8">
      {isAdmin ? <StatsPanel canRate={canRate} /> : (
        <div className="grid grid-cols-2 gap-3">
          <Link to={`${base}/people`} className="card !p-4"><p className="text-2xl font-bold">{users.length}</p><p className="text-sm text-neutral-600">People</p></Link>
          <Link to={`${base}/parents`} className="card !p-4"><p className="text-2xl font-bold">{pending.length}</p><p className="text-sm text-neutral-600">Waiting for a parent</p></Link>
        </div>
      )}
      <ActivityLog log={log} users={users} canSeeAll={canSeeAll} allLink={`${base}/activity`} />
    </div>
  )
}

// One shell for both staff areas. base is /admin or /support. Each section is its own page so nothing becomes one long page.
export default function StaffArea({ base }) {
  const { user, loading, mfa } = useAuth()
  const isAdminArea = base === '/admin'
  const [users, setUsers] = useState([])
  const [target, setTarget] = useState(null) // account waiting to be disabled or reactivated
  const [err, setErr] = useState('')
  const [log, setLog] = useState([])
  const [pending, setPending] = useState([])
  const allowed = !!user && (isAdminArea ? user.role === 'admin' : ['support', 'admin'].includes(user.role))
  const ready = allowed && mfa.current === 'aal2'
  const load = () => Promise.all([listUsers().then(setUsers), listAuditLog(1000).then(setLog).catch(() => {}), listPendingParents().then(setPending).catch(() => {})])
  useEffect(() => { if (ready) load() }, [ready])
  const toggle = async () => {
    try {
      await setAccountDisabled(target.id, !target.disabled)
      setTarget(null)
      await load()
    } catch (e) { setTarget(null); setErr(e.message) }
  }

  const label = isAdminArea ? 'Admin' : 'Support'
  if (loading) return <Spinner />
  if (!user) {
    return (
      <div className="max-w-xl card space-y-3">
        <h1 className="text-xl font-bold">{label} staff only</h1>
        <p>Sign in with your staff account to continue.</p>
        <Link to="/login" className="btn btn-orange">Sign in</Link>
      </div>
    )
  }
  if (!allowed) return <div className="max-w-xl card"><h1 className="text-xl font-bold">{label} staff only</h1><p className="mt-2">This account does not have access to this page.</p></div>
  if (mfa.current !== 'aal2') return <NeedMfa what={label} />

  const owner = user.staffRole === 'owner'
  const tabs = [
    { to: base, label: 'Overview', end: true },
    { to: `${base}/people`, label: 'People' },
    { to: `${base}/parents`, label: `Parents${pending.length ? ` (${pending.length})` : ''}` },
    ...(owner && isAdminArea ? [{ to: `${base}/team`, label: 'Team' }] : []),
    { to: `${base}/activity`, label: 'Activity' },
    ...(owner && isAdminArea ? [{ to: `${base}/archive`, label: 'Archive' }] : []),
    ...(isAdminArea ? [{ to: `${base}/data`, label: 'Data' }] : []),
  ]
  const sub = isAdminArea
    ? (owner ? 'Super admin: numbers, people, parent confirmations, team, activity and data.' : 'Numbers, people, parent confirmations, activity and data.')
    : 'People, parents waiting for a link and your activity.'
  const canSeeAll = isAdminArea

  return (
    <div className="space-y-6">
      <PageTitle title={label} sub={sub} />
      <nav aria-label={`${label} sections`} className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `inline-flex items-center min-h-11 px-4 rounded-full border-2 whitespace-nowrap text-sm font-semibold ${isActive ? 'bg-brand-orange border-brand-orange' : 'bg-white border-neutral-200 hover:border-brand-green'}`}>
            {t.label}
          </NavLink>
        ))}
      </nav>
      <ConfirmDialog
        open={!!target}
        title={target?.disabled ? 'Reactivate this account?' : 'Disable this account?'}
        text={target ? `${target.fullName} (${target.email}). ${target.disabled ? 'They will be able to sign in again.' : 'They will be signed out and blocked. Records are kept.'}` : ''}
        confirmLabel={target?.disabled ? 'Reactivate' : 'Disable'}
        onConfirm={toggle}
        onCancel={() => setTarget(null)}
      />
      <Routes>
        <Route index element={<Overview base={base} isAdmin={isAdminArea} users={users} pending={pending} log={log} canSeeAll={canSeeAll} canRate={owner && isAdminArea} />} />
        <Route path="people" element={<SignupsSection users={users} canDisable={isAdminArea} onToggle={isAdminArea ? setTarget : () => {}} err={err} reload={load} canEditStaff={isAdminArea} canDelete={owner && isAdminArea} canPlan={owner && isAdminArea} />} />
        <Route path="parents" element={<ParentsSection pending={pending} canAccept={isAdminArea} reload={load} />} />
        {owner && isAdminArea && <Route path="team" element={<TeamSection />} />}
        {owner && isAdminArea && <Route path="archive" element={<ArchivePage />} />}
        <Route path="activity" element={<ActivityPage log={log} users={users} canSeeAll={canSeeAll} />} />
        {isAdminArea && <Route path="data" element={<DataSection />} />}
        <Route path="*" element={<p>Page not found. <Link className="underline" to={base}>Back to {label}</Link></p>} />
      </Routes>
    </div>
  )
}
