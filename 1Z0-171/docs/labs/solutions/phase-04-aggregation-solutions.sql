-- ============================================================================
-- Phase 4 Musterlösungen (L069-L082)
-- ============================================================================

-- Aufgabe 1
SELECT job, COUNT(*) AS cnt, MIN(sal) AS min_sal, MAX(sal) AS max_sal, SUM(sal) AS total_sal
FROM scott.emp
GROUP BY job
ORDER BY total_sal DESC;

-- Aufgabe 2
SELECT deptno, ROUND(AVG(sal), 2) AS avg_sal
FROM scott.emp
WHERE job <> 'CLERK'
GROUP BY deptno
HAVING AVG(sal) > 2500;

-- Aufgabe 3
SELECT TO_CHAR(hiredate, 'YYYY') AS hire_year,
       COUNT(*) AS hires,
       SUM(sal + NVL(comm, 0)) AS total_comp
FROM scott.emp
GROUP BY TO_CHAR(hiredate, 'YYYY')
ORDER BY hire_year;

-- Aufgabe 4
SELECT manager_id, COUNT(*) AS team_size, MIN(salary) AS min_sal, MAX(salary) AS max_sal
FROM hr.employees
WHERE manager_id IS NOT NULL
GROUP BY manager_id
HAVING COUNT(*) >= 6
ORDER BY team_size DESC;

-- Aufgabe 5
SELECT ROUND(MIN(AVG(salary)), 2) AS lowest_dept_avg
FROM hr.employees
WHERE department_id IS NOT NULL
GROUP BY department_id;
