import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { Schools, SchoolDetail } from './pages/Schools'
import Abroad from './pages/Abroad'
import Scholarships from './pages/Scholarships'
import Eligibility from './pages/Eligibility'
import { Login, Signup, ForgotPassword, ResetPassword } from './pages/Auth'
import Profile from './pages/Profile'
import Pricing from './pages/Pricing'
import Admin from './pages/Admin'
import Privacy from './pages/Privacy'
import Settings from './pages/Settings'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/schools/:id" element={<SchoolDetail />} />
        <Route path="/abroad" element={<Abroad />} />
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
        <Route path="/terms" element={<Legal page="terms" />} />
        <Route path="/refunds" element={<Legal page="refunds" />} />
        <Route path="/cookies" element={<Legal page="cookies" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
