import csv,collections,re,sys
A='/mnt/user-data/attachments/83465085-c8d5-5531-b7e7-d8a0df0bb4dc/'
S=list(csv.DictReader(open(A+'6160e1a7-1793263239842_scorecard_schools.csv',encoding='utf-8')))
P=list(csv.DictReader(open(A+'e8d8ad07-1793263239841_scorecard_programs.csv',encoding='utf-8')))
FAM={'01':'Agriculture','03':'Natural Resources and Conservation','04':'Architecture','05':'Area, Ethnic and Gender Studies','09':'Communication and Journalism','10':'Communications Technologies','11':'Computer and Information Sciences','12':'Personal and Culinary Services','13':'Education','14':'Engineering','15':'Engineering Technologies','16':'Foreign Languages and Linguistics','19':'Family and Consumer Sciences','21':'Technology Education','22':'Legal Studies','23':'English Language and Literature','24':'Liberal Arts and General Studies','25':'Library Science','26':'Biological and Biomedical Sciences','27':'Mathematics and Statistics','28':'Military Science','29':'Military Technologies','30':'Interdisciplinary Studies','31':'Parks, Recreation and Fitness','32':'Basic Skills','33':'Citizenship Activities','34':'Health-Related Knowledge','35':'Interpersonal Skills','36':'Leisure and Recreational Activities','37':'Personal Awareness','38':'Philosophy and Religious Studies','39':'Theology','40':'Physical Sciences','41':'Science Technologies','42':'Psychology','43':'Homeland Security and Law Enforcement','44':'Public Administration and Social Service','45':'Social Sciences','46':'Construction Trades','47':'Mechanic and Repair Technologies','48':'Precision Production','49':'Transportation','50':'Visual and Performing Arts','51':'Health Professions','52':'Business','54':'History'}
OVR={'104151':('Arizona State University','Tempe'),'134130':('University of Florida','Gainesville'),'170976':('University of Michigan','Ann Arbor'),'204796':('Ohio State University','Columbus'),'214777':('Pennsylvania State University','University Park'),'228778':('University of Texas at Austin','Austin'),'238032':('West Virginia University','Morgantown'),'243780':('Purdue University','West Lafayette')}
LEAD={
'104151':"Test scores are not required. You need a high school GPA of at least 3.00. English minimums depend on the college: most majors IELTS 6.0, TOEFL 61, Duolingo 95; Engineering IELTS 6.5, TOEFL 79, Duolingo 105; Nursing IELTS 6.5, TOEFL 76, Duolingo 100; Journalism IELTS 7.0, TOEFL 100, Duolingo 120. If your English is not strong enough yet, you may be offered conditional admission for up to three semesters.",
'204796':"SAT or ACT is required, with no minimum score and no minimum GPA for general admission. Ghanaian citizenship counts as proof of English, so no English test is needed (if you take one: IELTS 6.5, Duolingo 120, TOEFL 79). Send official transcripts and exam certificates. Engineering, nursing and some other majors have their own requirements.",
'214777':"SAT and ACT are optional. Penn State looks at your whole record, with core preparation in mathematics, science, social science and language, and it accepts the WAEC Senior Secondary School Certificate. English: IELTS 6.5, Duolingo 120 or TOEFL 80; other accepted routes include an SAT reading and writing score of 570 or a GCSE or GCE English grade A to C. Ask Penn State whether Ghanaian citizenship waives the English test. Some majors need extra items.",
'243780':"SAT, ACT or CLT scores are accepted with no preference and are looked at only if you send them (they must be from the past five years). If English is not your first language you need proof of it from Duolingo, IELTS or TOEFL, or an English-curriculum alternative taken within two years. Check Purdue's current minimum scores before applying.",
'134130':"An SAT, ACT or CLT score is required from every first-year student, including international applicants. Coursework from outside the US needs a course-by-course evaluation from a NACES member, including a GPA calculation, by the deadline. Check UF's current English test minimums before applying.",
'170976':"Test scores are optional. If English is not your first language you must submit TOEFL, IELTS, MET or another accepted exam, and Ghana is not on Michigan's list of countries exempt from the English test. An exemption needs an SAT reading and writing score of 650 or above plus four years of study in a listed country.",
'228778':"An SAT or ACT score is required. English minimums are TOEFL 79, IELTS 6.5 or Duolingo 115, but Ghana is on UT Austin's list of countries whose students are exempt from the English test. Ask the admissions office how your WASSCE results are evaluated.",
'238032':"WVU converts your WASSCE results to a US GPA on a 4.0 scale. A converted GPA of at least 2.5 can be admitted, and some majors need a higher GPA or specific courses. Ghanaian citizenship counts as proof of English, so no English test is needed (if you take one: IELTS 6.5, Duolingo 105, TOEFL 79). SAT or ACT is optional for general admission, but engineering (SAT Math 540 or ACT Math 22 with GPA 2.5), business (SAT Math 520) and nursing have their own rules. The Beckley (WVU Tech) campus has different rules."}
def q(s): return "'"+str(s).replace("'","''")+"'"
def n(x):
    try: return int(round(float(x)))
    except: return None
def nn(v): return 'null' if v is None else str(v)
def pct(x):
    try: return int(round(float(x)*100))
    except: return None
sch={r['id']:r for r in S}
def sfrow(r):
    sid=r['id']
    name,city=OVR.get(sid,(r['school.name'],r['school.city']+', '+r['school.state']))
    return "(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"%(q(sid),q(name),q(city),nn(pct(r['latest.admissions.admission_rate.overall'])),nn(pct(r['latest.completion.completion_rate_4yr_150nt'])),nn(n(r['latest.cost.tuition.out_of_state'])),nn(n(r['latest.cost.attendance.academic_year'])),nn(pct(r['latest.student.demographics.race_ethnicity.non_resident_alien'])),nn(n(r['latest.admissions.act_scores.25th_percentile.cumulative'])),nn(n(r['latest.admissions.act_scores.75th_percentile.cumulative'])),q(LEAD[sid]) if sid in LEAD else 'null')
prog=[]
for p in P:
    sid=p['school_id']
    if sid not in sch: continue
    code=p['code']; fam=FAM.get(code[:2])
    if not fam: continue
    title=p['title'].strip().rstrip('.').strip()
    aw=n(p['counts.ipeds_awards2']) or n(p['counts.ipeds_awards1'])
    earn=n(p['earnings.highest.2_yr.overall_median_earnings'])
    prog.append((sid,code,title,fam,aw,earn))
prog.sort(key=lambda x:(x[0],x[1]))
def prow(x): return "(%s,%s,%s,%s,%s,%s)"%(q(x[0]),q(x[1]),q(x[2]),q(x[3]),nn(x[4]),nn(x[5]))
HEAD="""with sf(sid,name,city,rate,comp,tuit,attend,intl,actlo,acthi,lead) as (values
@@SF@@
),
pr(sid,cip,title,field,aw,earn) as (values
@@PR@@
),
src as (
 select s.id school_id, pr.title, pr.field, pr.aw, pr.earn, sf.*
 from pr join sf on sf.sid=pr.sid
 join schools s on s.name=sf.name and s.city=sf.city and s.country='United States'
)
insert into programs(school_id,name,field,level,mode,fees_usd,sat_policy,min_ielts,min_toefl,min_duolingo,min_wassce_grade,english_test_waiver,foundation_available,verified,demo,entry_qualification,entry_note,internal_note)
select src.school_id, src.title, src.field, 'Undergraduate','Regular', src.tuit::numeric, g.sat_policy, g.min_ielts, g.min_toefl, g.min_duolingo, g.min_wassce_grade, coalesce(g.english_test_waiver,false), false, false, false, g.entry_qualification,
 trim(coalesce(src.lead||' ','') ||
  coalesce('About '||src.rate||'% of all applicants are admitted'||coalesce(' and '||src.comp||'% of students finish a bachelor''s degree within six years','')||'. ','') ||
  coalesce('The tuition shown is the out-of-state rate, which international students usually pay. With housing and living costs the yearly total is about $'||to_char(src.attend,'FM999,999')||'. ','') ||
  coalesce('About '||src.aw||' students finish this programme each year. ','') ||
  coalesce('Graduates of this programme who were working earned a median of about $'||to_char(src.earn,'FM999,999')||' a year two years after finishing. ','') ||
  coalesce('About '||src.intl||'% of undergraduates are international students. ','') ||
  case when not exists (select 1 from program_cutoffs c where c.program_id=g.id and c.sat_low is not null) and src.actlo is not null then 'Typical ACT score of admitted students: '||src.actlo||' to '||src.acthi||'. ' else '' end),
 'Imported from College Scorecard (IPEDS 2024-25). Test policy mapped from the IPEDS code. Programme list from Scorecard fields of study (CIP 4-digit, bachelor''s only).'
from src
join programs g on g.school_id=src.school_id and g.name like 'General undergraduate entry%'
where not exists (select 1 from programs x where x.school_id=src.school_id and x.name=src.title and x.mode='Regular');
"""
def build(rows):
    sids=sorted({r[0] for r in rows})
    return HEAD.replace('@@SF@@',',\n'.join(sfrow(sch[s]) for s in sids)).replace('@@PR@@',',\n'.join(prow(r) for r in rows))
if __name__=='__main__':
    import os
    mode=sys.argv[1]
    if mode=='sample':
        keep={'104151','100654','139755'}
        rows=[r for r in prog if r[0] in keep]
        open('sample.sql','w').write(build(rows)); print(len(rows))
    else:
        k=int(sys.argv[2]); out=[];cur=[]
        # chunk by school boundaries
        by=collections.OrderedDict()
        for r in prog: by.setdefault(r[0],[]).append(r)
        files=[];cur=[]
        for s,rs in by.items():
            if len(cur)+len(rs)>k and cur: files.append(cur);cur=[]
            cur+=rs
        if cur: files.append(cur)
        for i,rows in enumerate(files,1):
            open('us_programmes_part%d.sql'%i,'w').write(build(rows)); print(i,len(rows),os.path.getsize('us_programmes_part%d.sql'%i))
