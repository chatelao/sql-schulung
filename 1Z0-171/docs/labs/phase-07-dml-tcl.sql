-- ============================================================================
-- Phase 7 Lab Pack (L123-L138): Data Manipulation (DML) and Transactions (TCL)
-- Sicher ausführbar im eigenen FreeSQL-Schema oder PDB-Student-Schema!
-- ============================================================================

-- L123: Persönliche beschreibbare Kopien von SCOTT erstellen
BEGIN EXECUTE IMMEDIATE 'DROP TABLE my_emp PURGE'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE my_dept PURGE'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

CREATE TABLE my_dept AS SELECT * FROM scott.dept;
CREATE TABLE my_emp  AS SELECT * FROM scott.emp;

-- L124-L125: INSERT und UPDATE
INSERT INTO my_dept (deptno, dname, loc) VALUES (50, 'ENGINEERING', 'BERLIN');
INSERT INTO my_dept (deptno, dname) VALUES (60, 'DESIGN');

UPDATE my_emp SET sal = sal * 1.10 WHERE deptno = 20;

-- L128: Correlated DELETE (entfernt ungenutzte Departments)
DELETE FROM my_dept d
WHERE NOT EXISTS (SELECT 1 FROM my_emp e WHERE e.deptno = d.deptno);

-- L131: MERGE (Upsert + bedingtes DELETE auf aktualisierten Zeilen)
MERGE INTO my_emp tgt
USING scott.emp src ON (tgt.empno = src.empno)
WHEN MATCHED THEN
  UPDATE SET tgt.sal = src.sal, tgt.comm = src.comm
  DELETE WHERE tgt.empno = 7900
WHEN NOT MATCHED THEN
  INSERT (empno, ename, job, sal, deptno)
  VALUES (src.empno, src.ename, src.job, src.sal, src.deptno);

-- L133: SAVEPOINT und ROLLBACK TO SAVEPOINT
SAVEPOINT sp_before_cleanup;
DELETE FROM my_emp WHERE deptno = 30;
SELECT COUNT(*) AS count_during_delete FROM my_emp;
ROLLBACK TO SAVEPOINT sp_before_cleanup;
SELECT COUNT(*) AS count_after_rollback FROM my_emp;
COMMIT;
