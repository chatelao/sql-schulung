-- ============================================================================
-- Phase 3 Lab Pack (L043-L068): Single-Row, Conversion and Conditional Functions
-- ============================================================================

-- L043-L046: Case, TRIM, REPLACE
SELECT ename,
       INITCAP(ename) AS proper_name,
       TRIM('S' FROM 'SMITHS') AS trimmed,
       REPLACE('JACK AND JUE', 'J', 'BL') AS replaced
FROM scott.emp
WHERE UPPER(ename) = 'SMITH';

-- L047-L050: 1-basiertes SUBSTR, INSTR, LPAD
SELECT SUBSTR('SALESMAN', 1, 5) AS first_five,
       SUBSTR('SALESMAN', -3, 2) AS neg_slice,
       INSTR('CORPORATE FLOOR', 'OR', 3, 2) AS second_or,
       LPAD(sal, 6, '*') AS padded_sal
FROM scott.emp
WHERE ename = 'KING';

-- L051-L053: Numerisches ROUND, TRUNC, MOD, CEIL, FLOOR
SELECT ROUND(45.926, 2) AS r2,
       ROUND(45.926, -1) AS r_neg1,
       TRUNC(45.926, -1) AS t_neg1,
       MOD(17, 5) AS mod_val,
       CEIL(-4.2) AS ceil_neg,
       FLOOR(-4.2) AS floor_neg
FROM dual;

-- L056-L059: Date Arithmetic and Functions
SELECT ename,
       hiredate,
       ROUND(MONTHS_BETWEEN(SYSDATE, hiredate) / 12, 1) AS years_since_hire,
       ADD_MONTHS(DATE '2024-01-31', 1) AS feb_leap,
       ROUND(DATE '1981-07-16', 'MONTH') AS rounded_month,
       TRUNC(DATE '1981-07-16', 'YEAR') AS trunc_year
FROM scott.emp
WHERE deptno = 10;

-- L062-L064: Conversion Functions (TO_CHAR, TO_DATE, fm)
SELECT ename,
       TO_CHAR(hiredate, 'fmDD Month YYYY') AS hired_clean,
       TO_CHAR(sal, '$99,999.00') AS formatted_sal,
       TO_DATE('15-JAN-85', 'DD-MON-RR') AS rr_date
FROM scott.emp;

-- L065-L068: NVL, NVL2, NULLIF, COALESCE, CASE, DECODE
SELECT ename,
       sal + NVL(comm, 0) AS total_pay,
       NVL(TO_CHAR(comm), 'No Comm') AS comm_text,
       NVL2(comm, 'Has Comm', 'No Comm') AS comm_flag,
       DECODE(comm, NULL, 'None', 0, 'Zero', 'Paid') AS decode_null_match,
       CASE job
         WHEN 'ANALYST'  THEN sal * 1.10
         WHEN 'SALESMAN' THEN sal * 1.05
         ELSE sal
       END AS revised_sal
FROM scott.emp;
