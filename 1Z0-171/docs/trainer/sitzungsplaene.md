# Sitzungspläne & Hybrid-Moderation (Phasen 1–10)

Dieses Dokument liefert der Lehrperson für alle 10 Phasen des `1Z0-171`-Curriculums fertige **Sitzungspläne für den hybriden Firmenunterricht** (3 Teilnehmende vor Ort + 3 über Microsoft Teams).

---

## 1. Hybrid-Lektionsschema (45 Min. & 90-Min.-Doppelblock)

| Zeit (45 Min.) | Zeit (90 Min.) | Phase | Was passiert konkret (beide Lernorte)? |
| :-: | :-: | :--- | :--- |
| **0–5 Min.** | **0–8 Min.** | **1. Warm-Up (Alle 6)** | Kurze Teams-Umfrage (1–2 Flashcards oder Syntax-Spotter). Remote antwortet im Chat/Umfrage, Vor-Ort per Laptop im selben Teams-Poll. |
| **5–15 Min.** | **8–25 Min.** | **2. Konzept-Input** | Lehrperson teilt Handbuch/Folie (max. 15–20 Min. am Stück) und skizziert im **Teams Whiteboard** (keine Wandtafel!). |
| **15–30 Min.** | **25–50 Min.** | **3. Live-Coding mit Predict-Pausen** | Lehrperson codet in VS Code/SQL Developer (≥ 16 pt). Vor jedem `Run`: **„Alle 6: Wie viele Zeilen / welcher Fehler? In den Teams-Chat tippen!“** Aufruf abwechselnd *Remote first*. |
| **30–42 Min.** | **50–80 Min.** | **4. Gemischte Paararbeit (3 Paare)** | **3 Teams-Breakout-Rooms** (je 1 Person vor Ort mit Headset + 1 Person remote). Rollen **Driver** (tippt, teilt Screen) & **Navigator** (denkt mit, liest Aufgaben) — **Wechsel nach halber Zeit**. |
| **42–45 Min.** | **80–90 Min.** | **5. Blitzlicht & Exit** | Zurück im Plenum: je 1 Erkenntnis oder Fehler aus jedem Paar (*Remote first*) + Verweis auf Selbststudium bis zur nächsten Sitzung. |

> [!TIP]
> **Pausenregel:** Im 90-Minuten-Block nach Minute 45 unbedingt **5–10 Minuten echte Bildschirmpause** einplanen (Kameras/Mikros aus, aufstehen).

---

## 2. Paar-Rotation (3 gemischte Paare)

Bei 3 Personen vor Ort (`O1, O2, O3`) und 3 Remote-Personen (`R1, R2, R3`) rotieren die Paare je Kurstag:
- **Tag 1 / 4 / 7:** `(O1+R1)`, `(O2+R2)`, `(O3+R3)`
- **Tag 2 / 5 / 8:** `(O1+R2)`, `(O2+R3)`, `(O3+R1)`
- **Tag 3 / 6 / 9:** `(O1+R3)`, `(O2+R1)`, `(O3+R2)`

*Tipp:* Nutze `CP-0`, um Personen mit etwas mehr Vorerfahrung gleichmässig auf die Paare zu verteilen.

---

## 3. Die 10 Sitzungspläne (`Phase 1` bis `Phase 10`)

### Phase 1 — Grundlagen & `SELECT` (`L001–L020`)
- **Empfohlene Hybrid-Zeit:** 2 × 90 Min. (Rest als Selbststudium + `CP-0`)
- **Kernbotschaften:** Tabelle vs. Excel; `NULL` ist weder `0` noch `''`; jede Zahl + `NULL` ergibt `NULL`; `DISTINCT` wirkt auf die ganze Zeilenkombination.
- **Whiteboard-Skizze:** `SCOTT.DEPT` (4 Zeilen) → `1:N` → `SCOTT.EMP` (14 Zeilen) mit `EMPNO` (PK) und `DEPTNO` (FK).
- **Typische Missverständnisse:** `sal + comm` ohne `NVL` liefert bei 10 von 14 `EMP`-Zeilen `NULL`; doppelte Anführungszeichen vs. einfache Hochkommas (`'Text'` vs. `"Spalten Alias"`).
- **Paaraufgaben & Plenum:** Siehe [Phase 1: Hybrid-Paaraufgaben](../phases/phase-01-foundations.md#hybrid-paaraufgaben-3-gemischte-paare-remote-vor-ort).
- **Nachhol-Pfad bei Fehlzeit:** Handbuch `L004–L020` lesen → `labs/phase-01-foundations.sql` ausführen → `CP-0` im Studio durchführen (Lösungen nicht nachschlagen!).

### Phase 2 — Filtern, Sortieren & Substitution Variables (`L021–L042`)
- **Empfohlene Hybrid-Zeit:** 2 × 90 Min. (+ `CP-1`)
- **Kernbotschaften:** Präzedenz `AND` vor `OR` (Klammern retten Leben!); `NULL` prüft man nur mit `IS NULL`; `FETCH FIRST ... WITH TIES` vs. `ONLY`.
- **Whiteboard-Skizze:** Wahrheitstabelle 3-wertige Logik (`TRUE`, `FALSE`, `UNKNOWN`) bei `AND` / `OR` / `NOT` / `NOT IN (..., NULL)`.
- **Typische Missverständnisse:** `WHERE comm = NULL` gibt 0 Zeilen statt Fehler; `WHERE deptno = 10 OR deptno = 20 AND sal > 2000` ohne Klammern.
- **Paaraufgaben & Plenum:** Siehe [Phase 2: Hybrid-Paaraufgaben](../phases/phase-02-filtering-sorting.md#hybrid-paaraufgaben-3-gemischte-paare-remote-vor-ort).
- **Nachhol-Pfad bei Fehlzeit:** `L021–L040` lesen → `labs/phase-02-filtering-sorting.sql` + [SQL\*Plus Simulator](https://chatelao.github.io/sql-schulung/#labs/sqlplus) → `CP-1`.

### Phase 3 — Single-Row & Conversion Functions (`L043–L068`)
- **Empfohlene Hybrid-Zeit:** 3 × 90 Min.
- **Kernbotschaften:** 1-based Indexing bei `SUBSTR`/`INSTR`; `ROUND`/`TRUNC` bei Zahlen **und** `DATE` (`'MM'`, `'YYYY'`); `TO_CHAR`/`TO_DATE` Formatmodelle; `CASE` vs. `DECODE` (Typkompatibilität!).
- **Whiteboard-Skizze:** Zwiebel-Prinzip für verschachtelte Funktionen (von innen nach aussen auswerten) + `RR` vs. `YY` Jahrhundert-Regel.
- **Typische Missverständnisse:** `INSTR` liefert `0` (nicht `-1`) wenn nichts gefunden; `NVL(comm, 'None')` wirft `ORA-01722` wegen implizitem Datentyp-Zwang; `TO_DATE` mit falschem `NLS_DATE_FORMAT`.
- **Paaraufgaben & Plenum:** Siehe [Phase 3: Hybrid-Paaraufgaben](../phases/phase-03-functions.md#hybrid-paaraufgaben-3-gemischte-paare-remote-vor-ort).
- **Nachhol-Pfad bei Fehlzeit:** `L043–L068` + [Functions-Referenz](../cheatsheets/functions-reference.md) → [1-based Slicer](https://chatelao.github.io/sql-schulung/#labs/slicer) → `labs/phase-03-functions.sql`.

### Phase 4 — Grouping & Aggregating (`L069–L082`)
- **Empfohlene Hybrid-Zeit:** 2 × 90 Min. (+ `CP-2`)
- **Kernbotschaften:** `COUNT(*)` zählt alle Zeilen inkl. `NULL`, `COUNT(col)` & `AVG(col)` ignorieren `NULL`!; `WHERE` filtert **vor**, `HAVING` **nach** `GROUP BY`.
- **Whiteboard-Skizze:** Logische SQL-Abarbeitungsreihenfolge (`FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY`).
- **Typische Missverständnisse:** Jede nicht-aggregierte Spalte im `SELECT` muss ins `GROUP BY` (`ORA-00979`); `ORA-00934` („group function is not allowed here“ im `WHERE`).
- **Paaraufgaben & Plenum:** Siehe [Phase 4: Hybrid-Paaraufgaben](../phases/phase-04-aggregation.md#hybrid-paaraufgaben-3-gemischte-paare-remote-vor-ort).
- **Nachhol-Pfad bei Fehlzeit:** `L069–L079` → `labs/phase-04-aggregation.sql` → `Human Compiler (P1–4)` → `CP-2`.

### Phase 5 — Multi-Table Joins (`L083–L102`)
- **Empfohlene Hybrid-Zeit:** 3 × 90 Min.
- **Kernbotschaften:** `INNER JOIN` verliert Zeilen ohne Match (`DEPT 40`, `Kimberely Grant`); `LEFT/RIGHT/FULL OUTER JOIN` bewahren sie; Filter auf die äussere Tabelle im `WHERE` zerstört den `OUTER JOIN`!
- **Whiteboard-Skizze:** Zwei kleine Tabellen mit Pfeilen zwischen Matching-Rows + Markierung, wo `NULL`s erzeugt werden (`ON` vs. `WHERE`).
- **Typische Missverständnisse:** `JOIN ... USING (deptno)` verbietet Tabellen-Qualifier `e.deptno` (`ORA-25154`); versehentlicher `CROSS JOIN` bei fehlender `ON`-Bedingung.
- **Paaraufgaben & Plenum:** Siehe [Phase 5: Hybrid-Paaraufgaben](../phases/phase-05-joins.md#hybrid-paaraufgaben-3-gemischte-paare-remote-vor-ort).
- **Nachhol-Pfad bei Fehlzeit:** `L083–L102` → [Join Visualizer](https://chatelao.github.io/sql-schulung/#labs/joins) → `labs/phase-05-joins.sql`.

### Phase 6 — Subqueries & `SET` Operators (`L103–L122`)
- **Empfohlene Hybrid-Zeit:** 3 × 90 Min. (+ `CP-3`)
- **Kernbotschaften:** `NOT IN` wird bei einem einzigen `NULL` in der Subquery komplett leer; `NOT EXISTS` ist `NULL`-sicher; bei `SET`-Operatoren bestimmt die **erste** Query die Spaltennamen, `ORDER BY` steht nur ganz am Ende.
- **Whiteboard-Skizze:** `IN` vs. `EXISTS` (Korrelation: äussere Zeile rein, ja/nein raus) und `UNION` vs. `UNION ALL` vs. `INTERSECT` vs. `MINUS`.
- **Typische Missverständnisse:** Multi-Row Subquery mit `=` statt `IN` (`ORA-01427`); unterschiedliche Spaltentypen bei `UNION`.
- **Paaraufgaben & Plenum:** Siehe [Phase 6: Hybrid-Paaraufgaben](../phases/phase-06-subqueries-set.md#hybrid-paaraufgaben-3-gemischte-paare-remote-vor-ort).
- **Nachhol-Pfad bei Fehlzeit:** `L103–L120` → `labs/phase-06-subqueries-set.sql` → `CP-3`.

### Phase 7 — DML & Transactions (`L123–L138`) *(Pflicht für Route B; optional für Route A)*
- **Empfohlene Hybrid-Zeit:** 2 × 90 Min.
- **Kernbotschaften:** Impliziter `COMMIT` durch jedes `DDL`-Statement (`CREATE`, `ALTER`, `TRUNCATE`); `DELETE` vs. `TRUNCATE` (Rollback?); Lese-Konsistenz zwischen zwei Sessions.
- **Whiteboard-Skizze:** Zeitachse zweier Sessions (Session 1 `UPDATE` ohne `COMMIT` → Session 2 sieht alten Stand, blockiert bei `UPDATE` derselben Zeile).
- **Typische Missverständnisse:** `ROLLBACK TO SAVEPOINT sp1` beendet die Transaktion **nicht**; `MERGE` scheitert, wenn Zielzeile mehrfach gematcht wird (`ORA-30926`).
- **Paaraufgaben & Plenum:** Siehe [Phase 7: Hybrid-Paaraufgaben](../phases/phase-07-dml-tcl.md#hybrid-paaraufgaben-3-gemischte-paare-remote-vor-ort) (hier als echtes Zwei-Session-Paar-Lab in derselben PDB!).
- **Nachhol-Pfad bei Fehlzeit:** `L123–L138` → `labs/phase-07-dml-tcl.sql`.

### Phase 8 — DDL, Constraints, Views & Indexes (`L139–L162`) *(Route B)*
- **Empfohlene Hybrid-Zeit:** 3 × 90 Min. (+ `CP-4`)
- **Kernbotschaften:** `PRIMARY KEY`, `UNIQUE` (erlaubt mehrere `NULL`s in Oracle!), `FOREIGN KEY` (`ON DELETE CASCADE` vs. `SET NULL`), `CHECK`; `CTAS` übernimmt nur `NOT NULL`-Constraints; `VIEW` speichert nur die Query; `SEQUENCE` hat Lücken nach `ROLLBACK`.
- **Whiteboard-Skizze:** Lebenszyklus `CREATE TABLE` → `ALTER TABLE` → `CREATE VIEW` (`WITH CHECK OPTION`) → `DROP`/`FLASHBACK`.
- **Typische Missverständnisse:** `UNIQUE` vs. `PRIMARY KEY` bei `NULL`; `VIEW` mit `GROUP BY` ist nicht per DML änderbar.
- **Paaraufgaben & Plenum:** Siehe [Phase 8: Hybrid-Paaraufgaben](../phases/phase-08-ddl-objects.md#hybrid-paaraufgaben-3-gemischte-paare-remote-vor-ort).
- **Nachhol-Pfad bei Fehlzeit:** `L139–L160` → `labs/phase-08-ddl-objects.sql` → `CP-4`.

### Phase 9 — Data Dictionary, Time Zones & DCL (`L163–L178`)
- **Empfohlene Hybrid-Zeit:** 2 × 90 Min. *(für Route A: Schwerpunkt Data Dictionary & Zeitzonen)*
- **Kernbotschaften:** `USER_*` vs. `ALL_*` vs. `DBA_*`; `TIMESTAMP WITH TIME ZONE` vs. `WITH LOCAL TIME ZONE`; System- vs. Objektprivilegien (`WITH ADMIN OPTION` vs. `WITH GRANT OPTION` und Kaskaden-Effekt beim `REVOKE`).
- **Whiteboard-Skizze:** Kaskaden-Baum bei `REVOKE` (Systemprivileg bleibt beim Enkel, Objektprivileg wird kaskadierend entzogen!).
- **Typische Missverständnisse:** `USER_TABLES` zeigt keine fremden Tabellen; `INTERVAL YEAR TO MONTH` vs. `DAY TO SECOND`.
- **Paaraufgaben & Plenum:** Siehe [Phase 9: Hybrid-Paaraufgaben](../phases/phase-09-dict-tz-dcl.md#hybrid-paaraufgaben-3-gemischte-paare-remote-vor-ort) (`student_0X` + `student_0X_peer`).
- **Nachhol-Pfad bei Fehlzeit:** `L163–L178` → `labs/phase-09-dict-tz-dcl.sql`.

### Phase 10 — Prüfungstraining & Abschluss (`L179–L200`) *(Route B)*
- **Empfohlene Hybrid-Zeit:** 2 × 90 Min. (Clinics + Debrief + `CP-5` & Retrospektive)
- **Kernbotschaften:** Zeitbudget im `1Z0-171` (~1,5 Min./Frage); Ausschlussverfahren bei Multi-Select; Blind-Spot-Analyse aus `CP-0..CP-5`.
- **Whiteboard-Skizze:** Gemeinsame Domain-Heatmap der 6 Teilnehmenden (anonymisiert, falls gewünscht) → Fokus-Wiederholung der Top-2-Schwachstellen.
- **Paaraufgaben & Plenum:** Siehe [Phase 10: Hybrid-Paaraufgaben](../phases/phase-10-exam-prep.md#hybrid-paaraufgaben-3-gemischte-paare-remote-vor-ort).
- **Nachhol-Pfad bei Fehlzeit:** Clinics 1–6 + Mock Exam #1 & #2 + `CP-5` im Studio durchführen.
