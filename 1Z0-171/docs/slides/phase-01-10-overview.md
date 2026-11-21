---
marp: true
theme: default
paginate: true
style: |
  section { font-size: 26px; }
  code { font-size: 22px; }
---

# Oracle SQL (`1Z0-171`) — Hybrid-Foliendeck (Phasen 1–10)

> Dieses Markdown ist **Marp-kompatibel** (`npx @marp-team/marp-cli phase-01-10-overview.md --pdf`) und als schlanke Konzept-Visualisierung für Beamer + Teams-Screensharing gedacht (max. 1 Konzept pro Folie).

---

## Phase 1: Tabellen, Zeilen & `NULL`

- Eine Tabelle besteht aus **Spalten** (Schema) und **Zeilen** (Datensätze).
- `PRIMARY KEY` = eindeutig + `NOT NULL`.
- **Goldene Regel:** `NULL` ist nicht `0` und nicht `''` — jeder Rechenausdruck mit `NULL` ergibt **`NULL`**.
  - `sal + comm` → falsch bei `NULL`
  - `sal + NVL(comm, 0)` → richtig

---

## Phase 2: 3-wertige Logik & Präzedenz

- Bedingungen liefern `TRUE`, `FALSE` oder **`UNKNOWN`**.
- `WHERE` lässt **nur `TRUE`** durch!
- Präzedenz: `()` → Vergleiche → `NOT` → **`AND`** → **`OR`**
- Immer klammern, wenn `OR` und `AND` gemischt werden.

---

## Phase 3: Funktionen & Typkonvertierung

- String-Indizes in Oracle sind **1-basiert** (`SUBSTR('ORACLE', 2, 3) = 'RAC'`).
- Verschachtelte Funktionen von **innen nach aussen** lesen.
- `NVL(a, b)` erzwingt kompatible Typen (`NVL(TO_CHAR(comm), 'None')`).
- `CASE` unterscheidet zwischen `NULL` und Werten; `DECODE` hält `NULL = NULL` für gleich!

---

## Phase 4: Logische Abarbeitungsreihenfolge

1. `FROM` / `JOIN`
2. `WHERE` *(filtert Einzelzeilen)*
3. `GROUP BY` *(bildet Gruppen)*
4. `HAVING` *(filtert Gruppen)*
5. `SELECT` *(Aggregate & Aliase)*
6. `ORDER BY` *(einzige Klausel nach `SELECT`)*

---

## Phase 5: Joins & die Outer-Filter-Falle

- `INNER JOIN`: nur passende Paare (`DEPT 40` und `Kimberely Grant` fehlen).
- `LEFT OUTER JOIN`: alle linken Zeilen bleiben erhalten.
- **Falle:** Ein Filter auf die rechte Tabelle im **`WHERE`** zerstört den `LEFT JOIN` → gehört ins **`ON`**!
- Bei `JOIN ... USING (deptno)` **keinen** Tabellen-Alias vor `deptno` (`ORA-25154`).

---

## Phase 6: Subqueries & `SET`-Operatoren

- `NOT IN (..., NULL)` liefert **immer 0 Zeilen**.
- Lösung: **`NOT EXISTS`** (immer `NULL`-sicher!).
- `UNION` dedupliziert & sortiert; `UNION ALL` behält alles und ist schneller.
- `ORDER BY` bei `SET`-Operatoren steht **nur ganz am Ende**.

---

## Phase 7: DML & Transaktionen

- `INSERT` / `UPDATE` / `DELETE` / `MERGE` erst nach `COMMIT` für andere sichtbar.
- **Implizites `COMMIT`**: Jedes `DDL` (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`) beendet die Transaktion sofort!
- **Read Consistency:** Lesende Sessions blockieren schreibende nicht und umgekehrt.

---

## Phase 8: DDL, Constraints, Views & Sequences

- `CTAS` (`CREATE TABLE ... AS SELECT`) übernimmt **nur `NOT NULL`**, keine PK/FK/CHECK!
- `UNIQUE` erlaubt in Oracle **mehrere `NULL`-Werte**.
- `VIEW` speichert nur die Query; `WITH CHECK OPTION` verhindert ungültige DML-Änderungen.
- `SEQUENCE`: Lücken nach `ROLLBACK` sind normal.

---

## Phase 9: Data Dictionary, Zeitzonen & DCL

- `USER_*` (eigene) ⊂ `ALL_*` (zugängliche) ⊂ `DBA_*` (alle).
- `TIMESTAMP WITH LOCAL TIME ZONE`: speichert normalisiert, zeigt in `SESSIONTIMEZONE`.
- **`REVOKE`-Kaskade:**
  - Objektprivileg (`WITH GRANT OPTION`) → **kaskadiert** an Enkel weiter!
  - Systemprivileg (`WITH ADMIN OPTION`) → **kaskadiert nicht**.

---

## Phase 10: Prüfungs- & Transfer-Check

- **Zeitbudget:** 90 Min. / 60 Fragen → ~1,5 Min. pro Frage.
- **2-Durchgangs-Strategie:** Sichere Fragen sofort lösen, knifflige markieren.
- **Transfer in die Firma:** 3 konkrete Arbeitsabfragen in den nächsten 4 Wochen umsetzen!
