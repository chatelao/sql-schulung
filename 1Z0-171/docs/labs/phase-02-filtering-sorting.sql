-- ============================================================================
-- Phase 2 Lab Pack (L021-L042): Filtering, Sorting and Row Limiting
-- ============================================================================

-- L021-L023: WHERE-Vergleiche und ANSI Date Literals
SELECT ename, job, sal, hiredate
FROM scott.emp
WHERE deptno = 10
  AND hiredate >= DATE '1981-06-01';

-- L025: Inklusives BETWEEN (Untergrenze MUSS zuerst stehen!)
SELECT ename, sal
FROM scott.emp
WHERE sal BETWEEN 1250 AND 2850;

-- L026: IN und NOT IN
SELECT ename, job
FROM scott.emp
WHERE job IN ('MANAGER', 'ANALYST');

-- L027: LIKE Pattern Matching und ESCAPE
SELECT ename FROM scott.emp WHERE ename LIKE 'A%';
SELECT ename FROM scott.emp WHERE ename LIKE '___TH';
SELECT job_id, job_title FROM hr.jobs WHERE job_id LIKE 'SA\_%' ESCAPE '\';

-- L028: IS NULL vs. = NULL Falle
SELECT ename, comm FROM scott.emp WHERE comm = NULL;     -- Liefert immer 0 Zeilen!
SELECT ename, comm FROM scott.emp WHERE comm IS NULL;    -- Liefert 10 Zeilen

-- L032: Operator Precedence (NOT -> AND -> OR)
SELECT ename, job, sal
FROM scott.emp
WHERE job = 'SALESMAN' OR job = 'PRESIDENT' AND sal > 1500;

SELECT ename, job, sal
FROM scott.emp
WHERE (job = 'SALESMAN' OR job = 'PRESIDENT') AND sal > 1500;

-- L034-L035: ORDER BY mit Alias, Position und NULLS FIRST/LAST
SELECT ename, sal * 12 AS annual_sal, comm
FROM scott.emp
ORDER BY annual_sal DESC, comm NULLS FIRST;

-- L036-L037: Row Limiting (ONLY vs. WITH TIES)
SELECT ename, sal
FROM scott.emp
ORDER BY sal DESC
FETCH FIRST 2 ROWS ONLY;

SELECT ename, sal
FROM scott.emp
ORDER BY sal DESC
FETCH FIRST 2 ROWS WITH TIES;
