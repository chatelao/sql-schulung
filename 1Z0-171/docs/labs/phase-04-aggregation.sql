-- ============================================================================
-- Phase 4 Lab Pack (L069-L082): Grouping and Aggregating Data
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TEIL 1: GEFÜHRTE DEMOS
-- ----------------------------------------------------------------------------

-- L069-L071: Aggregate Functions und Nachweis AVG(comm) vs. AVG(NVL(comm, 0))
SELECT COUNT(*) AS total_employees,
       COUNT(comm) AS comm_recipients,
       COUNT(DISTINCT job) AS unique_jobs,
       ROUND(AVG(comm), 2) AS avg_recipients_only,
       ROUND(AVG(NVL(comm, 0)), 2) AS avg_all_staff
FROM scott.emp;

-- L074-L075: GROUP BY mit einer und mehreren Spalten
SELECT deptno, job, COUNT(*) AS headcount, SUM(sal) AS payroll, MIN(sal) AS min_sal, MAX(sal) AS max_sal
FROM scott.emp
GROUP BY deptno, job
ORDER BY deptno, job;

-- L076-L077: WHERE vs. HAVING und Verschachtelte Group Functions
SELECT deptno, ROUND(AVG(sal), 2) AS avg_sal
FROM scott.emp
WHERE job <> 'PRESIDENT'
GROUP BY deptno
HAVING AVG(sal) > 2000
ORDER BY deptno;

SELECT MAX(AVG(sal)) AS highest_dept_avg FROM scott.emp GROUP BY deptno;

-- ----------------------------------------------------------------------------
-- TEIL 2: SELBSTSTÄNDIGE ÜBUNGSAUFGABEN (Lösungen in solutions/phase-04-aggregation-solutions.sql)
-- ----------------------------------------------------------------------------

-- Aufgabe 1 (★): Berechne für jeden job in SCOTT.EMP die Anzahl Mitarbeiter sowie
-- MIN(sal), MAX(sal) und SUM(sal), absteigend sortiert nach SUM(sal).
-- Erwartetes Ergebnis: 5 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 2 (★★): Ermittle in SCOTT.EMP die Abteilungen (deptno), in denen das
-- Durchschnittsgehalt aller Mitarbeiter (ohne CLERKs!) über 2500 liegt.
-- Erwartetes Ergebnis: 2 Zeilen (Dept 10 und Dept 20).
-- TODO: Deine Query hier


-- Aufgabe 3 (★★): Gruppiere SCOTT.EMP nach Einstellungsjahr (TO_CHAR(hiredate, 'YYYY'))
-- und gib Anzahl Einstellungen sowie die gesamte Jahresvergütung SUM(sal + NVL(comm, 0)) aus.
-- Erwartetes Ergebnis: 4 Zeilen (1980, 1981, 1982, 1987).
-- TODO: Deine Query hier


-- Aufgabe 4 (★★): Finde in HR.EMPLOYEES alle manager_id (WHERE manager_id IS NOT NULL),
-- die mindestens 6 Mitarbeiter führen, inkl. deren niedrigstem und höchstem Gehalt.
-- Erwartetes Ergebnis: 8 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 5 (★★★): Finde das kleinste aller Abteilungs-Durchschnittsgehälter in
-- HR.EMPLOYEES (WHERE department_id IS NOT NULL) mittels verschachtelter Aggregation.
-- Erwartetes Ergebnis: 1 Zeile (3475.56).
-- TODO: Deine Query hier
