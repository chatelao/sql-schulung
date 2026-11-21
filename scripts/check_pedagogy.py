#!/usr/bin/env python3
"""Prüft pädagogische Mindeststandards in 1Z0-171/docs/phases/*.md und advanced/docs/modul-*.md:
- Jede ### `Lxxx`- bzw. `Axxx`-Lektion hat ein Lernziel mit Bloom-Stufe *(Bloom: ...)* und eine ??? success Musterlösung
- Jede Phase hat >= 3 Mermaid-Diagramme mit Alt-Text, Lückentext-Fading (___), Gemischtes Training, Hybrid-Paaraufgaben und Praxis-Transfer
- Alle 60 Advanced-Lektionen (A001..A060) sind vorhanden"""
import glob, re, sys

errs = []
for f in sorted(glob.glob("1Z0-171/docs/phases/phase-*.md")):
    s = open(f, encoding="utf-8").read()
    name = f.split("/")[-1]
    secs = [sec for sec in re.split(r'(?=^### )', s, flags=re.M) if sec.startswith("### `L")]
    for sec in secs:
        head = sec.splitlines()[0]
        if "??? success" not in sec:
            errs.append(f"{name}: Keine Musterlösung in '{head}'")
        if "(Bloom:" not in sec:
            errs.append(f"{name}: Kein Bloom-Tag im Lernziel von '{head}'")
    if s.count("```mermaid") < 3:
        errs.append(f"{name}: Weniger als 3 Mermaid-Diagramme ({s.count('```mermaid')})")
    if "*Alt-Text:" not in s:
        errs.append(f"{name}: Fehlender Alt-Text für Diagramme")
    if "___" not in s:
        errs.append(f"{name}: Keine Lückentext-Fading-Aufgabe (___)")
    if "## Gemischtes Training" not in s:
        errs.append(f"{name}: Fehlendes Gemischtes Training")
    if "## Hybrid-Paaraufgaben" not in s:
        errs.append(f"{name}: Fehlende Hybrid-Paaraufgaben")
    if "## Praxis-Transfer" not in s:
        errs.append(f"{name}: Fehlender Praxis-Transfer")

adv_ids = set()
for f in sorted(glob.glob("advanced/docs/modul-*.md")):
    s = open(f, encoding="utf-8").read()
    name = f.split("/")[-1]
    secs = [sec for sec in re.split(r'(?=^### )', s, flags=re.M) if sec.startswith("### `A")]
    for sec in secs:
        head = sec.splitlines()[0]
        m = re.match(r'^### `(A\d{3})`', head)
        if m:
            adv_ids.add(m.group(1))
        if "??? success" not in sec:
            errs.append(f"{name}: Keine Musterlösung in '{head}'")
        if "(Bloom:" not in sec:
            errs.append(f"{name}: Kein Bloom-Tag im Lernziel von '{head}'")
    if s.count("```mermaid") < 1 or "*Alt-Text:" not in s:
        errs.append(f"{name}: Fehlendes Mermaid-Diagramm oder Alt-Text")

if len(adv_ids) != 60:
    errs.append(f"Advanced SQL: {len(adv_ids)}/60 Lektionen gefunden")

print(f"Geprüfte Phasen: 10 + 6 Advanced-Module ({len(adv_ids)} A-Lektionen), Probleme: {len(errs)}")
if errs:
    print("\n".join(errs))
    sys.exit(1)
