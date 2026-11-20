# Functions & Format Models — Referenz (Domain 3 — 25 % der Prüfung)

## Single-Row Character Functions (1-basierte Indizierung!)

| Function | Beispiel (`SCOTT.EMP`) | Ergebnis | Prüfungshinweis |
| :--- | :--- | :--- | :--- |
| `UPPER` / `LOWER` / `INITCAP` | `INITCAP('ALLEN')` | `'Allen'` | Schreibt jeden Wortanfang groß |
| `CONCAT(a, b)` | `CONCAT('A', 'B')` | `'AB'` | Akzeptiert **strikt 2 Argumente** (für 3+ verwende `\|\|`) |
| `SUBSTR(s, pos [, len])` | `SUBSTR('SALESMAN', -3, 2)` | `'MA'` | Negatives `pos` zählt von rechts, liest dann links→rechts |
| `INSTR(s, sub [, pos, occ])` | `INSTR('MILLER', 'L', 1, 2)` | `4` | Liefert `0`, wenn nicht gefunden |
| `TRIM([LEADING\|TRAILING\|BOTH] c FROM s)` | `TRIM('S' FROM 'SMITHS')` | `'MITH'` | Nur ein **einzelnes** Trim-Zeichen zulässig (`ORA-30001` bei 2+) |
| `LPAD` / `RPAD` | `LPAD(800, 5, '*')` | `'**800'` | Füllt exakt auf die Gesamtlänge auf (schneidet ab, falls länger) |
| `REPLACE(s, old [, new])` | `REPLACE('JACK', 'J', 'BL')` | `'BLACK'` | Ohne `new` wird `old` entfernt |

---

## Funktionsverschachtelung: „Von innen nach außen“ lesen

In `1Z0-171` werden häufig 2–4 Funktionen ineinander verschachtelt. Arbeite immer strikt **von der innersten Klammer nach außen**:

```sql
SELECT SUBSTR(email, 1, INSTR(email || '@', '@') - 1) AS user_part
FROM (SELECT 'anna.meier@firma.de' AS email FROM dual);
```

1. **Innen (`email || '@'`)**: `'anna.meier@firma.de@'` (Sicherheits-`@`, falls kein `@` vorkommt).
2. **Mitte (`INSTR(..., '@')`)**: Findet das erste `@` an Position `11`.
3. **Rechenschritt (`11 - 1`)**: Ergibt Länge `10`.
4. **Außen (`SUBSTR('anna.meier@firma.de', 1, 10)`)**: Schneidet Zeichen 1 bis 10 aus → **`'anna.meier'`**.

---

## Numeric Functions

- `ROUND(45.926, 2)` → `45.93` | `ROUND(45.926, 0)` → `46` | `ROUND(45.926, -1)` → `50`
- `TRUNC(45.926, 2)` → `45.92` | `TRUNC(45.926, -1)` → `40`
- `MOD(1600, 300)` → `100`
- `CEIL(45.1)` → `46` | `FLOOR(45.9)` → `45` | `CEIL(-4.2)` → `-4` | `FLOOR(-4.2)` → `-5`

---

## Date Arithmetic & Functions

- `date + number` → `DATE` (addiert Tage)
- `date - date` → `NUMBER` (Differenz in Tagen)
- `MONTHS_BETWEEN(d1, d2)`: positiv, wenn `d1 > d2`
- `ADD_MONTHS(d, n)`: behandelt Monatsenden sauber (`ADD_MONTHS(DATE '2024-01-31', 1)` = `2024-02-29`)
- `NEXT_DAY(d, 'FRIDAY')`: nächster Freitag strikt nach `d`
- `LAST_DAY(d)`: letzter Kalendertag des Monats von `d`
- `ROUND(DATE '1981-07-16', 'MONTH')` → `1981-08-01` (rundet ab Tag ≥ 16 auf)
- `ROUND(DATE '1981-07-01', 'YEAR')` → `1982-01-01` (rundet ab Monat ≥ 7 auf)
- `TRUNC(DATE '1981-07-16', 'YEAR')` → `1981-01-01`

---

## Date Format Models (`TO_CHAR` / `TO_DATE`)

| Format-Element | Bedeutung | Beispiel (`1981-02-20 14:05:09`) | Prüfungshinweis |
| :--- | :--- | :--- | :--- |
| `YYYY` | 4-stelliges Jahr | `1981` | Immer explizit bevorzugen |
| `YY` | 2-stelliges Jahr (aktuelles Jahrhundert) | `81` → `2081` (im Jahr 2026!) | Falle bei historischen Daten |
| `RR` | 2-stelliges Jahr (Jahrhundert-Logik) | `81` → `1981` (im Jahr 2026!) | `00–49` vs. `50–99` Regel |
| `MM` | 2-stelliger Monat (`01`–`12`) | `02` | |
| `MON` | 3-Buchstaben-Kürzel | `FEB` | Groß-/Kleinschreibung folgt Maske (`Mon` → `Feb`) |
| `MONTH` | Vollständiger Monatsname | `FEBRUARY ` (auf 9 Zeichen gepolstert!) | Mit `fmMONTH` ohne Leerzeichen |
| `DD` | Tag des Monats (`01`–`31`) | `20` | |
| `DY` / `DAY` | Wochentag (kurz / lang) | `FRI` / `FRIDAY   ` | `DAY` wird gepolstert → `fmDAY` |
| `HH24` / `HH12` | Stunde (`00–23` / `01–12`) | `14` / `02` | `HH` allein ist `HH12` |
| `MI` / `SS` | Minute / Sekunde (`00`–`59`) | `05` / `09` | **Achtung:** Minute ist `MI`, nicht `MM`! |
| `fm` | **Fill Mode** (Toggle) | `fmDD Month YYYY` → `20 February 1981` | Entfernt Padding-Leerzeichen & führende Nullen |
| `fx` | **Format Exact** | `fxYYYY-MM-DD` | Erzwingt exakte Trennzeichen & führende Nullen in `TO_DATE` |
| `"text"` | Wörtlicher Text in Maske | `'YYYY "Q"Q'` | Doppelte Anführungszeichen nötig |

---

## Number Format Models (`TO_CHAR` / `TO_NUMBER`)

| Element | Bedeutung | Beispiel (`sal = 1600`) | Ausgabe |
| :--- | :--- | :--- | :--- |
| `9` | Ziffernstelle (unterdrückt führende `0`) | `TO_CHAR(1600, '99,999')` | `'  1,600'` |
| `0` | Ziffernstelle (zeigt führende/nachfolgende `0`) | `TO_CHAR(1600, '09999')` | `' 01600'` |
| `$` | Festes Dollarzeichen | `TO_CHAR(1600, '$9,999.00')` | `'$1,600.00'` |
| `L` | Lokales Währungssymbol (`NLS_CURRENCY`) | `TO_CHAR(1600, 'L9,999.00')` | z. B. `'€1,600.00'` |
| `,` / `.` | Tausender- / Dezimaltrennzeichen | `TO_CHAR(1600.5, '9,999.00')` | `' 1,600.50'` |
| `MI` / `PR` | Minus hinten (`-`) / spitze Klammern `<...>` bei negativen Zahlen | `TO_CHAR(-50, '99PR')` | `'<50>'` |

> **Exam Trap (`#######`)**: Reicht die Anzahl der `9`/`0`-Stellen für den Wert nicht aus (z. B. `TO_CHAR(12500, '$9,999')`), liefert Oracle **`#######`** statt zu runden!

---

## Null & Conditional Functions

| Function | Verhalten | Exam Trap |
| :--- | :--- | :--- |
| `NVL(a, b)` | Liefert `b`, falls `a IS NULL` | `a` und `b` müssen mit dem Datentyp von `a` kompatibel sein (`NVL(comm, 'None')` → `ORA-01722`)! |
| `NVL2(a, b, c)` | Liefert `b`, falls `a IS NOT NULL`, sonst `c` | `b` und `c` müssen kompatibel sein / in `b` konvertieren (`a` darf einen anderen Typ haben!) |
| `NULLIF(a, b)` | Liefert `NULL`, falls `a = b`, sonst `a` | Erstes Argument `a` darf nicht das Literal `NULL` sein (`ORA-00932`) |
| `COALESCE(a, b, ...)` | Erster Nicht-`NULL`-Wert (Short-Circuiting) | Alle Argumente müssen kompatible Datentypen besitzen |
| `DECODE(expr, s1, r1, ..., def)` | Gleichheitsprüfung | Behandelt **`NULL = NULL` als TRUE**! |
| `CASE` | Searched oder Simple | `CASE WHEN x = NULL` ergibt **UNKNOWN (trifft nie zu)** |
