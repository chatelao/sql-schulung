-- ============================================================================
-- Phase 6 Lab Pack (L103-L122): Subqueries & SET Operators
-- ============================================================================

-- L103: Single-row subquery
SELECT ename, sal
FROM scott.emp
WHERE sal > (SELECT sal FROM scott.emp WHERE ename = 'JONES');

-- L104: Subquery in HAVING
SELECT deptno, MIN(sal)
FROM scott.emp
GROUP BY deptno
HAVING MIN(sal) > (SELECT MIN(sal) FROM scott.emp WHERE deptno = 30);

-- L108-L110: Multi-row subqueries & Proving NOT IN + NULL Trap!
SELECT ename, sal
FROM scott.emp
WHERE sal > ALL (SELECT sal FROM scott.emp WHERE job = 'SALESMAN');

-- Returns 0 rows because KING has mgr = NULL:
SELECT ename FROM scott.emp WHERE empno NOT IN (SELECT mgr FROM scott.emp);

-- Fixed (returns 8 non-managers):
SELECT ename FROM scott.emp WHERE empno NOT IN (SELECT mgr FROM scott.emp WHERE mgr IS NOT NULL);

-- L113-L116: Inline Views, Correlated Subqueries & NOT EXISTS
SELECT e.ename, e.sal, e.deptno
FROM scott.emp e
WHERE e.sal > (SELECT AVG(i.sal) FROM scott.emp i WHERE i.deptno = e.deptno);

SELECT d.deptno, d.dname
FROM scott.dept d
WHERE NOT EXISTS (SELECT 1 FROM scott.emp e WHERE e.deptno = d.deptno);

-- L117-L119: SET Operators (UNION, UNION ALL, INTERSECT, MINUS)
SELECT deptno FROM scott.dept
MINUS
SELECT deptno FROM scott.emp;

SELECT employee_id, job_id FROM hr.employees
INTERSECT
SELECT employee_id, job_id FROM hr.job_history;
