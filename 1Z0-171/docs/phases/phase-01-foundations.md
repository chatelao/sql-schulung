# Phase 1: Onboarding, Baseline & Relational Foundations (`L001`–`L020`)

**Exam Domains**: Domain 1 (*Relational Database Concepts*, 5 %) + Domain 2 Teil 1 (*Retrieving Data*, ca. 5 %)  
**Verwendete Schemas**: `SCOTT/TIGER` (`EMP`, `DEPT`) -> `HR` (`EMPLOYEES`, `DEPARTMENTS`)

---

## Checkpoint #0 (`L001`–`L002`)

### `L001` — Kursstart & Identical Checkpoint #0 (Baseline-Test)
- **45-Min-Fokus**: Verschaffe dir einen Überblick über den 200-Lektionen-Lehrplan und absolviere das Baseline-Assessment **CP-0** auf [GitHub Pages](https://chatelao.github.io/sql-schulung/).
- **Anfänger-Regel**: Schlage während `CP-0` **nichts** nach. Raten ist ausdrücklich erlaubt und erwünscht – so erfasst du deine ehrliche Zero-Knowledge-Baseline und kannst deinen Lernfortschritt bis `CP-5` objektiv messen.

### `L002` — Baseline-Reflexion & Zielsetzung
- **45-Min-Fokus**: Werte deine Domain-Prozentsätze aus `CP-0` aus, protokolliere deine Confidence-Einschätzung und exportiere deinen Baseline-Snapshot. Du musst jetzt noch keine Syntax beherrschen – notiere dir nur, welche Begriffe noch fremd klingen.

---

## Relational Foundations (`L003`–`L008`)

### `L003` — Warum Spreadsheets an Grenzen stoßen
- **Konzept**: Spreadsheets vermischen Daten, Formatierung und Formeln; sobald zwei Personen eine Datei kopieren oder bearbeiten, laufen doppelte Abteilungsnamen auseinander. Eine **Relational Database (RDBMS)** trennt Daten sauber in verknüpfte **Tables**.

### `L004` — Tables, Rows, Columns & Primary Keys
- **Konzept**: Eine **Table** (`SCOTT.DEPT`) besteht aus **Rows** (Tupel/Datensätze) und **Columns** (Attribute/Felder). Jede Zeile benötigt eine eindeutige Kennung, den **Primary Key (PK)** – wie z. B. `DEPTNO` (`10, 20, 30, 40`).

### `L005` — Tables mit Foreign Keys verknüpfen
- **Konzept**: `SCOTT.EMP` speichert nur `DEPTNO` (`10, 20, 30`), statt fünfmal `'DALLAS'` zu wiederholen. `EMP.DEPTNO` ist ein **Foreign Key (FK)**, der auf `DEPT.DEPTNO` verweist.

### `L006` — Entity-Relationship Diagrams (ERDs) lesen
- **Konzept**: Crow's-Foot-Notation (`1:1`, `1:M`, `M:N`). Ein einzelnes `DEPT` hat null, eine oder viele `EMP`-Zeilen (`||--o{`), während jeder `EMP` genau zu einem `DEPT` gehört.

### `L007` — ERDs auf `SELECT`-Queries abbilden
- **Konzept (1Z0-171 Exam Objective!)**: Prüfungsfragen testen häufig, wie ein ERD auf SQL übertragen wird:
  - **Entity** -> Table (`FROM dept`)
  - **Attribute** -> Column (`SELECT dname, loc`)
  - **Relationship** -> Join Condition (`EMP.DEPTNO = DEPT.DEPTNO`)

### `L008` — Die vier SQL Statement Families
| Familie | Vollständiger Name | Kernbefehle | Auto-Commit? |
| :--- | :--- | :--- | :---: |
| **DML** | Data Manipulation Language | `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE` | Nein |
| **DDL** | Data Definition Language | `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME` | **Ja** |
| **DCL** | Data Control Language | `GRANT`, `REVOKE` | **Ja** |
| **TCL** | Transaction Control Language | `COMMIT`, `ROLLBACK`, `SAVEPOINT` | Beendet/steuert Transaktion |

---

## Lab Setup & erste Queries (`L009`–`L012`)

### `L009` — Mit der Lab-Umgebung verbinden
- **Variante A**: Öffne VS Code / SQL Developer oder `sqlcl` und verbinde dich mit `FREEPDB1` / `PDB_TRAINING` (`scott/tiger`).
- **Variante B**: Melde dich bei [freesql.com](https://freesql.com/) an und öffne ein frisches SQL Worksheet (oder starte das Phase-1-Lab direkt über den **FreeSQL Launcher** auf GitHub Pages).

### `L010` — Dein erstes `SELECT *` & `DESCRIBE`
```sql
DESCRIBE scott.dept;
SELECT * FROM scott.dept;
```
- **Aufgabe**: Betrachte alle 4 Departments (`10 ACCOUNTING` bis `40 OPERATIONS`) und führe anschließend `SELECT * FROM scott.emp;` (14 Zeilen) aus.

### `L011` — `ORA-`-Fehlermeldungen gelassen lesen
- Vertippe dich absichtlich bei `SELECT * FROM scott.empp;` -> beobachte `ORA-00942: table or view does not exist`.
- Vertippe dich bei einer Spalte `SELECT enmae FROM scott.emp;` -> beobachte `ORA-00904: "ENMAE": invalid identifier`.

### `L012` — Einstieg in das `HR`-Schema
```sql
SELECT employee_id, first_name, last_name, salary FROM hr.employees;
```

---

## Projections, Arithmetic & `NULL` (`L013`–`L016`)

### `L013` — Bestimmte Spalten auswählen (Projection)
```sql
SELECT empno, ename, job, sal FROM scott.emp;
```

### `L014` — Arithmetische Ausdrücke (`+`, `-`, `*`, `/`)
```sql
SELECT ename, sal, sal * 12 AS annual_sal, sal * 12 + 500 AS with_bonus
FROM scott.emp;
```

### `L015` — Operator Precedence (Punkt vor Strich)
- `*` und `/` werden vor `+` und `-` ausgewertet. Setze immer Klammern, wenn vor der Multiplikation addiert werden soll: `(sal + 200) * 12`.

### `L016` — Die goldene Regel für `NULL`
- `NULL` ist **weder** Null (`0`) **noch** ein Leerzeichen – es bedeutet *unbekannt / nicht vorhanden*.
- **Exam Trap**: Jede arithmetische Berechnung mit `NULL` ergibt `NULL`:
  ```sql
  -- Achte genau auf SMITH vs. ALLEN vs. TURNER!
  SELECT ename, sal, comm, sal + comm AS total_pay
  FROM scott.emp;
  ```
  `TURNER` (`1500 + 0 = 1500`) erhält eine Zahl, während `SMITH` (`800 + NULL = NULL`) `NULL` bekommt!

---

## Aliases, Concatenation, `DISTINCT` & `DUAL` (`L017`–`L020`)

### `L017` — Column Aliases (`AS` vs. `"Double Quotes"`)
```sql
SELECT ename AS employee_name, sal * 12 "Annual Salary"
FROM scott.emp;
```
- **Exam Trap**: Aliases ohne Anführungszeichen werden `UPPERCASE`. Leerzeichen oder gemischte Groß-/Kleinschreibung erfordern `"Double Quotes"`, **niemals** `'Single Quotes'`.

### `L018` — Concatenation (`||`), Literals & Alternative Quotes (`q'[...]'`)
```sql
SELECT ename || ' works as a ' || job AS summary FROM scott.emp;
SELECT q'[Department's Name: ]' || dname FROM scott.dept;
```
- Anders als bei Arithmetik liefert `'Hello' || NULL` wieder `'Hello'`!

### `L019` — Duplikate entfernen mit `DISTINCT`
```sql
SELECT DISTINCT deptno FROM scott.emp;
SELECT DISTINCT deptno, job FROM scott.emp;
```
- **Exam Trap**: `DISTINCT` gilt immer für die **Kombination aller Spalten** in der `SELECT`-Liste und darf nur einmal direkt nach `SELECT` stehen.

### `L020` — Die `DUAL`-Tabelle & Phase-1-Review
```sql
SELECT 24 * 60 AS mins_per_day, SYSDATE FROM dual;
```
- *(23ai-Hinweis)*: Oracle 23ai erlaubt sowohl `SELECT 24 * 60 FROM dual;` als auch das Weglassen von `FROM dual` (`SELECT 24 * 60;`), für `1Z0-171` bleibt `FROM dual` jedoch der Prüfungsstandard.
