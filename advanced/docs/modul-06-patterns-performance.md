# Modul 6: Erweiterte Query-Patterns & Performance (`A053`–`A060`)

**Sandbox-Tabellen**: `SCOTT.EMP`, `SCOTT.DEPT`, `adv_org_emp`

---

## 1. Mehrdimensionale Aggregation (`ROLLUP`, `CUBE`, `GROUPING SETS`)
- **`GROUP BY ROLLUP(a, b)`**: Erzeugt `(a, b)`, `(a)`-Zwischensummen und `()`-Gesamtsumme.
- **`GROUP BY CUBE(a, b)`**: Erzeugt alle 4 Kombinationen `(a, b)`, `(a)`, `(b)`, `()`.
- **`GROUPING(col)`**: Liefert `1`, wenn `NULL` durch eine Subtotal-/Total-Zeile entstanden ist, und `0` bei echten Datenwerten.

## 2. `CROSS APPLY` / `OUTER APPLY` (`A055`)
Korrelierte Tabellenfunktionen direkt in der `FROM`-Klausel — z. B. „Top 2 Mitarbeiter pro Department“ ohne umständliche Subquery-Verschachtelung:
```sql
SELECT d.dname, t.ename, t.sal
FROM scott.dept d
OUTER APPLY (
  SELECT e.ename, e.sal
  FROM scott.emp e
  WHERE e.deptno = d.deptno
  ORDER BY e.sal DESC
  FETCH FIRST 2 ROWS ONLY
) t;
```

## 3. Row Pattern Matching: `MATCH_RECOGNIZE` (`A056`–`A057`)
Erkennt Muster über sortierte Zeilen hinweg (z. B. Gehaltsanstiege, Islands & Gaps, Sessionization) mit `PARTITION BY`, `ORDER BY`, `MEASURES`, `PATTERN` und `DEFINE`.

## 4. Execution Plans lesen (`EXPLAIN PLAN` & `DBMS_XPLAN.DISPLAY`) (`A059`)
```sql
EXPLAIN PLAN FOR
SELECT e.ename, d.dname FROM scott.emp e JOIN scott.dept d ON e.deptno = d.deptno;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```
Achte besonders auf: **Operation** (`TABLE ACCESS FULL` vs. `INDEX RANGE SCAN`), **Rows (Cardinality)**, **Cost** sowie **Access vs. Filter Predicates** im unteren Abschnitt.

---

## Selbstlern-Aufgaben (Modul 6)

1. **(★)** Erstelle auf `SCOTT.EMP` eine `ROLLUP(deptno, job)`-Auswertung mit `GROUPING(deptno)` und sprechendem Label `'GESAMT'` für die Gesamtsumme.
2. **(★★)** Nutze `OUTER APPLY`, um zu jedem Department in `SCOTT.DEPT` den bestbezahlten Mitarbeiter auszugeben (inkl. `DEPT 40 OPERATIONS` mit `NULL`).
3. **(★★★)** Finde in einer Zahlenfolge (`1, 2, 3, 5, 6, 9`) per `MATCH_RECOGNIZE` alle zusammenhängenden „Inseln“ (Startwert, Endwert, Länge).

??? success "Musterlösungen zu Modul 6"
    ```sql
    -- 1:
    SELECT CASE WHEN GROUPING(deptno) = 1 THEN 'GESAMT' ELSE TO_CHAR(deptno) END AS dept,
           CASE WHEN GROUPING(job) = 1    THEN 'SUBTOTAL' ELSE job END AS job_grp,
           SUM(sal) AS total_sal
    FROM scott.emp
    GROUP BY ROLLUP(deptno, job);

    -- 2:
    SELECT d.dname, top_emp.ename, top_emp.sal
    FROM scott.dept d
    OUTER APPLY (
      SELECT e.ename, e.sal FROM scott.emp e
      WHERE e.deptno = d.deptno
      ORDER BY e.sal DESC FETCH FIRST 1 ROW ONLY
    ) top_emp;

    -- 3:
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
    ```
