// Pieces shared by the Admin page and the Support page.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { activateAccount, acceptParent, createParentLink, cancelInvite, deleteAccount, listArchive, getAdminStats, inviteStaff, listInvites, listStaff, setStaffRole, staffCreateStudent, staffUpdateProfile } from '../lib/api'
import { Badge, ConfirmDialog, Field, Spinner } from './ui'

const ROLE_LABEL = { owner: 'Super admin', admin: 'Admin', support: 'Support' }

export function accessLabel(u) {
  const now = Date.now()
  const subbed = u.subscription?.status === 'active' && new Date(u.subscription.expiresAt).getTime() > now
  const trial = u.trialEndsAt && new Date(u.trialEndsAt).getTime() > now
  return { subbed, trial, label: subbed ? 'Subscriber' : trial ? 'Trial' : u.trialEndsAt ? 'Expired' : 'No trial' }
}

// Shown to staff who have not finished the authenticator step.
export function NeedMfa({ what }) {
  return (
    <div className="max-w-xl card space-y-3">
      <h1 className="text-xl font-bold">Two-step verification needed</h1>
      <p>The {what} page needs a code from your authenticator app. Turn it on in <Link to="/settings" className="underline">Settings</Link>, then sign out and sign in again and enter your code.</p>
    </div>
  )
}

// ---------- Numbers and chart ----------
function DailyChart({ daily }) {
  const max = Math.max(1, ...daily.map((d) => d.n))
  const w = 600, h = 140, pad = 4
  const bw = (w - pad * 2) / daily.length
  const total = daily.reduce((s, d) => s + d.n, 0)
  return (
    <figure className="card space-y-2 min-w-0">
      <figcaption className="font-semibold">New sign-ups per day, last 30 days (total {total}, busiest day {max})</figcaption>
      <svg viewBox={`0 0 ${w} ${h + 18}`} className="w-full h-auto" role="img" aria-label={`New sign-ups per day for the last 30 days. Total ${total}. Busiest day had ${max}.`}>
        <line x1="0" x2={w} y1={h} y2={h} stroke="currentColor" opacity="0.25" />
        {daily.map((d, i) => {
          const bh = (d.n / max) * (h - 12)
          return (
            <g key={d.day}>
              <title>{`${d.day}: ${d.n}`}</title>
              <rect x={pad + i * bw + 1} y={h - bh} width={Math.max(bw - 2, 1)} height={bh} rx="2" fill="#5E9E4E" />
              {d.n > 0 && <text x={pad + i * bw + bw / 2} y={h - bh - 3} fontSize="11" fontWeight="600" textAnchor="middle" fill="currentColor">{d.n}</text>}
              {i % 5 === 0 && i !== 0 && i !== daily.length - 1 && <text x={pad + i * bw + bw / 2} y={h + 14} fontSize="10" textAnchor="middle" fill="currentColor" opacity="0.6">{String(d.day).slice(5)}</text>}
            </g>
          )
        })}
        <text x="0" y={h + 14} fontSize="10" fill="currentColor" opacity="0.7">{String(daily[0]?.day || '').slice(5)}</text>
        <text x={w} y={h + 14} fontSize="10" textAnchor="end" fill="currentColor" opacity="0.7">{String(daily[daily.length - 1]?.day || '').slice(5)}</text>
      </svg>
    </figure>
  )
}

export function StatsPanel() {
  const [s, setS] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { getAdminStats().then(setS).catch((e) => setErr(e.message)) }, [])
  if (err) return <p className="text-red-700 text-sm" role="alert">{err}</p>
  if (!s) return <p className="text-sm text-neutral-600">Loading numbers...</p>
  const tiles = [
    ['Users', s.total], ['On free trial', s.onTrial], ['Subscribers', s.subscribers],
    ['Under 18', s.minors], ['Waiting for a parent', s.waitingParent],
  ]
  return (
    <section className="space-y-3" aria-label="Numbers">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tiles.map(([label, n]) => (
          <div key={label} className="card !p-4">
            <p className="text-2xl font-bold">{n}</p>
            <p className="text-sm text-neutral-600">{label}</p>
          </div>
        ))}
      </div>
      <DailyChart daily={s.daily} />
    </section>
  )
}

// ---------- Paging ----------
export const PAGE_SIZE = 25
export function Pager({ page, total, size = PAGE_SIZE, onPage }) {
  const pages = Math.max(1, Math.ceil(total / size))
  if (pages <= 1) return null
  return (
    <nav className="flex items-center justify-between gap-3 text-sm" aria-label="Pages">
      <button className="btn btn-outline !min-h-11" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
      <span>Page {page} of {pages}</span>
      <button className="btn btn-outline !min-h-11" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </nav>
  )
}

// ---------- Sign-ups ----------
function AddStudent({ onDone }) {
  const empty = { fullName: '', phone: '', email: '', dateOfBirth: '', gender: '', parentName: '', parentPhone: '', parentEmail: '' }
  const [open, setOpen] = useState(false)
  const [f, setF] = useState(empty)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [made, setMade] = useState(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const minor = f.dateOfBirth && new Date(f.dateOfBirth) > new Date(new Date().setFullYear(new Date().getFullYear() - 18))
  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      setMade(await staffCreateStudent(f))
      setF(empty)
      onDone()
    } catch (x) { setErr(x.message) }
    setBusy(false)
  }
  if (!open) return <button className="btn btn-outline" onClick={() => setOpen(true)}>Add student</button>
  return (
    <div className="card space-y-3 max-w-xl">
      <h3 className="font-bold">Create an account for a student</h3>
      <p className="text-sm text-neutral-600">Use this only to help a student who cannot sign up themselves. The account gets a temporary password that is shown once. It does not include a subscription.</p>
      {made ? (
        <div className="space-y-2 text-sm" role="status">
          <p className="font-semibold">Account created. Give these to the student and ask them to change the password in Settings.</p>
          <p>Email: <span className="break-all font-mono">{made.email}</span></p>
          <p>Temporary password: <span className="font-mono">{made.password}</span></p>
          <p className="text-neutral-600">This password is not shown again.</p>
          <button className="btn btn-outline" onClick={() => { setMade(null); setOpen(false) }}>Done</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <Field label="Full name"><input className="input" value={f.fullName} onChange={set('fullName')} required /></Field>
          <Field label="Email"><input className="input" type="email" value={f.email} onChange={set('email')} required /></Field>
          <Field label="Phone"><input className="input" type="tel" value={f.phone} onChange={set('phone')} required /></Field>
          <Field label="Date of birth"><input className="input" type="date" value={f.dateOfBirth} onChange={set('dateOfBirth')} required /></Field>
          <Field label="Gender">
            <select className="input" value={f.gender} onChange={set('gender')} required>
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </Field>
          {minor && (
            <>
              <p className="text-sm text-neutral-600">Under 18: a parent or guardian must confirm before this student gets full access.</p>
              <Field label="Parent or guardian name"><input className="input" value={f.parentName} onChange={set('parentName')} required /></Field>
              <Field label="Parent or guardian phone"><input className="input" type="tel" value={f.parentPhone} onChange={set('parentPhone')} /></Field>
              <Field label="Parent or guardian email"><input className="input" type="email" value={f.parentEmail} onChange={set('parentEmail')} required /></Field>
            </>
          )}
          {err && <p className="text-red-700 text-sm" role="alert">{err}</p>}
          <div className="flex gap-3">
            <button className="btn btn-orange" disabled={busy}>{busy ? 'Creating...' : 'Create account'}</button>
            <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}

function EditStudent({ u, onClose, onSaved }) {
  const [name, setName] = useState(u.fullName || '')
  const [phone, setPhone] = useState(u.phone || '')
  const [err, setErr] = useState('')
  const save = async (e) => {
    e.preventDefault()
    setErr('')
    try { await staffUpdateProfile(u.id, name, phone); onSaved() } catch (x) { setErr(x.message) }
  }
  return (
    <form onSubmit={save} className="card space-y-3 max-w-xl" aria-label="Edit student">
      <h3 className="font-bold">Edit {u.email}</h3>
      <Field label="Full name"><input className="input" value={name} onChange={(e) => setName(e.target.value)} required /></Field>
      <Field label="Phone"><input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required /></Field>
      {err && <p className="text-red-700 text-sm" role="alert">{err}</p>}
      <div className="flex gap-3">
        <button className="btn btn-orange">Save</button>
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
      </div>
    </form>
  )
}

export function SignupsSection({ users: allUsers, canDisable, onToggle, err, reload, canEditStaff, canDelete }) {
  const [editing, setEditing] = useState(null)
  const [actTarget, setActTarget] = useState(null)
  const [actErr, setActErr] = useState('')
  const runActivate = async () => {
    const t = actTarget
    setActTarget(null)
    setActErr('')
    try { await activateAccount(t.id); reload && reload() } catch (e) { setActErr(e.message) }
  }
  // Someone who never confirmed their email cannot sign in, so they are not "Active". Staff can activate them.
  const canActivate = (u) => !!reload && u.unconfirmed && !u.staffRole
  const accountBadge = (u) => (u.unconfirmed
    ? <Badge tone="orange">Unconfirmed</Badge>
    : <Badge tone={u.disabled ? 'orange' : 'green'}>{u.disabled ? 'Inactive' : 'Active'}</Badge>)
  const [delTarget, setDelTarget] = useState(null)
  const [delErr, setDelErr] = useState('')
  const runDelete = async () => {
    const t = delTarget
    setDelTarget(null)
    setDelErr('')
    try { await deleteAccount(t.id); reload && reload() } catch (e) { setDelErr(e.message) }
  }
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const found = needle ? allUsers.filter((u) => `${u.fullName || ''} ${u.email || ''}`.toLowerCase().includes(needle)) : allUsers
  const [page, setPage] = useState(1)
  useEffect(() => { setPage(1) }, [needle])
  const users = found.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const canEdit = (u) => !!reload && (!u.staffRole || canEditStaff)
  const canToggle = (u) => canDisable && !u.staffRole
  const canRemove = (u) => canDelete && u.staffRole !== 'owner'
  const done = () => { setEditing(null); reload && reload() }
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">People ({found.length}{needle ? ` of ${allUsers.length}` : ''})</h2>
      <p className="text-sm text-neutral-600">
        {canDelete ? 'Disabling blocks sign-in and keeps the account. Deleting removes it for good from the site; a private copy is kept in the archive.' : canDisable ? 'Disabling blocks sign-in and keeps the account.' : 'You can see, add and edit students. Only admins can disable accounts.'}
      </p>
      {(err || delErr || actErr) && <p className="text-red-700 text-sm" role="alert">{err || delErr || actErr}</p>}
      <ConfirmDialog
        open={!!actTarget}
        title="Activate this account?"
        text={actTarget ? `${actTarget.fullName} (${actTarget.email}) has not confirmed their email. Activating confirms it for them so they can sign in with the password they chose. Only do this if you know the email address belongs to them.` : ''}
        confirmLabel="Activate"
        onConfirm={runActivate}
        onCancel={() => setActTarget(null)}
      />
      <ConfirmDialog
        open={!!delTarget}
        title="Delete this account?"
        text={delTarget ? `${delTarget.fullName} (${delTarget.email}) will be removed from the site and signed out. If they sign up again with the same details they start fresh with a new account. A private copy is kept in the archive.` : ''}
        confirmLabel="Delete"
        onConfirm={runDelete}
        onCancel={() => setDelTarget(null)}
      />
      <input className="input max-w-xl" type="search" placeholder="Search students and staff by name or email" aria-label="Search people" value={q} onChange={(e) => setQ(e.target.value)} />
      {reload && <AddStudent onDone={done} />}
      {editing && <EditStudent u={editing} onClose={() => setEditing(null)} onSaved={done} />}
      <ul className="md:hidden space-y-3" aria-label="Sign-ups">
        {users.map((u) => {
          const { subbed, trial, label } = accessLabel(u)
          return (
            <li key={u.id} className="card space-y-1 text-sm">
              <p className="font-semibold break-words">{u.fullName}{u.isMinor && ' (under 18)'} {u.staffRole && <Badge tone="green">{ROLE_LABEL[u.staffRole]}</Badge>}</p>
              <p className="break-all">{u.email}</p>
              <p>{u.phone}</p>
              <p className="flex flex-wrap items-center gap-2">
                <Badge tone={subbed || trial ? 'green' : 'orange'}>{label}</Badge>
                {accountBadge(u)}
                <span className="text-neutral-600">{u.profileComplete ? 'Profile complete' : 'Profile incomplete'}</span>
              </p>
              {canEdit(u) && <button className="btn btn-outline w-full" onClick={() => setEditing(u)}>Edit details</button>}
              {canActivate(u) && <button className="btn btn-outline w-full" onClick={() => setActTarget(u)}>Activate account</button>}
              {canToggle(u) && !u.unconfirmed && <button className="btn btn-outline w-full" onClick={() => onToggle(u)}>{u.disabled ? 'Reactivate account' : 'Disable account'}</button>}
              {canRemove(u) && <button className="btn btn-outline w-full !border-red-300 text-red-700" onClick={() => setDelTarget(u)}>Delete account</button>}
            </li>
          )
        })}
        {users.length === 0 && <li className="card text-sm text-neutral-500">No one found.</li>}
      </ul>
      <div className="hidden md:block overflow-x-auto card !p-0">
        <table className="w-full text-sm">
          <thead className="text-left bg-neutral-50">
            <tr><th className="p-3 min-w-[12rem]">Name</th><th className="p-3 min-w-[14rem]">Email</th><th className="p-3 whitespace-nowrap">Phone</th><th className="p-3">Access</th><th className="p-3">Profile</th><th className="p-3">Account</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const { subbed, trial, label } = accessLabel(u)
              return (
                <tr key={u.id} className="border-t border-neutral-200">
                  <td className="p-3 align-top">
                    <p className="font-semibold break-words">{u.fullName}{u.isMinor && ' (under 18)'}</p>
                    {u.staffRole && <div className="mt-1"><Badge tone="green">{ROLE_LABEL[u.staffRole]}</Badge></div>}
                  </td>
                  <td className="p-3 align-top break-all">{u.email}</td>
                  <td className="p-3 align-top whitespace-nowrap">{u.phone}</td>
                  <td className="p-3"><Badge tone={subbed || trial ? 'green' : 'orange'}>{label}</Badge></td>
                  <td className="p-3">{u.profileComplete ? 'Complete' : 'Incomplete'}</td>
                  <td className="p-3">{accountBadge(u)}</td>
                  <td className="p-3"><div className="grid grid-cols-2 gap-2 w-[15rem]">
                    {canEdit(u) && <button className="btn btn-outline !min-h-11 !py-1" onClick={() => setEditing(u)}>Edit</button>}
                    {canActivate(u) && <button className="btn btn-outline !min-h-11 !py-1" onClick={() => setActTarget(u)}>Activate</button>}
                    {canToggle(u) && !u.unconfirmed && <button className="btn btn-outline !min-h-11 !py-1" onClick={() => onToggle(u)}>{u.disabled ? 'Reactivate' : 'Disable'}</button>}
                    {canRemove(u) && <button className="btn btn-outline !min-h-11 !py-1 !border-red-300 text-red-700" onClick={() => setDelTarget(u)}>Delete</button>}
                  </div></td>
                </tr>
              )
            })}
            {users.length === 0 && <tr><td className="p-3 text-neutral-500" colSpan={7}>No one found.</td></tr>}
          </tbody>
        </table>
      </div>
      <Pager page={page} total={found.length} onPage={setPage} />
    </section>
  )
}

// ---------- Waiting for a parent or guardian ----------
// Support: create link and send link. Admins and super admins also get Accept.
export function ParentsSection({ pending: allPending, canAccept, reload }) {
  const [pg, setPg] = useState(1)
  const pending = allPending.slice((pg - 1) * PAGE_SIZE, pg * PAGE_SIZE)
  const [link, setLink] = useState(null) // { name, url, phone, email }
  const [err, setErr] = useState('')
  const [acceptTarget, setAcceptTarget] = useState(null)

  const makeLink = async (x) => {
    setErr('')
    try {
      const url = await createParentLink(x.studentId)
      setLink({ name: x.studentName, parent: x.parentName, url, phone: x.parentPhone, email: x.parentEmail })
      reload()
    } catch (e) { setErr(e.message) }
  }
  const accept = async () => {
    const t = acceptTarget
    setAcceptTarget(null)
    try { await acceptParent(t.studentId); reload() } catch (e) { setErr(e.message) }
  }

  const message = link ? `Hello ${link.parent || ''}. ${link.name} signed up on WEMK and needs a parent or guardian to confirm. Please open this link once to confirm. It expires in 7 days: ${link.url}` : ''
  const mail = link
    ? `mailto:${link.email}?subject=${encodeURIComponent('Please confirm your child\'s WEMK account')}&body=${encodeURIComponent(message)}`
    : ''

  const Buttons = ({ x, full }) => (
    <div className={`flex flex-wrap gap-2 ${full ? '' : 'justify-start'}`}>
      <button className={`btn btn-orange !min-h-11 !py-1 ${full ? 'flex-1' : '!w-32'}`} onClick={() => makeLink(x)}>Create link</button>
      {canAccept && <button className={`btn btn-green !min-h-11 !py-1 ${full ? 'flex-1' : '!w-32'}`} onClick={() => setAcceptTarget(x)}>Accept</button>}
    </div>
  )

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">Waiting for a parent or guardian ({pending.length})</h2>
      <p className="text-sm text-neutral-600">
        Phone the parent on the number below and make sure you are speaking to them. Press Create link, then Send link to email it to that parent only. It works once and expires in 7 days.
        Creating a new link cancels the old one, so you can make another if the parent says it did not arrive. Every link is recorded in the activity log.
        {canAccept && ' Accept opens the student\'s account right away. Use it only after you have spoken to the parent.'}
      </p>
      {err && <p className="text-red-700 text-sm" role="alert">{err}</p>}
      <ConfirmDialog
        open={!!acceptTarget}
        title="Accept this confirmation?"
        text={acceptTarget ? `${acceptTarget.studentName} will get full access now. Only do this after you have spoken to ${acceptTarget.parentName || 'the parent'} on ${acceptTarget.parentPhone || 'their phone'}. This is recorded in the activity log.` : ''}
        confirmLabel="Accept"
        onConfirm={accept}
        onCancel={() => setAcceptTarget(null)}
      />
      {link && (
        <div className="card space-y-3 border-brand-green" role="status">
          <p className="font-semibold">Link for the parent of {link.name}</p>
          <input className="input text-xs" readOnly value={link.url} onFocus={(e) => e.target.select()} aria-label="Confirmation link" />
          <div className="flex flex-wrap gap-2">
            {link.email
              ? <a className="btn btn-orange !min-h-11 !py-1" href={mail}>Send link</a>
              : <p className="text-sm text-red-700">No parent email on file, so the link cannot be sent. Copy it from the box above.</p>}
            <button className="btn btn-outline !min-h-11 !py-1" onClick={() => setLink(null)}>Hide</button>
          </div>
          <p className="text-xs text-neutral-600">Send link opens your email app with the message to the parent ready. Press send there. The site cannot send the email by itself until we connect our own email service. This link is shown only now. Do not post it anywhere public.</p>
        </div>
      )}
      <ul className="md:hidden space-y-3" aria-label="Waiting for a parent or guardian">
        {pending.map((x) => (
          <li key={x.studentId} className="card space-y-2 text-sm">
            <p className="font-semibold break-words">{x.studentName}</p>
            <p>Parent: {x.parentName}</p>
            <p>Phone: <a className="underline inline-block py-2" href={`tel:${x.parentPhone}`}>{x.parentPhone}</a></p>
            <p className="break-all">Email: {x.parentEmail}{x.parentEmail && x.parentEmail.toLowerCase() === x.studentEmail.toLowerCase() ? ' (same as student)' : ''}</p>
            <Buttons x={x} full />
          </li>
        ))}
        {pending.length === 0 && <li className="card text-sm text-neutral-500">No one is waiting.</li>}
      </ul>
      <div className="hidden md:block overflow-x-auto card !p-0">
        <table className="w-full text-sm">
          <thead className="text-left bg-neutral-50"><tr><th className="p-3">Student</th><th className="p-3">Parent or guardian</th><th className="p-3">Parent phone</th><th className="p-3">Parent email</th><th className="p-3"></th></tr></thead>
          <tbody>
            {pending.map((x) => (
              <tr key={x.studentId} className="border-t border-neutral-200">
                <td className="p-3 align-top font-semibold break-words min-w-[10rem]">{x.studentName}</td>
                <td className="p-3 align-top break-words min-w-[10rem]">{x.parentName}</td>
                <td className="p-3">{x.parentPhone}</td>
                <td className="p-3">{x.parentEmail}{x.parentEmail && x.parentEmail.toLowerCase() === x.studentEmail.toLowerCase() ? ' (same as student)' : ''}</td>
                <td className="p-3 whitespace-nowrap"><Buttons x={x} /></td>
              </tr>
            ))}
            {pending.length === 0 && <tr><td className="p-3 text-neutral-500" colSpan={5}>No one is waiting.</td></tr>}
          </tbody>
        </table>
      </div>
      <Pager page={pg} total={allPending.length} onPage={setPg} />
    </section>
  )
}

// ---------- Activity log ----------
export function ActivityLog({ log: all, users, canSeeAll = true, allLink }) {
  const log = all.slice(0, 3)
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">Activity log</h2>
      <p className="text-sm text-neutral-600">{canSeeAll ? 'Staff actions and payments, newest first.' : 'Your own actions, newest first.'} It cannot be edited or deleted. It never holds passwords or card details.</p>
      <ul className="md:hidden space-y-2" aria-label="Activity log">
        {log.map((e) => {
          const who = users.find((u) => u.id === e.actor_id)
          const tgt = users.find((u) => u.id === e.target_user)
          return (
            <li key={e.id} className="card text-sm space-y-0.5">
              <p className="text-xs text-neutral-600">{new Date(e.at).toLocaleString()}</p>
              <p className="font-semibold">{e.action.replaceAll('_', ' ')}</p>
              <p className="break-all">By: {who?.email || (e.actor_id ? e.actor_id.slice(0, 8) : 'system')}{e.actor_role ? ` (${e.actor_role})` : ''}</p>
              {(tgt || e.target_user) && <p className="break-all">Account: {tgt?.email || e.target_user.slice(0, 8)}</p>}
            </li>
          )
        })}
        {log.length === 0 && <li className="card text-sm text-neutral-500">Nothing logged yet.</li>}
      </ul>
      <div className="hidden md:block overflow-x-auto card !p-0">
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
      {allLink && <Link to={allLink} className="btn btn-outline">See all activities</Link>}
    </section>
  )
}

// ---------- Activity page with filters ----------
export function ActivityPage({ log, users, canSeeAll }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [person, setPerson] = useState('')
  const [action, setAction] = useState('')
  const [page, setPage] = useState(1)
  const nameOf = (id) => users.find((u) => u.id === id)?.email || (id ? id.slice(0, 8) : 'system')
  const people = [...new Set(log.map((e) => e.actor_id || ''))]
  const actions = [...new Set(log.map((e) => e.action))].sort()
  const list = log.filter((e) => {
    const t = new Date(e.at).getTime()
    if (from && t < new Date(`${from}T00:00:00`).getTime()) return false
    if (to && t > new Date(`${to}T23:59:59.999`).getTime()) return false
    if (person && (e.actor_id || '') !== person) return false
    if (action && e.action !== action) return false
    return true
  })
  useEffect(() => { setPage(1) }, [from, to, person, action])
  const shown = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const clear = () => { setFrom(''); setTo(''); setPerson(''); setAction('') }
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">Activities ({list.length})</h2>
      <p className="text-sm text-neutral-600">{canSeeAll ? 'Staff actions and payments, newest first.' : 'Your own actions, newest first.'} It cannot be edited or deleted. It never holds passwords or card details.</p>
      <div className="card grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="From date"><input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
        <Field label="To date"><input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
        {canSeeAll && (
          <Field label="Person">
            <select className="input" value={person} onChange={(e) => setPerson(e.target.value)}>
              <option value="">Everyone</option>
              {people.map((id) => <option key={id || 'system'} value={id}>{nameOf(id)}</option>)}
            </select>
          </Field>
        )}
        <Field label="Activity">
          <select className="input" value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="">All activities</option>
            {actions.map((a) => <option key={a} value={a}>{a.replaceAll('_', ' ')}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2 lg:col-span-4"><button className="btn btn-outline !min-h-11" onClick={clear}>Clear filters</button></div>
      </div>
      <ul className="space-y-2" aria-label="Activities">
        {shown.map((e) => (
          <li key={e.id} className="card !p-4 text-sm grid gap-1 md:grid-cols-4 md:gap-3">
            <p className="text-neutral-600">{new Date(e.at).toLocaleString()}</p>
            <p className="break-all">{nameOf(e.actor_id)}{e.actor_role ? ` (${e.actor_role})` : ''}</p>
            <p className="font-semibold">{e.action.replaceAll('_', ' ')}</p>
            <p className="break-all">{e.target_user ? nameOf(e.target_user) : ''}</p>
          </li>
        ))}
        {shown.length === 0 && <li className="card text-sm text-neutral-500">Nothing matches these filters.</li>}
      </ul>
      <Pager page={page} total={list.length} onPage={setPage} />
    </section>
  )
}

// ---------- Archive of deleted accounts (super admin only) ----------
export function ArchivePage() {
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)
  const [page, setPage] = useState(1)
  useEffect(() => { listArchive().then(setRows).catch((e) => { setErr(e.message); setRows([]) }) }, [])
  useEffect(() => { setPage(1) }, [q])
  if (!rows) return <Spinner />
  const needle = q.trim().toLowerCase()
  const found = needle ? rows.filter((r) => `${r.fullName || ''} ${r.email || ''}`.toLowerCase().includes(needle)) : rows
  const shown = found.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">Archive ({found.length})</h2>
      <p className="text-sm text-neutral-600">Private copies of accounts that were deleted. These people are gone from the site; this is only a record. Only super admins can see it.</p>
      {err && <p className="text-red-700 text-sm" role="alert">{err}</p>}
      <input className="input max-w-xl" type="search" placeholder="Search by name or email" aria-label="Search the archive" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul className="space-y-2">
        {shown.map((r) => (
          <li key={r.id} className="card !p-4 text-sm space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold break-words">{r.fullName || '(no name)'} {r.staffRole && <Badge tone="green">{ROLE_LABEL[r.staffRole]}</Badge>}</p>
                <p className="break-all text-neutral-600">{r.email} {r.phone ? `| ${r.phone}` : ''}</p>
                <p className="text-neutral-600">Deleted {new Date(r.deletedAt).toLocaleString()}</p>
              </div>
              <button className="btn btn-outline !min-h-11 !py-1" onClick={() => setOpen(open === r.id ? null : r.id)}>{open === r.id ? 'Hide details' : 'View details'}</button>
            </div>
            {open === r.id && (
              <pre className="bg-neutral-50 rounded-xl p-3 overflow-x-auto text-xs whitespace-pre-wrap break-words">{JSON.stringify(r.snapshot, null, 2)}</pre>
            )}
          </li>
        ))}
        {shown.length === 0 && <li className="card text-sm text-neutral-500">Nothing in the archive.</li>}
      </ul>
      <Pager page={page} total={found.length} onPage={setPage} />
    </section>
  )
}

// ---------- Team (super admin only) ----------

export function TeamSection() {
  const [team, setTeam] = useState([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('support')
  const [msg, setMsg] = useState({ ok: '', err: '' })
  const [removeTarget, setRemoveTarget] = useState(null)
  const [invites, setInvites] = useState([])
  const load = () => Promise.all([
    listStaff().then(setTeam),
    listInvites().then(setInvites),
  ]).catch((e) => setMsg({ ok: '', err: e.message }))
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    setMsg({ ok: '', err: '' })
    try {
      const r = await inviteStaff(email, role)
      setMsg({ ok: r === 'invited'
        ? `${email} is invited as ${ROLE_LABEL[role]}. Tell them to sign up at ${window.location.origin}/signup with this email and confirm it. They choose their own name and password, then turn on two-step verification.`
        : `${email} already had an account and is now ${ROLE_LABEL[role]}. They must sign out and in again, and turn on two-step verification.`, err: '' })
      setEmail('')
      load()
    } catch (err) { setMsg({ ok: '', err: err.message }) }
  }
  const remove = async () => {
    const t = removeTarget
    setRemoveTarget(null)
    try { await setStaffRole(t.email, 'none'); load() } catch (err) { setMsg({ ok: '', err: err.message }) }
  }
  const [deleteTarget, setDeleteTarget] = useState(null)
  const del = async () => {
    const t = deleteTarget
    setDeleteTarget(null)
    try {
      await deleteAccount(t.userId)
      setMsg({ ok: `${t.email} was deleted. A private copy is in the Archive.`, err: '' })
      load()
    } catch (err) { setMsg({ ok: '', err: err.message }) }
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">Team</h2>
      <p className="text-sm text-neutral-600">
        Only super admins can add, remove or delete staff. Admin: manages sign-ups, parent confirmations and data. Support: can see sign-ups and parents waiting, and create and send links. Neither can change roles.
      </p>
      <ConfirmDialog
        open={!!removeTarget}
        title="Remove this person from the team?"
        text={removeTarget ? `${removeTarget.email} will become a normal student account again.` : ''}
        confirmLabel="Remove"
        onConfirm={remove}
        onCancel={() => setRemoveTarget(null)}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this staff account?"
        text={deleteTarget ? `${deleteTarget.email} will lose access and the account will be erased. This cannot be undone.` : ''}
        confirmLabel="Delete"
        onConfirm={del}
        onCancel={() => setDeleteTarget(null)}
      />
      <div className="card !p-4 space-y-2">
        <p className="font-semibold">Support team page</p>
        <p className="text-sm text-neutral-600">Give this link to your support staff. They sign in with their own account, finish two-step verification, and land on it.</p>
        <input className="input text-sm" readOnly value={`${window.location.origin}/support`} onFocus={(e) => e.target.select()} aria-label="Support page link" />
        <button className="btn btn-outline !min-h-11 !py-1" onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/support`)}>Copy link</button>
      </div>
      <ul className="space-y-2" aria-label="Team">
        {team.map((m) => (
          <li key={m.userId} className="card !p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="min-w-0">
              <p className="font-semibold break-words">{m.fullName || m.email}</p>
              <p className="break-all text-neutral-600">{m.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={m.role === 'owner' ? 'orange' : 'green'}>{ROLE_LABEL[m.role] || m.role}</Badge>
              {m.role !== 'owner' && <button className="btn btn-outline !min-h-11 !py-1" onClick={() => setRemoveTarget(m)}>Remove role</button>}
              {m.role !== 'owner' && <button className="btn btn-outline !min-h-11 !py-1" onClick={() => setDeleteTarget(m)}>Delete</button>}
            </div>
          </li>
        ))}
      </ul>
      {invites.length > 0 && (
        <div className="card !p-4 space-y-2">
          <p className="font-semibold">Invited, waiting to sign up ({invites.length})</p>
          <ul className="space-y-2">
            {invites.map((i) => (
              <li key={i.email} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="break-all">{i.email} <Badge tone="orange">{ROLE_LABEL[i.role]}</Badge></span>
                <button className="btn btn-outline !min-h-11 !py-1" onClick={async () => { try { await cancelInvite(i.email); load() } catch (e) { setMsg({ ok: '', err: e.message }) } }}>Cancel invite</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={save} className="card space-y-3 max-w-xl">
        <h3 className="font-bold">Add or change a team member</h3>
        <p className="text-sm text-neutral-600">Type their email. If they have no account yet, they are invited: they sign up on the normal sign-up page with this email, choose their own name and password, and get the role when their email is confirmed.</p>
        <Field label="Their email"><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Role">
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="support">Support</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        {msg.err && <p className="text-red-700 text-sm" role="alert">{msg.err}</p>}
        {msg.ok && <p className="text-sm font-semibold text-green-800" role="status">{msg.ok}</p>}
        <button className="btn btn-orange">Add or update</button>
      </form>
    </section>
  )
}
