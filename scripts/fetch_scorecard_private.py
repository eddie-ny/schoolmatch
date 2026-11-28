"""
Download selective PRIVATE non-profit four-year US schools from the College
Scorecard (Ivy League, Stanford, MIT, Duke and similar), with school details
and the bachelor's programmes at each school.

Selection rule (objective, so anyone can re-run it):
    private non-profit, mainly bachelor's, still operating,
    overall admission rate 20% or lower.

Run (Windows PowerShell):
    pip install requests
    $env:SCORECARD_KEY="your-key"
    python fetch_scorecard_private.py

Writes next to the script:
    private_schools.csv    one row per school
    private_programs.csv   one row per school + bachelor's programme (CIP 4-digit)
Send both files back in the chat.
"""
import csv
import os
import sys
import time

import requests

KEY = os.environ.get("SCORECARD_KEY")
if not KEY:
    sys.exit('Set the key first: $env:SCORECARD_KEY="your-key"')

URL = "https://api.data.gov/ed/collegescorecard/v1/schools.json"
MAX_RATE = "0.20"  # change to 0.15 for fewer schools, 0.25 for more

SCHOOL_FIELDS = [
    "id",
    "school.name",
    "school.city",
    "school.state",
    "school.school_url",
    "school.locale",
    "latest.student.size",
    "latest.student.demographics.race_ethnicity.non_resident_alien",
    "latest.student.retention_rate.four_year.full_time",
    "latest.admissions.admission_rate.overall",
    "latest.admissions.test_requirements",
    "latest.admissions.sat_scores.25th_percentile.math",
    "latest.admissions.sat_scores.75th_percentile.math",
    "latest.admissions.sat_scores.25th_percentile.critical_reading",
    "latest.admissions.sat_scores.75th_percentile.critical_reading",
    "latest.admissions.sat_scores.average.overall",
    "latest.admissions.act_scores.25th_percentile.cumulative",
    "latest.admissions.act_scores.75th_percentile.cumulative",
    "latest.cost.tuition.in_state",
    "latest.cost.tuition.out_of_state",
    "latest.cost.attendance.academic_year",
    "latest.cost.avg_net_price.private",
    "latest.cost.roomboard.oncampus",
    "latest.completion.completion_rate_4yr_150nt",
    "latest.earnings.10_yrs_after_entry.median",
]

PROGRAM_PREFIX = "latest.programs.cip_4_digit"
PROGRAM_FIELDS = [
    "code",
    "title",
    "credential.level",
    "credential.title",
    "counts.ipeds_awards1",
    "counts.ipeds_awards2",
    "earnings.highest.2_yr.overall_median_earnings",
]

PARAMS = {
    "api_key": KEY,
    "school.ownership": 2,  # private non-profit
    "school.degrees_awarded.predominant": 3,  # bachelor's
    "school.operating": 1,
    "latest.admissions.admission_rate.overall__range": "0.." + MAX_RATE,
    "fields": ",".join(SCHOOL_FIELDS + [PROGRAM_PREFIX + "." + f for f in PROGRAM_FIELDS]),
    "per_page": 50,
}


def get_page(page):
    while True:
        r = requests.get(URL, params={**PARAMS, "page": page}, timeout=120)
        if r.status_code == 429:
            print("Rate limit hit, waiting 60 seconds...")
            time.sleep(60)
            continue
        if not r.ok:
            print("HTTP", r.status_code)
            print(r.text[:600].replace(KEY, "<key hidden>"))
            sys.exit(1)
        return r.json()


def programmes_of(row):
    val = row.get(PROGRAM_PREFIX)
    if isinstance(val, list):
        return val
    node = row.get("latest")
    for part in ("programs", "cip_4_digit"):
        if isinstance(node, dict):
            node = node.get(part)
    return node if isinstance(node, list) else []


def pget(prog, dotted):
    if dotted in prog:
        return prog[dotted]
    node = prog
    for part in dotted.split("."):
        if isinstance(node, dict) and part in node:
            node = node[part]
        else:
            return None
    return node


schools, programs = [], []
page = 0
while True:
    data = get_page(page)
    results = data.get("results", [])
    total = data.get("metadata", {}).get("total", 0)
    for row in results:
        rate = row.get("latest.admissions.admission_rate.overall")
        if rate is None:
            continue  # the range filter should already drop these
        schools.append({k: row.get(k) for k in SCHOOL_FIELDS})
        for p in programmes_of(row):
            if pget(p, "credential.level") not in (3, "3"):
                continue  # bachelor's only
            programs.append({"school_id": row.get("id"), "school_name": row.get("school.name"),
                             **{f: pget(p, f) for f in PROGRAM_FIELDS}})
    print(f"page {page}: {len(schools)} of {total} schools, {len(programs)} bachelor's programmes")
    if page * 50 + len(results) >= total or not results:
        break
    page += 1

with open("private_schools.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=SCHOOL_FIELDS)
    w.writeheader()
    w.writerows(schools)

with open("private_programs.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["school_id", "school_name"] + PROGRAM_FIELDS)
    w.writeheader()
    w.writerows(programs)

print("Done. Send private_schools.csv and private_programs.csv back in the chat.")
for s in sorted(schools, key=lambda s: s["latest.admissions.admission_rate.overall"]):
    print(f'{s["latest.admissions.admission_rate.overall"]:.3f}  {s["school.name"]}')
