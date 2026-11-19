# Phase 6: Subqueries & Compound Queries (`L103`–`L122`)

**Exam Domains**: Domain 5 (*Using Subqueries*, 5%) + Domain 6 (*Using SET Operators*, 5%)  
**Schemas Used**: `SCOTT.EMP`, `SCOTT.DEPT`, `HR.EMPLOYEES`, `HR.JOB_HISTORY`

---

## Single-Row Subqueries (`L103`–`L107`)

### `L103` — What Is a Subquery? ("Who Earns More Than `JONES`?")
```sql
SELECT ename, sal
FROM scott.emp
WHERE sal > (SELECT sal FROM scott.emp WHERE ename = 'JONES');
```

### `L104` — Subqueries in `HAVING` and Scalar Subqueries in `SELECT`
```sql
-- Departments whose minimum salary exceeds Dept 30's minimum salary
SELECT deptno, MIN(sal)
FROM scott.emp
GROUP BY deptno
HAVING MIN(sal) > (SELECT MIN(sal) FROM scott.emp WHERE deptno = 30);
```

### `L105` — The `ORA-01427` Error (Single-Row Operator, Multi-Row Result)
- Using `=` or `>` with a subquery returning 2+ rows raises `ORA-01427: single-row subquery returns more than one row`.

### `L106` — Empty Subquery Behavior (Returns `NULL`)
- If the inner query returns 0 rows (`WHERE ename = 'NOBODY'`), the outer `WHERE sal > (SELECT ...)` evaluates `sal > NULL` -> returns 0 rows cleanly (no error!).

### `L107` — Single-Row Subquery Practice Lab

---

## Multi-Row Subqueries & The `NOT IN` + `NULL` Trap (`L108`–`L112`)

### `L108` — `IN`, `ANY`, and `ALL` Operators
```sql
-- > ANY means greater than the MINIMUM; > ALL means greater than the MAXIMUM
SELECT ename, sal FROM scott.emp
WHERE sal > ALL (SELECT sal FROM scott.emp WHERE job = 'SALESMAN');
```

### `L109` — Proving the `NOT IN` + `NULL` Trap on `SCOTT.EMP`
```sql
-- TRAP: Returns 0 rows because KING has mgr = NULL!
SELECT ename FROM scott.emp
WHERE empno NOT IN (SELECT mgr FROM scott.emp);

-- FIX: Filter out NULLs inside the subquery!
SELECT ename FROM scott.emp
WHERE empno NOT IN (SELECT mgr FROM scott.emp WHERE mgr IS NOT NULL);
```

### `L110` — Why `IN` Works with `NULL` While `NOT IN` Fails
- `x IN (7839, NULL)` is `(x = 7839) OR (x = NULL)` -> `TRUE OR UNKNOWN` = `TRUE`.
- `x NOT IN (7839, NULL)` is `(x <> 7839) AND (x <> NULL)` -> `TRUE AND UNKNOWN` = `UNKNOWN`!

### `L111`–`L112` — Multi-Row Subquery Drills (`HR.EMPLOYEES`)

---

## Inline Views, Multi-Column & Correlated Subqueries (`L113`–`L116`)

### `L113` — Inline Views (Subqueries in `FROM`) & `WITH` Factoring
```sql
SELECT e.ename, e.sal, d.avg_sal
FROM scott.emp e
JOIN (SELECT deptno, ROUND(AVG(sal), 2) AS avg_sal
      FROM scott.emp GROUP BY deptno) d
  ON e.deptno = d.deptno
WHERE e.sal > d.avg_sal;
```

### `L114` — Pairwise vs. Non-Pairwise Multi-Column Subqueries
```sql
-- Pairwise: exact (job, deptno) tuple match
SELECT ename, job, deptno FROM scott.emp
WHERE (job, deptno) IN (SELECT job, deptno FROM scott.emp WHERE sal > 2900);
```

### `L115` — Correlated Subqueries
- Runs once per outer candidate row:
  ```sql
  SELECT e.ename, e.sal, e.deptno FROM scott.emp e
  WHERE e.sal > (SELECT AVG(sal) FROM scott.emp i WHERE i.deptno = e.deptno);
  ```

### `L116` — `EXISTS` and `NOT EXISTS` (Null-Safe!)
```sql
-- Departments with NO employees (returns DEPT 40 OPERATIONS cleanly!)
SELECT d.deptno, d.dname FROM scott.dept d
WHERE NOT EXISTS (SELECT 1 FROM scott.emp e WHERE e.deptno = d.deptno);
```

---

## `SET` Operators (`L117`–`L120`)

### `L117` — `UNION` vs. `UNION ALL`
- `UNION` sorts and eliminates duplicate rows; `UNION ALL` appends rows as-is and is faster.

### `L118` — `INTERSECT` & `MINUS` (`EXCEPT` in 23ai)
```sql
-- Employees who have changed jobs in HR
SELECT employee_id, job_id FROM hr.employees
INTERSECT
SELECT employee_id, job_id FROM hr.job_history;
```

### `L119` — Column Matching, Dummy Columns & `ORDER BY` Placement
- Every `SELECT` must have the **same number of columns** and **compatible data types** (`TO_CHAR(NULL)` or `TO_NUMBER(NULL)` for placeholders).
- Output column headings come from the **first `SELECT`**; `ORDER BY` can only appear **once at the very end**.

### `L120` — Compound Query Lab (`HR.EMPLOYEES` + `HR.JOB_HISTORY`)

---

## Checkpoint #3 (`L121`–`L122`)

### `L121` — Identical Checkpoint #3 (Assessment)
- Target milestone: **65–72%** overall (crossing the official passing score for the first time!).

### `L122` — Progress Comparison & Reflection (`CP-3` vs. `CP-0..2`)
