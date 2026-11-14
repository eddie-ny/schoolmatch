// DATA LAYER for the phone app. Same server calls as the web app (src/lib/api.js in the web repo).
// Search and eligibility rules live in the database, so the app gets the same answers as the website.

import { supabase } from './supabase'
import { PASSWORD_RULE, isMinorFromDob } from './validation'
import { CORE_SUBJECTS, SITE } from './constants'

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

// Sends the reset email. The link opens the website's reset page in the phone's browser, where the new password is set.
export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${SITE}/reset-password` })
  fail(error, 'Could not send the reset email.')
}

export async function signOut() {
  // 'local' ends this phone's session without waiting on other devices.
  await supabase.auth.signOut({ scope: 'local' })
}

// ---------- Two-step verification (authenticator app) ----------
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

// Turn two-step verification on: returns the setup key and the otpauth link for the authenticator app.
export async function mfaStartEnroll() {
  // Remove any half-finished setup first, so repeated tries do not pile up.
  const { data: list } = await supabase.auth.mfa.listFactors()
  for (const f of (list?.all || []).filter((x) => x.status === 'unverified')) await supabase.auth.mfa.unenroll({ factorId: f.id })
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Authenticator app' })
  fail(error, 'Could not start setup.')
  return { factorId: data.id, secret: data.totp.secret, uri: data.totp.uri }
}

export async function mfaRemove(factorId) {
  const { error } = await supabase.auth.mfa.unenroll({ factorId })
  fail(error, 'Could not turn off two-step verification.')
}

export async function setNewPassword(password) {
  const { error } = await supabase.auth.updateUser({ password })
  fail(error, 'Could not update your password.')
}

// Accounts are never deleted. This disables the account and keeps the records.
export async function closeMyAccount() {
  const { error } = await supabase.rpc('close_my_account')
  fail(error, 'Could not close your account.')
}

export async function saveAccount(userId, { fullName, phone }) {
  const { error } = await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', userId)
  fail(error, 'Could not save your details.')
}

export async function saveProfile(userId, profile) {
  const base = {
    shs_attended: profile.shsAttended,
    shs_program: profile.shsProgram,
    funding_type: profile.fundingType || null,
    desired_programs: profile.desiredPrograms,
    gender: profile.gender || null,
  }
  let { error } = await supabase.from('profiles').update({ ...base, study_level: profile.studyLevel || null, study_field: profile.studyField || null }).eq('id', userId)
  // If the database does not have the study columns yet, save everything else so the student is not blocked.
  if (error && (/study_(level|field)/.test(error.message || '') || /permission denied/i.test(error.message || ''))) ({ error } = await supabase.from('profiles').update(base).eq('id', userId))
  fail(error, 'Could not save your profile.')
}

// ---------- Scholarships ----------
// Everyone reads the summary list. The details (criteria, deadline, link) come from the full table, which the database only opens to people with full access.
export async function listScholarships() {
  return retrying(async () => {
    // The database returns at most 1000 rows a request, so read page after page until a short page comes back.
    const data = []
    for (let from = 0; ; from += 1000) {
      const r = await supabase.from('scholarships_summary').select('id, name, funder, country, funding_type, verified, demo, gender, school_id').order('id').range(from, from + 999)
      if (r.error) throw new Error(r.error.message || 'Could not load scholarships.')
      data.push(...(r.data || []))
      if ((r.data || []).length < 1000) break
    }
    const ids = [...new Set((data || []).map((x) => x.school_id).filter(Boolean))]
    const schools = {}
    for (let i = 0; i < ids.length; i += 60) {
      const r = await supabase.from('schools_summary').select('id, name, country, logo_url').in('id', ids.slice(i, i + 60))
      for (const x of r.data || []) schools[x.id] = x
    }
    return (data || []).map((x) => ({
      id: x.id, name: x.name, funder: x.funder, country: x.country, fundingType: x.funding_type, verified: x.verified, demo: x.demo, gender: x.gender || null,
      schoolId: x.school_id || null, schoolName: schools[x.school_id]?.name || '', schoolLogo: schools[x.school_id]?.logo_url || '',
    }))
  })
}

export async function getScholarship(id) {
  const sum = await supabase.from('scholarships_summary').select('id, name, funder, country, funding_type, verified, demo, gender, school_id').eq('id', id).maybeSingle()
  fail(sum.error, 'Could not load this scholarship.')
  if (!sum.data) return null
  const x = sum.data
  const f = (await supabase.from('scholarships').select('*').eq('id', id).maybeSingle()).data || {}
  let school = null
  if (x.school_id) school = (await supabase.from('schools_summary').select('id, name, country, logo_url').eq('id', x.school_id).maybeSingle()).data || null
  return {
    id: x.id, name: x.name, funder: x.funder, country: x.country, fundingType: x.funding_type, verified: x.verified, demo: x.demo, gender: x.gender || null,
    schoolId: x.school_id || null, schoolName: school?.name || '', schoolLogo: school?.logo_url || '', field: f.field || '', sourceUrl: f.source_url || '', awardNote: f.award_note || '',
    level: f.level || '', minAggregate: f.min_aggregate ?? null, minSat: f.min_sat ?? null, criteria: f.criteria || '', deadline: f.deadline || '', link: f.link || '',
  }
}

// ---------- Interested (hearted programs) ----------
// Every way of studying one program at one school (regular, fee-paying, distance...). A heart on a list card saves all of them.
export async function programVariantIds({ id, schoolId, name, level }) {
  let q = supabase.from('programs_summary').select('id').eq('school_id', schoolId).eq('name', eqVal(name))
  q = level ? q.eq('level', level) : q
  const { data, error } = await q
  fail(error, 'Could not read this program.')
  const ids = (data || []).map((x) => x.id)
  return ids.length ? ids : [id]
}

export async function listSavedIds() {
  const { data, error } = await supabase.from('saved_programs').select('program_id')
  fail(error, 'Could not load your interested list.')
  return (data || []).map((x) => x.program_id)
}
export async function setSaved(programId, on) {
  const { data: sess } = await supabase.auth.getSession()
  const uid = sess?.session?.user?.id
  if (!uid) throw new Error('Please sign in first.')
  const q = on
    ? supabase.from('saved_programs').upsert({ user_id: uid, program_id: programId }, { onConflict: 'user_id,program_id', ignoreDuplicates: true })
    : supabase.from('saved_programs').delete().eq('user_id', uid).eq('program_id', programId)
  const { error } = await q
  fail(error, 'Could not update your interested list.')
}

// Name, level, field and school for a list of program ids (the hearted ones). Reads the summary views, which every signed-in account can read,
// so the Interested list also works for accounts without full access.
export async function getProgramsFull(ids) {
  const progs = []
  for (let i = 0; i < ids.length; i += 80) {
    const { data, error } = await supabase.from('programs_summary').select('id, school_id, name, level, field, demo, mode, campus').in('id', ids.slice(i, i + 80))
    fail(error, 'Could not load the programs.')
    progs.push(...(data || []))
  }
  const sids = [...new Set(progs.map((p) => p.school_id))]
  const schools = {}
  for (let i = 0; i < sids.length; i += 60) {
    const r = await supabase.from('schools_summary').select('id, name, country').in('id', sids.slice(i, i + 60))
    for (const x of r.data || []) schools[x.id] = x
  }
  return progs.map((p) => ({ id: p.id, schoolId: p.school_id, schoolName: schools[p.school_id]?.name || '', name: p.name, level: p.level, field: p.field, demo: p.demo, mode: p.mode || 'Regular', campus: p.campus || '' }))
}

// The signed-in student, or null. With two-step verification on, the database hides the profile until the code is entered,
// so a missing profile plus "aal1 -> aal2" means a code is still owed.
export async function getCurrentUser() {
  const { data: sess } = await supabase.auth.getSession()
  const uid = sess.session?.user?.id
  if (!uid) return null
  const [prof, parent, sub, adm, ext] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email, phone, date_of_birth, is_minor, trial_ends_at, disabled_at').eq('id', uid).maybeSingle(),
    supabase.from('parent_contacts').select('confirmed_at').eq('student_id', uid).maybeSingle(),
    supabase.from('subscriptions').select('plan, status, expires_at').eq('user_id', uid).maybeSingle(),
    supabase.from('admin_users').select('role').eq('user_id', uid).maybeSingle(),
    supabase.from('profiles').select('gender, shs_attended, shs_program, funding_type, desired_programs, study_level, study_field').eq('id', uid).maybeSingle(),
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
    profile: { gender: ext.data?.gender || '', shsAttended: ext.data?.shs_attended || '', shsProgram: ext.data?.shs_program || '', fundingType: ext.data?.funding_type || '', desiredPrograms: ext.data?.desired_programs || '', studyLevel: ext.data?.study_level || '', studyField: ext.data?.study_field || '' },
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
    supabase.from('schools').select('website, image_url, image_credit, logo_credit, description, description_credit, admission_info, admission_link, admission_checked').eq('id', id).maybeSingle(),
  ])
  if (s.error) throw new Error('Could not load the school.')
  const x = s.data && { ...s.data, ...(f.data || {}) }
  return x && ({ id: x.id, name: x.name, country: x.country, type: x.type, city: x.city, website: x.website || '', category: x.category || '', logoUrl: x.logo_url || '', verified: x.verified, demo: x.demo, programCount: x.program_count ?? 0, imageUrl: x.image_url || '', imageCredit: x.image_credit || '', logoCredit: x.logo_credit || '', description: x.description || '', descriptionCredit: x.description_credit || '' , admission: x.admission_info || null, admissionLink: x.admission_link || '', admissionChecked: x.admission_checked || ''})
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
// PostgREST reads a value that starts with a double quote as a quoted string, so wrap and escape such names.
const eqVal = (v) => (/["\\]/.test(v) ? `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : v)
export async function getProgramGroup(id) {
  const head = await supabase.from('programs_summary').select('id, school_id, name, level').eq('id', id).maybeSingle()
  if (head.error) throw new Error('Could not load the program.')
  if (!head.data) return null
  const school = await getSchool(head.data.school_id)
  let q = supabase.from('programs').select('*, program_requirements(subject, min_grade), program_cutoffs(year, cutoff_aggregate, sat_low, sat_high)').eq('school_id', head.data.school_id).eq('name', eqVal(head.data.name))
  q = head.data.level ? q.eq('level', head.data.level) : q.is('level', null)
  const { data, error } = await q
  if (error) throw new Error('Could not load the program details.')
  let rows = data || []
  // Summary-only accounts cannot read the full table, so show the summary facts and let the screen lock the rest.
  if (!rows.length) {
    let s = supabase.from('programs_summary').select('id, school_id, name, level, field, demo, mode, campus').eq('school_id', head.data.school_id).eq('name', eqVal(head.data.name))
    s = head.data.level ? s.eq('level', head.data.level) : s.is('level', null)
    const sum = await s
    if (sum.error) throw new Error('Could not load the program details.')
    rows = sum.data || []
  }
  return { school, variants: rows.map((f) => mapFull(f, school)) }
}

// ---------- Eligibility (step 7, copied from the web) ----------

// Every row of a table, 1000 at a time, with one quick retry when the database is busy.
async function fetchAll(table, columns, filter = (q) => q) {
  let first = await filter(supabase.from(table).select(columns, { count: 'exact' })).order('id').range(0, 999)
  if (first.error && /timeout|500|internal|gateway/i.test(`${first.error.message} ${first.error.code}`)) {
    await new Promise((r) => setTimeout(r, 700))
    first = await filter(supabase.from(table).select(columns, { count: 'exact' })).order('id').range(0, 999)
  }
  if (first.error) return { data: [], error: first.error }
  const rows = first.data
  const step = rows.length
  const total = first.count ?? step
  if (step === 0 || total <= step) return { data: rows, error: null }
  const jobs = []
  for (let from = step; from < total; from += step) jobs.push(filter(supabase.from(table).select(columns)).order('id').range(from, from + step - 1))
  const pages = await Promise.all(jobs)
  const bad = pages.find((p) => p.error)
  if (bad) return { data: [], error: bad.error }
  return { data: rows.concat(...pages.map((p) => p.data)), error: null }
}

// Local (Ghana) program names for the eligibility picker. Only the teaser columns, which every account may read.
export async function listEligibilityPrograms() {
  const ghana = (q) => q.ilike('school_country', 'ghana')
  const { data: progs, error } = await fetchAll('programs_summary', 'id, school_id, name, level, field, group_name, entry_qualification', ghana)
  fail(error, 'Could not load programs.')
  return progs.map((p) => ({ id: p.id, name: p.name, group: p.group_name || p.name, field: p.field, level: p.level, entryQualification: p.entry_qualification || '' }))
}

// The eligibility maths and the cut-offs live on the server. The app only sends grades and gets labels back.
export async function checkEligibility({ programName, scope, mode, grades, electives, sat }) {
  const { data, error } = await supabase.rpc('check_eligibility', {
    p_program_name: programName, p_scope: scope, p_mode: mode,
    p_grades: grades, p_electives: electives, p_sat: sat ? Number(sat) : null,
  })
  fail(error, 'Could not check eligibility.')
  return data
}

// The WASSCE results saved from the website or the app, or null.
export async function getMyResults(userId) {
  const { data, error } = await supabase.from('results').select('kind, sat_score, result_grades(subject, subject_type, grade)').eq('student_id', userId).eq('exam', 'WASSCE').maybeSingle()
  if (error || !data) return null
  const grades = {}
  const electives = []
  for (const g of data.result_grades || []) {
    grades[g.subject] = g.grade
    if (g.subject_type === 'elective') electives.push(g.subject)
  }
  return { mode: data.kind, grades, electives, sat: data.sat_score ?? '' }
}

export async function saveResults(userId, { mode, grades, electives, sat }) {
  const { data: row, error } = await supabase
    .from('results')
    .upsert({ student_id: userId, exam: 'WASSCE', kind: mode, sat_score: sat ? Number(sat) : null }, { onConflict: 'student_id,exam' })
    .select('id')
    .single()
  fail(error, 'Could not save your results.')
  const del = await supabase.from('result_grades').delete().eq('result_id', row.id)
  fail(del.error, 'Could not save your results.')
  const rows = Object.entries(grades).map(([subject, grade]) => ({ result_id: row.id, subject, subject_type: CORE_SUBJECTS.includes(subject) ? 'core' : 'elective', grade }))
  if (rows.length) fail((await supabase.from('result_grades').insert(rows)).error, 'Could not save your grades.')
}
