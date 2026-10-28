"""Pull US public four-year universities from the College Scorecard API into a CSV.

Setup (one time):
  1. Get a free key at https://collegescorecard.ed.gov/data/api-documentation/ (the key is emailed to you).
  2. pip install requests
Run:
  Windows (PowerShell):  $env:SCORECARD_KEY="your-key"; python scripts/fetch_scorecard.py
  Mac/Linux:             SCORECARD_KEY=your-key python scripts/fetch_scorecard.py
Output: scorecard_public_4yr.csv in the current folder. Send me that file. Never commit your key.

Field names below are the Scorecard's own. If the API says a field is unknown, the error message
names it: delete or rename that field in FIELDS and run again.
"""
import csv
import os
import sys
import time

import requests

KEY = os.environ.get("SCORECARD_KEY")
if not KEY:
    sys.exit("Set the SCORECARD_KEY environment variable first (see the top of this file).")

URL = "https://api.data.gov/ed/collegescorecard/v1/schools.json"
FIELDS = [
    "id",
    "school.name",
    "school.city",
    "school.state",
    "school.school_url",
    "latest.student.size",
    "latest.admissions.admission_rate.overall",
    "latest.admissions.sat_scores.25th_percentile.math",
    "latest.admissions.sat_scores.75th_percentile.math",
    "latest.admissions.sat_scores.25th_percentile.critical_reading",
    "latest.admissions.sat_scores.75th_percentile.critical_reading",
    "latest.admissions.sat_scores.average.overall",
    "latest.admissions.test_requirements",  # 1 required, 2 recommended, 3 neither required nor recommended, 4 do not know, 5 considered but not required (ADMCON7)
    "latest.cost.tuition.out_of_state",
]
PARAMS = {
    "api_key": KEY,
    "school.ownership": 1,  # 1 = public
    "school.degrees_awarded.predominant": 3,  # 3 = bachelor's degrees
    "school.operating": 1,  # currently operating
    "fields": ",".join(FIELDS),
    "per_page": 100,
}

rows, page = [], 0
while True:
    r = requests.get(URL, params={**PARAMS, "page": page}, timeout=60)
    if r.status_code == 429:
        print("Rate limit hit, waiting 60 seconds...")
        time.sleep(60)
        continue
    r.raise_for_status()
    data = r.json()
    results = data.get("results", [])
    rows.extend(results)
    total = data.get("metadata", {}).get("total", 0)
    print(f"page {page}: {len(rows)} of {total}")
    if len(rows) >= total or not results:
        break
    page += 1

with open("scorecard_public_4yr.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(FIELDS)
    for row in rows:
        w.writerow([row.get(c) for c in FIELDS])
print(f"Saved {len(rows)} schools to scorecard_public_4yr.csv")
