# Functions & Format Models Reference (Domain 3 — 25% of Exam)

## Single-Row Character Functions (1-Based Indexing!)
| Function | Example (`SCOTT.EMP`) | Result | Exam Note |
| :--- | :--- | :--- | :--- |
| `UPPER` / `LOWER` / `INITCAP` | `INITCAP('ALLEN')` | `'Allen'` | Capitalizes each word |
| `SUBSTR(s, pos [, len])` | `SUBSTR('SALESMAN', -3, 2)` | `'MA'` | Negative `pos` counts from right |
| `INSTR(s, sub [, pos, occ])` | `INSTR('MILLER', 'L', 1, 2)` | `4` | Returns `0` if not found |
| `TRIM([LEADING\|TRAILING\|BOTH] c FROM s)` | `TRIM('S' FROM 'SMITHS')` | `'MITH'` | Single trim char only |
| `LPAD` / `RPAD` | `LPAD(800, 5, '*')` | `'**800'` | Pads to exact total length |
| `REPLACE(s, old [, new])` | `REPLACE('JACK', 'J', 'BL')` | `'BLACK'` | Omit `new` to delete `old` |

## Numeric Functions
- `ROUND(45.926, 2)` -> `45.93` | `ROUND(45.926, 0)` -> `46` | `ROUND(45.926, -1)` -> `50`
- `TRUNC(45.926, 2)` -> `45.92` | `TRUNC(45.926, -1)` -> `40`
- `MOD(1600, 300)` -> `100`
- `CEIL(45.1)` -> `46` | `FLOOR(45.9)` -> `45`

## Date Arithmetic & Functions
- `date + number` -> `DATE` (adds days)
- `date - date` -> `NUMBER` (difference in days)
- `MONTHS_BETWEEN(d1, d2)`: positive when `d1 > d2`
- `ADD_MONTHS(d, n)`: handles month-end gracefully (`ADD_MONTHS(DATE '2024-01-31', 1)` = `2024-02-29`)
- `ROUND(DATE '1981-07-16', 'MONTH')` -> `1981-08-01` (rounds up on day >= 16)
- `TRUNC(DATE '1981-07-16', 'YEAR')` -> `1981-01-01`

## Null & Conditional Functions
| Function | Behavior | Exam Trap |
| :--- | :--- | :--- |
| `NVL(a, b)` | Returns `b` if `a IS NULL` | `a` and `b` must be compatible with `a`'s type! |
| `NVL2(a, b, c)` | Returns `b` if `a IS NOT NULL`, else `c` | `b` and `c` must match/convert to `b`'s type (`a` can differ!) |
| `NULLIF(a, b)` | Returns `NULL` if `a = b`, else `a` | First arg `a` cannot be literal `NULL` |
| `COALESCE(a, b, ...)` | First non-null (short-circuits) | All args must share compatible types |
| `DECODE(expr, s1, r1, ..., def)` | Equality check | Treats **`NULL = NULL` as TRUE**! |
| `CASE` | Searched or Simple | `CASE WHEN x = NULL` is **UNKNOWN (never matches)** |
