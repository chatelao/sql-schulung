# Phase 4: Grouping & Aggregating Data (`L069`–`L082`)

**Exam Domain**: Domain 3 Teil 2 (*Aggregate Functions*, ca. 7 % der Prüfung)  
**Verwendete Schemas**: `SCOTT.EMP`, `HR.EMPLOYEES`

---

## Aggregate Functions & `NULL` Traps (`L069`–`L073`)

### `L069` — `SUM`, `AVG`, `MIN`, `MAX`
```sql
SELECT MIN(sal), MAX(sal), ROUND(AVG(sal), 2), SUM(sal) FROM scott.emp;
```
- `MIN` und `MAX` funktionieren auf Zahlen, Strings und Datumsangaben; `SUM` und `AVG` nur auf Zahlen.
- **SQL Reference**: [Aggregate Functions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Aggregate-Functions.html)

### `L070` — `COUNT(*)`, `COUNT(col)` & `COUNT(DISTINCT col)`
```sql
SELECT COUNT(*) AS total_rows,
       COUNT(comm) AS non_null_comms,
       COUNT(DISTINCT job) AS unique_jobs
FROM scott.emp;
-- Results: 14 | 4 | 5
```
- **SQL Reference**: [COUNT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/COUNT.html)

### `L071` — Die `AVG` + `NULL`-Falle auf `SCOTT.EMP.COMM` beweisen
```sql
-- AVG(comm) = (300 + 500 + 1400 + 0) / 4 = 550
-- AVG(NVL(comm, 0)) = 2200 / 14 = 157.14
SELECT AVG(comm) AS avg_recipients_only,
       ROUND(AVG(NVL(comm, 0)), 2) AS avg_all_staff
FROM scott.emp;
```
- **SQL Reference**: [AVG](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/AVG.html)

### `L072` — Group Functions mit Single-Row Columns kombinieren (`ORA-00937`)
- `SELECT ename, MAX(sal) FROM scott.emp;` schlägt mit `ORA-00937: not a single-group group function` fehl, sofern kein `GROUP BY` oder keine Subquery verwendet wird.
- **SQL Reference**: [Aggregate Functions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Aggregate-Functions.html)

### `L073` — Aggregate Practice Lab auf `HR.EMPLOYEES`
- Vergleiche `COUNT(*)`, `COUNT(commission_pct)` und `AVG(NVL(commission_pct, 0))` auf `HR.EMPLOYEES`.
- **SQL Reference**: [Aggregate Functions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Aggregate-Functions.html)

---

## `GROUP BY`, `HAVING` & Nested Aggregates (`L074`–`L078`)

### `L074` — Gruppieren nach einer einzelnen Spalte
```sql
SELECT deptno, COUNT(*) AS headcount, SUM(sal) AS payroll
FROM scott.emp
GROUP BY deptno
ORDER BY deptno;
```
- **SQL Reference**: [SELECT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html)

### `L075` — Gruppieren nach mehreren Spalten & `ORA-00979` beheben
```sql
SELECT deptno, job, COUNT(*), SUM(sal)
FROM scott.emp
GROUP BY deptno, job
ORDER BY deptno, job;
```
- **Regel**: Jede nicht aggregierte Spalte in `SELECT` **muss** in `GROUP BY` stehen (Spalten aus `GROUP BY` müssen aber *nicht* zwingend in `SELECT` erscheinen).
- **SQL Reference**: [SELECT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html)

### `L076` — `WHERE` vs. `HAVING`
```sql
SELECT deptno, ROUND(AVG(sal), 2) AS avg_sal
FROM scott.emp
WHERE job <> 'PRESIDENT'          -- Filters individual rows BEFORE grouping
GROUP BY deptno
HAVING AVG(sal) > 2000;           -- Filters groups AFTER grouping
```
- **Exam Trap**: Group Functions (`AVG(sal) > 2000`) dürfen niemals in `WHERE` stehen (`ORA-00934`).
- **SQL Reference**: [SELECT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html)

### `L077` — Verschachtelte Group Functions (Maximale Tiefe = 2)
```sql
-- Highest departmental average salary:
SELECT MAX(AVG(sal)) FROM scott.emp GROUP BY deptno;
```
- **Exam Trap**: Beim Verschachteln zweier Group Functions ist `GROUP BY` Pflicht, und es darf **keine** unaggregierte Spalte (wie `deptno`) in der `SELECT`-Liste stehen!
- **SQL Reference**: [Aggregate Functions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Aggregate-Functions.html)

### `L078` — Payroll Summary Lab (`HR.EMPLOYEES`)
- Erstelle je `department_id` und `job_id` eine Übersicht über Headcount, Min/Max/Avg Salary und Gesamt-Payroll.
- **SQL Reference**: [Aggregate Functions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Aggregate-Functions.html)

---

## Konsolidierung & Checkpoint #2 (`L079`–`L082`)

### `L079` — Konsolidierungs-Lab (Functions + Grouping)
- Baue formatierte Zusammenfassungen, die `TO_CHAR`, `NVL`, `CASE`, `GROUP BY` und `HAVING` kombinieren.
- **SQL Reference**: [Aggregate Functions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Aggregate-Functions.html)

### `L080` — "Human Compiler" Drill #1 (Code lesen ohne IDE)
- Löse 15 Code-Reading-Fragen auf [GitHub Pages](https://chatelao.github.io/sql-schulung/) zu den Phasen 1–4, ohne sie vorab in einer Datenbank auszuführen.

### `L081` — Identical Checkpoint #2 (Assessment)
- Wiederhole das identische Assessment (22 Fragen + 3 SQL-Aufgaben). Durch Domain 3 (25 % Prüfungsgewicht) ist hier ein großer Leistungssprung zu erwarten!

### `L082` — Fortschrittsvergleich & Reflexion (`CP-2` vs. `CP-0..1`)
- Prüfe dein Verlaufsdiagramm auf GitHub Pages und halte deine Reflexion fest.
