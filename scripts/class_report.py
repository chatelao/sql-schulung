#!/usr/bin/env python3
"""Erzeugt eine anonymisierte Gruppen-Auswertung (Domain-Heatmap) aus bis zu 6
freiwillig geteilten Studio-JSON-Backups.

Unterstützt alle drei JSON-Formate des Interactive Studios:
1. Checkpoint-Export (`1z0-171-checkpoints.json` -> `checkpoints[cp].score.domainScores[d] = {correct, total}`)
2. Vollständiges Lernstand-Backup (`oracle-1z0-171-lernstand-*.json` -> `gradedCheckpoints[cp]` oder `checkpoints[cp].answers`)
3. Vereinfachtes Schema (`checkpoints[cp].domainScores[d] = Prozentzahl`)

Aufruf:
    python3 scripts/class_report.py pfad/zum/export_ordner/
"""
import glob, json, os, re, sys

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

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_question_key():
    """Liest CHECKPOINT_QUESTIONS aus data-checkpoints.js für Roh-Answer-Backups."""
    p = os.path.join(ROOT, "1Z0-171", "interactive", "js", "data-checkpoints.js")
    if not os.path.exists(p):
        return []
    txt = open(p, encoding="utf-8").read()
    q_list = []
    for m in re.finditer(r'id:\s*"([^"]+)"\s*,\s*domainId:\s*(\d+).*?answer:\s*\[([0-9,\s]+)\]', txt, re.S):
        ans = sorted(int(x.strip()) for x in m.group(3).split(",") if x.strip())
        q_list.append((m.group(1), int(m.group(2)), ans))
    return q_list

QUESTIONS = load_question_key()

def extract_domain_pcts(cp_obj):
    """Extrahiert {domain_id: pct (0..100)} aus einem Checkpoint-Eintrag."""
    if not isinstance(cp_obj, dict):
        return None
    # Format 1 & 2a: cp_obj["score"]["domainScores"][d] = {"correct": c, "total": t}
    ds = None
    if isinstance(cp_obj.get("score"), dict) and isinstance(cp_obj["score"].get("domainScores"), dict):
        ds = cp_obj["score"]["domainScores"]
    elif isinstance(cp_obj.get("domainScores"), dict):
        ds = cp_obj["domainScores"]

    if ds:
        out = {}
        for d, _ in DOMAINS:
            v = ds.get(str(d)) if str(d) in ds else ds.get(d)
            if isinstance(v, (int, float)):
                out[d] = float(v)
            elif isinstance(v, dict) and v.get("total"):
                out[d] = round((v.get("correct", 0) / v["total"]) * 100.0, 1)
        if out:
            return out

    # Format 2b: Rohes localStorage-Backup mit submitted=True und answers={qId: [idx]}
    if cp_obj.get("submitted") and isinstance(cp_obj.get("answers"), dict) and QUESTIONS:
        ans_map = cp_obj["answers"]
        counts = {d: [0, 0] for d, _ in DOMAINS}
        for qid, dom_id, expected in QUESTIONS:
            counts[dom_id][1] += 1
            picked = sorted(int(x) for x in (ans_map.get(qid) or []))
            if picked == expected:
                counts[dom_id][0] += 1
        return {d: round((c / t) * 100.0, 1) for d, (c, t) in counts.items() if t > 0}

    return None

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
        if not isinstance(data, dict):
            continue
        sources = []
        if isinstance(data.get("gradedCheckpoints"), dict):
            sources.append(data["gradedCheckpoints"])
        if isinstance(data.get("checkpoints"), dict):
            sources.append(data["checkpoints"])

        latest = None
        for src in sources:
            for k in ["CP-5", "CP-4", "CP-3", "CP-2", "CP-1", "CP-0"]:
                if k in src:
                    latest = extract_domain_pcts(src[k])
                    if latest:
                        break
            if latest:
                break
        if not latest:
            continue
        used += 1
        for d, _ in DOMAINS:
            if d in latest:
                agg[d].append(latest[d])

    print(f"# Anonymisierte Gruppen-Übersicht ({used} eingelesene Backups)\n")
    print("| Domain | Thema | Schnitt | Min–Max | Fokus nötig? |")
    print("| :-: | :--- | :-: | :-: | :-: |")
    for d, name in DOMAINS:
        vals = agg[d]
        if not vals:
            print(f"| {d} | {name} | — | — | — |")
            continue
        avg = round(sum(vals) / len(vals))
        lo, hi = round(min(vals)), round(max(vals))
        flag = "Ja (< 60 %)" if avg < 60 else ("Beobachten" if avg < 75 else "OK")
        print(f"| {d} | {name} | {avg} % | {lo}–{hi} % | {flag} |")

if __name__ == "__main__":
    main()
