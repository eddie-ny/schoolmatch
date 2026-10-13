import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { listUsers, listAuditLog, listPendingParents } from '../lib/api'
import { PageTitle } from '../components/ui'
import { ActivityLog, NeedMfa, ParentsSection, SignupsSection } from '../components/StaffParts'

// Support page: the same tools as Admin with fewer powers. Support can see sign-ups, see who is waiting for a parent,
// and create and send parent links. Support cannot disable accounts, accept confirmations, import data or change roles.
export default function Support() {
  const { user, loading, mfa } = useAuth()
  const [users, setUsers] = useState([])
  const [log, setLog] = useState([])
  const [pending, setPending] = useState([])
  const load = () => Promise.all([listUsers().then(setUsers), listAuditLog().then(setLog).catch(() => {}), listPendingParents().then(setPending).catch(() => {})])
  useEffect(() => { load() }, [])

  if (loading) return <p>Loading...</p>
  if (!user || !['support', 'admin'].includes(user.role)) return <p>Support staff only.</p>
  if (mfa.current !== 'aal2') return <NeedMfa what="Support" />

  return (
    <div className="space-y-8">
      <PageTitle title="Support" sub="Sign-ups, parents waiting for a link and the activity log." />
      <ParentsSection pending={pending} canAccept={false} reload={load} />
      <SignupsSection users={users} canDisable={false} onToggle={() => {}} err="" />
      <ActivityLog log={log} users={users} />
    </div>
  )
}
