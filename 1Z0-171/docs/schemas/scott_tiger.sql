-- ============================================================================
-- Classic SCOTT/TIGER Sample Schema for Oracle Database 19c / 23ai / FreeSQL
-- Adapted from Oracle utlsampl.sql for 1Z0-171 Beginner SQL Training
-- ============================================================================
-- Note: If running as a privileged DBA in an In-House PDB (Variant A),
-- uncomment the user creation block below.
-- If running inside your own personal schema (e.g., Oracle FreeSQL / STUDENT_01),
-- run starting directly from the DROP / CREATE TABLE statements.
-- ============================================================================

/*
CREATE USER scott IDENTIFIED BY tiger
  DEFAULT TABLESPACE users
  TEMPORARY TABLESPACE temp
  QUOTA UNLIMITED ON users;

GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW, CREATE SEQUENCE, CREATE SYNONYM TO scott;
ALTER SESSION SET CURRENT_SCHEMA = scott;
*/

-- Clean up existing tables if re-running
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE bonus PURGE';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE salgrade PURGE';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE emp PURGE';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE dept PURGE';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

CREATE TABLE dept (
    deptno NUMBER(2) CONSTRAINT pk_dept PRIMARY KEY,
    dname  VARCHAR2(14),
    loc    VARCHAR2(13)
);

CREATE TABLE emp (
    empno    NUMBER(4) CONSTRAINT pk_emp PRIMARY KEY,
    ename    VARCHAR2(10),
    job      VARCHAR2(9),
    mgr      NUMBER(4),
    hiredate DATE,
    sal      NUMBER(7,2),
    comm     NUMBER(7,2),
    deptno   NUMBER(2) CONSTRAINT fk_deptno REFERENCES dept(deptno)
);

CREATE TABLE bonus (
    ename VARCHAR2(10),
    job   VARCHAR2(9),
    sal   NUMBER,
    comm  NUMBER
);

CREATE TABLE salgrade (
    grade NUMBER,
    losal NUMBER,
    hisal NUMBER
);

-- Insert Departments (Note: Dept 40 OPERATIONS intentionally has 0 employees!)
INSERT INTO dept VALUES (10, 'ACCOUNTING', 'NEW YORK');
INSERT INTO dept VALUES (20, 'RESEARCH',   'DALLAS');
INSERT INTO dept VALUES (30, 'SALES',      'CHICAGO');
INSERT INTO dept VALUES (40, 'OPERATIONS', 'BOSTON');

-- Insert 14 Classic Employees
INSERT INTO emp VALUES (7369, 'SMITH',  'CLERK',     7902, DATE '1980-12-17',  800, NULL, 20);
INSERT INTO emp VALUES (7499, 'ALLEN',  'SALESMAN',  7698, DATE '1981-02-20', 1600,  300, 30);
INSERT INTO emp VALUES (7521, 'WARD',   'SALESMAN',  7698, DATE '1981-02-22', 1250,  500, 30);
INSERT INTO emp VALUES (7566, 'JONES',  'MANAGER',   7839, DATE '1981-04-02', 2975, NULL, 20);
INSERT INTO emp VALUES (7654, 'MARTIN', 'SALESMAN',  7698, DATE '1981-09-28', 1250, 1400, 30);
INSERT INTO emp VALUES (7698, 'BLAKE',  'MANAGER',   7839, DATE '1981-05-01', 2850, NULL, 30);
INSERT INTO emp VALUES (7782, 'CLARK',  'MANAGER',   7839, DATE '1981-06-09', 2450, NULL, 10);
INSERT INTO emp VALUES (7788, 'SCOTT',  'ANALYST',   7566, DATE '1987-04-19', 3000, NULL, 20);
INSERT INTO emp VALUES (7839, 'KING',   'PRESIDENT', NULL, DATE '1981-11-17', 5000, NULL, 10);
INSERT INTO emp VALUES (7844, 'TURNER', 'SALESMAN',  7698, DATE '1981-09-08', 1500,    0, 30);
INSERT INTO emp VALUES (7876, 'ADAMS',  'CLERK',     7788, DATE '1987-05-23', 1100, NULL, 20);
INSERT INTO emp VALUES (7900, 'JAMES',  'CLERK',     7698, DATE '1981-12-03',  950, NULL, 30);
INSERT INTO emp VALUES (7902, 'FORD',   'ANALYST',   7566, DATE '1981-12-03', 3000, NULL, 20);
INSERT INTO emp VALUES (7934, 'MILLER', 'CLERK',     7782, DATE '1982-01-23', 1300, NULL, 10);

-- Insert 5 Salary Grades (for Non-Equijoin exercises)
INSERT INTO salgrade VALUES (1,  700, 1200);
INSERT INTO salgrade VALUES (2, 1201, 1400);
INSERT INTO salgrade VALUES (3, 1401, 2000);
INSERT INTO salgrade VALUES (4, 2001, 3000);
INSERT INTO salgrade VALUES (5, 3001, 9999);

COMMIT;
