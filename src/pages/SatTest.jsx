import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageTitle } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { SAT_SAMPLE } from '../data/satSample'

// A short practice test. The score is a practice score on the 400 to 1600 scale, worked out from the share of answers right.
// It is NOT an official SAT score. The questions are samples until the client supplies hers (see src/data/satSample.js).
const practiceScore = (right, total) => 400 + Math.round(((right / total) * 1200) / 10) * 10

export default function SatTest() {
  const { user } = useAuth()
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState([])
  const [done, setDone] = useState(false)
  const total = SAT_SAMPLE.length
  const q = SAT_SAMPLE[i]
  const right = picked.filter((a, n) => a === SAT_SAMPLE[n].answer).length

  const choose = (n) => setPicked((p) => { const c = [...p]; c[i] = n; return c })
  const next = () => (i + 1 < total ? setI(i + 1) : setDone(true))
  const restart = () => { setI(0); setPicked([]); setDone(false) }

  if (done) {
    const score = practiceScore(right, total)
    try { sessionStorage.setItem('satScore', String(score)) } catch { /* storage blocked: the score is still in the link */ }
    return (
      <div className="space-y-6">
        <PageTitle title="Your practice result" />
        <div className="card text-center space-y-2">
          <p className="text-sm text-neutral-600">Practice score</p>
          <p className="text-5xl font-extrabold">{score}</p>
          <p className="text-neutral-700">{right} of {total} right. This is a practice score, not an official SAT score.</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {user
              ? <Link to={`/international/eligibility?sat=${score}`} className="btn btn-orange">Check my eligibility</Link>
              : <Link to="/login" className="btn btn-orange">Sign in to check eligibility</Link>}
            <button className="btn btn-outline" onClick={restart}>Try again</button>
          </div>
        </div>
        <div className="rounded-3xl bg-brand-green text-neutral-900 p-6 space-y-3">
          <h2 className="text-xl md:text-2xl font-extrabold">Get ready for the real SAT</h2>
          <p>This was a short sample. The real SAT is much longer and harder, and the timing is strict. Classes, tutoring and full practice tests help you prepare, whatever your score here. Contact us and we will help you get ready.</p>
          <Link to="/international/sat-classes" className="btn !bg-neutral-900 !text-white">Get SAT training</Link>
        </div>
        <ol className="space-y-3">
          {SAT_SAMPLE.map((s, n) => (
            <li key={s.id} className="card">
              <p className="text-xs text-neutral-600">{s.section}</p>
              <p className="font-semibold">{s.q}</p>
              <p className={`text-sm mt-1 ${picked[n] === s.answer ? 'text-green-800' : 'text-red-700'}`}>
                {picked[n] === s.answer ? 'Right.' : `Your answer: ${picked[n] == null ? 'none' : s.options[picked[n]]}. Right answer: ${s.options[s.answer]}.`}
              </p>
              <p className="text-sm text-neutral-700 mt-1">{s.why}</p>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <PageTitle title="Short SAT test" sub={`Question ${i + 1} of ${total}. ${q.section}.`} />
      <div className="card space-y-4">
        <p className="text-lg font-semibold">{q.q}</p>
        <div className="space-y-2" role="radiogroup" aria-label="Answers">
          {q.options.map((o, n) => (
            <button key={o} type="button" role="radio" aria-checked={picked[i] === n} onClick={() => choose(n)}
              className={`w-full text-left rounded-xl border-2 px-4 min-h-11 py-2 ${picked[i] === n ? 'border-brand-orange bg-brand-orange-soft font-semibold' : 'border-neutral-200 hover:border-brand-green'}`}>
              <span className="font-bold mr-2">{'ABCD'[n]}</span>{o}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center pt-2">
          <button className="btn btn-outline" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>Back</button>
          <button className="btn btn-orange" onClick={next} disabled={picked[i] == null}>{i + 1 < total ? 'Next' : 'See my result'}</button>
        </div>
      </div>
      <p className="text-xs text-neutral-600 mt-4">Practice questions written for this site. They are not official SAT questions.</p>
    </div>
  )
}
