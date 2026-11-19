# Phase 1: Onboarding, Baseline & Relational Foundations (`L001`–`L020`)

**Exam Domains**: Domain 1 (*Relational Database Concepts*, 5%) + Domain 2 Part 1 (*Retrieving Data*, ~5%)  
**Schemas Used**: `SCOTT/TIGER` (`EMP`, `DEPT`) -> `HR` (`EMPLOYEES`, `DEPARTMENTS`)

---

## Checkpoint #0 (`L001`–`L002`)

### `L001` — Course Kickoff & Identical Checkpoint #0 (Assessment)
- **45-Min Focus**: Understand the 200-lesson roadmap and take the baseline **CP-0** on [GitHub Pages](https://chatelao.github.io/sql-schulung/).
- **Beginner Rule**: Do **not** look anything up during CP-0. Guessing is expected—this establishes your honest zero-knowledge baseline so you can watch your score climb across `CP-1` through `CP-5`.

### `L002` — Baseline Reflection & Goal Setting
- **45-Min Focus**: Review your domain percentages from CP-0, log your confidence ratings, and export your baseline snapshot. Notice that you don't need to know the syntax yet—just note which words look unfamiliar.

---

## Relational Foundations (`L003`–`L008`)

### `L003` — Why Spreadsheets Break Down
- **Concept**: Spreadsheets mix data, formatting, and formulas; when two people edit or copy a sheet, duplicate department names go out of sync. A **Relational Database (RDBMS)** splits data into linked **tables**.

### `L004` — Tables, Rows, Columns & Primary Keys
- **Concept**: A **table** (`SCOTT.DEPT`) has **rows** (tuples/records) and **columns** (attributes/fields). Every row needs a unique identifier called a **Primary Key (PK)**—like `DEPTNO` (`10, 20, 30, 40`).

### `L005` — Linking Tables with Foreign Keys
- **Concept**: `SCOTT.EMP` stores `DEPTNO` (`10, 20, 30`) instead of repeating `'DALLAS'` 5 times. `EMP.DEPTNO` is a **Foreign Key (FK)** pointing to `DEPT.DEPTNO`.

### `L006` — Reading Entity-Relationship Diagrams (ERDs)
- **Concept**: Crow's-foot notation (`1:1`, `1:M`, `M:N`). A single `DEPT` has zero, one, or many `EMP` rows (`||--o{`), while each `EMP` belongs to one `DEPT`.

### `L007` — Mapping ERDs to `SELECT` Queries
- **Concept (1Z0-171 Objective!)**: Exam questions often ask how an ERD maps to SQL:
  - **Entity** -> Table (`FROM dept`)
  - **Attribute** -> Column (`SELECT dname, loc`)
  - **Relationship** -> Join condition (`EMP.DEPTNO = DEPT.DEPTNO`)

### `L008` — The Four SQL Statement Families
| Family | Full Name | Core Commands | Auto-Commits? |
| :--- | :--- | :--- | :---: |
| **DML** | Data Manipulation Language | `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE` | No |
| **DDL** | Data Definition Language | `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME` | **Yes** |
| **DCL** | Data Control Language | `GRANT`, `REVOKE` | **Yes** |
| **TCL** | Transaction Control Language | `COMMIT`, `ROLLBACK`, `SAVEPOINT` | Ends/manages tx |

---

## Lab Setup & First Queries (`L009`–`L012`)

### `L009` — Connecting to Your Lab Environment
- **Variant A**: Open VS Code / SQL Developer or `sqlcl` and connect to `FREEPDB1` / `PDB_TRAINING` (`scott/tiger`).
- **Variant B**: Sign into [freesql.com](https://freesql.com/) and open a fresh SQL Worksheet.

### `L010` — Your First `SELECT *` & `DESCRIBE`
```sql
DESCRIBE scott.dept;
SELECT * FROM scott.dept;
```
- **Task**: Inspect all 4 departments (`10 ACCOUNTING` through `40 OPERATIONS`), then run `SELECT * FROM scott.emp;` (14 rows).

### `L011` — Reading `ORA-` Error Messages Calmly
- Deliberately misspell `SELECT * FROM scott.empp;` -> observe `ORA-00942: table or view does not exist`.
- Misspell a column `SELECT enmae FROM scott.emp;` -> observe `ORA-00904: "ENMAE": invalid identifier`.

### `L012` — Scaling Up to `HR`
```sql
SELECT employee_id, first_name, last_name, salary FROM hr.employees;
```

---

## Projections, Arithmetic & `NULL` (`L013`–`L016`)

### `L013` — Selecting Specific Columns (Projection)
```sql
SELECT empno, ename, job, sal FROM scott.emp;
```

### `L014` — Arithmetic Expressions (`+`, `-`, `*`, `/`)
```sql
SELECT ename, sal, sal * 12 AS annual_sal, sal * 12 + 500 AS with_bonus
FROM scott.emp;
```

### `L015` — Operator Precedence
- `*` and `/` evaluate before `+` and `-`. Always use parentheses when adding before multiplying: `(sal + 200) * 12`.

### `L016` — The Golden Rule of `NULL`
- `NULL` is **not** zero and **not** a blank space—it means *unknown / unavailable*.
- **Trap**: Any arithmetic with `NULL` yields `NULL`:
  ```sql
  -- Look closely at SMITH vs ALLEN vs TURNER!
  SELECT ename, sal, comm, sal + comm AS total_pay
  FROM scott.emp;
  ```
  `TURNER` (`1500 + 0 = 1500`) gets a number, while `SMITH` (`800 + NULL = NULL`) gets `NULL`!

---

## Aliases, Concatenation, `DISTINCT` & `DUAL` (`L017`–`L020`)

### `L017` — Column Aliases (`AS` vs. `"Double Quotes"`)
```sql
SELECT ename AS employee_name, sal * 12 "Annual Salary"
FROM scott.emp;
```
- **Exam Trap**: Unquoted aliases turn `UPPERCASE`. Spaces or mixed case require `"Double Quotes"`, **never** `'Single Quotes'`.

### `L018` — Concatenation (`||`), Literals & Alternative Quotes (`q'[...]'`)
```sql
SELECT ename || ' works as a ' || job AS summary FROM scott.emp;
SELECT q'[Department's Name: ]' || dname FROM scott.dept;
```
- Unlike math, `'Hello' || NULL` returns `'Hello'`!

### `L019` — Eliminating Duplicates with `DISTINCT`
```sql
SELECT DISTINCT deptno FROM scott.emp;
SELECT DISTINCT deptno, job FROM scott.emp;
```
- **Exam Trap**: `DISTINCT` applies to the **combination of all columns** in the `SELECT` list and can only appear once right after `SELECT`.

### `L020` — The `DUAL` Table & Phase 1 Review
```sql
SELECT 24 * 60 AS mins_per_day, SYSDATE FROM dual;
```
- *(23ai Note)*: Oracle 23ai also allows `SELECT 24 * 60 FROM dual;` or omitting `FROM dual` (`SELECT 24 * 60;`), though `FROM dual` remains standard on `1Z0-171`.
