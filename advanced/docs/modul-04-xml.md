# Modul 4: XML in Oracle SQL (`A033`–`A042`)

**Sandbox-Tabellen**: `adv_catalog_xml` aus [advanced-queries-sandbox.sql](labs/advanced-queries-sandbox.sql)

---

## 1. Vom einfachsten Einstieg (`EXTRACTVALUE`) bis `XMLTABLE`

Der schnellste Weg, einen **einzelnen** Wert aus einer `XMLTYPE`-Spalte zu lesen, sind die klassischen Einzeiler **`EXTRACTVALUE`**, **`EXTRACT`** und **`EXISTSNODE`**. Sobald mehrere Knoten (`1:N`) in relationale Zeilen zerlegt werden müssen, folgt der moderne Standard **`XMLTABLE` / `XMLQUERY` mit `PASSING`**.

### Stufe 1: Der einfachste Fall (`EXTRACTVALUE`, `EXTRACT`, `EXISTSNODE`)
```sql
SELECT c.cat_id,
       EXTRACTVALUE(c.xml_doc, '/catalog/@dept')             AS dept,
       EXTRACTVALUE(c.xml_doc, '/catalog/product[1]/name')   AS first_prod,
       EXTRACTVALUE(c.xml_doc, '/catalog/product[1]/price')  AS first_price
FROM adv_catalog_xml c
WHERE EXISTSNODE(c.xml_doc, '/catalog/product[@id="P20"]') = 1;
```
- **`EXTRACTVALUE(xml, xpath)`**: Liefert genau **einen** Skalarwert (Text/Zahl). Gibt es mehr als einen Treffer (z. B. `/catalog/product/name` ohne `[1]`), bricht Oracle mit **`ORA-19025: EXTRACTVALUE returns value of only one node`** ab!
- **`EXTRACT(xml, xpath)`**: Liefert ein `XMLTYPE`-Fragment (auch bei mehreren Treffern).
- **`EXISTSNODE(xml, xpath)`**: Prüft in `WHERE`, ob der Pfad existiert (`1` = ja, `0` = nein).

!!! warning "Hinweis zur Aktualität (Legacy vs. Modern)"
    `EXTRACTVALUE`, `EXTRACT` und `EXISTSNODE` sind in Oracle seit 11gR2/12c **deprecated** (funktionieren in Oracle 26ai/23ai aber weiterhin und begegnen dir oft in Bestandscode). Für neuen Code nutzt du **`XMLCAST(XMLQUERY(... PASSING ...))`**, **`XMLEXISTS(... PASSING ...)`** und **`XMLTABLE(... PASSING ...)`**.

### Stufe 2: Moderner Ersatz für Einzelwerte & Filter (`XMLQUERY` / `XMLCAST` / `XMLEXISTS`)
```sql
SELECT c.cat_id,
       XMLCAST(
         XMLQUERY('/catalog/@dept' PASSING c.xml_doc RETURNING CONTENT)
         AS VARCHAR2(20)
       ) AS dept
FROM adv_catalog_xml c
WHERE XMLEXISTS('/catalog/product[price > 80]' PASSING c.xml_doc);
```

### Stufe 3: `1:N`-Listen relational zerlegen (`XMLTABLE` mit `PASSING`)
```sql
SELECT c.cat_id, xt.dept, xt.prod_id, xt.prod_name, xt.price, xt.currency
FROM adv_catalog_xml c,
     XMLTABLE(
       '/catalog/product'
       PASSING c.xml_doc
       COLUMNS
         dept      VARCHAR2(20) PATH '../@dept',
         prod_id   VARCHAR2(10) PATH '@id',
         prod_name VARCHAR2(60) PATH 'name',
         price     NUMBER(10,2) PATH 'price',
         currency  VARCHAR2(5)  PATH 'price/@currency'
     ) xt;
```

## 2. XML generieren (`XMLELEMENT`, `XMLFOREST`, `XMLAGG`)

| Konstrukt | Zweck |
| :--- | :--- |
| `XMLELEMENT("emp", XMLATTRIBUTES(empno AS "id"), ename)` | Erzeugt XML-Elemente & Attribute |
| `XMLFOREST(ename, job, sal)` | Erzeugt mehrere Kind-Elemente (lässt `NULL`s weg) |
| `XMLAGG(XMLELEMENT(...) ORDER BY ...)` | Aggregiert mehrere Zeilen in einen XML-Baum |

---

### Visuelle Orientierung: Vom einfachen Einzelwert zu `XMLTABLE`
```mermaid
flowchart LR
    X["XMLTYPE (adv_catalog_xml)"] --> L["1. EXTRACTVALUE / EXISTSNODE (einfach, 1 Knoten, Legacy)"]
    X --> M["2. XMLCAST(XMLQUERY(... PASSING)) & XMLEXISTS (modern)"]
    X --> T["3. XMLTABLE ('/catalog/product' PASSING ... COLUMNS ...) (1:N Zeilen)"]
    R["Relationale Zeilen"] --> G["XMLELEMENT / XMLAGG -> XML-Export"]
```
*Alt-Text: Steigerung in der XML-Abfrage: vom einfachen Legacy-Einzelwert mit EXTRACTVALUE über XMLQUERY/XMLEXISTS mit PASSING bis zur 1:N-Tabellenzerlegung mit XMLTABLE sowie XML-Generierung.*

---

## Lektionen im Detail

### `A033` — `XMLType` Grundlagen & `XMLPARSE`
- **Lernziel:** Speicherung als `XMLType`, Wohlgeformtheit prüfen (`XMLPARSE(DOCUMENT ... WELLFORMED)`), `XMLISVALID` *(Bloom: Analysieren)*
- **Selbstlern-Aufgabe (Lückentext/Check):** `Was ist der Unterschied zwischen einem wohlgeformten XML und einem Schema-validierten XMLTYPE?`

??? success "Musterlösung & Erklärung"
    XMLTYPE prüft Wohlgeformtheit; mit registriertem XSD erzwingt XMLTYPE zusätzlich Struktur- und Typvalidierung.

### `A034` — XML generieren: `XMLELEMENT` & `XMLATTRIBUTES`
- **Lernziel:** Relationale Zeilen in XML-Tags und Attribute umwandeln, Umgang mit Sonderzeichen und `NULL`-Werten *(Bloom: Anwenden)*
- **Selbstlern-Aufgabe (Lückentext/Check):** `SELECT XMLTABLE('/dept/emp' ___ x.doc COLUMNS ename VARCHAR2(20) PATH 'name') FROM adv_xml x;`

??? success "Musterlösung & Erklärung"
    PASSING x.doc übergibt die XMLTYPE-Spalte an XMLTABLE.

### `A035` — `XMLFOREST` & `XMLCONCAT` für kompaktes XML
- **Lernziel:** Mehrere Spalten elegant als Kind-Elemente erzeugen (`XMLFOREST`), Unterdrückung leerer Tags bei `NULL` *(Bloom: Anwenden)*
- **Selbstlern-Aufgabe (Lückentext/Check):** `... COLUMNS empno NUMBER PATH '___', sal NUMBER PATH 'salary';`

??? success "Musterlösung & Erklärung"
    '@id' liest das XML-Attribut id aus (<emp id="7369">).

### `A036` — `XMLAGG` & hierarchisches XML (Department -> Employees)
- **Lernziel:** Mehrere Zeilen zu einem XML-Baum aggregieren (`XMLAGG(XMLELEMENT(...) ORDER BY ...)`), Verschachtelung mit Subqueries *(Bloom: Anwenden)*
- **Selbstlern-Aufgabe (Lückentext/Check):** `SELECT * FROM adv_xml WHERE XMLEXISTS('/dept[loc="NEW YORK"]' ___ doc);`

??? success "Musterlösung & Erklärung"
    PASSING doc prüft per XPath in der WHERE-Klausel.

### `A037` — XPath & XQuery mit `EXTRACTVALUE`, `XMLQUERY` und `XMLEXISTS`
- **Lernziel:** Einfache Einzelwerte (`EXTRACTVALUE` / `EXISTSNODE`, `ORA-19025`-Grenze) sowie den modernen Ersatz `XMLEXISTS` und `XMLQUERY(... PASSING ... RETURNING CONTENT)` einsetzen *(Bloom: Anwenden)*
- **Selbstlern-Aufgabe (Lückentext/Check):** `Warum wirft EXTRACTVALUE(xml_doc, '/catalog/product/name') auf adv_catalog_xml den Fehler ORA-19025, und womit löst man 1:N-Knoten modern auf?`

??? success "Musterlösung & Erklärung"
    Weil zwei `<product>`-Knoten existieren und EXTRACTVALUE genau einen Knoten verlangt. Einzelwert-Fix: `/catalog/product[1]/name` (Legacy) oder `XMLCAST(XMLQUERY(... PASSING ...))`; für alle Zeilen: `XMLTABLE(... PASSING ...)`.

### `A038` — `XMLCAST` & `XMLSERIALIZE`
- **Lernziel:** Konvertierung von XML-Fragmenten in SQL-Skalare (`XMLCAST(XMLQUERY(...) AS VARCHAR2(100))`) und formatierte Ausgabe (`INDENT`) *(Bloom: Anwenden)*
- **Selbstlern-Aufgabe (Lückentext/Check):** `SELECT XMLELEMENT("emps", ___(XMLELEMENT("emp", ename))) FROM scott.emp GROUP BY deptno;`

??? success "Musterlösung & Erklärung"
    XMLAGG aggregiert mehrere XML-Kindelemente je Gruppe.

### `A039` — `XMLTABLE`: XML in relationale Zeilen & Spalten zerlegen
- **Lernziel:** XQuery-Row-Generator + `COLUMNS`-Definition (`PATH`, Datentypen, `FOR ORDINALITY`), Master-Detail über verschachtelte `XMLTABLE`-Joins *(Bloom: Anwenden)*
- **Selbstlern-Aufgabe (Lückentext/Check):** `Wie bindet man einen XML-Namespace in XMLTABLE ein?`

??? success "Musterlösung & Erklärung"
    Mit XMLNAMESPACES('http://...' AS "ns"), direkt vor dem XQuery-Ausdruck.

### `A040` — XML Namespaces in `XMLTABLE` & `XMLEXISTS`
- **Lernziel:** Deklaration von `XMLNAMESPACES(DEFAULT '...', '...' AS "ns")` beim Abfragen realer Schnittstellen-XMLs *(Bloom: Anwenden)*
- **Selbstlern-Aufgabe (Lückentext/Check):** `Welche Performance-Massnahme hilft bei häufigen XPath-Abfragen auf grossen XMLTYPE-Spalten?`

??? success "Musterlösung & Erklärung"
    Binary XML Storage + XMLIndex (unstructured oder structured XMLIndex).

### `A041` — `XMLTRANSFORM` (XSLT) & XML-vs.-JSON-Vergleich
- **Lernziel:** Transformation von XML mittels XSLT-Stylesheet direkt in SQL, Gegenüberstellung `XMLTABLE` vs. `JSON_TABLE` *(Bloom: Anwenden)*
- **Selbstlern-Aufgabe (Lückentext/Check):** `Wann ist JSON gegenüber XML vorzuziehen, wann XML?`

??? success "Musterlösung & Erklärung"
    JSON für leichtgewichtige APIs/Events; XML bei strikten XSD-Verträgen, Attributen, Namespaces und Dokument-Standards (ISO 20022, UBL).

### `A042` — Modul-4-Lab: Produktkatalog- & Rechnungs-Parsing
- **Lernziel:** Komplexes XML mit Namespaces per `XMLTABLE` relational aufbereiten und aggregierte Auswertungen wieder als XML exportieren *(Bloom: Anwenden)*
- **Selbstlern-Aufgabe (Lückentext/Check):** `Zerlege adv_xml per XMLTABLE und joine das Ergebnis mit scott.dept.`

??? success "Musterlösung & Erklärung"
    XMLTABLE als virtuelle Tabelle im FROM-Teil direkt per JOIN verknüpfen.

---

## Selbstlern-Aufgaben (Modul 4)

1. **(★)** Lies aus `adv_catalog_xml` zuerst das Attribut `@dept` per `EXTRACTVALUE` aus und filtere danach mit `XMLEXISTS`, sodass nur Kataloge mit `price > 80` gefunden werden.
2. **(★★)** Berechne per `XMLTABLE` (`PASSING c.xml_doc`) den Durchschnittspreis aller Produkte in `adv_catalog_xml`.
3. **(★★★)** Exportiere `SCOTT.DEPT` (mit verschachtelten `EMP`-Elementen per `XMLAGG`) als wohlgeformtes XML-Dokument.

??? success "Musterlösungen zu Modul 4"
    ```sql
    -- 1:
    SELECT cat_id,
           EXTRACTVALUE(xml_doc, '/catalog/@dept') AS dept_legacy
    FROM adv_catalog_xml
    WHERE XMLEXISTS('/catalog/product[price > 80]' PASSING xml_doc);

    -- 2:
    SELECT AVG(xt.price) AS avg_price
    FROM adv_catalog_xml c,
         XMLTABLE('/catalog/product' PASSING c.xml_doc COLUMNS price NUMBER(10,2) PATH 'price') xt;

    -- 3:
    SELECT XMLELEMENT("department",
             XMLATTRIBUTES(d.deptno AS "id", d.dname AS "name"),
             XMLAGG(XMLELEMENT("employee", e.ename) ORDER BY e.ename)
           ).getClobVal() AS dept_xml
    FROM scott.dept d
    LEFT JOIN scott.emp e ON d.deptno = e.deptno
    GROUP BY d.deptno, d.dname;
    ```

## Oracle-Referenz (26ai)

- [XMLTABLE](https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/XMLTABLE.html)
- [XML DB Developer's Guide](https://docs.oracle.com/en/database/oracle/oracle-database/26/adxdb/index.html)
