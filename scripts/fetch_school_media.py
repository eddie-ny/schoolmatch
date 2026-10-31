"""
Find a logo, a banner photo and a short description for each school, from Wikipedia, Wikidata and Wikimedia Commons.

Run (Windows PowerShell), in the folder that has scorecard_schools.csv:
    pip install requests
    python fetch_school_media.py            # all schools (takes about 15 minutes)
    python fetch_school_media.py 5          # test with the first 5 schools only
    python fetch_school_media.py 0 ghana ghana_media.csv      # the Ghana schools, read from the WEMK database
    python fetch_school_media.py 0 db:Australia australia_media.csv   # any country already in the database

Writes school_media.csv (one row per school) and school_media_report.txt (schools where nothing was found).
Only images with a free licence (Creative Commons or public domain) are kept. Every image and text keeps its credit line.
"""
import csv, re, sys, time
import requests

LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 and int(sys.argv[1]) > 0 else None
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


SPORT = re.compile(r"football|basketball|baseball|softball|volleyball|hockey|athletic|\b(men|women)'s\b|\bteam\b|\bseason\b|rivalry|alumni|\blist of\b|\bhistory of\b|\bpeople\b|disaster|collapse|\bsystem\b|\b\d{4}\b", re.I)
INST = re.compile(r"^[^.]{0,250}\b(is|was|are) (a|an|the|one of)\b[^.]{0,250}\b(universit|college|institute|polytechnic|academy|school)", re.I)


def variants(name):
    n = name.replace("&", "and").replace("  ", " ")
    n = re.sub(r"[-\s]+Main Campus$", "", n).strip()
    out = [n]
    if re.search(r"[A-Za-z]-[A-Z]", n):
        out.append(re.sub(r"(?<=[a-z])-(?=[A-Z])", ", ", n))      # University of California-Los Angeles -> ..., Los Angeles
        out.append(re.sub(r"(?<=[a-z])-(?=[A-Z])", " at ", n))
        out.append(re.sub(r"(?<=[a-z])-(?=[A-Z])", " ", n))
    if n.lower().startswith("the "):
        out.append(n[4:])
    out.append(name.strip())
    return list(dict.fromkeys(out))


def good_page(p, name):
    title, text = p.get("title", ""), p.get("extract", "") or ""
    if "missing" in p or "disambiguation" in (p.get("pageprops") or {}) or "disambiguation" in p:
        return False
    if SPORT.search(title) or not INST.search(text[:500]):
        return False
    want = {w for w in re.findall(r"[a-z]+", name.lower()) if w not in {"the", "of", "at", "and", "main", "campus"}}
    got = {w for w in re.findall(r"[a-z]+", (title + " " + text[:200]).lower())}
    return bool(want) and len(want & got) / len(want) >= 0.6


def fetch_titles(titles):
    d = get(WP, action="query", titles="|".join(titles), prop="pageprops|extracts", exintro=1, explaintext=1, exsentences=3,
            ppprop="wikibase_item|disambiguation", redirects=1, exlimit="max")
    return list((d.get("query", {}).get("pages", {})).values())


def find_page(name, city, state):
    # 1. exact titles (fast and reliable), 2. a search, checked the same way
    pages = fetch_titles(variants(name)[:8])
    order = {v.lower(): i for i, v in enumerate(variants(name))}
    pages.sort(key=lambda p: order.get(p.get("title", "").lower(), 99))
    for p in pages:
        if good_page(p, name):
            return p
    d = get(WP, action="query", generator="search", gsrsearch=f'{name} {city}', gsrlimit=8, prop="pageprops|extracts",
            exintro=1, explaintext=1, exsentences=3, ppprop="wikibase_item|disambiguation", redirects=1)
    hits = sorted((d.get("query", {}).get("pages", {})).values(), key=lambda p: p.get("index", 99))
    for p in hits:
        if good_page(p, name):
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


INPUT = sys.argv[2] if len(sys.argv) > 2 else "scorecard_schools.csv"
OUTPUT = sys.argv[3] if len(sys.argv) > 3 else "school_media.csv"
if INPUT == "ghana" or INPUT.startswith("db:"):   # the Ghana schools straight from the WEMK database (public read key, the same one the website uses)
    r = S.get("https://zzuoqdeeegzmgtuvspgz.supabase.co/rest/v1/schools_summary", params={"select": "id,name,city", "country": "ilike." + (INPUT[3:] if INPUT.startswith("db:") else "ghana"), "limit": 1000},
              headers={"apikey": "sb_publishable_W0zf4b36Y7qPcTK32CgwAQ_MmFfEanR"}, timeout=60)
    r.raise_for_status()
    rows = [{"id": x["id"], "name": x["name"], "city": x["city"] or "", "state": ""} for x in r.json()]
else:
    rows = list(csv.DictReader(open(INPUT, encoding="utf-8")))
if rows and "school.name" in rows[0]:   # the Scorecard file; convert to id, name, city, state
    rows = [{"id": r["id"], "name": r["school.name"], "city": r["school.city"], "state": r["school.state"]} for r in rows]
if LIMIT:
    rows = rows[:LIMIT]
out, missing = [], []
for i, r in enumerate(rows, 1):
    name, city, state = r["name"], r["city"], r.get("state", "")
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

with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(out[0].keys()))
    w.writeheader(); w.writerows(out)
open(OUTPUT.replace(".csv", "_report.txt"), "w", encoding="utf-8").write("\n".join(missing))
print(f"Done. {len(out)} schools. {len(missing)} are missing something, listed in school_media_report.txt.")
