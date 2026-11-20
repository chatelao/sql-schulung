# Phase 2: Filtering, Sorting & Substitution Variables (`L021`–`L042`)

**Exam Domain**: Domain 2 (*Retrieving and Sorting Data*, 15 % gesamt)  
**Verwendete Schemas**: `SCOTT.EMP`, `HR.EMPLOYEES`

---

## `WHERE`-Klausel & einfache Vergleiche (`L021`–`L024`)

### `L021` — Zeilen filtern mit `WHERE`
```sql
SELECT ename, job, sal FROM scott.emp WHERE deptno = 10;
```
- **SQL Reference**: [SELECT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html)

### `L022` — Comparison Operators (`=`, `<>`, `!=`, `<`, `>`, `<=`, `>=`)
- SQL-Schlüsselwörter sind case-insensitive (`select`/`SELECT`), **Zeichenketten innerhalb von `'...'` sind dagegen case-sensitive** (`'CLERK'` != `'clerk'`).
- **SQL Reference**: [Comparison Conditions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Comparison-Conditions.html)

### `L023` — Date Literals in `WHERE`
```sql
SELECT ename, hiredate FROM scott.emp
WHERE hiredate >= DATE '1982-01-01';
```
- **SQL Reference**: [Literals](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Literals.html)

### `L024` — Warum `SELECT`-Aliases in `WHERE` fehlschlagen
- Die Abfrage `SELECT ename, sal * 12 annual FROM scott.emp WHERE annual > 30000;` wirft **`ORA-00904: "ANNUAL": invalid identifier`**, weil Oracle die `WHERE`-Klausel *vor* `SELECT` auswertet.
- **SQL Reference**: [SELECT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html)

---

## Range-, List-, Pattern- & Null-Filter (`L025`–`L028`)

### `L025` — Inklusive Bereiche mit `BETWEEN ... AND ...`
```sql
SELECT ename, sal FROM scott.emp WHERE sal BETWEEN 1250 AND 2850;
```
- **Exam Trap**: Die Untergrenze muss **zuerst** stehen (`BETWEEN 2850 AND 1250` liefert 0 Zeilen!). Beide Grenzen sind inklusive.
- **SQL Reference**: [BETWEEN Condition](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/BETWEEN-Condition.html)

### `L026` — Mengenzugehörigkeit mit `IN` und `NOT IN`
```sql
SELECT ename, job FROM scott.emp WHERE job IN ('MANAGER', 'ANALYST');
```
- **SQL Reference**: [IN Condition](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/IN-Condition.html)

### `L027` — Pattern Matching mit `LIKE` (`%`, `_`, `ESCAPE`)
```sql
-- Names starting with A, or 5-letter names ending in TH
SELECT ename FROM scott.emp WHERE ename LIKE 'A%';
SELECT ename FROM scott.emp WHERE ename LIKE '___TH';

-- Escaping a literal underscore in HR.EMPLOYEES.JOB_ID
SELECT job_id FROM hr.jobs WHERE job_id LIKE 'SA\_%' ESCAPE '\';
```
- **SQL Reference**: [About SQL Conditions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/About-SQL-Conditions.html)

### `L028` — Null-Werte filtern (`IS NULL` / `IS NOT NULL`)
```sql
SELECT ename, comm FROM scott.emp WHERE comm IS NULL;
```
- **Exam Trap**: `WHERE comm = NULL` oder `WHERE comm <> NULL` wirft **keinen** Fehler – es liefert stillschweigend **0 Zeilen**!
- **SQL Reference**: [Nulls](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Nulls.html)

---

## Boolean Logic & Operator Precedence (`L029`–`L033`)

### `L029` — Bedingungen kombinieren mit `AND`
```sql
SELECT ename, job, sal FROM scott.emp WHERE deptno = 30 AND sal >= 1500;
```
- **SQL Reference**: [Logical Conditions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Logical-Conditions.html)

### `L030` — Bedingungen erweitern mit `OR`
```sql
SELECT ename, deptno, job FROM scott.emp WHERE deptno = 10 OR job = 'CLERK';
```
- **SQL Reference**: [Logical Conditions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Logical-Conditions.html)

### `L031` — Negieren mit `NOT` & 3-Valued Logic
- `NOT (TRUE)` = `FALSE`, `NOT (FALSE)` = `TRUE`, `NOT (UNKNOWN)` = **`UNKNOWN`**!
- **SQL Reference**: [Logical Conditions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Logical-Conditions.html)

### `L032` — Precedence Rules (`NOT` -> `AND` -> `OR`)
```sql
-- Returns ALL Presidents regardless of salary, plus Salesmen > 1500:
SELECT ename, job, sal FROM scott.emp
WHERE job = 'SALESMAN' OR job = 'PRESIDENT' AND sal > 1500;

-- Parentheses change the meaning completely:
SELECT ename, job, sal FROM scott.emp
WHERE (job = 'SALESMAN' OR job = 'PRESIDENT') AND sal > 1500;
```
- **SQL Reference**: [About SQL Conditions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/About-SQL-Conditions.html)

### `L033` — Interaktives Precedence-Training
- Übe 10 `AND`/`OR`/`NOT`-Grenzfälle auf `HR.EMPLOYEES` und überprüfe die Ausgaben im Interactive Studio.
- **SQL Reference**: [Logical Conditions](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Logical-Conditions.html)

---

## Sorting & Row Limiting (`L034`–`L037`)

### `L034` — Sortieren mit `ORDER BY` (`ASC` / `DESC`)
```sql
SELECT ename, deptno, sal FROM scott.emp ORDER BY deptno ASC, sal DESC;
```
- **SQL Reference**: [Sorting Query Results](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Sorting-Query-Results.html)

### `L035` — Sortieren nach Alias, Spaltenposition & `NULLS FIRST/LAST`
```sql
SELECT ename, sal * 12 AS annual_sal, comm
FROM scott.emp
ORDER BY annual_sal DESC, comm NULLS FIRST;
```
- Standardmäßig sortiert Oracle **`NULL` bei `ASC` zuletzt (LAST) und bei `DESC` zuerst (FIRST)**.
- **SQL Reference**: [Sorting Query Results](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Sorting-Query-Results.html)

### `L036` — Row Limiting (`OFFSET` & `FETCH FIRST ... ONLY`)
```sql
-- Top 3 highest paid employees in SCOTT
SELECT ename, sal FROM scott.emp
ORDER BY sal DESC
FETCH FIRST 3 ROWS ONLY;

-- Pagination: skip top 3, take next 3
SELECT ename, sal FROM scott.emp
ORDER BY sal DESC
OFFSET 3 ROWS FETCH NEXT 3 ROWS ONLY;
```
- **SQL Reference**: [SELECT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html)

### `L037` — `ONLY` vs. `WITH TIES` & `PERCENT`
```sql
-- Returns 4 rows because SCOTT and FORD tie at 3000!
SELECT ename, sal FROM scott.emp
ORDER BY sal DESC
FETCH FIRST 3 ROWS WITH TIES;
```
- **SQL Reference**: [SELECT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/SELECT.html)

---

## SQL\*Plus Substitution Variables (`L038`–`L040`)

### `L038` — Single Ampersand (`&`) vs. Double Ampersand (`&&`)
```sql
-- Prompts every execution:
SELECT empno, ename, sal FROM scott.emp WHERE deptno = &dept_num;

-- Prompts once and defines session variable; remember single quotes for strings!
SELECT empno, ename, &&col_name FROM scott.emp
WHERE job = '&target_job'
ORDER BY &col_name;
```

### `L039` — `DEFINE`, `UNDEFINE` & `SET VERIFY ON/OFF`
```sql
DEFINE target_dept = 20
SET VERIFY ON
SELECT ename, sal FROM scott.emp WHERE deptno = &target_dept;
UNDEFINE target_dept
```
- Wenn `VERIFY` auf `ON` steht, gibt `sqlplus` die Zeilen `old 1:` und `new 1:` mit dem exakt ersetzten SQL aus.

### `L040` — Variante A CLI-Lab vs. Variante B Simulator
- **Variante A**: Führe `L038–L039` direkt in `sqlcl`/`sqlplus` aus.
- **Variante B**: Öffne den **SQL\*Plus Substitution Simulator** auf [GitHub Pages](https://chatelao.github.io/sql-schulung/#labs/sqlplus), um `old:`/`new:`-Ausgaben interaktiv zu üben.

---

## Checkpoint #1 (`L041`–`L042`)

### `L041` — Identical Checkpoint #1 (Assessment)
- Wiederhole das identische Assessment (22 Fragen + 3 Gold Standard SQL-Aufgaben) auf GitHub Pages. In Domains 1–2 solltest du jetzt einen deutlichen Sprung sehen!

### `L042` — Fortschrittsvergleich & Reflexion (`CP-1` vs. `CP-0`)
- Analysiere dein Verlaufsdiagramm auf GitHub Pages und dokumentiere dein 4-Fragen-Reflexionsprotokoll.
