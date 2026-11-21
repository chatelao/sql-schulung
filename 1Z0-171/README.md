# Oracle AI Database SQL Associate (1Z0-171)

[![Read the Docs Handbuch](https://img.shields.io/badge/Read%20the%20Docs-Handbuch-8CA1AF?logo=readthedocs&logoColor=white)](https://sql-schulung.readthedocs.io/)
[![GitHub Pages Interactive Studio](https://img.shields.io/badge/GitHub%20Pages-Interactive%20Studio-222222?logo=githubpages&logoColor=white)](https://chatelao.github.io/sql-schulung/)

## Prüfungsüberblick (Exam Overview)

Die Zertifizierung **Oracle AI Database SQL Associate (1Z0-171)** (auch bekannt als **Oracle Database 23ai SQL Associate**) bestätigt fundierte Grundlagenkenntnisse in SQL-Konzepten sowie die praktische Fähigkeit, Daten und Datenbankobjekte in einer Oracle-Database-Umgebung abzufragen, zu manipulieren und zu verwalten.

| Merkmal | Details |
| :--- | :--- |
| **Exam Code** | 1Z0-171 |
| **Exam Title** | Oracle AI Database SQL Associate |
| **Target Version** | Oracle AI Database (23ai) |
| **Format** | Multiple Choice (inkl. Multi-Select) |
| **Anzahl Fragen** | 60 |
| **Dauer** | 120 Minuten |
| **Passing Score** | 65 % (39/60 Fragen) |
| **Voraussetzungen** | Keine (Einstieg ohne Vorkenntnisse möglich) |

> [!NOTE]
> Trotz des Produktnamens „AI Database“ (Oracle Database 23ai) prüft das **1Z0-171**-Examen ausschließlich Standard- und Oracle-SQL-Grundlagen – nicht AI Vector Search, JSON oder prozedurale PL/SQL-Programmierung.

---

## Exam Domains & Gewichtung

Die Prüfung umfasst 11 Domains, die sowohl theoretische Relational-Database-Konzepte als auch praktische SQL-Kompetenz abdecken:

| # | Exam Domain | Gewichtung |
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

## Detaillierte Themenübersicht

### 1. Relational Database Concepts (5 %)
- Theoretische und physische Aspekte einer Relational Database
- Bestandteile eines Entity-Relationship Diagrams (ERD) und Abbildung auf relationale Tables
- Zuordnung der Klauseln eines SQL-`SELECT`-Statements zu Komponenten eines ERD
- Zentrale Kategorien von SQL-Statements: Data Manipulation Language (`DML`), Data Definition Language (`DDL`), Data Control Language (`DCL`) und Transaction Control Language (`TCL`)

### 2. Retrieving and Sorting Data (15 %)
- Möglichkeiten des `SELECT`-Statements, Column Aliases und String Concatenation (`||`)
- Arithmetische Ausdrücke, Operator Precedence Rules und Umgang mit `NULL`-Werten in Ausdrücken
- Entfernen doppelter Zeilen mit `DISTINCT`
- Einschränken von Zeilen mit der `WHERE`-Klausel, Comparison Operators (`=`, `<>`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`) und Logical Operators (`AND`, `OR`, `NOT`)
- Sortieren von Abfrageergebnissen mit `ORDER BY` (nach Column Name, Alias oder Position; `ASC` / `DESC`; `NULLS FIRST` / `NULLS LAST`)
- Begrenzen der Zeilenzahl über die Row Limiting Clause (`FETCH FIRST` / `OFFSET`)
- Arbeiten mit Substitution Variables (`&` und `&&`) sowie den Kommandos `DEFINE` / `VERIFY`

### 3. Using Functions (25 %)
- **Single-Row Functions**:
  - Character Functions (`UPPER`, `LOWER`, `INITCAP`, `CONCAT`, `SUBSTR`, `LENGTH`, `INSTR`, `LPAD`, `RPAD`, `TRIM`, `REPLACE`)
  - Numeric Functions (`ROUND`, `TRUNC`, `MOD`, `CEIL`, `FLOOR`)
  - Date Functions (`SYSDATE`, `MONTHS_BETWEEN`, `ADD_MONTHS`, `NEXT_DAY`, `LAST_DAY`, `ROUND`, `TRUNC`)
- **Conversion Functions**:
  - Implicit vs. Explicit Data Type Conversion
  - `TO_CHAR`, `TO_NUMBER` und `TO_DATE` mit Format Models
- **General & Conditional Functions**:
  - Null-Handling mit `NVL`, `NVL2`, `NULLIF` und `COALESCE`
  - Bedingte Logik mit `CASE`-Ausdrücken und der Funktion `DECODE`
- **Aggregate (Group) Functions**:
  - `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` (inkl. Verhalten bei `NULL`-Werten)
  - Gruppieren mit `GROUP BY` und Filtern von Gruppen mit `HAVING`
  - Verschachtelung von Group Functions (Nesting)

### 4. Displaying Data from Multiple Tables (10 %)
- Schreiben von `SELECT`-Statements über mehrere Tabellen mittels ANSI SQL-99 Joins
- Inner Joins (`INNER JOIN`, `NATURAL JOIN`, `USING`, `ON`)
- Outer Joins (`LEFT OUTER JOIN`, `RIGHT OUTER JOIN`, `FULL OUTER JOIN`)
- Self-Joins und Non-Equijoins
- Cartesian Products (`CROSS JOIN`)

### 5. Using Subqueries (5 %)
- Einsatzszenarien für Subqueries und zulässige Positionen (`WHERE`, `HAVING`, `FROM`, `SELECT`)
- Single-Row Subqueries (`=`, `>`, `<`, `>=`, `<=`, `<>`)
- Multiple-Row Subqueries (`IN`, `ANY`, `ALL`) sowie Fallstricke mit `NULL`-Werten bei `NOT IN`
- Multiple-Column Subqueries
- Correlated Subqueries (inkl. Correlated `UPDATE` und `DELETE`) sowie `EXISTS` / `NOT EXISTS`

### 6. Using SET Operators (5 %)
- Regeln für übereinstimmende `SELECT`-Listen in Compound Queries
- Kombinieren von Ergebnissen mit `UNION`, `UNION ALL`, `INTERSECT` und `MINUS` / `EXCEPT`
- Steuerung der Sortierreihenfolge mit `ORDER BY` bei Set Operations

### 7. Managing Tables with DML (5 %)
- Einfügen, Ändern und Löschen von Zeilen mittels `INSERT`, `UPDATE` und `DELETE`
- Multi-Table `INSERT`-Statements (unconditional `INSERT ALL`, conditional `INSERT ALL`, conditional `INSERT FIRST`)
- Upserts mit dem `MERGE`-Statement
- Transaction Control: `COMMIT`, `ROLLBACK`, `SAVEPOINT`, Implicit Commits sowie Grundlagen zu Read Consistency und Locking

### 8. DDL for Tables and Relationships (15 %)
- Naming Rules, Tabellenstrukturen und zentrale Oracle Data Types (`VARCHAR2`, `CHAR`, `NUMBER`, `DATE`, `CLOB`, `BLOB`, `BOOLEAN` in 23ai)
- Erstellen von Tabellen (`CREATE TABLE`, `CREATE TABLE AS SELECT`)
- Anpassen von Tabellendefinitionen (`ALTER TABLE` zum Hinzufügen, Ändern, Löschen von Columns oder `SET UNUSED`)
- Definieren und Verwalten von Constraints (`PRIMARY KEY`, `FOREIGN KEY` mit `ON DELETE CASCADE` / `ON DELETE SET NULL`, `UNIQUE`, `NOT NULL`, `CHECK`)
- Aktivieren, Deaktivieren und Zurückstellen (`ENABLE`, `DISABLE`, `DEFERRABLE`) von Constraints
- Löschen und Leeren von Tabellen (`DROP TABLE ... PURGE`, `TRUNCATE TABLE`)
- Erstellen und Verwenden von Temporary Tables und External Tables
- Erstellen, Abfragen, Ändern und Löschen von Views (`CREATE OR REPLACE VIEW`, `WITH CHECK OPTION`, `WITH READ ONLY`)

### 9. Managing Indexes, Synonyms, and Sequences (5 %)
- Erstellen, Ändern und Löschen von Sequences (`CREATE SEQUENCE`, `NEXTVAL`, `CURRVAL`, `IDENTITY`-Columns)
- Erstellen und Verwalten von Indexes (B-tree, Unique, Composite, Function-Based, Visible/Invisible) und wann Indexes automatisch erzeugt werden
- Erstellen und Löschen privater und öffentlicher Synonyms (`CREATE SYNONYM`, `CREATE PUBLIC SYNONYM`)

### 10. Data Dictionary and Time Zones (5 %)
- Abfragen von Oracle Data Dictionary Views (`USER_*`, `ALL_*`, `DBA_*`, `DICTIONARY` / `DICT`) zur Inspektion von Schema-Objekten, Columns und Constraints
- Hinzufügen von Kommentaren zu Tabellen und Spalten (`COMMENT ON`)
- Arbeiten mit Datetime- und Time-Zone-Datentypen: `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE`, `TIMESTAMP WITH LOCAL TIME ZONE`
- Interval Data Types: `INTERVAL YEAR TO MONTH`, `INTERVAL DAY TO SECOND`
- Datetime Functions: `CURRENT_DATE`, `CURRENT_TIMESTAMP`, `LOCALTIMESTAMP`, `DBTIMEZONE`, `SESSIONTIMEZONE`, `EXTRACT`, `TZ_OFFSET`, `FROM_TZ`, `TO_TIMESTAMP`, `TO_YMINTERVAL`, `TO_DSINTERVAL`

### 11. Controlling User Access (5 %)
- Unterscheidung zwischen System Privileges und Object Privileges
- Vergeben und Entziehen von Rechten (`GRANT`, `REVOKE`, `WITH ADMIN OPTION`, `WITH GRANT OPTION`)
- Erstellen, Zuweisen und Verwalten von Database Roles (`CREATE ROLE`)
- Passwortänderung und Verständnis des Zugriffs auf Schema-Objekte

---

## Vergleich: 1Z0-171 vs. 1Z0-071

| Merkmal | 1Z0-171 (Oracle AI Database SQL) | 1Z0-071 (Oracle Database SQL) |
| :--- | :--- | :--- |
| **Target Database** | Oracle Database 23ai | Oracle Database 12c / 19c |
| **Anzahl Fragen** | 60 | 63 |
| **Zeitlimit** | 120 Minuten | 120 Minuten |
| **Passing Score** | 65 % (39 richtige Antworten) | 63 % (40 richtige Antworten) |
| **Zertifizierung** | Oracle AI Database SQL Certified Associate | Oracle Database SQL Certified Associate |

---

## Offizielle Ressourcen

- [Oracle MyLearn: Oracle AI Database SQL Associate (1Z0-171)](https://mylearn.oracle.com/ou/exam/oracle-ai-database-sql-associate-1z0-171/38560/138638/219330)
- [Oracle Database 26ai SQL Language Reference](https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/)
