// DATA LAYER for the phone app. Same server calls as the web app (src/lib/api.js in the web repo).
// Search and eligibility rules live in the database, so the app gets the same answers as the website.

import { supabase } from './supabase'
import { PASSWORD_RULE, isMinorFromDob } from './validation'

// Turns a Supabase error into the plain message the web app shows. Wording copied from the web app (friendly).
function friendly(error) {
  const m = (error.message || '').toLowerCase()
  const code = error.code || ''
  if (m.includes('invalid login')) return 'Wrong email or password.'
  if (m.includes('email not confirmed')) return 'Please confirm your email first. Enter the code we sent to your inbox.'
  if (code === 'over_email_send_rate_limit' || m.includes('email rate limit')) {
    return 'We cannot send an email or reset link right now because the email service has its limits. Please try again in an hour.'
  }
  if (m.includes('failed to fetch') || m.includes('networkerror') || m.includes('network request failed') || error.name === 'AuthRetryableFetchError') {
    return 'Could not reach the server. Check your internet connection and try again. If you were creating an account, check your email first, it may have gone through.'
  }
  if (code === 'over_request_rate_limit' || m.includes('rate limit') || m.includes('too many')) return 'Too many attempts from this connection. Please wait a few minutes and try again.'
  if (m.includes('banned')) return 'This account is closed or disabled. Contact support if you think this is a mistake.'
  if (m.includes('token has expired') || m.includes('otp_expired') || m.includes('otp expired') || code === 'otp_expired') return 'That code is wrong or has expired. Ask for a new code and use only the newest email.'
  if (m.includes('at least one character of each')) return PASSWORD_RULE
  if (m.includes('password') && m.includes('characters')) return 'Password is too short. ' + PASSWORD_RULE
  if (m.includes('should be different')) return 'Your new password must be different from the old one.'
  return error.message
}

const fail = (error, fallback) => {
  if (error) throw new Error(friendly(error) || fallback)
}

// ---------- Auth ----------

// Returns { needsConfirm, alreadyRegistered }. The email holds a 6-digit code (see verifySignupCode).
export async function signUp(form) {
  const meta = {
    full_name: form.fullName,
    first_name: (form.fullName || '').trim().split(/\s+/)[0] || '', // lets the confirmation email say "Hey Edward"
    phone: form.phone,
    date_of_birth: form.dateOfBirth,
  }
  if (isMinorFromDob(form.dateOfBirth)) {
    meta.parent_name = form.parentName
    meta.parent_phone = form.parentPhone
    meta.parent_email = form.parentEmail
  }
  // A sign-up that was started but never confirmed would keep its first details, so it is cleared first. Confirmed accounts are never touched.
  await supabase.rpc('discard_unconfirmed_signup', { p_email: form.email })
  const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: meta } })
  fail(error, 'Could not create your account.')
  // For an address that already has a confirmed account, Supabase answers success but returns a user with no identities and sends nothing.
  const alreadyRegistered = Array.isArray(data.user?.identities) && data.user.identities.length === 0
  return { needsConfirm: !data.session && !alreadyRegistered, alreadyRegistered }
}

// Typing the code from the email confirms the address and signs the person in.
export async function verifySignupCode(email, code) {
  const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.replace(/\s+/g, ''), type: 'signup' })
  fail(error, 'Could not check that code.')
}

export async function resendConfirmation(email) {
  const { error } = await supabase.auth.resend({ type: 'signup', email })
  fail(error, 'Could not send the email. Please wait a minute and try again.')
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  fail(error, 'Could not sign in.')
}

export async function signOut() {
  // 'local' ends this phone's session without waiting on other devices.
  await supabase.auth.signOut({ scope: 'local' })
}

// ---------- Two-step verification (authenticator app): the sign-in challenge only. Turning it on or off comes in step 8. ----------
// current = what this session has proven; next = what it could prove. aal1 -> aal2 means a code is still owed.
export async function mfaState() {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (error) return { current: 'aal1', next: 'aal1' }
  return { current: data.currentLevel, next: data.nextLevel }
}

export async function mfaFactor() {
  const { data, error } = await supabase.auth.mfa.listFactors()
  fail(error, 'Could not read your two-step verification.')
  return (data.totp || []).find((f) => f.status === 'verified') || null
}

export async function mfaVerifyCode(factorId, code) {
  const ch = await supabase.auth.mfa.challenge({ factorId })
  fail(ch.error, 'Could not check the code.')
  const v = await supabase.auth.mfa.verify({ factorId, challengeId: ch.data.id, code: code.replace(/\s/g, '') })
  if (v.error) throw new Error('That code is not right or has expired. Try the newest code from your app.')
}

// The signed-in student, or null. With two-step verification on, the database hides the profile until the code is entered,
// so a missing profile plus "aal1 -> aal2" means a code is still owed.
export async function getCurrentUser() {
  const { data: sess } = await supabase.auth.getSession()
  const uid = sess.session?.user?.id
  if (!uid) return null
  const [prof, parent, sub, adm] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email, phone, date_of_birth, is_minor, trial_ends_at, disabled_at').eq('id', uid).maybeSingle(),
    supabase.from('parent_contacts').select('confirmed_at').eq('student_id', uid).maybeSingle(),
    supabase.from('subscriptions').select('plan, status, expires_at').eq('user_id', uid).maybeSingle(),
    supabase.from('admin_users').select('role').eq('user_id', uid).maybeSingle(),
  ])
  const { data: p, error } = prof
  if (error) throw new Error(error.message)
  if (!p) {
    const m = await mfaState()
    if (m.current === 'aal1' && m.next === 'aal2') return { id: uid, mfaPending: true, email: sess.session.user.email }
    return null // the profile row is created by the sign-up trigger, so it should always exist
  }
  return { id: p.id, fullName: p.full_name, email: p.email, phone: p.phone, dateOfBirth: p.date_of_birth, isMinor: p.is_minor, trialEndsAt: p.trial_ends_at, disabled: !!p.disabled_at,
    staffRole: adm.data ? adm.data.role : null,
    parent: parent.data ? { confirmedAt: parent.data.confirmed_at } : null,
    subscription: sub.data ? { plan: sub.data.plan, status: sub.data.status, expiresAt: sub.data.expires_at } : null }
}

// ---------- Schools (used from step 5) ----------

const toScope = (scope) => (scope === 'all' ? 'all' : scope === 'international' || scope === 'intl' ? 'intl' : 'local')

// One page of schools from the server. Each comes with how many of its programs match the search and filters.
export async function searchSchools(args) {
  return retrying(() => searchSchoolsOnce(args))
}

// A search can fail for a moment (slow database, weak connection), so it is tried up to three times, like the website.
async function retrying(fn, tries = 3) {
  let last
  for (let i = 0; i < tries; i++) {
    try { return await fn() } catch (e) { last = e; await new Promise((r) => setTimeout(r, 500 * (i + 1))) }
  }
  throw last
}

async function searchSchoolsOnce({ scope, q = '', field = '', level = '', kind = '', country = '', limit = 12, offset = 0 }) {
  const { data, error } = await supabase.rpc('search_schools', { p_scope: toScope(scope), p_q: q, p_field: field, p_level: level, p_kind: kind, p_country: country, p_limit: limit, p_offset: offset })
  if (error) throw new Error(error.message || 'Could not load schools.')
  const rows = (data || []).map((r) => ({
    school: { id: r.id, name: r.name, country: r.country, city: r.city, type: r.type, category: r.category || '', logoUrl: r.logo_url || '', verified: r.verified, programCount: r.program_count },
    count: r.program_count, matched: r.matched || 0, matches: r.matches || [],
  }))
  return { rows, total: data?.[0] ? Number(data[0].total) : 0 }
}

// One school with its extra details (website, picture, description). Same two reads as the website.
export async function getSchool(id) {
  const [s, f] = await Promise.all([
    supabase.from('schools_summary').select('*').eq('id', id).maybeSingle(),
    supabase.from('schools').select('website, image_url, image_credit, logo_credit, description, description_credit').eq('id', id).maybeSingle(),
  ])
  if (s.error) throw new Error('Could not load the school.')
  const x = s.data && { ...s.data, ...(f.data || {}) }
  return x && ({ id: x.id, name: x.name, country: x.country, type: x.type, city: x.city, website: x.website || '', category: x.category || '', logoUrl: x.logo_url || '', verified: x.verified, demo: x.demo, programCount: x.program_count ?? 0, imageUrl: x.image_url || '', imageCredit: x.image_credit || '', logoCredit: x.logo_credit || '', description: x.description || '', descriptionCredit: x.description_credit || '' })
}

// One page of programs (grouped by school, name and level). Returns { rows, total }.
export async function searchPrograms(args) {
  return retrying(() => searchProgramsOnce(args))
}
async function searchProgramsOnce({ scope = 'all', q = '', field = '', level = '', school = null, country = '', limit = 20, offset = 0 }) {
  const { data, error } = await supabase.rpc('search_programs_c', { p_scope: toScope(scope), p_q: q, p_field: field, p_level: level, p_school: school, p_country: country, p_limit: limit, p_offset: offset })
  if (error) throw new Error(error.message || 'Could not load programs.')
  const rows = (data || []).map((r) => ({ id: r.id, schoolId: r.school_id, name: r.name, level: r.level, field: r.field, variantCount: r.variants, modes: r.modes || [], schoolName: r.school_name, schoolCity: r.school_city, schoolCountry: r.school_country, schoolLogo: r.school_logo || '' }))
  return { rows, total: data?.[0] ? Number(data[0].total) : 0 }
}

// The fields of study that have programs on this side of the site.
export async function listFields(scope = 'local') {
  const { data } = await supabase.rpc('program_fields', { p_scope: toScope(scope) })
  return data || []
}

const isLocalCountry = (c) => (c || '').toLowerCase() === 'ghana'

function mapFull(f, school) {
  const latest = [...(f?.program_cutoffs || [])].sort((a, b) => b.year - a.year)[0]
  return {
    id: f.id, schoolId: f.school_id, schoolName: school?.name || '', name: f.name, level: f.level, field: f.field, demo: f.demo, mode: f.mode || 'Regular', campus: f.campus || '',
    international: school ? !isLocalCountry(school.country) : false,
    feesUsd: f.fees_usd ?? null, feesGhs: f.fees_ghs ?? null, feeAmount: f.fee_amount != null ? Number(f.fee_amount) : null, feeCurrency: f.fee_currency || '', entryNote: f.entry_note || '', mastersFormat: f.masters_format || '', entryQualification: f.entry_qualification || '', minDegreeClass: f.min_degree_class || '', minGpa: f.min_gpa != null ? Number(f.min_gpa) : null, grePolicy: f.gre_policy || '', minGre: f.min_gre ?? null, credentialEval: f.credential_eval || '', durationYears: f.duration_years ?? null,
    satPolicy: f.sat_policy || '', minWassceGrade: f.min_wassce_grade || '', minIelts: f.min_ielts != null ? Number(f.min_ielts) : null, minToefl: f.min_toefl ?? null, minDuolingo: f.min_duolingo ?? null,
    englishTestWaiver: !!f.english_test_waiver, foundationAvailable: !!f.foundation_available, verified: !!f.verified,
    requirements: (f.program_requirements || []).map((r) => ({ subject: r.subject, minGrade: r.min_grade })),
    cutoffAggregate: latest?.cutoff_aggregate ?? null, cutoffYear: latest?.year ?? null,
    satLow: latest?.sat_low ?? null, satHigh: latest?.sat_high ?? null,
  }
}


// One programme with all the ways it is offered at its school (copied from the web).
export async function getProgramGroup(id) {
  const head = await supabase.from('programs_summary').select('id, school_id, name, level').eq('id', id).maybeSingle()
  if (head.error) throw new Error('Could not load the program.')
  if (!head.data) return null
  const school = await getSchool(head.data.school_id)
  let q = supabase.from('programs').select('*, program_requirements(subject, min_grade), program_cutoffs(year, cutoff_aggregate, sat_low, sat_high)').eq('school_id', head.data.school_id).eq('name', head.data.name)
  q = head.data.level ? q.eq('level', head.data.level) : q.is('level', null)
  const { data, error } = await q
  if (error) throw new Error('Could not load the program details.')
  return { school, variants: (data || []).map((f) => mapFull(f, school)) }
}
