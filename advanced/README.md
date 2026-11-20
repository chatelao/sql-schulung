# Advanced Oracle SQL — Erweiterte Abfragetechniken

Dieses Modul baut direkt auf dem Grundlagen-Curriculum ([`1Z0-171`](../1Z0-171/README.md)) auf und behandelt **fortgeschrittene Oracle-SQL-Abfragen**, die nicht im `1Z0-171`-Grundkurs abgedeckt sind.

## Schwerpunkte

| Modul | Lektionen | Fokus | Zentrale Konzepte & Funktionen |
| :---: | :---: | :--- | :--- |
| **1** | `A001`–`A010` | **Self-Joins, Hierarchien & Rekursion** | Multi-Level Self-Joins, `CONNECT BY PRIOR`, `START WITH`, `SYS_CONNECT_BY_PATH`, Rekursive `WITH`-Klauseln (CTE), `CYCLE` |
| **2** | `A011`–`A020` | **Regular Expressions** | `REGEXP_LIKE`, `REGEXP_INSTR`, `REGEXP_SUBSTR`, `REGEXP_REPLACE`, `REGEXP_COUNT`, Capture Groups, POSIX/Perl-Klassen |
| **3** | `A021`–`A032` | **JSON in Oracle SQL (23ai)** | Nativer `JSON`-Typ, Dot-Notation, `JSON_VALUE`, `JSON_QUERY`, `JSON_EXISTS`, `JSON_TABLE`, `JSON_OBJECT`/`ARRAY`/`AGG`, `JSON_TRANSFORM`, Duality Views |
| **4** | `A033`–`A042` | **XML in Oracle SQL** | `XMLType`, `XMLELEMENT`, `XMLATTRIBUTES`, `XMLFOREST`, `XMLAGG`, `XMLQUERY`, `XMLEXISTS`, `XMLTABLE`, `XMLCAST`, `XMLSERIALIZE` |
| **5** | `A043`–`A052` | **Analytic / Window Functions & Pivoting** | `OVER (PARTITION BY ... ORDER BY ...)`, `ROWS`/`RANGE`, `ROW_NUMBER`/`RANK`/`DENSE_RANK`, `LAG`/`LEAD`, `LISTAGG`, `PIVOT`/`UNPIVOT` |
| **6** | `A053`–`A060` | **Moderne Query-Patterns & Performance** | `ROLLUP`/`CUBE`/`GROUPING SETS`, `CROSS`/`OUTER APPLY`, `MATCH_RECOGNIZE`, `DBMS_XPLAN.DISPLAY`, Capstone-Analyse |

---

## Voraussetzungen & Lab-Umgebung

- **Voraussetzungen**: Sicherer Umgang mit `SELECT`, Joins, Subqueries, `GROUP BY` und Single-Row Functions (entspricht Phasen 1–6 des [`1Z0-171`-Curriculums](../1Z0-171/CURRICULUM.md)).
- **Ziel-Datenbank**: Oracle Database 23ai Free (lokal per Container) oder **Oracle FreeSQL** (`freesql.com`).
- **Übungsskript**: Das eigenständige Lab-Skript [advanced-queries-sandbox.sql](docs/labs/advanced-queries-sandbox.sql) erstellt alle benötigten Beispieltabellen (Organisationshierarchie, JSON-Bestellungen, XML-Produktkataloge, Log-Strings) ohne `&`-Prompts und funktioniert direkt in FreeSQL, `sqlcl` und SQL Developer.

---

## Lehrbuchkapitel & Weiterführende Dokumente

- **[CURRICULUM.md](CURRICULUM.md)** — Vollständiger 60-Lektionen-Lehrplan (`A001`–`A060`).
- **[Modul 1 (`A001`–`A010`): Hierarchien & Rekursion](docs/modul-01-hierarchies.md)**
- **[Modul 2 (`A011`–`A020`): Regular Expressions](docs/modul-02-regex.md)**
- **[Modul 3 (`A021`–`A032`): JSON in Oracle SQL](docs/modul-03-json.md)**
- **[Modul 4 (`A033`–`A042`): XML in Oracle SQL](docs/modul-04-xml.md)**
- **[Modul 5 (`A043`–`A052`): Window Functions & Pivoting](docs/modul-05-window-pivoting.md)**
- **[Modul 6 (`A053`–`A060`): Query-Patterns & Performance](docs/modul-06-patterns-performance.md)**
- **[advanced-queries-sandbox.sql](docs/labs/advanced-queries-sandbox.sql)** — Komplettes Setup- und Übungsskript für alle 6 Module.
- **[advanced-queries-solutions.sql](docs/labs/advanced-queries-solutions.sql)** — Musterlösungen zu den Übungsaufgaben.
