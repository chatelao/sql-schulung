-- ============================================================================
-- Phase 8 Musterlösungen (L139-L162)
-- ============================================================================

-- Aufgabe 1
CREATE TABLE ex_members (
    member_id NUMBER(6)    CONSTRAINT pk_ex_members PRIMARY KEY,
    email     VARCHAR2(80) CONSTRAINT uq_ex_email UNIQUE,
    joined_on DATE         DEFAULT SYSDATE,
    status    VARCHAR2(10) CONSTRAINT chk_ex_status CHECK (status IN ('ACTIVE', 'PAUSED'))
);

-- Aufgabe 2
CREATE TABLE ex_emp_ctas AS SELECT * FROM scott.emp;
SELECT constraint_name, constraint_type FROM user_constraints WHERE table_name = 'EX_EMP_CTAS';

-- Aufgabe 3
CREATE OR REPLACE VIEW v_sales_only AS
SELECT empno, ename, sal, deptno FROM my_emp_ddl WHERE deptno = 30
WITH CHECK OPTION CONSTRAINT chk_v_sales;
-- Test (wirft ORA-01402):
-- UPDATE v_sales_only SET deptno = 10 WHERE empno = 7499;

-- Aufgabe 4
CREATE SEQUENCE ex_seq START WITH 1000 INCREMENT BY 5 NOCACHE;
SELECT ex_seq.NEXTVAL FROM dual;
SELECT ex_seq.NEXTVAL FROM dual;
SELECT ex_seq.CURRVAL FROM dual;

-- Aufgabe 5
DROP VIEW v_sales_only;
DROP SEQUENCE ex_seq;
DROP TABLE ex_emp_ctas PURGE;
DROP TABLE ex_members PURGE;
