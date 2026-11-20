-- ============================================================================
-- Phase 7 Musterlösungen (L123-L138)
-- ============================================================================

-- Aufgabe 1
INSERT INTO my_dept (deptno, dname, loc) VALUES (70, 'SUPPORT', 'MUNICH');
INSERT INTO my_emp (empno, ename, job, sal, deptno) VALUES (8001, 'MUELLER', 'CLERK', 1400, 70);

-- Aufgabe 2
UPDATE my_emp e
SET sal = sal * 1.15
WHERE job = 'CLERK'
  AND sal < (SELECT AVG(i.sal) FROM my_emp i WHERE i.deptno = e.deptno);

-- Aufgabe 3
SAVEPOINT sp_test;
DELETE FROM high_earners;
SELECT COUNT(*) AS empty_check FROM high_earners;
ROLLBACK TO SAVEPOINT sp_test;
SELECT COUNT(*) AS restored_check FROM high_earners;
COMMIT;

-- Aufgabe 4
MERGE INTO my_emp tgt
USING scott.emp src ON (tgt.empno = src.empno)
WHEN MATCHED THEN
  UPDATE SET tgt.sal = src.sal, tgt.comm = src.comm
WHEN NOT MATCHED THEN
  INSERT (empno, ename, job, mgr, hiredate, sal, comm, deptno)
  VALUES (src.empno, src.ename, src.job, src.mgr, src.hiredate, src.sal, src.comm, src.deptno);
COMMIT;

-- Aufgabe 5
SELECT 'tier_top' AS tbl, COUNT(*) AS cnt FROM tier_top
UNION ALL
SELECT 'tier_rest', COUNT(*) FROM tier_rest;
