#!/usr/bin/env python3
"""
Generate Oracle FreeSQL (23ai) embedded sandbox URLs and a Read the Docs index page
from the per-phase .sql lab packs in 1Z0-171/docs/labs/.

FreeSQL embedded URL format:
  https://freesql.com/embedded/?layout=vertical&compressed_code=<url-encoded base64(gzip(sql + "--EOC"))>&code_language=PL_SQL&code_format=false
"""

import base64
import gzip
import json
from pathlib import Path
import urllib.parse

ROOT_1Z0_171 = Path(__file__).resolve().parent.parent
DOCS_LABS_DIR = ROOT_1Z0_171 / "docs" / "labs"
SCOTT_SQL_PATH = ROOT_1Z0_171 / "docs" / "schemas" / "scott_tiger.sql"
OUTPUT_MD = DOCS_LABS_DIR / "freesql-upload-pack.md"
OUTPUT_JS = ROOT_1Z0_171 / "interactive" / "js" / "data-freesql-labs.js"

PHASE_PACKS = [
    (1, "phase-01-foundations.sql", "Phase 1 (L001–L020): Grundlagen & Basic SELECT"),
    (2, "phase-02-filtering-sorting.sql", "Phase 2 (L021–L042): Filtering, Sorting & Row Limiting"),
    (3, "phase-03-functions.sql", "Phase 3 (L043–L068): Single-Row, Conversion & Conditional Functions"),
    (4, "phase-04-aggregation.sql", "Phase 4 (L069–L082): Grouping & Aggregating Data"),
    (5, "phase-05-joins.sql", "Phase 5 (L083–L102): Multi-Table Joins, Self-Joins & Non-Equijoins"),
    (6, "phase-06-subqueries-set.sql", "Phase 6 (L103–L122): Subqueries & SET Operators"),
    (7, "phase-07-dml-tcl.sql", "Phase 7 (L123–L138): DML & Transaction Control"),
    (8, "phase-08-ddl-objects.sql", "Phase 8 (L139–L162): DDL, Constraints, Views, Sequences & Indexes"),
    (9, "phase-09-dict-tz-dcl.sql", "Phase 9 (L163–L178): Data Dictionary & Time Zones"),
    (10, "phase-10-exam-prep.sql", "Phase 10 (L179–L200): Gold Standard Tasks & Exam Traps"),
]


def encode_freesql_url(sql_text: str) -> str:
    payload = (sql_text.rstrip() + "--EOC").encode("utf-8")
    gz = gzip.compress(payload)
    b64 = base64.b64encode(gz).decode("ascii")
    encoded = urllib.parse.quote(b64, safe="")
    return (
        "https://freesql.com/embedded/"
        f"?layout=vertical&compressed_code={encoded}&code_language=PL_SQL&code_format=false"
    )


def main() -> None:
    lines = [
        "# Oracle FreeSQL Lab Pack & Live-Sandboxes",
        "",
        "Zu jeder Phase des 200-Lektionen-Curriculums gibt es ein direkt ausführbares `.sql`-Skript, das du auf zwei Arten nutzen kannst:",
        "",
        "1. **Mit einem Klick live starten**: Klicke auf **Live in FreeSQL 23ai öffnen ↗**, um eine interaktive, vorausgefüllte Browser-Sandbox mit Oracle Database 23ai (`freesql.com/embedded/`) zu starten, oder",
        "2. **In deinen FreeSQL-Account hochladen**: Lade eine beliebige `.sql`-Datei herunter und lade sie auf [freesql.com](https://freesql.com/) über **My Content → Upload Script** hoch (bzw. führe sie für Variante A lokal in `sqlcl`/`sqlplus` aus).",
        "",
        "!!! tip \"`SCOTT/TIGER` im eigenen FreeSQL-Schema installieren\"",
        "    Für die Phasen 1–6 sind `scott.emp`, `scott.dept` und `scott.salgrade` in FreeSQL bereits vorinstalliert. Für schreibende DML-/DDL-Übungen (Phasen 7–8) lade zuerst [`scott_tiger.sql`](../schemas/scott_tiger.sql) hoch oder führe es im Worksheet aus.",
        "",
        "---",
        "",
        "## Lab-Skripte je Phase & Ein-Klick-Sandboxes",
        "",
        "| Phase | `.sql` herunterladen (Upload Script / `sqlcl`) | Live-Browser-Sandbox |",
        "| :--- | :--- | :--- |",
    ]

    js_packs = []

    for phase_id, fname, title in PHASE_PACKS:
        sql_path = DOCS_LABS_DIR / fname
        sql_text = sql_path.read_text(encoding="utf-8")
        live_url = encode_freesql_url(sql_text)
        lines.append(
            f"| **{title}** | [`{fname}`]({fname}) | [Live in FreeSQL 23ai öffnen ↗]({live_url}) |"
        )
        js_packs.append({
            "key": f"phase-{phase_id}",
            "phaseId": phase_id,
            "filename": fname,
            "title": title,
            "sql": sql_text,
        })

    scott_sql = SCOTT_SQL_PATH.read_text(encoding="utf-8")
    scott_url = encode_freesql_url(scott_sql)
    lines.append(
        f"| **Schema Setup: Klassisches `SCOTT/TIGER` (`EMP`, `DEPT`, `SALGRADE`, `BONUS`)** | [`scott_tiger.sql`](../schemas/scott_tiger.sql) | [Live in FreeSQL 23ai öffnen ↗]({scott_url}) |"
    )
    js_packs.append({
        "key": "scott",
        "phaseId": None,
        "filename": "scott_tiger.sql",
        "title": "Schema Setup: Klassisches SCOTT/TIGER (EMP, DEPT, SALGRADE, BONUS)",
        "sql": scott_sql,
    })

    lines.extend([
        "",
        "---",
        "",
        "## Embedded-URLs & Studio-Daten nach Änderungen neu generieren",
        "",
        "Führe das Generator-Skript im Repository-Root aus:",
        "",
        "```bash",
        "python3 1Z0-171/scripts/build_freesql_links.py",
        "```",
        "",
    ])

    OUTPUT_MD.write_text("\n".join(lines), encoding="utf-8")

    js_content = (
        "// Automatisch generiert durch 1Z0-171/scripts/build_freesql_links.py — nicht manuell bearbeiten.\n"
        f"window.FREESQL_LAB_PACKS = {json.dumps(js_packs, indent=2, ensure_ascii=False)};\n"
    )
    OUTPUT_JS.write_text(js_content, encoding="utf-8")

    print(f"Generated {OUTPUT_MD} and {OUTPUT_JS} with {len(js_packs)} FreeSQL lab packs.")


if __name__ == "__main__":
    main()
