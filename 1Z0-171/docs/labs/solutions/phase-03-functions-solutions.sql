-- ============================================================================
-- Phase 3 Musterlösungen (L043-L068)
-- ============================================================================

-- Aufgabe 1
SELECT ename, SUBSTR(ename, -3) AS last_three, LENGTH(ename) AS name_len
FROM scott.emp;

-- Aufgabe 2
SELECT SUBSTR('oracle.user@example.com', INSTR('oracle.user@example.com', '@') + 1) AS domain_part
FROM dual;

-- Aufgabe 3
SELECT ename, hiredate, TO_CHAR(LAST_DAY(hiredate), 'fmDay, DD. Month YYYY') AS first_payday
FROM scott.emp;

-- Aufgabe 4
SELECT ename, sal,
       CASE
         WHEN sal >= 3000 THEN 'HIGH'
         WHEN sal >= 1500 THEN 'MID'
         ELSE 'LOW'
       END AS sal_tier
FROM scott.emp;

-- Aufgabe 5
SELECT last_name,
       NVL(TO_CHAR(salary * 12 * commission_pct, '999,990.00'), 'Keine Provision') AS annual_comm
FROM hr.employees;
