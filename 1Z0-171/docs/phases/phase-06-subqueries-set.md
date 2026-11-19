# Phase 6: Subqueries & Compound Queries (`L103`–`L122`)

**Exam Domains**: Domain 5 (*Using Subqueries*, 5 %) + Domain 6 (*Using SET Operators*, 5 %)  
**Verwendete Schemas**: `SCOTT.EMP`, `SCOTT.DEPT`, `HR.EMPLOYEES`, `HR.JOB_HISTORY`

---

## Single-Row Subqueries (`L103`–`L107`)

### `L103` — Was ist eine Subquery? ("Wer verdient mehr als `JONES`?")
```sql
SELECT ename, sal
FROM scott.emp
WHERE sal > (SELECT sal FROM scott.emp WHERE ename = 'JONES');
```

### `L104` — Subqueries in `HAVING` und Scalar Subqueries in `SELECT`
```sql
-- Departments whose minimum salary exceeds Dept 30's minimum salary
SELECT deptno, MIN(sal)
FROM scott.emp
GROUP BY deptno
HAVING MIN(sal) > (SELECT MIN(sal) FROM scott.emp WHERE deptno = 30);
```

### `L105` — Der `ORA-01427`-Fehler (Single-Row Operator, Multi-Row Result)
- Wird `=` oder `>` mit einer Subquery verwendet, die 2 oder mehr Zeilen zurückgibt, erscheint `ORA-01427: single-row subquery returns more than one row`.

### `L106` — Verhalten leerer Subqueries (liefert `NULL`)
- Gibt die innere Query 0 Zeilen zurück (`WHERE ename = 'NOBODY'`), wertet das äußere `WHERE sal > (SELECT ...)` zu `sal > NULL` aus -> liefert sauber 0 Zeilen (kein Fehler!).

### `L107` — Single-Row Subquery Practice Lab
- Finde alle Employees, die denselben Job wie `SCOTT` haben, aber weniger verdienen als `BLAKE`.

---

## Multi-Row Subqueries & die `NOT IN` + `NULL`-Falle (`L108`–`L112`)

### `L108` — `IN`, `ANY` und `ALL` Operators
```sql
-- > ANY means greater than the MINIMUM; > ALL means greater than the MAXIMUM
SELECT ename, sal FROM scott.emp
WHERE sal > ALL (SELECT sal FROM scott.emp WHERE job = 'SALESMAN');
```

### `L109` — Die `NOT IN` + `NULL`-Falle auf `SCOTT.EMP` beweisen
```sql
-- TRAP: Returns 0 rows because KING has mgr = NULL!
SELECT ename FROM scott.emp
WHERE empno NOT IN (SELECT mgr FROM scott.emp);

-- FIX: Filter out NULLs inside the subquery!
SELECT ename FROM scott.emp
WHERE empno NOT IN (SELECT mgr FROM scott.emp WHERE mgr IS NOT NULL);
```

### `L110` — Warum `IN` mit `NULL` funktioniert, `NOT IN` aber scheitert
- `x IN (7839, NULL)` entspricht `(x = 7839) OR (x = NULL)` -> `TRUE OR UNKNOWN` = `TRUE`.
- `x NOT IN (7839, NULL)` entspricht `(x <> 7839) AND (x <> NULL)` -> `TRUE AND UNKNOWN` = `UNKNOWN`!

### `L111`–`L112` — Multi-Row Subquery Drills (`HR.EMPLOYEES`)
- Trainiere `< ANY`, `> ALL` und Null-sicheres `NOT IN` auf Gehälter und Manager-IDs in `HR.EMPLOYEES`.

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
- Wird einmal pro äußerer Kandidatenzeile ausgeführt:
  ```sql
  SELECT e.ename, e.sal, e.deptno FROM scott.emp e
  WHERE e.sal > (SELECT AVG(sal) FROM scott.emp i WHERE i.deptno = e.deptno);
  ```

### `L116` — `EXISTS` und `NOT EXISTS` (Null-Safe!)
```sql
-- Departments with NO employees (returns DEPT 40 OPERATIONS cleanly!)
SELECT d.deptno, d.dname FROM scott.dept d
WHERE NOT EXISTS (SELECT 1 FROM scott.emp e WHERE e.deptno = d.deptno);
```

---

## `SET` Operators (`L117`–`L120`)

### `L117` — `UNION` vs. `UNION ALL`
- `UNION` sortiert und entfernt doppelte Zeilen; `UNION ALL` hängt Zeilen unverändert an und ist schneller.

### `L118` — `INTERSECT` & `MINUS` (`EXCEPT` in 23ai)
```sql
-- Employees who have changed jobs in HR
SELECT employee_id, job_id FROM hr.employees
INTERSECT
SELECT employee_id, job_id FROM hr.job_history;
```

### `L119` — Spaltenabgleich, Dummy Columns & `ORDER BY`-Platzierung
- Jedes `SELECT` muss die **gleiche Anzahl an Spalten** und **kompatible Datentypen** haben (`TO_CHAR(NULL)` oder `TO_NUMBER(NULL)` als Platzhalter).
- Spaltenüberschriften stammen vom **ersten `SELECT`**; `ORDER BY` darf nur **einmal ganz am Ende** stehen.

### `L120` — Compound Query Lab (`HR.EMPLOYEES` + `HR.JOB_HISTORY`)
- Kombiniere aktuelle Jobs und Job-Historie mit `UNION ALL`, `INTERSECT` und `MINUS`.

---

## Checkpoint #3 (`L121`–`L122`)

### `L121` — Identical Checkpoint #3 (Assessment)
- Ziel-Meilenstein: **65–72 %** gesamt (erstmaliges Überschreiten der offiziellen Bestehensgrenze!).

### `L122` — Fortschrittsvergleich & Reflexion (`CP-3` vs. `CP-0..2`)
- Analysiere dein Verlaufsdiagramm auf GitHub Pages und protokolliere deinen Lernfortschritt.
