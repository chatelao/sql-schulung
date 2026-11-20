# Phase 5: Displaying Data from Multiple Tables — Joins (`L083`–`L102`)

**Exam Domain**: Domain 4 (*Displaying Data from Multiple Tables*, 10 %)  
**Verwendete Schemas**: `SCOTT` (`EMP`, `DEPT`, `SALGRADE`), `HR` (`EMPLOYEES`, `DEPARTMENTS`, `LOCATIONS`, `COUNTRIES`)  
**Interactive Studio**: [Phase 5 Tracker](https://chatelao.github.io/sql-schulung/#curriculum/phase-5) · [Join Visualizer](https://chatelao.github.io/sql-schulung/#labs/joins) · [FreeSQL Sandbox](https://chatelao.github.io/sql-schulung/#labs/freesql/phase-5) · [Flashcards D4](https://chatelao.github.io/sql-schulung/#flashcards/D4)

---

## Join Mental Model & `CROSS JOIN` (`L083`–`L085`)

### `L083` — Warum Joins existieren & Row-Matching-Intuition
- **Lernziel**: Du verstehst visuell, wie jede Zeile der linken Tabelle über einen Schlüsselwert ihre passende(n) Zeile(n) in der rechten Tabelle findet.
- **Studio-Link**: [Tracker `L083`](https://chatelao.github.io/sql-schulung/#curriculum/L083) · [Join Visualizer öffnen ↗](https://chatelao.github.io/sql-schulung/#labs/joins/INNER)

### `L084` — Cartesian Products (`CROSS JOIN`)
- **Lernziel**: Du erkennst, wann ein Kreuzprodukt (`N × M` Zeilen) entsteht und wie du es mit `CROSS JOIN` explizit schreibst.
- **Studio-Link**: [Tracker `L084`](https://chatelao.github.io/sql-schulung/#curriculum/L084) · [Join Visualizer: CROSS ↗](https://chatelao.github.io/sql-schulung/#labs/joins/CROSS)
- **Beispiel**: `SELECT e.ename, d.dname FROM scott.emp e CROSS JOIN scott.dept d;` → **`14 × 4 = 56` Zeilen**.

### `L085` — Mehrdeutige Spalten auflösen (`ORA-00918`)
- **Lernziel**: Du qualifizierst gleichnamige Spalten konsequent mit Table Aliases.
- **Studio-Link**: [Tracker `L085`](https://chatelao.github.io/sql-schulung/#curriculum/L085)
- **Exam Trap**: `SELECT ename, deptno, dname FROM scott.emp e JOIN scott.dept d ON e.deptno = d.deptno;` wirft **`ORA-00918: column ambiguously defined`**, weil `deptno` in beiden Tabellen existiert. Lösung: `e.deptno` (oder `d.deptno`).

---

## `INNER JOIN ... ON`, `NATURAL JOIN` & `USING` (`L086`–`L092`)

### `L086` — Standard `INNER JOIN ... ON`
- **Lernziel**: Du verknüpfst zwei Tabellen über `INNER JOIN ... ON` und weißt, dass ungematchte Zeilen wegfallen.
- **Studio-Link**: [Tracker `L086`](https://chatelao.github.io/sql-schulung/#curriculum/L086)
- **Beispiel**:
  ```sql
  SELECT e.empno, e.ename, e.deptno, d.dname, d.loc
  FROM scott.emp e
  INNER JOIN scott.dept d ON e.deptno = d.deptno;
  ```
  **Erwartete Ausgabe**: 14 Zeilen — `DEPT 40 (OPERATIONS)` fehlt!

### `L087` — Drei oder mehr Tabellen joinen (`HR`)
- **Lernziel**: Du verkettest 3–4 Tabellen über `JOIN ... ON` entlang des ERD.
- **Studio-Link**: [Tracker `L087`](https://chatelao.github.io/sql-schulung/#curriculum/L087)
- **Beispiel**:
  ```sql
  SELECT e.last_name, d.department_name, l.city, c.country_name
  FROM hr.employees e
  JOIN hr.departments d ON e.department_id = d.department_id
  JOIN hr.locations l   ON d.location_id = l.location_id
  JOIN hr.countries c   ON l.country_id = c.country_id;
  -- Erwartet: 106 Zeilen (Kimberely Grant hat department_id IS NULL!)
  ```

### `L088` — `WHERE` & `GROUP BY` mit Joins kombinieren
- **Lernziel**: Du filterst und aggregierst über gejointe Tabellen hinweg.
- **Studio-Link**: [Tracker `L088`](https://chatelao.github.io/sql-schulung/#curriculum/L088)
- **Selbstlern-Aufgabe**: Berechne je `d.dname` und `d.loc` in `SCOTT` die Mitarbeiteranzahl und Gehaltssumme für Mitarbeiter mit `e.sal >= 1000` (erwartet: 3 Zeilen).
  ??? success "Musterlösung & Erklärung"
      ```sql
      SELECT d.dname, d.loc, COUNT(*) AS cnt, SUM(e.sal) AS total_sal
      FROM scott.emp e
      JOIN scott.dept d ON e.deptno = d.deptno
      WHERE e.sal >= 1000
      GROUP BY d.dname, d.loc;
      ```

### `L089` — `NATURAL JOIN` & seine versteckte Multi-Column-Falle
- **Lernziel**: Du durchschaust die Risiken von `NATURAL JOIN` bei mehreren gleichnamigen Spalten.
- **Studio-Link**: [Tracker `L089`](https://chatelao.github.io/sql-schulung/#curriculum/L089)
- **Beispiel**:
  ```sql
  -- In SCOTT ok (nur DEPTNO stimmt überein -> 14 Zeilen):
  SELECT empno, ename, dname FROM scott.emp NATURAL JOIN scott.dept;

  -- FALLE IN HR: Sowohl DEPARTMENT_ID als auch MANAGER_ID sind gleichnamig!
  SELECT employee_id, last_name, department_name
  FROM hr.employees NATURAL JOIN hr.departments; -- Nur 32 statt 106 Zeilen!
  ```

### `L090` — `JOIN ... USING (col)`
- **Lernziel**: Du verknüpfst explizit benannte gleichnamige Spalten mit `USING`.
- **Studio-Link**: [Tracker `L090`](https://chatelao.github.io/sql-schulung/#curriculum/L090)
- **Beispiel**: `SELECT e.ename, deptno, d.dname FROM scott.emp e JOIN scott.dept d USING (deptno);` → 14 Zeilen.

### `L091` — Die `ORA-25154`-Regel (`USING`-Qualifier-Falle)
- **Lernziel**: Du vermeidest den häufigsten Prüfungsfehler bei `USING`.
- **Studio-Link**: [Tracker `L091`](https://chatelao.github.io/sql-schulung/#curriculum/L091)
- !!! warning "1Z0-171 Exam Trap (`ORA-25154`)"
    Setze vor eine in `USING (...)` aufgeführte Spalte **niemals** einen Tabellennamen oder Alias – weder in `SELECT`, `WHERE`, `GROUP BY` noch in `ORDER BY`! `SELECT e.deptno ... USING (deptno)` wirft **`ORA-25154`**.

### `L092` — Vergleich: `ON`, `USING` und `NATURAL JOIN`
- **Lernziel**: Du wählst für jede Anforderung die passende Join-Variante.
- **Studio-Link**: [Tracker `L092`](https://chatelao.github.io/sql-schulung/#curriculum/L092)

| Join-Art | Verknüpfte Spalten | Qualifier auf Join-Spalte erlaubt? | Ungleiche Spaltennamen möglich? |
| :--- | :--- | :---: | :---: |
| `JOIN ... ON` | Explizite Bedingung | **Ja** (Pflicht!) | **Ja** (`e.mgr = m.empno`) |
| `JOIN ... USING (c)` | Explizit benannte Spalte `c` | **Nein** (`ORA-25154`) | Nein |
| `NATURAL JOIN` | *Alle* gleichnamigen Spalten | **Nein** (`ORA-25155`) | Nein |

---

## Outer Joins (`LEFT`, `RIGHT`, `FULL`) (`L093`–`L096`)

### `L093` — `LEFT OUTER JOIN` (`HR` Unassigned Employees)
- **Lernziel**: Du bewahrst alle Zeilen der linken Tabelle, auch ohne Treffer rechts.
- **Studio-Link**: [Tracker `L093`](https://chatelao.github.io/sql-schulung/#curriculum/L093) · [Join Visualizer: LEFT ↗](https://chatelao.github.io/sql-schulung/#labs/joins/LEFT)
- **Beispiel**: `SELECT e.last_name, d.department_name FROM hr.employees e LEFT OUTER JOIN hr.departments d ON e.department_id = d.department_id;` → 107 Zeilen (inkl. Kimberely Grant mit `NULL`).

### `L094` — `RIGHT OUTER JOIN` (`SCOTT.DEPT` #40 `OPERATIONS` erhalten)
- **Lernziel**: Du bewahrst alle Zeilen der rechten Tabelle.
- **Studio-Link**: [Tracker `L094`](https://chatelao.github.io/sql-schulung/#curriculum/L094) · [Join Visualizer: RIGHT ↗](https://chatelao.github.io/sql-schulung/#labs/joins/RIGHT)
- **Beispiel**: `SELECT e.ename, d.deptno, d.dname FROM scott.emp e RIGHT OUTER JOIN scott.dept d ON e.deptno = d.deptno;` → 15 Zeilen (14 Employees + `NULL | 40 | OPERATIONS`).

### `L095` — `FULL OUTER JOIN`
- **Lernziel**: Du bewahrst ungematchte Zeilen von **beiden** Seiten.
- **Studio-Link**: [Tracker `L095`](https://chatelao.github.io/sql-schulung/#curriculum/L095) · [Join Visualizer: FULL ↗](https://chatelao.github.io/sql-schulung/#labs/joins/FULL)

### `L096` — Outer Join `ON`- vs. `WHERE`-Filter-Falle
- **Lernziel**: Du platzierst optionale Filter auf die äußere Tabelle korrekt in `ON` statt `WHERE`.
- **Studio-Link**: [Tracker `L096`](https://chatelao.github.io/sql-schulung/#curriculum/L096)
- **Beispiel**:
  ```sql
  -- RICHTIG: Alle 4 Departments bleiben, nur CLERKs werden gejoint (7 Zeilen inkl. 30/40):
  SELECT d.dname, e.ename
  FROM scott.dept d
  LEFT JOIN scott.emp e ON d.deptno = e.deptno AND e.job = 'CLERK';

  -- FALLE: WHERE e.job = 'CLERK' entfernt DEPT 40 wieder -> nur 4 Zeilen!
  ```

---

## Self-Joins, Non-Equijoins & Reporting (`L097`–`L102`)

### `L097` — Self-Join (`EMP` → `MGR`)
- **Lernziel**: Du verknüpfst eine Tabelle mit sich selbst über zwei verschiedene Table Aliases.
- **Studio-Link**: [Tracker `L097`](https://chatelao.github.io/sql-schulung/#curriculum/L097) · [Join Visualizer: SELF ↗](https://chatelao.github.io/sql-schulung/#labs/joins/SELF)
- **Beispiel**:
  ```sql
  SELECT e.ename AS employee, m.ename AS manager
  FROM scott.emp e
  LEFT JOIN scott.emp m ON e.mgr = m.empno;
  -- 14 Zeilen: KING hat manager = NULL
  ```

### `L098` — Non-Equijoin (`SCOTT.EMP` + `SCOTT.SALGRADE`)
- **Lernziel**: Du joinst Tabellen über Wertebereiche (`BETWEEN`, `<`, `>`) statt `=`.
- **Studio-Link**: [Tracker `L098`](https://chatelao.github.io/sql-schulung/#curriculum/L098) · [Join Visualizer: NONEQUI ↗](https://chatelao.github.io/sql-schulung/#labs/joins/NONEQUI)
- **Beispiel**: `SELECT e.ename, e.sal, s.grade FROM scott.emp e JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal;` → 14 Zeilen.

### `L099` — Legacy Oracle `(+)` Join-Syntax erkennen
- **Lernziel**: Du liest die ältere Oracle-`(+)`-Syntax sicher und übersetzt sie in ANSI-Outer-Joins.
- **Studio-Link**: [Tracker `L099`](https://chatelao.github.io/sql-schulung/#curriculum/L099)
- **Merkregel**: Das `(+)` steht immer auf der **optionalen/fehlenden** Seite (`WHERE e.deptno(+) = d.deptno` → alle `DEPT`-Zeilen bleiben erhalten = `RIGHT OUTER JOIN`). Ein `FULL OUTER JOIN` ist mit `(+)` **nicht** direkt möglich.

### `L100` — Multi-Way Join aus `EMP`, `DEPT`, `MGR` & `SALGRADE`
- **Lernziel**: Du kombinierst Equi-Join, Self-Join und Non-Equijoin in einer einzigen Query.
- **Studio-Link**: [Tracker `L100`](https://chatelao.github.io/sql-schulung/#curriculum/L100)
- **Selbstlern-Aufgabe**: Schreibe eine Query, die je Mitarbeiter in `SCOTT.EMP` seinen Namen, `d.dname`, den Namen seines Managers (`LEFT JOIN`), sein Gehalt und seinen `s.grade` ausgibt (erwartet: 14 Zeilen).
  ??? success "Musterlösung & Erklärung"
      ```sql
      SELECT e.ename, d.dname, m.ename AS manager, e.sal, s.grade
      FROM scott.emp e
      JOIN scott.dept d ON e.deptno = d.deptno
      LEFT JOIN scott.emp m ON e.mgr = m.empno
      JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal
      ORDER BY s.grade DESC, e.ename;
      ```

### `L101`–`L102` — Multi-Table Reporting Lab (`SCOTT` & `HR`)
- **Lernziel**: Du erstellst vollständige Fachberichte mit Joins, Aggregation und Outer-Join-Vollständigkeit.
- **Studio-Link**: [Tracker `L101`](https://chatelao.github.io/sql-schulung/#curriculum/L101) · [Tracker `L102`](https://chatelao.github.io/sql-schulung/#curriculum/L102)
- **Selbstlern-Aufgaben**:
  1. (`L101`) Liste **alle 4** `SCOTT.DEPT`-Abteilungen mit ihrer Mitarbeiteranzahl (inkl. `OPERATIONS = 0`!) und durchschnittlichem Gehalt (`0` bei leerer Abteilung) auf.
  2. (`L102`) Liste alle `HR`-Abteilungen (`department_name`) auf, inklusive der Abteilungen ohne Mitarbeiter, und zähle je Abteilung die Mitarbeiteranzahl (erwartet: 27 Zeilen).
  ??? success "Musterlösungen zu L101–L102"
      ```sql
      -- L101:
      SELECT d.dname, COUNT(e.empno) AS headcount, ROUND(AVG(NVL(e.sal, 0)), 2) AS avg_sal
      FROM scott.dept d
      LEFT JOIN scott.emp e ON d.deptno = e.deptno
      GROUP BY d.dname
      ORDER BY d.dname;

      -- L102:
      SELECT d.department_name, COUNT(e.employee_id) AS headcount
      FROM hr.departments d
      LEFT JOIN hr.employees e ON d.department_id = e.department_id
      GROUP BY d.department_name
      ORDER BY headcount DESC, d.department_name;
      ```
