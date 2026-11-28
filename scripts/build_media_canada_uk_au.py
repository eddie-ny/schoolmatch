"""File 5: logos, photos, descriptions for Canada, UK, Australia from the owner's fetch_school_media.py CSVs (28 Nov 2026).
Fills only empty fields, matched by school id. Wrong Wikipedia matches left out or trimmed."""
import csv
U = '/mnt/user-data/uploads/'
FILES = ['b91b915f-canada_media.csv', '2c18de64-uk_media.csv', '1217c8b9-australia_media.csv']
SKIP = {  # matched a different page
 'HEC Montréal': 'Polytechnique Montréal', 'Université du Québec en Outaouais': 'the Université du Québec network',
 'University of Warwick': 'Warwick Arts Centre', 'Hartpury University': 'a rugby player', 'Leeds College of Music': 'University of Leeds',
 'Robert Gordon University': 'its boat club', 'University of Edinburgh': 'Edinburgh Napier University',
 'University of the Highlands and Islands': 'Inverness College', 'Australian Catholic University': 'Notre Dame Australia',
 'The National Institute of Dramatic Art': 'AIM Dramatic Arts', 'TAFE Queensland': 'a closed TAFE institute', 'Bond University': 'a professor'}
NO_LOGO = {'University of New England': 'logo was the University of New England in Maine, USA', 'The University of New South Wales': 'logo was UNSW Canberra'}
NO_IMAGE = {'Falmouth University': 'photo was a shield', 'University of Buckingham': 'photo was a coat of arms', 'University of Central Lancashire': 'photo was the Cyprus campus'}
IMAGE_IS_LOGO = {'Swinburne University of Technology', 'Southern Cross University'}  # the "photo" is the logo
NO_DESC = {'Northeastern University London': 'Wikipedia calls it public; it is listed as private'}
def d(s): return '$q$' + s + '$q$' if s else 'null'
rows, notes = [], []
for f in FILES:
    for r in csv.DictReader(open(U + f, encoding='utf-8')):
        n = r['name']
        if n in SKIP: notes.append(f'{n} (matched {SKIP[n]})'); continue
        logo, lcred, img, icred, desc, dcred = (r[k] for k in ('logo_url','logo_credit','image_url','image_credit','description','description_credit'))
        if n in NO_LOGO: logo = lcred = ''
        if n in NO_IMAGE: img = icred = ''
        if n in IMAGE_IS_LOGO: logo, lcred, img, icred = img, icred.replace('Photo:', 'Logo:'), '', ''
        if n in NO_DESC: desc = dcred = ''
        desc = ' '.join(desc.replace('[LC1]', '').split()).replace(' ,', ',')
        icred, lcred = ' '.join(icred.split()), ' '.join(lcred.split())
        if not (logo or img or desc): continue
        rows.append(f"('{r['school_id']}'::uuid,{d(logo)},{d(lcred or None)},{d(img)},{d(icred or None)},{d(desc)},{d(dcred or None)})")
SET = """  logo_url = coalesce(nullif(s.logo_url,''), v.logo_url),
  logo_credit = case when coalesce(s.logo_url,'')='' then v.logo_credit else s.logo_credit end,
  image_url = coalesce(nullif(s.image_url,''), v.image_url),
  image_credit = case when coalesce(s.image_url,'')='' then v.image_credit else s.image_credit end,
  description = coalesce(nullif(s.description,''), v.description),
  description_credit = case when coalesce(s.description,'')='' then v.description_credit else s.description_credit end"""
trim = '; '.join(f'{k}: {v}' for k, v in {**NO_LOGO, **NO_IMAGE, **NO_DESC}.items())
sql = f"""-- File 5 (step225): school media for Canada, United Kingdom and Australia from Wikipedia and Wikimedia Commons
-- (free licences), from the owner's fetch_school_media.py runs on 28 Nov 2026. Only fills empty fields; never overwrites.
-- Left out (wrong page matched): {'; '.join(notes)}.
-- Trimmed: {trim}. Swinburne and Southern Cross: the "photo" was the logo, used as the logo.
begin;
update public.schools s set
{SET}
from (values
{',\n'.join(rows)}
) v(id,logo_url,logo_credit,image_url,image_credit,description,description_credit)
where s.id = v.id;
commit;

-- Check
select country, count(*) schools, count(nullif(logo_url,'')) with_logo, count(nullif(image_url,'')) with_photo, count(nullif(description,'')) with_text
from public.schools where country in ('Canada','United Kingdom','Australia') group by country order by country;
"""
open('/home/claude/work/RUN_THIS_5_school_media_canada_uk_australia.sql', 'w').write(sql)
print('rows', len(rows), 'skipped', len(notes))
