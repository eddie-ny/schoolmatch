// DATA LAYER.
// Auth, profile, results and documents now talk to Supabase.
// The catalogue and the eligibility check both live in Supabase.
// Payments are not wired yet (step 6): the browser can never write subscriptions.

import { supabase } from './supabase'
import { CORE_SUBJECTS } from './constants'

const fail = (error, fallback) => {
  if (error) throw new Error(friendly(error) || fallback)
}

function friendly(error) {
  const m = (error.message || '').toLowerCase()
  if (m.includes('invalid login')) return 'Wrong email or password.'
  if (m.includes('email not confirmed')) return 'Please confirm your email first. Check your inbox for the link.'
  if (m.includes('rate limit') || m.includes('too many')) return 'Too many attempts. Please wait a few minutes and try again.'
  if (m.includes('password') && m.includes('characters')) return 'Password is too short.'
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
  }
  if (isMinorFromDob(form.dateOfBirth)) {
    meta.parent_name = form.parentName
    meta.parent_phone = form.parentPhone
    meta.parent_email = form.parentEmail
  }
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: { data: meta, emailRedirectTo: window.location.origin },
  })
  fail(error, 'Could not create your account.')
  return { needsConfirm: !data.session }
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

// Builds the user object the pages expect, from several tables. Every read is limited by
// row-level security, so a student only ever gets their own rows.
export async function getCurrentUser() {
  const { data: sess } = await supabase.auth.getSession()
  const uid = sess.session?.user?.id
  if (!uid) return null

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
  if (!p) return null // profile row is created by the signup trigger; should always exist

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
    role: adm.data ? 'admin' : 'student',
    createdAt: p.created_at,
    trialEndsAt: p.trial_ends_at,
    profile: {
      shsAttended: p.shs_attended || '',
      shsProgram: p.shs_program || '',
      fundingType: p.funding_type || '',
      desiredPrograms: p.desired_programs || '',
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
    })
    .eq('id', userId)
  fail(error, 'Could not save your profile.')
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

export async function loadCatalog() {
  const quiet = (q) => q.then((r) => (r.error ? { data: [] } : r)) // no access to the full tables is normal, not an error
  const [sS, sP, sC, fS, fP, fC] = await Promise.all([
    supabase.from('schools_summary').select('*'),
    supabase.from('programs_summary').select('*'),
    supabase.from('scholarships_summary').select('*'),
    quiet(supabase.from('schools').select('*')),
    quiet(supabase.from('programs').select('*, program_requirements(subject, min_grade), program_cutoffs(year, cutoff_aggregate, sat_low, sat_high)')),
    quiet(supabase.from('scholarships').select('*')),
  ])
  fail(sS.error || sP.error || sC.error, 'Could not load the catalogue.')

  const fullSchools = Object.fromEntries((fS.data || []).map((x) => [x.id, x]))
  const fullPrograms = Object.fromEntries((fP.data || []).map((x) => [x.id, x]))
  const fullSch = Object.fromEntries((fC.data || []).map((x) => [x.id, x]))

  const schools = sS.data.map((x) => {
    const f = fullSchools[x.id] || x
    return { id: x.id, name: x.name, country: x.country, type: x.type, city: x.city, website: f.website || '', category: f.category || '', verified: x.verified, demo: x.demo }
  })
  const schoolById = Object.fromEntries(schools.map((x) => [x.id, x]))

  const programs = sP.data.map((x) => {
    const f = fullPrograms[x.id]
    const school = schoolById[x.school_id]
    const latest = [...(f?.program_cutoffs || [])].sort((a, b) => b.year - a.year)[0]
    return {
      id: x.id, schoolId: x.school_id, schoolName: school?.name || '', name: x.name, level: x.level, field: x.field, demo: x.demo,
      international: school ? !isLocalCountry(school.country) : false,
      feesUsd: f?.fees_usd ?? null, durationYears: f?.duration_years ?? null,
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
      level: f.level || '', minAggregate: f.min_aggregate ?? null, minSat: f.min_sat ?? null,
      criteria: f.criteria || '', deadline: f.deadline || '', link: f.link || '',
    }
  })
  return { schools, programs, scholarships }
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
      const row = { name: r.name, country: r.country, type: clean(r.type), category: clean(r.category), city: clean(r.city), website: clean(r.website), verified: !!r.verified }
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
        school_id: sid, name: r.name, level: clean(r.level), field: clean(r.field), fees_usd: r.feesUsd, duration_years: r.durationYears,
        english_test_waiver: !!r.englishTestWaiver, foundation_available: !!r.foundationAvailable, verified: !!r.verified,
      }
      const { data: found, error: e1 } = await supabase.from('programs').select('id').eq('school_id', sid).eq('name', r.name).maybeSingle()
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
  const [{ data: progs, error: e1 }, { data: schools, error: e2 }] = await Promise.all([
    supabase.from('programs_summary').select('id, school_id, name, level, field, demo'),
    supabase.from('schools_summary').select('id, name, country'),
  ])
  fail(e1 || e2, 'Could not load programs.')
  const byId = Object.fromEntries(schools.map((x) => [x.id, x]))
  return progs.map((p) => ({
    id: p.id, name: p.name, field: p.field, level: p.level, demo: p.demo,
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

// ---------- Admin ----------
// Row-level security lets only admins read every profile and subscription.
export async function listUsers() {
  const [p, s] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email, phone, is_minor, trial_ends_at, created_at, profile_complete').order('created_at', { ascending: false }),
    supabase.from('subscriptions').select('user_id, plan, status, expires_at'),
  ])
  fail(p.error, 'Could not load users.')
  const subs = Object.fromEntries((s.data || []).map((x) => [x.user_id, x]))
  return (p.data || []).map((u) => ({
    id: u.id,
    fullName: u.full_name,
    email: u.email,
    phone: u.phone,
    isMinor: u.is_minor,
    role: 'student',
    createdAt: u.created_at,
    trialEndsAt: u.trial_ends_at,
    profileComplete: u.profile_complete,
    subscription: subs[u.id] ? { plan: subs[u.id].plan, status: subs[u.id].status, expiresAt: subs[u.id].expires_at } : null,
  }))
}
