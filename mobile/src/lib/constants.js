// Same values as the web app (src/lib/constants.js and src/index.css in the web code).

// Digits in the email code. Must match Supabase, Authentication, Email, "Email OTP Length" (6 on 11 Nov).
export const OTP_LENGTH = 6

// Pages of the website that the sign-up form links to.
export const SITE = 'https://jambaconsult.com'

export const colors = {
  orange: '#FFB02E',
  green: '#B2DE2B',
  orangeSoft: '#FFF1D6',
  greenSoft: '#F1FAD3',
  page: '#FBFAF1',
  ink: '#333333',
  orangeInk: '#CC6A00',
  greenInk: '#6B8E0A',
  muted: '#5c5c5c',
  line: '#d9d6c8',
  error: '#b91c1c',
}

// Fields of study (same list and order as the website).
export const FIELDS = ['Computing', 'Engineering', 'Business', 'Health', 'Science', 'Arts', 'Law', 'Education', 'Agriculture', 'Social Sciences']

export const SCHOOLS_PAGE = 12
export const PROGRAMS_PAGE = 20

// WASSCE grades and subjects (same as the website).
export const GRADES = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9']
export const CORE_SUBJECTS = ['English Language', 'Core Mathematics', 'Integrated Science', 'Social Studies']
export const ELECTIVE_SUBJECTS = [
  'Elective Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Geography', 'History', 'Government',
  'Literature in English', 'Financial Accounting', 'Business Management', 'French', 'Information and Communication Technology',
  'Applied Electricity', 'Electronics', 'Technical Drawing',
]
export const DISCLAIMER = 'This is guidance, not a guarantee of admission. Always confirm requirements with the school.'

export const SHS_PROGRAMS = ['General Science', 'General Arts', 'Business', 'Visual Arts', 'Home Economics', 'Agriculture', 'Technical']
