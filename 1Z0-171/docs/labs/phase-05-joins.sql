-- ============================================================================
-- Phase 5 Lab Pack (L083-L102): Multi-Table Joins, Self-Joins and Non-Equijoins
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TEIL 1: GEFÜHRTE DEMOS
-- ----------------------------------------------------------------------------

-- L084: CROSS JOIN (14 x 4 = 56 Zeilen)
SELECT e.ename, d.dname FROM scott.emp e CROSS JOIN scott.dept d;

-- L086-L087: INNER JOIN ... ON und 4-Table Join in HR
SELECT e.empno, e.ename, e.deptno, d.dname, d.loc
FROM scott.emp e INNER JOIN scott.dept d ON e.deptno = d.deptno ORDER BY e.deptno, e.ename;

SELECT e.last_name, d.department_name, l.city, c.country_name
FROM hr.employees e
JOIN hr.departments d ON e.department_id = d.department_id
JOIN hr.locations l   ON d.location_id = l.location_id
JOIN hr.countries c   ON l.country_id = c.country_id
FETCH FIRST 15 ROWS ONLY;

-- L090-L091: USING (Eine USING-Spalte niemals qualifizieren!)
SELECT empno, ename, deptno, dname FROM scott.emp JOIN scott.dept USING (deptno);

-- L093-L098: Outer Joins, Self-Join und Non-Equijoin
SELECT e.ename, d.deptno, d.dname FROM scott.emp e RIGHT OUTER JOIN scott.dept d ON e.deptno = d.deptno ORDER BY d.deptno;
SELECT e.empno, e.ename AS employee, m.ename AS manager FROM scott.emp e LEFT JOIN scott.emp m ON e.mgr = m.empno ORDER BY e.empno;
SELECT e.ename, e.sal, s.grade, s.losal, s.hisal FROM scott.emp e JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal ORDER BY s.grade, e.sal;

-- ----------------------------------------------------------------------------
-- TEIL 2: SELBSTSTÄNDIGE ÜBUNGSAUFGABEN (Lösungen in solutions/phase-05-joins-solutions.sql)
-- ----------------------------------------------------------------------------

-- Aufgabe 1 (★): Zeige für jeden Mitarbeiter in SCOTT.EMP seinen Namen, seine
-- Abteilung (dname) und seinen Salary Grade (salgrade.grade) an.
-- Erwartetes Ergebnis: 14 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 2 (★★): Liste alle 4 Abteilungen in SCOTT.DEPT mit der Anzahl ihrer
-- Mitarbeiter auf — DEPT 40 (OPERATIONS) muss mit 0 erscheinen!
-- Erwartetes Ergebnis: 4 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 3 (★★): Finde alle Mitarbeiter in SCOTT.EMP, die MEHR verdienen als ihr
-- direkter Manager (Self-Join e.mgr = m.empno).
-- Erwartetes Ergebnis: 2 Zeilen (SCOTT und FORD verdienen 3000 > JONES 2975).
-- TODO: Deine Query hier


-- Aufgabe 4 (★★): Teste die ON- vs. WHERE-Falle: Liste ALLE 4 Abteilungen aus
-- SCOTT.DEPT auf und joine nur Mitarbeiter mit job = 'CLERK' (Filter in ON!).
-- Erwartetes Ergebnis: 7 Zeilen (inkl. DEPT 40 OPERATIONS mit NULL).
-- TODO: Deine Query hier


-- Aufgabe 5 (★★★): Liste alle 27 Abteilungen aus HR.DEPARTMENTS mit Abteilungsname,
-- Stadt (HR.LOCATIONS) und Mitarbeiteranzahl auf (inkl. leerer Abteilungen!).
-- Erwartetes Ergebnis: 27 Zeilen.
-- TODO: Deine Query hier
