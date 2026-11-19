-- ============================================================================
-- Phase 10 Lab Pack (L179-L200): Gold Standard Benchmark and Exam Trap Checks
-- ============================================================================

-- Gold Standard Task 1: SCOTT Join + Salgrade + Null-Safe Compensation
SELECT d.dname,
       COUNT(e.empno) AS headcount,
       ROUND(AVG(e.sal + NVL(e.comm, 0)), 2) AS avg_total_comp
FROM scott.dept d
JOIN scott.emp e ON d.deptno = e.deptno
JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal
GROUP BY d.dname
HAVING COUNT(e.empno) >= 2
ORDER BY avg_total_comp DESC;

-- Gold Standard Task 2: Correlated Subquery (über dem Department-Durchschnitt)
SELECT e.empno, e.ename, e.deptno, e.sal
FROM scott.emp e
WHERE e.sal > (
  SELECT AVG(i.sal)
  FROM scott.emp i
  WHERE i.deptno = e.deptno
)
ORDER BY e.deptno, e.sal DESC;

-- Gold Standard Task 3: Exam Trap Verification (Nested Aggregates and WITH TIES)
SELECT MAX(AVG(sal)) AS max_dept_avg FROM scott.emp GROUP BY deptno;

SELECT ename, sal
FROM scott.emp
ORDER BY sal DESC
FETCH FIRST 2 ROWS WITH TIES;
