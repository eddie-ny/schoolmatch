"""Build a common programme name ("group") for every programme, with the degree shown once.
"BSc Midwifery", "B.Sc. in Midwifery" and "Bachelor of Midwifery" all become "BSc Midwifery".
Reads data/ghana-public-universities/*_programs.csv, writes data/ghana-public-universities/program_groups.csv.
Run: python3 scripts_group_programs.py"""
import csv, glob, re
from collections import Counter, defaultdict

DIR = 'data/ghana-public-universities/'
SPECIAL = [  # (regex on the name without a trailing bracket, group)
    (r'^(llb|bachelor of laws|llb law)$', 'LLB Law'),
    (r'^(mbchb|bachelor of medicine and bachelor of surgery|bachelor of medicine, bachelor of surgery)$', 'MBChB Medicine'),
    (r'^doctor of pharmacy$', 'PharmD Pharmacy'),
    (r'^bachelor of arts$', 'BA Arts'),
]
# degree word at the start -> short form. Longer forms first.
DEGREES = [
    (r'(?:\d-year\s+)?bachelor\s+of\s+science(?:\s+in)?', 'BSc'),
    (r'(?:\d-year\s+)?bachelor\s+of\s+arts(?:\s+in)?', 'BA'),
    (r'(?:\d-year\s+)?bachelor\s+of\s+education(?:\s+in)?', 'BEd'),
    (r'(?:\d-year\s+)?bachelor\s+of\s+commerce(?:\s+in)?', 'BCom'),
    (r'(?:\d-year\s+)?bachelor\s+of\s+business\s+administration(?:\s+in)?', 'BBA'),
    (r'(?:\d-year\s+)?bachelor\s+of\s+technology(?:\s+in)?', 'BTech'),
    (r'(?:\d-year\s+)?bachelor\s+of\s+engineering(?:\s+in)?', 'BEng'),
    (r'b\.?\s?sc\.?(?:\s+in)?', 'BSc'),
    (r'b\.?\s?a\.?(?:\s+in)?', 'BA'),
    (r'b\.?\s?ed\.?(?:\s+in)?', 'BEd'),
    (r'b\.?\s?com\.?(?:\s+in)?', 'BCom'),
    (r'b\.?\s?b\.?\s?a\.?(?:\s+in)?', 'BBA'),
    (r'b\.?\s?tech\.?(?:\s+in)?', 'BTech'),
    (r'b\.?\s?eng\.?(?:\s+in)?', 'BEng'),
    (r'bachelor\s+of(?:\s+in)?', ''),          # "Bachelor of Midwifery": degree not stated
]
DEG_RX = [(re.compile(r'^' + rx + r'(?=[\s(]|$)\s*', re.I), d) for rx, d in DEGREES]
KEEP_EDU = re.compile(r'basic|early|childhood|grade|primary|special|upper|physical', re.I)

def split(name):
    n = re.sub(r'\s+', ' ', name.strip())
    for rx, g in SPECIAL:
        if re.match(rx, re.sub(r'\s*\(.*?\)\s*$', '', n), re.I):
            return g, None
    deg, rest, generic = None, n, False
    for rx, d in DEG_RX:
        m = rx.match(n)
        if m:
            deg, rest = (d or None), n[m.end():].strip()
            generic = not d
            break
    if rest.startswith('(') and ')' in rest:           # "(Chemistry Education)" or "(Finance)": the subject is inside
        rest = rest[1:rest.index(')')].strip()
    rest = re.sub(r'\s*\([^)]*\)', '', rest)           # campus, years, minor lists
    rest = re.sub(r'\s+with$', '', rest, flags=re.I).strip(' -:,.')
    rest = re.sub(r'\s+(JHS|Specialism)$', '', rest).strip()
    rest = re.sub(r'(?i)-with-', ' with ', rest)
    rest = rest.replace('Electrical/Electronic', 'Electrical and Electronic').replace('Agri-Business', 'Agribusiness')
    rest = re.sub(r'(?i)medical laboratory sciences$', 'Medical Laboratory Science', rest)
    rest = re.sub(r'^(JHS|Junior High)(\s+School)?$', 'Junior High School', rest)
    rest = re.sub(r'(?i)^early grade education$', 'Early Grade', rest)
    rest = re.sub(r'(?i)^fashion design and textile$', 'Fashion Design and Textiles', rest)
    if re.match(r'^doctor of\s+', rest, re.I):
        return rest, None                              # doctorates keep their own name
    # teacher-education degrees are all BEd, whatever the school calls the degree letters
    if deg == 'BEd' or (re.search(r'education$', rest, re.I) and deg in ('BSc', 'BA', None) and ' with ' not in rest.lower()):
        deg = 'BEd'
        if not KEEP_EDU.search(rest):
            rest = re.sub(r'\s+education$', '', rest, flags=re.I).strip() or rest
    if deg is None and generic and rest:
        return rest, 'Bachelor of'   # degree not stated and not known from other schools
    return rest or n, deg

# Abbreviations that students may not recognise are written out. BSc and BA stay short.
LONG_DEGREE = {
    'BEd': 'Bachelor of Education in', 'BCom': 'Bachelor of Commerce in', 'BBA': 'Bachelor of Business Administration in',
    'BTech': 'Bachelor of Technology in', 'BEng': 'Bachelor of Engineering in',
}
LONG_SPECIAL = {
    'LLB Law': 'Bachelor of Laws (LLB)', 'MBChB Medicine': 'Bachelor of Medicine and Bachelor of Surgery (MBChB)',
    'PharmD Pharmacy': 'Doctor of Pharmacy (PharmD)', 'BA Arts': 'Bachelor of Arts',
}

def longform(g):
    if g == 'BBA Bachelor of Business Administration': return 'Bachelor of Business Administration'
    if g in LONG_SPECIAL: return LONG_SPECIAL[g]
    first, _, rest = g.partition(' ')
    return f'{LONG_DEGREE[first]} {rest}' if first in LONG_DEGREE and rest else g

def main():
    parsed = []
    for f in sorted(glob.glob(DIR + '*_programs.csv')):
        for r in csv.DictReader(open(f, encoding='utf-8')):
            subj, deg = split(r['program_name'])
            parsed.append([r['school_name'], r['program_name'], subj, deg])
    # one spelling per subject (case-insensitive): the most common
    spell = defaultdict(Counter)
    for _, _, s, _ in parsed: spell[s.lower()][s] += 1
    best = {k: v.most_common(1)[0][0] for k, v in spell.items()}
    # a name with no degree word takes the degree most other schools use for that subject, if any
    degs = defaultdict(Counter)
    for _, _, s, d in parsed:
        if d and d not in ('Bachelor of', 'BEd'): degs[best[s.lower()].lower()][d] += 1
    out = []
    for school, prog, s, d in parsed:
        s = best[s.lower()]
        if d in (None, 'Bachelor of') and s.lower() in degs and not re.match(r'^(LLB|MBChB|PharmD|BA) ', s) and not s.lower().startswith('doctor of'):
            d = degs[s.lower()].most_common(1)[0][0]
        out.append((school, prog, longform(f'{d} {s}' if d and not re.match(r'^(LLB|MBChB|PharmD|BA) ', s) else s)))
    with open(DIR + 'program_groups.csv', 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh); w.writerow(['school_name', 'program_name', 'group_name']); w.writerows(out)
    return out

if __name__ == '__main__':
    out = main()
    g = defaultdict(set)
    for s, p, gn in out: g[gn].add(s)
    print(len(out), 'programmes,', len(g), 'groups,', sum(1 for v in g.values() if len(v) > 1), 'offered by 2+ schools')
