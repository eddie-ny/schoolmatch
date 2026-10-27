import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog, isLocal } from '../hooks/useCatalog'
import { Gate, PageTitle, Pagination, Segmented, Spinner } from '../components/ui'
import { ScholarshipCard } from '../components/Cards'
import { SHOW_INTERNATIONAL } from '../lib/constants'

const PAGE = 12

export default function Scholarships() {
  const { access, user } = useAuth()
  const { scholarships, loading } = useCatalog()
  const [params] = useSearchParams()
  const [funding, setFunding] = useState(params.get('funding') || 'all')
  const [where, setWhere] = useState('all')
  const [page, setPage] = useState(1)
  const full = access.level === 'full'

  const list = useMemo(
    () =>
      scholarships
        .filter((s) => funding === 'all' || s.fundingType.toLowerCase() === funding)
        .filter((s) => where === 'all' || (where === 'local' ? isLocal(s.country) : !isLocal(s.country))),
    [scholarships, funding, where, user]
  )

  return (
    <div>
      <PageTitle title="Scholarships" sub={SHOW_INTERNATIONAL ? 'Browse by funding type and country.' : 'Funding for study in Ghana.'} />
      <div className="space-y-3 mb-6">
        <Segmented value={funding} onChange={(v) => { setFunding(v); setPage(1) }} options={[{ value: 'all', label: 'Any funding' }, { value: 'partial', label: 'Partial' }, { value: 'full', label: 'Fully funded' }]} />
        {SHOW_INTERNATIONAL && <div><Segmented value={where} onChange={(v) => { setWhere(v); setPage(1) }} options={[{ value: 'all', label: 'All' }, { value: 'local', label: 'Local' }, { value: 'intl', label: 'International' }]} /></div>}
      </div>
      {!full && <div className="mb-5"><Gate /></div>}
      {loading ? <Spinner /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.slice((page - 1) * PAGE, page * PAGE).map((s) => <ScholarshipCard key={s.id} s={s} full={full} />)}
          {list.length === 0 && <p className="text-neutral-600">No scholarships match these filters yet.</p>}
        </div>
      )}
      {!loading && <Pagination page={page} pages={Math.ceil(list.length / PAGE)} onChange={(n) => { setPage(n); window.scrollTo({ top: 0 }) }} />}
    </div>
  )
}
