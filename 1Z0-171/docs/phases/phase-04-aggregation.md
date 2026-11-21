# Phase 4: Grouping & Aggregating Data (`L069`–`L082`)

**Exam Domain**: Domain 3 Teil 2 (*Aggregate Functions*, ca. 7 % der Prüfung)  
**Verwendete Schemas**: `SCOTT.EMP`, `HR.EMPLOYEES`  
**Interactive Studio**: [Phase 4 Tracker](https://chatelao.github.io/sql-schulung/#curriculum/phase-4) · [FreeSQL Sandbox](https://chatelao.github.io/sql-schulung/#labs/freesql/phase-4) · [Human Compiler](https://chatelao.github.io/sql-schulung/#labs/compiler) · [Flashcards D3](https://chatelao.github.io/sql-schulung/#flashcards/D3)

---

## Aggregate Functions & `NULL` Traps (`L069`–`L073`)

### `L069` — `SUM`, `AVG`, `MIN`, `MAX`
- **Lernziel**: Du fasst viele Zeilen zu Kennzahlen zusammen und kennst die zulässigen Datentypen je Funktion.
- **Studio-Link**: [Tracker `L069`](https://chatelao.github.io/sql-schulung/#curriculum/L069) · [SQL Ref: Aggregate Functions](https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/Aggregate-Functions.html)
- **Beispiel**:
  ```sql
  SELECT MIN(sal), MAX(sal), ROUND(AVG(sal), 2), SUM(sal) FROM scott.emp;
  -- Ergebnis: 800 | 5000 | 2073.21 | 29025
  ```
- **Regel**: `MIN` und `MAX` funktionieren auf Zahlen, Strings und Datumsangaben; `SUM` und `AVG` nur auf Zahlen.

### `L070` — `COUNT(*)`, `COUNT(col)` & `COUNT(DISTINCT col)`
- **Lernziel**: Du unterscheidest das Zählen aller Zeilen (`COUNT(*)`) vom Zählen gefüllter (`COUNT(col)`) und eindeutiger Werte (`COUNT(DISTINCT col)`).
- **Studio-Link**: [Tracker `L070`](https://chatelao.github.io/sql-schulung/#curriculum/L070) · [SQL Ref: COUNT](https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/COUNT.html)
- **Beispiel**:
  ```sql
  SELECT COUNT(*) AS total_rows,
         COUNT(comm) AS non_null_comms,
         COUNT(DISTINCT job) AS unique_jobs
  FROM scott.emp;
  -- Ergebnis: 14 | 4 | 5
  ```

### `L071` — Die `AVG` + `NULL`-Falle auf `SCOTT.EMP.COMM` beweisen
- **Lernziel**: Du beweist rechnerisch, warum Aggregate Functions (außer `COUNT(*)`) `NULL`-Werte ignorieren.
- **Studio-Link**: [Tracker `L071`](https://chatelao.github.io/sql-schulung/#curriculum/L071)
- **Herleitung**:
  - Provisionen in `SCOTT.EMP`: `300, 500, 1400, 0` (4 Zeilen) + `10× NULL`.
  - `AVG(comm)` = `(300 + 500 + 1400 + 0) / 4` = **`550`** (teilt durch 4!).
  - `AVG(NVL(comm, 0))` = `2200 / 14` = **`157.14`** (teilt durch alle 14 Mitarbeiter!).

### `L072` — Group Functions mit Single-Row Columns kombinieren (`ORA-00937`)
- **Lernziel**: Du erkennst und behebst `ORA-00937: not a single-group group function`.
- **Studio-Link**: [Tracker `L072`](https://chatelao.github.io/sql-schulung/#curriculum/L072)
- **Exam Trap**: `SELECT ename, MAX(sal) FROM scott.emp;` liefert 14 Namen, aber nur 1 Maximum — Oracle bricht mit `ORA-00937` ab, solange kein `GROUP BY` oder keine Subquery verwendet wird.

### `L073` — Aggregate Practice Lab auf `HR.EMPLOYEES`
- **Lernziel**: Du wendest `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` sicher auf `HR.EMPLOYEES` an.
- **Studio-Link**: [Tracker `L073`](https://chatelao.github.io/sql-schulung/#curriculum/L073)
- **Selbstlern-Aufgabe**: Ermittle auf `HR.EMPLOYEES` in einer Query: Gesamtanzahl Mitarbeiter, Anzahl Mitarbeiter mit `commission_pct`, `AVG(commission_pct)` und `ROUND(AVG(NVL(commission_pct, 0)), 4)`.
  ??? success "Musterlösung & Erklärung"
      ```sql
      SELECT COUNT(*) AS total_staff,
             COUNT(commission_pct) AS sales_staff,
             ROUND(AVG(commission_pct), 4) AS avg_sales_comm,
             ROUND(AVG(NVL(commission_pct, 0)), 4) AS avg_company_comm
      FROM hr.employees;
      -- Ergebnis: 107 | 35 | 0.2229 | 0.0729
      ```

---

## `GROUP BY`, `HAVING` & Nested Aggregates (`L074`–`L078`)

### `L074` — Gruppieren nach einer einzelnen Spalte
- **Lernziel**: Du bildest Gruppen mit `GROUP BY` und berechnest Kennzahlen pro Gruppe.
- **Studio-Link**: [Tracker `L074`](https://chatelao.github.io/sql-schulung/#curriculum/L074)
- **Beispiel**:
  ```sql
  SELECT deptno, COUNT(*) AS headcount, SUM(sal) AS payroll
  FROM scott.emp
  GROUP BY deptno
  ORDER BY deptno;
  -- Erwartet: 3 Zeilen (10: 3 | 8750, 20: 5 | 10875, 30: 6 | 9400)
  ```

### `L075` — Gruppieren nach mehreren Spalten & `ORA-00979` beheben
- **Lernziel**: Du gruppierst nach mehreren Spalten und hältst die strikte `GROUP BY`-Regel ein.
- **Studio-Link**: [Tracker `L075`](https://chatelao.github.io/sql-schulung/#curriculum/L075)
- **Regel**: Jede nicht aggregierte Spalte in `SELECT` **muss** in `GROUP BY` stehen (Spalten aus `GROUP BY` müssen aber *nicht* zwingend in `SELECT` erscheinen). Verstoß → `ORA-00979`.

### `L076` — `WHERE` vs. `HAVING`
- **Lernziel**: Du unterscheidest Zeilenfilter vor der Gruppierung (`WHERE`) von Gruppenfiltern nach der Gruppierung (`HAVING`).
- **Studio-Link**: [Tracker `L076`](https://chatelao.github.io/sql-schulung/#curriculum/L076)
- **Beispiel**:
  ```sql
  SELECT deptno, ROUND(AVG(sal), 2) AS avg_sal
  FROM scott.emp
  WHERE job <> 'PRESIDENT'          -- Filtert einzelne Zeilen VOR dem Gruppieren
  GROUP BY deptno
  HAVING AVG(sal) > 2000;           -- Filtert fertige Gruppen NACH dem Gruppieren
  -- Erwartet: Dept 20 (2175)
  ```
- !!! warning "1Z0-171 Exam Trap"
    Group Functions (`AVG(sal) > 2000`) dürfen **niemals** in `WHERE` stehen (`ORA-00934`).

### `L077` — Verschachtelte Group Functions (Maximale Tiefe = 2)
- **Lernziel**: Du liest und schreibst 2-stufig verschachtelte Aggregate korrekt.
- **Studio-Link**: [Tracker `L077`](https://chatelao.github.io/sql-schulung/#curriculum/L077)
- **Beispiel**: `SELECT MAX(AVG(sal)) FROM scott.emp GROUP BY deptno;` → `2916.67` (1 Zeile!).
- !!! warning "1Z0-171 Exam Trap"
    Beim Verschachteln zweier Group Functions ist `GROUP BY` Pflicht, und es darf **keine** unaggregierte Spalte (wie `deptno`) in der `SELECT`-Liste stehen (`ORA-00937`)!

### `L078` — Payroll Summary Lab (`HR.EMPLOYEES`)
- **Lernziel**: Du erstellst mehrstufige Gruppenauswertungen auf `HR.EMPLOYEES`.
- **Studio-Link**: [Tracker `L078`](https://chatelao.github.io/sql-schulung/#curriculum/L078)
- **Selbstlern-Aufgabe**: Gib je `department_id` und `job_id` in `HR.EMPLOYEES` die Anzahl Mitarbeiter sowie `MIN(salary)` und `MAX(salary)` aus — aber nur für Kombinationen mit mindestens `5` Mitarbeitern (erwartet: 4 Zeilen).
  ??? success "Musterlösung & Erklärung"
      ```sql
      SELECT department_id, job_id, COUNT(*) AS cnt, MIN(salary) AS min_sal, MAX(salary) AS max_sal
      FROM hr.employees
      GROUP BY department_id, job_id
      HAVING COUNT(*) >= 5
      ORDER BY cnt DESC;
      ```

---

## Konsolidierung & Checkpoint #2 (`L079`–`L082`)

### `L079` — Konsolidierungs-Lab (Functions + Grouping)
- **Lernziel**: Du kombinierst Single-Row Functions (`TO_CHAR`, `NVL`, `CASE`) mit `GROUP BY` und `HAVING`.
- **Studio-Link**: [Tracker `L079`](https://chatelao.github.io/sql-schulung/#curriculum/L079)
- **Selbstlern-Aufgabe**: Gruppiere `SCOTT.EMP` nach dem Einstellungsjahr (`TO_CHAR(hiredate, 'YYYY')`) und zeige je Jahr die Mitarbeiteranzahl und die Gesamtsumme `sal + NVL(comm, 0)` (erwartet: 4 Zeilen für 1980, 1981, 1982, 1987).
  ??? success "Musterlösung & Erklärung"
      ```sql
      SELECT TO_CHAR(hiredate, 'YYYY') AS hire_year,
             COUNT(*) AS hires,
             SUM(sal + NVL(comm, 0)) AS total_comp
      FROM scott.emp
      GROUP BY TO_CHAR(hiredate, 'YYYY')
      ORDER BY hire_year;
      ```

### `L080` — „Human Compiler“ Drill #1 (Code lesen ohne IDE)
- **Lernziel**: Du beurteilst SQL-Code aus den Phasen 1–4 rein im Kopf auf Zeilen/0 Zeilen/`ORA-`-Fehler.
- **Studio-Link**: [Tracker `L080`](https://chatelao.github.io/sql-schulung/#curriculum/L080) · [Human Compiler (Phasen 1–4) starten ↗](https://chatelao.github.io/sql-schulung/#labs/compiler/phase-1-4)

### `L081` — Identical Checkpoint #2 (Assessment)
- **Lernziel**: Du misst deinen Wissenssprung nach Domain 3 (25 % Prüfungsgewicht!).
- **Studio-Link**: [Tracker `L081`](https://chatelao.github.io/sql-schulung/#curriculum/L081) · [Checkpoint `CP-2` starten ↗](https://chatelao.github.io/sql-schulung/#checkpoints/CP-2)
- **Erwartetes Niveau**: **50–60 %** gesamt.

### `L082` — Fortschrittsvergleich & Reflexion (`CP-2` vs. `CP-0..1`)
- **Lernziel**: Du wertest dein Delta-Diagramm aus und identifizierst verbleibende Blind Spots in Domains 1–3.
- **Studio-Link**: [Tracker `L082`](https://chatelao.github.io/sql-schulung/#curriculum/L082) · [`CP-2` Reflexion](https://chatelao.github.io/sql-schulung/#checkpoints/CP-2)
