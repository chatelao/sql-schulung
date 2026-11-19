# Phase 7: Data Manipulation (DML) & Transactions (`L123`–`L138`)

**Exam Domain**: Domain 7 (*Managing Tables with DML*, 5 %)  
**Verwendete Schemas**: Persönliche beschreibbare Kopien von `SCOTT` (`my_dept`, `my_emp`, `my_salgrade`)

---

## `INSERT`, `UPDATE`, `DELETE` Grundlagen (`L123`–`L126`)

### `L123` — Deine beschreibbare Sandbox einrichten (`my_emp` & `my_dept`)
- Sowohl in **Variante A** als auch in **Variante B (FreeSQL)** legst du persönliche beschreibbare Kopien an:
  ```sql
  CREATE TABLE my_dept AS SELECT * FROM scott.dept;
  CREATE TABLE my_emp  AS SELECT * FROM scott.emp;
  ```
- **SQL Reference**: [CREATE TABLE](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/CREATE-TABLE.html)

### `L124` — `INSERT INTO ... VALUES` (Explizites & implizites `NULL`, `DEFAULT`)
```sql
INSERT INTO my_dept (deptno, dname, loc) VALUES (50, 'ENGINEERING', 'BERLIN');
INSERT INTO my_dept (deptno, dname) VALUES (60, 'DESIGN'); -- loc becomes NULL
```
- **SQL Reference**: [INSERT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/INSERT.html)

### `L125` — `UPDATE` Statements & `WHERE`-Sicherheitsgewohnheiten
```sql
-- Always preview with SELECT before running UPDATE/DELETE!
UPDATE my_emp SET sal = sal * 1.10 WHERE deptno = 20;
```
- **SQL Reference**: [Types of SQL Statements](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Types-of-SQL-Statements.html)

### `L126` — `DELETE` vs. Referential Integrity Errors (`ORA-02292`)
- Das Löschen einer Parent Row in `DEPT`, solange noch Child Rows in `EMP` existieren, wirft `ORA-02292`.
- **SQL Reference**: [DELETE](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/DELETE.html)

---

## Subquery-gestütztes & Correlated DML (`L127`–`L128`)

### `L127` — `INSERT INTO ... SELECT`
```sql
INSERT INTO my_emp (empno, ename, job, sal, deptno)
SELECT employee_id, UPPER(SUBSTR(last_name, 1, 10)), 'STAFF', salary, 50
FROM hr.employees
WHERE department_id = 60;
```
- **SQL Reference**: [INSERT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/INSERT.html)

### `L128` — Correlated `UPDATE` und Correlated `DELETE`
```sql
UPDATE my_emp e
SET sal = (SELECT MAX(sal) FROM my_emp m WHERE m.deptno = e.deptno)
WHERE job = 'CLERK';

DELETE FROM my_dept d
WHERE NOT EXISTS (SELECT 1 FROM my_emp e WHERE e.deptno = d.deptno);
```
- **SQL Reference**: [DELETE](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/DELETE.html)

---

## Multi-Table `INSERT` & `MERGE` (`L129`–`L132`)

### `L129` — Unconditional `INSERT ALL`
```sql
INSERT ALL
  INTO high_earners (empno, ename, sal) VALUES (empno, ename, sal)
  INTO emp_audit    (empno, audit_date)  VALUES (empno, SYSDATE)
SELECT empno, ename, sal FROM scott.emp WHERE sal >= 2500;
```
- **SQL Reference**: [INSERT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/INSERT.html)

### `L130` — Conditional `INSERT ALL` vs. `INSERT FIRST`
- `INSERT ALL` wertet **jede `WHEN`**-Klausel für jede Zeile aus (eine Zeile kann in mehreren Zieltabellen landen).
- `INSERT FIRST` stoppt beim **ersten zutreffenden `WHEN`** (plus optionaler `ELSE`-Klausel).
- **SQL Reference**: [INSERT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/INSERT.html)

### `L131` — Das `MERGE` Statement (Upsert)
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
- **Exam Trap**: `DELETE WHERE` innerhalb eines `MERGE` löscht ausschließlich Zeilen, die in genau diesem `MERGE` **gematcht und aktualisiert** wurden (ausgewertet anhand ihrer *neuen* Werte).
- **SQL Reference**: [MERGE](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/MERGE.html)

### `L132` — `MERGE` & Multi-Table Insert Lab
- Synchronisiere `my_emp` gegen `scott.emp` mit `MERGE` und verteile Gehaltsklassen über `INSERT FIRST`.
- **SQL Reference**: [MERGE](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/MERGE.html)

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
- **SQL Reference**: [COMMIT](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/COMMIT.html)

### `L134` — Implicit `COMMIT` & `ROLLBACK` Triggers
- **Auto-`COMMIT`**: Jedes DDL (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`), jedes DCL (`GRANT`, `REVOKE`) oder ein reguläres `EXIT` aus `sqlplus`.
- **Auto-`ROLLBACK`**: Abbruch der Verbindung, Session-Absturz oder explizites `ROLLBACK`.
- **SQL Reference**: [ROLLBACK](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/ROLLBACK.html)

### `L135` — Read Consistency (Readers Never Block Writers)
- Vor einem `COMMIT` sieht deine eigene Session unbestätigte Änderungen, während alle anderen Sessions den konsistenten Snapshot vor der Änderung sehen.
- **SQL Reference**: [Locking Mechanisms](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Automatic-and-Manual-Locking-Mechanisms-During-SQL-Operations.html)

### `L136` — Row-Level Locking & `SELECT ... FOR UPDATE`
- Oracle sperrt nur geänderte Zeilen, nicht ganze Tabellen; `SELECT ... FOR UPDATE [NOWAIT | WAIT n | SKIP LOCKED]` setzt Row Locks bereits vor dem `UPDATE`.
- **SQL Reference**: [LOCK TABLE](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/LOCK-TABLE.html)

### `L137`–`L138` — Two-Session Concurrency Lab
- **Variante A**: Zwei lokale Sessions (`sqlcl` + VS Code) testen Read Consistency und Row-Lock-Blocking.
- **Variante B**: Zwei Browser-Tabs in **OCI Always Free Database Actions** + `SAVEPOINT`-Labs in FreeSQL.
- **SQL Reference**: [Locking Mechanisms](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/Automatic-and-Manual-Locking-Mechanisms-During-SQL-Operations.html)
