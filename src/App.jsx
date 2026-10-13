import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { SHOW_INTERNATIONAL } from './lib/constants'
const Schools = lazy(() => import('./pages/Schools').then((m) => ({ default: m.Schools })))
const SchoolDetail = lazy(() => import('./pages/Schools').then((m) => ({ default: m.SchoolDetail })))
const Abroad = lazy(() => import('./pages/Abroad'))
const Scholarships = lazy(() => import('./pages/Scholarships'))
const Eligibility = lazy(() => import('./pages/Eligibility'))
const Login = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Login })))
const Signup = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Signup })))
const ForgotPassword = lazy(() => import('./pages/Auth').then((m) => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('./pages/Auth').then((m) => ({ default: m.ResetPassword })))
const Profile = lazy(() => import('./pages/Profile'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Admin = lazy(() => import('./pages/Admin'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Settings = lazy(() => import('./pages/Settings'))
const Legal = lazy(() => import('./pages/Legal'))
const ParentConfirm = lazy(() => import('./pages/ParentConfirm'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
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
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/parent-confirm" element={<ParentConfirm />} />
        <Route path="/terms" element={<Legal page="terms" />} />
        <Route path="/refunds" element={<Legal page="refunds" />} />
        <Route path="/cookies" element={<Legal page="cookies" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
