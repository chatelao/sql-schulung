-- ============================================================================
-- Phase 2 Musterlösungen (L021-L042)
-- ============================================================================

-- Aufgabe 1
SELECT ename, deptno
FROM scott.emp
WHERE ename LIKE '_L%' AND deptno IN (10, 30);

-- Aufgabe 2
SELECT employee_id, last_name, hire_date
FROM hr.employees
WHERE hire_date BETWEEN DATE '2005-01-01' AND DATE '2005-12-31'
ORDER BY hire_date;

-- Aufgabe 3
SELECT ename, sal, comm
FROM scott.emp
WHERE (comm IS NULL OR comm = 0) AND sal >= 1500;

-- Aufgabe 4
SELECT ename, comm
FROM scott.emp
ORDER BY comm DESC NULLS LAST, ename ASC;

-- Aufgabe 5
SELECT employee_id, last_name, salary
FROM hr.employees
ORDER BY salary DESC
OFFSET 5 ROWS FETCH NEXT 5 ROWS ONLY;
