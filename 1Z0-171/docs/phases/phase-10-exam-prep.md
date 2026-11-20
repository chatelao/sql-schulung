# Phase 10: Exam Mastery, Mock Exams & Final Readiness (`L179`–`L200`)

**Fokus**: Praktisches SQL-Wissen ohne IDE in schnelle, präzise Prüfungsleistung umsetzen.  
**Interactive Studio**: [Phase 10 Tracker](https://chatelao.github.io/sql-schulung/#curriculum/phase-10) · [Human Compiler](https://chatelao.github.io/sql-schulung/#labs/compiler) · [Mock Exams](https://chatelao.github.io/sql-schulung/#mock) · [Checkpoint `CP-5`](https://chatelao.github.io/sql-schulung/#checkpoints/CP-5)

---

## „Human Compiler“ Clinics (`L179`–`L184`)

Absolviere alle 6 Clinics im **Human Compiler**-Modus auf GitHub Pages (**ohne vorherige Live-Datenbank**!):

- **`L179` — [Clinic 1: `NULL` & 3-Valued-Logic-Fallen ↗](https://chatelao.github.io/sql-schulung/#labs/compiler/clinic-1)** (`= NULL`, `NOT IN` + `NULL`, `BETWEEN`, `LIKE`)
- **`L180` — [Clinic 2: Nested Functions & Conversion Masks ↗](https://chatelao.github.io/sql-schulung/#labs/compiler/clinic-2)** (`NVL`/`NVL2`/`DECODE`, `TRIM`, `CONCAT`, `TO_CHAR`-Überlauf)
- **`L181` — [Clinic 3: Joins, `USING` & Outer-Filter ↗](https://chatelao.github.io/sql-schulung/#labs/compiler/clinic-3)** (`ORA-25154`, `NATURAL JOIN`, `LEFT JOIN` + `WHERE`)
- **`L182` — [Clinic 4: Subqueries & `SET` Operators ↗](https://chatelao.github.io/sql-schulung/#labs/compiler/clinic-4)** (`ANY`/`ALL`/`EXISTS`, `ORDER BY` in `UNION`, leere Subqueries)
- **`L183` — [Clinic 5: DDL, `CTAS`, Views & Sequences ↗](https://chatelao.github.io/sql-schulung/#labs/compiler/clinic-5)** (`CTAS`, `TRUNCATE` Auto-Commit, `CHECK`-Grenzen, `WITH CHECK OPTION`, `CURRVAL`)
- **`L184` — [Clinic 6: Dictionary, Time Zones & DCL ↗](https://chatelao.github.io/sql-schulung/#labs/compiler/clinic-6)** (`USER_`/`ALL_`/`DBA_`, `TIMESTAMP WITH LOCAL TIME ZONE`, `REVOKE`-Kaskaden)

---

## Mock Exam #1 & Aufarbeitung (`L185`–`L193`)

### `L185`–`L187` — Vollständiges Timed Mock Exam #1 (60 Fragen / 120 Minuten)
Starte **[Mock Exam #1 ↗](https://chatelao.github.io/sql-schulung/#mock/exam-1)** und trainiere die **3-Pass Exam Pacing Strategy**:
1. **Durchgang 1 (Minuten 0–75)**: Beantworte alle eindeutigen Syntax- und Konzeptfragen (ca. 1 Min. je Frage). Markiere lange Multi-Table- oder DDL-Fragen (*Markieren*).
2. **Durchgang 2 (Minuten 75–105)**: Verfolge markierte Queries Schritt für Schritt auf Schmierzettel nach.
3. **Durchgang 3 (Minuten 105–120)**: Prüfe jede *„Wähle zwei“*/*„Wähle drei“*-Frage noch einmal genau (Oracle vergibt bei Multi-Select-Fragen **keine Teilpunkte**!).

### `L188`–`L189` — Strukturierte Selbst-Nachbesprechung (Debrief)
Notiere für jede falsche oder glücklich geratene Frage aus Mock Exam #1:

| Frage-ID | Domain | Mein Fehler / Denkfalle | Richtige Oracle-Regel / `ORA-`-Code | Kapitel-Link |
| :--- | :---: | :--- | :--- | :--- |
| *z. B. M14* | *D3* | *`ROUND(156.78, -2)` als `160` gelesen* | *`-2` rundet auf Hunderter → `200`* | *Phase 3 (`L051`)* |

### `L190`–`L193` — Gezielte Remediation Labs
- Identifiziere die **2 schwächsten Domains** aus der Mock-Exam-#1-Auswertung.
- Starte im Studio den **Domain-Fokus-Drill** ([Mock / Domain-Drill ↗](https://chatelao.github.io/sql-schulung/#mock)) für diese Domains und führe die passenden Live-Beispiele noch einmal in Oracle FreeSQL / deiner PDB aus.
- Wiederhole in `L193` alle unsicheren Karten im [Flashcard Rapid Review ↗](https://chatelao.github.io/sql-schulung/#flashcards).

---

## Mock Exam #2 & Prüfungslogistik (`L194`–`L198`)

### `L194`–`L196` — Vollständiges Timed Mock Exam #2 (Unabhängiger 60-Fragen-Pool!)
Starte **[Mock Exam #2 ↗](https://chatelao.github.io/sql-schulung/#mock/exam-2)** unter strengen 120-Minuten-Bedingungen.
- **Zielvorgabe für die Prüfungsreife**: **≥ 75 % (45/60)** (10 Prozentpunkte Sicherheitspuffer über den offiziellen 65 %).

### `L197` — Debrief & Blind-Spot Final Check
- Prüfe alle falsch beantworteten Fragen aus Mock Exam #2 gegen das [Exam-Traps-Cheatsheet](../cheatsheets/exam-traps.md).

### `L198` — Buchung & Exam-Day Checklist
- Erstelle/prüfe deinen Oracle-SSO-Account auf **Oracle MyLearn**.
- Führe den Pearson/Oracle-Systemcheck für Online-Proctoring exakt auf dem Computer, mit der Webcam und im Netzwerk aus, die du am Prüfungstag nutzt.
- Räume deinen Schreibtisch vollständig frei (nur ein gültiger amtlicher Lichtbildausweis ist erlaubt).

---

## Identical Checkpoint #5 — Final Graduation (`L199`–`L200`)

### `L199` — Identical Checkpoint #5 (Abschlusslauf + Answer Key freigeschaltet!)
- Absolviere **[Checkpoint `CP-5` ↗](https://chatelao.github.io/sql-schulung/#checkpoints/CP-5)** ein letztes Mal (Ziel: **≥ 85 %**).
- Bei `CP-5` werden der vollständige **Answer Key und alle ausgearbeiteten Erklärungen** automatisch freigeschaltet!

### `L200` — `CP-0 → CP-5` Longitudinal Retrospective & Weiterbildung
- Öffne dein vollständiges Verlaufsdiagramm auf GitHub Pages und verfolge deinen Weg von **CP-0 (10–25 %)** bis **CP-5 (≥ 85 %)**.
- Exportiere dein finales Lernportfolio (`.json` und `.md`).
- **Wie geht es nach `1Z0-171` weiter?** Starte direkt im Aufbau-Modul **[Advanced Oracle SQL (`A001`–`A060`)](../advanced/modul-01-hierarchies.md)** (Hierarchien, Regex, JSON, XML, Window Functions, `MATCH_RECOGNIZE`).
