# Phase 8: DDL, Constraints, Views, Sequences, Indexes & Synonyms (`L139`–`L162`)

**Exam Domains**: Domain 8 (*DDL for Tables & Relationships*, 15 %) + Domain 9 (*Indexes, Synonyms & Sequences*, 5 %)

---

## Data Types, `CREATE TABLE`, `CTAS` & `ALTER TABLE` (`L139`–`L144`)

### `L139` — Object Naming Rules & zentrale Oracle Data Types
- `VARCHAR2(n)`, `CHAR(n)`, `NUMBER(p, s)` (was passiert bei negativem `s`, z. B. rundet `NUMBER(5, -2)` auf den nächsten Hunderter!), `DATE`, `CLOB`, `BLOB` sowie das native `BOOLEAN` in 23ai.

### `L140` — `CREATE TABLE` & `DEFAULT` Values
```sql
CREATE TABLE projects (
    proj_id    NUMBER(6),
    proj_name  VARCHAR2(50) NOT NULL,
    start_date DATE DEFAULT SYSDATE,
    is_active  BOOLEAN DEFAULT TRUE
);
```

### `L141` — `CREATE TABLE ... AS SELECT` (`CTAS`) Falle
- **Exam Trap**: `CTAS` kopiert Spaltennamen, Datentypen, Zeilen und **nur explizite `NOT NULL`-Constraints**. Es kopiert **keine** `PRIMARY KEY`-, `FOREIGN KEY`-, `UNIQUE`-, `CHECK`- oder `DEFAULT`-Definitionen!

### `L142` — `ALTER TABLE` (`ADD`, `MODIFY`, `DROP`, `RENAME`)
- Die Länge einer `VARCHAR2`-Spalte lässt sich nur verkleinern, wenn die Tabelle leer ist oder alle vorhandenen Werte in die neue Größe passen.

### `L143` — `SET UNUSED` & `DROP UNUSED COLUMNS`
```sql
ALTER TABLE projects SET UNUSED (start_date);
ALTER TABLE projects DROP UNUSED COLUMNS;
```
- Das Markieren einer Spalte als `UNUSED` erfolgt sofort und verbirgt sie dauerhaft, bevor der Speicherplatz später offline freigegeben wird.

### `L144` — `TRUNCATE TABLE` vs. `DELETE` vs. `DROP TABLE ... PURGE`
- `TRUNCATE` ist **DDL** (auto-committet, kann nicht zurückgerollt werden, setzt die High-Water Mark zurück, löst keine DML Trigger aus). `DROP TABLE ... PURGE` umgeht den Recycle Bin.

---

## Constraints Deep Dive (`L145`–`L150`)

### `L145` — `NOT NULL`, `UNIQUE` & `PRIMARY KEY`
- `UNIQUE` legt einen Unique Index an und erlaubt **mehrere `NULL`-Werte**; `PRIMARY KEY` = `NOT NULL + UNIQUE`.

### `L146` — `FOREIGN KEY` (`ON DELETE CASCADE` vs. `ON DELETE SET NULL`)
```sql
CREATE TABLE tasks (
    task_id NUMBER CONSTRAINT pk_tasks PRIMARY KEY,
    proj_id NUMBER CONSTRAINT fk_tasks_proj
            REFERENCES projects(proj_id) ON DELETE CASCADE,
    status  VARCHAR2(12) CONSTRAINT chk_status CHECK (status IN ('OPEN', 'DONE'))
);
```

### `L147` — Inline- vs. Out-of-Line-Constraint-Syntax
- `NOT NULL` kann **nur** inline definiert werden (oder per `ALTER TABLE ... MODIFY`); Multi-Column Constraints (`PRIMARY KEY (a, b)`) müssen out-of-line stehen.

### `L148` — `CHECK` Constraints & verbotene Ausdrücke
- `CHECK` Constraints **dürfen nicht** auf `SYSDATE`, `USER`, `CURRVAL`/`NEXTVAL` oder Subqueries verweisen (`ORA-02436`).

### `L149` — `ENABLE`, `DISABLE`, `NOVALIDATE` & `DEFERRABLE`
- `INITIALLY DEFERRED` prüft Constraints erst beim `COMMIT` statt sofort beim einzelnen Statement.

### `L150` — `DROP TABLE ... CASCADE CONSTRAINTS` & Schema-Build-Lab
- Erstelle und verknüpfe eine komplette Mini-Projektstruktur und räume Parent Tables sauber mit `CASCADE CONSTRAINTS` auf.

---

## Global Temporary Tables & External Tables (`L151`–`L153`)

### `L151` — Global Temporary Tables (`GTT`)
```sql
CREATE GLOBAL TEMPORARY TABLE cart_items (
    item_id NUMBER, qty NUMBER
) ON COMMIT PRESERVE ROWS; -- vs ON COMMIT DELETE ROWS (default!)
```

### `L152` — Private Temporary Tables (`ORA$PTT_`)
- Session-gebundene In-Memory-Tabellen, deren **Definition selbst** am Transaktions- oder Session-Ende verschwindet (`ON COMMIT DROP DEFINITION` vs. `ON COMMIT PRESERVE DEFINITION`).

### `L153` — External Tables (`ORGANIZATION EXTERNAL`)
```sql
CREATE TABLE ext_emps (empno NUMBER(4), ename VARCHAR2(10))
ORGANIZATION EXTERNAL (
  TYPE ORACLE_LOADER
  DEFAULT DIRECTORY data_dir
  ACCESS PARAMETERS (RECORDS DELIMITED BY NEWLINE FIELDS TERMINATED BY ',')
  LOCATION ('emps.csv')
);
```
- Read-only über `ORACLE_LOADER` (unterstützt `SELECT`, kein `INSERT`/`UPDATE`/`DELETE` und keine Indexes).

---

## Views (`L154`–`L157`)

### `L154` — `CREATE OR REPLACE [FORCE] VIEW`
- `FORCE` legt die View selbst dann an, wenn die zugrunde liegende Base Table noch nicht existiert oder Rechte darauf fehlen.

### `L155` — Simple vs. Complex Views & DML-Regeln
- DML (`DELETE`/`UPDATE`/`INSERT`) ist auf Views mit `DISTINCT`, `GROUP BY`, Group Functions, `SET` Operators oder Joins gesperrt (außer unter Key-Preserved-Regeln).

### `L156` — `WITH CHECK OPTION` & `WITH READ ONLY`
```sql
CREATE OR REPLACE VIEW dept20_emps AS
SELECT empno, ename, sal, deptno FROM my_emp WHERE deptno = 20
WITH CHECK OPTION CONSTRAINT chk_dept20;
```
- `WITH CHECK OPTION` verhindert Inserts/Updates über die View, durch welche die Zeile nicht mehr der `WHERE`-Klausel der View entspräche (`deptno = 30` schlägt fehl!).

### `L157` — View Management & `DROP VIEW` Lab
- Teste DML durch eine View mit und ohne `WITH CHECK OPTION` sowie `WITH READ ONLY`.

---

## Sequences, Indexes & Synonyms (`L158`–`L160`)

### `L158` — Sequences & `IDENTITY` Columns
```sql
CREATE SEQUENCE emp_seq START WITH 8000 INCREMENT BY 10 NOCACHE;
SELECT emp_seq.NEXTVAL FROM dual;
SELECT emp_seq.CURRVAL FROM dual; -- Fails with ORA-08002 if NEXTVAL not yet called in session!
```
- `GENERATED ALWAYS AS IDENTITY` vs. `GENERATED BY DEFAULT ON NULL AS IDENTITY`.

### `L159` — Indexes (B-Tree, Unique, Composite, Function-Based, Invisible)
- Oracle erstellt Unique Indexes **automatisch** für `PRIMARY KEY` und `UNIQUE` Constraints.
- `CREATE INDEX idx_upper_ename ON my_emp(UPPER(ename)) INVISIBLE;`

### `L160` — Private & Public Synonyms
- `CREATE SYNONYM e FOR scott.emp;` vs. `CREATE PUBLIC SYNONYM dept FOR scott.dept;`

---

## Checkpoint #4 (`L161`–`L162`)

### `L161` — Identical Checkpoint #4 (Assessment)
- Ziel-Meilenstein: **75–85 %** gesamt.

### `L162` — Fortschrittsvergleich & Reflexion (`CP-4` vs. `CP-0..3`)
- Prüfe dein Verlaufsdiagramm auf GitHub Pages und bereite die Endphase vor.
