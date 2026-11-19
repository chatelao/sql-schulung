-- ============================================================================
-- Phase 9 Lab Pack (L163-L178): Data Dictionary and Time Zones / Intervals
-- Hinweis: Multi-User GRANT/REVOKE-Cascade-Labs erfordern OCI Always Free oder PDB!
-- ============================================================================

-- L163-L166: Data Dictionary Views und COMMENT ON
SELECT object_name, object_type, status
FROM user_objects
ORDER BY object_type, object_name;

SELECT table_name, constraint_name, constraint_type, search_condition
FROM user_constraints
ORDER BY table_name, constraint_name;

-- L167-L171: Time Zones and INTERVAL Data Types
SELECT DBTIMEZONE, SESSIONTIMEZONE, TZ_OFFSET('America/New_York') FROM dual;

SELECT CURRENT_DATE,
       CURRENT_TIMESTAMP,
       LOCALTIMESTAMP
FROM dual;

SELECT DATE '2026-01-15' + INTERVAL '1-6' YEAR TO MONTH AS plus_18_months,
       SYSTIMESTAMP + INTERVAL '3 04:30:00' DAY TO SECOND AS plus_3d_4h30m,
       FROM_TZ(TIMESTAMP '2026-11-19 09:00:00', 'UTC') AS utc_ts
FROM dual;

SELECT ename,
       hiredate,
       EXTRACT(YEAR FROM hiredate) AS hire_year,
       EXTRACT(MONTH FROM hiredate) AS hire_month
FROM scott.emp;
