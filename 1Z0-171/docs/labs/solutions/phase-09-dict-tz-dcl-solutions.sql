-- ============================================================================
-- Phase 9 Musterlösungen (L163-L178)
-- ============================================================================

-- Aufgabe 1
SELECT column_id, column_name, data_type, data_length, nullable
FROM user_tab_columns
WHERE table_name = 'MY_EMP'
ORDER BY column_id;

-- Aufgabe 2
SELECT table_name, comments
FROM dictionary
WHERE table_name LIKE '%CONSTRAINT%'
ORDER BY table_name;

-- Aufgabe 3
SELECT ename, hiredate, hiredate + TO_YMINTERVAL('02-06') AS anniversary_2y6m
FROM scott.emp;

-- Aufgabe 4
SELECT (FROM_TZ(TIMESTAMP '2026-11-19 10:00:00', 'Europe/Berlin')
        + TO_DSINTERVAL('0 09:15:00'))
       AT TIME ZONE 'America/New_York' AS arrival_ny
FROM dual;

-- Aufgabe 5
SELECT i.index_name, i.table_name, i.uniqueness, i.visibility, c.column_name
FROM user_indexes i
JOIN user_ind_columns c ON i.index_name = c.index_name
ORDER BY i.table_name, i.index_name, c.column_position;
