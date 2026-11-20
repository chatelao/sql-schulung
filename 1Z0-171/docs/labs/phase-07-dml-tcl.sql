-- ============================================================================
-- Phase 7 Lab Pack (L123-L138): Data Manipulation (DML) and Transactions (TCL)
-- Sicher ausführbar im eigenen FreeSQL-Schema oder PDB-Student-Schema!
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TEIL 1: GEFÜHRTE DEMOS (Idempotentes Setup)
-- ----------------------------------------------------------------------------
BEGIN EXECUTE IMMEDIATE 'DROP TABLE my_emp PURGE';       EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE my_dept PURGE';      EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE high_earners PURGE'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE emp_audit PURGE';    EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE tier_top PURGE';     EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE tier_rest PURGE';    EXCEPTION WHEN OTHERS THEN NULL; END;
/

CREATE TABLE my_dept AS SELECT * FROM scott.dept;
CREATE TABLE my_emp  AS SELECT * FROM scott.emp;
CREATE TABLE high_earners (empno NUMBER(4), ename VARCHAR2(10), sal NUMBER(7,2));
CREATE TABLE emp_audit    (empno NUMBER(4), audit_date DATE);
CREATE TABLE tier_top     (empno NUMBER(4), ename VARCHAR2(10), sal NUMBER(7,2));
CREATE TABLE tier_rest    (empno NUMBER(4), ename VARCHAR2(10), sal NUMBER(7,2));

-- L124-L125: INSERT und UPDATE
INSERT INTO my_dept (deptno, dname, loc) VALUES (50, 'ENGINEERING', 'BERLIN');
INSERT INTO my_dept (deptno, dname) VALUES (60, 'DESIGN');
UPDATE my_emp SET sal = sal * 1.10 WHERE deptno = 20;

-- L128: Correlated DELETE
DELETE FROM my_dept d
WHERE NOT EXISTS (SELECT 1 FROM my_emp e WHERE e.deptno = d.deptno);

-- L129-L130: Unconditional INSERT ALL und Conditional INSERT FIRST
INSERT ALL
  INTO high_earners (empno, ename, sal) VALUES (empno, ename, sal)
  INTO emp_audit    (empno, audit_date)  VALUES (empno, SYSDATE)
SELECT empno, ename, sal FROM scott.emp WHERE sal >= 2500;

INSERT FIRST
  WHEN sal >= 3000 THEN INTO tier_top  VALUES (empno, ename, sal)
  ELSE                  INTO tier_rest VALUES (empno, ename, sal)
SELECT empno, ename, sal FROM scott.emp;

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

-- ----------------------------------------------------------------------------
-- TEIL 2: SELBSTSTÄNDIGE ÜBUNGSAUFGABEN (Lösungen in solutions/phase-07-dml-tcl-solutions.sql)
-- ----------------------------------------------------------------------------

-- Aufgabe 1 (★): Füge in my_dept Abteilung 70 ('SUPPORT', 'MUNICH') ein und füge
-- in my_emp den Mitarbeiter 8001 ('MUELLER', 'CLERK', sal=1400, deptno=70) ein.
-- TODO: Deine Statements hier


-- Aufgabe 2 (★★): Erhöhe in my_emp per Correlated UPDATE das Gehalt aller CLERKs
-- um 15 %, sofern ihr Gehalt unter dem Durchschnitt ihres Departments liegt.
-- TODO: Dein Statement hier


-- Aufgabe 3 (★★): Setze einen SAVEPOINT sp_test, lösche alle Zeilen aus high_earners,
-- prüfe COUNT(*) (= 0), mache nur das DELETE per ROLLBACK TO sp_test rückgängig
-- und bestätige mit COMMIT.
-- TODO: Deine Statements hier


-- Aufgabe 4 (★★★): Synchronisiere my_emp per MERGE wieder exakt auf scott.emp
-- (fehlende Zeilen einfügen, vorhandene sal/comm zurücksetzen).
-- TODO: Dein Statement hier


-- Aufgabe 5 (★★★): Prüfe, wie viele Zeilen in tier_top und tier_rest liegen
-- (Erwartet: 3 in tier_top, 11 in tier_rest).
-- TODO: Deine Query hier
