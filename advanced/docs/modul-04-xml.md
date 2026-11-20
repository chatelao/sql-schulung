# Modul 4: XML in Oracle SQL (`A033`–`A042`)

**Sandbox-Tabellen**: `adv_catalog_xml` aus [advanced-queries-sandbox.sql](labs/advanced-queries-sandbox.sql)

---

## 1. XML generieren & abfragen (`XMLType`, `XMLELEMENT`, `XMLTABLE`)

| Konstrukt | Zweck |
| :--- | :--- |
| `XMLELEMENT("emp", XMLATTRIBUTES(empno AS "id"), ename)` | Erzeugt XML-Elemente & Attribute |
| `XMLFOREST(ename, job, sal)` | Erzeugt mehrere Kind-Elemente (lässt `NULL`s weg) |
| `XMLAGG(XMLELEMENT(...) ORDER BY ...)` | Aggregiert mehrere Zeilen in einen XML-Baum |
| `XMLEXISTS` / `XMLQUERY` / `XMLCAST` | XPath-/XQuery-Filter & skalare Extraktion |
| `XMLTABLE` | Zerlegt XML-Knoten in relationale Zeilen & Spalten |

### `XMLTABLE`-Beispiel
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

---

## Selbstlern-Aufgaben (Modul 4)

1. **(★)** Filtere `adv_catalog_xml` mit `XMLEXISTS`, sodass nur Kataloge gefunden werden, die ein Produkt mit `price > 80` enthalten.
2. **(★★)** Berechne per `XMLTABLE` den Durchschnittspreis aller Produkte in `adv_catalog_xml`.
3. **(★★★)** Exportiere `SCOTT.DEPT` (mit verschachtelten `EMP`-Elementen per `XMLAGG`) als wohlgeformtes XML-Dokument.

??? success "Musterlösungen zu Modul 4"
    ```sql
    -- 1:
    SELECT cat_id FROM adv_catalog_xml
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
