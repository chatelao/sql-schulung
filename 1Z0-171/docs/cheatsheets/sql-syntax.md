# SQL Syntax & Logical Execution Order — Cheat Sheet

## Logische Verarbeitungsreihenfolge vs. Schreibreihenfolge

Auch wenn du eine Query von oben nach unten beginnend mit `SELECT` **schreibst**, wertet Oracle die Klauseln in einer strikten logischen Reihenfolge aus:

| Schritt | Clause | Was passiert | Sichtbarkeit von Aliases |
| :---: | :--- | :--- | :--- |
| **1** | `FROM` / `JOIN` | Tabellen identifizieren und Zeilen kombinieren | Table Aliases entstehen hier |
| **2** | `WHERE` | Einzelne Zeilen filtern | Column Aliases aus `SELECT` sind **NICHT** sichtbar! |
| **3** | `GROUP BY` | Zeilen zu Gruppen zusammenfassen | Column Aliases aus `SELECT` sind **NICHT** sichtbar! |
| **4** | `HAVING` | Gruppen filtern | Column Aliases aus `SELECT` sind **NICHT** sichtbar! |
| **5** | `SELECT` | Ausdrücke, Functions & `DISTINCT` berechnen | Column Aliases entstehen hier |
| **6** | `ORDER BY` | Ergebniszeilen sortieren | Column Aliases **SIND** sichtbar! |
| **7** | `OFFSET` / `FETCH` | Rückgabezeilen begrenzen | Nutzt die Sortierung aus Schritt 6 |

---

## Boolesche & arithmetische Operator Precedence

1. Klammern `( )`
2. Multiplikation `*` / Division `/`
3. Addition `+` / Subtraktion `-` / Concatenation `||`
4. Comparison Operators (`=`, `<>`, `<`, `>`, `IN`, `BETWEEN`, `LIKE`, `IS NULL`)
5. `NOT`
6. `AND`
7. `OR`

!!! tip "Prüfungs-Faustregel"
    `AND` bindet stärker als `OR`! Setze `OR`-Bedingungen immer in Klammern, wenn du sie mit `AND` kombinierst.
