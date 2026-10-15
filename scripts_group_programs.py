"""Build a common programme name ("group") for every programme so Eligibility can list each programme once.
Reads data/ghana-public-universities/*_programs.csv, writes data/ghana-public-universities/program_groups.csv.
Run: python3 scripts_group_programs.py"""
import csv, glob, re
from collections import Counter, defaultdict

DIR = 'data/ghana-public-universities/'
SPECIAL = [  # (regex on whole name, group)
    (r'^(llb|bachelor of laws.*|llb law.*)$', 'Law'),
    (r'^(mbchb|bachelor of medicine and bachelor of surgery.*|bachelor of medicine.*surgery.*)$', 'Medicine'),
    (r'^doctor of pharmacy.*$', 'Pharmacy'),
    (r'^doctor of optometry.*$', 'Optometry'),
    (r'^bachelor of business administration$', 'Business Administration'),
    (r'^bachelor of arts$', 'Arts'),
]
PREFIX = re.compile(
    r'^(?:\d-year\s+)?(?:bachelor\s+of\s+(?:(?:science|arts|education|commerce|technology|engineering)\s+in\s+|(?:science|arts|education|commerce|technology|engineering)\s*|)'
    r'|b\.?\s?(?:sc|a|ed|com|tech|eng)\.?(?=[\s(]|$)\s*(?:in\s+)?)', re.I)

def group(name):
    n = re.sub(r'\s+', ' ', name.strip())
    for rx, g in SPECIAL:
        if re.match(rx, re.sub(r'\s*\(.*?\)\s*$', '', n) if 'Doctor' in n or 'Bachelor of Medicine' in n or 'Bachelor of Laws' in n else n, re.I):
            return g
    edu = bool(re.match(r'^(?:\d-year\s+)?(?:bachelor\s+of\s+education|b\.?\s?ed\.?)(?=[\s(]|$)', n, re.I))
    m = PREFIX.match(n)
    rest = n[m.end():].strip() if m else n
    if rest.startswith('(') and ')' in rest:           # "(Chemistry Education)" or "(Finance)": the subject is inside
        rest = rest[1:rest.index(')')].strip()
    rest = re.sub(r'\s*\([^)]*\)', '', rest)           # campus, years, minor lists
    rest = re.sub(r'\s+with$', '', rest, flags=re.I).strip(' -:,.')
    rest = re.sub(r'\s+(JHS|Specialism)$', '', rest).strip()
    if edu and 'education' not in rest.lower():
        rest = f'{rest} Education'
    rest = re.sub(r'^(?:b\.?\s?b\.?\s?a\.?)(?:\s+|$)', '', rest, flags=re.I) or 'Business Administration'
    rest = re.sub(r'^doctor of\s+', '', rest, flags=re.I)
    rest = re.sub(r'(?i)medical laboratory sciences$', 'Medical Laboratory Science', rest)
    rest = re.sub(r'(?i)veterinary medicine$', 'Veterinary Medicine', rest)
    rest = re.sub(r'(?i)-with-', ' with ', rest)
    rest = rest.replace('Electrical/Electronic', 'Electrical and Electronic').replace('Agri-Business', 'Agribusiness')
    return rest or n

def main():
    rows = []
    for f in sorted(glob.glob(DIR + '*_programs.csv')):
        for r in csv.DictReader(open(f, encoding='utf-8')):
            rows.append((r['school_name'], r['program_name'], group(r['program_name'])))
    # one spelling per group, case-insensitively: use the most common
    spell = defaultdict(Counter)
    for _, _, g in rows: spell[g.lower()][g] += 1
    best = {k: v.most_common(1)[0][0] for k, v in spell.items()}
    out = [(s, p, best[g.lower()]) for s, p, g in rows]
    with open(DIR + 'program_groups.csv', 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh); w.writerow(['school_name', 'program_name', 'group_name']); w.writerows(out)
    return out

if __name__ == '__main__':
    out = main()
    g = defaultdict(set)
    for s, p, gn in out: g[gn].add(s)
    print(len(out), 'programmes,', len(g), 'groups,', sum(1 for v in g.values() if len(v) > 1), 'offered by 2+ schools')
