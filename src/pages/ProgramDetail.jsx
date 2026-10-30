import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useScope } from '../hooks/useScope'
import { useSaved } from '../hooks/useSaved'
import { BackLink, Badge, Gate, PageTitle, Spinner } from '../components/ui'
import { HeartButton, Monogram } from '../components/Cards'
import { getProgramGroup } from '../lib/api'
import { variantLabel } from '../lib/variants'

const SAT = { required: 'Required', optional: 'Optional', not_considered: 'Not considered' }
const money = (n, cur) => `${cur} ${Number(n).toLocaleString()}`

function Fact({ label, children }) {
  if (children == null || children === '') return null
  return (
    <div className="min-w-[7.5rem]">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="font-semibold break-words">{children}</p>
    </div>
  )
}

function Row({ label, children }) {
  if (children == null || children === '' || children === false) return null
  return (<><dt className="text-neutral-500">{label}</dt><dd className="break-words">{children}</dd></>)
}

// One programme on its own page: facts up top, then entry requirements, fees and the school.
export default function ProgramDetail() {
  const { id } = useParams()
  const { user, access } = useAuth()
  const { to, international } = useScope()
  const saved = useSaved()
  const [state, setState] = useState({ loading: true, data: null, error: '' })

  useEffect(() => {
    let live = true
    setState({ loading: true, data: null, error: '' })
    getProgramGroup(id).then((data) => live && setState({ loading: false, data, error: '' })).catch((e) => live && setState({ loading: false, data: null, error: e.message }))
    return () => { live = false }
  }, [id])

  if (!user) return <Gate />
  if (state.loading) return <Spinner />
  const { data } = state
  if (!data || !data.variants.length) return <div className="space-y-3"><BackLink to={to('/programs')}>Back to programs</BackLink><p>{state.error || 'This program could not be found.'}</p></div>

  const { school, variants } = data
  const p = variants[0]
  const full = access.level === 'full'
  const masters = p.level === 'Masters'
  const feeUsd = variants.find((v) => v.feesUsd != null)?.feesUsd
  const feeGhs = variants.find((v) => v.feesGhs != null)?.feesGhs
  const duration = variants.find((v) => v.durationYears != null)?.durationYears
  const satPolicy = variants.find((v) => v.satPolicy)?.satPolicy
  const where = [school?.city, school?.country].filter(Boolean).join(', ')
  // A plain summary built only from facts we hold, so every programme page has key information.
  const modes = [...new Set(variants.map((v) => v.mode).filter((m) => m && m !== 'Regular'))]
  const summary = [
    `${p.name} is ${/^[aeiou]/i.test(p.level || 'u') ? 'an' : 'a'} ${(p.level || 'undergraduate').toLowerCase()} programme${p.field ? ` in ${p.field}` : ''} at ${school?.name}${where ? ` (${where})` : ''}.`,
    duration != null ? `It takes ${duration} years.` : '',
    modes.length ? `It can also be studied by ${modes.map((m) => m.toLowerCase()).join(', ')}.` : '',
  ].filter(Boolean).join(' ')

  return (
    <div className="space-y-6">
      <PageTitle title={p.name} />
      <div className="rounded-3xl overflow-hidden border border-neutral-200 bg-white">
        <div className="h-32 md:h-44 bg-gradient-to-br from-brand-green via-brand-green-soft to-brand-orange-soft" aria-hidden="true" />
        <div className="p-5 md:p-6 -mt-12 md:-mt-16">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 md:p-5 max-w-xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex flex-wrap gap-2 flex-1">
                {p.level && <Badge>{p.level}</Badge>}
                {p.field && <Badge>{p.field}</Badge>}
              </div>
              <HeartButton active={saved.isSaved({ ...p, variants })} onClick={() => saved.toggleProgram({ ...p, variants })} label={p.name} />
            </div>
            <Link to={to(`/schools/${p.schoolId}`)} className="flex items-center gap-3 hover:underline">
              <Monogram name={school?.name} logo={school?.logoUrl} />
              <span className="min-w-0"><span className="block font-semibold text-sm break-words">{school?.name}</span><span className="block text-sm text-neutral-600">{where}</span></span>
            </Link>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight break-words">{p.name}</h2>
            {school?.website && <a href={school.website} target="_blank" rel="noreferrer" className="btn btn-orange w-full sm:w-auto">Visit school website</a>}
          </div>
        </div>
        <div className="border-t border-neutral-200 bg-neutral-50 p-4 md:px-6 flex flex-wrap gap-x-8 gap-y-3">
          <Fact label="Tuition per year">{feeUsd != null ? money(feeUsd, 'USD') : feeGhs != null ? money(feeGhs, 'GHS') : null}</Fact>
          <Fact label="Duration">{duration != null ? `${duration} years` : null}</Fact>
          <Fact label="Level">{p.level || 'Undergraduate'}</Fact>
          <Fact label="Location">{where}</Fact>
          <Fact label="SAT">{satPolicy ? SAT[satPolicy] : null}</Fact>
        </div>
      </div>

      {!full ? <Gate text="Subscribe to see entry requirements, fees and chances for this program." /> : (
        <div className="grid md:grid-cols-[12rem_1fr] gap-6 items-start">
          <nav className="hidden md:block sticky top-4 space-y-1 text-sm" aria-label="On this page">
            {[['key', 'Key information'], ['entry', 'Entry requirements'], ['fees', 'Fees and funding'], ['school', 'About the school']].map(([a, t]) => (
              <a key={a} href={`#${a}`} className="block rounded-lg px-3 py-2 hover:bg-neutral-100">{t}</a>
            ))}
          </nav>
          <div className="space-y-8 min-w-0">
            <section id="key" className="space-y-2">
              <h2 className="text-xl font-bold">Key information</h2>
              <p className="text-neutral-800 break-words">{summary}</p>
              {p.entryNote && <p className="text-neutral-800 whitespace-pre-line break-words">{p.entryNote}</p>}
              {variants.length > 1 && (
                <p className="text-sm text-neutral-600">You can study this program in {variants.length} ways: {variants.map(variantLabel).join('; ')}. Details for each are below.</p>
              )}
            </section>

            <section id="entry" className="space-y-3">
              <h2 className="text-xl font-bold">Entry requirements</h2>
              {variants.map((v) => (
                <div key={v.id} className="rounded-xl border border-neutral-200 p-4 space-y-2">
                  {variants.length > 1 && <h3 className="font-semibold">{variantLabel(v)}</h3>}
                  <dl className="text-sm grid grid-cols-[9rem_1fr] gap-x-4 gap-y-1.5">
                    <Row label="You need">{v.entryQualification}</Row>
                    {!masters && <Row label="Cut-off aggregate">{v.cutoffAggregate != null && `${v.cutoffAggregate}${v.cutoffYear ? ` (${v.cutoffYear})` : ''}`}</Row>}
                    {!masters && <Row label="Subjects">{v.requirements?.length > 0 && v.requirements.map((r) => `${r.subject}${r.minGrade ? ' ' + r.minGrade : ''}`).join(', ')}</Row>}
                    <Row label="Degree class">{v.minDegreeClass}</Row>
                    <Row label="WASSCE">{v.minWassceGrade && `${v.minWassceGrade} or better`}</Row>
                    <Row label="SAT">{v.satPolicy && `${SAT[v.satPolicy]}${v.satLow != null ? `. Usual range ${v.satLow} to ${v.satHigh ?? v.satLow}` : ''}`}</Row>
                    <Row label="English">{(v.englishTestWaiver || v.minIelts != null || v.minToefl != null || v.minDuolingo != null) && [v.englishTestWaiver && 'No test needed for Ghanaian citizens', v.minIelts != null && `IELTS ${v.minIelts}`, v.minToefl != null && `TOEFL ${v.minToefl}`, v.minDuolingo != null && `Duolingo ${v.minDuolingo}`].filter(Boolean).join(', ')}</Row>
                    <Row label="Foundation year">{v.foundationAvailable && 'Available'}</Row>
                  </dl>
                </div>
              ))}
              <Link to={`${to('/eligibility')}?${new URLSearchParams({ program: p.name, level: p.level || '' })}`} className="btn btn-green">Check if I qualify</Link>
            </section>

            <section id="fees" className="space-y-2">
              <h2 className="text-xl font-bold">Fees and funding</h2>
              <dl className="text-sm grid grid-cols-[9rem_1fr] gap-x-4 gap-y-1.5">
                <Row label="Tuition per year">{feeUsd != null ? money(feeUsd, 'USD') : feeGhs != null ? money(feeGhs, 'GHS') : 'Not added yet'}</Row>
              </dl>
              <Link to={to('/scholarships')} className="underline text-sm">Look for scholarships</Link>
            </section>

            <section id="school" className="space-y-2">
              <h2 className="text-xl font-bold">About the school</h2>
              <p className="text-neutral-800">{school?.name}{where ? `, ${where}` : ''}.{school?.programCount ? ` ${school.programCount.toLocaleString()} programs listed.` : ''}</p>
              <Link to={to(`/schools/${p.schoolId}`)} className="btn btn-outline">See all programs at this school</Link>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
