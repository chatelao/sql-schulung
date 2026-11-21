#!/usr/bin/env python3
"""Prüft Oracle-Referenzlinks: Version, Abdeckung (refUrl je Lektion) und Erreichbarkeit.
Aufruf: python3 scripts/check_refs.py [--offline]"""
import re, sys, glob, urllib.request
from concurrent.futures import ThreadPoolExecutor
LATEST = "26"
ROOT = __file__.rsplit("/scripts/", 1)[0]
files = [f for f in glob.glob(ROOT + "/**/*", recursive=True)
         if f.endswith((".md", ".js", ".yml", ".html")) and "node_modules" not in f]
urls, errs = set(), []
for f in files:
    for u in re.findall(r'https://docs\.oracle\.com/[^\s)"\'>`]+', open(f, encoding="utf-8").read()):
        urls.add(u.rstrip(".,"))
        m = re.search(r"oracle-database/(\d+)/", u)
        if m and m.group(1) != LATEST:
            errs.append(f"Alte Version {m.group(1)}: {u}")
cur = open(ROOT + "/1Z0-171/interactive/js/data-curriculum.js", encoding="utf-8").read()
for m in re.finditer(r'\{ id: "(L\d+)"([^\n]*)', cur):
    if "refUrl" not in m.group(2):
        errs.append(f"Lektion {m.group(1)} ohne refUrl")
for f in sorted(glob.glob(ROOT + "/advanced/docs/modul-*.md")):
    if "docs.oracle.com" not in open(f, encoding="utf-8").read():
        errs.append(f"{f} ohne Oracle-Referenz")
if "--offline" not in sys.argv:
    def head(u):
        try:
            urllib.request.urlopen(urllib.request.Request(u.split("#")[0], method="HEAD"), timeout=20); return None
        except Exception as e:
            return f"Nicht erreichbar ({str(e)[:30]}): {u}"
    with ThreadPoolExecutor(8) as ex:
        errs += [r for r in ex.map(head, sorted(urls)) if r]
print(f"{len(urls)} Links geprüft, {len(errs)} Probleme")
print("\n".join(errs)); sys.exit(1 if errs else 0)
