// Logos for schools whose database row has no logo address yet. The file sits in public/logos and is matched by the school's name.
// A logo address saved in the database always wins over this list.
const FILES = {
  'accra technical university': 'atu',
  'bolgatanga technical university': 'bolgatu',
  'cape coast technical university': 'cctu',
  'ghana armed forces college of nursing and midwifery': 'gafcnm',
  'ho technical university': 'htu',
  'koforidua technical university': 'ktu',
  'dr hilla limann technical university': 'dhltu',
  'dr. hilla limann technical university': 'dhltu',
  'kumasi technical university': 'kstu',
  'sunyani technical university': 'stu',
  'takoradi technical university': 'ttu',
  'tamale technical university': 'tatu',
  'public nursing and midwifery training colleges (ministry of health)': 'mohnmtc',
}

export const logoFor = (name) => {
  const f = FILES[String(name || '').trim().toLowerCase()]
  return f ? `/logos/${f}.png` : ''
}
