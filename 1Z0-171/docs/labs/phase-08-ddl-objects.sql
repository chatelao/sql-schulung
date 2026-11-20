-- ============================================================================
-- Phase 8 Lab Pack (L139-L162): DDL, Constraints, Views, Sequences and Indexes
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TEIL 1: GEFÜHRTE DEMOS (100 % idempotent)
-- ----------------------------------------------------------------------------
BEGIN EXECUTE IMMEDIATE 'DROP SYNONYM emp_syn';         EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP VIEW v_dept20_emps';    EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP VIEW v_ro_emp';         EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE my_emp_ddl PURGE'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE lab_tasks PURGE';  EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE lab_projects PURGE'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE lab_cart_gtt PURGE'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE lab_tickets PURGE'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE lab_seq';       EXCEPTION WHEN OTHERS THEN NULL; END;
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

-- L151: Global Temporary Table (ON COMMIT PRESERVE ROWS)
CREATE GLOBAL TEMPORARY TABLE lab_cart_gtt (
    item_id NUMBER(6),
    qty     NUMBER(4)
) ON COMMIT PRESERVE ROWS;

-- L154-L156: Views mit WITH CHECK OPTION und WITH READ ONLY
CREATE TABLE my_emp_ddl AS SELECT * FROM scott.emp;
CREATE OR REPLACE VIEW v_dept20_emps AS
SELECT empno, ename, sal, deptno FROM my_emp_ddl WHERE deptno = 20
WITH CHECK OPTION CONSTRAINT chk_v_dept20;

CREATE OR REPLACE VIEW v_ro_emp AS
SELECT empno, ename, sal FROM my_emp_ddl WITH READ ONLY;

-- L158: Sequence und IDENTITY Column
CREATE SEQUENCE lab_seq START WITH 100 INCREMENT BY 10 NOCACHE;
SELECT lab_seq.NEXTVAL AS first_val FROM dual;
SELECT lab_seq.CURRVAL AS curr_val  FROM dual;

CREATE TABLE lab_tickets (
    ticket_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title     VARCHAR2(80) NOT NULL
);

-- L159-L160: Function-Based Invisible Index und Private Synonym
CREATE INDEX idx_lab_upper_ename ON my_emp_ddl(UPPER(ename)) INVISIBLE;
CREATE OR REPLACE SYNONYM emp_syn FOR my_emp_ddl;
SELECT COUNT(*) FROM emp_syn;

-- ----------------------------------------------------------------------------
-- TEIL 2: SELBSTSTÄNDIGE ÜBUNGSAUFGABEN (Lösungen in solutions/phase-08-ddl-objects-solutions.sql)
-- ----------------------------------------------------------------------------

-- Aufgabe 1 (★): Erstelle eine Tabelle ex_members (member_id PK, email UNIQUE,
-- joined_on DATE DEFAULT SYSDATE, status CHECK ('ACTIVE', 'PAUSED')).
-- TODO: Dein CREATE TABLE Statement hier


-- Aufgabe 2 (★★): Erstelle eine Kopie ex_emp_ctas AS SELECT * FROM scott.emp
-- und prüfe per SELECT * FROM user_constraints WHERE table_name = 'EX_EMP_CTAS',
-- welche Constraints kopiert wurden (Hinweis: KEINE, da scott.emp in CTAS keine NOT NULLs hat!).
-- TODO: Deine Statements hier


-- Aufgabe 3 (★★): Erstelle eine View v_sales_only für deptno = 30 auf my_emp_ddl
-- mit WITH CHECK OPTION und teste, ob ein UPDATE auf deptno = 10 blockiert wird.
-- TODO: Deine Statements hier


-- Aufgabe 4 (★★): Erstelle eine Sequence ex_seq (START WITH 1000, INCREMENT BY 5)
-- und rufe zweimal NEXTVAL sowie einmal CURRVAL auf.
-- TODO: Deine Statements hier


-- Aufgabe 5 (★★★): Räume deine in Aufgabe 1–4 erzeugten Objekte sauber auf
-- (DROP VIEW, DROP SEQUENCE, DROP TABLE ... PURGE).
-- TODO: Deine Cleanup-Statements hier
