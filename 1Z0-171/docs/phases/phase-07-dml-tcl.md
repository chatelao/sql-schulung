# Phase 7: Data Manipulation (DML) & Transactions (`L123`–`L138`)

**Exam Domain**: Domain 7 (*Managing Tables with DML*, 5%)  
**Schemas Used**: Personal writable copies of `SCOTT` (`my_dept`, `my_emp`, `my_salgrade`)

---

## `INSERT`, `UPDATE`, `DELETE` Basics (`L123`–`L126`)

### `L123` — Setting Up Your Writable Sandbox (`my_emp` & `my_dept`)
- Both **Variant A** and **Variant B (FreeSQL)** create personal writable copies:
  ```sql
  CREATE TABLE my_dept AS SELECT * FROM scott.dept;
  CREATE TABLE my_emp  AS SELECT * FROM scott.emp;
  ```

### `L124` — `INSERT INTO ... VALUES` (Explicit & Implicit `NULL`, `DEFAULT`)
```sql
INSERT INTO my_dept (deptno, dname, loc) VALUES (50, 'ENGINEERING', 'BERLIN');
INSERT INTO my_dept (deptno, dname) VALUES (60, 'DESIGN'); -- loc becomes NULL
```

### `L125` — `UPDATE` Statements & `WHERE` Safety Habits
```sql
-- Always preview with SELECT before running UPDATE/DELETE!
UPDATE my_emp SET sal = sal * 1.10 WHERE deptno = 20;
```

### `L126` — `DELETE` vs. Referential Integrity Errors (`ORA-02292`)
- Deleting a parent row in `DEPT` while child rows exist in `EMP` raises `ORA-02292`.

---

## Subquery-Driven & Correlated DML (`L127`–`L128`)

### `L127` — `INSERT INTO ... SELECT`
```sql
INSERT INTO my_emp (empno, ename, job, sal, deptno)
SELECT employee_id, UPPER(SUBSTR(last_name, 1, 10)), 'STAFF', salary, 50
FROM hr.employees
WHERE department_id = 60;
```

### `L128` — Correlated `UPDATE` and Correlated `DELETE`
```sql
UPDATE my_emp e
SET sal = (SELECT MAX(sal) FROM my_emp m WHERE m.deptno = e.deptno)
WHERE job = 'CLERK';

DELETE FROM my_dept d
WHERE NOT EXISTS (SELECT 1 FROM my_emp e WHERE e.deptno = d.deptno);
```

---

## Multi-Table `INSERT` & `MERGE` (`L129`–`L132`)

### `L129` — Unconditional `INSERT ALL`
```sql
INSERT ALL
  INTO high_earners (empno, ename, sal) VALUES (empno, ename, sal)
  INTO emp_audit    (empno, audit_date)  VALUES (empno, SYSDATE)
SELECT empno, ename, sal FROM scott.emp WHERE sal >= 2500;
```

### `L130` — Conditional `INSERT ALL` vs. `INSERT FIRST`
- `INSERT ALL` evaluates **every `WHEN`** clause for each row (one row can land in multiple tables).
- `INSERT FIRST` stops at the **first matching `WHEN`** (plus optional `ELSE` clause).

### `L131` — The `MERGE` Statement (Upsert)
```sql
MERGE INTO my_emp tgt
USING scott.emp src ON (tgt.empno = src.empno)
WHEN MATCHED THEN
  UPDATE SET tgt.sal = src.sal, tgt.comm = src.comm
  DELETE WHERE tgt.job = 'CLERK'
WHEN NOT MATCHED THEN
  INSERT (empno, ename, job, sal, deptno)
  VALUES (src.empno, src.ename, src.job, src.sal, src.deptno);
```
- **Exam Trap**: `DELETE WHERE` inside `MERGE` only deletes rows that were **matched and updated** in that `MERGE` (evaluated against their *new* values).

### `L132` — `MERGE` & Multi-Table Insert Lab

---

## Transactions, Implicit Commits & Locking (`L133`–`L138`)

### `L133` — `COMMIT`, `ROLLBACK` & `SAVEPOINT`
```sql
UPDATE my_emp SET sal = 9999 WHERE empno = 7369;
SAVEPOINT sp_raise;
DELETE FROM my_emp WHERE deptno = 30;
ROLLBACK TO SAVEPOINT sp_raise; -- Undoes DELETE, keeps UPDATE!
COMMIT;
```

### `L134` — Implicit `COMMIT` & `ROLLBACK` Triggers
- **Auto-`COMMIT`**: Any DDL (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`), any DCL (`GRANT`, `REVOKE`), or normal `EXIT` from `sqlplus`.
- **Auto-`ROLLBACK`**: Abnormal termination, session crash, or rollback statement.

### `L135` — Read Consistency (Readers Never Block Writers)
- Before `COMMIT`, your session sees uncommitted changes, while all other sessions see the consistent pre-change snapshot.

### `L136` — Row-Level Locking & `SELECT ... FOR UPDATE`
- Oracle locks only modified rows, not entire tables; `SELECT ... FOR UPDATE [NOWAIT | WAIT n | SKIP LOCKED]` acquires row locks before updating.

### `L137`–`L138` — Two-Session Concurrency Lab
- **Variant A**: Two local sessions (`sqlcl` + VS Code) testing Read Consistency and row-lock blocking.
- **Variant B**: Two browser tabs in **OCI Always Free Database Actions** + `SAVEPOINT` labs in FreeSQL.
