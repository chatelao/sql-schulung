-- ============================================================================
-- Phase 1 Lab Pack (L001-L020): Relational Foundations & Basic SELECT
-- Compatible with Oracle FreeSQL (My Content -> Upload Script) & SQLcl/SQL*Plus
-- ============================================================================

-- L010: Inspect SCOTT schema tables
SELECT * FROM scott.dept;
SELECT * FROM scott.emp;
SELECT * FROM scott.salgrade;

-- L012: Scale up to HR.EMPLOYEES
SELECT employee_id, first_name, last_name, salary
FROM hr.employees
FETCH FIRST 10 ROWS ONLY;

-- L013-L015: Projections, Arithmetic & Operator Precedence
SELECT ename,
       sal,
       sal * 12 AS annual_sal,
       (sal + 200) * 12 AS adjusted_annual
FROM scott.emp;

-- L016: Golden Rule of NULL in Arithmetic (Notice TURNER vs SMITH!)
SELECT ename, sal, comm, sal + comm AS total_pay
FROM scott.emp;

-- L017: Column Aliases (AS vs "Double Quotes")
SELECT ename AS employee_name,
       sal * 12 "Annual Salary"
FROM scott.emp;

-- L018: Concatenation (||), Literals & Alternative Quote Operator q'[...]'
SELECT ename || ' works as a ' || job AS summary
FROM scott.emp;

SELECT q'[Department's Name: ]' || dname AS dept_label
FROM scott.dept;

-- L019: Eliminating Duplicates with DISTINCT
SELECT DISTINCT deptno FROM scott.emp;
SELECT DISTINCT deptno, job FROM scott.emp ORDER BY deptno, job;

-- L020: DUAL Table
SELECT 24 * 60 AS mins_per_day, SYSDATE AS today FROM dual;
