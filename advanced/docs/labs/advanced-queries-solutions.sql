-- =============================================================================
-- Advanced Oracle SQL — Musterlösungen zu advanced-queries-sandbox.sql
-- =============================================================================

-- Aufgabe 1 (Modul 1): Bottom-Up-Berichtskette ab Becker
SELECT LEVEL, emp_name, role_name
FROM adv_org_emp
START WITH emp_name = 'Becker'
CONNECT BY PRIOR mgr_id = emp_id;

-- Aufgabe 2 (Modul 2): API-Pfad aus adv_logs extrahieren
SELECT log_id, REGEXP_SUBSTR(raw_line, 'path=([^ ]+)', 1, 1, NULL, 1) AS api_path
FROM adv_logs;

-- Aufgabe 3 (Modul 3): Gesamtbestellwert je order_id per JSON_TABLE
SELECT o.order_id, jt.customer_name, SUM(jt.qty * jt.price) AS order_total
FROM adv_orders_json o,
     JSON_TABLE(o.payload, '$' COLUMNS (
       customer_name VARCHAR2(50) PATH '$.customer.name',
       NESTED PATH '$.items[*]' COLUMNS (qty NUMBER PATH '$.qty', price NUMBER(10,2) PATH '$.price')
     )) jt
GROUP BY o.order_id, jt.customer_name;

-- Aufgabe 4 (Modul 4): Durchschnittspreis per XMLTABLE
SELECT AVG(xt.price) AS avg_price
FROM adv_catalog_xml c,
     XMLTABLE('/catalog/product' PASSING c.xml_doc COLUMNS price NUMBER(10,2) PATH 'price') xt;

-- Aufgabe 5 (Modul 5): Top 2 Bestverdiener je deptno in SCOTT.EMP
SELECT deptno, ename, sal, rnk
FROM (
  SELECT deptno, ename, sal,
         DENSE_RANK() OVER (PARTITION BY deptno ORDER BY sal DESC) AS rnk
  FROM scott.emp
)
WHERE rnk <= 2
ORDER BY deptno, rnk;
