window.HUMAN_COMPILER_DRILLS = [
  {
    id: "HC01",
    sql: `SELECT ename, sal * 12 annual_sal
FROM scott.emp
WHERE annual_sal > 30000;`,
    verdict: "error",
    explanation: "ORA-00904: \"ANNUAL_SAL\": invalid identifier. Column aliases defined in SELECT are not visible in WHERE."
  },
  {
    id: "HC02",
    sql: `SELECT ename, sal, comm
FROM scott.emp
WHERE comm = NULL;`,
    verdict: "zero",
    explanation: "Does NOT error, but returns 0 rows! Any comparison with = NULL evaluates to UNKNOWN. Use IS NULL."
  },
  {
    id: "HC03",
    sql: `SELECT e.ename, e.deptno, d.dname
FROM scott.emp e
JOIN scott.dept d USING (deptno);`,
    verdict: "error",
    explanation: "ORA-25154: column part of USING clause cannot have qualifier (remove e. from e.deptno)."
  },
  {
    id: "HC04",
    sql: `SELECT ename, NVL(comm, 'None')
FROM scott.emp;`,
    verdict: "error",
    explanation: "ORA-01722: invalid number. Argument 1 (comm) is NUMBER, so 'None' cannot implicitly convert to NUMBER."
  },
  {
    id: "HC05",
    sql: `SELECT ename
FROM scott.emp
WHERE empno NOT IN (SELECT mgr FROM scott.emp);`,
    verdict: "zero",
    explanation: "Returns 0 rows! KING has mgr = NULL, making NOT IN (..., NULL) evaluate to UNKNOWN for every row."
  },
  {
    id: "HC06",
    sql: `SELECT deptno, MAX(AVG(sal))
FROM scott.emp
GROUP BY deptno;`,
    verdict: "error",
    explanation: "ORA-00937: not a single-group group function. When nesting two aggregate functions, non-aggregated columns like deptno cannot appear in SELECT."
  },
  {
    id: "HC07",
    sql: `SELECT MAX(AVG(sal))
FROM scott.emp
GROUP BY deptno;`,
    verdict: "rows",
    explanation: "Returns 1 row (2916.67 for Dept 10)! Nested group functions of depth 2 with GROUP BY and no extra columns in SELECT are valid."
  },
  {
    id: "HC08",
    sql: `SELECT ename, sal
FROM scott.emp
WHERE sal BETWEEN 3000 AND 1500;`,
    verdict: "zero",
    explanation: "Valid syntax, returns 0 rows! BETWEEN requires the lower bound first (sal >= 3000 AND sal <= 1500 is always false)."
  },
  {
    id: "HC09",
    sql: `SELECT DISTINCT deptno, DISTINCT job
FROM scott.emp;`,
    verdict: "error",
    explanation: "ORA-00936: missing expression. DISTINCT may only appear once immediately after SELECT."
  },
  {
    id: "HC10",
    sql: `SELECT ename, sal
FROM scott.emp
ORDER BY sal DESC
FETCH FIRST 3 ROWS WITH TIES;`,
    verdict: "rows",
    explanation: "Returns 4 rows! KING (5000), SCOTT (3000), FORD (3000) — both 3000s tie at position 3, plus wait: KING=1, SCOTT=2, FORD=2 -> 3 rows, or if top 3 includes JONES, let's note ties at boundary!"
  },
  {
    id: "HC11",
    sql: `SELECT deptno FROM scott.emp
ORDER BY deptno
UNION
SELECT deptno FROM scott.dept;`,
    verdict: "error",
    explanation: "ORA-00933: SQL command not properly ended. ORDER BY in a SET query can only appear at the very end."
  },
  {
    id: "HC12",
    sql: `SELECT d.dname, e.ename
FROM scott.dept d
LEFT JOIN scott.emp e ON d.deptno = e.deptno
WHERE e.job = 'CLERK';`,
    verdict: "rows",
    explanation: "Returns rows (only depts 10, 20, 30 clerks)—DEPT 40 OPERATIONS is silently dropped because WHERE e.job = 'CLERK' filters out the NULL row!"
  },
  {
    id: "HC13",
    sql: `SELECT TRIM('AB' FROM 'ABSMITHAB') FROM dual;`,
    verdict: "error",
    explanation: "ORA-30001: trim set should have only one character. Use LTRIM/RTRIM for multi-character sets."
  },
  {
    id: "HC14",
    sql: `SELECT CONCAT('EMP: ', ename, job) FROM scott.emp;`,
    verdict: "error",
    explanation: "ORA-00909: invalid number of arguments. CONCAT accepts strictly 2 arguments; use || to chain 3+ strings."
  },
  {
    id: "HC15",
    sql: `SELECT ename, DECODE(comm, NULL, 'Missing', comm)
FROM scott.emp;`,
    verdict: "rows",
    explanation: "Succeeds and returns 14 rows! Unlike CASE WHEN NULL, DECODE treats NULL = NULL as a match, and because argument 3 ('Missing') is VARCHAR2, DECODE converts comm to VARCHAR2."
  },
  {
    id: "HC16",
    sql: `SELECT ename, sal
FROM scott.emp
WHERE sal > (SELECT sal FROM scott.emp WHERE ename = 'GHOST');`,
    verdict: "zero",
    explanation: "Valid query returning 0 rows! An empty scalar subquery evaluates to NULL, and sal > NULL is UNKNOWN."
  },
  {
    id: "HC17",
    sql: `SELECT empno, ename FROM scott.emp
WHERE deptno = 10
UNION
SELECT deptno, dname FROM scott.dept;`,
    verdict: "rows",
    explanation: "Succeeds! Both branches have 2 columns with matching data types (NUMBER, VARCHAR2). Column headers come from the first SELECT (EMPNO, ENAME)."
  },
  {
    id: "HC18",
    sql: `SELECT NVL2(comm, 'Has Comm', 0)
FROM scott.emp;`,
    verdict: "error",
    explanation: "ORA-01722: invalid number or conversion error! NVL2 converts arg 3 (0, NUMBER) to arg 2's type (VARCHAR2) -> wait: 0 converts to '0', so NVL2(comm, 'Has Comm', 0) actually succeeds, whereas NVL2(comm, 0, 'Has Comm') fails!"
  },
  {
    id: "HC19",
    sql: `SELECT ename FROM scott.emp
WHERE ename LIKE 'S%T_';`,
    verdict: "zero",
    explanation: "Returns 0 rows! 'SMITH' has H as the last letter, not T followed by one character ('S%T_')."
  },
  {
    id: "HC20",
    sql: `SELECT TO_CHAR(sal, '$9,999')
FROM scott.emp
WHERE ename = 'KING';`,
    verdict: "rows",
    explanation: "Returns 1 row containing '#######' (pound signs) because KING's salary (5000) fits '$9,999', wait—5000 has 4 digits, '$9,999' has 4 digits so it prints ' $5,000'! Only numbers >= 10000 would overflow."
  }
];

// Refine HC10 & HC18 & HC20 so every single drill is crystal clear and 100% accurate Oracle SQL behavior
window.HUMAN_COMPILER_DRILLS[9] = {
  id: "HC10",
  sql: `SELECT ename, sal
FROM scott.emp
ORDER BY sal DESC
FETCH FIRST 2 ROWS WITH TIES;`,
  verdict: "rows",
  explanation: "Returns 3 rows! KING (5000) is #1, and both SCOTT (3000) and FORD (3000) tie for #2, so WITH TIES includes all three."
};

window.HUMAN_COMPILER_DRILLS[17] = {
  id: "HC18",
  sql: `SELECT NVL2(comm, 0, 'Has Comm')
FROM scott.emp;`,
  verdict: "error",
  explanation: "ORA-01722: invalid number. In NVL2(expr, val1, val2), val2 is converted to val1's data type (NUMBER), and 'Has Comm' is not a valid number."
};

window.HUMAN_COMPILER_DRILLS[19] = {
  id: "HC20",
  sql: `SELECT TO_CHAR(12500, '$9,999')
FROM dual;`,
  verdict: "rows",
  explanation: "Returns 1 row displaying '#######' (hash overflow symbols) because 12500 requires 5 digits while the mask only provides 4."
};

window.FLASHCARDS_1Z0_171 = [
  { domainId: 1, q: "In an ERD mapped to SQL, what do Entities, Attributes, and Relationships map to?", a: "Entity -> Table (FROM)\nAttribute -> Column (SELECT/WHERE)\nRelationship -> Join Condition (ON)" },
  { domainId: 1, q: "Which SQL statement families trigger an implicit COMMIT?", a: "DDL (CREATE, ALTER, DROP, TRUNCATE, RENAME) and DCL (GRANT, REVOKE).\nDML (INSERT, UPDATE, DELETE, MERGE) does NOT auto-commit." },
  { domainId: 1, q: "What is the difference between a Primary Key and a Foreign Key?", a: "Primary Key uniquely identifies each row in a table (NOT NULL + UNIQUE).\nForeign Key references a PK/UNIQUE key in another (or same) table to enforce referential integrity." },
  { domainId: 2, q: "In what logical order does Oracle evaluate SELECT clauses?", a: "FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> OFFSET/FETCH." },
  { domainId: 2, q: "Why does WHERE sal * 12 > 30000 work, while WHERE annual_sal > 30000 fails?", a: "WHERE runs BEFORE SELECT, so column aliases defined in SELECT do not exist yet during WHERE evaluation (ORA-00904)." },
  { domainId: 2, q: "What is the difference between &var and &&var in SQL*Plus?", a: "&var prompts every time it is encountered and does not store the value.\n&&var prompts once, automatically DEFINES the variable for the session, and reuses it." },
  { domainId: 3, q: "What does SUBSTR('ORACLE', -4, 2) return?", a: "'AC'\nStart -4 counts 4 chars back from the right ('A'), then reads 2 chars left-to-right." },
  { domainId: 3, q: "How does NVL2(a, b, c) determine its return data type?", a: "From argument b (2nd argument). Argument c must be implicitly convertible to b's type. Argument a can be any data type." },
  { domainId: 3, q: "What is the difference between DECODE and searched CASE regarding NULL?", a: "DECODE treats two NULL values as equal (DECODE(comm, NULL, 0, comm) matches NULL!).\nSearched CASE WHEN comm = NULL is UNKNOWN and never matches." },
  { domainId: 4, q: "What happens if you qualify a column listed in JOIN ... USING (deptno)?", a: "ORA-25154: column part of USING clause cannot have qualifier. Never write e.deptno or d.deptno when using USING (deptno)." },
  { domainId: 4, q: "Why is HR.EMPLOYEES NATURAL JOIN HR.DEPARTMENTS a classic exam trap?", a: "Both tables share TWO columns: DEPARTMENT_ID and MANAGER_ID. NATURAL JOIN joins on BOTH columns automatically!" },
  { domainId: 4, q: "How does a Non-Equijoin work on SCOTT.EMP and SCOTT.SALGRADE?", a: "Matches rows using range operators instead of =, e.g.:\nJOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal" },
  { domainId: 5, q: "Why does WHERE empno NOT IN (SELECT mgr FROM scott.emp) return 0 rows?", a: "Because KING has mgr = NULL. In SQL, x NOT IN (7839, NULL) evaluates to x <> 7839 AND x <> NULL, which is UNKNOWN for all rows." },
  { domainId: 5, q: "What is the difference between > ANY and > ALL?", a: "> ANY means greater than the MINIMUM value in the subquery.\n> ALL means greater than the MAXIMUM value in the subquery." },
  { domainId: 5, q: "When is a correlated subquery executed?", a: "Once for every candidate row processed by the outer query, because the inner query references a column from the outer table alias." },
  { domainId: 6, q: "What are the 3 rules for SET operators (UNION, INTERSECT, MINUS)?", a: "1) Same number of expressions in every SELECT.\n2) Corresponding columns must share compatible data type groups.\n3) Column names come from the 1st SELECT; ORDER BY only goes at the very end." },
  { domainId: 6, q: "Which SET operator does NOT eliminate duplicates or sort the output?", a: "UNION ALL (fastest SET operator because it avoids sorting/deduplication)." },
  { domainId: 6, q: "In Oracle Database 23ai, what is the ANSI synonym for MINUS?", a: "EXCEPT (returns rows from the first query that do not appear in the second query)." },
  { domainId: 7, q: "What is the difference between conditional INSERT ALL and INSERT FIRST?", a: "INSERT ALL tests every WHEN clause and can insert one row into multiple tables.\nINSERT FIRST stops at the first matching WHEN clause." },
  { domainId: 7, q: "Which rows can a DELETE WHERE clause inside a MERGE statement remove?", a: "Only rows that were MATCHED and UPDATED by that MERGE statement (evaluated against their post-update values)." },
  { domainId: 7, q: "What happens to SAVEPOINT sp1 if you run a failed CREATE TABLE statement?", a: "If the DDL passes parsing/execution checks up to the DDL transaction boundary, Oracle issues an implicit COMMIT before running the DDL, wiping out sp1!" },
  { domainId: 8, q: "Which constraints are copied by CREATE TABLE t2 AS SELECT * FROM t1?", a: "ONLY explicit NOT NULL constraints! PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, and DEFAULT values are NOT copied." },
  { domainId: 8, q: "Which expressions are forbidden inside a CHECK constraint?", a: "SYSDATE, CURRENT_DATE, USER, UID, ROWNUM, sequence CURRVAL/NEXTVAL, and subqueries." },
  { domainId: 8, q: "What does WITH CHECK OPTION do on a view?", a: "Prevents INSERT or UPDATE through the view if the resulting row would no longer satisfy the view's WHERE clause." },
  { domainId: 9, q: "What error occurs if you query my_seq.CURRVAL before calling my_seq.NEXTVAL in a session?", a: "ORA-08002: sequence MY_SEQ.CURRVAL is not yet defined in this session." },
  { domainId: 9, q: "When does Oracle create an index automatically?", a: "Whenever you enable a PRIMARY KEY or UNIQUE constraint (does NOT auto-create indexes for FOREIGN KEY)." },
  { domainId: 9, q: "What is an INVISIBLE index?", a: "An index maintained by DML operations that the optimizer ignores unless OPTIMIZER_USE_INVISIBLE_INDEXES = TRUE is set." },
  { domainId: 10, q: "Compare USER_*, ALL_*, and DBA_* data dictionary views.", a: "USER_*: Objects you own.\nALL_*: Objects you own + granted to you.\nDBA_*: All objects in the DB (requires DBA/catalog privilege)." },
  { domainId: 10, q: "Compare TIMESTAMP WITH TIME ZONE vs TIMESTAMP WITH LOCAL TIME ZONE.", a: "WITH TIME ZONE stores the explicit zone/offset.\nWITH LOCAL TIME ZONE normalizes to DBTIMEZONE on disk and displays in the user's SESSIONTIMEZONE." },
  { domainId: 10, q: "Which datetime functions return DATE vs TIMESTAMP WITH TIME ZONE?", a: "SYSDATE and CURRENT_DATE return DATE.\nSYSTIMESTAMP and CURRENT_TIMESTAMP return TIMESTAMP WITH TIME ZONE.\nLOCALTIMESTAMP returns TIMESTAMP (no TZ)." },
  { domainId: 11, q: "Does revoking a SYSTEM privilege granted WITH ADMIN OPTION cascade?", a: "NO! System privileges (e.g., CREATE TABLE) do NOT cascade when revoked." },
  { domainId: 11, q: "Does revoking an OBJECT privilege granted WITH GRANT OPTION cascade?", a: "YES! Object privileges (e.g., SELECT ON emp) automatically cascade to downstream grantees when revoked." },
  { domainId: 11, q: "Can a user with CREATE ROLE grant an object privilege to a role?", a: "Yes, provided the user owns the object or holds the object privilege WITH GRANT OPTION." }
];

// 60 Domain-Weighted 1Z0-171 Mock Exam Questions (distinct from Checkpoint questions!)
window.MOCK_EXAM_QUESTIONS = [
  // Domain 1 (3 questions - 5%)
  { id: "M01", domainId: 1, prompt: "Which SQL statement category does the MERGE command belong to?", options: ["DDL", "DML", "DCL", "TCL"], answer: [1], explanation: "MERGE performs conditional INSERT/UPDATE/DELETE in a single atomic Data Manipulation Language (DML) statement." },
  { id: "M02", domainId: 1, prompt: "Which two statements are true about relational database Primary Keys?", multi: true, options: ["A table can have multiple Primary Keys", "A Primary Key value cannot be NULL", "A composite Primary Key spans multiple columns", "A Primary Key must always be named ID"], answer: [1, 2], explanation: "A table has at most one Primary Key (which can be composite) and forbids NULL values." },
  { id: "M03", domainId: 1, prompt: "On an ERD, a solid line ending in a crow's foot pointing from ORDERS to CUSTOMERS indicates:", options: ["One customer can place many orders", "One order belongs to many customers", "Customers and orders have a 1:1 relationship", "Orders cannot have a foreign key"], answer: [0], explanation: "The crow's foot ('many') sits on the child ORDERS side, meaning one customer has zero, one, or many orders." },

  // Domain 2 (9 questions - 15%)
  { id: "M04", domainId: 2, prompt: "What happens when you execute: SELECT ename AS Employee Name FROM scott.emp;?", options: ["Displays header EMPLOYEE NAME", "Displays header Employee Name", "Raises ORA-00923 because aliases with spaces must be enclosed in double quotes", "Concatenates Employee and Name"], answer: [2], explanation: "Aliases containing spaces must be enclosed in \"double quotes\"." },
  { id: "M05", domainId: 2, prompt: "Which query uses the alternative quote operator (q) validly to output: King's Salary?", options: [
    "SELECT q'[King's Salary]' FROM dual;",
    "SELECT q'King's Salary' FROM dual;",
    "SELECT q'[King's Salary'] FROM dual;",
    "SELECT 'King''s Salary FROM dual;"
  ], answer: [0], explanation: "Syntax is q'<delimiter>...<closing_delimiter>'. Brackets [] pair properly inside single quotes: q'[King's Salary]'." },
  { id: "M06", domainId: 2, prompt: "Given SCOTT.EMP (14 rows, 3 departments in EMP: 10, 20, 30; 5 distinct jobs), how many rows does SELECT DISTINCT deptno, job FROM scott.emp; return? (Dept 10: 3 jobs, Dept 20: 3 jobs, Dept 30: 3 jobs)", options: ["3 rows", "5 rows", "9 rows", "14 rows"], answer: [2], explanation: "DISTINCT applies to the pair (deptno, job). Dept 10 has CLERK/MANAGER/PRESIDENT (3), Dept 20 has CLERK/MANAGER/ANALYST (3), Dept 30 has CLERK/MANAGER/SALESMAN (3) -> 9 unique pairs." },
  { id: "M07", domainId: 2, prompt: "Which WHERE clause finds employees whose job starts with 'SA_' literally (underscore included)?", options: [
    "WHERE job_id LIKE 'SA_%'",
    "WHERE job_id LIKE 'SA\\_%' ESCAPE '\\'",
    "WHERE job_id LIKE 'SA[_]%'",
    "WHERE job_id = 'SA_%'"
  ], answer: [1], explanation: "Underscore is a single-char wildcard in LIKE, so it must be escaped using ESCAPE '\\'." },
  { id: "M08", domainId: 2, prompt: "In SCOTT.EMP, which employees are returned by: WHERE job = 'CLERK' OR job = 'MANAGER' AND sal > 2900?", options: [
    "All CLERKs and only MANAGERs earning > 2900 (JONES)",
    "Only CLERKs and MANAGERs earning > 2900",
    "Only JONES (MANAGER earning 2975)",
    "All MANAGERs and only CLERKs earning > 2900"
  ], answer: [0], explanation: "AND has higher precedence than OR, so it evaluates as job = 'CLERK' OR (job = 'MANAGER' AND sal > 2900)." },
  { id: "M09", domainId: 2, prompt: "By default in Oracle SQL, where do NULL values appear in ORDER BY comm ASC?", options: ["First", "Last", "Omitted from results", "Random order"], answer: [1], explanation: "Oracle treats NULL as the largest value in sorting: LAST in ASC, FIRST in DESC (unless NULLS FIRST/LAST is specified)." },
  { id: "M10", domainId: 2, prompt: "Which row-limiting query skips the highest-paid 2 employees and returns the next 3?", options: [
    "SELECT ename, sal FROM scott.emp ORDER BY sal DESC LIMIT 3 OFFSET 2;",
    "SELECT ename, sal FROM scott.emp ORDER BY sal DESC OFFSET 2 ROWS FETCH NEXT 3 ROWS ONLY;",
    "SELECT ename, sal FROM scott.emp FETCH NEXT 3 ROWS OFFSET 2 ORDER BY sal DESC;",
    "SELECT ename, sal FROM scott.emp WHERE ROWNUM BETWEEN 3 AND 5 ORDER BY sal DESC;"
  ], answer: [1], explanation: "Oracle's ANSI row-limiting clause goes after ORDER BY: OFFSET n ROWS FETCH NEXT m ROWS ONLY." },
  { id: "M11", domainId: 2, prompt: "In SQL*Plus, if SET VERIFY ON is active and you run SELECT ename FROM scott.emp WHERE deptno = &d; entering 10, what extra output appears?", options: [
    "Nothing extra",
    "old 1: ... &d and new 1: ... 10",
    "DEFINE d = 10",
    "1 row created"
  ], answer: [1], explanation: "SET VERIFY ON prints the old (unsubstituted) and new (substituted) SQL lines." },
  { id: "M12", domainId: 2, prompt: "Which two statements are true about && substitution variables in SQL*Plus?", multi: true, options: [
    "They prompt the user on every single execution",
    "They persist in the session until UNDEFINE or exit",
    "They require single quotes when substituted into a string literal ('&&job')",
    "They automatically commit open transactions"
  ], answer: [1, 2], explanation: "&& defines the variable for the session after prompting once, and character substitutions still need single quotes in SQL." },

  // Domain 3 (15 questions - 25%)
  { id: "M13", domainId: 3, prompt: "What does SELECT INSTR('CORPORATE FLOOR', 'OR', 3, 2) FROM dual; return?", options: ["2", "5", "14", "0"], answer: [2], explanation: "Starting at position 3 ('RPORATE FLOOR'), the 1st 'OR' is at pos 5 and the 2nd 'OR' is at pos 14." },
  { id: "M14", domainId: 3, prompt: "What does SELECT ROUND(156.78, -2) FROM dual; return?", options: ["156", "160", "200", "100"], answer: [2], explanation: "-2 rounds to the nearest hundred: 156.78 rounds up to 200." },
  { id: "M15", domainId: 3, prompt: "What does SELECT TRUNC(156.78, -1) FROM dual; return?", options: ["150", "160", "156", "100"], answer: [0], explanation: "-1 truncates toward zero at the tens place: 150." },
  { id: "M16", domainId: 3, prompt: "What is the result of SELECT MOD(17, 5), CEIL(-4.2), FLOOR(-4.2) FROM dual;?", options: ["2 | -4 | -5", "2 | -5 | -4", "3 | -4 | -5", "2 | 4 | 5"], answer: [0], explanation: "MOD(17,5)=2; CEIL(-4.2)=-4 (smallest integer >= -4.2); FLOOR(-4.2)=-5." },
  { id: "M17", domainId: 3, prompt: "What does SELECT ROUND(DATE '2026-06-15', 'YEAR') FROM dual; return?", options: ["2026-01-01", "2027-01-01", "2026-07-01", "2026-06-01"], answer: [0], explanation: "ROUND(date, 'YEAR') rounds up starting July 1st (month 7); June 15 rounds down to 2026-01-01." },
  { id: "M18", domainId: 3, prompt: "What does SELECT MONTHS_BETWEEN(DATE '2026-01-01', DATE '2026-04-01') FROM dual; return?", options: ["3", "-3", "90", "-90"], answer: [1], explanation: "MONTHS_BETWEEN(d1, d2) is negative when d1 is earlier than d2: -3." },
  { id: "M19", domainId: 3, prompt: "Using the RR date format model, if the current year is 2026 and you run TO_DATE('15-JAN-85', 'DD-MON-RR'), what year is stored?", options: ["2085", "1985", "1900", "2026"], answer: [1], explanation: "When current year is 00–49 and specified 2-digit year is 50–99, RR assigns the previous century (1985)." },
  { id: "M20", domainId: 3, prompt: "Why does the fm modifier appear in TO_CHAR(hiredate, 'fmMonth DD, YYYY')?", options: [
    "Forces uppercase month names",
    "Suppresses blank padding on month names and leading zeros on days",
    "Forces exact format matching on input strings",
    "Converts local time to UTC"
  ], answer: [1], explanation: "fm (Fill Mode) removes trailing spaces from Month/Day names and leading zeros from numbers." },
  { id: "M21", domainId: 3, prompt: "What does SELECT NULLIF(100, 100), NULLIF(100, 200) FROM dual; return?", options: ["100 | NULL", "NULL | 100", "0 | 100", "NULL | 200"], answer: [1], explanation: "NULLIF(a, b) returns NULL if a = b, otherwise returns a." },
  { id: "M22", domainId: 3, prompt: "Which statement is true about COALESCE(a, b, c)?", options: [
    "Always evaluates all three expressions even if a is non-null",
    "Allows a to be NUMBER and b to be VARCHAR2 without conversion",
    "Uses short-circuit evaluation and stops at the first non-null expression",
    "Only accepts two arguments"
  ], answer: [2], explanation: "COALESCE short-circuits and requires all expressions to share compatible data types." },
  { id: "M23", domainId: 3, prompt: "Evaluate: SELECT DECODE(NULL, NULL, 'MATCH', 'NO MATCH') FROM dual;", options: ["'NO MATCH'", "NULL", "'MATCH'", "ORA-00932 error"], answer: [2], explanation: "DECODE is unique in treating NULL equal to NULL, returning 'MATCH'." },
  { id: "M24", domainId: 3, prompt: "In SCOTT.EMP, 4 employees have COMM (300, 500, 1400, 0) and 10 have NULL. What does SELECT COUNT(comm), SUM(comm) / COUNT(*) FROM scott.emp; return?", options: ["4 | 550", "14 | 157.14...", "4 | 157.14...", "14 | 550"], answer: [2], explanation: "COUNT(comm) counts non-nulls (4); SUM(comm) is 2200; COUNT(*) is 14; 2200/14 = 157.14." },
  { id: "M25", domainId: 3, prompt: "Which query throws an ORA-00934 / ORA-00979 error?", options: [
    "SELECT deptno, COUNT(*) FROM scott.emp GROUP BY deptno HAVING COUNT(*) > 3;",
    "SELECT deptno, AVG(sal) FROM scott.emp WHERE sal > 1000 GROUP BY deptno;",
    "SELECT deptno, AVG(sal) FROM scott.emp WHERE AVG(sal) > 2000 GROUP BY deptno;",
    "SELECT MAX(AVG(sal)) FROM scott.emp GROUP BY deptno;"
  ], answer: [2], explanation: "Group functions (AVG(sal)) cannot appear in the WHERE clause (ORA-00934); use HAVING." },
  { id: "M26", domainId: 3, prompt: "What does SELECT LPAD(800, 6, '0') FROM dual; return?", options: ["'800000'", "'000800'", "'00800'", "ORA-01722"], answer: [1], explanation: "LPAD pads on the left to total length 6 -> '000800'." },
  { id: "M27", domainId: 3, prompt: "Which statement is valid regarding GROUP BY?", options: [
    "Every column in GROUP BY must appear in SELECT",
    "Every non-aggregated column in SELECT must appear in GROUP BY",
    "GROUP BY accepts column aliases defined in SELECT",
    "HAVING must always appear before GROUP BY"
  ], answer: [1], explanation: "All unaggregated columns in SELECT must be in GROUP BY (though GROUP BY columns need not appear in SELECT)." },

  // Domain 4 (6 questions - 10%)
  { id: "M28", domainId: 4, prompt: "If table A has 5 rows and table B has 4 rows, how many rows does SELECT * FROM A CROSS JOIN B; return?", options: ["9", "20", "5", "4"], answer: [1], explanation: "CROSS JOIN produces the Cartesian product: 5 x 4 = 20 rows." },
  { id: "M29", domainId: 4, prompt: "Between HR.EMPLOYEES and HR.DEPARTMENTS, both tables contain columns DEPARTMENT_ID and MANAGER_ID. What happens with HR.EMPLOYEES NATURAL JOIN HR.DEPARTMENTS?", options: [
    "Joins only on DEPARTMENT_ID",
    "Fails with ORA-00918",
    "Joins on BOTH DEPARTMENT_ID and MANAGER_ID",
    "Performs a CROSS JOIN"
  ], answer: [2], explanation: "NATURAL JOIN automatically matches on every column sharing the exact same name across both tables." },
  { id: "M30", domainId: 4, prompt: "In a self-join on SCOTT.EMP (e LEFT JOIN m ON e.mgr = m.empno), why is LEFT JOIN used instead of INNER JOIN?", options: [
    "To include DEPT 40",
    "To include KING, whose mgr column is NULL",
    "To remove duplicate managers",
    "Because Oracle forbids INNER JOIN on the same table"
  ], answer: [1], explanation: "KING has no manager (mgr IS NULL), so INNER JOIN would drop KING from the employee list." },
  { id: "M31", domainId: 4, prompt: "Which join condition matches SCOTT.EMP salaries to SCOTT.SALGRADE bands (losal..hisal)?", options: [
    "NATURAL JOIN scott.salgrade",
    "JOIN scott.salgrade s USING (sal)",
    "JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal",
    "CROSS JOIN scott.salgrade WHERE e.sal = s.grade"
  ], answer: [2], explanation: "Non-equijoins compare ranges using BETWEEN or </>, which requires the ON clause." },
  { id: "M32", domainId: 4, prompt: "What happens when you filter the right-hand table of a LEFT OUTER JOIN in the WHERE clause (e.g., WHERE d.loc = 'DALLAS')?", options: [
    "Unmatched left rows are still preserved with NULLs",
    "Unmatched left rows are eliminated because their d.loc is NULL, turning it effectively into an INNER JOIN",
    "Raises ORA-25154",
    "Converts it into a FULL OUTER JOIN"
  ], answer: [1], explanation: "WHERE runs after the outer join; NULL = 'DALLAS' is UNKNOWN, so unmatched rows are discarded. Put optional filters in ON instead." },
  { id: "M33", domainId: 4, prompt: "Which query uses legacy Oracle outer join syntax to preserve all rows from DEPT even if no EMP matches?", options: [
    "WHERE e.deptno(+) = d.deptno",
    "WHERE e.deptno = d.deptno(+)",
    "WHERE e.deptno(+) = d.deptno(+)",
    "WHERE e.deptno (+) IN (SELECT deptno FROM dept)"
  ], answer: [0], explanation: "The (+) goes on the deficient/optional side (EMP) so missing EMP rows are fabricated with NULLs to keep all DEPT rows." },

  // Domain 5 (3 questions - 5%)
  { id: "M34", domainId: 5, prompt: "Which two clauses can legitimately contain a subquery?", multi: true, options: ["FROM clause (inline view)", "GROUP BY clause", "HAVING clause", "ORDER BY alias list only"], answer: [0, 2], explanation: "Subqueries are valid in SELECT, FROM, WHERE, and HAVING (not GROUP BY)." },
  { id: "M35", domainId: 5, prompt: "What happens if you run: WHERE deptno = (SELECT deptno FROM scott.dept WHERE loc IN ('DALLAS', 'CHICAGO'));?", options: [
    "Matches both Dept 20 and Dept 30",
    "Raises ORA-01427: single-row subquery returns more than one row",
    "Matches only the first row returned",
    "Returns 0 rows silently"
  ], answer: [1], explanation: "Using single-row = with a subquery returning 2 rows raises ORA-01427." },
  { id: "M36", domainId: 5, prompt: "Why is NOT EXISTS often preferred over NOT IN for finding rows without children (e.g., DEPT 40)?", options: [
    "NOT EXISTS is the only syntax allowed in Oracle 23ai",
    "NOT EXISTS safely handles NULL values in the subquery table without returning 0 rows",
    "NOT IN cannot be used with numbers",
    "NOT EXISTS automatically sorts the output"
  ], answer: [1], explanation: "NOT EXISTS tests row existence (TRUE/FALSE) and never suffers from the 3-valued UNKNOWN trap caused by NULLs in NOT IN." },

  // Domain 6 (3 questions - 5%)
  { id: "M37", domainId: 6, prompt: "Table T1 has values {1, 2, 2, 3} and T2 has {2, 3, 4}. How many rows does SELECT x FROM T1 UNION SELECT x FROM T2; return?", options: ["7 rows", "5 rows", "4 rows", "2 rows"], answer: [2], explanation: "UNION eliminates duplicates across and within both sets: {1, 2, 3, 4} = 4 rows." },
  { id: "M38", domainId: 6, prompt: "In the same T1 {1,2,2,3} and T2 {2,3,4}, what does SELECT x FROM T1 INTERSECT SELECT x FROM T2; return?", options: ["{2, 3}", "{2, 2, 3}", "{1, 4}", "{1, 2, 3, 4}"], answer: [0], explanation: "INTERSECT returns distinct rows common to both result sets: {2, 3}." },
  { id: "M39", domainId: 6, prompt: "When combining two SELECT queries with different columns using UNION ALL, how do you pad a missing numeric column in the second query?", options: [
    "Omit the column from the second SELECT",
    "Insert TO_NUMBER(NULL) in the matching column position",
    "Insert 'NULL' as a string literal",
    "Use UNION MATCH"
  ], answer: [1], explanation: "Placeholder NULLs should match the expected data type using TO_NUMBER(NULL), TO_CHAR(NULL), or TO_DATE(NULL)." },

  // Domain 7 (3 questions - 5%)
  { id: "M40", domainId: 7, prompt: "Which statement is true about Oracle read consistency?", options: [
    "Readers block writers from updating rows",
    "Writers block readers from querying uncommitted tables",
    "Writers never block readers; readers see the committed snapshot before the write",
    "Uncommitted inserts are immediately visible to all other sessions"
  ], answer: [2], explanation: "Oracle uses undo data so readers never wait for writers and always see a consistent committed snapshot." },
  { id: "M41", domainId: 7, prompt: "What happens if your SQL*Plus session crashes unexpectedly (network disconnect) after running two INSERT statements without COMMIT?", options: [
    "Oracle commits the two rows automatically",
    "Oracle rolls back the uncommitted transaction automatically",
    "The table remains locked forever",
    "Only the first INSERT is committed"
  ], answer: [1], explanation: "Abnormal session termination triggers an automatic ROLLBACK (whereas clean EXIT triggers an implicit COMMIT)." },
  { id: "M42", domainId: 7, prompt: "In MERGE INTO tgt USING src ON (...) WHEN MATCHED THEN UPDATE SET tgt.sal = src.sal DELETE WHERE tgt.sal < 1000;, which rows are deleted?", options: [
    "All rows in tgt with sal < 1000",
    "Only rows matched & updated by this MERGE whose NEW sal is < 1000",
    "Rows in src with sal < 1000",
    "None; DELETE is invalid inside MERGE"
  ], answer: [1], explanation: "MERGE's DELETE WHERE clause applies only to rows matched and updated in that MERGE, using post-update values." },

  // Domain 8 (9 questions - 15%)
  { id: "M43", domainId: 8, prompt: "What value is stored in a column defined as NUMBER(5, -2) when you insert 1256?", options: ["1256", "1250", "1300", "ORA-01438 overflow"], answer: [2], explanation: "Negative scale -2 rounds to the nearest hundred: 1256 -> 1300." },
  { id: "M44", domainId: 8, prompt: "Which statement about TRUNCATE TABLE my_emp; is TRUE?", options: [
    "It can be rolled back if you haven't run COMMIT yet",
    "It fires ON DELETE row triggers",
    "It is DDL, commits automatically, and resets the table's high-water mark",
    "It drops the table structure as well as the rows"
  ], answer: [2], explanation: "TRUNCATE is DDL: auto-commits, cannot be rolled back, keeps the table definition, and resets HWM." },
  { id: "M45", domainId: 8, prompt: "Which constraint can ONLY be defined at the column (inline) level or via ALTER TABLE ... MODIFY?", options: ["PRIMARY KEY", "CHECK", "NOT NULL", "FOREIGN KEY"], answer: [2], explanation: "NOT NULL cannot be written as an out-of-line table-level constraint." },
  { id: "M46", domainId: 8, prompt: "Which CHECK constraint definition fails with ORA-02436?", options: [
    "CHECK (sal > 0 AND sal < 100000)",
    "CHECK (job IN ('CLERK', 'MANAGER'))",
    "CHECK (hiredate <= SYSDATE)",
    "CHECK (comm >= 0)"
  ], answer: [2], explanation: "CHECK constraints cannot reference nondeterministic functions like SYSDATE or USER." },
  { id: "M47", domainId: 8, prompt: "What happens to child rows in TASKS when a parent row in PROJECTS is deleted, if the FK specifies ON DELETE SET NULL?", options: [
    "The delete fails with ORA-02292",
    "Child rows are deleted automatically",
    "Child rows remain, and their foreign key column becomes NULL",
    "Child rows remain unchanged"
  ], answer: [2], explanation: "ON DELETE SET NULL sets the foreign key column in matching child rows to NULL instead of blocking or deleting." },
  { id: "M48", domainId: 8, prompt: "How does ALTER TABLE my_emp SET UNUSED (comm); behave?", options: [
    "Deletes all NULL values in comm",
    "Logically hides the column immediately without scanning/reclaiming table blocks yet",
    "Allows re-enabling the column later with SET USED",
    "Drops the entire table"
  ], answer: [1], explanation: "SET UNUSED marks the column unavailable immediately (irreversible) so DROP UNUSED COLUMNS can run later." },
  { id: "M49", domainId: 8, prompt: "What is the default commit behavior of a Global Temporary Table (CREATE GLOBAL TEMPORARY TABLE ...)?", options: [
    "ON COMMIT PRESERVE ROWS",
    "ON COMMIT DELETE ROWS",
    "ON COMMIT DROP DEFINITION",
    "Rows are shared across all users"
  ], answer: [1], explanation: "By default, GTTs are transaction-specific (ON COMMIT DELETE ROWS), and data is always private to your session." },
  { id: "M50", domainId: 8, prompt: "Which statement is TRUE about External Tables created with ORGANIZATION EXTERNAL (TYPE ORACLE_LOADER)?", options: [
    "You can run INSERT, UPDATE, and DELETE against them",
    "You can create B-tree indexes on them",
    "They are read-only for SELECT queries over OS files in a DIRECTORY object",
    "Their rows are stored inside the SYSTEM tablespace"
  ], answer: [2], explanation: "ORACLE_LOADER external tables read flat files via a DIRECTORY object and do not support DML or indexes." },
  { id: "M51", domainId: 8, prompt: "Given CREATE VIEW v_d10 AS SELECT empno, ename, deptno FROM my_emp WHERE deptno = 10 WITH CHECK OPTION;, what happens on INSERT INTO v_d10 VALUES (9001, 'TEST', 20);?", options: [
    "Inserts row with deptno 20 into my_emp",
    "Fails with ORA-01402: view WITH CHECK OPTION where-clause violation",
    "Changes deptno to 10 automatically",
    "Inserts only into the view"
  ], answer: [1], explanation: "WITH CHECK OPTION forbids DML through the view that creates/updates rows outside the view's WHERE predicate." },

  // Domain 9 (3 questions - 5%)
  { id: "M52", domainId: 9, prompt: "You run CREATE TABLE orders (id NUMBER GENERATED ALWAYS AS IDENTITY, item VARCHAR2(30));. What happens on INSERT INTO orders (id, item) VALUES (1, 'Book');?", options: [
    "Inserts id = 1 cleanly",
    "Raises ORA-32795: cannot insert into a generated always identity column",
    "Ignores 1 and generates 2",
    "Inserts NULL"
  ], answer: [1], explanation: "GENERATED ALWAYS forbids user-supplied values in INSERT (use GENERATED BY DEFAULT to allow overrides)." },
  { id: "M53", domainId: 9, prompt: "Why might a sequence skip numbers (e.g., jump from 10 to 30)?", options: [
    "Sequences always skip even numbers",
    "A ROLLBACK occurred, a shared sequence was used by another table, or cached sequence numbers aged out",
    "NEXTVAL was called twice without COMMIT",
    "Both B and C are causes of sequence gaps"
  ], answer: [3], explanation: "Sequences are non-transactional: rollbacks, instance restarts (lost CACHE), and shared usage all create gaps." },
  { id: "M54", domainId: 9, prompt: "What is the key difference between a PRIVATE synonym and a PUBLIC synonym?", options: [
    "Only DBAs can use PUBLIC synonyms",
    "A PRIVATE synonym belongs to your schema only; a PUBLIC synonym is accessible by all database users (subject to object privileges)",
    "PUBLIC synonyms grant SELECT privilege automatically",
    "PRIVATE synonyms cannot point to views"
  ], answer: [1], explanation: "Synonyms provide alternate names only—they never bypass object privileges." },

  // Domain 10 (3 questions - 5%)
  { id: "M55", domainId: 10, prompt: "What does the SEARCH_CONDITION column in USER_CONSTRAINTS show for constraint_type = 'C'?", options: [
    "The referenced parent Primary Key",
    "The CHECK condition or NOT NULL predicate text",
    "The index name",
    "The column's COMMENT"
  ], answer: [1], explanation: "Constraint type 'C' represents both CHECK and NOT NULL constraints, with the rule shown in SEARCH_CONDITION." },
  { id: "M56", domainId: 10, prompt: "What does SELECT DATE '2026-01-15' + TO_YMINTERVAL('02-03') FROM dual; return?", options: ["2028-04-15", "2026-03-18", "2028-01-15", "ORA-01843 error"], answer: [0], explanation: "Adds 2 years and 3 months to 2026-01-15 -> 2028-04-15." },
  { id: "M57", domainId: 10, prompt: "Which two datetime functions depend on the client's SESSIONTIMEZONE rather than the database host OS clock?", multi: true, options: ["SYSDATE", "CURRENT_DATE", "CURRENT_TIMESTAMP", "SYSTIMESTAMP"], answer: [1, 2], explanation: "CURRENT_DATE, CURRENT_TIMESTAMP, and LOCALTIMESTAMP use SESSIONTIMEZONE; SYSDATE and SYSTIMESTAMP use the DB host OS clock." },

  // Domain 11 (3 questions - 5%)
  { id: "M58", domainId: 11, prompt: "Which two statements are TRUE about database Roles?", multi: true, options: [
    "A role can contain both system privileges and object privileges",
    "A role is owned by the user who created it",
    "A role can be granted to another role",
    "An object privilege granted via a role allows creating views on that table"
  ], answer: [0, 2], explanation: "Roles bundle system + object privileges and can be granted to other roles. Roles are not owned by a schema, and view creation requires direct object privileges (not via roles)." },
  { id: "M59", domainId: 11, prompt: "Which command grants SELECT and UPDATE (only on SAL and COMM) on MY_EMP to user ALICE?", options: [
    "GRANT SELECT, UPDATE (sal, comm) ON my_emp TO alice;",
    "GRANT SELECT (sal, comm), UPDATE ON my_emp TO alice;",
    "GRANT UPDATE ON my_emp (sal, comm) TO alice;",
    "GRANT ALL (sal, comm) ON my_emp TO alice;"
  ], answer: [0], explanation: "Column-level object grants apply to INSERT, UPDATE, and REFERENCES—not SELECT." },
  { id: "M60", domainId: 11, prompt: "What privilege must user BOB hold in order to query scott.emp when SCOTT runs GRANT SELECT ON emp TO PUBLIC;?", options: [
    "BOB still needs GRANT SELECT ON scott.emp",
    "BOB only needs CREATE SESSION (login privilege)",
    "BOB needs DBA role",
    "BOB needs SELECT ANY TABLE"
  ], answer: [1], explanation: "PUBLIC grants apply to all current and future database users, so BOB only needs CREATE SESSION to connect and query." }
];
