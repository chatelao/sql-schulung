#!/usr/bin/env python3
"""Erzeugt eine anonymisierte Gruppen-Auswertung (Domain-Heatmap) aus bis zu 6
freiwillig geteilten Studio-JSON-Backups.

Aufruf:
    python3 scripts/class_report.py pfad/zum/export_ordner/
"""
import glob, json, os, sys

DOMAINS = [
    (1, "Relational Concepts"),
    (2, "Retrieving Data (SELECT)"),
    (3, "Restricting & Sorting"),
    (4, "Single-Row & Conversion"),
    (5, "Grouping & Aggregating"),
    (6, "Joins"),
    (7, "Subqueries & SET Operators"),
    (8, "DML & Transactions"),
    (9, "DDL, Constraints & Views"),
    (10, "Dictionary & Time Zones"),
    (11, "DCL & Access Control"),
]

def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else "."
    files = sorted(glob.glob(os.path.join(folder, "*.json")))
    if not files:
        print(f"Keine .json-Backups in '{folder}' gefunden.")
        sys.exit(0)

    agg = {d: [] for d, _ in DOMAINS}
    used = 0
    for fp in files:
        try:
            data = json.load(open(fp, encoding="utf-8"))
        except Exception:
            continue
        cps = data.get("checkpoints") or {}
        latest = None
        for k in ["CP-5", "CP-4", "CP-3", "CP-2", "CP-1", "CP-0"]:
            if k in cps and isinstance(cps[k], dict) and cps[k].get("domainScores"):
                latest = cps[k]["domainScores"]
                break
        if not latest:
            continue
        used += 1
        for d, _ in DOMAINS:
            val = latest.get(str(d)) if str(d) in latest else latest.get(d)
            if isinstance(val, (int, float)):
                agg[d].append(val)

    print(f"# Anonymisierte Gruppen-Übersicht ({used} eingelesene Backups)\n")
    print("| Domain | Thema | Schnitt | Min–Max | Fokus nötig? |")
    print("| :-: | :--- | :-: | :-: | :-: |")
    for d, name in DOMAINS:
        vals = agg[d]
        if not vals:
            print(f"| {d} | {name} | — | — | — |")
            continue
        avg = round(sum(vals) / len(vals))
        flag = "Ja (< 60 %)" if avg < 60 else ("Beobachten" if avg < 75 else "OK")
        print(f"| {d} | {name} | {avg} % | {min(vals)}–{max(vals)} % | {flag} |")

if __name__ == "__main__":
    main()
