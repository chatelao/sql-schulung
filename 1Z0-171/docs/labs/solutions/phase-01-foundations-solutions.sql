-- ============================================================================
-- Phase 1 Musterlösungen (L001-L020)
-- ============================================================================

-- Aufgabe 1
SELECT job_id, job_title, max_salary - min_salary AS "Salary Spread"
FROM hr.jobs;

-- Aufgabe 2
SELECT 'Dept ' || deptno || ': ' || dname || ' in ' || loc AS dept_info
FROM scott.dept;

-- Aufgabe 3
SELECT DISTINCT department_id, job_id
FROM hr.employees
ORDER BY department_id, job_id;

-- Aufgabe 4
SELECT ename, (sal + 100) * 12 AS new_annual_sal, sal + 100 * 12 AS without_parens
FROM scott.emp;

-- Aufgabe 5
SELECT q'[Employee's Name: ]' || ename || ' | Job: ' || job AS emp_line
FROM scott.emp;
