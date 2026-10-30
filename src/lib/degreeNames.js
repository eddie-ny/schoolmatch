// Spells out degree short forms for plain reading: "BSc Nursing" becomes "Bachelor of Science in Nursing".
const FULL = {
  bsc: 'Bachelor of Science', ba: 'Bachelor of Arts', bed: 'Bachelor of Education', btech: 'Bachelor of Technology', beng: 'Bachelor of Engineering',
  bba: 'Bachelor of Business Administration', bcom: 'Bachelor of Commerce', llb: 'Bachelor of Laws', bpharm: 'Bachelor of Pharmacy', bfa: 'Bachelor of Fine Arts',
  barch: 'Bachelor of Architecture', bmus: 'Bachelor of Music', bsn: 'Bachelor of Science in Nursing', bmls: 'Bachelor of Medical Laboratory Science', bdiv: 'Bachelor of Divinity',
  msc: 'Master of Science', ma: 'Master of Arts', med: 'Master of Education', mphil: 'Master of Philosophy', mba: 'Master of Business Administration',
  meng: 'Master of Engineering', mtech: 'Master of Technology', mph: 'Master of Public Health', llm: 'Master of Laws', mfa: 'Master of Fine Arts', mcom: 'Master of Commerce',
  mpa: 'Master of Public Administration', msw: 'Master of Social Work', phd: 'Doctor of Philosophy', dba: 'Doctor of Business Administration',
  hnd: 'Higher National Diploma', dip: 'Diploma', cert: 'Certificate',
}

export function fullDegreeName(name) {
  if (!name) return name
  const m = name.match(/^(\S+)\s*(.*)$/)
  if (!m) return name
  const full = FULL[m[1].replace(/[.\-]/g, '').toLowerCase()]
  if (!full) return name
  const rest = m[2].replace(/^in\s+/i, '').trim()
  return rest ? `${full} in ${rest}` : full
}
