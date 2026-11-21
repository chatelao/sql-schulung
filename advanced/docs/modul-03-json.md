# Modul 3: JSON in Oracle SQL (`A021`–`A032`)

**Sandbox-Tabellen**: `adv_orders_json` aus [advanced-queries-sandbox.sql](labs/advanced-queries-sandbox.sql)

---

## 1. JSON abfragen: Dot-Notation, `JSON_VALUE`, `JSON_QUERY`, `JSON_TABLE`

In Oracle 21c/23ai gibt es den nativen binären **`JSON`**-Datentyp sowie `CLOB`/`VARCHAR2` mit `CHECK (col IS JSON)`.

| Funktion | Rückgabe | Typischer Einsatz |
| :--- | :--- | :--- |
| **Simple Dot Notation** | Skalar oder JSON-Fragment | `SELECT o.payload.customer.name FROM adv_orders_json o;` *(Tabellenalias Pflicht!)* |
| `JSON_VALUE` | **Einzelner SQL-Skalar** (`VARCHAR2`, `NUMBER`, `DATE`) | `JSON_VALUE(payload, '$.customer.tier' RETURNING VARCHAR2(20))` |
| `JSON_QUERY` | **JSON-Objekt oder Array** | `JSON_QUERY(payload, '$.items[*]' WITH WRAPPER)` |
| `JSON_EXISTS` | Wahrheitswert in `WHERE` | `WHERE JSON_EXISTS(payload, '$.items?(@.qty >= 5)')` |
| `JSON_TABLE` | **Virtuelle relationale Tabelle** | Master-Detail-Auflösung mit `NESTED PATH '$.items[*]'` |

### `JSON_TABLE` mit `NESTED PATH`
```sql
SELECT o.order_id, jt.customer_name, jt.item_pos, jt.sku, jt.qty * jt.price AS line_total
FROM adv_orders_json o,
     JSON_TABLE(
       o.payload, '$'
       COLUMNS (
         customer_name VARCHAR2(50) PATH '$.customer.name',
         NESTED PATH '$.items[*]'
         COLUMNS (
           item_pos FOR ORDINALITY,
           sku      VARCHAR2(30) PATH '$.sku',
           qty      NUMBER       PATH '$.qty',
           price    NUMBER(10,2) PATH '$.price'
         )
       )
     ) jt;
```

---

## 2. JSON aus relationalen Tabellen erzeugen & ändern (`A028`–`A031`)
- **`JSON_OBJECT` / `JSON_ARRAY` / `JSON_ARRAYAGG`**: Erzeugen strukturierte JSON-Payloads direkt aus `SCOTT.EMP` und `SCOTT.DEPT`.
- **`JSON_TRANSFORM`**: Deklarative Teil-Updates (`SET`, `INSERT`, `REMOVE`, `APPEND`) ohne das gesamte Dokument neu zu schreiben.
- **23ai JSON Relational Duality Views**: Verbinden relationale Normalisierung mit direktem Dokumenten-Zugriff (REST/Mongo-kompatibel).

---

## Selbstlern-Aufgaben (Modul 3)

1. **(★)** Gib mit `JSON_VALUE` für jede Bestellung aus `adv_orders_json` die `order_id`, den Kundennamen und das `orderDate` (als `DATE`) aus.
2. **(★★)** Berechne per `JSON_TABLE` den **Gesamtbestellwert** (`SUM(qty * price)`) je `order_id` und `customer_name`.
3. **(★★★)** Erzeuge aus `SCOTT.DEPT` und `SCOTT.EMP` für jede Abteilung ein JSON-Objekt mit `dname` und einem `employees`-Array (`JSON_ARRAYAGG`).

??? success "Musterlösungen zu Modul 3"
    ```sql
    -- 1:
    SELECT order_id,
           JSON_VALUE(payload, '$.customer.name') AS cust_name,
           JSON_VALUE(payload, '$.orderDate' RETURNING DATE) AS order_dt
    FROM adv_orders_json;

    -- 2:
    SELECT o.order_id, jt.customer_name, SUM(jt.qty * jt.price) AS order_total
    FROM adv_orders_json o,
         JSON_TABLE(o.payload, '$' COLUMNS (
           customer_name VARCHAR2(50) PATH '$.customer.name',
           NESTED PATH '$.items[*]' COLUMNS (qty NUMBER PATH '$.qty', price NUMBER(10,2) PATH '$.price')
         )) jt
    GROUP BY o.order_id, jt.customer_name;

    -- 3:
    SELECT JSON_OBJECT(
             'department' VALUE d.dname,
             'employees'  VALUE JSON_ARRAYAGG(e.ename ORDER BY e.ename)
           ) AS dept_json
    FROM scott.dept d
    LEFT JOIN scott.emp e ON d.deptno = e.deptno
    GROUP BY d.dname;
    ```

## Oracle-Referenz (26ai)

- [JSON_TABLE](https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/JSON_TABLE.html)
- [JSON Developer's Guide](https://docs.oracle.com/en/database/oracle/oracle-database/26/adjsn/index.html)
