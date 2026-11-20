# Modul 1: Self-Joins, Hierarchien & Rekursive Joins (`A001`–`A010`)

**Voraussetzung**: `1Z0-171` Phasen 1–6 (insbesondere Self-Joins aus `L097`)  
**Sandbox-Tabellen**: `adv_org_emp`, `adv_bom` aus [advanced-queries-sandbox.sql](labs/advanced-queries-sandbox.sql)

---

## 1. Mehrstufige Self-Joins vs. beliebige Baumtiefe (`A001`–`A005`)

Ein klassischer Self-Join (`e LEFT JOIN m ON e.mgr_id = m.emp_id`) kennt nur **eine** feste Ebene. Sobald Organigramme oder Stücklisten beliebig tief werden, nutzt Oracle entweder **`CONNECT BY`** (Oracle-Klassiker) oder den **ANSI-Standard (rekursive `WITH`-CTE)**.

### `CONNECT BY PRIOR` & Hierarchie-Funktionen
```sql
SELECT emp_id,
       LEVEL AS lvl,
       LPAD(' ', (LEVEL - 1) * 2) || emp_name AS org_tree,
       CONNECT_BY_ROOT emp_name AS ceo_name,
       SYS_CONNECT_BY_PATH(emp_name, ' -> ') AS path_from_ceo,
       CONNECT_BY_ISLEAF AS is_leaf
FROM adv_org_emp
START WITH mgr_id IS NULL
CONNECT BY PRIOR emp_id = mgr_id
ORDER SIBLINGS BY emp_name;
```
- **`PRIOR emp_id = mgr_id`**: Top-Down (vom Chef zum Mitarbeiter). Umgekehrt (`PRIOR mgr_id = emp_id`) läuft Bottom-Up.
- **`ORDER SIBLINGS BY`**: Sortiert Geschwisterknoten auf derselben Ebene, **ohne** die Baumstruktur zu zerstören.
- **Zyklen (`ORA-01436`)**: Bei fehlerhaften Schleifen (`A -> B -> A`) verhindert `CONNECT BY NOCYCLE` den Abbruch und `CONNECT_BY_ISCYCLE` markiert die Schleife (`1`).

---

## 2. ANSI-Standard: Rekursive `WITH`-CTE (`A006`–`A009`)

```sql
WITH bom_tree (part_name, total_qty, lvl) AS (
  -- Anchor Member (Wurzel)
  SELECT child_part, qty, 1
  FROM adv_bom
  WHERE parent_part IS NULL
  UNION ALL
  -- Recursive Member
  SELECT b.child_part, t.total_qty * b.qty, t.lvl + 1
  FROM adv_bom b
  JOIN bom_tree t ON b.parent_part = t.part_name
)
SEARCH DEPTH FIRST BY part_name SET order_seq
SELECT part_name, SUM(total_qty) AS total_needed
FROM bom_tree
GROUP BY part_name
ORDER BY part_name;
```
- **Pflichtregel**: Nach dem CTE-Namen (`bom_tree (...)`) müssen in Oracle die Spaltennamen explizit aufgeführt werden!
- **`SEARCH DEPTH FIRST`** vs. **`SEARCH BREADTH FIRST`**: Steuert Tiefen- vs. Breitensuche.
- **`CYCLE col SET is_cycle TO 'Y' DEFAULT 'N'`**: ANSI-Pendant zu `NOCYCLE`.

---

## Selbstlern-Aufgaben (Modul 1)

1. **(★)** Gib mit `CONNECT BY` die gesamte Berichtskette **Bottom-Up** ausgehend von `'Becker'` (`emp_id = 5`) bis zum CEO aus.
2. **(★★)** Finde in `adv_org_emp` alle Mitarbeiter, die **keine** eigenen Untergebenen haben (`CONNECT_BY_ISLEAF = 1`).
3. **(★★★)** Schreibe eine **rekursive `WITH`-CTE** auf `adv_org_emp`, die für jeden Mitarbeiter seinen Pfad (`'Dr. Weber / Schmidt / ...'`) und die Ebene `lvl` ausgibt.

??? success "Musterlösungen zu Modul 1"
    ```sql
    -- 1 (Bottom-Up ab Becker):
    SELECT LEVEL, emp_name, role_name
    FROM adv_org_emp
    START WITH emp_name = 'Becker'
    CONNECT BY PRIOR mgr_id = emp_id;

    -- 2 (Nur Blattknoten):
    SELECT emp_name, role_name
    FROM adv_org_emp
    WHERE CONNECT_BY_ISLEAF = 1
    START WITH mgr_id IS NULL
    CONNECT BY PRIOR emp_id = mgr_id;

    -- 3 (Rekursive WITH-CTE mit Pfad):
    WITH org_cte (emp_id, emp_name, lvl, org_path) AS (
      SELECT emp_id, emp_name, 1, emp_name
      FROM adv_org_emp
      WHERE mgr_id IS NULL
      UNION ALL
      SELECT e.emp_id, e.emp_name, c.lvl + 1, c.org_path || ' / ' || e.emp_name
      FROM adv_org_emp e
      JOIN org_cte c ON e.mgr_id = c.emp_id
    )
    SELECT lvl, emp_name, org_path FROM org_cte;
    ```
