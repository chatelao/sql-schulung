# Functions & Format Models — Referenz (Domain 3 — 25 % der Prüfung)

## Single-Row Character Functions (1-basierte Indizierung!)
| Function | Beispiel (`SCOTT.EMP`) | Ergebnis | Prüfungshinweis |
| :--- | :--- | :--- | :--- |
| `UPPER` / `LOWER` / `INITCAP` | `INITCAP('ALLEN')` | `'Allen'` | Schreibt jeden Wortanfang groß |
| `SUBSTR(s, pos [, len])` | `SUBSTR('SALESMAN', -3, 2)` | `'MA'` | Negatives `pos` zählt von rechts |
| `INSTR(s, sub [, pos, occ])` | `INSTR('MILLER', 'L', 1, 2)` | `4` | Liefert `0`, wenn nicht gefunden |
| `TRIM([LEADING\|TRAILING\|BOTH] c FROM s)` | `TRIM('S' FROM 'SMITHS')` | `'MITH'` | Nur ein einzelnes Trim-Zeichen zulässig |
| `LPAD` / `RPAD` | `LPAD(800, 5, '*')` | `'**800'` | Füllt exakt auf die Gesamtlänge auf |
| `REPLACE(s, old [, new])` | `REPLACE('JACK', 'J', 'BL')` | `'BLACK'` | Ohne `new` wird `old` entfernt |

## Numeric Functions
- `ROUND(45.926, 2)` → `45.93` | `ROUND(45.926, 0)` → `46` | `ROUND(45.926, -1)` → `50`
- `TRUNC(45.926, 2)` → `45.92` | `TRUNC(45.926, -1)` → `40`
- `MOD(1600, 300)` → `100`
- `CEIL(45.1)` → `46` | `FLOOR(45.9)` → `45`

## Date Arithmetic & Functions
- `date + number` → `DATE` (addiert Tage)
- `date - date` → `NUMBER` (Differenz in Tagen)
- `MONTHS_BETWEEN(d1, d2)`: positiv, wenn `d1 > d2`
- `ADD_MONTHS(d, n)`: behandelt Monatsenden sauber (`ADD_MONTHS(DATE '2024-01-31', 1)` = `2024-02-29`)
- `ROUND(DATE '1981-07-16', 'MONTH')` → `1981-08-01` (rundet ab Tag ≥ 16 auf)
- `TRUNC(DATE '1981-07-16', 'YEAR')` → `1981-01-01`

## Null & Conditional Functions
| Function | Verhalten | Exam Trap |
| :--- | :--- | :--- |
| `NVL(a, b)` | Liefert `b`, falls `a IS NULL` | `a` und `b` müssen mit dem Datentyp von `a` kompatibel sein! |
| `NVL2(a, b, c)` | Liefert `b`, falls `a IS NOT NULL`, sonst `c` | `b` und `c` müssen kompatibel sein / in `b` konvertieren (`a` darf einen anderen Typ haben!) |
| `NULLIF(a, b)` | Liefert `NULL`, falls `a = b`, sonst `a` | Erstes Argument `a` darf nicht das Literal `NULL` sein |
| `COALESCE(a, b, ...)` | Erster Nicht-`NULL`-Wert (Short-Circuiting) | Alle Argumente müssen kompatible Datentypen besitzen |
| `DECODE(expr, s1, r1, ..., def)` | Gleichheitsprüfung | Behandelt **`NULL = NULL` als TRUE**! |
| `CASE` | Searched oder Simple | `CASE WHEN x = NULL` ergibt **UNKNOWN (trifft nie zu)** |
