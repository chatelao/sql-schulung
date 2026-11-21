---
marp: true
theme: default
paginate: true
style: |
  section { font-size: 26px; }
  code { font-size: 22px; }
---

# Oracle SQL (`1Z0-171`) — Hybrid-Foliendeck (Phasen 1–10)

> **Für Beamer + Microsoft Teams Screen-Share (3 vor Ort + 3 via Teams):**
> - Maximal 1 Kernkonzept pro Folie (≥ 24 pt)
> - Jede Phase enthält **Konzept**, **Exam Trap (`ORA-`)** und eine **Predict-Pause für den Teams-Chat**
> - Im Interactive Studio oben rechts **`Beamer-Modus`** aktivieren!

---

## Phase 1 (1/3): Tabellen, Primary Keys & Foreign Keys

- **Tabelle** = feste Spaltenstruktur (Datentypen) + beliebig viele Zeilen.
- **`PRIMARY KEY`**: eindeutig + niemals `NULL` (z. B. `DEPT.DEPTNO`, `EMP.EMPNO`).
- **`FOREIGN KEY`**: verweist auf einen `PRIMARY KEY` (z. B. `EMP.DEPTNO -> DEPT.DEPTNO`).
- **5 SQL-Familien:**
  - `DQL` (`SELECT`), `DML` (`INSERT/UPDATE/DELETE/MERGE`), `DDL` (`CREATE/ALTER/DROP/TRUNCATE`), `TCL` (`COMMIT/ROLLBACK`), `DCL` (`GRANT/REVOKE`).

---

## Phase 1 (2/3): Die goldene `NULL`-Regel & Aliase

- `NULL` bedeutet **unbekannt / nicht vorhanden** — weder `0` noch `''`.
- **Arithmetik:** Zahl `+ NULL` = **`NULL`** (`sal + comm` ist für 10 von 14 Zeilen `NULL`!).
- **Verkettung (`||`):** behandelt `NULL` wie einen leeren String (`'A' || NULL || 'B'` = `'AB'`).
- **Spalten-Aliase:**
  - `AS jahres_gehalt` → `JAHRES_GEHALT`
  - `AS "Jahres Gehalt"` → exakte Schreibweise + Leerzeichen.

---

## Phase 1 (3/3): Predict-Pause (Alle 6 in den Teams-Chat!)

```sql
SELECT DISTINCT deptno, job
FROM scott.emp;
```

- **Frage 1:** Gilt `DISTINCT` nur für `deptno` oder für die Kombination `(deptno, job)`?
- **Frage 2:** Was wirft `SELECT ename FROM scott.emp WHERE job = "CLERK";`?
  - *(Auflösung: 1. Für die gesamte Kombination = 9 Zeilen; 2. `ORA-00904: "CLERK": invalid identifier` wegen doppelter Anführungszeichen!)*

---

## Phase 2 (1/3): 3-wertige Logik & `IS NULL`

- SQL kennt drei Wahrheitswerte: **`TRUE`**, **`FALSE`**, **`UNKNOWN`**.
- `WHERE` gibt **nur Zeilen mit `TRUE`** zurück (`UNKNOWN` fällt heraus!).
- Vergleiche mit `= NULL` oder `!= NULL` ergeben immer `UNKNOWN`.
- **Pflicht:** Immer `WHERE comm IS NULL` bzw. `WHERE comm IS NOT NULL`.

---

## Phase 2 (2/3): Operator-Präzedenz & Top-N (`FETCH`)

- **Reihenfolge:** `()` → Vergleiche → `NOT` → **`AND`** → **`OR`**.
- Ohne Klammern bindet `AND` stärker als `OR`!
- **`ORDER BY`:** Standard `ASC` (`NULLS LAST`), bei `DESC` stehen `NULL`s standardmässig **oben** (`NULLS FIRST`).
- **Row Limiting:**
  - `FETCH FIRST 3 ROWS ONLY` → exakt 3 Zeilen
  - `FETCH FIRST 3 ROWS WITH TIES` → nimmt Gleichstände auf Rang 3 mit!

---

## Phase 2 (3/3): Predict-Pause (Alle 6 in den Teams-Chat!)

```sql
SELECT ename, comm
FROM scott.emp
WHERE NOT (comm > 0);
```

- **Frage:** Wie viele der 14 Zeilen aus `scott.emp` erscheinen (10 haben `comm IS NULL`, 1 hat `comm = 0`, 3 haben `comm > 0`)?
- *(Auflösung: **Nur 1 Zeile (`TURNER`, `comm = 0`)**! Für die 10 `NULL`-Zeilen ist `NOT (UNKNOWN)` wieder `UNKNOWN`.)*

---

## Phase 3 (1/3): String- & Datumsfunktionen (1-basiert!)

- **`SUBSTR(str, pos, len)`** & **`INSTR(str, sub, pos, occ)`** zählen ab **Position 1**.
  - `SUBSTR('ORACLE', 2, 3)` → `'RAC'`
  - `INSTR` liefert `0`, wenn nichts gefunden wurde.
- **Zwiebelprinzip:** Verschachtelte Funktionen immer **von innen nach aussen** lesen.
- **Datumsarithmetik:** `SYSDATE + 1` = +24 Stunden; `MONTHS_BETWEEN`, `ADD_MONTHS`, `LAST_DAY`, `TRUNC(hiredate, 'MM')`.

---

## Phase 3 (2/3): Typkonvertierung, `NVL` & `CASE` vs. `DECODE`

- **Explizit vor implizit:** `TO_CHAR`, `TO_DATE`, `TO_NUMBER` (Formatmodelle `YYYY-MM-DD`, `fm`, `99,990.00`, `RR` vs. `YY`).
- **`NVL(expr1, expr2)`:** Beide Argumente müssen typkompatibel sein (`NVL(comm, 'keine')` → **`ORA-01722`**!).
- **`CASE` vs. `DECODE` bei `NULL`:**
  - `DECODE(comm, NULL, 'Leer')` → behandelt `NULL = NULL` als **wahr**!
  - `CASE comm WHEN NULL ...` → ergibt `UNKNOWN` (nutze `CASE WHEN comm IS NULL`).

---

## Phase 3 (3/3): Predict-Pause (Alle 6 in den Teams-Chat!)

```sql
SELECT SUBSTR('anna.meier@firma.ch',
              INSTR('anna.meier@firma.ch', '@') + 1) AS domain
FROM dual;
```

- **Frage:** Welchen String liefert diese Abfrage?
- *(Auflösung: `INSTR` findet `'@'` auf Position `11`; `11 + 1 = 12`; `SUBSTR` ab 12 liefert **`'firma.ch'`**.)*

---

## Phase 4 (1/3): Aggregatfunktionen & die `NULL`-Regel

- `COUNT(*)` zählt **alle** Zeilen inklusive `NULL`.
- `COUNT(col)`, `SUM(col)`, `AVG(col)`, `MIN(col)`, `MAX(col)` **ignorieren `NULL`**!
- **Management-Falle auf `SCOTT.EMP`:**
  - `AVG(comm)` teilt nur durch **4** (`550`)
  - `AVG(NVL(comm, 0))` teilt durch alle **14** (`157.14`).

---

## Phase 4 (2/3): Logische Abarbeitung (`WHERE` vs. `HAVING`)

1. `FROM` / `JOIN`
2. `WHERE` *(filtert Einzelzeilen vor der Gruppierung — keine Aggregate erlaubt!)*
3. `GROUP BY` *(jede nicht-aggregierte `SELECT`-Spalte muss hier stehen!)*
4. `HAVING` *(filtert fertige Gruppen)*
5. `SELECT` *(Spaltenaliase entstehen erst hier!)*
6. `ORDER BY` *(einzige Klausel, die Spaltenaliase aus `SELECT` kennt)*

---

## Phase 4 (3/3): Predict-Pause (Alle 6 in den Teams-Chat!)

```sql
SELECT deptno, job, COUNT(*)
FROM scott.emp
WHERE COUNT(*) > 1
GROUP BY deptno;
```

- **Frage:** Welche **zwei** `ORA-`-Fehler stecken in dieser Query?
- *(Auflösung: 1. `ORA-00934` wegen `COUNT(*)` im `WHERE` statt `HAVING`; 2. `ORA-00979` weil `job` im `GROUP BY` fehlt.)*

---

## Phase 5 (1/3): `INNER`, `OUTER`, `CROSS` & `NATURAL JOIN`

- **`INNER JOIN`**: nur Zeilen mit Treffer auf beiden Seiten (`DEPT 40` und `Kimberely Grant` fehlen).
- **`LEFT / RIGHT / FULL OUTER JOIN`**: bewahrt auch Zeilen ohne Match (ergänzt `NULL`).
- **`NATURAL JOIN`-Falle**: joint blind über **alle** gleichnamigen Spalten (`department_id` UND `manager_id` in `HR`).
- **`JOIN ... USING (deptno)`**: `deptno` darf **keinen** Tabellen-Alias tragen (`ORA-25154`)!

---

## Phase 5 (2/3): Outer-Filter-Falle (`ON` vs. `WHERE`) & Self-Join

- **Kritische Falle beim `LEFT JOIN`:**
  - `LEFT JOIN scott.dept d ON e.deptno = d.deptno WHERE d.loc = 'BOSTON'`
  - Das `WHERE` verwirft alle `NULL`-Zeilen → **Outer Join wird zum Inner Join!**
  - **Lösung:** Bedingung in die `ON`-Klausel (`AND d.loc = 'BOSTON'`).
- **Self-Join:** `scott.emp e LEFT JOIN scott.emp m ON e.mgr = m.empno` (bewahrt `KING`).

---

## Phase 5 (3/3): Predict-Pause (Alle 6 in den Teams-Chat!)

```sql
SELECT e.ename, e.deptno, d.dname
FROM scott.emp e
JOIN scott.dept d USING (deptno);
```

- **Frage:** Läuft diese Query oder wirft sie einen Fehler?
- *(Auflösung: **`ORA-25154`** — die `USING`-Spalte `deptno` darf in `SELECT` nicht als `e.deptno` qualifiziert werden!)*

---

## Phase 6 (1/3): Subqueries & die `NOT IN` + `NULL`-Falle

- **Single-Row (`=`, `>`, `<`)** vs. **Multi-Row (`IN`, `ANY`, `ALL`)** — falsche Zuordnung wirft `ORA-01427`.
- **Leere Subquery** liefert `NULL` (kein Fehler).
- **`NOT IN`-Todesfalle:**
  - `WHERE empno NOT IN (SELECT mgr FROM scott.emp)` liefert **0 Zeilen**, weil `KING` `mgr IS NULL` hat!
  - **Lösung:** `WHERE NOT EXISTS (...)` oder `WHERE mgr IS NOT NULL`.

---

## Phase 6 (2/3): Correlated Subqueries & `SET`-Operatoren

- **Correlated Subquery:** Innere Query referenziert Spalte der äusseren Query (z. B. `WHERE e.sal > (SELECT AVG(i.sal) FROM emp i WHERE i.deptno = e.deptno)`).
- **`SET`-Operatoren:**
  - `UNION` (dedupliziert), `UNION ALL` (schnell, alle Zeilen), `INTERSECT` (Schnittmenge), `MINUS` / `EXCEPT` (Differenz).
  - Spaltennamen kommen aus der **1. Query**; `ORDER BY` steht **nur ganz am Ende**.

---

## Phase 6 (3/3): Predict-Pause (Alle 6 in den Teams-Chat!)

```sql
SELECT deptno AS abt FROM scott.emp WHERE deptno = 10
UNION
SELECT deptno AS abteilung FROM scott.dept
ORDER BY abteilung;
```

- **Frage:** Warum scheitert dieses `ORDER BY`?
- *(Auflösung: **`ORA-00904`** — bei Compound Queries gelten im `ORDER BY` nur die Spaltennamen/Aliase der **ersten** Query (`ORDER BY abt` oder `ORDER BY 1`).)*

---

## Phase 7 (1/3): DML (`INSERT`, `UPDATE`, `DELETE`, `MERGE`)

- `INSERT INTO t (cols) VALUES (...)` vs. `INSERT INTO t SELECT ...` (ohne `VALUES`!).
- **Multi-Table Insert:** `INSERT ALL` (prüft alle `WHEN`-Zweige) vs. `INSERT FIRST` (stoppt beim ersten Treffer).
- **`MERGE INTO` (Upsert):** kombiniert `WHEN MATCHED THEN UPDATE` und `WHEN NOT MATCHED THEN INSERT` (in `ON (...)` verwendete Spalten dürfen nicht im `UPDATE SET` stehen!).

---

## Phase 7 (2/3): Transaktionen (TCL), Savepoints & Locking

- Änderungen sind bis **`COMMIT`** nur in der eigenen Session sichtbar (**Read Consistency**).
- **`ROLLBACK TO SAVEPOINT sp1`** nimmt nur Schritte nach `sp1` zurück; die Transaktion bleibt offen.
- **Implizites `COMMIT`:** Jedes **DDL-Statement** (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`) committet eine offene Transaktion sofort!
- **Row-Level Lock:** Schreibende blockieren nur andere Schreibende auf **derselben Zeile** bis `COMMIT`/`ROLLBACK`.

---

## Phase 7 (3/3): Predict-Pause (Alle 6 in den Teams-Chat!)

```sql
INSERT INTO my_emp (empno, ename) VALUES (9999, 'TEST');
SAVEPOINT sp1;
CREATE TABLE temp_log (id NUMBER);
ROLLBACK TO SAVEPOINT sp1;
```

- **Frage:** Ist Zeile `9999` nach diesen 4 Befehlen in `my_emp` gespeichert, und was meldet Zeile 4?
- *(Auflösung: `CREATE TABLE` hat Zeile `9999` **dauerhaft committet**! Zeile 4 wirft **`ORA-01086: savepoint 'SP1' never established`**.)*

---

## Phase 8 (1/3): DDL, Constraints & `CTAS`

- **5 Constraint-Typen:** `PRIMARY KEY`, `UNIQUE` (erlaubt mehrere `NULL`s!), `FOREIGN KEY` (`ON DELETE CASCADE` / `SET NULL`), `CHECK` (kein `SYSDATE`!), `NOT NULL`.
- **`CTAS` (`CREATE TABLE t AS SELECT ...`):**
  - Kopiert Struktur, Daten und **`NOT NULL`**
  - Kopiert **keine** `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `CHECK` oder `DEFAULT`-Werte!
- **`DELETE` vs. `TRUNCATE`:** `TRUNCATE` ist DDL (Auto-Commit, kein Rollback).

---

## Phase 8 (2/3): Views, Sequences, Indexes & Temporary Tables

- **`VIEW`:** speichert nur die Query; `WITH CHECK OPTION` verhindert Updates/Inserts ausserhalb der `WHERE`-Klausel.
- **`SEQUENCE`:** `NEXTVAL` / `CURRVAL`; Lücken entstehen durch `ROLLBACK` oder Cache-Verlust.
- **`INDEX`:** B-Tree vs. Function-Based (`UPPER(ename)`); `INVISIBLE` zum risikolosen Testen.
- **Temporary Tables:** `GTT` (`ON COMMIT DELETE/PRESERVE ROWS`) vs. `PTT` (Name **muss** mit `ORA$PTT_` beginnen).

---

## Phase 8 (3/3): Predict-Pause (Alle 6 in den Teams-Chat!)

```sql
CREATE TABLE t_uk (id NUMBER UNIQUE);
INSERT INTO t_uk VALUES (NULL);
INSERT INTO t_uk VALUES (NULL);
```

- **Frage:** Wirft das zweite `INSERT` einen `ORA-00001: unique constraint violated`?
- *(Auflösung: **Nein!** Beide `INSERT`s gelingen — ein `UNIQUE`-Constraint erlaubt in Oracle beliebig viele `NULL`-Werte.)*

---

## Phase 9 (1/3): Data Dictionary & Zeitzonen

- **Data Dictionary Scopes:**
  - `USER_*`: nur eigene Objekte (`OWNER = USER`)
  - `ALL_*`: eigene + fremde Objekte mit Berechtigung
  - `DBA_*`: gesamte Datenbank (nur für DBAs)
  - Wichtig: Objektnamen im Dictionary stehen in **GROSSBUCHSTABEN** (`WHERE table_name = 'MY_EMP'`).
- **Zeitzonen:** `SYSDATE` (DB-Server) vs. `CURRENT_DATE` / `CURRENT_TIMESTAMP` (`SESSIONTIMEZONE`); `TIMESTAMP WITH LOCAL TIME ZONE` rechnet beim Lesen automatisch in die Session-Zone um.

---

## Phase 9 (2/3): DCL & die `REVOKE`-Kaskadenregel

- **Systemprivilegien** (`CREATE SESSION`, `CREATE TABLE`): Weitergabe mit **`WITH ADMIN OPTION`** → **`REVOKE` kaskadiert NICHT**!
- **Objektprivilegien** (`SELECT ON scott.emp`): Weitergabe mit **`WITH GRANT OPTION`** → **`REVOKE` kaskadiert an alle Weiterempfänger!**

---

## Phase 9 (3/3): Predict-Pause (Alle 6 in den Teams-Chat!)

- `A` führt aus: `GRANT SELECT ON a.kunden TO b WITH GRANT OPTION;`
- `B` führt aus: `GRANT SELECT ON a.kunden TO c;`
- `A` führt aus: `REVOKE SELECT ON a.kunden FROM b;`
- **Frage:** Kann `C` danach noch `SELECT * FROM a.kunden;` ausführen?
- *(Auflösung: **Nein!** Da `SELECT ON ...` ein Objektprivileg ist, verliert `C` das Recht durch die Kaskade sofort mit.)*

---

## Phase 10 (1/2): Prüfungsstrategie (`1Z0-171`) & Blind-Spot-Check

- **Prüfungsdaten:** ~60 Multiple-Choice-Fragen, 90–120 Min. (~1,5 Min./Frage), Bestehensgrenze ~65 %.
- **3-Durchgangs-Methode:**
  1. Sichere Fragen sofort beantworten, lange Codefragen markieren.
  2. Markierte Fragen von der **letzten Zeile / `WHERE` / `GROUP BY`** her prüfen (Ausschlussverfahren!).
  3. Prüfen, dass bei allen Multi-Select-Fragen („Choose two/three“) die exakte Anzahl gewählt ist.

---

## Phase 10 (2/2): Transfer in den Firmenalltag (3+3 Gruppe)

1. **`CP-5` im Studio abschliessen:** Alle 22 Musterlösungen sind jetzt freigeschaltet → Delta von `CP-0` bis `CP-5` feiern!
2. **Persönlicher 4-Wochen-Transfer-Plan:**
   - Welche **3 realen Abfragen / Reports / Datenprüfungen** aus deinem Lern-Backlog setzt du bis zum Follow-up-Termin im Job um?
3. **Follow-up in 4–6 Wochen (60 Min. via Teams):** Jede Person zeigt 1 Praxis-Query — der Teams-Kanal bleibt für Peer-Reviews offen!
