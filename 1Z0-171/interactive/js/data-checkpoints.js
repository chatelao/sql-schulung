window.CHECKPOINT_SLOTS = [
  { id: "CP-0", lessons: "L001–L002", label: "Baseline (Zero Knowledge)", expected: "10–25%" },
  { id: "CP-1", lessons: "L041–L042", label: "After Phase 2 (SELECT & Filtering)", expected: "30–40%" },
  { id: "CP-2", lessons: "L081–L082", label: "After Phase 4 (Functions & Grouping)", expected: "50–60%" },
  { id: "CP-3", lessons: "L121–L122", label: "After Phase 6 (Joins, Subqueries, SET)", expected: "65–72%" },
  { id: "CP-4", lessons: "L161–L162", label: "After Phase 8 (DML, DDL, Views, Indexes)", expected: "75–85%" },
  { id: "CP-5", lessons: "L199–L200", label: "Final Readiness (Answer Key Unlocked)", expected: "≥ 85%" }
];

// Fixed 22-question standardized benchmark (2 identical questions per each of the 11 exam domains)
window.CHECKPOINT_QUESTIONS = [
  // Domain 1: Relational Database Concepts
  {
    id: "CPQ01",
    domainId: 1,
    prompt: "In an Entity-Relationship Diagram (ERD) mapped to a SQL SELECT query on SCOTT.EMP and SCOTT.DEPT, what does an attribute of an entity correspond to?",
    options: ["A table in the FROM clause", "A column in the SELECT or WHERE clause", "A join condition in the ON clause", "A transaction SAVEPOINT"],
    answer: [1],
    explanation: "Entities map to tables, attributes map to columns, and relationships map to Primary/Foreign Key join conditions."
  },
  {
    id: "CPQ02",
    domainId: 1,
    prompt: "Which two SQL statements belong to Data Definition Language (DDL) and trigger an implicit COMMIT?",
    multi: true,
    options: ["TRUNCATE TABLE my_emp;", "DELETE FROM my_emp;", "ALTER TABLE my_emp ADD notes VARCHAR2(50);", "SAVEPOINT sp1;"],
    answer: [0, 2],
    explanation: "TRUNCATE and ALTER are DDL statements (auto-commit). DELETE is DML and SAVEPOINT is TCL."
  },
  // Domain 2: Retrieving and Sorting Data
  {
    id: "CPQ03",
    domainId: 2,
    prompt: "In SCOTT.EMP, SMITH has SAL=800 and COMM=NULL. What does SELECT ename, sal + comm FROM scott.emp WHERE ename = 'SMITH'; return?",
    options: ["SMITH | 800", "SMITH | 0", "SMITH | NULL", "ORA-01722: invalid number"],
    answer: [2],
    explanation: "Any arithmetic operation involving NULL yields NULL."
  },
  {
    id: "CPQ04",
    domainId: 2,
    prompt: "Which ORDER BY clause runs without error when executing: SELECT ename, sal * 12 annual_pay FROM scott.emp?",
    options: ["WHERE annual_pay > 20000 ORDER BY 2 DESC", "ORDER BY \"annual_pay\" DESC", "ORDER BY annual_pay DESC, 1 ASC", "ORDER BY 3 ASC"],
    answer: [2],
    explanation: "Column aliases work in ORDER BY (not WHERE). Unquoted aliases are case-insensitive, while quoted \"annual_pay\" mismatches uppercase ANNUAL_PAY, and position 3 is out of range."
  },
  // Domain 3: Using Functions
  {
    id: "CPQ05",
    domainId: 3,
    prompt: "What is the result of SELECT SUBSTR('SALESMAN', -3, 2) FROM dual;?",
    options: ["'AL'", "'MA'", "'AN'", "'SA'"],
    answer: [1],
    explanation: "Negative start -3 counts 3 characters from the right ('M'), then takes 2 characters left-to-right: 'MA'."
  },
  {
    id: "CPQ06",
    domainId: 3,
    prompt: "What happens when you execute: SELECT ename, NVL(comm, 'None') FROM scott.emp;?",
    options: ["Displays 'None' wherever comm is NULL", "Converts comm to VARCHAR2 implicitly and succeeds", "Raises ORA-01722: invalid number", "Returns NULL for every row"],
    answer: [2],
    explanation: "NVL converts its second argument to the data type of the first argument (NUMBER). 'None' cannot convert to a number, raising ORA-01722."
  },
  // Domain 4: Displaying Data from Multiple Tables
  {
    id: "CPQ07",
    domainId: 4,
    prompt: "What happens when you run: SELECT e.ename, e.deptno, d.dname FROM scott.emp e JOIN scott.dept d USING (deptno);?",
    options: ["Returns 14 rows cleanly", "Returns 56 rows (Cartesian product)", "Fails with ORA-25154 because e.deptno has a qualifier", "Fails because DEPT 40 has no employees"],
    answer: [2],
    explanation: "A column referenced in the USING clause cannot have a table alias/qualifier anywhere in the SQL statement (ORA-25154)."
  },
  {
    id: "CPQ08",
    domainId: 4,
    prompt: "Which join returns all 4 rows of SCOTT.DEPT including DEPT 40 (OPERATIONS), which has zero employees?",
    options: ["scott.emp e INNER JOIN scott.dept d ON e.deptno = d.deptno", "scott.emp e LEFT OUTER JOIN scott.dept d ON e.deptno = d.deptno", "scott.emp e RIGHT OUTER JOIN scott.dept d ON e.deptno = d.deptno", "scott.emp NATURAL JOIN scott.dept"],
    answer: [2],
    explanation: "DEPT is on the right side of the join, so RIGHT OUTER JOIN (or FULL OUTER JOIN) preserves unmatched DEPT 40."
  },
  // Domain 5: Using Subqueries
  {
    id: "CPQ09",
    domainId: 5,
    prompt: "In SCOTT.EMP, KING has MGR = NULL. How many rows does SELECT ename FROM scott.emp WHERE empno NOT IN (SELECT mgr FROM scott.emp); return?",
    options: ["14 rows", "8 rows (all non-managers)", "0 rows", "Raises ORA-01427"],
    answer: [2],
    explanation: "Because the subquery includes NULL (KING's MGR), every NOT IN comparison evaluates to UNKNOWN, returning 0 rows."
  },
  {
    id: "CPQ10",
    domainId: 5,
    prompt: "Which operator is TRUE if a salary is greater than the LOWEST salary returned by a multi-row subquery?",
    options: ["> ALL", "> ANY", "= ALL", "NOT EXISTS"],
    answer: [1],
    explanation: "> ANY means greater than at least one value in the list, which is equivalent to greater than the minimum."
  },
  // Domain 6: Using SET Operators
  {
    id: "CPQ11",
    domainId: 6,
    prompt: "Which statement is TRUE about compound queries using UNION?",
    options: ["UNION preserves duplicate rows by default", "Column headings come from the last SELECT statement", "ORDER BY may appear only once at the very end of the compound query", "Each SELECT may have a different number of columns"],
    answer: [2],
    explanation: "UNION removes duplicates, uses column headings from the first SELECT, requires matching column counts/types, and allows ORDER BY only at the end."
  },
  {
    id: "CPQ12",
    domainId: 6,
    prompt: "Which query returns only DEPTNO 40 (the department in SCOTT.DEPT with no employees in SCOTT.EMP)?",
    options: [
      "SELECT deptno FROM scott.emp MINUS SELECT deptno FROM scott.dept;",
      "SELECT deptno FROM scott.dept MINUS SELECT deptno FROM scott.emp;",
      "SELECT deptno FROM scott.dept INTERSECT SELECT deptno FROM scott.emp;",
      "SELECT deptno FROM scott.dept UNION ALL SELECT deptno FROM scott.emp;"
    ],
    answer: [1],
    explanation: "DEPT MINUS EMP returns values present in DEPT (10,20,30,40) that are absent from EMP (10,20,30) -> 40."
  },
  // Domain 7: Managing Tables with DML
  {
    id: "CPQ13",
    domainId: 7,
    prompt: "You run an UPDATE on my_emp, create SAVEPOINT sp1, run a DELETE, execute CREATE TABLE tmp (id NUMBER); (which succeeds), and then run ROLLBACK TO sp1;. What happens?",
    options: ["Only the DELETE is undone", "Both UPDATE and DELETE are undone", "An error occurs because CREATE TABLE implicitly committed and erased SAVEPOINT sp1", "The CREATE TABLE is rolled back"],
    answer: [2],
    explanation: "Executing any DDL statement (CREATE TABLE) triggers an implicit COMMIT, ending the transaction and invalidating earlier savepoints."
  },
  {
    id: "CPQ14",
    domainId: 7,
    prompt: "In a conditional multi-table INSERT FIRST statement with two WHEN clauses and an ELSE clause, if a source row satisfies BOTH WHEN conditions, where is it inserted?",
    options: ["Into the target tables of both WHEN clauses", "Only into the target table of the first matching WHEN clause", "Into the ELSE target table", "An ORA- error is raised"],
    answer: [1],
    explanation: "INSERT FIRST stops evaluating after the first matching WHEN clause; INSERT ALL evaluates every WHEN clause."
  },
  // Domain 8: DDL for Tables and Relationships
  {
    id: "CPQ15",
    domainId: 8,
    prompt: "When you execute CREATE TABLE emp_copy AS SELECT * FROM scott.emp;, which constraints are copied to emp_copy?",
    options: ["PRIMARY KEY and FOREIGN KEY", "All constraints including CHECK", "Only explicitly defined NOT NULL constraints", "No constraints at all, not even NOT NULL"],
    answer: [2],
    explanation: "CTAS copies column names, data types, rows, and only explicit NOT NULL constraints (not PK, FK, UNIQUE, CHECK, or DEFAULT)."
  },
  {
    id: "CPQ16",
    domainId: 8,
    prompt: "Which statement about a UNIQUE constraint in Oracle Database is true?",
    options: ["A UNIQUE column cannot contain any NULL values", "A UNIQUE column can contain multiple NULL values", "A UNIQUE constraint never creates an index", "A table can have only one UNIQUE constraint"],
    answer: [1],
    explanation: "In Oracle, NULL != NULL, so a UNIQUE constraint permits multiple NULL rows (unless NOT NULL is also specified)."
  },
  // Domain 9: Managing Indexes, Synonyms, Sequences
  {
    id: "CPQ17",
    domainId: 9,
    prompt: "In a brand-new database session, you immediately run SELECT emp_seq.CURRVAL FROM dual; without calling NEXTVAL first. What happens?",
    options: ["Returns the sequence's START WITH value", "Returns 0", "Raises ORA-08002: sequence EMP_SEQ.CURRVAL is not yet defined in this session", "Automatically increments and returns 1"],
    answer: [2],
    explanation: "CURRVAL can only be referenced in a session after NEXTVAL has been executed at least once in that session."
  },
  {
    id: "CPQ18",
    domainId: 9,
    prompt: "For which constraints does Oracle automatically create an index?",
    options: ["NOT NULL and CHECK", "PRIMARY KEY and FOREIGN KEY", "PRIMARY KEY and UNIQUE", "FOREIGN KEY and CHECK"],
    answer: [2],
    explanation: "Oracle automatically creates unique indexes to enforce PRIMARY KEY and UNIQUE constraints (not FOREIGN KEY)."
  },
  // Domain 10: Data Dictionary and Time Zones
  {
    id: "CPQ19",
    domainId: 10,
    prompt: "Which data dictionary view prefix displays all objects that you own PLUS any objects owned by others to which you have been granted access?",
    options: ["USER_*", "ALL_*", "DBA_*", "V$*"],
    answer: [1],
    explanation: "USER_* shows only objects you own; ALL_* shows objects you own plus those granted to you; DBA_* shows everything in the DB."
  },
  {
    id: "CPQ20",
    domainId: 10,
    prompt: "Which data type normalizes inserted values to the database time zone on disk and converts them back to the user's SESSIONTIMEZONE on retrieval?",
    options: ["DATE", "TIMESTAMP", "TIMESTAMP WITH TIME ZONE", "TIMESTAMP WITH LOCAL TIME ZONE"],
    answer: [3],
    explanation: "TIMESTAMP WITH LOCAL TIME ZONE stores normalized DB time zone values and displays them in the querying user's SESSIONTIMEZONE."
  },
  // Domain 11: Controlling User Access
  {
    id: "CPQ21",
    domainId: 11,
    prompt: "SYS grants CREATE TABLE TO alice WITH ADMIN OPTION. Alice grants CREATE TABLE TO bob. Later, SYS executes REVOKE CREATE TABLE FROM alice;. What is Bob's status?",
    options: ["Bob loses CREATE TABLE automatically (cascade)", "Bob retains CREATE TABLE because system privilege revokes do not cascade", "Bob receives an ORA- error on next login", "The REVOKE fails unless CASCADE is specified"],
    answer: [1],
    explanation: "System privileges granted WITH ADMIN OPTION do NOT cascade when revoked. (Only object privileges granted WITH GRANT OPTION cascade.)"
  },
  {
    id: "CPQ22",
    domainId: 11,
    prompt: "Alice grants SELECT ON alice.emp TO bob WITH GRANT OPTION. Bob grants SELECT ON alice.emp TO carol. Alice then runs REVOKE SELECT ON alice.emp FROM bob;. What happens to Carol?",
    options: ["Carol keeps SELECT privilege", "Carol's SELECT privilege is automatically revoked (cascades)", "Alice gets an error because Bob granted it further", "Only Bob's WITH GRANT OPTION is removed"],
    answer: [1],
    explanation: "Revoking an object privilege granted WITH GRANT OPTION automatically cascades and revokes dependent grants."
  }
];

window.CHECKPOINT_SQL_TASKS = [
  {
    id: "TASK1",
    title: "Gold Standard Task 1 (SCOTT Join + Null-Safe Aggregation)",
    prompt: "Write a query joining SCOTT.EMP, SCOTT.DEPT, and SCOTT.SALGRADE showing department name, headcount, and average total compensation (SAL + COMM treating NULL COMM as 0), keeping departments with at least 2 employees.",
    reference: `SELECT d.dname,
       COUNT(e.empno) AS headcount,
       ROUND(AVG(e.sal + NVL(e.comm, 0)), 2) AS avg_total_comp
FROM scott.dept d
JOIN scott.emp e ON d.deptno = e.deptno
JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal
GROUP BY d.dname
HAVING COUNT(e.empno) >= 2
ORDER BY avg_total_comp DESC;`
  },
  {
    id: "TASK2",
    title: "Gold Standard Task 2 (Subquery / SET Operator)",
    prompt: "Write a query listing employees in SCOTT.EMP who earn strictly more than the average salary of their own department.",
    reference: `SELECT e.empno, e.ename, e.deptno, e.sal
FROM scott.emp e
WHERE e.sal > (
  SELECT AVG(i.sal)
  FROM scott.emp i
  WHERE i.deptno = e.deptno
);`
  },
  {
    id: "TASK3",
    title: "Gold Standard Task 3 (DDL Constraints)",
    prompt: "Write a CREATE TABLE statement for COURSE_ENROLLMENTS with enroll_id (PK), empno (FK to my_emp(empno) with ON DELETE SET NULL), and status restricted to 'ACTIVE' or 'COMPLETED'.",
    reference: `CREATE TABLE course_enrollments (
  enroll_id NUMBER(6) CONSTRAINT pk_enroll PRIMARY KEY,
  empno     NUMBER(4) CONSTRAINT fk_enroll_emp REFERENCES my_emp(empno) ON DELETE SET NULL,
  status    VARCHAR2(12) CONSTRAINT chk_enroll_status CHECK (status IN ('ACTIVE', 'COMPLETED'))
);`
  }
];
