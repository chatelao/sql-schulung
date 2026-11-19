# Oracle AI Database SQL Associate (1Z0-171)

[![Read the Docs Handbook](https://img.shields.io/badge/Read%20the%20Docs-Handbook-8CA1AF?logo=readthedocs&logoColor=white)](https://sql-schulung.readthedocs.io/)
[![GitHub Pages Interactive Studio](https://img.shields.io/badge/GitHub%20Pages-Interactive%20Studio-222222?logo=githubpages&logoColor=white)](https://chatelao.github.io/sql-schulung/)

## Exam Overview

The **Oracle AI Database SQL Associate (1Z0-171)** certification (also known as **Oracle Database 23ai SQL Associate**) validates a candidate's foundational understanding of SQL concepts and practical skills required to query, manipulate, and manage database objects in an Oracle Database environment.

| Attribute | Details |
| :--- | :--- |
| **Exam Code** | 1Z0-171 |
| **Exam Title** | Oracle AI Database SQL Associate |
| **Target Version** | Oracle AI Database (23ai) |
| **Format** | Multiple Choice |
| **Number of Questions** | 60 |
| **Duration** | 120 Minutes |
| **Passing Score** | 65% (39/60 questions) |
| **Prerequisites** | None |

> [!NOTE]
> Despite the "AI Database" product branding (Oracle Database 23ai), the **1Z0-171** exam focuses purely on standard and Oracle SQL fundamentals rather than AI Vector Search, JSON, or PL/SQL procedural programming.

---

## Exam Domains & Syllabus Weights

The exam covers 11 domains testing theoretical relational concepts and hands-on SQL proficiency:

| # | Exam Topic | Weight |
| :- | :--- | :---: |
| 1 | **Relational Database Concepts** | 5% |
| 2 | **Retrieving and Sorting Data** | 15% |
| 3 | **Using Functions** | 25% |
| 4 | **Displaying Data from Multiple Tables** | 10% |
| 5 | **Using Subqueries** | 5% |
| 6 | **Using SET Operators** | 5% |
| 7 | **Managing Tables with DML** | 5% |
| 8 | **DDL for Tables and Relationships** | 15% |
| 9 | **Managing Indexes, Synonyms, and Sequences** | 5% |
| 10 | **Data Dictionary and Time Zones** | 5% |
| 11 | **Controlling User Access** | 5% |

---

## Detailed Topic Breakdown

### 1. Relational Database Concepts (5%)
- Theoretical and physical aspects of a relational database
- Entity-Relationship Diagram (ERD) components and mapping to relational tables
- Relating clauses in a SQL `SELECT` statement to components of an ERD
- Core categories of SQL statements: Data Manipulation Language (DML), Data Definition Language (DDL), Data Control Language (DCL), and Transaction Control Language (TCL)

### 2. Retrieving and Sorting Data (15%)
- Capabilities of the `SELECT` statement, column aliases, and string concatenation (`||`)
- Arithmetic expressions, operator precedence rules, and handling `NULL` values in expressions
- Eliminating duplicate rows with `DISTINCT`
- Restricting rows with the `WHERE` clause, comparison operators (`=`, `<>`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`), and logical operators (`AND`, `OR`, `NOT`)
- Sorting query results using the `ORDER BY` clause (by column name, alias, or position; `ASC` / `DESC`; `NULLS FIRST` / `NULLS LAST`)
- Limiting rows using the row limiting clause (`FETCH FIRST` / `OFFSET`)
- Using substitution variables (`&` and `&&`) and `DEFINE` / `VERIFY` commands

### 3. Using Functions (25%)
- **Single-Row Functions**:
  - Character functions (`UPPER`, `LOWER`, `INITCAP`, `CONCAT`, `SUBSTR`, `LENGTH`, `INSTR`, `LPAD`, `RPAD`, `TRIM`, `REPLACE`)
  - Numeric functions (`ROUND`, `TRUNC`, `MOD`, `CEIL`, `FLOOR`)
  - Date functions (`SYSDATE`, `MONTHS_BETWEEN`, `ADD_MONTHS`, `NEXT_DAY`, `LAST_DAY`, `ROUND`, `TRUNC`)
- **Conversion Functions**:
  - Implicit vs. explicit data type conversion
  - `TO_CHAR`, `TO_NUMBER`, and `TO_DATE` with format models
- **General & Conditional Functions**:
  - Handling nulls with `NVL`, `NVL2`, `NULLIF`, and `COALESCE`
  - Conditional logic using `CASE` expressions and the `DECODE` function
- **Aggregate (Group) Functions**:
  - `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` (and how they handle `NULL` values)
  - Grouping rows with `GROUP BY` and filtering grouped data with `HAVING`
  - Nesting group functions

### 4. Displaying Data from Multiple Tables (10%)
- Writing `SELECT` statements to access data from more than one table using ANSI SQL-99 joins
- Inner joins (`INNER JOIN`, `NATURAL JOIN`, `USING`, `ON`)
- Outer joins (`LEFT OUTER JOIN`, `RIGHT OUTER JOIN`, `FULL OUTER JOIN`)
- Self-joins and non-equijoins
- Cartesian products (`CROSS JOIN`)

### 5. Using Subqueries (5%)
- Defining problems that subqueries can solve and where subqueries can be placed (`WHERE`, `HAVING`, `FROM`, `SELECT`)
- Single-row subqueries (`=`, `>`, `<`, `>=`, `<=`, `<>`)
- Multiple-row subqueries (`IN`, `ANY`, `ALL`) and pitfalls with `NULL` values in `NOT IN`
- Multiple-column subqueries
- Correlated subqueries (including correlated `UPDATE` and `DELETE`) and `EXISTS` / `NOT EXISTS`

### 6. Using SET Operators (5%)
- Rules and guidelines for matching `SELECT` lists across compound queries
- Combining results with `UNION`, `UNION ALL`, `INTERSECT`, and `MINUS` / `EXCEPT`
- Controlling sort order with `ORDER BY` in set operations

### 7. Managing Tables with DML (5%)
- Adding, modifying, and removing rows using `INSERT`, `UPDATE`, and `DELETE`
- Multi-table `INSERT` statements (unconditional `INSERT ALL`, conditional `INSERT ALL`, conditional `INSERT FIRST`)
- Upserting data with the `MERGE` statement
- Database transaction control: `COMMIT`, `ROLLBACK`, `SAVEPOINT`, implicit commits, and read consistency / locking basics

### 8. DDL for Tables and Relationships (15%)
- Naming rules, table structures, and core Oracle data types (`VARCHAR2`, `CHAR`, `NUMBER`, `DATE`, `CLOB`, `BLOB`, `BOOLEAN` in 23ai)
- Creating tables (`CREATE TABLE`, `CREATE TABLE AS SELECT`)
- Altering table definitions (`ALTER TABLE` to add, modify, drop columns, or `SET UNUSED`)
- Defining and managing constraints (`PRIMARY KEY`, `FOREIGN KEY` with `ON DELETE CASCADE` / `ON DELETE SET NULL`, `UNIQUE`, `NOT NULL`, `CHECK`)
- Enabling, disabling, and deferring constraints
- Dropping and truncating tables (`DROP TABLE ... PURGE`, `TRUNCATE TABLE`)
- Creating and using Temporary Tables and External Tables
- Creating, querying, modifying, and dropping Views (`CREATE OR REPLACE VIEW`, `WITH CHECK OPTION`, `WITH READ ONLY`)

### 9. Managing Indexes, Synonyms, and Sequences (5%)
- Creating, modifying, and dropping sequences (`CREATE SEQUENCE`, `NEXTVAL`, `CURRVAL`, `IDENTITY` columns)
- Creating and managing indexes (B-tree, unique, composite, function-based, visible/invisible) and understanding when indexes are created automatically
- Creating and dropping private and public synonyms (`CREATE SYNONYM`, `CREATE PUBLIC SYNONYM`)

### 10. Data Dictionary and Time Zones (5%)
- Querying Oracle Data Dictionary views (`USER_*`, `ALL_*`, `DBA_*`, `DICTIONARY` / `DICT`) to inspect schema objects, columns, and constraints
- Adding comments to tables and columns (`COMMENT ON`)
- Working with datetime and time zone data types: `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE`, `TIMESTAMP WITH LOCAL TIME ZONE`
- Interval data types: `INTERVAL YEAR TO MONTH`, `INTERVAL DAY TO SECOND`
- Datetime functions: `CURRENT_DATE`, `CURRENT_TIMESTAMP`, `LOCALTIMESTAMP`, `DBTIMEZONE`, `SESSIONTIMEZONE`, `EXTRACT`, `TZ_OFFSET`, `FROM_TZ`, `TO_TIMESTAMP`, `TO_YMINTERVAL`, `TO_DSINTERVAL`

### 11. Controlling User Access (5%)
- Differentiating between system privileges and object privileges
- Granting and revoking privileges (`GRANT`, `REVOKE`, `WITH ADMIN OPTION`, `WITH GRANT OPTION`)
- Creating, granting, and managing database roles (`CREATE ROLE`)
- Changing passwords and understanding schema object access

---

## Comparison: 1Z0-171 vs. 1Z0-071

| Feature | 1Z0-171 (Oracle AI Database SQL) | 1Z0-071 (Oracle Database SQL) |
| :--- | :--- | :--- |
| **Target Database** | Oracle Database 23ai | Oracle Database 12c / 19c |
| **Questions** | 60 | 63 |
| **Time Limit** | 120 minutes | 120 minutes |
| **Passing Score** | 65% (39 correct answers) | 63% (40 correct answers) |
| **Credential Earned** | Oracle AI Database SQL Certified Associate | Oracle Database SQL Certified Associate |

---

## Official Resources

- [Oracle MyLearn: Oracle AI Database SQL Associate (1Z0-171)](https://mylearn.oracle.com/ou/exam/oracle-ai-database-sql-associate-1z0-171/38560/138638/219330)
- [Oracle Database 23ai SQL Language Reference](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/)
