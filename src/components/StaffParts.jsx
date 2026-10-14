// Pieces shared by the Admin page and the Support page.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { acceptParent, createParentLink, getAdminStats, listStaff, setStaffRole } from '../lib/api'
import { Badge, ConfirmDialog, Field } from './ui'

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
      <figcaption className="font-semibold">New sign-ups, last 30 days ({total})</figcaption>
      <svg viewBox={`0 0 ${w} ${h + 18}`} className="w-full h-auto" role="img" aria-label={`New sign-ups per day for the last 30 days. Total ${total}. Busiest day had ${max}.`}>
        <line x1="0" x2={w} y1={h} y2={h} stroke="currentColor" opacity="0.25" />
        {daily.map((d, i) => {
          const bh = (d.n / max) * (h - 12)
          return (
            <g key={d.day}>
              <title>{`${d.day}: ${d.n}`}</title>
              <rect x={pad + i * bw + 1} y={h - bh} width={Math.max(bw - 2, 1)} height={bh} rx="2" fill="#5E9E4E" />
            </g>
          )
        })}
        <text x="0" y={h + 14} fontSize="11" fill="currentColor" opacity="0.7">{daily[0]?.day}</text>
        <text x={w} y={h + 14} fontSize="11" textAnchor="end" fill="currentColor" opacity="0.7">{daily[daily.length - 1]?.day}</text>
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

// ---------- Sign-ups ----------
export function SignupsSection({ users, canDisable, onToggle, err }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">Sign-ups ({users.length})</h2>
      <p className="text-sm text-neutral-600">
        {canDisable ? 'Accounts are never deleted. Disabling blocks sign-in and keeps every record.' : 'You can see who has signed up. Only admins can disable accounts.'}
      </p>
      {err && <p className="text-red-700 text-sm" role="alert">{err}</p>}
      <ul className="md:hidden space-y-3" aria-label="Sign-ups">
        {users.map((u) => {
          const { subbed, trial, label } = accessLabel(u)
          return (
            <li key={u.id} className="card space-y-1 text-sm">
              <p className="font-semibold break-words">{u.fullName}{u.isMinor && ' (under 18)'}</p>
              <p className="break-all">{u.email}</p>
              <p>{u.phone}</p>
              <p className="flex flex-wrap items-center gap-2">
                <Badge tone={subbed || trial ? 'green' : 'orange'}>{label}</Badge>
                {u.disabled && <Badge tone="orange">Disabled</Badge>}
                <span className="text-neutral-600">{u.profileComplete ? 'Profile complete' : 'Profile incomplete'}</span>
              </p>
              {canDisable && <button className="btn btn-outline w-full" onClick={() => onToggle(u)}>{u.disabled ? 'Reactivate account' : 'Disable account'}</button>}
            </li>
          )
        })}
        {users.length === 0 && <li className="card text-sm text-neutral-500">No sign-ups yet.</li>}
      </ul>
      <div className="hidden md:block overflow-x-auto card !p-0">
        <table className="w-full text-sm">
          <thead className="text-left bg-neutral-50">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Access</th><th className="p-3">Profile</th>{canDisable && <th className="p-3">Account</th>}</tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const { subbed, trial, label } = accessLabel(u)
              return (
                <tr key={u.id} className="border-t border-neutral-200">
                  <td className="p-3">{u.fullName}{u.isMinor && ' (under 18)'}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phone}</td>
                  <td className="p-3"><Badge tone={subbed || trial ? 'green' : 'orange'}>{label}</Badge></td>
                  <td className="p-3">{u.profileComplete ? 'Complete' : 'Incomplete'}</td>
                  {canDisable && (
                    <td className="p-3 whitespace-nowrap">
                      {u.disabled && <Badge tone="orange">Disabled</Badge>}{' '}
                      <button className="btn btn-outline !min-h-11 !py-1" onClick={() => onToggle(u)}>{u.disabled ? 'Reactivate account' : 'Disable account'}</button>
                    </td>
                  )}
                </tr>
              )
            })}
            {users.length === 0 && <tr><td className="p-3 text-neutral-500" colSpan={canDisable ? 6 : 5}>No sign-ups yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ---------- Waiting for a parent or guardian ----------
// Support: create link and send link. Admins and super admins also get Accept.
export function ParentsSection({ pending, canAccept, reload }) {
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

  const message = link ? `Hello ${link.parent || ''}. ${link.name} signed up on SchoolMatch and needs a parent or guardian to confirm. Please open this link once to confirm. It expires in 7 days: ${link.url}` : ''
  const mail = link
    ? `mailto:${link.email}?subject=${encodeURIComponent('Please confirm your child\'s SchoolMatch account')}&body=${encodeURIComponent(message)}`
    : ''

  const Buttons = ({ x, full }) => (
    <div className={`flex flex-wrap gap-2 ${full ? '' : 'justify-start'}`}>
      <button className={`btn btn-orange !min-h-11 !py-1 ${full ? 'flex-1' : ''}`} onClick={() => makeLink(x)}>Create link</button>
      {canAccept && <button className={`btn btn-green !min-h-11 !py-1 ${full ? 'flex-1' : ''}`} onClick={() => setAcceptTarget(x)}>Accept</button>}
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
                <td className="p-3">{x.studentName}</td>
                <td className="p-3">{x.parentName}</td>
                <td className="p-3">{x.parentPhone}</td>
                <td className="p-3">{x.parentEmail}{x.parentEmail && x.parentEmail.toLowerCase() === x.studentEmail.toLowerCase() ? ' (same as student)' : ''}</td>
                <td className="p-3 whitespace-nowrap"><Buttons x={x} /></td>
              </tr>
            ))}
            {pending.length === 0 && <tr><td className="p-3 text-neutral-500" colSpan={5}>No one is waiting.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ---------- Activity log ----------
export function ActivityLog({ log: all, users, canSeeAll = true }) {
  const [showAll, setShowAll] = useState(false)
  const log = showAll ? all : all.slice(0, 3)
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
      {all.length > 3 && (
        <button className="btn btn-outline" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show fewer' : `See all activities (${all.length})`}</button>
      )}
    </section>
  )
}

// ---------- Team (super admin only) ----------
const ROLE_LABEL = { owner: 'Super admin', admin: 'Admin', support: 'Support' }

export function TeamSection() {
  const [team, setTeam] = useState([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('support')
  const [msg, setMsg] = useState({ ok: '', err: '' })
  const [removeTarget, setRemoveTarget] = useState(null)
  const load = () => listStaff().then(setTeam).catch((e) => setMsg({ ok: '', err: e.message }))
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    setMsg({ ok: '', err: '' })
    try {
      await setStaffRole(email, role)
      setMsg({ ok: `${email} is now ${ROLE_LABEL[role]}. They must sign out and in again, and turn on two-step verification.`, err: '' })
      setEmail('')
      load()
    } catch (err) { setMsg({ ok: '', err: err.message }) }
  }
  const remove = async () => {
    const t = removeTarget
    setRemoveTarget(null)
    try { await setStaffRole(t.email, 'none'); load() } catch (err) { setMsg({ ok: '', err: err.message }) }
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">Team</h2>
      <p className="text-sm text-neutral-600">
        Only super admins can add or remove staff. Admin: manages sign-ups, parent confirmations and data. Support: can see sign-ups and parents waiting, and create and send links. Neither can change roles.
        The person must already have an account on the site.
      </p>
      <ConfirmDialog
        open={!!removeTarget}
        title="Remove this person from the team?"
        text={removeTarget ? `${removeTarget.email} will become a normal student account again.` : ''}
        confirmLabel="Remove"
        onConfirm={remove}
        onCancel={() => setRemoveTarget(null)}
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
              {m.role !== 'owner' && <button className="btn btn-outline !min-h-11 !py-1" onClick={() => setRemoveTarget(m)}>Remove</button>}
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={save} className="card space-y-3 max-w-xl">
        <h3 className="font-bold">Add or change a team member</h3>
        <Field label="Their email"><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Role">
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="support">Support</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        {msg.err && <p className="text-red-700 text-sm" role="alert">{msg.err}</p>}
        {msg.ok && <p className="text-sm font-semibold text-green-800" role="status">{msg.ok}</p>}
        <button className="btn btn-orange">Save role</button>
      </form>
    </section>
  )
}
