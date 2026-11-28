"""
Second try for the 30 Japan, South Korea and China schools that still miss a logo, photo or description (28 Nov 2026).
Differences from fetch_school_media.py:
  - each school is looked up by exact English Wikipedia page titles (no guessing, so no wrong pages);
  - logo: Wikidata logo (P154), then the seal or emblem (P158);
  - photo: Wikidata image (P18), then the page's main image if it has a free licence and is not a logo.
Only free-licence images (Creative Commons or public domain) are kept, with their credit lines.

Run (Windows PowerShell), in the same folder as before:
    python fetch_school_media_asia_retry.py
Writes asia_retry_media.csv and asia_retry_media_report.txt.
"""
import csv, re, time
import requests

S = requests.Session()
S.headers["User-Agent"] = "WEMK-school-media/1.0 (https://jambaconsult.com)"
WP = "https://en.wikipedia.org/w/api.php"
WD = "https://www.wikidata.org/w/api.php"
CM = "https://commons.wikimedia.org/w/api.php"
FREE = re.compile(r"^(CC|Public domain|PD|Attribution|GFDL)", re.I)

# school id in the WEMK database, our name, city, English Wikipedia titles to try in order
SCHOOLS = [
    ("2894b594-04f5-4a20-b31b-2103153f602b", "Duke Kunshan University", "Kunshan", ["Duke Kunshan University"]),
    ("ad29ceb9-f69a-48b4-8bb3-5a5d0bbb8366", "Harbin Institute of Technology", "Harbin", ["Harbin Institute of Technology"]),
    ("7504c985-9477-4c46-a353-80a2680c5afd", "Nanjing Medical University", "Nanjing", ["Nanjing Medical University"]),
    ("f15b574e-69ea-49c4-b85e-5d7f87aa07ca", "NYU Shanghai", "Shanghai", ["NYU Shanghai", "New York University Shanghai"]),
    ("8461d6dc-2c70-41da-8dc4-ceef7365858e", "Peking University", "Beijing", ["Peking University"]),
    ("9a1b561f-31c9-4398-974c-d3af7a324c01", "Tongji University", "Shanghai", ["Tongji University"]),
    ("7289023a-0d13-4f11-b0d8-505d700e8d2f", "Tsinghua University", "Beijing", ["Tsinghua University"]),
    ("72476341-12f0-4b36-ad47-1aafff965d68", "University of Nottingham Ningbo China", "Ningbo", ["University of Nottingham Ningbo China"]),
    ("2780d873-8263-40b5-a458-6b404a79b5da", "Xi'an Jiaotong University", "Xi'an", ["Xi'an Jiaotong University"]),
    ("4af87a61-6fcd-4c94-8e13-6b552e73cea1", "Xi'an Jiaotong-Liverpool University", "Suzhou", ["Xi'an Jiaotong-Liverpool University"]),
    ("238ee58b-6500-47d0-87a0-aed3092266f9", "Zhejiang University", "Hangzhou", ["Zhejiang University"]),
    ("be45c8eb-e50f-492e-a653-49eb274d2e0c", "Eikei University of Hiroshima", "Hiroshima", ["Eikei University of Hiroshima"]),
    ("dc6080db-2b63-4596-a69c-b14d444fdde0", "Hosei University", "Tokyo", ["Hosei University"]),
    ("266f463e-18ae-4d41-b751-ead4f21d9420", "Nagoya University of Commerce and Business", "Nagoya", ["Nagoya University of Commerce & Business", "Nagoya University of Commerce and Business"]),
    ("fea3705e-cb4b-41f1-beb5-6915ac2cf3a9", "Ritsumeikan Asia Pacific University", "Beppu", ["Ritsumeikan Asia Pacific University"]),
    ("5698c08f-54f5-4039-a939-0d1301f72a08", "Shibaura Institute of Technology", "Tokyo", ["Shibaura Institute of Technology"]),
    ("acedd4a6-38e8-4ff3-aa23-f3862570edc6", "Sophia University", "Tokyo", ["Sophia University"]),
    ("8ec55b14-d23f-47af-a923-f9337b132d40", "The University of Aizu", "Aizuwakamatsu", ["University of Aizu"]),
    ("90f61193-059b-450c-ad95-928c8a2a7992", "Tohoku University", "Sendai", ["Tohoku University"]),
    ("246ee828-69a2-4fb8-a388-d7b79c63334a", "Tokyo University of Foreign Studies", "Tokyo", ["Tokyo University of Foreign Studies"]),
    ("3a803b09-b898-4700-b08f-3badc9483250", "University of Hyogo", "Kobe", ["University of Hyogo"]),
    ("2fbe2df4-f1ac-467e-91a7-f14dbb578d83", "Ewha Womans University", "Seoul", ["Ewha Womans University"]),
    ("9212cdac-a243-4572-aee5-ae1f0dbf6a1c", "George Mason University Korea", "Incheon", ["George Mason University Korea"]),
    ("b8c4d68c-816b-4c5b-a345-728a6bf0b9c2", "Ghent University Global Campus", "Incheon", ["Ghent University Global Campus"]),
    ("d20d7e96-21c7-47dc-8244-070bcf7b0744", "Gwangju Institute of Science and Technology (GIST)", "Gwangju", ["Gwangju Institute of Science and Technology"]),
    ("28f977b8-aa7c-4162-9851-e06f2b16bb4c", "Korea University", "Seoul", ["Korea University"]),
    ("421bcd98-650c-47b6-9c85-ee6102c8dd9f", "SolBridge International School of Business (Woosong University)", "Daejeon", ["SolBridge International School of Business"]),
    ("3a3d8fcc-4149-4e97-8a5c-3e16f3257433", "SUNY Korea (Stony Brook University)", "Incheon", ["State University of New York, Korea", "SUNY Korea"]),
    ("de82895a-2b40-45ba-92a6-0614658ae9ed", "The University of Utah Asia Campus", "Incheon", ["University of Utah Asia Campus"]),
    ("4aeaf998-aa54-4dd4-acd0-70c7f309aa19", "Ulsan National Institute of Science and Technology (UNIST)", "Ulsan", ["Ulsan National Institute of Science and Technology"]),
]


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


def page_for(titles):
    # Exact titles only. Redirects are followed; disambiguation and missing pages are skipped.
    for t in titles:
        d = get(WP, action="query", titles=t, prop="pageprops|extracts|pageimages", exintro=1, explaintext=1, exsentences=3,
                ppprop="wikibase_item|disambiguation", piprop="name", pilicense="free", redirects=1)
        for p in (d.get("query", {}).get("pages", {}) or {}).values():
            if "missing" in p or "disambiguation" in (p.get("pageprops") or {}):
                continue
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
            return None
        artist = re.sub(r"<[^>]+>", "", m.get("Artist", {}).get("value") or "").strip()[:80]
        return info.get("thumburl") or info.get("url"), f"{'Photo: ' + artist + ', ' if artist else ''}{lic}, Wikimedia Commons"
    return None


out, report = [], []
for i, (sid, name, city, titles) in enumerate(SCHOOLS, 1):
    rec = {"school_id": sid, "name": name, "city": city, "state": "", "wikipedia": "", "logo_url": "", "logo_credit": "",
           "image_url": "", "image_credit": "", "description": "", "description_credit": ""}
    p = page_for(titles)
    logo_file = None
    if p:
        rec["wikipedia"] = p.get("title", "")
        text = re.sub(r"\s*\([^)]*\)", "", p.get("extract", "") or "").strip()
        if text:
            rec["description"], rec["description_credit"] = text, "Description: Wikipedia, CC BY-SA 4.0"
        qid = (p.get("pageprops") or {}).get("wikibase_item")
        if qid:
            for prop in ("P154", "P158"):
                f = claim_file(qid, prop)
                if f and (c := commons(f, 400)):
                    rec["logo_url"], rec["logo_credit"], logo_file = c[0], c[1], f
                    break
            f = claim_file(qid, "P18")
            if f and (c := commons(f, 1200)):
                rec["image_url"], rec["image_credit"] = c
        if not rec["image_url"] and p.get("pageimage"):
            f = p["pageimage"]
            if f.replace("_", " ") != (logo_file or "").replace("_", " ") and not re.search(r"logo|seal|emblem|crest|coat|wordmark|\.svg$", f, re.I):
                if (c := commons(f, 1200)):
                    rec["image_url"], rec["image_credit"] = c
    missing = [k for k, v in (("logo", rec["logo_url"]), ("photo", rec["image_url"]), ("description", rec["description"])) if not v]
    if missing:
        report.append(f"{name}: " + ", ".join(missing) + ("" if p else " (no Wikipedia page with those titles)"))
    out.append(rec)
    print(f"{i}/{len(SCHOOLS)} {name}: page={rec['wikipedia'] or '-'} logo={'Y' if rec['logo_url'] else 'n'} photo={'Y' if rec['image_url'] else 'n'} text={'Y' if rec['description'] else 'n'}")
    time.sleep(0.3)

with open("asia_retry_media.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(out[0].keys()))
    w.writeheader(); w.writerows(out)
open("asia_retry_media_report.txt", "w", encoding="utf-8").write("\n".join(report))
print(f"Done. {len(out)} schools. {len(report)} still miss something, listed in asia_retry_media_report.txt.")
