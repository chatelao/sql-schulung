-- ============================================================================
-- Phase 1 Lab Pack (L001-L020): Relational Foundations and Basic SELECT
-- Kompatibel mit Oracle FreeSQL (My Content -> Upload Script) und SQLcl/SQL*Plus
-- ============================================================================

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

-- L017: Column Aliases (AS vs. "Double Quotes")
SELECT ename AS employee_name,
       sal * 12 "Annual Salary"
FROM scott.emp;

-- L018: Concatenation (||), Literals and Alternative Quote Operator q'[...]'
SELECT ename || ' works as a ' || job AS summary
FROM scott.emp;

SELECT q'[Department's Name: ]' || dname AS dept_label
FROM scott.dept;

-- L019: Duplikate entfernen mit DISTINCT
SELECT DISTINCT deptno FROM scott.emp;
SELECT DISTINCT deptno, job FROM scott.emp ORDER BY deptno, job;

-- L020: DUAL-Tabelle
SELECT 24 * 60 AS mins_per_day, SYSDATE AS today FROM dual;
