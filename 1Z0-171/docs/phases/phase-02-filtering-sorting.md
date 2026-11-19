# Phase 2: Filtering, Sorting & Substitution Variables (`L021`–`L042`)

**Exam Domain**: Domain 2 (*Retrieving and Sorting Data*, 15% total)  
**Schemas Used**: `SCOTT.EMP`, `HR.EMPLOYEES`

---

## `WHERE` Clause & Basic Comparisons (`L021`–`L024`)

### `L021` — Filtering Rows with `WHERE`
```sql
SELECT ename, job, sal FROM scott.emp WHERE deptno = 10;
```

### `L022` — Comparison Operators (`=`, `<>`, `!=`, `<`, `>`, `<=`, `>=`)
- SQL keywords are case-insensitive (`select`/`SELECT`), **character data inside `'...'` is case-sensitive** (`'CLERK'` != `'clerk'`).

### `L023` — Date Literals in `WHERE`
```sql
SELECT ename, hiredate FROM scott.emp
WHERE hiredate >= DATE '1982-01-01';
```

### `L024` — Why `SELECT` Aliases Fail in `WHERE`
- Running `SELECT ename, sal * 12 annual FROM scott.emp WHERE annual > 30000;` throws **`ORA-00904: "ANNUAL": invalid identifier`** because Oracle evaluates `WHERE` *before* `SELECT`.

---

## Range, List, Pattern & Null Filters (`L025`–`L028`)

### `L025` — Inclusive Ranges with `BETWEEN ... AND ...`
```sql
SELECT ename, sal FROM scott.emp WHERE sal BETWEEN 1250 AND 2850;
```
- **Exam Trap**: Lower bound must come **first** (`BETWEEN 2850 AND 1250` returns 0 rows!). Both endpoints are inclusive.

### `L026` — Set Membership with `IN` and `NOT IN`
```sql
SELECT ename, job FROM scott.emp WHERE job IN ('MANAGER', 'ANALYST');
```

### `L027` — Pattern Matching with `LIKE` (`%`, `_`, `ESCAPE`)
```sql
-- Names starting with A, or 5-letter names ending in TH
SELECT ename FROM scott.emp WHERE ename LIKE 'A%';
SELECT ename FROM scott.emp WHERE ename LIKE '___TH';

-- Escaping a literal underscore in HR.EMPLOYEES.JOB_ID
SELECT job_id FROM hr.jobs WHERE job_id LIKE 'SA\_%' ESCAPE '\';
```

### `L028` — Filtering Nulls (`IS NULL` / `IS NOT NULL`)
```sql
SELECT ename, comm FROM scott.emp WHERE comm IS NULL;
```
- **Exam Trap**: `WHERE comm = NULL` or `WHERE comm <> NULL` does **not** error—it silently returns **0 rows**!

---

## Boolean Logic & Operator Precedence (`L029`–`L033`)

### `L029` — Combining Conditions with `AND`
```sql
SELECT ename, job, sal FROM scott.emp WHERE deptno = 30 AND sal >= 1500;
```

### `L030` — Broadening Conditions with `OR`
```sql
SELECT ename, deptno, job FROM scott.emp WHERE deptno = 10 OR job = 'CLERK';
```

### `L031` — Negating with `NOT` & 3-Valued Logic
- `NOT (TRUE)` = `FALSE`, `NOT (FALSE)` = `TRUE`, `NOT (UNKNOWN)` = **`UNKNOWN`**!

### `L032` — Precedence Rules (`NOT` -> `AND` -> `OR`)
```sql
-- Returns ALL Presidents regardless of salary, plus Salesmen > 1500:
SELECT ename, job, sal FROM scott.emp
WHERE job = 'SALESMAN' OR job = 'PRESIDENT' AND sal > 1500;

-- Parentheses change the meaning completely:
SELECT ename, job, sal FROM scott.emp
WHERE (job = 'SALESMAN' OR job = 'PRESIDENT') AND sal > 1500;
```

### `L033` — Interactive Precedence Drill
- Practice 10 `AND`/`OR`/`NOT` edge cases on `HR.EMPLOYEES` and verify outputs in the Interactive Studio.

---

## Sorting & Row Limiting (`L034`–`L037`)

### `L034` — Sorting with `ORDER BY` (`ASC` / `DESC`)
```sql
SELECT ename, deptno, sal FROM scott.emp ORDER BY deptno ASC, sal DESC;
```

### `L035` — Sorting by Alias, Column Position & `NULLS FIRST/LAST`
```sql
SELECT ename, sal * 12 AS annual_sal, comm
FROM scott.emp
ORDER BY annual_sal DESC, comm NULLS FIRST;
```
- By default in Oracle, **`NULL` sorts LAST in `ASC` and FIRST in `DESC`**.

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

### `L037` — `ONLY` vs. `WITH TIES` & `PERCENT`
```sql
-- Returns 4 rows because SCOTT and FORD tie at 3000!
SELECT ename, sal FROM scott.emp
ORDER BY sal DESC
FETCH FIRST 3 ROWS WITH TIES;
```

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
- When `VERIFY` is `ON`, `sqlplus` prints `old 1:` and `new 1:` lines showing the exact substituted SQL.

### `L040` — Variant A CLI Lab vs. Variant B Simulator
- **Variant A**: Run `L038–L039` directly in `sqlcl`/`sqlplus`.
- **Variant B**: Open the **SQL\*Plus Substitution Simulator** on [GitHub Pages](https://chatelao.github.io/sql-schulung/) to practice `old:`/`new:` trace outputs interactively.

---

## Checkpoint #1 (`L041`–`L042`)

### `L041` — Identical Checkpoint #1 (Assessment)
- Re-take the identical 22-question assessment + 3 SQL tasks on GitHub Pages. Expect Domains 1–2 to jump dramatically!

### `L042` — Progress Comparison & Reflection (`CP-1` vs. `CP-0`)
- Inspect your longitudinal chart on GitHub Pages and record your 4-question reflection log.
