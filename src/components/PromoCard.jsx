import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { timeLeft } from '../lib/access'

// An original illustration: a graduation cap that tips side to side above a scholarship tag.
// The tag names the feature only. It shows no amount, school or award, because none of that is promised here.
function CapScene() {
  return (
    <div className="promo-scene" aria-hidden="true">
      <svg viewBox="0 0 300 250" className="w-full h-full">
        <defs>
          <linearGradient id="promo-tag" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFB02E" />
            <stop offset="1" stopColor="#B2DE2B" />
          </linearGradient>
        </defs>
        {/* scholarship tag, swings gently on its string */}
        <g className="promo-tag-swing">
          <path d="M150 112 V128" stroke="#26352B" strokeWidth="3" strokeLinecap="round" />
          <rect x="70" y="128" width="160" height="86" rx="16" fill="url(#promo-tag)" stroke="#26352B" strokeWidth="3" />
          <circle cx="150" cy="140" r="5" fill="#fff" stroke="#26352B" strokeWidth="2" />
          <text x="150" y="172" textAnchor="middle" fontSize="22" fontWeight="800" fill="#1f1f1f">Scholarships</text>
          <text x="150" y="196" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1f1f1f">Full and partial funding</text>
        </g>
        {/* graduation cap, tips left then right around the centre of its band */}
        <g className="promo-cap">
          <path d="M104 62 V84 C104 98 196 98 196 84 V62 Z" fill="#3A4F40" />
          <path d="M150 20 L246 52 L150 84 L54 52 Z" fill="#26352B" />
          <path d="M150 52 L226 56 V86" fill="none" stroke="#FFB02E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="150" cy="52" r="6" fill="#FFB02E" />
          <rect x="222" y="84" width="8" height="18" rx="3" fill="#FFB02E" />
        </g>
      </svg>
    </div>
  )
}

// Real time left on the free trial. It refreshes every minute and disappears when the trial ends.
function Countdown({ endsAt }) {
  const [, tick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 60000)
    return () => clearInterval(t)
  }, [])
  const left = timeLeft(endsAt)
  if (left === 'expired') return null
  return (
    <p className="promo-countdown inline-flex flex-col items-center rounded-2xl bg-white px-5 py-3 shadow-md" role="timer" aria-label={`Free trial ends in ${left}`}>
      <span className="text-3xl md:text-4xl font-extrabold text-red-700 leading-none">{left} left</span>
      <span className="text-xs font-semibold text-neutral-600 mt-1">of your free trial</span>
    </p>
  )
}

// Shown to signed-in people who do not have a paid plan. Staff and subscribers never see it.
export default function PromoCard() {
  const { user, access } = useAuth()
  if (!user || access.staff || access.needsParent || access.detail === 'Subscriber') return null
  const trial = access.trial && access.expiresAt
  return (
    <section aria-label="Upgrade" className="promo mb-6 rounded-3xl overflow-hidden border border-neutral-200 bg-brand-green-soft">
      <div className="grid md:grid-cols-2 items-center gap-2 px-6 py-6 md:py-4">
        <CapScene />
        <div className="space-y-3 text-center md:text-left">
          {trial && <Countdown endsAt={access.expiresAt} />}
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Keep full access to every school, program and scholarship.</h2>
          <p className="text-neutral-700">{trial ? 'Pick a plan before your trial ends so nothing gets locked.' : 'Pick a plan to see full cut-offs, requirements and scholarship details.'}</p>
          <Link to="/pricing" className="btn btn-orange">See plans</Link>
        </div>
      </div>
    </section>
  )
}
