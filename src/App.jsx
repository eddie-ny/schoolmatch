import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Landing from './pages/Landing'
import { SHOW_INTERNATIONAL } from './lib/constants'
const Schools = lazy(() => import('./pages/Schools').then((m) => ({ default: m.Schools })))
const SchoolDetail = lazy(() => import('./pages/Schools').then((m) => ({ default: m.SchoolDetail })))
const Abroad = lazy(() => import('./pages/Abroad'))
const International = lazy(() => import('./pages/International'))
const InternationalEligibility = lazy(() => import('./pages/InternationalEligibility'))
const SatTest = lazy(() => import('./pages/SatTest'))
const Scholarships = lazy(() => import('./pages/Scholarships'))
const Eligibility = lazy(() => import('./pages/Eligibility'))
const Login = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Login })))
const Signup = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Signup })))
const ForgotPassword = lazy(() => import('./pages/Auth').then((m) => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('./pages/Auth').then((m) => ({ default: m.ResetPassword })))
const Profile = lazy(() => import('./pages/Profile'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Admin = lazy(() => import('./pages/Admin'))
const Support = lazy(() => import('./pages/Support'))
const Complaints = lazy(() => import('./pages/Complaints'))
const Interested = lazy(() => import('./pages/Interested'))
const Invite = lazy(() => import('./pages/Invite'))
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'))
const Programs = lazy(() => import('./pages/Programs'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Settings = lazy(() => import('./pages/Settings'))
const Legal = lazy(() => import('./pages/Legal'))
const ParentConfirm = lazy(() => import('./pages/ParentConfirm'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Visitor counts for the Vercel dashboard. Staff pages and the parent link page (which carries a token) are not counted.
const skipAnalytics = (event) => (/\/(admin|support|parent-confirm|reset-password)(\/|\?|$)/.test(event.url) ? null : event)

// Every move to another page starts at the top. Changing a filter on the same page does not scroll.
// The next page loads in pieces (the page code, then the catalogue), and the page grows as it fills in, so the top is
// held for a moment after the move. It lets go as soon as the visitor scrolls or touches the screen.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    let holding = true
    const top = () => { if (holding && window.scrollY > 0) window.scrollTo(0, 0) }
    const stop = () => { holding = false }
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(top) : null
    ro?.observe(document.body)
    const timer = setTimeout(stop, 1500)
    window.addEventListener('wheel', stop, { passive: true, once: true })
    window.addEventListener('touchstart', stop, { passive: true, once: true })
    window.addEventListener('keydown', stop, { once: true })
    return () => { stop(); clearTimeout(timer); ro?.disconnect(); window.removeEventListener('wheel', stop); window.removeEventListener('touchstart', stop); window.removeEventListener('keydown', stop) }
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
    <ScrollToTop />
    <Analytics beforeSend={skipAnalytics} />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/local" element={<Home />} />
        <Route path="/international" element={<International />} />
        <Route path="/international/eligibility" element={<InternationalEligibility />} />
        <Route path="/international/sat" element={<SatTest />} />
        <Route path="/programs/:id" element={<ProgramDetail />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/schools/:id" element={<SchoolDetail />} />
        {SHOW_INTERNATIONAL && <Route path="/abroad" element={<Abroad />} />}
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/eligibility" element={<Eligibility />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/support/*" element={<Support />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/interested" element={<Interested />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/parent-confirm" element={<ParentConfirm />} />
        <Route path="/terms" element={<Legal page="terms" />} />
        <Route path="/refunds" element={<Legal page="refunds" />} />
        <Route path="/cookies" element={<Legal page="cookies" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </>
  )
}
