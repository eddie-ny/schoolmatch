// Copied from the web program page (src/pages/ProgramDetail.jsx) so both show the same facts.
export const SAT = { required: 'Required', optional: 'Optional', not_considered: 'Not considered' }
export const money = (n, cur) => `${cur} ${Number(n).toLocaleString()}`

// Plain-language facts for a programme. Only what we hold; each is one short line a student can understand.
export function keyFacts(v, masters) {
  const out = []
  if (v.entryQualification) out.push(['What you need', v.entryQualification])
  if (!masters && v.cutoffAggregate != null) out.push(['Last year\'s cut-off', `Aggregate ${v.cutoffAggregate}${v.cutoffYear ? ` (${v.cutoffYear})` : ''}. A lower number is better, so your aggregate must be equal or lower.`])
  else if (!masters && v.cutoffFrom) out.push(['Last year\'s cut-off', `Aggregate ${v.cutoffFrom.cutoffAggregate}${v.cutoffFrom.cutoffYear ? ` (${v.cutoffFrom.cutoffYear})` : ''} for the ${v.cutoffFrom.mode || 'regular'} entry. The school publishes one cut-off for this programme, so use it as a guide.`])
  else if (!masters && (v.level === 'Undergraduate' || v.level === 'Bachelors')) out.push(['Last year\'s cut-off', 'Not available yet. We add it when the school publishes it.'])
  if (!masters && v.requirements?.length) {
    const CORE = ['English Language', 'Core Mathematics', 'Integrated Science', 'Social Studies']
    const g = (r) => (r.minGrade ? ` (${r.minGrade} or better)` : '')
    const core = []
    for (const subj of ['English Language', 'Core Mathematics']) { const r = v.requirements.find((x) => x.subject === subj); if (r) core.push(`${subj}${g(r)}`) }
    const sci = v.requirements.find((x) => x.subject === 'Integrated Science' || x.subject === 'Social Studies')
    if (sci) core.push(`Integrated Science or Social Studies${g(sci)}`)
    const elect = v.requirements.filter((x) => !CORE.includes(x.subject))
    if (core.length) out.push(['Core subjects', core.join(', ')])
    out.push(['Elective subjects', elect.length >= 3 ? elect.map((r) => `${r.subject}${g(r)}`).join(', ')
      : elect.length ? `${elect.map((r) => `${r.subject}${g(r)}`).join(', ')}, and your best other elective${elect.length === 2 ? '' : 's'} to make three`
      : 'Your 3 best electives, any subjects'])
  }
  if (v.minWassceGrade && !v.requirements?.length) out.push(['WASSCE results', `${v.minWassceGrade} or better in your main subjects`])
  if (masters && v.mastersFormat) out.push(['How you study', v.mastersFormat])
  if (v.minDegreeClass) out.push(['Your first degree', `${v.minDegreeClass} or better`])
  if (v.minGpa != null) out.push(['Minimum GPA', `${v.minGpa.toFixed(2)} out of 4.0`])
  if (masters && v.grePolicy) out.push(['GRE test', v.grePolicy === 'required' ? `You must send a score.${v.minGre ? ` Minimum total ${v.minGre}.` : ''}` : v.grePolicy === 'optional' ? `You can choose to send a score.${v.minGre ? ` Minimum total ${v.minGre} if you do.` : ''}` : 'The school does not use GRE scores.'])
  if (masters && v.credentialEval) out.push(['Degree evaluation (WES)', v.credentialEval === 'required' ? 'The school asks for your degree to be evaluated, for example by WES, before you apply.' : v.credentialEval === 'accepted' ? 'The school accepts an evaluation such as WES but does not require one.' : 'No evaluation needed.'])
  if (v.satPolicy) out.push(['SAT test', v.satPolicy === 'required' ? `You must send a score.${v.satLow != null ? ` Most admitted students score ${v.satLow} to ${v.satHigh ?? v.satLow}.` : ''}` : v.satPolicy === 'optional' ? `You can choose to send a score.${v.satLow != null ? ` Most admitted students who do score ${v.satLow} to ${v.satHigh ?? v.satLow}.` : ''}` : 'The school does not use SAT scores.'])
  const eng = [v.minIelts != null && `IELTS ${v.minIelts}`, v.minToefl != null && `TOEFL ${v.minToefl}`, v.minDuolingo != null && `Duolingo ${v.minDuolingo}`].filter(Boolean)
  if (v.englishTestWaiver || eng.length) out.push(['English test', [v.englishTestWaiver && 'Not needed if you are a Ghanaian citizen.', eng.length && `Otherwise, one of: ${eng.join(' or ')}.`].filter(Boolean).join(' ')])
  if (v.foundationAvailable) out.push(['Foundation year', 'Available if you do not meet the entry grades yet.'])
  if (!out.length) out.push(['Entry requirements', 'Not added yet. Check with the school.'])
  return out
}

