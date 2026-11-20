-- ============================================================================
-- Phase 5 Musterlösungen (L083-L102)
-- ============================================================================

-- Aufgabe 1
SELECT e.ename, d.dname, e.sal, s.grade
FROM scott.emp e
JOIN scott.dept d ON e.deptno = d.deptno
JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal
ORDER BY s.grade, e.ename;

-- Aufgabe 2
SELECT d.deptno, d.dname, COUNT(e.empno) AS headcount
FROM scott.dept d
LEFT JOIN scott.emp e ON d.deptno = e.deptno
GROUP BY d.deptno, d.dname
ORDER BY d.deptno;

-- Aufgabe 3
SELECT e.ename AS employee, e.sal AS emp_sal, m.ename AS manager, m.sal AS mgr_sal
FROM scott.emp e
JOIN scott.emp m ON e.mgr = m.empno
WHERE e.sal > m.sal;

-- Aufgabe 4
SELECT d.deptno, d.dname, e.ename, e.job
FROM scott.dept d
LEFT JOIN scott.emp e ON d.deptno = e.deptno AND e.job = 'CLERK'
ORDER BY d.deptno, e.ename;

-- Aufgabe 5
SELECT d.department_name, l.city, COUNT(e.employee_id) AS headcount
FROM hr.departments d
LEFT JOIN hr.locations l ON d.location_id = l.location_id
LEFT JOIN hr.employees e ON d.department_id = e.department_id
GROUP BY d.department_name, l.city
ORDER BY headcount DESC, d.department_name;
