# Modul 5: Analytic / Window Functions & Pivoting (`A043`–`A052`)

**Sandbox-Tabellen**: `adv_org_emp`, `SCOTT.EMP`

---

## 1. Mental Model: `GROUP BY` vs. `OVER (PARTITION BY ...)`

- **`GROUP BY`** reduziert Zeilen (aus 14 Employees werden 3 Department-Zeilen).
- **Analytic Functions (`OVER (...)`)** behalten **alle 14 Zeilen** bei und berechnen Gruppenwerte, Rankings oder laufende Summen daneben. Sie laufen logisch *nach* `WHERE`/`GROUP BY`/`HAVING` und *vor* `ORDER BY`.

### Wichtige Window Functions
- **Ranking**: `ROW_NUMBER()` (eindeutig 1,2,3,4), `RANK()` (Lücken bei Gleichstand: 1,2,2,4), `DENSE_RANK()` (ohne Lücken: 1,2,2,3), `NTILE(n)`.
- **Navigation**: `LAG(col, offset, default)` (vorherige Zeile), `LEAD(col, offset, default)` (nächste Zeile).
- **Windowing Clause (`ROWS` vs. `RANGE`)**:
  > **Exam Trap (`LAST_VALUE`)**: Wenn `ORDER BY` in `OVER (...)` steht, ist das Standard-Window `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. Deshalb liefert `LAST_VALUE(sal) OVER (ORDER BY sal)` den aktuellen Wert statt des echten Endwerts — für das volle Fenster brauchst du `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`!
- **`LISTAGG`**: `LISTAGG(ename, ', ') WITHIN GROUP (ORDER BY ename) ON OVERFLOW TRUNCATE '...' WITH COUNT`.
- **`PIVOT` / `UNPIVOT`**: Drehen Zeilen zu Kreuztabellen-Spalten und umgekehrt.

---

## Selbstlern-Aufgaben (Modul 5)

1. **(★)** Finde in `SCOTT.EMP` die **Top 2 Bestverdiener je `deptno`** mittels `DENSE_RANK() OVER (PARTITION BY deptno ORDER BY sal DESC)`.
2. **(★★)** Berechne für `SCOTT.EMP` den prozentualen Anteil jedes Mitarbeiters am Gehalt seiner Abteilung (`ROUND(RATIO_TO_REPORT(sal) OVER (PARTITION BY deptno) * 100, 1)`).
3. **(★★★)** Erstelle mit `PIVOT` eine Kreuztabelle, die für jedes `job` in `SCOTT.EMP` die Gehaltssumme je `deptno IN (10, 20, 30)` als eigene Spalte anzeigt.

??? success "Musterlösungen zu Modul 5"
    ```sql
    -- 1:
    SELECT deptno, ename, sal, rnk
    FROM (
      SELECT deptno, ename, sal,
             DENSE_RANK() OVER (PARTITION BY deptno ORDER BY sal DESC) AS rnk
      FROM scott.emp
    )
    WHERE rnk <= 2;

    -- 2:
    SELECT deptno, ename, sal,
           ROUND(RATIO_TO_REPORT(sal) OVER (PARTITION BY deptno) * 100, 1) AS dept_pct
    FROM scott.emp
    ORDER BY deptno, sal DESC;

    -- 3:
    SELECT *
    FROM (SELECT job, deptno, sal FROM scott.emp)
    PIVOT (
      SUM(sal) FOR deptno IN (10 AS d10, 20 AS d20, 30 AS d30)
    )
    ORDER BY job;
    ```
