"""
Download public four-year US schools from the College Scorecard, with school
details AND the list of bachelor's programmes at each school.

Run (Windows PowerShell):
    pip install requests
    $env:SCORECARD_KEY="your-key"
    python fetch_scorecard_v2.py

Writes three files next to the script:
    scorecard_schools.csv    one row per school (costs, graduation, SAT/ACT, etc.)
    scorecard_programs.csv   one row per school + bachelor's programme (CIP 4-digit)
    scorecard_page0_raw.json the raw first page, so the layout can be checked
"""
import csv
import json
import os
import sys
import time

import requests

KEY = os.environ.get("SCORECARD_KEY")
if not KEY:
    sys.exit('Set the key first: $env:SCORECARD_KEY="your-key"')

URL = "https://api.data.gov/ed/collegescorecard/v1/schools.json"

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
    "latest.cost.avg_net_price.public",
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
    "school.ownership": 1,  # public
    "school.degrees_awarded.predominant": 3,  # bachelor's
    "school.operating": 1,
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
    """Return the programme list however the API shaped it."""
    val = row.get(PROGRAM_PREFIX)
    if isinstance(val, list):
        return val
    # nested form: {"latest": {"programs": {"cip_4_digit": [...]}}}
    node = row.get("latest")
    for part in ("programs", "cip_4_digit"):
        if isinstance(node, dict):
            node = node.get(part)
    return node if isinstance(node, list) else []


def pget(prog, dotted):
    """Read 'credential.level' from either {'credential.level': x} or nested dicts."""
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
    if page == 0:
        with open("scorecard_page0_raw.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=1)
    results = data.get("results", [])
    total = data.get("metadata", {}).get("total", 0)
    for row in results:
        schools.append({k: row.get(k) for k in SCHOOL_FIELDS})
        for p in programmes_of(row):
            level = pget(p, "credential.level")
            if level not in (3, "3"):
                continue  # keep bachelor's programmes only
            programs.append(
                {
                    "school_id": row.get("id"),
                    "school_name": row.get("school.name"),
                    **{f: pget(p, f) for f in PROGRAM_FIELDS},
                }
            )
    print(f"page {page}: {len(schools)} of {total} schools, {len(programs)} bachelor's programmes")
    if len(schools) >= total or not results:
        break
    page += 1

with open("scorecard_schools.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=SCHOOL_FIELDS)
    w.writeheader()
    w.writerows(schools)

pfields = ["school_id", "school_name"] + PROGRAM_FIELDS
with open("scorecard_programs.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=pfields)
    w.writeheader()
    w.writerows(programs)

print("Done. Files: scorecard_schools.csv, scorecard_programs.csv, scorecard_page0_raw.json")
if schools and not programs:
    print("No programmes were parsed. Send me scorecard_page0_raw.json and I will fix the script.")
