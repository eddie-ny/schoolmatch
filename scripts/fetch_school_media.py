"""
Find a logo, a banner photo and a short description for each school, from Wikipedia, Wikidata and Wikimedia Commons.

Run (Windows PowerShell), in the folder that has scorecard_schools.csv:
    pip install requests
    python fetch_school_media.py            # all schools (takes about 15 minutes)
    python fetch_school_media.py 5          # test with the first 5 schools only

Writes school_media.csv (one row per school) and school_media_report.txt (schools where nothing was found).
Only images with a free licence (Creative Commons or public domain) are kept. Every image and text keeps its credit line.
"""
import csv, re, sys, time
import requests

LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else None
S = requests.Session()
S.headers["User-Agent"] = "WEMK-school-media/1.0 (eaacquah3002@gmail.com)"
WP = "https://en.wikipedia.org/w/api.php"
WD = "https://www.wikidata.org/w/api.php"
CM = "https://commons.wikimedia.org/w/api.php"
FREE = re.compile(r"^(CC|Public domain|PD|Attribution|GFDL)", re.I)


def get(url, **params):
    params["format"] = "json"
    for _ in range(4):
        try:
            r = S.get(url, params=params, timeout=30)
            if r.status_code == 429:
                time.sleep(10); continue
            r.raise_for_status()
            return r.json()
        except Exception:
            time.sleep(3)
    return {}


def words(t):
    return {w for w in re.findall(r"[a-z]+", t.lower()) if w not in {"the", "of", "at", "and", "university", "college", "state", "in"}}


def find_page(name, city, state):
    d = get(WP, action="query", generator="search", gsrsearch=f"{name} {city} {state}", gsrlimit=3, prop="pageprops|extracts",
            exintro=1, explaintext=1, exsentences=3, ppprop="wikibase_item", redirects=1)
    pages = sorted((d.get("query", {}).get("pages", {})).values(), key=lambda p: p.get("index", 99))
    want = words(name)
    for p in pages:
        title, text = p.get("title", ""), p.get("extract", "")
        got = words(title)
        if want and len(want & got) / len(want) >= 0.6 and re.search(r"universit|college|institute|school|polytechnic", text[:400], re.I):
            return p
    return None


def claim_file(qid, prop):
    d = get(WD, action="wbgetclaims", entity=qid, property=prop)
    for c in d.get("claims", {}).get(prop, []):
        if c.get("rank") == "deprecated":
            continue
        v = c.get("mainsnak", {}).get("datavalue", {}).get("value")
        if isinstance(v, str):
            return v
    return None


def commons(filename, width):
    d = get(CM, action="query", titles="File:" + filename, prop="imageinfo", iiprop="url|extmetadata", iiurlwidth=width)
    for p in d.get("query", {}).get("pages", {}).values():
        info = (p.get("imageinfo") or [None])[0]
        if not info:
            return None
        m = info.get("extmetadata", {})
        lic = (m.get("LicenseShortName", {}).get("value") or "").strip()
        if not FREE.match(lic):
            return None  # not a free licence, skip it
        artist = re.sub(r"<[^>]+>", "", m.get("Artist", {}).get("value") or "").strip()[:80]
        credit = f"{'Photo: ' + artist + ', ' if artist else ''}{lic}, Wikimedia Commons"
        return info.get("thumburl") or info.get("url"), credit


rows = list(csv.DictReader(open("scorecard_schools.csv", encoding="utf-8")))
if LIMIT:
    rows = rows[:LIMIT]
out, missing = [], []
for i, r in enumerate(rows, 1):
    name, city, state = r["school.name"], r["school.city"], r["school.state"]
    rec = {"school_id": r["id"], "name": name, "city": city, "state": state, "wikipedia": "", "logo_url": "", "logo_credit": "",
           "image_url": "", "image_credit": "", "description": "", "description_credit": ""}
    page = find_page(name, city, state)
    if page:
        rec["wikipedia"] = page.get("title", "")
        text = re.sub(r"\s*\([^)]*\)", "", page.get("extract", "")).strip()
        if text:
            rec["description"] = text
            rec["description_credit"] = "Description: Wikipedia, CC BY-SA 4.0"
        qid = page.get("pageprops", {}).get("wikibase_item")
        if qid:
            logo = claim_file(qid, "P154")
            if logo and (c := commons(logo, 400)):
                rec["logo_url"], rec["logo_credit"] = c
            img = claim_file(qid, "P18")
            if img and (c := commons(img, 1200)):
                rec["image_url"], rec["image_credit"] = c
    if not (rec["logo_url"] and rec["image_url"] and rec["description"]):
        missing.append(f"{name} ({city}, {state}): " + ", ".join(k for k, v in (("logo", rec["logo_url"]), ("photo", rec["image_url"]), ("description", rec["description"])) if not v) + (" (no Wikipedia page matched)" if not page else ""))
    out.append(rec)
    print(f"{i}/{len(rows)} {name}: logo={'Y' if rec['logo_url'] else 'n'} photo={'Y' if rec['image_url'] else 'n'} text={'Y' if rec['description'] else 'n'}")
    time.sleep(0.3)

with open("school_media.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(out[0].keys()))
    w.writeheader(); w.writerows(out)
open("school_media_report.txt", "w", encoding="utf-8").write("\n".join(missing))
print(f"Done. {len(out)} schools. {len(missing)} are missing something, listed in school_media_report.txt.")
