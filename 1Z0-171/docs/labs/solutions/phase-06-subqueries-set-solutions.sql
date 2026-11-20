-- ============================================================================
-- Phase 6 Musterlösungen (L103-L122)
-- ============================================================================

-- Aufgabe 1
SELECT ename, job, sal
FROM scott.emp
WHERE job = (SELECT job FROM scott.emp WHERE ename = 'ALLEN')
  AND sal > (SELECT sal FROM scott.emp WHERE ename = 'WARD');

-- Aufgabe 2
SELECT d.department_id, d.department_name
FROM hr.departments d
WHERE NOT EXISTS (
  SELECT 1 FROM hr.employees e WHERE e.department_id = d.department_id
);

-- Aufgabe 3
SELECT e.employee_id, e.last_name, e.department_id, e.salary, ROUND(d.avg_sal, 2) AS dept_avg
FROM hr.employees e
JOIN (
  SELECT department_id, AVG(salary) AS avg_sal
  FROM hr.employees
  GROUP BY department_id
) d ON e.department_id = d.department_id
WHERE e.salary > d.avg_sal
ORDER BY e.department_id, e.salary DESC;

-- Aufgabe 4
SELECT employee_id FROM hr.employees
MINUS
SELECT employee_id FROM hr.job_history
ORDER BY employee_id;

-- Aufgabe 5
SELECT dname AS label, 'DEPT' AS category, deptno AS sort_num
FROM scott.dept
UNION ALL
SELECT DISTINCT job, 'JOB', TO_NUMBER(NULL)
FROM scott.emp
ORDER BY category, label;
