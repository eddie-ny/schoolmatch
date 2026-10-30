import openpyxl,re,collections,os
X='/mnt/user-data/attachments/83465085-c8d5-5531-b7e7-d8a0df0bb4dc/32a53153-cricos-providers-courses-and-locations-as-at-2026-9-1-9-15-26-1.xlsx'
wb=openpyxl.load_workbook(X,read_only=True)
def rows(n):
    it=wb[n].iter_rows(values_only=True); next(it);next(it); h=next(it)
    return [dict(zip(h,r)) for r in it if r and r[0]]
I={i['CRICOS Provider Code']:i for i in rows('Institutions')}
LOCC={}
for l in rows('Locations'):
    LOCC.setdefault(l['CRICOS Provider Code'],collections.Counter())[(l['City'] or '').title()]+=1
C=rows('Courses')
LEVEL={'Bachelor Degree':'Undergraduate','Bachelor Honours Degree':'Undergraduate','Masters Degree (Coursework)':'Masters','Masters Degree (Research)':'Masters','Masters Degree (Extended)':'Masters',
 'Graduate Certificate':'Graduate Certificate','Graduate Diploma':'Graduate Certificate','Diploma':'Diploma','Advanced Diploma':'Diploma','Associate Degree':'Diploma'}
def q(s): return "'"+str(s).replace("'","''")+"'"
def nn(v): return 'null' if v is None else str(v)
def field(c):
    broad=(c['Field of Education 1 Broad Field'] or '').split(' - ',1)[-1]; narrow=(c['Field of Education 1 Narrow Field'] or '').split(' - ',1)[-1].lower()
    if broad.startswith('Natural and Physical'):
        return 'Mathematics and Statistics' if 'mathem' in narrow else 'Biological and Biomedical Sciences' if 'biolog' in narrow else 'Physical Sciences'
    if broad.startswith('Society and Culture'):
        for k,v in (('law','Legal Studies'),('psych','Psychology'),('language','Foreign Languages and Linguistics'),('literature','Foreign Languages and Linguistics'),('philosoph','Philosophy and Religious Studies'),('religio','Philosophy and Religious Studies'),('communic','Communication and Journalism'),('human welfare','Public Administration and Social Service')):
            if k in narrow: return v
        return 'Social Sciences'
    return {'Information Technology':'Computer and Information Sciences','Engineering and Related Technologies':'Engineering','Health':'Health Professions','Education':'Education','Management and Commerce':'Business','Creative Arts':'Visual and Performing Arts','Architecture and Building':'Architecture','Agriculture, Environmental and Related Studies':'Agriculture','Food, Hospitality and Personal Services':'Personal and Culinary Services'}.get(broad)
def num(x):
    try: return float(x)
    except: return None
def sc(code):
    i=I[code]; nm=re.sub(r'\s*\((?:[^)]*)\)\s*$','',i['Institution Name'] or '').strip()
    web=(i['Website'] or '').strip()
    if web and not web.startswith('http'): web='https://'+web
    nm=re.sub(r'\s+Limited$','',nm)
    pc=(i['Postal Address City'] or '').title()
    if not pc or pc.lower() in nm.lower() or re.search(r'(?i)campus|mail|centre|po box',pc):
        pc=(LOCC.get(code) or collections.Counter({'':1})).most_common(1)[0][0]
    return nm,pc,web
best={}
for c in C:
    if c['Expired']!='No': continue
    lv=LEVEL.get(c['Course Level'])
    inst=I.get(c['CRICOS Provider Code'])
    if not lv or not inst or inst['Institution Type']!='Government' or re.search(r'(?i)^department of|bureau|pty',inst['Institution Name'] or ''): continue
    name=re.sub(r'\s+',' ',(c['Course Name'] or '')).strip()
    if not name: continue
    key=(sc(c['CRICOS Provider Code'])[0],name.lower(),lv)
    if key not in best or (best[key]['Tuition Fee'] in (None,'') and c['Tuition Fee'] not in (None,'')): best[key]=c
print('programmes',len(best),'schools',len({k[0] for k in best}))
def title(s): return ' '.join(w.capitalize() if w.isupper() and len(w)>3 else w for w in (s or '').split())
schools={}
for (nm0,_,_),cc in best.items(): schools.setdefault(nm0,sc(cc['CRICOS Provider Code']))
cat=lambda n:'University' if ('universit' in n.lower() or 'royal melbourne institute of technology' in n.lower()) else 'Institute'
sv=',\n'.join("(%s,%s,%s,%s)"%(q(n),q(c),q(w) if w else 'null',q(cat(n))) for n,c,w in schools.values())
SCH="""insert into schools(name,country,type,category,city,website,verified,demo)
select v.name,'Australia','Public',v.cat,v.city,v.web,false,false from (values
%s
) as v(name,city,web,cat)
where not exists (select 1 from schools s where s.name=v.name and s.country='Australia');
"""%sv
prog=[]
for (nm0,_,lv),c in best.items():
    wk=num(c['Duration (Weeks)']); tf=num(c['Tuition Fee']); nt=num(c['Non Tuition Fee'])
    yrs=round(wk/52,1) if wk else None
    fee=int(round(tf*52/wk,-1)) if (tf and wk and wk>0) else None
    cl=c['Course Level']
    fmt='Course based (classes and assessments)' if 'Coursework' in cl or 'Extended' in cl else 'Research based (you write a thesis)' if 'Research' in cl else None
    note=[]
    if wk: note.append('The course takes about %s weeks (%s years) of study.'%(int(wk),yrs))
    if tf: note.append('The full tuition for the course is about AUD %s.'%format(int(tf),','))
    if nt: note.append('Other compulsory fees add about AUD %s.'%format(int(nt),','))
    if c['Work Component']=='Yes': note.append('The course includes a work placement.')
    prog.append((nm0,re.sub(r'\s+',' ',c['Course Name']).strip(),field(c),lv,fee,yrs,fmt,' '.join(note),c['CRICOS Course Code']))
prog.sort()
print(collections.Counter(p[3] for p in prog), sum(1 for p in prog if p[4]), sum(1 for p in prog if p[2] is None))
HEAD="""insert into programs(school_id,name,field,level,mode,fee_amount,fee_currency,duration_years,masters_format,foundation_available,verified,demo,entry_note,internal_note)
select s.id, v.name, v.field, v.level, 'Regular', v.fee, case when v.fee is null then null else 'AUD' end, v.yrs, v.fmt, false, false, false, nullif(v.note,''),
  'Imported from the Australian government CRICOS register (data as at 1 Sep 2026). Course code '||v.code||'. Fee per year = total tuition / course weeks x 52.'
from (values
%s
) as v(school,name,field,level,fee,yrs,fmt,note,code)
join schools s on s.name=v.school and s.country='Australia'
where not exists (select 1 from programs x where x.school_id=s.id and x.name=v.name and x.level=v.level);
"""
def row(p): return "(%s,%s,%s,%s,%s,%s,%s,%s,%s)"%(q(p[0]),q(p[1]),q(p[2]) if p[2] else 'null',q(p[3]),nn(p[4]),nn(p[5]),q(p[6]) if p[6] else 'null',q(p[7]),q(p[8]))
K=1100; parts=[prog[i:i+K] for i in range(0,len(prog),K)]
for i,ps in enumerate(parts,1):
    t=(SCH if i==1 else '')+HEAD%',\n'.join(row(p) for p in ps)
    fn='au_programmes_part%d.sql'%i; open(fn,'w').write(t); print(fn,len(ps),os.path.getsize(fn))
