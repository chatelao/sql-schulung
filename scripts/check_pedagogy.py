#!/usr/bin/env python3
"""Prüft pädagogische Mindeststandards in 1Z0-171/docs/phases/*.md:
- Jede ### `Lxxx`-Lektion hat eine ??? success Musterlösung
- Jede Phase hat >= 3 Mermaid-Diagramme mit Alt-Text
- Jede Phase hat Lückentext-Fading (___), Hybrid-Paaraufgaben und Praxis-Transfer"""
import glob, re, sys

errs = []
for f in sorted(glob.glob("1Z0-171/docs/phases/phase-*.md")):
    s = open(f, encoding="utf-8").read()
    name = f.split("/")[-1]
    secs = [sec for sec in re.split(r'(?=^### )', s, flags=re.M) if sec.startswith("### `L")]
    for sec in secs:
        if "??? success" not in sec:
            errs.append(f"{name}: Keine Musterlösung in '{sec.splitlines()[0]}'")
    if s.count("```mermaid") < 3:
        errs.append(f"{name}: Weniger als 3 Mermaid-Diagramme ({s.count('```mermaid')})")
    if "*Alt-Text:" not in s:
        errs.append(f"{name}: Fehlender Alt-Text für Diagramme")
    if "___" not in s:
        errs.append(f"{name}: Keine Lückentext-Fading-Aufgabe (___)")
    if "## Hybrid-Paaraufgaben" not in s:
        errs.append(f"{name}: Fehlende Hybrid-Paaraufgaben")
    if "## Praxis-Transfer" not in s:
        errs.append(f"{name}: Fehlender Praxis-Transfer")

print(f"Geprüfte Phasen: 10, Probleme: {len(errs)}")
if errs:
    print("\n".join(errs))
    sys.exit(1)
