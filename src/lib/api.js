// DATA LAYER.
// Auth, profile, results and documents now talk to Supabase.
// The catalogue and the eligibility check both live in Supabase.
// Payments are not wired yet (step 6): the browser can never write subscriptions.

import { supabase } from './supabase'
import { CORE_SUBJECTS } from './constants'
import { logoFor } from './logos'

export const PASSWORD_RULE = 'Use at least 8 characters with upper case, lower case and numbers.'
export const passwordProblem = (pw) =>
  pw.length >= 8 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /[0-9]/.test(pw) ? '' : PASSWORD_RULE

const fail = (error, fallback) => {
  if (error) throw new Error(friendly(error) || fallback)
}

function friendly(error) {
  const m = (error.message || '').toLowerCase()
  const code = error.code || ''
  if (m.includes('invalid login')) return 'Wrong email or password.'
  if (m.includes('email not confirmed')) return 'Please confirm your email first. Check your inbox for the link.'
  // The email limit is shared by the whole site, not by one account, so say that plainly.
  if (code === 'over_email_send_rate_limit' || m.includes('email rate limit')) {
    return 'We cannot send an email or reset link right now because the email service has its limits. Please try again in an hour.'
  }
  if (m.includes('failed to fetch') || m.includes('networkerror') || m.includes('network request failed') || error.name === 'AuthRetryableFetchError') {
    return 'Could not reach the server. Check your internet connection and try again. If you were creating an account, check your email first, it may have gone through.'
  }
  if (code === 'over_request_rate_limit' || m.includes('rate limit') || m.includes('too many')) return 'Too many attempts from this connection. Please wait a few minutes and try again.'
  if (m.includes('banned')) return 'This account is closed or disabled. Contact support if you think this is a mistake.'
  if (m.includes('at least one character of each')) return PASSWORD_RULE
  if (m.includes('password') && m.includes('characters')) return 'Password is too short. ' + PASSWORD_RULE
  if (m.includes('should be different')) return 'Your new password must be different from the old one.'
  return error.message
}

export function isMinorFromDob(dob) {
  if (!dob) return false
  const d = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--
  return age < 18
}

// ---------- Auth ----------

// Returns { needsConfirm: true } when the project requires email confirmation.
export async function signUp(form) {
  const meta = {
    full_name: form.fullName,
    phone: form.phone,
    date_of_birth: form.dateOfBirth,
    gender: form.gender || '',
  }
  if (isMinorFromDob(form.dateOfBirth)) {
    meta.parent_name = form.parentName
    meta.parent_phone = form.parentPhone
    meta.parent_email = form.parentEmail
  }
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: { data: meta, emailRedirectTo: `${window.location.origin}/login` },
  })
  fail(error, 'Could not create your account.')
  return { needsConfirm: !data.session }
}

export async function resendConfirmation(email) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${window.location.origin}/login` },
  })
  fail(error, 'Could not send the email. Please wait a minute and try again.')
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  fail(error, 'Could not sign in.')
}

export async function signOut() {
  // 'local' ends this browser's session without waiting on other devices.
  await supabase.auth.signOut({ scope: 'local' })
}

export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  fail(error, 'Could not send the reset email.')
}

export async function setNewPassword(password) {
  const { error } = await supabase.auth.updateUser({ password })
  fail(error, 'Could not update your password.')
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

export async function mfaStartEnroll() {
  // Remove any half-finished setup first, so repeated tries do not pile up.
  const { data: list } = await supabase.auth.mfa.listFactors()
  for (const f of (list?.all || []).filter((x) => x.status === 'unverified')) await supabase.auth.mfa.unenroll({ factorId: f.id })
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Authenticator app' })
  fail(error, 'Could not start setup.')
  return { factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret }
}

export async function mfaVerifyCode(factorId, code) {
  const ch = await supabase.auth.mfa.challenge({ factorId })
  fail(ch.error, 'Could not check the code.')
  const v = await supabase.auth.mfa.verify({ factorId, challengeId: ch.data.id, code: code.replace(/\s/g, '') })
  if (v.error) throw new Error('That code is not right or has expired. Try the newest code from your app.')
}

export async function mfaRemove(factorId) {
  const { error } = await supabase.auth.mfa.unenroll({ factorId })
  fail(error, 'Could not turn off two-step verification.')
}

// Builds the user object the pages expect, from several tables. Every read is limited by
// row-level security, so a student only ever gets their own rows.
export async function getCurrentUser() {
  const { data: sess } = await supabase.auth.getSession()
  const uid = sess.session?.user?.id
  if (!uid) return null

  // If a super admin invited this email as staff, this gives them the role (needs a confirmed email).
  try { await supabase.rpc('claim_staff_invite') } catch { /* not an invited person */ }

  const [prof, parent, sub, docs, res, adm] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', uid).maybeSingle(),
    supabase.from('parent_contacts').select('name, phone, email, confirmed_at').eq('student_id', uid).maybeSingle(),
    supabase.from('subscriptions').select('*').eq('user_id', uid).maybeSingle(),
    supabase.from('documents').select('id, doc_type, file_path, uploaded_at').eq('student_id', uid).order('uploaded_at'),
    supabase.from('results').select('id, kind, exam, sat_score, result_grades(subject, subject_type, grade)').eq('student_id', uid).eq('exam', 'WASSCE').maybeSingle(),
    supabase.from('admin_users').select('role').eq('user_id', uid).maybeSingle(),
  ])
  if (prof.error) throw new Error(prof.error.message)
  const p = prof.data
  if (!p) {
    // With two-step verification on, the database hides everything until the code is entered.
    const m = await mfaState()
    if (m.current === 'aal1' && m.next === 'aal2') {
      return { id: uid, mfaPending: true, fullName: '', email: sess.session.user.email, phone: '', role: 'student', documents: [], profile: {}, subscription: null, results: null, parent: null }
    }
    return null // profile row is created by the signup trigger; should always exist
  }

  let results = null
  if (res.data) {
    const grades = {}
    const electives = []
    for (const g of res.data.result_grades || []) {
      grades[g.subject] = g.grade
      if (g.subject_type === 'elective') electives.push(g.subject)
    }
    results = { mode: res.data.kind, grades, electives, sat: res.data.sat_score ?? '' }
  }

  return {
    id: p.id,
    fullName: p.full_name,
    email: p.email,
    phone: p.phone,
    dateOfBirth: p.date_of_birth,
    isMinor: p.is_minor,
    disabled: !!p.disabled_at,
    role: adm.data ? (adm.data.role === 'support' ? 'support' : 'admin') : 'student',
    staffRole: adm.data ? adm.data.role : null, // 'owner' (super admin), 'admin' or 'support'
    createdAt: p.created_at,
    trialEndsAt: p.trial_ends_at,
    profile: {
      shsAttended: p.shs_attended || '',
      shsProgram: p.shs_program || '',
      fundingType: p.funding_type || '',
      desiredPrograms: p.desired_programs || '',
      gender: p.gender || '',
    },
    parent: parent.data ? { name: parent.data.name, phone: parent.data.phone, email: parent.data.email, confirmedAt: parent.data.confirmed_at } : null,
    subscription: sub.data ? { plan: sub.data.plan, status: sub.data.status, expiresAt: sub.data.expires_at, autoRenew: sub.data.auto_renew } : null,
    documents: (docs.data || []).map((d) => ({ id: d.id, name: d.file_path.split('/').pop(), path: d.file_path, uploadedAt: d.uploaded_at })),
    results,
  }
}

// ---------- Profile ----------
export async function saveProfile(userId, profile) {
  const { error } = await supabase
    .from('profiles')
    .update({
      shs_attended: profile.shsAttended,
      shs_program: profile.shsProgram,
      funding_type: profile.fundingType || null,
      desired_programs: profile.desiredPrograms,
      gender: profile.gender || null,
    })
    .eq('id', userId)
  fail(error, 'Could not save your profile.')
}

export async function saveAccount(userId, { fullName, phone }) {
  const { error } = await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', userId)
  fail(error, 'Could not save your details.')
}

// Accounts are never deleted. This disables the account and keeps the records.
export async function closeMyAccount() {
  const { error } = await supabase.rpc('close_my_account')
  fail(error, 'Could not close your account.')
}

export async function setAccountDisabled(userId, disabled, reason) {
  const { error } = await supabase.rpc('admin_set_account_disabled', { p_user: userId, p_disabled: disabled, p_reason: reason || null })
  fail(error, 'Could not update the account.')
}

// ---------- Results ----------
export async function saveResults(userId, { mode, grades, electives, sat }) {
  const { data: row, error } = await supabase
    .from('results')
    .upsert({ student_id: userId, exam: 'WASSCE', kind: mode, sat_score: sat ? Number(sat) : null }, { onConflict: 'student_id,exam' })
    .select('id')
    .single()
  fail(error, 'Could not save your results.')

  const del = await supabase.from('result_grades').delete().eq('result_id', row.id)
  fail(del.error, 'Could not save your results.')

  const rows = Object.entries(grades).map(([subject, grade]) => ({
    result_id: row.id,
    subject,
    subject_type: CORE_SUBJECTS.includes(subject) ? 'core' : 'elective',
    grade,
  }))
  if (rows.length) {
    const ins = await supabase.from('result_grades').insert(rows)
    fail(ins.error, 'Could not save your grades.')
  }
}

// ---------- Documents (private Storage bucket, one folder per student) ----------
export async function uploadDocument(userId, file) {
  const safe = file.name.replace(/[^\w.\- ]+/g, '_')
  const path = `${userId}/${Date.now()}-${safe}`
  const up = await supabase.storage.from('documents').upload(path, file, { contentType: file.type })
  fail(up.error, 'Upload failed.')
  const ins = await supabase.from('documents').insert({ student_id: userId, file_path: path })
  if (ins.error) {
    await supabase.storage.from('documents').remove([path])
    fail(ins.error, 'Could not record the document.')
  }
}

export async function removeDocument(doc) {
  const a = await supabase.storage.from('documents').remove([doc.path])
  fail(a.error, 'Could not delete the file.')
  const b = await supabase.from('documents').delete().eq('id', doc.id)
  fail(b.error, 'Could not delete the record.')
}

// ---------- Catalog (local starter data until step 5) ----------
// ---------- Catalogue (schools, programs, scholarships) ----------
// Everyone can read the teaser columns through the summary views. People with full access (and admins)
// also read the full tables, so the details come back only for them. Row level security decides, not the browser.
const isLocalCountry = (c) => (c || '').toLowerCase() === 'ghana'

// The API returns at most 1000 rows per request. Read the first page (with the total count), then fetch the rest in parallel.
async function fetchAll(table, columns) {
  const first = await supabase.from(table).select(columns, { count: 'exact' }).order('id').range(0, 999)
  if (first.error) return { data: [], error: first.error }
  const rows = first.data
  const step = rows.length
  const total = first.count ?? step
  if (step === 0 || total <= step) return { data: rows, error: null }
  const jobs = []
  for (let from = step; from < total; from += step) {
    jobs.push(supabase.from(table).select(columns).order('id').range(from, from + step - 1))
  }
  const pages = await Promise.all(jobs)
  for (const pg of pages) {
    if (pg.error) return { data: rows, error: pg.error }
    rows.push(...pg.data)
  }
  return { data: rows, error: null }
}

export async function loadCatalog() {
  const quiet = (q) => q.then((r) => (r.error ? { data: [] } : r)) // no access to the full tables is normal, not an error
  const [sS, sP, sC, fS, fP, fC] = await Promise.all([
    supabase.from('schools_summary').select('*'),
    fetchAll('programs_summary', '*'),
    supabase.from('scholarships_summary').select('*'),
    quiet(supabase.from('schools').select('*')),
    quiet(fetchAll('programs', '*, program_requirements(subject, min_grade), program_cutoffs(year, cutoff_aggregate, sat_low, sat_high)')),
    quiet(supabase.from('scholarships').select('*')),
  ])
  fail(sS.error || sP.error || sC.error, 'Could not load the catalogue.')

  const fullSchools = Object.fromEntries((fS.data || []).map((x) => [x.id, x]))
  const fullPrograms = Object.fromEntries((fP.data || []).map((x) => [x.id, x]))
  const fullSch = Object.fromEntries((fC.data || []).map((x) => [x.id, x]))

  const schools = sS.data.map((x) => {
    const f = fullSchools[x.id] || x
    return { id: x.id, name: x.name, country: x.country, type: x.type, city: x.city, website: f.website || '', category: x.category || f.category || '', logoUrl: x.logo_url || logoFor(x.name), verified: x.verified, demo: x.demo }
  })
  const schoolById = Object.fromEntries(schools.map((x) => [x.id, x]))

  const programs = sP.data.map((x) => {
    const f = fullPrograms[x.id]
    const school = schoolById[x.school_id]
    const latest = [...(f?.program_cutoffs || [])].sort((a, b) => b.year - a.year)[0]
    return {
      id: x.id, schoolId: x.school_id, schoolName: school?.name || '', name: x.name, level: x.level, field: x.field, demo: x.demo, mode: x.mode || 'Regular', campus: x.campus || '',
      international: school ? !isLocalCountry(school.country) : false,
      feesUsd: f?.fees_usd ?? null, feesGhs: f?.fees_ghs ?? null, entryNote: f?.entry_note || '', entryQualification: f?.entry_qualification || x.entry_qualification || '', minDegreeClass: f?.min_degree_class || '', durationYears: f?.duration_years ?? null,
      englishTestWaiver: !!f?.english_test_waiver, foundationAvailable: !!f?.foundation_available, verified: !!f?.verified,
      requirements: (f?.program_requirements || []).map((r) => ({ subject: r.subject, minGrade: r.min_grade })),
      cutoffAggregate: latest?.cutoff_aggregate ?? null, cutoffYear: latest?.year ?? null,
      satLow: latest?.sat_low ?? null, satHigh: latest?.sat_high ?? null,
    }
  })

  const scholarships = sC.data.map((x) => {
    const f = fullSch[x.id] || {}
    return {
      id: x.id, name: x.name, funder: x.funder, country: x.country, fundingType: x.funding_type, verified: x.verified, demo: x.demo,
      gender: x.gender ?? f.gender ?? null, // 'female' or 'male' when only that gender can apply
      level: f.level || '', minAggregate: f.min_aggregate ?? null, minSat: f.min_sat ?? null,
      criteria: f.criteria || '', deadline: f.deadline || '', link: f.link || '',
    }
  })
  return { schools, programs, scholarships }
}

// ---------- Interested (hearted programs) ----------
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

export async function listSchools() { return (await loadCatalog()).schools }

// ---------- Admin spreadsheet import (writes to the database; row level security allows admins only) ----------
const CORE = ['English Language', 'Core Mathematics', 'Integrated Science', 'Social Studies']
const clean = (v) => (v === '' || v === undefined ? null : v)

export async function importCatalog(kind, rows) {
  const out = { added: 0, updated: 0, skipped: [] }

  if (kind === 'schools') {
    const { data: existing, error } = await supabase.from('schools').select('id, name')
    fail(error, 'Could not read schools.')
    const byName = Object.fromEntries(existing.map((x) => [x.name.toLowerCase(), x.id]))
    for (const r of rows) {
      if (!r.name || !r.country) { out.skipped.push(r.name || '(no name)'); continue }
      const row = { name: r.name, country: r.country, type: clean(r.type), category: clean(r.category), city: clean(r.city), website: clean(r.website), verified: !!r.verified, ...(r.logoUrl ? { logo_url: clean(r.logoUrl) } : {}) }
      const id = byName[r.name.toLowerCase()]
      const res = id ? await supabase.from('schools').update(row).eq('id', id) : await supabase.from('schools').insert(row)
      fail(res.error, `Could not save ${r.name}.`)
      id ? out.updated++ : out.added++
    }
  }

  if (kind === 'programs') {
    const { data: schools, error } = await supabase.from('schools').select('id, name')
    fail(error, 'Could not read schools.')
    const schoolId = Object.fromEntries(schools.map((x) => [x.name.toLowerCase(), x.id]))
    for (const r of rows) {
      const sid = schoolId[(r.schoolName || '').toLowerCase()]
      if (!sid || !r.name) { out.skipped.push(`${r.name || '(no name)'} (school "${r.schoolName}" not found, import schools first)`); continue }
      const row = {
        school_id: sid, name: r.name, level: clean(r.level), field: clean(r.field), mode: clean(r.mode) || 'Regular', campus: clean(r.campus), fees_usd: r.feesUsd, duration_years: r.durationYears,
        english_test_waiver: !!r.englishTestWaiver, foundation_available: !!r.foundationAvailable, verified: !!r.verified,
      }
      const { data: found, error: e1 } = await supabase.from('programs').select('id').eq('school_id', sid).eq('name', r.name).eq('mode', clean(r.mode) || 'Regular').maybeSingle()
      fail(e1, 'Could not read programs.')
      let pid = found?.id
      if (pid) {
        fail((await supabase.from('programs').update(row).eq('id', pid)).error, `Could not save ${r.name}.`)
        out.updated++
      } else {
        const ins = await supabase.from('programs').insert(row).select('id').single()
        fail(ins.error, `Could not save ${r.name}.`)
        pid = ins.data.id
        out.added++
      }
      // Requirements are replaced by what the sheet says.
      fail((await supabase.from('program_requirements').delete().eq('program_id', pid)).error, 'Could not update requirements.')
      if (r.requirements?.length) {
        const reqs = r.requirements.map((q) => ({ program_id: pid, subject: q.subject, min_grade: q.minGrade, is_core: CORE.includes(q.subject) }))
        fail((await supabase.from('program_requirements').insert(reqs)).error, 'Could not save requirements.')
      }
      // One cut-off row per year, so the history builds up as years are imported.
      if (r.cutoffAggregate != null && r.cutoffYear != null) {
        const cut = { program_id: pid, year: r.cutoffYear, cutoff_aggregate: r.cutoffAggregate, sat_low: r.satLow, sat_high: r.satHigh }
        fail((await supabase.from('program_cutoffs').delete().eq('program_id', pid).eq('year', r.cutoffYear)).error, 'Could not update cut-offs.')
        fail((await supabase.from('program_cutoffs').insert(cut)).error, 'Could not save the cut-off.')
      } else if (r.cutoffAggregate != null) {
        out.skipped.push(`${r.name}: cut-off ignored because cutoff_year is empty`)
      }
    }
  }

  if (kind === 'scholarships') {
    const { data: existing, error } = await supabase.from('scholarships').select('id, name')
    fail(error, 'Could not read scholarships.')
    const byName = Object.fromEntries(existing.map((x) => [x.name.toLowerCase(), x.id]))
    for (const r of rows) {
      if (!r.name) { out.skipped.push('(no name)'); continue }
      const row = {
        name: r.name, funder: clean(r.funder), country: clean(r.country), funding_type: r.fundingType, level: clean(r.level),
        min_aggregate: r.minAggregate, min_sat: r.minSat, criteria: clean(r.criteria), deadline: clean(r.deadline), link: clean(r.link), verified: !!r.verified,
      }
      const id = byName[r.name.toLowerCase()]
      const res = id ? await supabase.from('scholarships').update(row).eq('id', id) : await supabase.from('scholarships').insert(row)
      fail(res.error, `Could not save ${r.name}.`)
      id ? out.updated++ : out.added++
    }
  }
  return out
}

// Removes the made-up sample rows (flagged demo). Real rows are never touched.
export async function deleteDemoData() {
  const { data: progs } = await supabase.from('programs').select('id').eq('demo', true)
  const ids = (progs || []).map((x) => x.id)
  if (ids.length) {
    fail((await supabase.from('program_requirements').delete().in('program_id', ids)).error, 'Could not remove sample data.')
    fail((await supabase.from('program_cutoffs').delete().in('program_id', ids)).error, 'Could not remove sample data.')
    fail((await supabase.from('programs').delete().in('id', ids)).error, 'Could not remove sample data.')
  }
  fail((await supabase.from('schools').delete().eq('demo', true)).error, 'Could not remove sample schools (they may still have real programs).')
  fail((await supabase.from('scholarships').delete().eq('demo', true)).error, 'Could not remove sample scholarships.')
}

// Program names for the eligibility pickers. Only the teaser columns, which visitors may read.
export async function listEligibilityPrograms() {
  // group_name is the common programme name ("Law") shared by every school that offers it. Until the database has it,
  // fall back to the programme's own name so the page keeps working.
  let progsRes = await fetchAll('programs_summary', 'id, school_id, name, level, field, demo, group_name, mode, campus, entry_qualification')
  if (progsRes.error) progsRes = await fetchAll('programs_summary', 'id, school_id, name, level, field, demo, group_name, mode, campus')
  if (progsRes.error) progsRes = await fetchAll('programs_summary', 'id, school_id, name, level, field, demo, group_name')
  if (progsRes.error) progsRes = await fetchAll('programs_summary', 'id, school_id, name, level, field, demo')
  const { data: progs, error: e1 } = progsRes
  const { data: schools, error: e2 } = await supabase.from('schools_summary').select('id, name, country')
  fail(e1 || e2, 'Could not load programs.')
  const byId = Object.fromEntries(schools.map((x) => [x.id, x]))
  return progs.map((p) => ({
    id: p.id, name: p.name, group: p.group_name || p.name, field: p.field, level: p.level, demo: p.demo, mode: p.mode || 'Regular', campus: p.campus || '', entryQualification: p.entry_qualification || '',
    schoolName: byId[p.school_id]?.name || '',
    international: (byId[p.school_id]?.country || '').toLowerCase() !== 'ghana',
  }))
}

// The eligibility maths and the cut-offs live on the server. The browser only sends grades and gets labels back.
export async function checkEligibility({ programName, scope, mode, grades, electives, sat }) {
  const { data, error } = await supabase.rpc('check_eligibility', {
    p_program_name: programName, p_scope: scope, p_mode: mode,
    p_grades: grades, p_electives: electives, p_sat: sat ? Number(sat) : null,
  })
  fail(error, 'Could not check eligibility.')
  return data
}

// Masters: compares the student's first-degree class with the class each school states. No thresholds are guessed.
export async function checkMastersEligibility({ programName, degreeClass, cgpa }) {
  // The CGPA goes along only when the student typed one, so the check works the same for schools that do not ask for it.
  const args = { p_program_name: programName, p_degree_class: degreeClass }
  if (cgpa !== '' && cgpa != null) args.p_cgpa = Number(cgpa)
  const { data, error } = await supabase.rpc('check_masters_eligibility_cgpa', args)
  fail(error, 'Could not check masters eligibility.')
  return data
}

// Top-up programmes: compares the qualification the student holds (a diploma or HND) with the one each school asks for.
export async function checkTopupEligibility({ programName, qualification }) {
  const { data, error } = await supabase.rpc('check_topup_eligibility', { p_program_name: programName, p_qualification: qualification })
  fail(error, 'Could not check top-up eligibility.')
  return data
}

// ---------- Payments (Paystack, through the server function) ----------
// Plan prices from a spreadsheet. The sheet has the price in normal money (for example 49.50); the database keeps
// the smallest unit (pesewas), so we convert here. Existing plans are updated by id, new ids are added.
export async function importPlans(rows) {
  const out = { added: 0, updated: 0, skipped: [] }
  const { data: existing, error } = await supabase.from('plans').select('id')
  fail(error, 'Could not read plans.')
  const have = new Set(existing.map((x) => x.id))
  for (const r of rows) {
    const id = String(r.id || '').trim()
    const price = Number(r.price)
    const months = Number(r.months)
    const currency = String(r.currency || 'GHS').trim().toUpperCase()
    if (!id) { out.skipped.push('(row without id)'); continue }
    if (!Number.isFinite(price) || price <= 0) { out.skipped.push(`${id}: price must be a number above 0`); continue }
    if (!Number.isInteger(months) || months < 1) { out.skipped.push(`${id}: months must be a whole number`); continue }
    if (!/^[A-Z]{3}$/.test(currency)) { out.skipped.push(`${id}: currency must be 3 letters such as GHS`); continue }
    const row = { id, label: (r.label || '').trim() || `${months} months`, months, price_minor: Math.round(price * 100), currency }
    const res = have.has(id)
      ? await supabase.from('plans').update({ label: row.label, months, price_minor: row.price_minor, currency }).eq('id', id)
      : await supabase.from('plans').insert({ ...row, sort: months })
    fail(res.error, `Could not save plan ${id}.`)
    have.has(id) ? out.updated++ : out.added++
  }
  return out
}

export async function listPlans() {
  const { data, error } = await supabase.from('plans').select('id, label, months, price_minor, currency').order('sort')
  fail(error, 'Could not load plans.')
  return data
}

// The server looks up the price itself. The browser only says which plan.
export async function startCheckout(plan) {
  const { data, error } = await supabase.functions.invoke('paystack/init', { body: { plan } })
  if (error) {
    let msg = ''
    try { msg = (await error.context.json()).error } catch { /* not JSON */ }
    throw new Error(msg || 'Could not start the payment. Please try again.')
  }
  return data // { url, reference }
}

export async function verifyPayment(reference) {
  const { data, error } = await supabase.functions.invoke('paystack/verify', { body: { reference } })
  if (error) throw new Error('Could not confirm the payment yet. If you were charged, it will appear shortly.')
  return data.status // activated | already_activated | not_paid | rejected
}

// ---------- Admin ----------
// Row-level security lets only admins read every profile and subscription.
// ---------- Parent confirmation ----------
export async function previewParentLink(token) {
  const { data, error } = await supabase.functions.invoke('parent-confirm/preview', { body: { token } })
  if (error) throw new Error('Could not check this link. Please try again.')
  return data // { state: ok | invalid | used | expired, studentFirstName, parentName }
}
export async function confirmParentLink(token) {
  const { data, error } = await supabase.functions.invoke('parent-confirm/confirm', { body: { token } })
  if (error) throw new Error('Could not record your confirmation. Please try again.')
  return data.state // confirmed | invalid | used | expired
}
// Staff only. Returns a one-time link to give to the parent after checking who they are.
export async function createParentLink(studentId) {
  const { data, error } = await supabase.functions.invoke('parent-confirm/issue', { body: { studentId } })
  if (error) {
    let msg = ''
    try { msg = (await error.context.json()).error } catch { /* not JSON */ }
    throw new Error(msg || 'Could not create the link.')
  }
  return data.url
}
export async function listPendingParents() {
  const [c, p] = await Promise.all([
    supabase.from('parent_contacts').select('student_id, name, phone, email, confirmed_at').is('confirmed_at', null),
    supabase.from('profiles').select('id, full_name, email'),
  ])
  fail(c.error, 'Could not load parent confirmations.')
  const byId = Object.fromEntries((p.data || []).map((x) => [x.id, x]))
  return (c.data || []).map((x) => ({ studentId: x.student_id, parentName: x.name, parentPhone: x.phone, parentEmail: x.email, studentName: byId[x.student_id]?.full_name || '', studentEmail: byId[x.student_id]?.email || '' }))
}

// Admin or super admin, after speaking to the parent: opens the student's account without the link.
export async function acceptParent(studentId) {
  const { error } = await supabase.rpc('admin_accept_parent', { p_student: studentId })
  fail(error, 'Could not accept this confirmation.')
}
// Super admin only.
export async function listStaff() {
  const { data, error } = await supabase.rpc('admin_list_staff')
  fail(error, 'Could not load the team.')
  return (data || []).map((x) => ({ userId: x.user_id, email: x.email, fullName: x.full_name, role: x.role, createdAt: x.created_at }))
}
export async function setStaffRole(email, role) {
  const { error } = await supabase.rpc('admin_set_staff_role', { p_email: email, p_role: role })
  fail(error, 'Could not change the role.')
}
// Super admin: removes a student or staff account for good (a private copy goes to the archive). Needs the database function admin_delete_account.
export async function deleteAccount(userId) {
  // Goes through an edge function so the person's uploaded files are removed from storage too.
  const { data, error } = await supabase.functions.invoke('staff-users/delete-account', { body: { userId } })
  if (error) {
    let msg = ''
    try { msg = (await error.context.json()).error } catch { /* none */ }
    throw new Error(msg || 'Could not delete this account.')
  }
  return data
}
export async function activateAccount(userId) {
  // Staff confirm the email for someone whose confirmation link failed. Goes through an edge function.
  const { data, error } = await supabase.functions.invoke('staff-users/activate-account', { body: { userId } })
  if (error) {
    let msg = ''
    try { msg = (await error.context.json()).error } catch { /* none */ }
    throw new Error(msg || 'Could not activate this account.')
  }
  return data
}
export async function listArchive() {
  const { data, error } = await supabase.rpc('admin_list_archive')
  fail(error, 'Could not load the archive.')
  return (data || []).map((x) => ({ id: x.id, userId: x.original_user_id, email: x.email, fullName: x.full_name, phone: x.phone, staffRole: x.staff_role, deletedAt: x.deleted_at, deletedBy: x.deleted_by, snapshot: x.snapshot || {} }))
}
export async function deleteStaff(userId) {
  const { data, error } = await supabase.rpc('admin_delete_staff', { p_user: userId })
  fail(error, 'Could not delete this staff account.')
  return data
}
// Any staff: edit a student's name and phone.
export async function staffUpdateProfile(userId, fullName, phone) {
  const { error } = await supabase.rpc('staff_update_profile', { p_user: userId, p_full_name: fullName, p_phone: phone })
  fail(error, 'Could not save the changes.')
}
// Any staff: create a student account on the student's behalf. Returns { email, password } once. No subscription is created.
export async function staffCreateStudent(form) {
  const { data, error } = await supabase.functions.invoke('staff-users/create-student', { body: form })
  if (error) {
    let msg = ''
    try { msg = (await error.context.json()).error } catch { /* none */ }
    throw new Error(msg || 'Could not create the account.')
  }
  return data
}
export async function inviteStaff(email, role) {
  const { data, error } = await supabase.rpc('admin_invite_staff', { p_email: email, p_role: role })
  fail(error, 'Could not add this person.')
  return data // 'invited' (no account yet) or 'role_set' (already had an account)
}
export async function listInvites() {
  const { data, error } = await supabase.rpc('admin_list_invites')
  fail(error, 'Could not load invites.')
  return data || []
}
export async function cancelInvite(email) {
  const { error } = await supabase.rpc('admin_cancel_invite', { p_email: email })
  fail(error, 'Could not cancel the invite.')
}
export async function getAdminStats() {
  const { data, error } = await supabase.rpc('admin_stats')
  fail(error, 'Could not load the numbers.')
  return data
}

export async function listAuditLog(limit = 200) {
  const { data, error } = await supabase.from('audit_log').select('id, at, actor_id, actor_role, action, target_user, detail').order('id', { ascending: false }).limit(limit)
  fail(error, 'Could not load the activity log.')
  return data || []
}

export async function listUsers() {
  const [p, s, r, un] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email, phone, is_minor, trial_ends_at, created_at, profile_complete, disabled_at').order('created_at', { ascending: false }),
    supabase.from('subscriptions').select('user_id, plan, status, expires_at'),
    supabase.rpc('list_staff_roles'),
    supabase.rpc('list_unconfirmed_users'),
  ])
  const roles = Object.fromEntries((r.data || []).map((x) => [x.user_id, x.role]))
  const unconfirmed = new Set((un.data || []).map((x) => x.user_id)) // empty if the database function is not installed yet
  fail(p.error, 'Could not load users.')
  const subs = Object.fromEntries((s.data || []).map((x) => [x.user_id, x]))
  return (p.data || []).map((u) => ({
    id: u.id,
    fullName: u.full_name,
    email: u.email,
    phone: u.phone,
    isMinor: u.is_minor,
    role: 'student',
    staffRole: roles[u.id] || null,
    createdAt: u.created_at,
    trialEndsAt: u.trial_ends_at,
    profileComplete: u.profile_complete,
    disabled: !!u.disabled_at,
    unconfirmed: unconfirmed.has(u.id),
    subscription: subs[u.id] ? { plan: subs[u.id].plan, status: subs[u.id].status, expiresAt: subs[u.id].expires_at } : null,
  }))
}
