-- =============================================================================
-- Advanced Oracle SQL Sandbox (Module 1 - 6)
-- Kompatibel mit Oracle Database 23ai Free, OCI Autonomous DB & Oracle FreeSQL
-- Hinweis: Keine '&'-Zeichen enthalten (kein interaktiver Prompt).
-- =============================================================================

-- Cleanup (idempotent: auch beim allerersten Durchlauf fehlerfrei)
BEGIN EXECUTE IMMEDIATE 'DROP TABLE adv_org_emp PURGE';    EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE adv_bom PURGE';        EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE adv_logs PURGE';       EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE adv_orders_json PURGE'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE adv_catalog_xml PURGE'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

-- -----------------------------------------------------------------------------
-- 1. Modul 1: Hierarchien, Self-Joins & Rekursive CTEs
-- -----------------------------------------------------------------------------
CREATE TABLE adv_org_emp (
  emp_id    NUMBER PRIMARY KEY,
  emp_name  VARCHAR2(50) NOT NULL,
  role_name VARCHAR2(40) NOT NULL,
  mgr_id    NUMBER REFERENCES adv_org_emp(emp_id),
  salary    NUMBER(10,2) NOT NULL
);

INSERT INTO adv_org_emp VALUES (1, 'Dr. Weber',   'CEO',           NULL, 18000);
INSERT INTO adv_org_emp VALUES (2, 'Schmidt',     'VP Engineering',   1, 13500);
INSERT INTO adv_org_emp VALUES (3, 'Meyer',       'VP Sales',         1, 13000);
INSERT INTO adv_org_emp VALUES (4, 'Klein',       'Lead Architect',   2, 10200);
INSERT INTO adv_org_emp VALUES (5, 'Becker',      'Data Engineer',    4,  8400);
INSERT INTO adv_org_emp VALUES (6, 'Hoffmann',    'SQL Specialist',   4,  8100);
INSERT INTO adv_org_emp VALUES (7, 'Wagner',      'Account Exec',     3,  7600);

CREATE TABLE adv_bom (
  parent_part VARCHAR2(30),
  child_part  VARCHAR2(30) NOT NULL,
  qty         NUMBER NOT NULL
);

INSERT INTO adv_bom VALUES (NULL,         'E-BIKE',      1);
INSERT INTO adv_bom VALUES ('E-BIKE',     'RAHMEN',      1);
INSERT INTO adv_bom VALUES ('E-BIKE',     'ANTRIEB',     1);
INSERT INTO adv_bom VALUES ('ANTRIEB',    'MOTOR',       1);
INSERT INTO adv_bom VALUES ('ANTRIEB',    'AKKU',        1);
INSERT INTO adv_bom VALUES ('RAHMEN',     'SCHRAUBE-M6', 8);
INSERT INTO adv_bom VALUES ('ANTRIEB',    'SCHRAUBE-M6', 4);

-- Beispiel Modul 1A: CONNECT BY mit Pfad & Einrueckung
SELECT emp_id,
       LEVEL AS lvl,
       LPAD(' ', (LEVEL - 1) * 2) || emp_name AS org_tree,
       SYS_CONNECT_BY_PATH(emp_name, ' -> ') AS path_from_ceo,
       CONNECT_BY_ISLEAF AS is_leaf
FROM adv_org_emp
START WITH mgr_id IS NULL
CONNECT BY PRIOR emp_id = mgr_id
ORDER SIBLINGS BY emp_name;

-- Beispiel Modul 1B: ANSI Rekursive WITH-CTE fuer Stueckliste (BOM)
WITH bom_tree (part_name, total_qty, lvl) AS (
  SELECT child_part, qty, 1
  FROM adv_bom
  WHERE parent_part IS NULL
  UNION ALL
  SELECT b.child_part, t.total_qty * b.qty, t.lvl + 1
  FROM adv_bom b
  JOIN bom_tree t ON b.parent_part = t.part_name
)
SELECT part_name, SUM(total_qty) AS total_needed
FROM bom_tree
GROUP BY part_name
ORDER BY part_name;

-- -----------------------------------------------------------------------------
-- 2. Modul 2: Regular Expressions (REGEXP_*)
-- -----------------------------------------------------------------------------
CREATE TABLE adv_logs (
  log_id   NUMBER PRIMARY KEY,
  raw_line VARCHAR2(400) NOT NULL
);

INSERT INTO adv_logs VALUES (1, '2026-11-19 08:15:02 [INFO] user=alice ip=192.168.10.24 status=200 path=/api/orders');
INSERT INTO adv_logs VALUES (2, '2026-11-19 08:16:44 [WARN] user=bob ip=10.0.4.12 status=404 path=/api/invoices/99');
INSERT INTO adv_logs VALUES (3, '2026-11-19 08:19:10 [ERROR] user=carol ip=172.16.0.5 status=500 path=/api/payments');

-- Beispiel Modul 2: Capture Groups mit REGEXP_SUBSTR (subexpr)
SELECT log_id,
       REGEXP_SUBSTR(raw_line, '\[([A-Z]+)\]', 1, 1, NULL, 1) AS severity,
       REGEXP_SUBSTR(raw_line, 'user=([a-z0-9_]+)', 1, 1, NULL, 1) AS username,
       REGEXP_SUBSTR(raw_line, 'ip=([0-9.]+)', 1, 1, NULL, 1) AS ip_addr,
       TO_NUMBER(REGEXP_SUBSTR(raw_line, 'status=([0-9]{3})', 1, 1, NULL, 1)) AS http_status
FROM adv_logs
WHERE REGEXP_LIKE(raw_line, '\[(WARN|ERROR)\]');

-- -----------------------------------------------------------------------------
-- 3. Modul 3: JSON in Oracle SQL
-- -----------------------------------------------------------------------------
CREATE TABLE adv_orders_json (
  order_id NUMBER PRIMARY KEY,
  payload  CLOB CHECK (payload IS JSON)
);

INSERT INTO adv_orders_json VALUES (1001, '{
  "customer": { "name": "TechGmbH", "tier": "GOLD" },
  "orderDate": "2026-11-18",
  "items": [
    { "sku": "SQL-BOOK", "qty": 3, "price": 49.90 },
    { "sku": "DB-LICENSE", "qty": 1, "price": 1200.00 }
  ]
}');

INSERT INTO adv_orders_json VALUES (1002, '{
  "customer": { "name": "DataAG", "tier": "SILVER" },
  "orderDate": "2026-11-19",
  "items": [
    { "sku": "SQL-BOOK", "qty": 5, "price": 45.00 }
  ]
}');

-- Beispiel Modul 3: JSON_TABLE mit NESTED PATH
SELECT o.order_id,
       jt.customer_name,
       jt.tier,
       jt.item_pos,
       jt.sku,
       jt.qty,
       jt.price,
       jt.qty * jt.price AS line_total
FROM adv_orders_json o,
     JSON_TABLE(
       o.payload, '$'
       COLUMNS (
         customer_name VARCHAR2(50) PATH '$.customer.name',
         tier          VARCHAR2(20) PATH '$.customer.tier',
         NESTED PATH '$.items[*]'
         COLUMNS (
           item_pos FOR ORDINALITY,
           sku      VARCHAR2(30) PATH '$.sku',
           qty      NUMBER       PATH '$.qty',
           price    NUMBER(10,2) PATH '$.price'
         )
       )
     ) jt;

-- -----------------------------------------------------------------------------
-- 4. Modul 4: XML in Oracle SQL
-- -----------------------------------------------------------------------------
CREATE TABLE adv_catalog_xml (
  cat_id  NUMBER PRIMARY KEY,
  xml_doc XMLTYPE
);

INSERT INTO adv_catalog_xml VALUES (1, XMLTYPE('
<catalog dept="IT">
  <product id="P10">
    <name>Oracle 23ai Guide</name>
    <price currency="EUR">59.00</price>
  </product>
  <product id="P20">
    <name>SQL Tuning Workshop</name>
    <price currency="EUR">89.50</price>
  </product>
</catalog>
'));

-- Beispiel Modul 4: XMLTABLE
SELECT c.cat_id,
       xt.dept,
       xt.prod_id,
       xt.prod_name,
       xt.price,
       xt.currency
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

-- -----------------------------------------------------------------------------
-- 5. Modul 5: Window Functions (OVER, RANK, LAG, LISTAGG)
-- -----------------------------------------------------------------------------
SELECT emp_name,
       role_name,
       salary,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS sal_rank,
       SUM(salary) OVER (ORDER BY salary DESC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
       salary - LAG(salary) OVER (ORDER BY salary DESC) AS diff_to_prev
FROM adv_org_emp;

-- -----------------------------------------------------------------------------
-- 6. Modul 6: ROLLUP, OUTER APPLY, MATCH_RECOGNIZE & Execution Plans
-- -----------------------------------------------------------------------------
SELECT CASE WHEN GROUPING(deptno) = 1 THEN 'GESAMT' ELSE TO_CHAR(deptno) END AS dept,
       CASE WHEN GROUPING(job) = 1    THEN 'SUBTOTAL' ELSE job END AS job_grp,
       SUM(sal) AS total_sal
FROM scott.emp
GROUP BY ROLLUP(deptno, job);

SELECT d.dname, top_emp.ename, top_emp.sal
FROM scott.dept d
OUTER APPLY (
  SELECT e.ename, e.sal
  FROM scott.emp e
  WHERE e.deptno = d.deptno
  ORDER BY e.sal DESC
  FETCH FIRST 1 ROW ONLY
) top_emp;

WITH nums AS (
  SELECT 1 n FROM dual UNION ALL SELECT 2 FROM dual UNION ALL SELECT 3 FROM dual
  UNION ALL SELECT 5 FROM dual UNION ALL SELECT 6 FROM dual UNION ALL SELECT 9 FROM dual
)
SELECT start_n, end_n, island_len
FROM nums
MATCH_RECOGNIZE (
  ORDER BY n
  MEASURES FIRST(n) AS start_n, LAST(n) AS end_n, COUNT(*) AS island_len
  PATTERN (strt consec*)
  DEFINE consec AS n = PREV(n) + 1
);

EXPLAIN PLAN FOR
SELECT e.ename, d.dname FROM scott.emp e JOIN scott.dept d ON e.deptno = d.deptno;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);

COMMIT;

-- -----------------------------------------------------------------------------
-- 7. Selbststaendige Uebungsaufgaben (Loesungen in advanced-queries-solutions.sql)
-- -----------------------------------------------------------------------------
-- Aufgabe 1 (Modul 1): Zeige mit CONNECT BY den Pfad von 'Becker' (Bottom-Up) bis zum CEO.
-- TODO: Deine Query hier

-- Aufgabe 2 (Modul 2): Extrahiere aus adv_logs den API-Pfad nach path= per REGEXP_SUBSTR.
-- TODO: Deine Query hier

-- Aufgabe 3 (Modul 3): Berechne per JSON_TABLE den Gesamtbestellwert je order_id.
-- TODO: Deine Query hier

-- Aufgabe 4 (Modul 4): Berechne per XMLTABLE den Durchschnittspreis in adv_catalog_xml.
-- TODO: Deine Query hier

-- Aufgabe 5 (Modul 5): Finde die Top 2 Bestverdiener je deptno in SCOTT.EMP mittels DENSE_RANK.
-- TODO: Deine Query hier

