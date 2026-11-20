-- ============================================================================
-- Phase 2 Lab Pack (L021-L042): Filtering, Sorting and Row Limiting
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TEIL 1: GEFÜHRTE DEMOS
-- ----------------------------------------------------------------------------

-- L021-L023: WHERE-Vergleiche und ANSI Date Literals
SELECT ename, job, sal, hiredate
FROM scott.emp
WHERE deptno = 10
  AND hiredate >= DATE '1981-06-01';

-- L025-L027: BETWEEN, IN, LIKE und ESCAPE
SELECT ename, sal FROM scott.emp WHERE sal BETWEEN 1250 AND 2850;
SELECT ename, job FROM scott.emp WHERE job IN ('MANAGER', 'ANALYST');
SELECT ename FROM scott.emp WHERE ename LIKE '___TH';
SELECT job_id, job_title FROM hr.jobs WHERE job_id LIKE 'SA\_%' ESCAPE '\';

-- L028: IS NULL vs. = NULL Falle
SELECT ename, comm FROM scott.emp WHERE comm = NULL;     -- Liefert immer 0 Zeilen!
SELECT ename, comm FROM scott.emp WHERE comm IS NULL;    -- Liefert 10 Zeilen

-- L032: Operator Precedence (NOT -> AND -> OR)
SELECT ename, job, sal FROM scott.emp WHERE job = 'SALESMAN' OR job = 'PRESIDENT' AND sal > 1500;
SELECT ename, job, sal FROM scott.emp WHERE (job = 'SALESMAN' OR job = 'PRESIDENT') AND sal > 1500;

-- L034-L037: ORDER BY, NULLS FIRST/LAST und Row Limiting (ONLY vs. WITH TIES)
SELECT ename, sal * 12 AS annual_sal, comm FROM scott.emp ORDER BY annual_sal DESC, comm NULLS FIRST;
SELECT ename, sal FROM scott.emp ORDER BY sal DESC FETCH FIRST 2 ROWS ONLY;
SELECT ename, sal FROM scott.emp ORDER BY sal DESC FETCH FIRST 2 ROWS WITH TIES;

-- ----------------------------------------------------------------------------
-- TEIL 2: SELBSTSTÄNDIGE ÜBUNGSAUFGABEN (Lösungen in solutions/phase-02-filtering-sorting-solutions.sql)
-- ----------------------------------------------------------------------------

-- Aufgabe 1 (★): Finde alle Mitarbeiter in SCOTT.EMP, deren Name an 2. Stelle ein 'L'
-- hat und die in Dept 10 oder 30 arbeiten.
-- Erwartetes Ergebnis: 2 Zeilen (BLAKE, CLARK).
-- TODO: Deine Query hier


-- Aufgabe 2 (★): Liste alle Mitarbeiter in HR.EMPLOYEES auf, die im Jahr 2005
-- eingestellt wurden (BETWEEN DATE '2005-01-01' AND DATE '2005-12-31'), sortiert nach hire_date.
-- Erwartetes Ergebnis: 29 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 3 (★★): Finde alle Mitarbeiter in SCOTT.EMP ohne Provision (comm IS NULL)
-- ODER mit comm = 0, die mindestens 1500 verdienen. (Achtung auf Klammern!)
-- Erwartetes Ergebnis: 7 Zeilen.
-- TODO: Deine Query hier


-- Aufgabe 4 (★★): Sortiere SCOTT.EMP absteigend nach comm (NULLs sollen ZULETZT stehen!)
-- und bei gleicher comm aufsteigend nach ename.
-- Erwartetes Ergebnis: 14 Zeilen (MARTIN ganz oben, TURNER an 4. Stelle, danach 10x NULL).
-- TODO: Deine Query hier


-- Aufgabe 5 (★★★): Zeige aus HR.EMPLOYEES die Plätze 6 bis 10 der bestbezahlten
-- Mitarbeiter (Pagination mit OFFSET ... FETCH NEXT).
-- Erwartetes Ergebnis: 5 Zeilen.
-- TODO: Deine Query hier
