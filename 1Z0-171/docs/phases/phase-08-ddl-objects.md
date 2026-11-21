# Phase 8: DDL, Constraints, Views, Sequences, Indexes & Synonyms (`L139`–`L162`)

**Exam Domains**: Domain 8 (*DDL for Tables & Relationships*, 15 %) + Domain 9 (*Indexes, Synonyms & Sequences*, 5 %)  
**Interactive Studio**: [Phase 8 Tracker](https://chatelao.github.io/sql-schulung/#curriculum/phase-8) · [FreeSQL Sandbox](https://chatelao.github.io/sql-schulung/#labs/freesql/phase-8) · [Flashcards D8](https://chatelao.github.io/sql-schulung/#flashcards/D8) · [Flashcards D9](https://chatelao.github.io/sql-schulung/#flashcards/D9)

---

## Data Types, `CREATE TABLE`, `CTAS` & `ALTER TABLE` (`L139`–`L144`)

### `L139` — Object Naming Rules & zentrale Oracle Data Types
- **Lernziel**: Du wählst passende Datentypen (`VARCHAR2`, `CHAR`, `NUMBER(p,s)`, `DATE`, `CLOB`, `BLOB`, 23ai `BOOLEAN`) und kennst Namensregeln.
- **Studio-Link**: [Tracker `L139`](https://chatelao.github.io/sql-schulung/#curriculum/L139) · [SQL Ref: Data Types](https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/Data-Types.html)
- **Exam Trap**: Bei `NUMBER(5, -2)` rundet eine negative Scale `-2` auf den nächsten **Hunderter**: `1256` wird als **`1300`** gespeichert!

### `L140` — `CREATE TABLE` & `DEFAULT` Values
- **Lernziel**: Du erstellst eigene Tabellen mit Spaltendefinitionen und Standardwerten.
- **Studio-Link**: [Tracker `L140`](https://chatelao.github.io/sql-schulung/#curriculum/L140)
- **Beispiel**:
  ```sql
  CREATE TABLE projects (
      proj_id    NUMBER(6),
      proj_name  VARCHAR2(50) NOT NULL,
      start_date DATE DEFAULT SYSDATE,
      is_active  BOOLEAN DEFAULT TRUE
  );
  ```

### `L141` — `CREATE TABLE ... AS SELECT` (`CTAS`) Falle
- **Lernziel**: Du weißt exakt, welche Metadaten `CTAS` übernimmt und welche verloren gehen.
- **Studio-Link**: [Tracker `L141`](https://chatelao.github.io/sql-schulung/#curriculum/L141)
- !!! warning "1Z0-171 Exam Trap"
    `CTAS` kopiert Spaltennamen, Datentypen, Zeilen und **nur explizite `NOT NULL`-Constraints**. Es kopiert **keine** `PRIMARY KEY`-, `FOREIGN KEY`-, `UNIQUE`-, `CHECK`- oder `DEFAULT`-Definitionen!

### `L142` — `ALTER TABLE` (`ADD`, `MODIFY`, `DROP`, `RENAME`)
- **Lernziel**: Du passt bestehende Tabellenstrukturen nachträglich an.
- **Studio-Link**: [Tracker `L142`](https://chatelao.github.io/sql-schulung/#curriculum/L142) · [SQL Ref: ALTER TABLE](https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/ALTER-TABLE.html)
- **Regel**: Die Länge einer `VARCHAR2`-Spalte lässt sich nur verkleinern, wenn die Tabelle leer ist oder alle vorhandenen Werte in die neue Größe passen.

### `L143` — `SET UNUSED` & `DROP UNUSED COLUMNS`
- **Lernziel**: Du blendest große Spalten sofort aus und gibst Speicherplatz später wartungsfreundlich frei.
- **Studio-Link**: [Tracker `L143`](https://chatelao.github.io/sql-schulung/#curriculum/L143)
- **Beispiel**:
  ```sql
  ALTER TABLE projects SET UNUSED (start_date);
  ALTER TABLE projects DROP UNUSED COLUMNS;
  ```

### `L144` — `TRUNCATE TABLE` vs. `DELETE` vs. `DROP TABLE ... PURGE`
- **Lernziel**: Du unterscheidest DDL-Leeren (`TRUNCATE`), DML-Löschen (`DELETE`) und Objekt-Löschen (`DROP`).
- **Studio-Link**: [Tracker `L144`](https://chatelao.github.io/sql-schulung/#curriculum/L144)

| Befehl | Typ | Rollback möglich? | Tabellenstruktur bleibt? |
| :--- | :---: | :---: | :---: |
| `DELETE FROM t;` | DML | **Ja** | **Ja** |
| `TRUNCATE TABLE t;` | DDL | Nein (Auto-Commit) | **Ja** (setzt HWM zurück) |
| `DROP TABLE t PURGE;` | DDL | Nein (umgeht Recycle Bin) | Nein |

---

## Constraints Deep Dive (`L145`–`L150`)

### `L145` — `NOT NULL`, `UNIQUE` & `PRIMARY KEY`
- **Lernziel**: Du setzt Eindeutigkeit und Pflichtfelder sauber durch.
- **Studio-Link**: [Tracker `L145`](https://chatelao.github.io/sql-schulung/#curriculum/L145)
- **Exam Trap**: `UNIQUE` legt einen Unique Index an und erlaubt **mehrere `NULL`-Werte** (da in Oracle `NULL != NULL`). `PRIMARY KEY` = `NOT NULL + UNIQUE`.

### `L146` — `FOREIGN KEY` (`ON DELETE CASCADE` vs. `ON DELETE SET NULL`)
- **Lernziel**: Du modellierst referenzielle Integrität und Löschweitergabe.
- **Studio-Link**: [Tracker `L146`](https://chatelao.github.io/sql-schulung/#curriculum/L146)
- **Beispiel**:
  ```sql
  CREATE TABLE tasks (
      task_id NUMBER CONSTRAINT pk_tasks PRIMARY KEY,
      proj_id NUMBER CONSTRAINT fk_tasks_proj
              REFERENCES projects(proj_id) ON DELETE CASCADE,
      status  VARCHAR2(12) CONSTRAINT chk_status CHECK (status IN ('OPEN', 'DONE'))
  );
  ```

### `L147` — Inline- vs. Out-of-Line-Constraint-Syntax
- **Lernziel**: Du kennst die Syntaxgrenzen beider Varianten.
- **Studio-Link**: [Tracker `L147`](https://chatelao.github.io/sql-schulung/#curriculum/L147)
- **Regel**: `NOT NULL` kann **nur** inline definiert werden (oder per `ALTER TABLE ... MODIFY`); Multi-Column Constraints (`PRIMARY KEY (a, b)`) müssen out-of-line stehen.

### `L148` — `CHECK` Constraints & verbotene Ausdrücke
- **Lernziel**: Du vermeidest `ORA-02436` bei Geschäftsregeln.
- **Studio-Link**: [Tracker `L148`](https://chatelao.github.io/sql-schulung/#curriculum/L148)
- **Exam Trap**: `CHECK` Constraints **dürfen nicht** auf `SYSDATE`, `USER`, `CURRVAL`/`NEXTVAL` oder Subqueries verweisen (`ORA-02436`).

### `L149` — `ENABLE`, `DISABLE`, `NOVALIDATE` & `DEFERRABLE`
- **Lernziel**: Du steuerst, wann Constraints geprüft werden (sofort vs. beim `COMMIT`).
- **Studio-Link**: [Tracker `L149`](https://chatelao.github.io/sql-schulung/#curriculum/L149)
- **Beispiel**:
  ```sql
  CREATE TABLE budgets (
      id NUMBER CONSTRAINT pk_budgets PRIMARY KEY DEFERRABLE INITIALLY DEFERRED,
      amount NUMBER CHECK (amount >= 0)
  );
  -- Doppelte IDs werden erst bei COMMIT geprüft (nicht sofort beim INSERT)!
  ```

### `L150` — `DROP TABLE ... CASCADE CONSTRAINTS` & Schema-Build-Lab
- **Lernziel**: Du baust verknüpfte Tabellen inklusive Constraints auf und räumst Parent Tables sauber ab.
- **Studio-Link**: [Tracker `L150`](https://chatelao.github.io/sql-schulung/#curriculum/L150)
- **Selbstlern-Aufgabe**: Erstelle `lab_depts (deptno PK, dname NOT NULL UNIQUE)` und `lab_staff (empno PK, deptno FK ON DELETE SET NULL, sal CHECK (sal > 0))`. Füge 1 Dept + 1 Staff ein, lösche das Dept und prüfe, dass `lab_staff.deptno` zu `NULL` wird. Räume mit `DROP TABLE lab_depts CASCADE CONSTRAINTS PURGE;` auf.
  ??? success "Musterlösung & Erklärung"
      ```sql
      CREATE TABLE lab_depts (
          deptno NUMBER(2) CONSTRAINT pk_ld PRIMARY KEY,
          dname  VARCHAR2(20) NOT NULL CONSTRAINT uq_ld_name UNIQUE
      );
      CREATE TABLE lab_staff (
          empno  NUMBER(4) CONSTRAINT pk_ls PRIMARY KEY,
          deptno NUMBER(2) CONSTRAINT fk_ls_dept REFERENCES lab_depts(deptno) ON DELETE SET NULL,
          sal    NUMBER(7,2) CONSTRAINT chk_ls_sal CHECK (sal > 0)
      );
      INSERT INTO lab_depts VALUES (10, 'IT');
      INSERT INTO lab_staff VALUES (1001, 10, 3500);
      DELETE FROM lab_depts WHERE deptno = 10;
      SELECT * FROM lab_staff; -- deptno ist jetzt NULL!
      DROP TABLE lab_staff PURGE;
      DROP TABLE lab_depts CASCADE CONSTRAINTS PURGE;
      ```

---

## Global Temporary Tables & External Tables (`L151`–`L153`)

### `L151` — Global Temporary Tables (`GTT`)
- **Lernziel**: Du unterscheidest transaktions- vs. session-gebundene temporäre Daten.
- **Studio-Link**: [Tracker `L151`](https://chatelao.github.io/sql-schulung/#curriculum/L151)
- **Beispiel**:
  ```sql
  CREATE GLOBAL TEMPORARY TABLE cart_items (
      item_id NUMBER, qty NUMBER
  ) ON COMMIT PRESERVE ROWS; -- Standard ohne Angabe ist ON COMMIT DELETE ROWS!
  ```

### `L152` — Private Temporary Tables (`ORA$PTT_`)
- **Lernziel**: Du kennst In-Memory-Tabellen, deren **Definition** selbst nach Transaktion/Session verschwindet (`ON COMMIT DROP DEFINITION` vs. `ON COMMIT PRESERVE DEFINITION`).
- **Studio-Link**: [Tracker `L152`](https://chatelao.github.io/sql-schulung/#curriculum/L152)

### `L153` — External Tables (`ORGANIZATION EXTERNAL`)
- **Lernziel**: Du liest die DDL-Syntax für `ORACLE_LOADER` sicher und kennst ihre Einschränkungen.
- **Studio-Link**: [Tracker `L153`](https://chatelao.github.io/sql-schulung/#curriculum/L153)
- **Beispiel**:
  ```sql
  CREATE TABLE ext_emps (empno NUMBER(4), ename VARCHAR2(10))
  ORGANIZATION EXTERNAL (
    TYPE ORACLE_LOADER
    DEFAULT DIRECTORY data_dir
    ACCESS PARAMETERS (RECORDS DELIMITED BY NEWLINE FIELDS TERMINATED BY ',')
    LOCATION ('emps.csv')
  );
  ```
- **Regel**: Read-only über `ORACLE_LOADER` (unterstützt `SELECT`, **kein** `INSERT`/`UPDATE`/`DELETE` und **keine** Indexes). *(Variante B: reine Syntax- & Exam-Fragen-Übung, da Cloud-Sandboxes keinen OS-Dateizugriff bieten.)*

---

## Views (`L154`–`L157`)

### `L154` — `CREATE OR REPLACE [FORCE] VIEW`
- **Lernziel**: Du legst wiederverwendbare gespeicherte Abfragen an (auch mit `FORCE`, falls die Basistabelle noch fehlt).
- **Studio-Link**: [Tracker `L154`](https://chatelao.github.io/sql-schulung/#curriculum/L154)

### `L155` — Simple vs. Complex Views & DML-Regeln
- **Lernziel**: Du erkennst sofort, wann DML über eine View verboten ist (`DISTINCT`, `GROUP BY`, Group Functions, `SET` Operators, `ROWNUM` oder Joins ohne Key-Preserved-Regel).
- **Studio-Link**: [Tracker `L155`](https://chatelao.github.io/sql-schulung/#curriculum/L155)

### `L156` — `WITH CHECK OPTION` & `WITH READ ONLY`
- **Lernziel**: Du schützt Views vor unerwünschten Datenänderungen.
- **Studio-Link**: [Tracker `L156`](https://chatelao.github.io/sql-schulung/#curriculum/L156)
- **Beispiel**:
  ```sql
  CREATE OR REPLACE VIEW dept20_emps AS
  SELECT empno, ename, sal, deptno FROM my_emp WHERE deptno = 20
  WITH CHECK OPTION CONSTRAINT chk_dept20;
  -- INSERT INTO dept20_emps VALUES (9001, 'TEST', 2000, 30) -> ORA-01402!
  ```

### `L157` — View Management & `DROP VIEW` Lab
- **Lernziel**: Du testest `WITH CHECK OPTION` und `WITH READ ONLY` praktisch.
- **Studio-Link**: [Tracker `L157`](https://chatelao.github.io/sql-schulung/#curriculum/L157)
- **Selbstlern-Aufgabe**: Lege `v_ro_emp` mit `WITH READ ONLY` auf `my_emp` an, teste `SELECT COUNT(*) FROM v_ro_emp;` und versuche ein `DELETE FROM v_ro_emp;` (erwartet: `ORA-42399: cannot perform a DML operation on a read-only view`). Lösche die View anschließend mit `DROP VIEW v_ro_emp;`.
  ??? success "Musterlösung & Erklärung"
      ```sql
      CREATE OR REPLACE VIEW v_ro_emp AS
      SELECT empno, ename, sal FROM my_emp WITH READ ONLY;
      SELECT COUNT(*) FROM v_ro_emp;
      -- DELETE FROM v_ro_emp; -> ORA-42399
      DROP VIEW v_ro_emp;
      ```

---

## Sequences, Indexes & Synonyms (`L158`–`L160`)

### `L158` — Sequences & `IDENTITY` Columns
- **Lernziel**: Du erzeugst eindeutige IDs mit Sequences (`NEXTVAL`/`CURRVAL`) und `IDENTITY`-Spalten.
- **Studio-Link**: [Tracker `L158`](https://chatelao.github.io/sql-schulung/#curriculum/L158)
- **Beispiel**:
  ```sql
  CREATE SEQUENCE emp_seq START WITH 8000 INCREMENT BY 10 NOCACHE;
  SELECT emp_seq.NEXTVAL FROM dual; -- 8000 (muss VOR CURRVAL in der Session laufen!)
  SELECT emp_seq.CURRVAL FROM dual; -- 8000 (ohne vorheriges NEXTVAL -> ORA-08002!)
  ```
- **23ai / 12c+ Identity Columns**: `GENERATED ALWAYS AS IDENTITY` verbietet eigene IDs im `INSERT` (`ORA-32795`), während `GENERATED BY DEFAULT ON NULL AS IDENTITY` eigene Werte zulässt und nur bei fehlendem/NULL-Wert generiert.

### `L159` — Indexes (B-Tree, Unique, Composite, Function-Based, Invisible)
- **Lernziel**: Du weißt, wann Oracle Indexes automatisch anlegt und wann du sie manuell erstellst.
- **Studio-Link**: [Tracker `L159`](https://chatelao.github.io/sql-schulung/#curriculum/L159)
- **Regel**: Oracle erstellt Unique Indexes **automatisch** für `PRIMARY KEY` und `UNIQUE` Constraints (nicht für `FOREIGN KEY`!).
- **Beispiel**: `CREATE INDEX idx_upper_ename ON my_emp(UPPER(ename)) INVISIBLE;`

### `L160` — Private & Public Synonyms
- **Lernziel**: Du verkürzt lange Objektnamen mit Synonymen und weißt, dass Synonyme keine Rechte ersetzen.
- **Studio-Link**: [Tracker `L160`](https://chatelao.github.io/sql-schulung/#curriculum/L160)
- **Beispiel**: `CREATE SYNONYM e FOR scott.emp;` vs. `CREATE PUBLIC SYNONYM dept FOR scott.dept;`

---

## Checkpoint #4 (`L161`–`L162`)

### `L161` — Identical Checkpoint #4 (Assessment)
- **Lernziel**: Du prüfst deine DDL-, Constraint-, View- und Sequence-Sicherheit.
- **Studio-Link**: [Tracker `L161`](https://chatelao.github.io/sql-schulung/#curriculum/L161) · [Checkpoint `CP-4` starten ↗](https://chatelao.github.io/sql-schulung/#checkpoints/CP-4)
- **Erwartetes Niveau**: **75–85 %** gesamt.

### `L162` — Fortschrittsvergleich & Reflexion (`CP-4` vs. `CP-0..3`)
- **Lernziel**: Du prüfst dein Verlaufsdiagramm auf GitHub Pages und planst den Endspurt (Phase 9 & 10).
- **Studio-Link**: [Tracker `L162`](https://chatelao.github.io/sql-schulung/#curriculum/L162) · [`CP-4` Reflexion](https://chatelao.github.io/sql-schulung/#checkpoints/CP-4)
