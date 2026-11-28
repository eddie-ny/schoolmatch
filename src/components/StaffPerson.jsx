// D10. One person's own page in the staff area (people/:id). Data comes from admin_get_person (step219).
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { activateAccount, deleteAccount, getPerson, recordRefund, sendRefundEmail, setAccountDisabled, staffDocumentUrl } from '../lib/api'
import { Badge, ConfirmDialog, Field, Spinner } from './ui'
import { EditStudent, PlanPanel, ROLE_LABEL, accessLabel } from './StaffParts'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'plan', label: 'Plan and payments' },
  { id: 'profile', label: 'Profile and documents' },
  { id: 'saved', label: 'Saved' },
  { id: 'history', label: 'History' },
]
const day = (d) => (d ? new Date(d).toLocaleDateString() : '')
const when = (d) => (d ? new Date(d).toLocaleString() : '')
const money = (minor, cur = 'GHS') => (minor == null ? '' : `${cur} ${(minor / 100).toFixed(2)}`)
const PAY_STATUS = { success: 'Paid', pending: 'Not finished', failed: 'Failed', refunded: 'Refunded', partially_refunded: 'Part refunded' }

function Rows({ items }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-x-4 gap-y-2 text-sm">
      {items.map(([k, v]) => (<div key={k} className="contents"><dt className="text-neutral-600">{k}</dt><dd className="break-words">{v || v === 0 ? v : '-'}</dd></div>))}
    </dl>
  )
}

// Records a refund staff already made in the Paystack dashboard. Moves no money.
function RefundDialog({ pay, onClose, onDone }) {
  const [full, setFull] = useState(true)
  const [amount, setAmount] = useState((pay.amount_minor / 100).toFixed(2))
  const [reason, setReason] = useState('')
  const [ref, setRef] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const minor = full ? pay.amount_minor : Math.round(Number(amount) * 100)
  const save = async (e) => {
    e.preventDefault()
    setErr('')
    if (!Number.isFinite(minor) || minor <= 0 || minor > pay.amount_minor) return setErr(`Amount must be more than 0 and not more than ${money(pay.amount_minor, pay.currency)}.`)
    if (!reason.trim()) return setErr('A reason is required.')
    setBusy(true)
    try { onDone(await recordRefund(pay.id, minor, reason.trim(), ref.trim())) } catch (x) { setErr(x.message); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form role="dialog" aria-modal="true" aria-labelledby="refund-title" onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-3">
        <h2 id="refund-title" className="text-lg font-bold">Record refund</h2>
        <p className="text-sm text-neutral-600">Refund the money in the Paystack dashboard first. This only records it. Their plan ends now if this is their latest payment.</p>
        <p className="text-sm">Paid {money(pay.amount_minor, pay.currency)} on {day(pay.paid_at || pay.created_at)} for {pay.plan}. Reference {pay.reference}.</p>
        <fieldset className="flex gap-4 text-sm">
          <legend className="sr-only">Full or part refund</legend>
          <label className="flex items-center gap-2"><input type="radio" checked={full} onChange={() => setFull(true)} /> Full</label>
          <label className="flex items-center gap-2"><input type="radio" checked={!full} onChange={() => setFull(false)} /> Part</label>
        </fieldset>
        {!full && <Field label={`Amount refunded (${pay.currency || 'GHS'})`}><input className="input" type="number" step="0.01" min="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required /></Field>}
        <Field label="Reason (required)"><input className="input" value={reason} onChange={(e) => setReason(e.target.value)} required /></Field>
        <Field label="Paystack refund reference (optional)"><input className="input" value={ref} onChange={(e) => setRef(e.target.value)} /></Field>
        {err && <p className="text-sm text-red-700" role="alert">{err}</p>}
        <div className="flex gap-3">
          <button type="button" className="btn btn-outline flex-1" onClick={onClose}>Cancel</button>
          <button className="btn btn-orange flex-1" disabled={busy}>{busy ? 'Saving...' : `Record ${money(full ? pay.amount_minor : minor || 0, pay.currency)} refund`}</button>
        </div>
      </form>
    </div>
  )
}

export function PersonPage({ users, reload, canDisable, canEditStaff, canDelete, canPlan, canRefund }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'overview'
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [panel, setPanel] = useState('') // edit | plan
  const [confirm, setConfirm] = useState('') // disable | delete | activate
  const [refundFor, setRefundFor] = useState(null)
  const load = () => getPerson(id).then(setData).catch((e) => setErr(e.message))
  useEffect(() => { setData(null); setErr(''); load() }, [id])
  const refresh = () => Promise.all([load(), reload && reload()])
  const u = users.find((x) => x.id === id) // the list row, which the reused panels expect

  const back = <Link to=".." relative="path" className="underline text-sm">Back to People</Link>
  if (err && !data) return <div className="space-y-3">{back}<p className="text-red-700" role="alert">{err}</p></div>
  if (!data) return <Spinner />

  const p = data.profile || {}
  const sub = data.subscription
  const staff = data.staff_role
  const status = p.disabled_at ? 'Disabled' : data.unconfirmed ? 'Unconfirmed' : 'Active'
  const access = u ? accessLabel(u).label : ''

  const act = async (fn, ok) => {
    setConfirm(''); setErr(''); setMsg('')
    try { await fn(); setMsg(ok); await refresh() } catch (e) { setErr(e.message) }
  }
  const remove = async () => {
    setConfirm(''); setErr('')
    try { await deleteAccount(id); reload && reload(); navigate('..', { relative: 'path' }) } catch (e) { setErr(e.message) }
  }
  // Payments whose refund email went out (from History; admins see all of it).
  const emailed = new Set((data.history || []).filter((h) => h.action === 'refund_email_sent').map((h) => h.detail?.payment_id))
  const emailRefund = async (paymentId, before = '') => {
    setErr('')
    try { await sendRefundEmail(paymentId); setMsg(`${before}Refund email sent.`) } catch (e) { setMsg(before); setErr(`Refund email not sent: ${e.message}`) }
    refresh()
  }
  const openDoc = async (path) => {
    try { window.open(await staffDocumentUrl(path), '_blank', 'noopener') } catch (e) { setErr(e.message) }
  }

  const can = {
    edit: !!u && !!reload && (!staff || canEditStaff),
    plan: !!u && canPlan && !staff,
    refund: canRefund && Array.isArray(data.payments) && data.payments.some((y) => y.status === 'success'),
    activate: !!reload && data.unconfirmed && !staff,
    toggle: canDisable && !staff && !data.unconfirmed,
    remove: canDelete && staff !== 'owner',
  }

  return (
    <section className="space-y-5">
      {back}
      <div>
        <h2 className="text-2xl font-bold break-words">{p.full_name || p.email}</h2>
        <p className="text-sm text-neutral-600 break-all">{p.email}</p>
        <p className="flex flex-wrap gap-2 mt-2">
          <Badge tone={status === 'Active' ? 'green' : 'orange'}>{status}</Badge>
          {access && <Badge tone={access === 'Subscriber' || access === 'Trial' ? 'green' : 'orange'}>{access}</Badge>}
          {p.is_minor && <Badge tone="orange">Under 18</Badge>}
          {staff && <Badge tone="green">{ROLE_LABEL[staff]}</Badge>}
        </p>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Quick actions">
        {can.edit && <button className="btn btn-outline" onClick={() => setPanel(panel === 'edit' ? '' : 'edit')}>Edit details</button>}
        {can.plan && <button className="btn btn-outline" onClick={() => setPanel(panel === 'plan' ? '' : 'plan')}>Give or end plan</button>}
        {can.refund && <button className="btn btn-outline" onClick={() => setParams({ tab: 'plan' })}>Record refund</button>}
        {can.activate && <button className="btn btn-outline" onClick={() => setConfirm('activate')}>Activate account</button>}
        {can.toggle && <button className="btn btn-outline" onClick={() => setConfirm('disable')}>{p.disabled_at ? 'Reactivate' : 'Disable'}</button>}
        {can.remove && <button className="btn btn-outline !border-red-300 text-red-700" onClick={() => setConfirm('delete')}>Delete</button>}
      </div>
      {msg && <p className="text-sm text-green-700" role="status">{msg}</p>}
      {err && <p className="text-sm text-red-700" role="alert">{err}</p>}
      {panel === 'edit' && u && <EditStudent u={u} onClose={() => setPanel('')} onSaved={() => { setPanel(''); refresh() }} />}
      {panel === 'plan' && u && <PlanPanel u={u} onClose={() => setPanel('')} onDone={refresh} />}

      <ConfirmDialog open={confirm === 'activate'} title="Activate this account?" text={`${p.full_name} (${p.email}) has not confirmed their email. Only do this if you know the email address belongs to them.`} confirmLabel="Activate" onConfirm={() => act(() => activateAccount(id), 'Account activated.')} onCancel={() => setConfirm('')} />
      <ConfirmDialog open={confirm === 'disable'} title={p.disabled_at ? 'Reactivate this account?' : 'Disable this account?'} text={p.disabled_at ? 'They will be able to sign in again.' : 'They will be signed out and blocked. Records are kept.'} confirmLabel={p.disabled_at ? 'Reactivate' : 'Disable'} onConfirm={() => act(() => setAccountDisabled(id, !p.disabled_at), p.disabled_at ? 'Account reactivated.' : 'Account disabled.')} onCancel={() => setConfirm('')} />
      <ConfirmDialog open={confirm === 'delete'} title="Delete this account?" text={`${p.full_name} (${p.email}) will be removed from the site and signed out. A private copy is kept in the archive.`} confirmLabel="Delete" onConfirm={remove} onCancel={() => setConfirm('')} />
      {refundFor && <RefundDialog pay={refundFor} onClose={() => setRefundFor(null)} onDone={(r) => { const id = refundFor.id; setRefundFor(null); emailRefund(id, r === 'recorded_plan_ended' ? 'Refund recorded. Their plan has ended. ' : 'Refund recorded. Their plan was kept because a newer payment paid for it. ') }} />}

      <nav aria-label="Person sections" className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t.id} type="button" aria-current={tab === t.id ? 'page' : undefined} onClick={() => setParams(t.id === 'overview' ? {} : { tab: t.id })}
            className={`inline-flex items-center min-h-11 px-4 rounded-full border-2 whitespace-nowrap text-sm font-semibold ${tab === t.id ? 'bg-brand-orange border-brand-orange' : 'bg-white border-neutral-200 hover:border-brand-green'}`}>{t.label}</button>
        ))}
      </nav>

      <div className="card">
        {tab === 'overview' && (
          <Rows items={[
            ['Name', p.full_name], ['Email', p.email], ['Phone', p.phone], ['Date of birth', day(p.date_of_birth)],
            ['Joined', day(p.created_at)], ['Account', p.disabled_at ? `Disabled ${day(p.disabled_at)}${p.disabled_reason ? ` (${p.disabled_reason})` : ''}` : status],
            ['Under 18', p.is_minor ? 'Yes' : 'No'],
            ['Parent or guardian', data.parent ? [data.parent.name, data.parent.phone, data.parent.email].filter(Boolean).join(', ') : 'None'],
            ['Parent confirmed', data.parent ? (data.parent.confirmed_at ? `Yes, ${day(data.parent.confirmed_at)}` : 'Not yet') : '-'],
          ]} />
        )}

        {tab === 'plan' && (
          <div className="space-y-4">
            <Rows items={[
              ['Plan', sub?.plan || 'None'], ['Status', sub?.status],
              ['Ends', sub ? day(sub.expires_at) : ''],
              ['Free trial', p.trial_ends_at ? `${new Date(p.trial_ends_at) > new Date() ? 'Ends' : 'Ended'} ${day(p.trial_ends_at)}` : 'Not started'],
            ]} />
            {data.payments === null ? <p className="text-sm text-neutral-600">Only admins can see payments.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left bg-neutral-50"><tr><th className="p-2">Date</th><th className="p-2">Amount</th><th className="p-2">Plan</th><th className="p-2">Paystack reference</th><th className="p-2">Status</th><th className="p-2"></th></tr></thead>
                  <tbody>
                    {data.payments.map((y) => (
                      <tr key={y.id} className="border-t border-neutral-200 align-top">
                        <td className="p-2 whitespace-nowrap">{day(y.paid_at || y.created_at)}</td>
                        <td className="p-2 whitespace-nowrap">{money(y.amount_minor, y.currency)}</td>
                        <td className="p-2">{y.plan}</td>
                        <td className="p-2 break-all">{y.reference}</td>
                        <td className="p-2">
                          {PAY_STATUS[y.status] || y.status}
                          {y.refunded_at && <p className="text-xs text-neutral-600">{money(y.refund_amount_minor, y.currency)} on {day(y.refunded_at)}{y.refunded_by_name ? ` by ${y.refunded_by_name}` : ''}. {y.refund_reason}{y.refund_reference ? ` (ref ${y.refund_reference})` : ''}</p>}
                        </td>
                        <td className="p-2">
                          {canRefund && y.status === 'success' && <button className="btn btn-outline !min-h-11 !py-1 whitespace-nowrap" onClick={() => setRefundFor(y)}>Record refund</button>}
                          {canRefund && y.refunded_at && (emailed.has(y.id) ? <span className="text-xs text-neutral-600 whitespace-nowrap">Email sent</span> : <button className="btn btn-outline !min-h-11 !py-1 whitespace-nowrap" onClick={() => emailRefund(y.id)}>Send refund email</button>)}
                        </td>
                      </tr>
                    ))}
                    {data.payments.length === 0 && <tr><td className="p-2 text-neutral-500" colSpan={6}>No payments.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div className="space-y-4">
            <Rows items={[
              ['SHS attended', p.shs_attended], ['SHS programme', p.shs_program], ['Study level', p.study_level], ['Study field', p.study_field],
              ['Desired programmes', p.desired_programs], ['Funding', p.funding_type], ['Profile', p.profile_complete ? 'Complete' : 'Incomplete'],
            ]} />
            <h3 className="font-bold">Documents</h3>
            <ul className="space-y-2 text-sm">
              {data.documents.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center gap-3">
                  <span className="break-all">{d.doc_type || d.file_path.split('/').pop()}, uploaded {day(d.uploaded_at)}</span>
                  {canRefund && <button className="btn btn-outline !min-h-11 !py-1" onClick={() => openDoc(d.file_path)}>Open</button>}
                </li>
              ))}
              {data.documents.length === 0 && <li className="text-neutral-500">No documents.</li>}
            </ul>
          </div>
        )}

        {tab === 'saved' && (
          <ul className="space-y-2 text-sm">
            {data.saved.map((s) => <li key={s.program_id}><span className="font-semibold">{s.name || 'Programme no longer listed'}</span>{s.school ? `, ${s.school}` : ''}{s.level ? ` (${s.level})` : ''}. Saved {day(s.saved_at)}.</li>)}
            {data.saved.length === 0 && <li className="text-neutral-500">Nothing saved.</li>}
          </ul>
        )}

        {tab === 'history' && (
          <ul className="space-y-3 text-sm">
            {data.history.map((h) => (
              <li key={h.id} className="border-b border-neutral-200 pb-2">
                <p className="text-xs text-neutral-600">{when(h.at)}</p>
                <p className="font-semibold">{h.action.replaceAll('_', ' ')}{h.action === 'refund_recorded' && h.detail?.amount_minor ? `: ${money(h.detail.amount_minor, h.detail.currency)}${h.detail.plan_ended ? ', plan ended' : ', plan kept'}` : ''}</p>
                <p>By {h.actor_name || 'system'}{h.actor_role ? ` (${ROLE_LABEL[h.actor_role] || h.actor_role})` : ''}{h.detail?.reason ? `. Reason: ${h.detail.reason}` : ''}</p>
              </li>
            ))}
            {data.history.length === 0 && <li className="text-neutral-500">{canRefund ? 'No staff actions yet.' : 'You have taken no actions on this person yet. Only admins see all actions.'}</li>}
          </ul>
        )}
      </div>
    </section>
  )
}
