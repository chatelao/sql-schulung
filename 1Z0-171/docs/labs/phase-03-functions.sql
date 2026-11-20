-- ============================================================================
-- Phase 3 Lab Pack (L043-L068): Single-Row, Conversion and Conditional Functions
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TEIL 1: GEFÜHRTE DEMOS
-- ----------------------------------------------------------------------------

-- L043-L046: Case, TRIM, REPLACE
SELECT ename, INITCAP(ename) AS proper_name, TRIM('S' FROM 'SMITHS') AS trimmed,
       REPLACE('JACK AND JUE', 'J', 'BL') AS replaced
FROM scott.emp WHERE UPPER(ename) = 'SMITH';

-- L047-L050: 1-basiertes SUBSTR, INSTR, LPAD
SELECT SUBSTR('SALESMAN', 1, 5) AS first_five, SUBSTR('SALESMAN', -3, 2) AS neg_slice,
       INSTR('CORPORATE FLOOR', 'OR', 3, 2) AS second_or, LPAD(sal, 6, '*') AS padded_sal
FROM scott.emp WHERE ename = 'KING';

-- L051-L053: Numerisches ROUND, TRUNC, MOD, CEIL, FLOOR
SELECT ROUND(45.926, 2) AS r2, ROUND(45.926, -1) AS r_neg1, TRUNC(45.926, -1) AS t_neg1,
       MOD(17, 5) AS mod_val, CEIL(-4.2) AS ceil_neg, FLOOR(-4.2) AS floor_neg
FROM dual;

-- L056-L059: Date Arithmetic und Functions
SELECT ename, hiredate, ROUND(MONTHS_BETWEEN(SYSDATE, hiredate) / 12, 1) AS years_employed,
       ADD_MONTHS(DATE '2024-01-31', 1) AS feb_leap,
       ROUND(DATE '1981-07-16', 'MONTH') AS rounded_month, TRUNC(DATE '1981-07-16', 'YEAR') AS trunc_year
FROM scott.emp WHERE deptno = 10;

-- L062-L068: Conversion, NVL, NVL2, DECODE, CASE
SELECT ename, TO_CHAR(hiredate, 'fmDD Month YYYY') AS hired_clean,
       TO_CHAR(sal, '$99,999.00') AS formatted_sal,
       NVL(TO_CHAR(comm), 'No Comm') AS comm_text,
       DECODE(comm, NULL, 'None', 0, 'Zero', 'Paid') AS decode_null_match
FROM scott.emp;

-- ----------------------------------------------------------------------------
-- TEIL 2: SELBSTSTÄNDIGE ÜBUNGSAUFGABEN (Lösungen in solutions/phase-03-functions-solutions.sql)
-- ----------------------------------------------------------------------------

-- Aufgabe 1 (★): Gib für alle Mitarbeiter in SCOTT.EMP die letzten 3 Buchstaben
-- ihres Namens (SUBSTR mit negativem Startwert) und die Namenslänge (LENGTH) aus.
-- Erwartetes Ergebnis: 14 Zeilen (bei SMITH: 'ITH' | 5).
-- TODO: Deine Query hier


-- Aufgabe 2 (★★): Extrahiere aus dem String 'oracle.user@example.com' per
-- SUBSTR + INSTR den Domain-Teil nach dem '@' ('example.com').
-- Erwartetes Ergebnis: 1 Zeile ('example.com').
-- TODO: Deine Query hier


-- Aufgabe 3 (★★): Berechne für SCOTT.EMP das Datum des ersten Zahltags (LAST_DAY(hiredate))
-- und formatiere es mit TO_CHAR ohne Leerzeichen-Padding als 'fmDay, DD. Month YYYY'.
-- Erwartetes Ergebnis: 14 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 4 (★★): Klassifiziere alle Mitarbeiter in SCOTT.EMP mit einer Searched CASE
-- Expression in 'HIGH' (sal >= 3000), 'MID' (sal >= 1500) und 'LOW' (sonst).
-- Erwartetes Ergebnis: 14 Zeilen (3x HIGH, 5x MID, 6x LOW).
-- TODO: Deine Query hier


-- Aufgabe 5 (★★★): Gib für HR.EMPLOYEES den Namen und die jährliche Provision aus.
-- Wo commission_pct NULL ist, soll 'Keine Provision' erscheinen (Achtung auf ORA-01722!).
-- Erwartetes Ergebnis: 107 Zeilen.
-- TODO: Deine Query hier
