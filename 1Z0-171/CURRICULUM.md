# Curriculum: 200-Lektionen-Lernplan (Zero-to-Exam-Readiness) für Oracle AI Database SQL Associate (1Z0-171)

Dieses Curriculum richtet sich an **echte Einsteiger** (ohne Vorkenntnisse in SQL, Datenbanken oder Programmierung) und umfasst **200 Lektionen à 45 Minuten (insgesamt 150 Zeitstunden)**. Es kombiniert einen behutsamen Spiralansatz mit **wiederkehrenden identischen Checkpoints**, zwei Lab-Varianten (**In-House Oracle Database** vs. **kostenlose Online-Cloud**) sowie einem dualen Publishing-Modell (**Read the Docs** für statisches, ruhiges Lesen und **GitHub Pages** für interaktive Übungen und Self-Assessments).

---

## 1. Zielgruppe & Anatomie einer 45-Minuten-Lektion

### Konzipiert für echte Einsteiger
- **Keine Vorkenntnisse vorausgesetzt**: Startet beim Unterschied zwischen Spreadsheets und Tables, erklärt was ein Primary Key ist und wie man eine Syntax-Fehlermeldung liest, ohne in Panik zu verfallen.
- **Konkret vor abstrakt**: Jedes neue Konzept wird zuerst am kleinen, mit bloßem Auge überprüfbaren 14-Zeilen-Schema **`SCOTT/TIGER`** (`EMP`, `DEPT`, `SALGRADE`, `BONUS`) eingeführt, bevor es auf die größeren Schemas `HR`, `CO` und `SH` skaliert wird.
- **Hohe Wiederholung & Retrieval Practice**: Zentrale Query-Muster kehren in jeder Phase wieder und steigern sich schrittweise vom geführten Abtippen → Lückentext → eigenständigem Schreiben → Lesen von SQL ohne IDE („Human Compiler“-Prüfungskompetenz).

### Standardaufbau einer 45-Minuten-Lektion
| Abschnitt | Dauer | Aktivität | Plattform |
| :--- | :---: | :--- | :--- |
| **1. Warm-Up Recall** | 5 Min. | 3 kurze Flashcards oder 1 Syntax-Spotter aus der vorherigen Lektion | **GitHub Pages** |
| **2. Micro-Concept** | 10 Min. | Ein fokussiertes Konzept mit Diagramm und alltagsnaher Analogie | **Read the Docs** |
| **3. Guided Live Coding** | 15 Min. | Trainer/Lernende führen 2–3 Beispiele Seite an Seite aus (`SCOTT` / `HR`) | **Oracle DB (Variante A / B)** |
| **4. Independent Practice** | 12 Min. | 2–4 abgestufte Mikro-Aufgaben (Ergebnis zuerst vorhersagen, dann ausführen) | **GitHub Pages + Oracle DB** |
| **5. Takeaway & Pitfall** | 3 Min. | 1 „Exam Trap“ im persönlichen Cheat Sheet festhalten | **Read the Docs / Notizen** |

> **Hybrider Firmenunterricht (3 vor Ort + 3 via Teams):** Nutze das angepasste Hybrid-Schema (Teams-Umfrage, Predict-Pausen im Chat, 3 gemischte Breakout-Paare, „Remote first“) und die 10 Sitzungspläne im [Trainer- & Hybrid-Bereich](docs/trainer/index.md).

---

## 2. Publishing-Architektur: Read the Docs vs. GitHub Pages

Das Schulungs-Repository publiziert automatisch auf zwei ergänzende Plattformen aus demselben Quellbaum:

| Plattform | Rolle | Veröffentlichte Inhalte | Technologie |
| :--- | :--- | :--- | :--- |
| **Read the Docs** | **Statisches, lesbares Material** | Lehrbuchkapitel für alle 200 Lektionen, druckbare Study Guides, SQL-Syntax-Cheat-Sheets, ERDs (`SCOTT` & `HR`), `ORA-`-Fehlerlexikon, FreeSQL Lab Packs und Exam-Trap-Zusammenfassungen. | MkDocs Material |
| **GitHub Pages** | **Interaktive Praxis & Tracking** | Interaktive „Human Compiler“-Syntax-Drills, Join-/SET-Visualizer, 1-based `SUBSTR`/`INSTR`-Slicer, `sqlplus`-Simulator, Flashcards, zeitgesteuerter 1Z0-171 Mock Exam Simulator, **Identical Checkpoint Runner** mit `localStorage`-Verlaufsdiagramm & JSON/Markdown-Export sowie direkter **Oracle FreeSQL Launcher**. | Statisches HTML/CSS/JS (Deploy via GitHub Actions) |

### Repository-Struktur
```text
1Z0-171/
├── README.md                  # Exam Overview, Gewichtung & Badges
├── CURRICULUM.md              # Dieser 200-Lektionen-Masterplan
├── docs/                      # -> Read the Docs (statisches Lehrbuch)
│   ├── phases/                # phase-01-foundations.md .. phase-10-exam-prep.md
│   ├── labs/                  # Per-Phase .sql Skripte & FreeSQL Embedded Sandboxes
│   ├── schemas/               # SCOTT/TIGER & HR ERDs, Setup-Skripte
│   └── cheatsheets/           # Druckbare Syntax- & ORA-Fehler-Guides
└── interactive/               # -> GitHub Pages (interaktives Studio)
    ├── index.html             # 200-Lektionen-Tracker, Checkpoints, Labs, Flashcards, Mock Exam
    ├── js/                    # Datenmodule + FreeSQL-Gzip-Launcher
    └── styles.css
```

---

## 3. Lab-Umgebungsvarianten (Beide enthalten `SCOTT/TIGER`)

### Vergleich auf einen Blick

| Dimension | Variante A: In-House Oracle Database | Variante B: Kostenlose Online-Umgebung |
| :--- | :--- | :--- |
| **Primäre Plattform** | On-Premises / Container **Oracle Database 23ai Free** (`container-registry.oracle.com/database/free:latest`) oder interne Corporate PDB | **Oracle FreeSQL** ([freesql.com](https://freesql.com/) / [livesql.oracle.com](https://livesql.oracle.com/)) + **OCI Always Free Autonomous Database (23ai)** |
| **Client-Tooling** | VS Code (Oracle SQL Developer Extension), Oracle SQL Developer und `sqlplus` / `sqlcl` CLI | Browser Worksheet (FreeSQL / Database Actions Web) oder optional externe SQL*Net-Verbindung |
| **Setup-Zeit** | 15–30 Minuten (Docker/Podman oder IT-bereitgestellte PDB) | 0 Minuten (FreeSQL läuft sofort im Browser; OCI Always Free dauert ca. 5 Minuten) |
| **Sample Schemas** | Klassisches **`SCOTT/TIGER`** (`EMP`, `DEPT`, `SALGRADE`, `BONUS`) + offizielle `db-sample-schemas-23ai` (`HR`, `CO`, `SH`) | Vorinstallierte Read-Only-Schemas (`SCOTT`, `HR`, `SH`, `CO`) in FreeSQL + eigenes schreibbares Schema (mit `scott_tiger.sql` für DML/DDL-Labs) |
| **Abdeckung der 1Z0-171-Themen** | **100 %** (Multi-User DCL, `&`/`&&`, `DEFINE`/`VERIFY`, External Tables, Two-Session Locking) | **~90 % allein mit FreeSQL**; **100 %** in Kombination mit OCI Always Free + GitHub Pages `sqlplus`-Simulator |

### Variante A: In-House Oracle Database Setup
1. **Database Engine**:
   - **Schulungsserver**: Bereitstellung einer Pluggable Database (`PDB_TRAINING`) auf einem internen Oracle Database 23ai (oder 19c+) Server mit einem Schema pro Teilnehmendem (`STUDENT_01` .. `STUDENT_N`) plus Peer-Account (`STUDENT_01_PEER`) für `GRANT`/`REVOKE`-Übungen.
   - **Lokaler Container**:
     ```bash
     docker run -d --name oracle23ai -p 1521:1521 -e ORACLE_PWD=Welcome123! \
       container-registry.oracle.com/database/free:latest
     ```
2. **Client-Tools**:
   - **GUI**: VS Code mit der **Oracle SQL Developer Extension** (oder klassischem Oracle SQL Developer).
   - **CLI**: **`sqlcl` oder `sqlplus`** für Substitution Variables (`&`, `&&`, `DEFINE`, `VERIFY`) und Transaktionsskripte.
3. **Sample Schemas**:
   - **Klassisches `SCOTT/TIGER`**: Installation von `EMP`, `DEPT`, `SALGRADE` und `BONUS` (historisch via `$ORACLE_HOME/rdbms/admin/utlsampl.sql` mit `scott`/`tiger`). Ideal für Einsteiger, weil alle 14 Employees und 4 Departments auf einen Bildschirm passen.
   - **Moderne Schemas**: Offizielle [Oracle Database Sample Schemas (`HR`, `CO`, `SH`)](https://github.com/oracle-samples/db-sample-schemas).

### Variante B: Kostenlose Online-Umgebung (Zero Installation)
1. **Primäre Tages-Sandbox — Oracle FreeSQL (Live SQL v2)**:
   - **URL**: [https://freesql.com/](https://freesql.com/) (oder [https://livesql.oracle.com/](https://livesql.oracle.com/))
   - Läuft auf **Oracle Database 23ai**, 100 % kostenlos im Browser, enthält vorinstallierte `SCOTT`-, `HR`-, `SH`- und `CO`-Schemas sowie ein persönliches schreibbares Schema und optionalen SQL*Net-Zugang.
2. **Ergänzendes Cloud-Lab — OCI Always Free Autonomous Database (23ai)**:
   - **URL**: [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)
   - Bietet 2 dauerhaft kostenlose Oracle 23ai Autonomous Databases mit **Database Actions (SQL Developer Web)** im Browser. Genutzt in Phase 7 & Phase 9 für Multi-Session Locking und Multi-User `GRANT`/`REVOKE`/`ROLE`.
3. **Schneller Scratchpad — db<>fiddle**:
   - **URL**: [https://dbfiddle.uk/?rdbms=oracle_23](https://dbfiddle.uk/?rdbms=oracle_23) — Oracle-23ai-Scratchpad ohne Login für teilbare Debugging-Links.

> [!IMPORTANT]
> **Variante-B-Brücke über GitHub Pages**: Browser-Worksheets behandeln `sqlplus`-Substitution-Variables (`&`, `&&`, `DEFINE`, `VERIFY`) und `EXTERNAL TABLES` anders als die CLI. In Phase 2 und Phase 8 nutzen Variante-B-Lernende daher den interaktiven `sqlplus`-Simulator auf **GitHub Pages** sowie kommentierte Spool-Transkripte auf **Read the Docs**.

---

## 4. Wiederkehrende identische Checkpoints (Längsschnitt-Assessment & Reflexion)

Damit der eigene Lernfortschritt für Einsteiger glasklar sichtbar wird, absolvieren die Lernenden **sechsmal exakt denselben standardisierten Benchmark („The 1Z0-171 Benchmark“)** über die 200 Lektionen hinweg:

- **CP-0 (Baseline)**: `L001–L002` — Startpunkt ohne Vorkenntnisse (kein Druck; Raten ist ausdrücklich erwartet)
- **CP-1**: `L041–L042` — Nach Foundations, `SELECT`, Filtering, Sorting & Variables
- **CP-2**: `L081–L082` — Nach Functions & Aggregations
- **CP-3**: `L121–L122` — Nach Joins, Subqueries & `SET` Operators
- **CP-4**: `L161–L162` — Nach DML, Transactions, DDL, Constraints, Views & Indexes
- **CP-5 (Final)**: `L199–L200` — Abschluss-Check & Exam Readiness Sign-Off

### Aufbau jedes 2-Lektionen-Checkpoints (90 Minuten)
1. **Lektion 1 (45 Min.) — Das identische Assessment (auf GitHub Pages)**:
   - **Part A — 22 Exam-Style Questions (25 Min.)**: 2 identische Fragen pro Exam Domain (fester Fragenpool; Musterlösungen bleiben bis `CP-5` gesperrt – nach `CP-0` bis `CP-4` werden nur Domain-Prozentwerte angezeigt, um Auswendiglernen zu verhindern).
   - **Part B — 3 „Gold Standard“ SQL Tasks (15 Min.)**:
     1. *Query Task (`SCOTT`)*: Join über `EMP`, `DEPT` und `SALGRADE` mit `NULL`-sicherer Compensation-Berechnung und `GROUP BY`/`HAVING`.
     2. *Subquery / Set Task (`HR`)*: Departments ohne Employees oder Employees über dem jeweiligen Department-Durchschnitt finden.
     3. *Schema Task*: `CREATE TABLE`-Statement mit `PRIMARY KEY`, `FOREIGN KEY (ON DELETE SET NULL)` und `CHECK` Constraint schreiben.
   - **Part C — Confidence Rating (5 Min.)**: Selbsteinschätzung der Sicherheit (1–5) je Domain *vor* Anzeige der Punktzahl.
2. **Lektion 2 (45 Min.) — Strukturierte Reflexion & Delta-Review**:
   - Das **GitHub Pages Checkpoint Dashboard** legt den aktuellen Versuch über alle bisherigen Versuche (`CP-0` → `CP-N`).
   - Lernende füllen ein 4-Fragen-Reflexionslog aus (lokal gespeichert / exportierbar als Markdown oder JSON):
     1. *Welche 2 Domains haben sich seit dem letzten Checkpoint am stärksten verbessert, und was hat „Klick“ gemacht?*
     2. *Wo war meine Confidence hoch, mein Score aber niedrig (Blind Spots / Exam Traps)?*
     3. *Welche Part-B-Aufgabe ließ sich spürbar schneller oder freier aus dem Gedächtnis schreiben?*
     4. *Was ist mein konkretes Fokus-Ziel bis zum nächsten Checkpoint?*

### Erwartete Lernkurve für Einsteiger
| Checkpoint | Lektion | Erwarteter Gesamtscore | Erwartete Confidence | Pädagogische Bedeutung |
| :---: | :---: | :---: | :---: | :--- |
| **CP-0** | `L001–L002` | 10–25 % | Sehr niedrig (1/5) | Ehrliche Baseline; entmystifiziert das spätere Prüfungsformat. |
| **CP-1** | `L041–L042` | 30–40 % | Niedrig–Mittel (2/5) | Domains 1–2 sitzen; Lernende können SQL-Fragen auch zu neuen Themen bereits *lesen*. |
| **CP-2** | `L081–L082` | 50–60 % | Mittel (3/5) | Domain 3 (25 % Gewicht) sorgt für einen großen Punktesprung – starker Motivationsschub. |
| **CP-3** | `L121–L122` | 65–72 % | Mittel–Hoch (3,5/5) | Erstmaliges Überschreiten der 65-%-Bestehensgrenze! |
| **CP-4** | `L161–L162` | 75–85 % | Hoch (4/5) | Volle Query- + DDL/DML-Sicherheit; es fehlen nur noch Data Dictionary/Time Zones/DCL. |
| **CP-5** | `L199–L200` | **≥ 85 %** | Exam-Ready (4,5–5/5) | Vollständige Beherrschung; kompletter Answer Key für das Abschluss-Debriefing freigeschaltet. |

---

## 5. Gesamtübersicht über 200 Lektionen & Zeitmodelle

### Zeitmodell-Optionen
- **Vollzeit-Bootcamp (5 Wochen)**: 8 Lektionen/Tag (6 Zeitstunden/Tag), 5 Tage/Woche → 40 Lektionen/Woche.
- **Berufsbegleitender Abend-/Wochenendkurs (20 Wochen)**: 10 Lektionen/Woche (z. B. 2 Abende × 3 Lektionen + Samstag × 4 Lektionen).
- **Schul-/Studienjahr im eigenen Tempo (ca. 34 Wochen)**: 6 Lektionen/Woche.

### Phasenübersicht (Exakt 200 Lektionen = 150 Stunden)
| Phase | Titel | Lektionen | Anzahl | Exam Domains | Gewicht | Checkpoint |
| :---: | :--- | :---: | :---: | :--- | :---: | :---: |
| **1** | Onboarding, Baseline & Relational Foundations | `L001`–`L020` | 20 | Domain 1, Domain 2 (Teil 1) | ~10 % | **CP-0** (`L001–L002`) |
| **2** | Filtering, Sorting & Substitution Variables | `L021`–`L042` | 22 | Domain 2 (Teil 2) | ~10 % | **CP-1** (`L041–L042`) |
| **3** | Single-Row, Conversion & Conditional Functions | `L043`–`L068` | 26 | Domain 3 (Teil 1) | ~18 % | — |
| **4** | Grouping & Aggregating Data | `L069`–`L082` | 14 | Domain 3 (Teil 2) | ~7 % | **CP-2** (`L081–L082`) |
| **5** | Displaying Data from Multiple Tables (Joins) | `L083`–`L102` | 20 | Domain 4 | 10 % | — |
| **6** | Subqueries & Compound Queries (`SET` Operators) | `L103`–`L122` | 20 | Domain 5, Domain 6 | 10 % | **CP-3** (`L121–L122`) |
| **7** | Data Manipulation (DML) & Transactions (TCL) | `L123`–`L138` | 16 | Domain 7 | 5 % | — |
| **8** | DDL, Constraints, Views, Sequences, Indexes & Synonyms | `L139`–`L162` | 24 | Domain 8, Domain 9 | 20 % | **CP-4** (`L161–L162`) |
| **9** | Data Dictionary, Time Zones & Controlling User Access | `L163`–`L178` | 16 | Domain 10, Domain 11 | 10 % | — |
| **10** | Prüfungstraining, Mock Exams & Final Readiness | `L179`–`L200` | 22 | Alle 11 Domains | 100 % | **CP-5** (`L199–L200`) |
| | **GESAMT** | **`L001`–`L200`** | **200** | **Alle 11 Domains** | **100 %** | **6 Identical CPs** |

---

## 6. Detaillierter Phasenplan (`L001`–`L200`)

### Phase 1: Onboarding, Baseline & Relational Foundations (`L001`–`L020` | 20 Lektionen)
* **Einsteiger-Ziel**: Datenbanken entmystifizieren, alle sicher erste Queries ausführen lassen und die Angst vor Syntaxfehlern nehmen.
* **Lektionsaufbau**:
  - `L001–L002`: **Kursauftakt & Identical Checkpoint #0 (Baseline)** — 200-Lektionen-Roadmap vorstellen, `CP-0` auf GitHub Pages durchführen und normales Nicht-Wissen entlasten.
  - `L003–L005`: **Vom Spreadsheet zur Relational Table** — Warum Excel an Grenzen stößt; Tables, Rows (Tupel), Columns (Attribute), Primary Keys und Foreign Keys anhand von `SCOTT.DEPT` (4 Rows) und `SCOTT.EMP` (14 Rows).
  - `L006–L008`: **ERDs lesen & SQL Statement Families** — Crow's-Foot-Notation (`1:1`, `1:M`, `M:N`), ERD-Entitäten auf `SELECT`-Klauseln abbilden, DML/DDL/DCL/TCL unterscheiden.
  - `L009–L012`: **Lab-Setup & erste Queries** —
    - *Variante A*: Verbindung über VS Code / SQL Developer & `sqlcl` zu lokalem/In-House Oracle 23ai (`scott/tiger` und `HR`).
    - *Variante B*: Kostenlosen Account auf [freesql.com](https://freesql.com/) anlegen, vorinstallierte `SCOTT`- und `HR`-Schemas erkunden.
    - `SELECT * FROM scott.dept;` und `DESCRIBE scott.emp;` ausführen, `ORA-`-Fehlermeldungen ruhig lesen lernen.
  - `L013–L016`: **Projections, Arithmetik & `NULL`-Grundlagen** — Gezielte Spaltenauswahl, Operator Precedence (`*`, `/`, `+`, `-`, Klammern) und warum `sal + comm` zu `NULL` wird, wenn `comm` leer ist.
  - `L017–L020`: **Aliases, Concatenation, Literals, `DISTINCT` & `DUAL`** — `AS` vs. `"Double Quotes"` vs. `'Single Quotes'`, String Concatenation (`||`), Alternative Quote Operator (`q'[...]'`), `DISTINCT` über mehrere Spalten und `DUAL` (inkl. optionalem `FROM` in 23ai).
* **Publishing-Aufteilung**:
  - *Read the Docs*: Illustrierter „Spreadsheet-to-SQL“-Leitfaden, druckbare `SCOTT`- & `HR`-ERDs sowie Einsteiger-Hilfe zu `ORA-00904`/`ORA-00942`.
  - *GitHub Pages*: Interaktiver `CP-0`-Runner, Flashcards und direkter FreeSQL Launcher.

---

### Phase 2: Filtering, Sorting & Substitution Variables (`L021`–`L042` | 22 Lektionen)
* **Einsteiger-Ziel**: Präzise Fragen an Daten stellen sowie Sortierung und Zeilenanzahl gezielt steuern.
* **Lektionsaufbau**:
  - `L021–L024`: **Die `WHERE`-Klausel & Vergleiche** — `=`, `<>`, `!=`, `<`, `>`, `<=`, `>=`; Case-Sensitivity von String-Werten vs. Case-Insensitivity von SQL-Keywords; Date Literals (`DATE '1981-02-20'`).
  - `L025–L028`: **Range-, List-, Pattern- & Null-Filter** — `BETWEEN ... AND ...` (inklusive Grenzen), `IN (...)`, `LIKE` (`%`, `_` und `ESCAPE '\'`) sowie warum `WHERE comm = NULL` stillschweigend 0 Rows liefert (`IS NULL` / `IS NOT NULL`).
  - `L029–L033`: **Boolesche Logik & Precedence-Drills** — `AND`, `OR`, `NOT`; Truth Tables mit `NULL` (3-Valued Logic); Operator Precedence (`NOT` → `AND` → `OR`) und schützende Klammern.
  - `L034–L037`: **Sorting & Row Limiting** — `ORDER BY` (Column Name, Alias, Position), `ASC`/`DESC`, `NULLS FIRST`/`NULLS LAST`, logische Ausführungsreihenfolge (`FROM` → `WHERE` → `SELECT` → `ORDER BY`) und ANSI Row Limiting (`OFFSET n ROWS FETCH FIRST/NEXT m ROWS ONLY` vs. `WITH TIES` und `PERCENT`).
  - `L038–L040`: **SQL\*Plus Substitution Variables** — Einfaches `&` vs. doppeltes `&&`, Quoting von Character-Eingaben (`'&job'`), `DEFINE`, `UNDEFINE` und `SET VERIFY ON/OFF`.
    - *Variante A*: Live-Skripte in `sqlcl`/`sqlplus`.
    - *Variante B*: Interaktiver `sqlplus`-Simulator auf GitHub Pages + kommentierte Spool-Transkripte auf Read the Docs.
  - `L041–L042`: **Identical Checkpoint #1 (Assessment + Reflexion)** — Vergleich `CP-1` vs. `CP-0` auf GitHub Pages.

---

### Phase 3: Single-Row, Conversion & Conditional Functions (`L043`–`L068` | 26 Lektionen)
> [!TIP]
> **Prüfungsschwerpunkt**: Domain 3 (*Using Functions*) macht **25 % des 1Z0-171-Examens** aus. Echte Einsteiger brauchen ruhiges, visuelles Training für 1-basierte String-Indizes in Oracle und verschachtelte Funktionsaufrufe.

* **Lektionsaufbau**:
  - `L043–L046`: **Case & grundlegende Character Functions** — `LOWER`, `UPPER`, `INITCAP`, `CONCAT`, `LENGTH`, `TRIM` (`LEADING`/`TRAILING`/`BOTH`), `REPLACE`.
  - `L047–L050`: **String Slicing & Searching** — `SUBSTR` (positive & negative Startpositionen), `INSTR` (n-tes Vorkommen), `LPAD`/`RPAD` und Verschachtelung `SUBSTR(email, 1, INSTR(email, '@') - 1)`.
  - `L051–L054`: **Numeric Functions** — `ROUND(n, d)` und `TRUNC(n, d)` (inkl. negativer `d` wie `-1`, `-2`), `MOD`, `CEIL`, `FLOOR`.
  - `L055–L060`: **Arbeiten mit Dates** — Interne Datumsspeicherung, `SYSDATE`, `Date + Number`, `Date - Date`, `MONTHS_BETWEEN`, `ADD_MONTHS`, `NEXT_DAY`, `LAST_DAY`, `ROUND(date, 'MONTH'/'YEAR')`, `TRUNC(date, 'MONTH'/'YEAR')`.
  - `L061–L064`: **Implicit vs. Explicit Conversion** — `TO_CHAR` (Date & Number Format Models: `YYYY`, `MM`, `MON`, `DAY`, `HH24:MI:SS`, `999,999.00`, `L`, `fm`, `fx`), `TO_DATE` (`RR`- vs. `YY`-Jahrhundertregeln), `TO_NUMBER`.
  - `L065–L068`: **Null-Handling & Conditional Expressions** — `NVL`, `NVL2`, `NULLIF`, `COALESCE` (Short-Circuiting & Datentyp-Fallen wie `NVL(comm, 'None')`), Simple & Searched `CASE` sowie `DECODE` (inkl. `DECODE`-Treffer bei `NULL = NULL`).
* **Publishing-Aufteilung**:
  - *Read the Docs*: Visueller Leitfaden „Funktionsverschachtelung von innen nach außen“ und vollständige `TO_CHAR`-Format-Model-Referenz.
  - *GitHub Pages*: Interaktiver 1-based `SUBSTR`/`INSTR`-Slicer und Flashcards.

---

### Phase 4: Grouping & Aggregating Data (`L069`–`L082` | 14 Lektionen)
* **Lektionsaufbau**:
  - `L069–L073`: **Aggregate Functions & `NULL`-Fallen** — `COUNT(*)`, `COUNT(col)`, `COUNT(DISTINCT col)`, `SUM`, `AVG`, `MIN`, `MAX`; Beweis an `SCOTT.EMP.COMM`, warum `AVG(comm)` stark von `AVG(NVL(comm, 0))` abweicht.
  - `L074–L078`: **`GROUP BY`, `HAVING` & verschachtelte Aggregate** — Gruppierung nach einer oder mehreren Spalten, Beheben von `ORA-00979`, `WHERE` (Vor-Filter) vs. `HAVING` (Gruppen-Filter) und 2-stufiges Nesting (`SELECT MAX(AVG(sal)) FROM scott.emp GROUP BY deptno`).
  - `L079–L080`: **Konsolidierungs-Lab & „Human Compiler“ Drill #1** — 15 Code-Reading-Aufgaben zu Phase 1–4 ohne IDE.
  - `L081–L082`: **Identical Checkpoint #2 (Assessment + Reflexion)** — Vergleich `CP-2` vs. `CP-0`/`CP-1` auf GitHub Pages.

---

### Phase 5: Displaying Data from Multiple Tables — Joins (`L083`–`L102` | 20 Lektionen)
* **Lektionsaufbau**:
  - `L083–L085`: **Mentales Modell von Joins & `CROSS JOIN`** — Zeilenweises Matching visualisieren; warum fehlende Join-Bedingungen ein Cartesian Product (`14 × 4 = 56` Rows bei `SCOTT.EMP × SCOTT.DEPT`) erzeugen.
  - `L086–L088`: **`INNER JOIN ... ON` & Table Aliases** — Join von `SCOTT.EMP` und `SCOTT.DEPT`, Auflösen mehrdeutiger Spalten (`ORA-00918`) und 3+-Tabellen-Joins (`HR.EMPLOYEES` → `DEPARTMENTS` → `LOCATIONS` → `COUNTRIES`).
  - `L089–L092`: **`NATURAL JOIN` & `JOIN ... USING`** — Versteckte Mehrfach-Matches bei `NATURAL JOIN` (`HR.EMPLOYEES` + `HR.DEPARTMENTS` verknüpft sowohl `department_id` als auch `manager_id`), und die `ORA-25154`-Regel (eine `USING`-Spalte niemals qualifizieren!).
  - `L093–L096`: **Outer Joins (`LEFT`, `RIGHT`, `FULL`)** — Nicht zugeordnete Zeilen erkennen über `SCOTT.DEPT` #40 (`OPERATIONS`, 0 Employees) und `HR.EMPLOYEES` mit `NULL` in `department_id`; `ON`-Filter vs. `WHERE`-Filter-Falle bei Outer Joins.
  - `L097–L100`: **Self-Joins & Non-Equijoins** — Employee-to-Manager-Hierarchien (`SCOTT.EMP e LEFT JOIN SCOTT.EMP m ON e.mgr = m.empno`, sodass `KING` erhalten bleibt) und Salary Bands (`SCOTT.EMP e JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal`).
  - `L101–L102`: **Multi-Table Reporting Lab** — Kombinierte Joins + Functions + `GROUP BY` auf `SCOTT` und `HR`.
* **Publishing-Aufteilung**:
  - *GitHub Pages*: Interaktiver Join & SET Visualizer auf `SCOTT.EMP` & `SCOTT.DEPT` mit direktem Start in Oracle FreeSQL.

---

### Phase 6: Subqueries & Compound Queries (`L103`–`L122` | 20 Lektionen)
* **Lektionsaufbau**:
  - `L103–L107`: **Single-Row Subqueries** — „Wer verdient mehr als JONES?“ (`SCOTT.EMP`), Subqueries in `WHERE`, `HAVING` und Scalar Subqueries in `SELECT`; Umgang mit `ORA-01427` und leeren Subqueries (`NULL`).
  - `L108–L112`: **Multi-Row Subqueries (`IN`, `ANY`, `ALL`) & die `NOT IN` + `NULL`-Falle** — Demonstration an `SCOTT.EMP.MGR`, warum `WHERE empno NOT IN (SELECT mgr FROM scott.emp)` **0 Rows** liefert (`KING` hat `MGR = NULL`), und Lösung mit `IS NOT NULL` oder `NOT EXISTS`.
  - `L113–L116`: **Inline Views, Multi-Column & Correlated Subqueries** — Subqueries im `FROM`, Pairwise vs. Non-Pairwise Multi-Column Comparisons, Correlated Subqueries und `EXISTS` / `NOT EXISTS`.
  - `L117–L120`: **`SET` Operators** — `UNION`, `UNION ALL`, `INTERSECT`, `MINUS` (und 23ai `EXCEPT`), Regeln zu Spaltenanzahl & Datentypen, Dummy Columns (`TO_CHAR(NULL)`) und `ORDER BY` ausschließlich am Ende.
  - `L121–L122`: **Identical Checkpoint #3 (Assessment + Reflexion)** — Vergleich `CP-3` vs. `CP-0..2`; Ziel: erstmaliges Überschreiten der 65-%-Bestehensgrenze.

---

### Phase 7: Data Manipulation (DML) & Transactions (TCL) (`L123`–`L138` | 16 Lektionen)
* **Einsteiger-Ziel**: Daten sicher verändern und verstehen, wie Oracle parallele Zugriffe durch Transactions schützt.
* **Lektionsaufbau**:
  - `L123–L126`: **`INSERT`, `UPDATE`, `DELETE` Grundlagen** — Eigene schreibbare Kopien von `SCOTT.EMP` und `SCOTT.DEPT` anlegen (`my_emp`, `my_dept`), Zeilen mit expliziten/impliziten `NULL`s und `DEFAULT` einfügen, Updates & Deletes mit `WHERE`-Sicherheitsprüfung.
  - `L127–L128`: **Subquery-basiertes & Correlated DML** — `INSERT INTO ... SELECT`, Correlated `UPDATE` und Correlated `DELETE`.
  - `L129–L132`: **Multi-Table `INSERT` & `MERGE`** — Unconditional `INSERT ALL`, Conditional `INSERT ALL` vs. `INSERT FIRST` sowie `MERGE INTO ... WHEN MATCHED THEN UPDATE ... DELETE WHERE ... WHEN NOT MATCHED THEN INSERT`.
  - `L133–L138`: **Transaction Control, Implicit Commits & Locking** — `COMMIT`, `ROLLBACK`, `SAVEPOINT`, `ROLLBACK TO SAVEPOINT`; warum jedes DDL/DCL ein implizites `COMMIT` auslöst; Read Consistency und Row Locking (`FOR UPDATE`).
    - *Variante A*: Live-Two-Session-Locking-Experiment (`sqlcl` + VS Code).
    - *Variante B*: `SAVEPOINT`/`MERGE` in FreeSQL + Two-Tab Read Consistency Lab in OCI Always Free Autonomous Database.

---

### Phase 8: DDL, Constraints, Views, Sequences, Indexes & Synonyms (`L139`–`L162` | 24 Lektionen)
* **Einsteiger-Ziel**: Saubere relationale Schemas von Grund auf entwerfen und jedes prüfungsrelevante Database Object verstehen.
* **Lektionsaufbau**:
  - `L139–L144`: **Data Types, `CREATE TABLE`, `CTAS` & `ALTER TABLE`** — Naming Rules, `VARCHAR2`, `CHAR`, `NUMBER(p,s)`, `DATE`, `CLOB`, `BLOB`, natives `BOOLEAN` (23ai); `CREATE TABLE ... AS SELECT` (kopiert nur explizites `NOT NULL`!); `ALTER TABLE` (`ADD`, `MODIFY`, `DROP COLUMN`, `SET UNUSED`, `DROP UNUSED COLUMNS`); `TRUNCATE TABLE` vs. `DELETE` vs. `DROP TABLE ... PURGE`.
  - `L145–L150`: **Constraints im Detail** — Inline- vs. Out-of-Line-Syntax für `NOT NULL`, `UNIQUE` (erlaubt mehrere `NULL`s!), `PRIMARY KEY`, `FOREIGN KEY` (`ON DELETE CASCADE` vs. `ON DELETE SET NULL`) und `CHECK`; `ENABLE`/`DISABLE`, `DEFERRABLE` und `DROP TABLE ... CASCADE CONSTRAINTS`.
  - `L151–L153`: **Global Temporary Tables & External Tables** — `ON COMMIT DELETE ROWS` vs. `ON COMMIT PRESERVE ROWS`; Lesen externer Dateien über `ORGANIZATION EXTERNAL` (`ORACLE_LOADER`, `ORACLE_DATAPUMP` — live in Variante A, Syntax-Walkthrough + Drill in Variante B).
  - `L154–L157`: **Views** — `CREATE OR REPLACE [FORCE] VIEW`, Simple vs. Complex Views (wann DML erlaubt/blockiert ist), `WITH CHECK OPTION` und `WITH READ ONLY`.
  - `L158–L160`: **Sequences, Indexes & Synonyms** — `CREATE SEQUENCE` (`NEXTVAL`, `CURRVAL` `ORA-08002`-Regel, `CACHE`, `CYCLE`, `GENERATED ... AS IDENTITY`), B-tree/Unique/Composite/Function-Based/Invisible Indexes sowie private vs. `PUBLIC` Synonyms.
  - `L161–L162`: **Identical Checkpoint #4 (Assessment + Reflexion)** — Vergleich `CP-4` vs. `CP-0..3`.

---

### Phase 9: Data Dictionary, Time Zones & Controlling User Access (`L163`–`L178` | 16 Lektionen)
* **Lektionsaufbau**:
  - `L163–L166`: **Oracle Data Dictionary** — Navigation in `DICTIONARY` (`DICT`), `USER_*` vs. `ALL_*` vs. `DBA_*`; Auswerten von `USER_TABLES`, `USER_TAB_COLUMNS`, `USER_CONSTRAINTS`, `USER_CONS_COLUMNS`, `USER_VIEWS`, `USER_SEQUENCES`, `USER_IND_COLUMNS`; Metadaten per `COMMENT ON`.
  - `L167–L172`: **Time Zones & Interval Data Types** — `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE`, `TIMESTAMP WITH LOCAL TIME ZONE`; `INTERVAL YEAR TO MONTH` und `INTERVAL DAY TO SECOND`; `CURRENT_DATE`, `CURRENT_TIMESTAMP`, `LOCALTIMESTAMP`, `DBTIMEZONE`, `SESSIONTIMEZONE`, `EXTRACT`, `TZ_OFFSET`, `FROM_TZ`, `TO_TIMESTAMP`, `TO_YMINTERVAL`, `TO_DSINTERVAL`.
  - `L173–L178`: **Controlling User Access (DCL)** — System Privileges vs. Object Privileges, `CREATE USER`, `ALTER USER`, `CREATE ROLE`, `GRANT`, `REVOKE` und die entscheidende Kaskaden-Regel:
    - Object Privilege + `WITH GRANT OPTION` → `REVOKE` **kaskadiert**.
    - System Privilege + `WITH ADMIN OPTION` → `REVOKE` **kaskadiert NICHT**.
    - *Variante A*: Live-3-User-Kaskadentest in der In-House-PDB.
    - *Variante B*: Live-3-User-Kaskadentest in OCI Always Free Autonomous Database.

---

### Phase 10: Prüfungstraining, Mock Exams & Final Readiness (`L179`–`L200` | 22 Lektionen)
* **Einsteiger-Ziel**: Vom sicheren SQL-Anwender zum ruhigen, schnellen und prüfungsbereiten Kandidaten werden.
* **Lektionsaufbau**:
  - `L179–L184`: **„Human Compiler“ Intensivtraining (Code-Reading ohne IDE)** — 6 fokussierte Clinics (je eine pro Risikocluster: `NULL`-Fallen, Function-Nesting/Conversion, Join- & `USING`-Fallen, Subquery/`SET`-Regeln, DDL/Constraint/View-Regeln, DCL/Time Zones) im GitHub-Pages-Drill.
  - `L185–L189`: **Vollständiges Mock Exam #1 & Tiefenanalyse** —
    - `L185–L187`: 60 Fragen in 120 Minuten im **GitHub Pages Mock Exam Simulator** (mit 3-Pass-Zeitstrategie: Pass 1 direkte Fragen, Pass 2 komplexes Tracing, Pass 3 Multi-Select-Prüfung).
    - `L188–L189`: Punktgenaues Review falsch beantworteter Fragen mit Rücksprung in die Read-the-Docs-Kapitel.
  - `L190–L193`: **Gezielte Remediation Labs** — Individuelle Praxis-Labs in der Oracle DB (Variante A oder B) für die schwächsten Domains aus Mock Exam #1.
  - `L194–L198`: **Mock Exam #2 & Exam-Day Readiness** —
    - `L194–L196`: Zweiter Durchlauf unter Prüfungsbedingungen (Ziel: **≥ 75 % / 45 richtige Antworten**).
    - `L197–L198`: Debrief + Oracle-MyLearn-Buchung, Technik-/Raumcheck für Online-Proctoring und Prüfungsstrategie.
  - `L199–L200`: **Identical Checkpoint #5 (Final Readiness + 200-Lektionen-Retrospektive)** —
    - `L199`: Finale Durchführung des identischen Benchmarks (`CP-5`), ab sofort mit vollständig freigeschaltetem Answer Key und Lösungen.
    - `L200`: Auswertung der gesamten Wachstumskurve `CP-0 → CP-5` auf GitHub Pages, Reflexion des Weges von null Vorkenntnissen zur Prüfungsreife und Festlegung des persönlichen Prüfungstermins.
