-- ============================================================================
-- Phase 1 Lab Pack (L001-L020): Relational Foundations und Basic SELECT
-- Kompatibel mit Oracle FreeSQL (My Content -> Upload Script) und SQLcl/SQL*Plus
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TEIL 1: GEFÜHRTE DEMOS
-- ----------------------------------------------------------------------------

-- L010: SCOTT-Schema-Tabellen inspizieren
SELECT * FROM scott.dept;
SELECT * FROM scott.emp;
SELECT * FROM scott.salgrade;

-- L012: Einstieg in HR.EMPLOYEES
SELECT employee_id, first_name, last_name, salary
FROM hr.employees
FETCH FIRST 10 ROWS ONLY;

-- L013-L015: Projections, Arithmetik und Operator Precedence
SELECT ename,
       sal,
       sal * 12 AS annual_sal,
       (sal + 200) * 12 AS adjusted_annual
FROM scott.emp;

-- L016: Goldene Regel von NULL in der Arithmetik (Achte auf TURNER vs. SMITH!)
SELECT ename, sal, comm, sal + comm AS total_pay
FROM scott.emp;

-- L017-L019: Aliases, Concatenation (||), q'[...]' und DISTINCT
SELECT ename AS employee_name, sal * 12 "Annual Salary" FROM scott.emp;
SELECT q'[Department's Name: ]' || dname AS dept_label FROM scott.dept;
SELECT DISTINCT deptno, job FROM scott.emp ORDER BY deptno, job;

-- L020: DUAL-Tabelle
SELECT 24 * 60 AS mins_per_day, SYSDATE AS today FROM dual;

-- ----------------------------------------------------------------------------
-- TEIL 2: SELBSTSTÄNDIGE ÜBUNGSAUFGABEN (Lösungen in solutions/phase-01-foundations-solutions.sql)
-- ----------------------------------------------------------------------------

-- Aufgabe 1 (★): Gib aus HR.JOBS die Spalten job_id, job_title und die Gehaltsspanne
-- (max_salary - min_salary) mit dem Alias "Salary Spread" aus.
-- Erwartetes Ergebnis: 19 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 2 (★): Erzeuge für alle 4 Abteilungen in SCOTT.DEPT einen Text wie
-- 'Dept 10: ACCOUNTING in NEW YORK' mit Spaltenalias dept_info.
-- Erwartetes Ergebnis: 4 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 3 (★★): Liste alle eindeutigen Kombinationen aus department_id und job_id
-- in HR.EMPLOYEES auf, sortiert nach department_id, job_id.
-- Erwartetes Ergebnis: 20 Zeilen (inkl. einer Zeile mit NULL department_id).
-- TODO: Deine Query hier


-- Aufgabe 4 (★★): Berechne für SCOTT.EMP (sal + 100) * 12 mit Alias new_annual_sal
-- und vergleiche mit sal + 100 * 12.
-- Erwartetes Ergebnis: 14 Zeilen (bei SMITH: 10800 vs. 2000).
-- TODO: Deine Query hier


-- Aufgabe 5 (★★★): Erzeuge mit dem Alternative Quote Operator q'[...]' für jeden
-- Mitarbeiter in SCOTT.EMP den Satz: Employee's Name: SMITH | Job: CLERK
-- Erwartetes Ergebnis: 14 Zeilen.
-- TODO: Deine Query hier
