# Curriculum: Advanced Oracle SQL — Komplexe Abfragen (`A001`–`A060`)

Dieser Lehrplan erweitert das [`1Z0-171`-Grundlagen-Curriculum](../1Z0-171/CURRICULUM.md) um **60 vertiefende Lektionen à 45 Minuten (45 Zeitstunden)** in 6 Modulen. Der Fokus liegt gezielt auf **Abfragen (`SELECT`)**: hierarchische und rekursive Joins, Regular Expressions, JSON, XML, Analytic/Window Functions sowie moderne SQL-Pattern-Matching-Verfahren.

---

## Didaktisches Prinzip & Voraussetzungen

- **Voraussetzung**: Beherrschung von `INNER`/`OUTER JOIN`, `GROUP BY`/`HAVING`, Subqueries und Single-Row Functions (Phasen 1–6 des Grundkurses).
- **45-Minuten-Struktur**: 10 Min. Konzept & Syntax-Anatomie → 15 Min. geführtes Live-Coding in `SCOTT`/`HR` oder der [Advanced Sandbox](docs/labs/advanced-queries-sandbox.sql) → 15 Min. eigenständige Abfrage-Aufgabe → 5 Min. Performance- & Edge-Case-Check.
- **Kein PL/SQL-Fokus**: Alle Aufgaben werden rein deklarativ in **SQL** gelöst.

---

## Modul-Übersicht

| Modul | Lektionen | Thema | Schwerpunkt |
| :---: | :---: | :--- | :--- |
| **Modul 1** | `A001`–`A010` | **Self-Joins, Hierarchien & Rekursive Joins** | `CONNECT BY` vs. Rekursive `WITH`-CTEs, Zykluserkennung, Pfadbildung |
| **Modul 2** | `A011`–`A020` | **Regular Expressions (`REGEXP_*`)** | Pattern-Matching, Extraktion mit Capture Groups, Ersetzung & Performance |
| **Modul 3** | `A021`–`A032` | **JSON in Oracle SQL** | `JSON`-Typ, Pfadausdrücke, `JSON_VALUE`/`QUERY`/`TABLE`, Generierung & Transformation |
| **Modul 4** | `A033`–`A042` | **XML in Oracle SQL** | `XMLType`, XPath/XQuery, `XMLTABLE`, XML-Generierung (`XMLELEMENT`/`XMLAGG`) |
| **Modul 5** | `A043`–`A052` | **Window Functions & Pivoting** | `OVER`, `ROW_NUMBER`/`RANK`, `LAG`/`LEAD`, `LISTAGG`, `PIVOT`/`UNPIVOT` |
| **Modul 6** | `A053`–`A060` | **Erweiterte Query-Patterns & Performance** | `CUBE`/`ROLLUP`, `CROSS APPLY`, `MATCH_RECOGNIZE`, Execution Plans & Capstone |

---

## Modul 1: Self-Joins, Hierarchische Abfragen & Rekursive Joins (`A001`–`A010`)

Im Grundkurs (`L097`) wird ein einfacher 1-stufiger Self-Join (`EMP -> MGR`) gezeigt. In der Praxis erfordern Organigramme, Stücklisten (Bill of Materials) und Kategorie-Bäume beliebig tiefe Traversierungen.

| Lektion | Titel | Zentrale Inhalte & SQL-Konstrukte |
| :--- | :--- | :--- |
| `A001` | **Mehrstufige Self-Joins & Peer-Vergleiche** | 2- bis 3-stufige Self-Joins (`Mitarbeiter -> Manager -> Abteilungsleiter`), Paare innerhalb derselben Gruppe ohne Duplikate (`a.empno < b.empno`), Lücken- und Überlappungsprüfung |
| `A002` | **Klassische Oracle-Hierarchien: `START WITH` & `CONNECT BY PRIOR`** | Wurzelknoten definieren, Richtung der Rekursion (`PRIOR empno = mgr` Top-Down vs. `PRIOR mgr = empno` Bottom-Up), Pseudospalte `LEVEL` |
| `A003` | **Hierarchie-Visualisierung & Pfadbildung** | Einrückung mit `LPAD(' ', (LEVEL - 1) * 2) \|\| ename`, `CONNECT_BY_ROOT`, `SYS_CONNECT_BY_PATH(ename, ' / ')`, `CONNECT_BY_ISLEAF` |
| `A004` | **Sortieren & Filtern in `CONNECT BY`-Hierarchien** | `ORDER SIBLINGS BY` (Geschwisterknoten sortieren, ohne Baumstruktur zu zerstören), Unterschied zwischen `WHERE`-Filter (nach Baumaufbau) und `CONNECT BY ... AND`-Filter (Ast abschneiden) |
| `A005` | **Zyklen erkennen & abfangen (`NOCYCLE`)** | Fehler `ORA-01436: CONNECT BY loop in user data` gezielt provozieren und mit `CONNECT BY NOCYCLE` + `CONNECT_BY_ISCYCLE` sauber auflösen |
| `A006` | **ANSI-Standard: Rekursive Subquery Factoring (`WITH` CTE)** | Aufbau einer rekursiven `WITH`-Klausel (`Anchor Member UNION ALL Recursive Member`), Pflicht zur Spaltenliste nach dem CTE-Namen |
| `A007` | **Tiefen- vs. Breitensuche in rekursiven CTEs** | `SEARCH DEPTH FIRST BY ... SET order_col` vs. `SEARCH BREADTH FIRST BY ... SET order_col`, Pfad-Akkumulation per String-Konkatenation |
| `A008` | **Zykluserkennung in rekursiven CTEs (`CYCLE`)** | `CYCLE empno SET is_cycle TO 'Y' DEFAULT 'N'`, Vergleich von `NOCYCLE` vs. `CYCLE`-Klausel |
| `A009` | **Stücklisten (Bill of Materials) & Mengen-Aggregation** | Multiplikation von Stückzahlen über mehrere Ebenen in einer rekursiven CTE und anschließende Aggregation der Gesamtkomponenten |
| `A010` | **Modul-1-Lab: Org-Chart- & BOM-Reporting** | Vergleich derselben Problemstellung in `CONNECT BY` und rekursiver `WITH`-CTE inkl. Pfad, Ebene und Blatt-Kennzeichnung |

---

## Modul 2: Regular Expressions in Oracle SQL (`A011`–`A020`)

Wo `LIKE`, `INSTR` und `SUBSTR` an Grenzen stoßen, ermöglichen Oracles POSIX-/Perl-kompatible `REGEXP_*`-Funktionen präzises Suchen, Validieren, Extrahieren und Bereinigen.

| Lektion | Titel | Zentrale Inhalte & SQL-Konstrukte |
| :--- | :--- | :--- |
| `A011` | **Regex-Grundlagen & Match-Parameter** | Metazeichen (`.`, `^`, `$`, `*`, `+`, `?`, `{m,n}`), Zeichenklassen (`[0-9]`, `[:digit:]`, `[:alpha:]`), Match-Parameter (`'i'`, `'c'`, `'n'`, `'m'`, `'x'`) |
| `A012` | **`REGEXP_LIKE` in `WHERE` und `CHECK` Constraints** | Komplexe Filter (z. B. gültige E-Mail-, PLZ- oder Kennzeichenmuster), Einsatz in `CHECK (REGEXP_LIKE(...))` |
| `A013` | **`REGEXP_INSTR`: Treffer-Positionen exakt bestimmen** | Parameter `position`, `occurrence`, `return_option` (`0` = Start des Treffers, `1` = Position *nach* dem Treffer) und `subexpr` |
| `A014` | **`REGEXP_SUBSTR`: Text- und Log-Extraktion** | Teilstrings per Muster extrahieren, Auftrennen von CSV-/Tag-Listen per `CONNECT BY LEVEL <= REGEXP_COUNT(...) + 1` |
| `A015` | **Capture Groups (`(...)`) & der `subexpr`-Parameter** | Gezieltes Auslesen einzelner Klammergruppen in `REGEXP_SUBSTR` (z. B. Hostname aus URL, Fehlercode aus Logzeile) |
| `A016` | **`REGEXP_REPLACE`: Bereinigung & Backreferences (`\1`, `\2`)** | Mehrfach-Leerzeichen normalisieren, Datums- oder Telefonnummernformate per Backreferences umbauen, Daten maskieren |
| `A017` | **`REGEXP_COUNT` & Wort-/Token-Analysen** | Zählen von Treffern ohne Zeilenvervielfachung, Kombination mit `REGEXP_SUBSTR` für Token-Splitting |
| `A018` | **Greedy vs. Non-Greedy (Lazy) Quantifiers** | Unterschied zwischen `.*` (gierig) und `.*?` (genügsam) beim Parsen von HTML/JSON/Log-Fragmenten in Oracle SQL |
| `A019` | **Regex-Performance & Alternativen** | CPU-Kosten von Regex vs. `LIKE`/`INSTR`/`SUBSTR`, Einsatz von Function-Based Indexes bei `REGEXP_LIKE`/`REGEXP_SUBSTR` |
| `A020` | **Modul-2-Lab: Logfile- & Stammdaten-Bereinigung** | Extrahieren von IP-Adressen, HTTP-Statuscodes und fehlerhaften E-Mail-Einträgen aus unstrukturierten Textspalten |

---

## Modul 3: JSON in Oracle SQL (`A021`–`A032`)

Oracle Database (insbesondere 21c/23ai) bietet erstklassige native JSON-Unterstützung direkt in SQL – von der einfachen Dot-Notation bis zu relationalen Projektionen mit `JSON_TABLE`.

| Lektion | Titel | Zentrale Inhalte & SQL-Konstrukte |
| :--- | :--- | :--- |
| `A021` | **JSON-Speicherung & `IS JSON` Constraints** | Nativer binärer `JSON`-Datentyp (21c/23ai) vs. `VARCHAR2`/`CLOB` mit `CHECK (col IS JSON)`, `STRICT` vs. `LAX` Syntax |
| `A022` | **JSON Path Expressions & Simple Dot Notation** | Pfadsyntax (`$`, `.feld`, `[0]`, `[*]`, Filter `?(@.qty > 1)`), direkte Dot-Notation (`t.doc.customer.name`) mit Tabellenalias-Pflicht |
| `A023` | **`JSON_VALUE`: Skalarwerte typsicher extrahieren** | `RETURNING NUMBER/DATE/VARCHAR2`, Fehler- und Leer-Verhalten (`NULL ON ERROR`, `ERROR ON ERROR`, `DEFAULT ... ON EMPTY`) |
| `A024` | **`JSON_QUERY`: Objekte & Arrays extrahieren** | Teil-Dokumente und Arrays zurückgeben, `WITH [UNCONDITIONAL\|CONDITIONAL] WRAPPER`, `PRETTY` |
| `A025` | **`JSON_EXISTS`: Filtern auf JSON-Inhalte** | Existenz- und Wertprüfungen in `WHERE`, `PASSING`-Klausel für Bind-Variablen und SQL-Spalten im Pfad-Filter |
| `A026` | **`JSON_TABLE`: JSON relational abfragen (Teil 1)** | Umwandeln von JSON-Dokumenten in virtuelle relationale Tabellen (`COLUMNS (...)`, `PATH`, `EXISTS PATH`) |
| `A027` | **`JSON_TABLE`: Verschachtelte Arrays & `NESTED PATH` (Teil 2)** | Master-Detail-Auflösung (z. B. Bestellung + Bestellpositionen) mit `NESTED PATH '$.items[*]'` und `FOR ORDINALITY` |
| `A028` | **JSON aus relationalen Tabellen erzeugen (`JSON_OBJECT`, `JSON_ARRAY`)** | Aufbau strukturierter JSON-Dokumente aus `SCOTT`/`HR`, `ABSENT ON NULL` vs. `NULL ON NULL` |
| `A029` | **JSON-Aggregation (`JSON_OBJECTAGG`, `JSON_ARRAYAGG`)** | Gruppierte JSON-Arrays und Key-Value-Objekte (`ORDER BY` innerhalb von `JSON_ARRAYAGG`, `RETURNING CLOB`/`JSON`) |
| `A030` | **JSON gezielt ändern: `JSON_TRANSFORM` & `JSON_MERGEPATCH`** | Deklarative Updates auf JSON-Feldern (`SET`, `INSERT`, `REMOVE`, `APPEND`, `RENAME`) in `UPDATE`- und `SELECT`-Statements |
| `A031` | **JSON Search Indexes & 26ai/23ai JSON Relational Duality Views** | Überblick über `CREATE SEARCH INDEX ... FOR JSON` sowie das 26ai/23ai-Konzept von JSON Relational Duality Views |
| `A032` | **Modul-3-Lab: E-Commerce-Order-Pipeline** | Relationale `HR`/`SCOTT`-Daten als JSON-API-Payload exportieren, verschachtelte Bestell-JSONs mit `JSON_TABLE` auswerten und aggregieren |

---

## Modul 4: XML in Oracle SQL (`A033`–`A042`)

Für Enterprise-Schnittstellen, Finanz-/Behördenformate (SEPA, XRechnung, SOAP) bleibt XML ein zentrales Thema in Oracle SQL.

| Lektion | Titel | Zentrale Inhalte & SQL-Konstrukte |
| :--- | :--- | :--- |
| `A033` | **`XMLType` Grundlagen & `XMLPARSE`** | Speicherung als `XMLType`, Wohlgeformtheit prüfen (`XMLPARSE(DOCUMENT ... WELLFORMED)`), `XMLISVALID` |
| `A034` | **XML generieren: `XMLELEMENT` & `XMLATTRIBUTES`** | Relationale Zeilen in XML-Tags und Attribute umwandeln, Umgang mit Sonderzeichen und `NULL`-Werten |
| `A035` | **`XMLFOREST` & `XMLCONCAT` für kompaktes XML** | Mehrere Spalten elegant als Kind-Elemente erzeugen (`XMLFOREST`), Unterdrückung leerer Tags bei `NULL` |
| `A036` | **`XMLAGG` & hierarchisches XML (Department -> Employees)** | Mehrere Zeilen zu einem XML-Baum aggregieren (`XMLAGG(XMLELEMENT(...) ORDER BY ...)`), Verschachtelung mit Subqueries |
| `A037` | **XPath & XQuery mit `XMLQUERY` und `XMLEXISTS`** | Filtern von XML-Dokumenten in `WHERE` mit `XMLEXISTS`, Extraktion über `XMLQUERY(... PASSING ... RETURNING CONTENT)` |
| `A038` | **`XMLCAST` & `XMLSERIALIZE`** | Konvertierung von XML-Fragmenten in SQL-Skalare (`XMLCAST(XMLQUERY(...) AS VARCHAR2(100))`) und formatierte Ausgabe (`INDENT`) |
| `A039` | **`XMLTABLE`: XML in relationale Zeilen & Spalten zerlegen** | XQuery-Row-Generator + `COLUMNS`-Definition (`PATH`, Datentypen, `FOR ORDINALITY`), Master-Detail über verschachtelte `XMLTABLE`-Joins |
| `A040` | **XML Namespaces in `XMLTABLE` & `XMLEXISTS`** | Deklaration von `XMLNAMESPACES(DEFAULT '...', '...' AS "ns")` beim Abfragen realer Schnittstellen-XMLs |
| `A041` | **`XMLTRANSFORM` (XSLT) & XML-vs.-JSON-Vergleich** | Transformation von XML mittels XSLT-Stylesheet direkt in SQL, Gegenüberstellung `XMLTABLE` vs. `JSON_TABLE` |
| `A042` | **Modul-4-Lab: Produktkatalog- & Rechnungs-Parsing** | Komplexes XML mit Namespaces per `XMLTABLE` relational aufbereiten und aggregierte Auswertungen wieder als XML exportieren |

---

## Modul 5: Analytic / Window Functions & Pivoting (`A043`–`A052`)

Analytic Functions erlauben Vergleiche, Rankings und laufende Berechnungen *ohne* Zeilen durch `GROUP BY` zu reduzieren.

| Lektion | Titel | Zentrale Inhalte & SQL-Konstrukte |
| :--- | :--- | :--- |
| `A043` | **Mental Model: `GROUP BY` vs. `OVER (PARTITION BY ...)`** | Ausführungsreihenfolge (Analytic Functions laufen *nach* `WHERE`, `GROUP BY`, `HAVING`, *vor* `ORDER BY`), `SUM(sal) OVER (PARTITION BY deptno)` |
| `A044` | **Ranking Functions: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`** | Verhalten bei Gleichstand (Ties), Top-N-per-Group-Muster (z. B. Top 2 Gehälter je Department), Duplikate deduplizieren |
| `A045` | **Windowing Clauses: `ROWS BETWEEN` vs. `RANGE BETWEEN`** | Laufende Summen (`UNBOUNDED PRECEDING AND CURRENT ROW`), gleitende Durchschnitte (`2 PRECEDING AND CURRENT ROW`), Default-Falle bei `ORDER BY` (`RANGE`) |
| `A046` | **Navigation: `LAG` & `LEAD`** | Zugriff auf vorherige/nächste Zeile (`LAG(sal, 1, 0) OVER (...)`), Differenzen zum Vormonat oder zum Vorgänger berechnen |
| `A047` | **`FIRST_VALUE`, `LAST_VALUE` & `NTH_VALUE`** | Typische `LAST_VALUE`-Falle (Standard-Window endet bei `CURRENT ROW` → `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` nötig!) |
| `A048` | **String-Aggregation mit `LISTAGG`** | `LISTAGG(ename, ', ') WITHIN GROUP (ORDER BY ename)`, `ON OVERFLOW TRUNCATE '...' WITH COUNT`, Einsatz als Analytic Function |
| `A049` | **Zeilen zu Spalten drehen: `PIVOT`** | Kreuztabellen direkt in SQL (`PIVOT (SUM(sal) FOR deptno IN (10, 20, 30))`), mehrere Aggregate im `PIVOT` |
| `A050` | **Spalten zu Zeilen drehen: `UNPIVOT`** | Normalisierung breiter Tabellen (`UNPIVOT [INCLUDE\|EXCLUDE NULLS]`), Kombination mit `PIVOT` |
| `A051` | **Ratio-to-Report & statistische Analytic Functions** | `RATIO_TO_REPORT(sal) OVER (PARTITION BY deptno)`, `PERCENT_RANK`, `CUME_DIST`, `MEDIAN` |
| `A052` | **Modul-5-Lab: HR-Gehaltsanalyse & Zeitreihen-Reporting** | Kombinierte Abfrage mit Ranking, laufender Summe, Abteilungsanteil und `LAG`-Abstand |

---

## Modul 6: Erweiterte Query-Patterns & Performance (`A053`–`A060`)

Abschlussmodul für mehrdimensionale Aggregationen, korrelierte Tabellenfunktionen, Mustererkennung über Zeilen hinweg und Execution-Plan-Verständnis.

| Lektion | Titel | Zentrale Inhalte & SQL-Konstrukte |
| :--- | :--- | :--- |
| `A053` | **Mehrdimensionale Aggregation: `ROLLUP`, `CUBE` & `GROUPING SETS`** | Zwischen- und Gesamtsummen in einem einzigen Tabellenscan, gezielte Kombinationen mit `GROUPING SETS` |
| `A054` | **`GROUPING()` & `GROUPING_ID()`** | Echte `NULL`-Werte von Subtotal-`NULL`s unterscheiden und sprechende Labels (`'Gesamt'`) erzeugen |
| `A055` | **`LATERAL` Inline Views & `CROSS APPLY` / `OUTER APPLY`** | Korrelierte Subqueries in der `FROM`-Klausel (z. B. Top-2-Mitarbeiter pro Department per `APPLY` + `FETCH FIRST 2 ROWS ONLY`) |
| `A056` | **Row Pattern Matching: `MATCH_RECOGNIZE` (Teil 1)** | Grundaufbau (`PARTITION BY`, `ORDER BY`, `MEASURES`, `PATTERN`, `DEFINE`) für V-/W-Muster und Trend-Erkennung |
| `A057` | **`MATCH_RECOGNIZE` (Teil 2): Islands & Gaps / Sessionization** | Zusammenhängende Zeiträume oder fehlende Sequenznummern elegant mit `MATCH_RECOGNIZE` erkennen |
| `A058` | **Komplexe `WITH`-Pipelines & CTE-Optimierung** | Mehrstufige Transformationen sauber strukturieren, Hinweise zu `MATERIALIZE` vs. `INLINE` |
| `A059` | **Execution Plans lesen (`EXPLAIN PLAN` & `DBMS_XPLAN.DISPLAY`)** | Kosten, Cardinality, Access Predicates vs. Filter Predicates bei Joins, `JSON_TABLE`, `XMLTABLE` und Regex verstehen |
| `A060` | **Capstone-Projekt: End-to-End-Analyse-Query** | Kombinierte Auswertung über hierarchische Daten, JSON/XML-Nutzlast, Regex-Bereinigung und Window Functions |
