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
