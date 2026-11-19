-- ============================================================================
-- Phase 8 Lab Pack (L139-L162): DDL, Constraints, Views, Sequences and Indexes
-- ============================================================================

BEGIN EXECUTE IMMEDIATE 'DROP VIEW v_dept20_emps'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE lab_tasks PURGE'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE lab_projects PURGE'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE lab_seq'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

-- L140 und L145-L148: Tables, 23ai BOOLEAN, PK, FK (ON DELETE CASCADE), CHECK
CREATE TABLE lab_projects (
    proj_id    NUMBER(6) CONSTRAINT pk_lab_proj PRIMARY KEY,
    proj_name  VARCHAR2(50) NOT NULL,
    start_date DATE DEFAULT SYSDATE,
    is_active  BOOLEAN DEFAULT TRUE
);

CREATE TABLE lab_tasks (
    task_id NUMBER(6) CONSTRAINT pk_lab_tasks PRIMARY KEY,
    proj_id NUMBER(6) CONSTRAINT fk_lab_tasks_proj REFERENCES lab_projects(proj_id) ON DELETE CASCADE,
    status  VARCHAR2(12) CONSTRAINT chk_lab_status CHECK (status IN ('OPEN', 'DONE'))
);

-- L142-L143: ALTER TABLE und SET UNUSED
ALTER TABLE lab_projects ADD notes VARCHAR2(100);
ALTER TABLE lab_projects SET UNUSED (notes);
ALTER TABLE lab_projects DROP UNUSED COLUMNS;

-- L154-L156: View mit WITH CHECK OPTION
CREATE TABLE my_emp_ddl AS SELECT * FROM scott.emp;
CREATE OR REPLACE VIEW v_dept20_emps AS
SELECT empno, ename, sal, deptno
FROM my_emp_ddl
WHERE deptno = 20
WITH CHECK OPTION CONSTRAINT chk_v_dept20;

-- L158: Sequence (Vor CURRVAL muss NEXTVAL aufgerufen werden!)
CREATE SEQUENCE lab_seq START WITH 100 INCREMENT BY 10 NOCACHE;
SELECT lab_seq.NEXTVAL AS first_val FROM dual;
SELECT lab_seq.CURRVAL AS curr_val  FROM dual;

-- L159-L160: Function-Based Invisible Index and Private Synonym
CREATE INDEX idx_lab_upper_ename ON my_emp_ddl(UPPER(ename)) INVISIBLE;
CREATE OR REPLACE SYNONYM emp_syn FOR my_emp_ddl;
SELECT COUNT(*) FROM emp_syn;
