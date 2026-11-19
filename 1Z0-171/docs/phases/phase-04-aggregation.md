# Phase 4: Grouping & Aggregating Data (`L069`–`L082`)

**Exam Domain**: Domain 3 Part 2 (*Aggregate Functions*, ~7% of exam)  
**Schemas Used**: `SCOTT.EMP`, `HR.EMPLOYEES`

---

## Aggregate Functions & `NULL` Traps (`L069`–`L073`)

### `L069` — `SUM`, `AVG`, `MIN`, `MAX`
```sql
SELECT MIN(sal), MAX(sal), ROUND(AVG(sal), 2), SUM(sal) FROM scott.emp;
```
- `MIN` and `MAX` work on numbers, strings, and dates; `SUM` and `AVG` work on numbers only.

### `L070` — `COUNT(*)`, `COUNT(col)` & `COUNT(DISTINCT col)`
```sql
SELECT COUNT(*) AS total_rows,
       COUNT(comm) AS non_null_comms,
       COUNT(DISTINCT job) AS unique_jobs
FROM scott.emp;
-- Results: 14 | 4 | 5
```

### `L071` — Proving the `AVG` + `NULL` Trap on `SCOTT.EMP.COMM`
```sql
-- AVG(comm) = (300 + 500 + 1400 + 0) / 4 = 550
-- AVG(NVL(comm, 0)) = 2200 / 14 = 157.14
SELECT AVG(comm) AS avg_recipients_only,
       ROUND(AVG(NVL(comm, 0)), 2) AS avg_all_staff
FROM scott.emp;
```

### `L072` — Combining Group Functions with Single-Row Columns (`ORA-00937`)
- `SELECT ename, MAX(sal) FROM scott.emp;` fails with `ORA-00937: not a single-group group function` unless you use a `GROUP BY` or subquery.

### `L073` — Aggregate Practice Lab on `HR.EMPLOYEES`

---

## `GROUP BY`, `HAVING` & Nested Aggregates (`L074`–`L078`)

### `L074` — Grouping by a Single Column
```sql
SELECT deptno, COUNT(*) AS headcount, SUM(sal) AS payroll
FROM scott.emp
GROUP BY deptno
ORDER BY deptno;
```

### `L075` — Grouping by Multiple Columns & Fixing `ORA-00979`
```sql
SELECT deptno, job, COUNT(*), SUM(sal)
FROM scott.emp
GROUP BY deptno, job
ORDER BY deptno, job;
```
- **Rule**: Every non-aggregated column in `SELECT` **must** appear in `GROUP BY` (though columns in `GROUP BY` do *not* have to appear in `SELECT`).

### `L076` — `WHERE` vs. `HAVING`
```sql
SELECT deptno, ROUND(AVG(sal), 2) AS avg_sal
FROM scott.emp
WHERE job <> 'PRESIDENT'          -- Filters individual rows BEFORE grouping
GROUP BY deptno
HAVING AVG(sal) > 2000;           -- Filters groups AFTER grouping
```
- **Exam Trap**: You cannot put group functions (`AVG(sal) > 2000`) in `WHERE` (`ORA-00934`).

### `L077` — Nesting Group Functions (Maximum Depth = 2)
```sql
-- Highest departmental average salary:
SELECT MAX(AVG(sal)) FROM scott.emp GROUP BY deptno;
```
- **Exam Trap**: When nesting two group functions, `GROUP BY` is mandatory and **no** unaggregated column (like `deptno`) can be in the `SELECT` list!

### `L078` — Payroll Summary Lab (`HR.EMPLOYEES`)

---

## Consolidation & Checkpoint #2 (`L079`–`L082`)

### `L079` — Consolidation Lab (Functions + Grouping)
- Build formatted summary reports combining `TO_CHAR`, `NVL`, `CASE`, `GROUP BY`, and `HAVING`.

### `L080` — "Human Compiler" Drill #1 (No-IDE Code Reading)
- Complete 15 code-reading questions on [GitHub Pages](https://chatelao.github.io/sql-schulung/) covering Phases 1–4 without executing them in a database first.

### `L081` — Identical Checkpoint #2 (Assessment)
- Re-take the identical 22-question assessment + 3 SQL tasks. Expect a big jump from Domain 3 (25% exam weight)!

### `L082` — Progress Comparison & Reflection (`CP-2` vs. `CP-0..1`)
- Inspect your longitudinal chart on GitHub Pages and log your reflection.
