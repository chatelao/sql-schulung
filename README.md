# Oracle SQL Schulung — Vom Einstieg bis zu Advanced Queries (1Z0-171 & Aufbau)

[![Read the Docs Handbuch](https://img.shields.io/badge/Read%20the%20Docs-Handbuch-8CA1AF?logo=readthedocs&logoColor=white)](https://sql-schulung.readthedocs.io/)
[![GitHub Pages Interactive Studio](https://img.shields.io/badge/GitHub%20Pages-Interactive%20Studio-222222?logo=githubpages&logoColor=white)](https://chatelao.github.io/sql-schulung/)

Dieses Repository bietet ein vollständig strukturiertes **Selbststudium-Programm für Oracle SQL (Oracle AI Database 26ai (kompatibel mit 23ai Free))** — von **null Vorkenntnissen** bis zur Zertifizierung **Oracle AI Database SQL Associate (`1Z0-171`)** sowie weiterführenden **Advanced-SQL-Techniken**.

---

## Lernpfade im Überblick

| Pfad | Zielgruppe & Umfang | Inhalte | Einstieg |
| :--- | :--- | :--- | :--- |
| **1. Grundlagen & Zertifizierung (`1Z0-171`)** | Echte Einsteiger ohne Vorkenntnisse · **200 Lektionen à 45 Min.** (150 Std.) | `SELECT`, `WHERE`, Functions, `GROUP BY`, Joins, Subqueries, `SET`, DML/TCL, DDL/Constraints/Views, Data Dictionary, Time Zones, DCL + 6 Checkpoints + 2 Mock Exams | [`1Z0-171/README.md`](1Z0-171/README.md) · [Selbststudium-Leitfaden](1Z0-171/docs/getting-started/self-study-guide.md) |
| **2. Aufbau-Curriculum (`advanced/`)** | Fortgeschrittene (nach `1Z0-171` Phase 1–6) · **60 Lektionen à 45 Min.** (45 Std.) | Hierarchien (`CONNECT BY` & rekursive `WITH`-CTEs), Regular Expressions, JSON (`JSON_TABLE`), XML (`XMLTABLE`), Analytic/Window Functions, `PIVOT`/`UNPIVOT`, `MATCH_RECOGNIZE` & Execution Plans | [`advanced/README.md`](advanced/README.md) · [`advanced/CURRICULUM.md`](advanced/CURRICULUM.md) |
| **3. SQL Developer Praxis (`sqldeveloper/`)** | Praxis & Firmen-Anwender:innen (ausserhalb `1Z0-171`) · **30 Lektionen à 45 Min.** (22,5 Std.) | Schachbrettmuster & NLS, Verbindungen (JSON-Import/-Export), Schemenfilter, Objektsuche (`Find DB Object`), Drag-and-Drop-Joins (`Query Builder`), Schnellformatierungen (`Strg+F7`, `/*csv*/`) & verlustfreier Excel-Export (33-stellige Zahlen ohne `E`-Form) | [`sqldeveloper/README.md`](sqldeveloper/README.md) · [`sqldeveloper/CURRICULUM.md`](sqldeveloper/CURRICULUM.md) |

---

## In 5 Minuten im Selbststudium loslegen

1. **Handbuch öffnen**: Lies auf [Read the Docs](https://sql-schulung.readthedocs.io/) zuerst den **Selbststudium-Leitfaden** (`1Z0-171/docs/getting-started/self-study-guide.md`).
2. **Lab-Umgebung wählen**:
   - **Ohne Installation (empfohlen für den schnellen Start)**: [Oracle FreeSQL (`freesql.com`)](https://freesql.com/) im Browser (Variante B).
   - **Lokal / In-House**: `Oracle AI Database 26ai (kompatibel mit 23ai Free) Free` Container oder interne PDB (Variante A).
3. **Interactive Studio öffnen**: Starte das [GitHub Pages Interactive Studio](https://chatelao.github.io/sql-schulung/) für:
   - den **200-Lektionen-Fortschrittstracker** (inkl. Advanced `A001–A060` & SQL Developer `D001–D030`),
   - **Checkpoint `CP-0`** (Baseline-Test zu Kursbeginn in `L001–L002`),
   - **Join- & `SUBSTR`-Visualizer**, **`sqlplus`-Simulator**, **Human-Compiler-Drills**, **Flashcards** und **Mock Exams**.
4. **Erste Übungen ausführen**: Nutze die vorbereiteten Lab-Skripte unter [`1Z0-171/docs/labs/`](1Z0-171/docs/labs/) bzw. starte sie per Ein-Klick-Link direkt in Oracle FreeSQL.

---

## Repository-Struktur

```text
sql-schulung/
├── README.md                  # Diese Übersicht
├── 1Z0-171/                   # 200-Lektionen-Grundkurs & Zertifizierungsvorbereitung
│   ├── CURRICULUM.md          # Masterplan (L001–L200)
│   ├── docs/                  # Read the Docs Handbuch (Phasen, Schemas, Cheat Sheets, Labs)
│   ├── interactive/           # GitHub Pages Interactive SQL Studio
│   └── scripts/               # Generator für FreeSQL-Sandboxes & Studio-Daten
├── advanced/                  # 60-Lektionen-Aufbaumodul (A001–A060)
│   ├── CURRICULUM.md          # Lehrplan (Hierarchien, Regex, JSON, XML, Window Functions, Patterns)
│   └── docs/                  # Lehrbuchkapitel & Sandbox-Skripte
└── sqldeveloper/              # 30-Lektionen-Praxistrack ausserhalb 1Z0-171 (D001–D030)
    ├── CURRICULUM.md          # Lehrplan (Grid/Schachbrett, Filter, Suche, D&D-Joins, Format, Excel)
    └── docs/                  # Lehrbuchkapitel, Checkpoints (DCP-1/2) & Sandbox-Skripte
```
