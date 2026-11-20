-- ============================================================================
-- Phase 9 Lab Pack (L163-L178): Data Dictionary and Time Zones / Intervals
-- Hinweis: Multi-User GRANT/REVOKE-Cascade-Labs erfordern OCI Always Free oder PDB!
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TEIL 1: GEFÜHRTE DEMOS
-- ----------------------------------------------------------------------------

-- L163-L166: Data Dictionary Views und COMMENT ON
SELECT object_name, object_type, status
FROM user_objects
ORDER BY object_type, object_name;

SELECT table_name, constraint_name, constraint_type, search_condition
FROM user_constraints
ORDER BY table_name, constraint_name;

COMMENT ON TABLE my_emp IS 'Schreibbare Trainingskopie von SCOTT.EMP';
SELECT table_name, comments FROM user_tab_comments WHERE table_name = 'MY_EMP';

-- L167-L171: Time Zones und INTERVAL Data Types
ALTER SESSION SET TIME_ZONE = '+02:00';
SELECT DBTIMEZONE, SESSIONTIMEZONE, TZ_OFFSET('America/New_York') FROM dual;

SELECT CURRENT_DATE, CURRENT_TIMESTAMP, LOCALTIMESTAMP FROM dual;

SELECT DATE '2026-01-15' + INTERVAL '1-6' YEAR TO MONTH AS plus_18_months,
       SYSTIMESTAMP + INTERVAL '3 04:30:00' DAY TO SECOND AS plus_3d_4h30m,
       FROM_TZ(TIMESTAMP '2026-11-19 09:00:00', 'UTC') AS utc_ts,
       TO_TIMESTAMP('2026-11-20 14:30:00', 'YYYY-MM-DD HH24:MI:SS') AS parsed_ts,
       DATE '2026-01-15' + TO_YMINTERVAL('02-03') AS plus_2y_3m,
       SYSTIMESTAMP + TO_DSINTERVAL('0 05:15:00') AS plus_5h_15m
FROM dual;

SELECT ename, hiredate, EXTRACT(YEAR FROM hiredate) AS hire_year, EXTRACT(MONTH FROM hiredate) AS hire_month
FROM scott.emp;

-- ----------------------------------------------------------------------------
-- TEIL 2: SELBSTSTÄNDIGE ÜBUNGSAUFGABEN (Lösungen in solutions/phase-09-dict-tz-dcl-solutions.sql)
-- ----------------------------------------------------------------------------

-- Aufgabe 1 (★): Finde über USER_TAB_COLUMNS alle Spalten und Datentypen der
-- Tabelle MY_EMP (sortiert nach column_id).
-- TODO: Deine Query hier


-- Aufgabe 2 (★★): Liste über DICTIONARY (DICT) alle Data-Dictionary-Views auf,
-- deren Name das Wort 'CONSTRAINT' enthält.
-- TODO: Deine Query hier


-- Aufgabe 3 (★★): Berechne für alle Mitarbeiter in SCOTT.EMP das Datum exakt
-- 2 Jahre und 6 Monate nach ihrer Einstellung (mit TO_YMINTERVAL('02-06')).
-- Erwartetes Ergebnis: 14 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 4 (★★): Ein Flug startet am 2026-11-19 um 10:00 Uhr in 'Europe/Berlin'
-- und dauert 9 Stunden 15 Minuten (TO_DSINTERVAL('0 09:15:00')). Berechne die
-- Ankunftszeit in 'America/New_York' (AT TIME ZONE).
-- TODO: Deine Query hier


-- Aufgabe 5 (★★★): Prüfe über USER_INDEXES und USER_IND_COLUMNS alle Indexes
-- in deinem aktuellen Schema.
-- TODO: Deine Query hier
