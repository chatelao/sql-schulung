-- ============================================================================
-- Phase 6 Lab Pack (L103-L122): Subqueries and SET Operators
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TEIL 1: GEFÜHRTE DEMOS
-- ----------------------------------------------------------------------------

-- L103-L104: Single-Row Subquery und Subquery in HAVING
SELECT ename, sal FROM scott.emp
WHERE sal > (SELECT sal FROM scott.emp WHERE ename = 'JONES');

SELECT deptno, MIN(sal) FROM scott.emp
GROUP BY deptno
HAVING MIN(sal) > (SELECT MIN(sal) FROM scott.emp WHERE deptno = 30);

-- L108-L110: Multi-Row Subqueries und Nachweis der NOT IN + NULL-Falle!
SELECT ename, sal FROM scott.emp
WHERE sal > ALL (SELECT sal FROM scott.emp WHERE job = 'SALESMAN');

-- Liefert 0 Zeilen, weil KING mgr = NULL hat:
SELECT ename FROM scott.emp WHERE empno NOT IN (SELECT mgr FROM scott.emp);

-- Korrigiert (liefert 8 Nicht-Manager):
SELECT ename FROM scott.emp WHERE empno NOT IN (SELECT mgr FROM scott.emp WHERE mgr IS NOT NULL);

-- L113-L116: Correlated Subquery und NOT EXISTS
SELECT e.ename, e.sal, e.deptno FROM scott.emp e
WHERE e.sal > (SELECT AVG(i.sal) FROM scott.emp i WHERE i.deptno = e.deptno);

SELECT d.deptno, d.dname FROM scott.dept d
WHERE NOT EXISTS (SELECT 1 FROM scott.emp e WHERE e.deptno = d.deptno);

-- L117-L119: SET Operators
SELECT deptno FROM scott.dept MINUS SELECT deptno FROM scott.emp;
SELECT employee_id, job_id FROM hr.employees INTERSECT SELECT employee_id, job_id FROM hr.job_history;

-- ----------------------------------------------------------------------------
-- TEIL 2: SELBSTSTÄNDIGE ÜBUNGSAUFGABEN (Lösungen in solutions/phase-06-subqueries-set-solutions.sql)
-- ----------------------------------------------------------------------------

-- Aufgabe 1 (★): Finde alle Mitarbeiter in SCOTT.EMP, die denselben Job wie
-- ALLEN haben, aber mehr als WARD verdienen.
-- Erwartetes Ergebnis: 2 Zeilen (ALLEN, TURNER).
-- TODO: Deine Query hier


-- Aufgabe 2 (★★): Finde alle Abteilungen in HR.DEPARTMENTS, die KEINE Mitarbeiter
-- in HR.EMPLOYEES haben — mittels NOT EXISTS.
-- Erwartetes Ergebnis: 16 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 3 (★★): Finde per Inline View (Subquery in FROM) alle Mitarbeiter in
-- HR.EMPLOYEES, die über dem Durchschnittsgehalt ihrer eigenen Abteilung liegen.
-- Erwartetes Ergebnis: 38 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 4 (★★): Finde alle employee_id in HR.EMPLOYEES, die KEINEN Eintrag
-- in HR.JOB_HISTORY haben (mit MINUS, sortiert nach employee_id).
-- Erwartetes Ergebnis: 100 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 5 (★★★): Kombiniere mit UNION ALL: alle Abteilungsnamen aus SCOTT.DEPT
-- (Spalte label, Typ 'DEPT') und alle Job-Namen (DISTINCT job) aus SCOTT.EMP
-- (Spalte label, Typ 'JOB'), inklusive Platzhalter-Spalte und ORDER BY ganz am Ende.
-- Erwartetes Ergebnis: 9 Zeilen (4 Depts + 5 Jobs).
-- TODO: Deine Query hier
