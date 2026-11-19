# Phase 5: Displaying Data from Multiple Tables — Joins (`L083`–`L102`)

**Exam Domain**: Domain 4 (*Displaying Data from Multiple Tables*, 10%)  
**Schemas Used**: `SCOTT` (`EMP`, `DEPT`, `SALGRADE`), `HR` (`EMPLOYEES`, `DEPARTMENTS`, `LOCATIONS`, `COUNTRIES`)

---

## Join Mental Model & `CROSS JOIN` (`L083`–`L085`)

### `L083` — Why Joins Exist & Row-Matching Intuition
- Use the **Join Visualizer** on [GitHub Pages](https://chatelao.github.io/sql-schulung/) to watch each of the 14 rows in `SCOTT.EMP` look up its matching row in `SCOTT.DEPT`.

### `L084` — Cartesian Products (`CROSS JOIN`)
```sql
-- 14 employees x 4 departments = 56 rows!
SELECT e.ename, d.dname FROM scott.emp e CROSS JOIN scott.dept d;
```

### `L085` — Resolving Ambiguous Columns (`ORA-00918`)
- Both `EMP` and `DEPT` have a `DEPTNO` column. Selecting `DEPTNO` without a table alias (`e.deptno`) fails with `ORA-00918: column ambiguously defined`.

---

## `INNER JOIN ... ON`, `NATURAL JOIN` & `USING` (`L086`–`L092`)

### `L086` — Standard `INNER JOIN ... ON`
```sql
SELECT e.empno, e.ename, e.deptno, d.dname, d.loc
FROM scott.emp e
INNER JOIN scott.dept d ON e.deptno = d.deptno;
```
- Note: `DEPT 40 (OPERATIONS)` disappears because no employee has `deptno = 40`.

### `L087` — Joining Three or More Tables (`HR`)
```sql
SELECT e.last_name, d.department_name, l.city, c.country_name
FROM hr.employees e
JOIN hr.departments d ON e.department_id = d.department_id
JOIN hr.locations l   ON d.location_id = l.location_id
JOIN hr.countries c   ON l.country_id = c.country_id;
```

### `L088` — Adding `WHERE` & `GROUP BY` to Joins
- Filter joined rows with `WHERE` (or extra `AND` in `ON`) and group by `d.dname`.

### `L089` — `NATURAL JOIN` & Its Hidden Multi-Column Trap
```sql
-- Works cleanly on SCOTT (only DEPTNO matches):
SELECT empno, ename, dname FROM scott.emp NATURAL JOIN scott.dept;

-- TRAP ON HR: Both DEPARTMENT_ID and MANAGER_ID match between EMPLOYEES and DEPARTMENTS!
SELECT employee_id, last_name, department_name
FROM hr.employees NATURAL JOIN hr.departments;
```

### `L090` — `JOIN ... USING (col)`
```sql
SELECT e.ename, deptno, d.dname
FROM scott.emp e
JOIN scott.dept d USING (deptno);
```

### `L091` — The `ORA-25154` Rule (`USING` Qualifier Trap)
- **Exam Trap**: Never prefix a column listed inside `USING (...)` with a table name or alias anywhere in `SELECT`, `WHERE`, `GROUP BY`, or `ORDER BY`! Writing `SELECT e.deptno` with `USING (deptno)` throws `ORA-25154`.

### `L092` — Comparing `ON`, `USING`, and `NATURAL JOIN`

---

## Outer Joins (`LEFT`, `RIGHT`, `FULL`) (`L093`–`L096`)

### `L093` — `LEFT OUTER JOIN` (`HR` Unassigned Employees)
```sql
-- Keeps Kimberely Grant (department_id IS NULL)
SELECT e.last_name, d.department_name
FROM hr.employees e
LEFT OUTER JOIN hr.departments d ON e.department_id = d.department_id;
```

### `L094` — `RIGHT OUTER JOIN` (Preserving `SCOTT.DEPT` #40 `OPERATIONS`)
```sql
-- Keeps DEPT 40 OPERATIONS with NULL ename
SELECT e.ename, d.deptno, d.dname
FROM scott.emp e
RIGHT OUTER JOIN scott.dept d ON e.deptno = d.deptno;
```

### `L095` — `FULL OUTER JOIN`
- Preserves unmatched rows from **both** tables (e.g., Kimberely Grant *and* departments with 0 employees).

### `L096` — Outer Join `ON` vs. `WHERE` Filter Pitfall
```sql
-- RIGHT: Keeps all 4 departments, only joins CLERK employees
SELECT d.dname, e.ename
FROM scott.emp e
RIGHT JOIN scott.dept d ON e.deptno = d.deptno AND e.job = 'CLERK';

-- TRAP: Filtering e.job = 'CLERK' in WHERE eliminates DEPT 40 (where e.job is NULL)!
```

---

## Self-Joins, Non-Equijoins & Reporting (`L097`–`L102`)

### `L097` — Self-Join (`EMP` -> `MGR`)
```sql
SELECT e.ename AS employee, m.ename AS manager
FROM scott.emp e
LEFT JOIN scott.emp m ON e.mgr = m.empno;
```
- Using `LEFT JOIN` ensures `KING` (`mgr IS NULL`) stays in the output!

### `L098` — Non-Equijoin (`SCOTT.EMP` + `SCOTT.SALGRADE`)
```sql
SELECT e.ename, e.sal, s.grade, s.losal, s.hisal
FROM scott.emp e
JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal
ORDER BY s.grade, e.sal;
```

### `L099` — Legacy Oracle `(+)` Join Syntax Awareness
- Recognize `(+)`: `WHERE e.deptno = d.deptno(+)` means `e LEFT OUTER JOIN d`. (`(+)` cannot appear on both sides for a `FULL` join).

### `L100` — Multi-Way Join Combining `EMP`, `DEPT`, `MGR` & `SALGRADE`

### `L101`–`L102` — Multi-Table Reporting Lab (`SCOTT` & `HR`)
- Write departmental grade distribution and manager headcount reports.
