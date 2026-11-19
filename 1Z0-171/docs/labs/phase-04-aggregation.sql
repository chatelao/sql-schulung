-- ============================================================================
-- Phase 4 Lab Pack (L069-L082): Grouping & Aggregating Data
-- ============================================================================

-- L069-L071: Aggregate Functions & Proving AVG(comm) vs AVG(NVL(comm, 0))
SELECT COUNT(*) AS total_employees,
       COUNT(comm) AS comm_recipients,
       COUNT(DISTINCT job) AS unique_jobs,
       ROUND(AVG(comm), 2) AS avg_recipients_only,
       ROUND(AVG(NVL(comm, 0)), 2) AS avg_all_staff
FROM scott.emp;

-- L074-L075: GROUP BY single & multiple columns
SELECT deptno,
       job,
       COUNT(*) AS headcount,
       SUM(sal) AS payroll,
       MIN(sal) AS min_sal,
       MAX(sal) AS max_sal
FROM scott.emp
GROUP BY deptno, job
ORDER BY deptno, job;

-- L076: WHERE (pre-group) vs HAVING (post-group)
SELECT deptno,
       ROUND(AVG(sal), 2) AS avg_sal
FROM scott.emp
WHERE job <> 'PRESIDENT'
GROUP BY deptno
HAVING AVG(sal) > 2000
ORDER BY deptno;

-- L077: Nested Group Functions (Max Depth = 2, no unaggregated cols in SELECT)
SELECT MAX(AVG(sal)) AS highest_dept_avg
FROM scott.emp
GROUP BY deptno;
