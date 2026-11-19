# Phase 5: Displaying Data from Multiple Tables — Joins (`L083`–`L102`)

**Exam Domain**: Domain 4 (*Displaying Data from Multiple Tables*, 10 %)  
**Verwendete Schemas**: `SCOTT` (`EMP`, `DEPT`, `SALGRADE`), `HR` (`EMPLOYEES`, `DEPARTMENTS`, `LOCATIONS`, `COUNTRIES`)

---

## Join Mental Model & `CROSS JOIN` (`L083`–`L085`)

### `L083` — Warum Joins existieren & Row-Matching-Intuition
- Nutze den **Join Visualizer** auf [GitHub Pages](https://chatelao.github.io/sql-schulung/), um zu beobachten, wie jede der 14 Zeilen aus `SCOTT.EMP` ihre passende Zeile in `SCOTT.DEPT` nachschlägt.

### `L084` — Cartesian Products (`CROSS JOIN`)
```sql
-- 14 employees x 4 departments = 56 rows!
SELECT e.ename, d.dname FROM scott.emp e CROSS JOIN scott.dept d;
```

### `L085` — Mehrdeutige Spalten auflösen (`ORA-00918`)
- Sowohl `EMP` als auch `DEPT` besitzen eine Spalte `DEPTNO`. Wird `DEPTNO` ohne Table Alias (`e.deptno`) selektiert, erscheint `ORA-00918: column ambiguously defined`.

---

## `INNER JOIN ... ON`, `NATURAL JOIN` & `USING` (`L086`–`L092`)

### `L086` — Standard `INNER JOIN ... ON`
```sql
SELECT e.empno, e.ename, e.deptno, d.dname, d.loc
FROM scott.emp e
INNER JOIN scott.dept d ON e.deptno = d.deptno;
```
- Hinweis: `DEPT 40 (OPERATIONS)` verschwindet aus dem Ergebnis, weil kein Employee `deptno = 40` hat.

### `L087` — Drei oder mehr Tabellen joinen (`HR`)
```sql
SELECT e.last_name, d.department_name, l.city, c.country_name
FROM hr.employees e
JOIN hr.departments d ON e.department_id = d.department_id
JOIN hr.locations l   ON d.location_id = l.location_id
JOIN hr.countries c   ON l.country_id = c.country_id;
```

### `L088` — `WHERE` & `GROUP BY` mit Joins kombinieren
- Filtere gejointe Zeilen mit `WHERE` (oder zusätzlichem `AND` in `ON`) und gruppiere nach `d.dname`.

### `L089` — `NATURAL JOIN` & seine versteckte Multi-Column-Falle
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

### `L091` — Die `ORA-25154`-Regel (`USING`-Qualifier-Falle)
- **Exam Trap**: Setze vor eine in `USING (...)` aufgeführte Spalte **niemals** einen Tabellennamen oder Alias – weder in `SELECT`, `WHERE`, `GROUP BY` noch in `ORDER BY`! `SELECT e.deptno` bei `USING (deptno)` wirft `ORA-25154`.

### `L092` — Vergleich: `ON`, `USING` und `NATURAL JOIN`
- `ON` erlaubt beliebige Join-Bedingungen und erfordert Table Qualifiers; `USING` verknüpft gleichnamige Spalten ohne Qualifier; `NATURAL JOIN` verknüpft automatisch *alle* namensgleichen Spalten.

---

## Outer Joins (`LEFT`, `RIGHT`, `FULL`) (`L093`–`L096`)

### `L093` — `LEFT OUTER JOIN` (`HR` Unassigned Employees)
```sql
-- Keeps Kimberely Grant (department_id IS NULL)
SELECT e.last_name, d.department_name
FROM hr.employees e
LEFT OUTER JOIN hr.departments d ON e.department_id = d.department_id;
```

### `L094` — `RIGHT OUTER JOIN` (`SCOTT.DEPT` #40 `OPERATIONS` erhalten)
```sql
-- Keeps DEPT 40 OPERATIONS with NULL ename
SELECT e.ename, d.deptno, d.dname
FROM scott.emp e
RIGHT OUTER JOIN scott.dept d ON e.deptno = d.deptno;
```

### `L095` — `FULL OUTER JOIN`
- Bewahrt nicht zugeordnete Zeilen aus **beiden** Tabellen (z. B. Kimberely Grant *und* Departments ohne Employees).

### `L096` — Outer Join `ON`- vs. `WHERE`-Filter-Falle
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
- Durch `LEFT JOIN` bleibt auch `KING` (`mgr IS NULL`) im Ergebnis erhalten!

### `L098` — Non-Equijoin (`SCOTT.EMP` + `SCOTT.SALGRADE`)
```sql
SELECT e.ename, e.sal, s.grade, s.losal, s.hisal
FROM scott.emp e
JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal
ORDER BY s.grade, e.sal;
```

### `L099` — Legacy Oracle `(+)` Join-Syntax erkennen
- Erkenne `(+)` in bestehendem Code: `WHERE e.deptno = d.deptno(+)` entspricht `e LEFT OUTER JOIN d`. (`(+)` darf nicht für einen `FULL` Join auf beiden Seiten stehen.)

### `L100` — Multi-Way Join aus `EMP`, `DEPT`, `MGR` & `SALGRADE`
- Kombiniere Employee-Daten, Department, Manager und Salary Grade in einer einzigen Query.

### `L101`–`L102` — Multi-Table Reporting Lab (`SCOTT` & `HR`)
- Schreibe Berichte zur Grade-Verteilung pro Department und zu Headcounts je Manager.
