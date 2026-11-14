// Turns the free text stored for a scholarship into short headed lists, so a student scans it instead of reading a paragraph.
// Works on the text already in the database: labelled parts ("Who is eligible: ...") are split out, and loose text is sorted by sentence.

const LABELS = ['Type', 'Funder', 'Who is eligible', 'Requirements and Ghana eligibility', 'Requirements', 'Ghana or Africa named', 'How to apply and deadline', 'How to apply', 'Deadline', 'Direct entry with WASSCE', 'Note']
const LABEL_RE = new RegExp(`(?:^|\\s)(${LABELS.join('|')}):\\s`, 'g')
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December'

// Sentences that only say Ghana is not named are noise. A country is shown only when the source names it.
const GHANA_NEG = /(not (separately |specifically |explicitly )?(named|stated|mentioned|listed|singled out|excluded)|does not (mention|name|list)|nothing in the stated|no country list|is not on the|Ghana( eligibility)?:? ?not (stated|named))/i
const DEADLINE = new RegExp(`\\b(deadline|closes?|closed|closing|reopens?|rounds? (listed|close)|by (the )?\\d{1,2} (${MONTHS})|\\d{1,2} (${MONTHS})|(${MONTHS}) \\d{1,2}|Early Decision|Regular Decision|Early Action|notified|finalists?|decisions?)\\b`, 'i')
const HOW = /\b(apply|application|nominat|submit|portal|no separate|automatic|automatically|CSS Profile|Common Application|interview|essay|personal statement|invited|offer letter|through the)\b/i
const REQ = /\b(need|needs|must|minimum|at least|GPA|ATAR|WAM|score|IELTS|TOEFL|Duolingo|SAT|ACT|grade|grades|average|marks?|required|requirements?|maintain|qualification|cannot|not eligible|excluded|exclusions?)\b/i

export function stripNotice(text) {
  return String(text || '').replace(/^NOT YET CHECKED.*?rely on it\.\s*/s, '').replace('Note from the same search, also unchecked:', 'Note:').trim()
}

// Words that, on their own, are a site or institution name left over from a source citation, not a fact.
const SMALL = new Set(['of', 'the', 'and', 'at', 'for', 'in'])
const looksLikeName = (x) => { const w = x.split(/\s+/); return w.length <= 5 && !/\d/.test(x) && w.every((t) => /^[A-Z]/.test(t) || SMALL.has(t)) }

function sentences(text) {
  return String(text || '')
    .split(/\s+\|\s+|;\s+|(?<=[.!?])\s+(?=[A-Z0-9"'(])/)
    .map((x) => x.trim().replace(/\.$/, '').replace(/\+\d+$/, '').trim())
    .map((x) => x.replace(/^The (listing|page) (says|states|notes) (that )?/i, '').replace(/^./, (c) => c.toUpperCase()))
    .filter((x) => x && !/:$/.test(x) && !/^Official\b/i.test(x) && !looksLikeName(x))
}

// A table cell that began "Funder; type; coverage" keeps only the coverage.
const dropPrefix = (t) => String(t || '').replace(/^[^;\d]{1,50};[^;\d]{1,40};\s*/, '')

function kindOf(sentence) {
  if (/\bGhana\b|\bAfrica/.test(sentence) && !GHANA_NEG.test(sentence)) return 'ghana'
  if (DEADLINE.test(sentence)) return 'deadline'
  if (HOW.test(sentence)) return 'how'
  if (REQ.test(sentence)) return 'req'
  return 'who'
}

const ORDER = [['award', 'What you get'], ['who', 'Who can apply'], ['req', 'Requirements'], ['ghana', 'Ghana'], ['how', 'How to apply'], ['deadline', 'Deadline'], ['wassce', 'Entry with WASSCE'], ['note', 'Notes']]

export function buildSections(s) {
  const buckets = Object.fromEntries(ORDER.map(([k]) => [k, []]))
  const add = (k, line) => { if (line && !buckets[k].includes(line)) buckets[k].push(line) }

  sentences(dropPrefix(s.awardNote)).forEach((x) => add('award', x))

  const text = stripNotice(s.criteria)
  const marks = [...text.matchAll(LABEL_RE)].map((m) => ({ label: m[1], at: m.index + m[0].indexOf(m[1]), end: m.index + m[0].length }))
  const parts = []
  if (!marks.length) parts.push({ label: '', body: text })
  else {
    if (marks[0].at > 0 && text.slice(0, marks[0].at).trim()) parts.push({ label: '', body: text.slice(0, marks[0].at) })
    marks.forEach((m, i) => parts.push({ label: m.label, body: text.slice(m.end, i + 1 < marks.length ? marks[i + 1].at : undefined) }))
  }

  for (const { label, body } of parts) {
    const b = body.trim()
    if (!b) continue
    if (label === 'Type' || label === 'Funder') continue
    if (label === 'Ghana or Africa named') {
      if (/^yes/i.test(b)) sentences(b.replace(/^yes,?\s*/i, '')).forEach((x) => add('ghana', x))
      continue
    }
    if (label === 'Direct entry with WASSCE') {
      if (!/^(not (stated|established|explicitly|specifically)|i could not)/i.test(b)) sentences(b).forEach((x) => add('wassce', x))
      continue
    }
    if (label === 'Note') { sentences(b).forEach((x) => add('note', x)); continue }
    if (label === 'Deadline') { sentences(b).forEach((x) => add('deadline', x)); continue }
    for (const x of sentences(b)) {
      if (/\bGhana\b/.test(x) && GHANA_NEG.test(x)) continue
      let k = kindOf(x)
      if ((label === 'How to apply' || label === 'How to apply and deadline') && k !== 'deadline') k = 'how'
      if (label === 'Who is eligible' && (k === 'req' || k === 'who')) k = k === 'who' ? 'who' : 'req'
      if (label === 'Requirements' && k === 'who') k = 'req'
      add(k, x)
    }
  }
  return ORDER.map(([k, h]) => ({ key: k, heading: h, items: buckets[k] })).filter((x) => x.items.length)
}

// Aggregator pages (they re-post scholarships and push paid "help") are never offered as the place to apply.
const AGGREGATORS = ['scholarshipsads.com', 'fullyscholarships.com']
export function officialLink(url) {
  if (!url) return ''
  try { return AGGREGATORS.some((h) => new URL(url).hostname.endsWith(h)) ? '' : url } catch { return '' }
}

export const FUNDING_ORDER = ['Full', 'Partial', 'Not stated']
export const fundingRank = (t) => { const i = FUNDING_ORDER.indexOf(t); return i === -1 ? FUNDING_ORDER.length : i }
