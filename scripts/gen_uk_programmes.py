# Builds SQL for UK schools and first-degree programmes from the Discover Uni dataset (HESA / Office for Students, 27 Oct 2026).
# usage: python3 scripts/gen_uk_programmes.py <unzipped on_* folder> <output folder> [rows per file]
import csv, collections, re, sys, os
D, OUT = sys.argv[1], sys.argv[2]
MAXB = int(sys.argv[3]) if len(sys.argv) > 3 else 600000
os.makedirs(OUT, exist_ok=True)
rd = lambda f: list(csv.DictReader(open(os.path.join(D, f), encoding='utf-8-sig')))
INST = {x['PUBUKPRN']: x for x in rd('INSTITUTION.csv')}
KIS = rd('KISCOURSE.csv')
SBJ = {}
for s in rd('SBJ.csv'): SBJ.setdefault((s['PUBUKPRN'], s['KISCOURSEID'], s['KISMODE']), s['SBJ'])
def q(s): return "'" + str(s).replace("'", "''") + "'"
def nn(v): return 'null' if v is None else str(v)

# Providers: first-degree courses (KISLEVEL 03), at least 20 of them, universities and a short list of named public HE institutions.
# Private providers (Limited companies, Buckingham, Regent's, Arden, University of Law, BPP, Northeastern London) are left out: no private schools for now.
n03 = collections.Counter(c['PUBUKPRN'] for c in KIS if c['KISLEVEL'] == '03')
KEEP_NAMES = {'Birkbeck College', 'Goldsmiths College, University of London', 'Imperial College of Science, Technology and Medicine', "King's College London",
              'Royal Holloway and Bedford New College', 'The Royal Veterinary College', 'Central School of Speech and Drama', 'Royal Welsh College of Music and Drama Limited',
              'Rose Bruford College', 'Leeds College of Music', 'University College Birmingham', 'Courtauld Institute of Art', "Queen Mary University of London"}
PRIVATE = re.compile(r'(?i)\b(limited|ltd|holdings)\b|buckingham\b|regent|arden|university of law|bpp|northeastern|new model institute|amity|bimm|waterbear|academy 92|london school of management|european school|fairfield|marangoni|futureworks|liverpool media|lccm|asu london|aap education|spirit ssr|rtc education|bloomsbury|cwsh|point blank|icmp|n d a foundation')
def keep(name):
    if name in KEEP_NAMES and not re.search(r'(?i)limited', name.replace('Royal Welsh College of Music and Drama Limited', 'Royal Welsh College of Music and Drama')): return True
    if name == 'Royal Welsh College of Music and Drama Limited': return True
    return 'universit' in name.lower() and not PRIVATE.search(name)
provs = [p for p in n03 if n03[p] >= 20 and p in INST and keep(INST[p]['LEGAL_NAME'])]

NATION = {'XF': 'England', 'XG': 'Northern Ireland', 'XH': 'Scotland', 'XI': 'Wales'}
COUNTY = re.compile(r'(?i)^(greater |west |east |north |south )?(london|manchester|yorkshire|midlands|sussex|surrey|kent|essex|norfolk|suffolk|devon|cornwall|dorset|somerset|hampshire|berkshire|oxfordshire|cambridgeshire|northamptonshire|leicestershire|derbyshire|nottinghamshire|lincolnshire|staffordshire|shropshire|cheshire|lancashire|merseyside|cumbria|durham|northumberland|tyne and wear|gloucestershire|wiltshire|bedfordshire|hertfordshire|buckinghamshire|warwickshire|worcestershire|herefordshire|rutland|isle of wight|fife|lanarkshire|ayrshire|angus|aberdeenshire|perthshire|glamorgan|gwynedd|dyfed|powys|clwyd|gwent|county antrim|county down|county londonderry|county tyrone|county armagh|united kingdom|england|scotland|wales|northern ireland|cleveland|avon|bristol)?$')
def city(p):
    parts = [x.strip() for x in INST[p]['PROVADDRESS'].split(',') if x.strip()]
    if parts and re.search(r'\d', parts[-1]) and re.match(r'(?i)^[a-z]{1,2}\d', parts[-1]): parts = parts[:-1]
    while parts and COUNTY.match(parts[-1]) and len(parts) > 1: parts = parts[:-1]
    return parts[-1].title() if parts else None
FIX = {'University of Glasgow Court': 'University of Glasgow', 'University of Lancaster': 'Lancaster University', 'The Nottingham Trent University': 'Nottingham Trent University'}
def name(p):
    n = re.sub(r'\s+', ' ', INST[p]['LEGAL_NAME']).strip()
    n = FIX.get(n, n)
    n = re.sub(r'^The ', '', n)
    return n
CITY = {'Birkbeck College':'London','City University':'London',"Cardiff University":'Cardiff','Goldsmiths College, University of London':'London','Imperial College of Science, Technology and Medicine':'London',"King's College London":'London','London Metropolitan University':'London','London South Bank University':'London','Manchester Metropolitan University':'Manchester','Middlesex University':'London','Brunel University London':'London','Queen Mary University of London':'London','Roehampton University':'London','Royal Veterinary College':'London','University College London':'London','University for the Creative Arts':'Farnham','University of Bristol':'Bristol','University of Durham':'Durham','University of East London':'London','University of Greenwich (Part of London and South East University Group)':'London','University of Kent (Part of London and South East University Group)':'Canterbury','University of London':'London','University of Keele':'Keele','University of South Wales/Prifysgol De Cymru':'Pontypridd','University of St Andrews':'St Andrews','University of Westminster':'London','University of the Arts, London':'London','University of the West of England, Bristol':'Bristol','University of the West of Scotland':'Paisley','Queen Margaret University, Edinburgh':'Musselburgh','Harper Adams University':'Newport, Shropshire','Prifysgol Wrecsam/Wrexham University':'Wrexham','University of Hull':'Hull','University of Newcastle Upon Tyne':'Newcastle upon Tyne','University of Northumbria at Newcastle':'Newcastle upon Tyne','Lincoln Bishop University':'Lincoln','University of Greater Manchester':'Bolton','Royal Holloway and Bedford New College':'Egham'}
def web(p):
    w = INST[p]['PROVURL'].strip()
    return ('https://' + w) if w and not w.startswith('http') else (w or None)
provs = [p for p in provs if not name(p).startswith('Richmond, the American')]
sch = collections.OrderedDict((p, (name(p), CITY.get(name(p), city(p)), web(p), NATION.get(INST[p]['COUNTRY'], ''))) for p in sorted(provs, key=name))

FIELD = {'CAH01': 'Health Professions', 'CAH02': 'Health Professions', 'CAH03': 'Biological and Biomedical Sciences', 'CAH04': 'Psychology', 'CAH05': 'Health Professions',
         'CAH06': 'Agriculture', 'CAH07': 'Physical Sciences', 'CAH09': 'Mathematics and Statistics', 'CAH10': 'Engineering', 'CAH11': 'Computer and Information Sciences',
         'CAH13': 'Architecture', 'CAH15': 'Social Sciences', 'CAH16': 'Legal Studies', 'CAH17': 'Business', 'CAH19': 'Foreign Languages and Linguistics',
         'CAH20': 'Philosophy and Religious Studies', 'CAH22': 'Education', 'CAH23': 'Liberal Arts and General Studies', 'CAH24': 'Communication and Journalism',
         'CAH25': 'Visual and Performing Arts', 'CAH26': 'Natural Resources and Conservation'}
def field(code, title):
    f = FIELD.get((code or '')[:5]); t = title.lower()
    if f is None: return None
    if f == 'Foreign Languages and Linguistics' and 'english' in t and re.search('literature|language|creative writing', t): return 'English Language and Literature'
    if f == 'Philosophy and Religious Studies' and 'histor' in t: return 'History'
    if f == 'Natural Resources and Conservation' and 'geograph' in t: return 'Social Sciences'
    return f

rows = collections.OrderedDict(); seen = set()
for c in KIS:
    p = c['PUBUKPRN']
    if p not in sch or c['KISLEVEL'] != '03' or c['KISMODE'] != '01': continue
    t = re.sub(r'\s+', ' ', c['TITLE']).strip()
    if not t: continue
    fnd = c['FOUNDATION']
    if fnd == '2': t += ' (with foundation year)'
    key = (p, t.lower())
    if key in seen: continue
    seen.add(key)
    yrs = int(c['NUMSTAGE']) if c['NUMSTAGE'].isdigit() and 2 <= int(c['NUMSTAGE']) <= 6 else None
    notes = []
    if fnd == '2': notes.append('This course includes a compulsory foundation year.')
    elif fnd == '1': notes.append('A foundation year is available on this course.')
    if c['SANDWICH'] in ('1', '2'): notes.append('A work placement year is %s.' % ('optional' if c['SANDWICH'] == '1' else 'compulsory'))
    if c['YEARABROAD'] in ('1', '2'): notes.append('A year abroad is %s.' % ('optional' if c['YEARABROAD'] == '1' else 'compulsory'))
    feeurl = c['CRSECSTURL'] if c['CRSECSTURL'] and c['CRSECSTURL'] != c['CRSEURL'] else None
    rows.setdefault(p, []).append((t, field(SBJ.get((p, c['KISCOURSEID'], c['KISMODE'])), t), yrs, fnd in ('1', '2'), ' '.join(notes), c['CRSEURL'], c['KISCOURSEID'], feeurl))

SCH = """insert into schools(name,country,type,category,city,website,verified,demo)
select v.name,'United Kingdom','Public','University',v.city,v.web,false,false from (values
%s
) as v(name,city,web)
where not exists (select 1 from schools s where lower(s.name)=lower(v.name) and s.country='United Kingdom');
""" % ',\n'.join('(%s,%s,%s)' % (q(n), q(ci) if ci else 'null', q(w) if w else 'null') for n, ci, w, _ in sch.values())
open(os.path.join(OUT, 'step149_uk_schools.sql'), 'w').write(
 "-- UK schools from the Discover Uni dataset (HESA / Office for Students, 27 Oct 2026): %d universities and public higher education institutions, each with 20 or more first-degree courses.\n-- Private providers left out. type 'Public' is our assumption for universities, not a flag in the file. verified false. Safe to run twice.\n%s" % (len(sch), SCH))

HEAD = """-- UK programmes (part %d of %d): first-degree, full-time courses from the Discover Uni dataset of 27 Oct 2026. Run step149_uk_schools.sql first. Safe to run twice.
insert into programs(school_id,name,field,level,mode,duration_years,foundation_available,verified,demo,entry_note,intl_source_url,internal_note)
select s.id, v.name, v.field, 'Undergraduate', 'Regular', v.yrs, v.fnd, false, false, trim(coalesce(v.note,'')||' Tuition fees and entry requirements are not in this record. Read them on the university course page (the link on this programme)'||coalesce(' and the fees page '||v.feeurl,' and the university fees pages')||'.'), v.url,
  'Imported from the Discover Uni dataset (HESA / OfS, 27 Oct 2026). Course id '||v.code||'. Source: discoveruni-2026-10-27'
from (values
%s
) as v(school,name,field,yrs,fnd,note,url,code,feeurl)
join schools s on s.name=v.school and s.country='United Kingdom'
where not exists (select 1 from programs x where x.school_id=s.id and x.name=v.name and x.mode='Regular');
"""
def line(r): return '(%s,%s,%s,%s,%s,%s,%s,%s,%s)' % (q(r[0]), q(r[1]), q(r[2]) if r[2] else 'null', nn(r[3]), 'true' if r[4] else 'false', q(r[5]) if r[5] else "null", q(r[6]), q(r[7]), q(r[8]) if r[8] else 'null')
allrows = [(sch[p][0],) + r for p, rs in rows.items() for r in rs]
files = []; cur = []; size = 0
for r in allrows:
    l = len(line(r)) + 2
    if cur and size + l > MAXB: files.append(cur); cur = []; size = 0
    cur.append(r); size += l
if cur: files.append(cur)
for i, fr in enumerate(files, 1):
    open(os.path.join(OUT, 'uk_programmes_part%d.sql' % i), 'w').write(HEAD % (i, len(files), ',\n'.join(line(r) for r in fr)))
    print('part', i, len(fr))
print('schools', len(sch), 'programmes', sum(len(r) for r in rows.values()))
print('fields', collections.Counter(r[2] for rs in rows.values() for r in rs).most_common(30))
print('no field', sum(1 for rs in rows.values() for r in rs if r[2] is None))
for p, (n, ci, w, nat) in list(sch.items()): print('%-55s %-22s %s' % (n, ci, nat))
