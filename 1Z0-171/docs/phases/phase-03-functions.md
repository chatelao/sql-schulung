# Phase 3: Single-Row, Conversion & Conditional Functions (`L043`–`L068`)

**Exam Domain**: Domain 3 Part 1 (*Using Functions*, ~18% of total exam)  
**Schemas Used**: `SCOTT.EMP`, `HR.EMPLOYEES`, `DUAL`

---

## Case & Basic Character Functions (`L043`–`L046`)

### `L043` — Case Manipulation (`LOWER`, `UPPER`, `INITCAP`)
```sql
SELECT ename, INITCAP(ename), LOWER(job) FROM scott.emp;
-- Case-insensitive search pattern:
SELECT ename FROM scott.emp WHERE UPPER(ename) = 'SMITH';
```

### `L044` — `CONCAT` vs. `||` and `LENGTH`
- `CONCAT(a, b)` takes **strictly 2 arguments** (`CONCAT('A', 'B', 'C')` fails!), whereas `||` chains any number.

### `L045` — `TRIM`, `LTRIM`, `RTRIM`
```sql
SELECT TRIM('S' FROM 'SMITHS') FROM dual;       -- 'MITH'
SELECT TRIM(LEADING '0' FROM '007499') FROM dual; -- '7499'
```
- **Exam Trap**: `TRIM(char FROM str)` only allows a **single character** as the trim character (`ORA-30001` if longer!).

### `L046` — `REPLACE`
```sql
SELECT REPLACE('JACK AND JUE', 'J', 'BL') FROM dual; -- 'BLACK AND BLUE'
SELECT REPLACE('123-456-789', '-') FROM dual;        -- '123456789'
```

---

## String Slicing & Searching (`L047`–`L050`)

### `L047` — `SUBSTR` (Positive Start Positions — 1-Based!)
```sql
SELECT SUBSTR('SALESMAN', 1, 5) FROM dual; -- 'SALES'
SELECT SUBSTR('SALESMAN', 6)    FROM dual; -- 'MAN'
```

### `L048` — `SUBSTR` with Negative Start Positions
```sql
SELECT SUBSTR('SALESMAN', -3, 2) FROM dual; -- 'MA'
```
- Negative start counts backward from the end (`-1` is the last character), then reads **left-to-right**. *(Use the String Slicer tool on GitHub Pages to visualize this!)*

### `L049` — `INSTR` (Searching & Nth Occurrence)
```sql
SELECT INSTR('CORPORATE FLOOR', 'OR', 3, 2) FROM dual; -- 14
```
- Arguments: `INSTR(string, substring [, start_pos [, occurrence]])`. Returns `0` when not found.

### `L050` — `LPAD`, `RPAD` & Nesting `SUBSTR` + `INSTR`
```sql
SELECT LPAD(sal, 6, '*') FROM scott.emp;
SELECT SUBSTR(email, 1, INSTR(email || '@', '@') - 1) FROM hr.employees;
```

---

## Numeric Functions (`L051`–`L054`)

### `L051` — `ROUND(number, decimals)`
```sql
SELECT ROUND(45.926, 2), ROUND(45.926, 0), ROUND(45.926, -1) FROM dual;
-- Results: 45.93 | 46 | 50
```

### `L052` — `TRUNC(number, decimals)`
```sql
SELECT TRUNC(45.926, 2), TRUNC(45.926, 0), TRUNC(45.926, -1) FROM dual;
-- Results: 45.92 | 45 | 40
```

### `L053` — `MOD`, `CEIL` & `FLOOR`
```sql
SELECT ename, sal, MOD(sal, 1000) FROM scott.emp;
SELECT CEIL(45.1), FLOOR(45.9), CEIL(-45.9) FROM dual; -- 46 | 45 | -45
```

### `L054` — Numeric Practice Clinic on `SCOTT.EMP`

---

## Working with Dates (`L055`–`L060`)

### `L055` — How Oracle Stores `DATE` & `SYSDATE`
- Oracle `DATE` always stores century, year, month, day, **hours, minutes, and seconds** internally (even if only `DD-MON-YY` is displayed).

### `L056` — Date Arithmetic (`+` / `-` Days)
```sql
SELECT ename, hiredate, SYSDATE - hiredate AS days_employed,
       (SYSDATE - hiredate) / 7 AS weeks_employed
FROM scott.emp;
```

### `L057` — `MONTHS_BETWEEN` & `ADD_MONTHS`
```sql
SELECT MONTHS_BETWEEN(DATE '1981-11-17', DATE '1980-12-17') FROM dual; -- 11
SELECT ADD_MONTHS(DATE '2024-01-31', 1) FROM dual;                      -- 2024-02-29
```

### `L058` — `NEXT_DAY` & `LAST_DAY`
```sql
SELECT NEXT_DAY(DATE '2026-11-19', 'FRIDAY'), LAST_DAY(DATE '2026-02-10') FROM dual;
```

### `L059` — `ROUND(date, fmt)` & `TRUNC(date, fmt)`
```sql
SELECT ROUND(DATE '1981-07-16', 'MONTH'), TRUNC(DATE '1981-07-16', 'YEAR') FROM dual;
-- Results: 1981-08-01 | 1981-01-01
```
- `'MONTH'` rounds up on day 16+; `'YEAR'` rounds up on month 7+ (July 1st).

### `L060` — Date Calculations Lab on `SCOTT.EMP` & `HR.EMPLOYEES`

---

## Conversion Functions (`L061`–`L064`)

### `L061` — Implicit vs. Explicit Type Conversion
- Relying on implicit conversions breaks queries across NLS locales; always use `TO_CHAR`, `TO_DATE`, and `TO_NUMBER`.

### `L062` — `TO_CHAR` with Dates & `fm` Fill Mode
```sql
SELECT ename, TO_CHAR(hiredate, 'fmDD Month YYYY') AS hired FROM scott.emp;
```
- Without `fm`, Oracle pads month names (`'April    '`) and day numbers with trailing/leading blanks.

### `L063` — `TO_CHAR` with Numbers & `TO_NUMBER`
```sql
SELECT ename, TO_CHAR(sal, '$99,999.00') FROM scott.emp;
SELECT TO_NUMBER('$1,600.00', '$99,999.00') FROM dual;
```
- If the number exceeds the `9` digits in the format mask, Oracle displays `#######`.

### `L064` — `TO_DATE`, `RR` vs. `YY` & `fx` Exact Match
- `RR` maps `00–49` to current century (20xx) when current year is `00–49`, and `50–99` to previous century (`1995`). `fx` forces strict whitespace and punctuation matching.

---

## Null-Handling & Conditional Expressions (`L065`–`L068`)

### `L065` — `NVL` & `NVL2` (Data Type Traps!)
```sql
-- Correct: both branches return NUMBER
SELECT ename, sal + NVL(comm, 0) AS total_pay FROM scott.emp;

-- EXAM TRAP: Fails with ORA-01722 because 'No Comm' cannot convert to NUMBER!
-- SELECT ename, NVL(comm, 'No Comm') FROM scott.emp;
-- Fix:
SELECT ename, NVL(TO_CHAR(comm), 'No Comm') FROM scott.emp;

-- NVL2(expr, if_not_null, if_null)
SELECT ename, NVL2(comm, 'Has Comm', 'No Comm') FROM scott.emp;
```

### `L066` — `NULLIF` & `COALESCE`
```sql
-- NULLIF returns NULL if lengths match, else first length
SELECT first_name, last_name, NULLIF(LENGTH(first_name), LENGTH(last_name)) FROM hr.employees;

-- COALESCE returns first non-null (short-circuits left to right!)
SELECT ename, COALESCE(comm, sal, 0) FROM scott.emp;
```

### `L067` — `CASE` Expressions (Simple vs. Searched)
```sql
SELECT ename, job, sal,
       CASE job
         WHEN 'ANALYST'  THEN sal * 1.10
         WHEN 'SALESMAN' THEN sal * 1.05
         ELSE sal
       END AS revised_sal
FROM scott.emp;
```

### `L068` — `DECODE` & the `NULL = NULL` Distinction
```sql
SELECT ename, DECODE(comm, NULL, 'None', 0, 'Zero', 'Paid') FROM scott.emp;
```
- **Exam Trap**: `DECODE` matches `NULL` to `NULL`! A simple `CASE comm WHEN NULL THEN ...` **never** matches because `NULL = NULL` is unknown.
