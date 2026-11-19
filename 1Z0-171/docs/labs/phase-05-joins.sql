-- ============================================================================
-- Phase 5 Lab Pack (L083-L102): Multi-Table Joins, Self-Joins & Non-Equijoins
-- ============================================================================

-- L084: CROSS JOIN (14 x 4 = 56 rows)
SELECT e.ename, d.dname
FROM scott.emp e
CROSS JOIN scott.dept d;

-- L086: INNER JOIN ... ON (Notice DEPT 40 OPERATIONS is omitted)
SELECT e.empno, e.ename, e.deptno, d.dname, d.loc
FROM scott.emp e
INNER JOIN scott.dept d ON e.deptno = d.deptno
ORDER BY e.deptno, e.ename;

-- L087: 4-Table Join in HR
SELECT e.last_name, d.department_name, l.city, c.country_name
FROM hr.employees e
JOIN hr.departments d ON e.department_id = d.department_id
JOIN hr.locations l   ON d.location_id = l.location_id
JOIN hr.countries c   ON l.country_id = c.country_id
FETCH FIRST 15 ROWS ONLY;

-- L089-L091: NATURAL JOIN & USING (Never qualify a USING column!)
SELECT empno, ename, deptno, dname
FROM scott.emp
JOIN scott.dept USING (deptno);

-- L093-L095: Outer Joins (Preserving DEPT 40 OPERATIONS and HR Kimberely Grant)
SELECT e.ename, d.deptno, d.dname
FROM scott.emp e
RIGHT OUTER JOIN scott.dept d ON e.deptno = d.deptno
ORDER BY d.deptno;

SELECT e.last_name, d.department_name
FROM hr.employees e
LEFT OUTER JOIN hr.departments d ON e.department_id = d.department_id
WHERE e.department_id IS NULL;

-- L097: Self-Join (Keeping KING with LEFT JOIN)
SELECT e.empno, e.ename AS employee, m.ename AS manager
FROM scott.emp e
LEFT JOIN scott.emp m ON e.mgr = m.empno
ORDER BY e.empno;

-- L098: Non-Equijoin with SCOTT.SALGRADE
SELECT e.ename, e.sal, s.grade, s.losal, s.hisal
FROM scott.emp e
JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal
ORDER BY s.grade, e.sal;
