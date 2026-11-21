# Advanced Checkpoints (`ACP-1` & `ACP-2`)

Zur Standortbestimmung im 60-Lektionen-Aufbaupfad stehen zwei Checkpoints bereit: **`ACP-1`** nach Modul 3 (Hierarchien, Regex, JSON) und **`ACP-2`** nach Modul 6 (XML, Window Functions, Query-Patterns & Performance).

---

## `ACP-1`: Halbzeit-Check (Module 1–3, `A001`–`A032`)

### Teil A: Verständnis-Check (5 Kurzfragen)
1. Welche Klausel verhindert bei `CONNECT BY` einen Abbruch durch `ORA-01436`?
2. Worin liegt der Unterschied zwischen `SEARCH DEPTH FIRST` und `SEARCH BREADTH FIRST` in einer rekursiven `WITH`-CTE?
3. Was bewirkt der Parameter `return_option = 1` bei `REGEXP_INSTR`?
4. Wann liefert `REGEXP_SUBSTR('<b>1</b><b>2</b>', '<b>.*</b>')` zu viel Text, und wie fixt man es?
5. Welche Funktion nutzt du, um ein JSON-Array in relationale Zeilen umzuwandeln (`JSON_VALUE`, `JSON_QUERY` oder `JSON_TABLE`)?

### Teil B: Praxis-SQL-Aufgaben
1. **Hierarchie (`SCOTT.EMP`):** Gib alle Mitarbeitenden ab `KING` mit Einrückung (`LPAD`) und Pfad (`SYS_CONNECT_BY_PATH`), innerhalb derselben Ebene alphabetisch sortiert (`ORDER SIBLINGS BY`).
2. **JSON + Regex:** Extrahiere aus `adv_orders` per `JSON_TABLE` alle `sku`-Werte, die mit einem Grossbuchstaben beginnen (`REGEXP_LIKE`).

??? success "Musterlösungen `ACP-1`"
    **Teil A:**
    1. `CONNECT BY NOCYCLE` (mit `CONNECT_BY_ISCYCLE` zur Markierung).
    2. `DEPTH FIRST` arbeitet Ast für Ast vollständig in die Tiefe ab; `BREADTH FIRST` gibt zuerst alle Knoten derselben Ebene aus.
    3. `1` liefert die Position direkt **nach** dem Treffer (statt des Startindex `0`).
    4. `.*` ist greedy (gierig); non-greedy `.*?` stoppt beim ersten `</b>`.
    5. `JSON_TABLE` (mit `$.array[*]` bzw. `NESTED PATH`).

    **Teil B:**
    ```sql
    -- 1. Hierarchie
    SELECT LPAD(' ', (LEVEL - 1) * 2) || ename AS tree,
           SYS_CONNECT_BY_PATH(ename, ' / ') AS path
    FROM scott.emp
    START WITH mgr IS NULL
    CONNECT BY PRIOR empno = mgr
    ORDER SIBLINGS BY ename;

    -- 2. JSON_TABLE + REGEXP_LIKE
    SELECT o.order_id, jt.sku
    FROM adv_orders o,
         JSON_TABLE(o.doc, '$.items[*]'
           COLUMNS (sku VARCHAR2(30) PATH '$.sku')) jt
    WHERE REGEXP_LIKE(jt.sku, '^[A-Z]');
    ```

---

## `ACP-2`: Abschluss-Check (Module 4–6, `A033`–`A060`)

### Teil A: Verständnis-Check (5 Kurzfragen)
1. Wie liest man in `XMLTABLE` ein XML-Attribut (z. B. `<emp id="7369">`) aus?
2. Warum liefert `LAST_VALUE(sal) OVER (ORDER BY sal)` oft die aktuelle Zeile statt des Gesamtmaximums?
3. Was ist der Unterschied zwischen `RANK()` und `DENSE_RANK()` bei Gleichstand?
4. Wozu dient `GROUPING(col)` in einer `ROLLUP`- oder `CUBE`-Abfrage?
5. Warum verhindert `WHERE UPPER(ename) = 'SMITH'` einen normalen B-Tree-Index auf `ename`?

### Teil B: Praxis-SQL-Aufgaben
1. **Window Functions (`SCOTT.EMP`):** Berechne pro Abteilung (`deptno`) den laufenden Gehalts-Anteil sowie den Abstand zum nächsthöheren Gehalt innerhalb derselben Abteilung (`LAG` oder `LEAD`).
2. **Lateral Join (`OUTER APPLY`):** Gib zu jeder `scott.dept`-Abteilung (inkl. `DEPT 40`) die maximal 2 bestbezahlten Mitarbeitenden aus.

??? success "Musterlösungen `ACP-2`"
    **Teil A:**
    1. Mit `@`-Präfix im `PATH`: `COLUMNS empno NUMBER PATH '@id'`.
    2. Weil das Standard-Window-Frame bei `ORDER BY` `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` ist — für das gesamte Fenster benötigt man `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.
    3. `RANK()` lässt Lücken (`1, 2, 2, 4`), `DENSE_RANK()` nicht (`1, 2, 2, 3`).
    4. `GROUPING(col)` liefert `1` für synthetische Summen-`NULL`s und `0` für echte Datenzeilen.
    5. Weil der Index auf dem rohen `ename` liegt; Lösung ist ein Function-Based Index auf `UPPER(ename)`.

    **Teil B:**
    ```sql
    -- 1. Window Functions
    SELECT deptno, ename, sal,
           SUM(sal) OVER (PARTITION BY deptno) AS dept_total,
           LEAD(sal) OVER (PARTITION BY deptno ORDER BY sal DESC) AS next_lower_sal
    FROM scott.emp;

    -- 2. OUTER APPLY
    SELECT d.dname, e.ename, e.sal
    FROM scott.dept d
    OUTER APPLY (
      SELECT ename, sal
      FROM scott.emp emp
      WHERE emp.deptno = d.deptno
      ORDER BY sal DESC
      FETCH FIRST 2 ROWS ONLY
    ) e;
    ```
