// Shared constants. Subject names here must match the names used in program requirements.

export const GRADES = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9']

export const gradeToNum = (g) => {
  const i = GRADES.indexOf(g)
  return i === -1 ? null : i + 1
}

export const CORE_SUBJECTS = [
  'English Language',
  'Core Mathematics',
  'Integrated Science',
  'Social Studies',
]

export const ELECTIVE_SUBJECTS = [
  'Elective Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Geography',
  'History',
  'Government',
  'Literature in English',
  'Financial Accounting',
  'Business Management',
  'French',
  'Information and Communication Technology',
  'Applied Electricity',
  'Electronics',
  'Technical Drawing',
]

export const SHS_PROGRAMS = [
  'General Science',
  'General Arts',
  'Business',
  'Visual Arts',
  'Home Economics',
  'Agriculture',
  'Technical',
]

export const PLANS = [
  { id: '1m', label: '1 month', months: 1, priceUsd: null },
  { id: '3m', label: '3 months', months: 3, priceUsd: null },
  { id: '6m', label: '6 months', months: 6, priceUsd: null },
  { id: '1y', label: '1 year', months: 12, priceUsd: null, note: 'Discounted' },
]

export const TRIAL_HOURS = 24

// Eligibility label thresholds (aggregate difference = student aggregate minus cut-off, lower is better).
// The spec gives the labels but not exact numbers, so these are assumptions the client should confirm.
export const LABEL_RULES = {
  strongMatchAtLeast: 3, // student is 3+ points better than the cut-off
  goodChanceWithin: 2, // from 2 points better up to equal
  worthATryUpTo: 3, // up to 3 points worse
}

export const DISCLAIMER =
  'This is guidance, not a guarantee of admission. Always confirm requirements with the school.'

// Fields of study shown on the home page and used as filters.
// Programs carry a free-text "field"; these are the groups students pick from.
export const FIELDS = [
  { id: 'Computing', blurb: 'Computer science, IT, data' },
  { id: 'Engineering', blurb: 'Civil, electrical, mechanical' },
  { id: 'Business', blurb: 'Management, finance, marketing' },
  { id: 'Health', blurb: 'Medicine, nursing, pharmacy' },
  { id: 'Science', blurb: 'Physics, chemistry, biology' },
  { id: 'Arts', blurb: 'Humanities, languages, design' },
  { id: 'Law', blurb: 'Law and public policy' },
  { id: 'Education', blurb: 'Teaching and development' },
  { id: 'Agriculture', blurb: 'Farming, food and natural resources' },
  { id: 'Social Sciences', blurb: 'Economics, development, policy' },
]

// International schools, programs and scholarships are shown everywhere (filters, Study Abroad page, eligibility scope).
// Set this to false to hide them and run the site as local (Ghana) only.
export const SHOW_INTERNATIONAL = true

// Digits in the email code. Supabase sent 8 on 11 Nov, then the owner set Email OTP Length to 6. Keep this in step with that Supabase setting.
export const OTP_LENGTH = 6

// How a new account confirms its email address.
//   false = the email holds a link (works with Supabase's default email template).
//   true  = the email holds a code the person types in. Switch to true ONLY after custom SMTP is set up in Supabase
//           and the "Confirm signup" template contains {{ .Token }} (see docs/EMAIL-TEMPLATES.md). With the default
//           template this would show a code box that no email ever fills.
export const CONFIRM_BY_CODE = true

// First-degree classes, best first. Used by the masters checker.
export const DEGREE_CLASSES = ['First Class', 'Second Class Upper', 'Second Class Lower', 'Third Class', 'Pass']
