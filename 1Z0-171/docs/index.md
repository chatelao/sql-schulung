# Oracle 1Z0-171 SQL Zero-to-Certified Handbuch

Willkommen zum offiziellen statischen Lehrbuch für das **200-Lektionen-Einsteiger-Curriculum**, das dich von **null Datenbank-Vorkenntnissen** gezielt bis zur bestandenen Zertifizierungsprüfung **Oracle AI Database SQL Associate (1Z0-171)** begleitet.

!!! info "Duales Lernmodell (Read the Docs + GitHub Pages)"
    - **Du liest gerade auf Read the Docs**: Ideal für ruhiges, ablenkungsfreies Lesen, druckbare Study Guides, ERDs und kompakte SQL-Syntax-Referenzen.
    - **Interaktiver Begleiter auf GitHub Pages**: Nutze das [Interactive SQL Learning Studio](https://chatelao.github.io/sql-schulung/) für die **6 identischen Checkpoints (`CP-0`–`CP-5`)**, Join-/String-Visualizer, den `sqlplus`-Substitution-Simulator, Flashcards und zeitgesteuerte 60-Fragen-Mock-Exams.

---

## Wichtige Prüfungsdaten auf einen Blick

| Merkmal | Spezifikation |
| :--- | :--- |
| **Exam Code** | `1Z0-171` — Oracle AI Database SQL Associate |
| **Target Database** | Oracle AI Database (23ai) |
| **Fragen & Format** | 60 Multiple-Choice-Fragen (inkl. Multi-Select) |
| **Dauer** | 120 Minuten |
| **Passing Score** | **65 %** (39 richtige Antworten) |
| **Voraussetzungen** | Keine |

---

## Aufbau jeder 45-Minuten-Lektion

Jede der **200 Lektionen (`L001`–`L200`)** folgt demselben wiederkehrenden 45-Minuten-Rhythmus:

1. **Warm-Up Recall (5 Min.)** — Beantworte 3 kurze Wiederholungsfragen auf GitHub Pages, bevor du in die Unterlagen schaust.
2. **Micro-Concept (10 Min.)** — Lies ein fokussiertes Konzept hier auf Read the Docs.
3. **Guided Live Coding (15 Min.)** — Führe die ausgearbeiteten Beispiele zuerst auf **`SCOTT/TIGER`** (14 Employees, 4 Departments) und danach auf **`HR`** aus.
4. **Independent Practice (12 Min.)** — Sage die Query-Ausgabe *vor* dem Ausführen in deiner Oracle-Datenbank voraus.
5. **Exam Trap Takeaway (3 Min.)** — Notiere den genauen `ORA-`-Fehler oder Edge Case für das `1Z0-171`-Examen.

---

## Wähle deine Lab-Umgebung

- **[Variante A: In-House Oracle Database](getting-started/variant-a-inhouse.md)** — Lokaler Docker/Podman-Container (`Oracle Database 23ai Free`) oder interne Pluggable Database (PDB) mit VS Code / SQL Developer & `sqlcl`/`sqlplus`.
- **[Variante B: Kostenlose Online-Cloud-Umgebung](getting-started/variant-b-online.md)** — Sofort startbares Browser-Setup ohne Installation mit **Oracle FreeSQL** (`freesql.com`), **OCI Always Free Autonomous Database** und **db<>fiddle**.

---

## Kursfahrplan (10 Phasen / 200 Lektionen)

| Phase | Lektionen | Schwerpunkt | Prüfungsgewicht | Checkpoint |
| :---: | :---: | :--- | :---: | :---: |
| **[Phase 1](phases/phase-01-foundations.md)** | `L001`–`L020` | Onboarding, Relational Concepts & Basic `SELECT` | ~10 % | **CP-0** (`L001–L002`) |
| **[Phase 2](phases/phase-02-filtering-sorting.md)** | `L021`–`L042` | Filtering (`WHERE`), Sorting & Substitution Variables | ~10 % | **CP-1** (`L041–L042`) |
| **[Phase 3](phases/phase-03-functions.md)** | `L043`–`L068` | Single-Row, Conversion & Conditional Functions | ~18 % | — |
| **[Phase 4](phases/phase-04-aggregation.md)** | `L069`–`L082` | Group Functions, `GROUP BY` & `HAVING` | ~7 % | **CP-2** (`L081–L082`) |
| **[Phase 5](phases/phase-05-joins.md)** | `L083`–`L102` | Multi-Table Joins, Self-Joins & Non-Equijoins | 10 % | — |
| **[Phase 6](phases/phase-06-subqueries-set.md)** | `L103`–`L122` | Subqueries & `SET` Operators | 10 % | **CP-3** (`L121–L122`) |
| **[Phase 7](phases/phase-07-dml-tcl.md)** | `L123`–`L138` | DML (`INSERT`/`UPDATE`/`DELETE`/`MERGE`) & Transactions | 5 % | — |
| **[Phase 8](phases/phase-08-ddl-objects.md)** | `L139`–`L162` | DDL, Constraints, Views, Sequences, Indexes & Synonyms | 20 % | **CP-4** (`L161–L162`) |
| **[Phase 9](phases/phase-09-dict-tz-dcl.md)** | `L163`–`L178` | Data Dictionary, Time Zones & User Access (DCL) | 10 % | — |
| **[Phase 10](phases/phase-10-exam-prep.md)** | `L179`–`L200` | „Human Compiler“-Drills, Mock Exams & Abschlussbereitschaft | 100 % | **CP-5** (`L199–L200`) |
