window.HUMAN_COMPILER_DRILLS = [
  // Clinic 1: NULL & 3-Valued-Logic-Fallen (Phasen 1-2)
  {
    id: "HC01", clinic: 1, phaseGroup: "1-4",
    sql: `SELECT ename, sal * 12 annual_sal
FROM scott.emp
WHERE annual_sal > 30000;`,
    verdict: "error",
    explanation: "ORA-00904: \"ANNUAL_SAL\": invalid identifier. In SELECT definierte Column Aliases sind in WHERE noch nicht sichtbar."
  },
  {
    id: "HC02", clinic: 1, phaseGroup: "1-4",
    sql: `SELECT ename, sal, comm
FROM scott.emp
WHERE comm = NULL;`,
    verdict: "zero",
    explanation: "Wirft KEINEN Fehler, liefert aber 0 Zeilen! Jeder Vergleich mit = NULL ergibt UNKNOWN. Verwende IS NULL."
  },
  {
    id: "HC03", clinic: 1, phaseGroup: "1-4",
    sql: `SELECT ename, sal
FROM scott.emp
WHERE sal BETWEEN 3000 AND 1500;`,
    verdict: "zero",
    explanation: "Gültige Syntax, liefert aber 0 Zeilen! BETWEEN verlangt die Untergrenze zuerst (sal >= 3000 AND sal <= 1500 ist immer falsch)."
  },
  {
    id: "HC04", clinic: 1, phaseGroup: "1-4",
    sql: `SELECT DISTINCT deptno, DISTINCT job
FROM scott.emp;`,
    verdict: "error",
    explanation: "ORA-00936: missing expression. DISTINCT darf nur einmal direkt nach SELECT stehen."
  },
  {
    id: "HC05", clinic: 1, phaseGroup: "1-4",
    sql: `SELECT ename FROM scott.emp
WHERE ename LIKE 'S%T__';`,
    verdict: "zero",
    explanation: "Liefert 0 Zeilen! 'SMITH' hat nach dem T nur ein Zeichen ('H'), nicht zwei Zeichen wie vom Muster 'S%T__' gefordert."
  },
  {
    id: "HC06", clinic: 1, phaseGroup: "1-4",
    sql: `SELECT ename, sal
FROM scott.emp
ORDER BY sal DESC
FETCH FIRST 2 ROWS WITH TIES;`,
    verdict: "rows",
    explanation: "Liefert 3 Zeilen! KING (5000) liegt auf Platz 1, und sowohl SCOTT (3000) als auch FORD (3000) teilen sich Platz 2 – WITH TIES nimmt daher alle drei auf."
  },

  // Clinic 2: Nested Functions, Conversion Masks & Aggregation (Phasen 3-4)
  {
    id: "HC07", clinic: 2, phaseGroup: "1-4",
    sql: `SELECT ename, NVL(comm, 'None')
FROM scott.emp;`,
    verdict: "error",
    explanation: "ORA-01722: invalid number. Argument 1 (comm) ist NUMBER, daher kann 'None' nicht implizit in NUMBER konvertiert werden."
  },
  {
    id: "HC08", clinic: 2, phaseGroup: "1-4",
    sql: `SELECT deptno, MAX(AVG(sal))
FROM scott.emp
GROUP BY deptno;`,
    verdict: "error",
    explanation: "ORA-00937: not a single-group group function. Bei verschachtelten Aggregate Functions (Tiefe 2) dürfen keine unaggregierten Spalten wie deptno im SELECT stehen."
  },
  {
    id: "HC09", clinic: 2, phaseGroup: "1-4",
    sql: `SELECT MAX(AVG(sal))
FROM scott.emp
GROUP BY deptno;`,
    verdict: "rows",
    explanation: "Liefert 1 Zeile (2916.67 für Dept 10)! Verschachtelte Group Functions der Tiefe 2 mit GROUP BY und ohne weitere Spalten im SELECT sind gültig."
  },
  {
    id: "HC10", clinic: 2, phaseGroup: "1-4",
    sql: `SELECT TRIM('AB' FROM 'ABSMITHAB') FROM dual;`,
    verdict: "error",
    explanation: "ORA-30001: trim set should have only one character. Für mehrstellige Zeichenmengen nutze LTRIM/RTRIM."
  },
  {
    id: "HC11", clinic: 2, phaseGroup: "1-4",
    sql: `SELECT CONCAT('EMP: ', ename, job) FROM scott.emp;`,
    verdict: "error",
    explanation: "ORA-00909: invalid number of arguments. CONCAT akzeptiert strikt 2 Argumente; für 3+ Strings verwende ||."
  },
  {
    id: "HC12", clinic: 2, phaseGroup: "1-4",
    sql: `SELECT ename, DECODE(comm, NULL, 'Missing', comm)
FROM scott.emp;`,
    verdict: "rows",
    explanation: "Läuft durch und liefert 14 Zeilen! Anders als CASE WHEN NULL wertet DECODE NULL = NULL als Treffer, und da Argument 3 ('Missing') VARCHAR2 ist, konvertiert DECODE comm nach VARCHAR2."
  },

  // Clinic 3: Joins, USING & Outer-Filter (Phase 5)
  {
    id: "HC13", clinic: 3, phaseGroup: "5-6",
    sql: `SELECT e.ename, e.deptno, d.dname
FROM scott.emp e
JOIN scott.dept d USING (deptno);`,
    verdict: "error",
    explanation: "ORA-25154: column part of USING clause cannot have qualifier (entferne e. vor e.deptno)."
  },
  {
    id: "HC14", clinic: 3, phaseGroup: "5-6",
    sql: `SELECT d.dname, e.ename
FROM scott.dept d
LEFT JOIN scott.emp e ON d.deptno = e.deptno
WHERE e.job = 'CLERK';`,
    verdict: "rows",
    explanation: "Liefert 4 Zeilen (nur die CLERKs aus Dept 10, 20, 30) – DEPT 40 OPERATIONS fällt stillschweigend weg, weil WHERE e.job = 'CLERK' die NULL-Zeile herausfiltert!"
  },
  {
    id: "HC15", clinic: 3, phaseGroup: "5-6",
    sql: `SELECT empno, ename, dname
FROM scott.emp
NATURAL JOIN scott.dept
WHERE deptno = 40;`,
    verdict: "zero",
    explanation: "Gültiges SQL (INNER JOIN über deptno), liefert aber 0 Zeilen, weil kein Employee in SCOTT.EMP zu deptno 40 gehört."
  },
  {
    id: "HC16", clinic: 3, phaseGroup: "5-6",
    sql: `SELECT e.ename, d.dname
FROM scott.emp e
JOIN scott.dept d ON e.deptno = d.deptno
WHERE deptno = 10;`,
    verdict: "error",
    explanation: "ORA-00918: column ambiguously defined. Bei JOIN ... ON muss deptno im WHERE qualifiziert werden (e.deptno = 10)."
  },
  {
    id: "HC17", clinic: 3, phaseGroup: "5-6",
    sql: `SELECT e.ename, s.grade
FROM scott.emp e
JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal
WHERE s.grade = 5;`,
    verdict: "rows",
    explanation: "Läuft fehlerfrei und liefert 1 Zeile (KING mit sal 5000 in Grade 5: 3001..9999)."
  },
  {
    id: "HC18", clinic: 3, phaseGroup: "5-6",
    sql: `SELECT e.ename, d.dname
FROM scott.emp e, scott.dept d
WHERE e.deptno(+) = d.deptno(+);`,
    verdict: "error",
    explanation: "ORA-01468: a predicate may reference only one outer-joined table. Die Legacy-Syntax (+) erlaubt keinen FULL OUTER JOIN."
  },

  // Clinic 4: Subqueries & SET Operators (Phase 6)
  {
    id: "HC19", clinic: 4, phaseGroup: "5-6",
    sql: `SELECT ename
FROM scott.emp
WHERE empno NOT IN (SELECT mgr FROM scott.emp);`,
    verdict: "zero",
    explanation: "Liefert 0 Zeilen! KING hat mgr = NULL, wodurch NOT IN (..., NULL) für jede Zeile zu UNKNOWN auswertet."
  },
  {
    id: "HC20", clinic: 4, phaseGroup: "5-6",
    sql: `SELECT deptno FROM scott.emp
ORDER BY deptno
UNION
SELECT deptno FROM scott.dept;`,
    verdict: "error",
    explanation: "ORA-00933: SQL command not properly ended. ORDER BY darf in einer SET Query nur ganz am Ende stehen."
  },
  {
    id: "HC21", clinic: 4, phaseGroup: "5-6",
    sql: `SELECT ename, sal
FROM scott.emp
WHERE sal > (SELECT sal FROM scott.emp WHERE ename = 'GHOST');`,
    verdict: "zero",
    explanation: "Gültige Query mit 0 Zeilen! Eine leere Scalar Subquery wertet zu NULL aus, und sal > NULL ist UNKNOWN."
  },
  {
    id: "HC22", clinic: 4, phaseGroup: "5-6",
    sql: `SELECT empno, ename FROM scott.emp
WHERE deptno = 10
UNION
SELECT deptno, dname FROM scott.dept;`,
    verdict: "rows",
    explanation: "Läuft durch! Beide Zweige haben 2 Spalten mit passenden Datentypen (NUMBER, VARCHAR2). Die Spaltenköpfe stammen vom ersten SELECT (EMPNO, ENAME)."
  },
  {
    id: "HC23", clinic: 4, phaseGroup: "5-6",
    sql: `SELECT ename FROM scott.emp
WHERE deptno = (SELECT deptno FROM scott.dept WHERE loc IN ('DALLAS', 'CHICAGO'));`,
    verdict: "error",
    explanation: "ORA-01427: single-row subquery returns more than one row. Der Operator = erwartet maximal 1 Zeile, die Subquery liefert 2 (20 und 30)."
  },
  {
    id: "HC24", clinic: 4, phaseGroup: "5-6",
    sql: `SELECT d.deptno, d.dname FROM scott.dept d
WHERE NOT EXISTS (SELECT 1 FROM scott.emp e WHERE e.deptno = d.deptno);`,
    verdict: "rows",
    explanation: "Liefert 1 Zeile (40 | OPERATIONS)! NOT EXISTS ist NULL-sicher und findet Abteilungen ohne Mitarbeiter zuverlässig."
  },

  // Clinic 5: DML, TCL, DDL, Views & Sequences (Phasen 7-8)
  {
    id: "HC25", clinic: 5, phaseGroup: "7-9",
    sql: `CREATE TABLE t_chk (
  id NUMBER PRIMARY KEY,
  dt DATE CHECK (dt <= SYSDATE)
);`,
    verdict: "error",
    explanation: "ORA-02436: date or system variable wrongly specified in CHECK constraint. SYSDATE und USER sind in CHECK Constraints verboten."
  },
  {
    id: "HC26", clinic: 5, phaseGroup: "7-9",
    sql: `CREATE TABLE t_id (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  name VARCHAR2(20)
);
INSERT INTO t_id (id, name) VALUES (1, 'Test');`,
    verdict: "error",
    explanation: "ORA-32795: cannot insert into a generated always identity column. Bei GENERATED ALWAYS darf id nicht explizit angegeben werden."
  },
  {
    id: "HC27", clinic: 5, phaseGroup: "7-9",
    sql: `CREATE SEQUENCE s1 START WITH 10;
SELECT s1.CURRVAL FROM dual;`,
    verdict: "error",
    explanation: "ORA-08002: sequence S1.CURRVAL is not yet defined in this session. Vor CURRVAL muss in derselben Session mindestens einmal NEXTVAL aufgerufen werden."
  },
  {
    id: "HC28", clinic: 5, phaseGroup: "7-9",
    sql: `CREATE TABLE t_uq (id NUMBER, code VARCHAR2(10) UNIQUE);
INSERT INTO t_uq VALUES (1, NULL);
INSERT INTO t_uq VALUES (2, NULL);
SELECT * FROM t_uq;`,
    verdict: "rows",
    explanation: "Läuft fehlerfrei und liefert 2 Zeilen! Ein UNIQUE Constraint erlaubt beliebig viele NULL-Werte (sofern nicht zusätzlich NOT NULL gesetzt ist)."
  },
  {
    id: "HC29", clinic: 5, phaseGroup: "7-9",
    sql: `UPDATE my_emp SET sal = 9999 WHERE empno = 7369;
SAVEPOINT sp1;
CREATE TABLE t_tmp (x NUMBER);
ROLLBACK TO SAVEPOINT sp1;`,
    verdict: "error",
    explanation: "ORA-01086: savepoint 'SP1' never established in this session or is invalid. CREATE TABLE (DDL) hat ein implizites COMMIT ausgelöst und sp1 gelöscht!"
  },
  {
    id: "HC30", clinic: 5, phaseGroup: "7-9",
    sql: `SELECT TO_CHAR(12500, '$9,999')
FROM dual;`,
    verdict: "rows",
    explanation: "Liefert 1 Zeile mit '#######' (Überlaufzeichen), weil 12500 fünf Ziffern benötigt, die Mask aber nur vier Ziffernstellen vorsieht."
  },

  // Clinic 6: Data Dictionary, Time Zones & DCL (Phase 9)
  {
    id: "HC31", clinic: 6, phaseGroup: "7-9",
    sql: `SELECT table_name
FROM user_tables
WHERE table_name = 'emp';`,
    verdict: "zero",
    explanation: "Liefert 0 Zeilen! Objektnamen werden im Oracle Data Dictionary standardmäßig in GROSSBUCHSTABEN ('EMP') gespeichert."
  },
  {
    id: "HC32", clinic: 6, phaseGroup: "7-9",
    sql: `SELECT owner, table_name
FROM user_tables;`,
    verdict: "error",
    explanation: "ORA-00904: \"OWNER\": invalid identifier. USER_*-Views zeigen nur eigene Objekte und besitzen daher keine OWNER-Spalte (nur ALL_* und DBA_* haben OWNER)."
  },
  {
    id: "HC33", clinic: 6, phaseGroup: "7-9",
    sql: `SELECT DATE '2026-01-15' + TO_YMINTERVAL('02-03')
FROM dual;`,
    verdict: "rows",
    explanation: "Liefert 1 Zeile (2028-04-15)! TO_YMINTERVAL('02-03') addiert exakt 2 Jahre und 3 Monate."
  },
  {
    id: "HC34", clinic: 6, phaseGroup: "7-9",
    sql: `SELECT NVL2(comm, 0, 'Has Comm')
FROM scott.emp;`,
    verdict: "error",
    explanation: "ORA-01722: invalid number. Bei NVL2(expr, val1, val2) wird val2 in den Datentyp von val1 (NUMBER) konvertiert, und 'Has Comm' ist keine gültige Zahl."
  },
  {
    id: "HC35", clinic: 6, phaseGroup: "7-9",
    sql: `SELECT CURRENT_TIMESTAMP, LOCALTIMESTAMP
FROM dual;`,
    verdict: "rows",
    explanation: "Läuft fehlerfrei und liefert 1 Zeile: CURRENT_TIMESTAMP enthält die SESSIONTIMEZONE, LOCALTIMESTAMP ist ein TIMESTAMP ohne Time Zone."
  },
  {
    id: "HC36", clinic: 6, phaseGroup: "7-9",
    sql: `GRANT SELECT (ename, sal) ON scott.emp TO alice;`,
    verdict: "error",
    explanation: "ORA-00969 / Syntaxfehler! Spaltenbezogene Object Privileges sind nur für INSERT, UPDATE und REFERENCES zulässig – nicht für SELECT."
  }
];

window.FLASHCARDS_1Z0_171 = [
  { id: "FC01", domainId: 1, phaseId: 1, q: "Worauf bilden Entities, Attributes und Relationships eines ERDs in SQL ab?", a: "Entity -> Table (FROM)\nAttribute -> Column (SELECT/WHERE)\nRelationship -> Join Condition (ON)" },
  { id: "FC02", domainId: 1, phaseId: 1, q: "Welche SQL Statement Families lösen ein implizites COMMIT aus?", a: "DDL (CREATE, ALTER, DROP, TRUNCATE, RENAME) und DCL (GRANT, REVOKE).\nDML (INSERT, UPDATE, DELETE, MERGE) führt KEIN Auto-Commit aus." },
  { id: "FC03", domainId: 1, phaseId: 1, q: "Was ist der Unterschied zwischen Primary Key und Foreign Key?", a: "Ein Primary Key identifiziert jede Zeile eindeutig (NOT NULL + UNIQUE).\nEin Foreign Key verweist auf einen PK/UNIQUE-Schlüssel zur Sicherung der Referential Integrity." },
  { id: "FC04", domainId: 1, phaseId: 1, q: "Zu welcher SQL-Familie gehört TRUNCATE TABLE und warum ist das wichtig?", a: "DDL! Es löst ein implizites COMMIT aus und kann nicht mit ROLLBACK rückgängig gemacht werden." },
  { id: "FC05", domainId: 1, phaseId: 1, q: "Was bedeutet in einem Crow's-Foot-ERD die Notation DEPT ||--o{ EMP?", a: "Ein Department (genau 1) hat null, einen oder viele Employees (o{)." },
  { id: "FC06", domainId: 2, phaseId: 2, q: "In welcher logischen Reihenfolge wertet Oracle SELECT-Klauseln aus?", a: "FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> OFFSET/FETCH." },
  { id: "FC07", domainId: 2, phaseId: 2, q: "Warum funktioniert WHERE sal * 12 > 30000, während WHERE annual_sal > 30000 fehlschlägt?", a: "WHERE läuft VOR SELECT. In SELECT definierte Column Aliases existieren während der WHERE-Auswertung noch nicht (ORA-00904)." },
  { id: "FC08", domainId: 2, phaseId: 2, q: "Was unterscheidet &var von &&var in SQL*Plus?", a: "&var fragt bei jeder Ausführung erneut nach und speichert den Wert nicht.\n&&var fragt nur einmal, legt per DEFINE automatisch eine Session Variable an und verwendet sie wieder." },
  { id: "FC09", domainId: 2, phaseId: 1, q: "Was liefert sal + comm für SMITH (sal=800, comm=NULL) und für TURNER (sal=1500, comm=0)?", a: "SMITH: NULL (Arithmetik mit NULL ergibt immer NULL).\nTURNER: 1500 (0 ist eine Zahl, kein NULL!)." },
  { id: "FC10", domainId: 2, phaseId: 1, q: "Was liefert 'Hello ' || NULL || 'World' in Oracle SQL?", a: "'Hello World'! Der Verkettungsoperator || behandelt NULL wie einen leeren String (im Gegensatz zu +)." },
  { id: "FC11", domainId: 2, phaseId: 1, q: "Wofür steht der Alternative Quote Operator q'[...]'?", a: "Er schließt Literale mit einfachen Anführungszeichen ein, ohne doppelte '' schreiben zu müssen, z. B. q'[King's Salary]'." },
  { id: "FC12", domainId: 2, phaseId: 1, q: "Welche Anführungszeichen braucht ein Column Alias mit Leerzeichen (z. B. Annual Salary)?", a: "\"Double Quotes\" (\"Annual Salary\"). Niemals 'Single Quotes' (ORA-00923)." },
  { id: "FC13", domainId: 2, phaseId: 2, q: "Was passiert bei WHERE sal BETWEEN 3000 AND 1500?", a: "Kein Fehler, aber 0 Zeilen! Bei BETWEEN muss immer die Untergrenze zuerst stehen." },
  { id: "FC14", domainId: 2, phaseId: 2, q: "Wie suchst du in LIKE nach einem wörtlichen Unterstrich '_' (z. B. 'SA_REP')?", a: "Mit ESCAPE: WHERE job_id LIKE 'SA\\_%' ESCAPE '\\'. Sonst ist _ eine Wildcard für genau 1 Zeichen." },
  { id: "FC15", domainId: 2, phaseId: 2, q: "Was ist die Operator Precedence der logischen Operatoren?", a: "NOT (höchste) -> AND -> OR (niedrigste). Bei gemischtem AND/OR immer Klammern setzen!" },
  { id: "FC16", domainId: 2, phaseId: 2, q: "Wo stehen NULL-Werte standardmäßig bei ORDER BY col ASC vs. ORDER BY col DESC?", a: "ASC: NULLS LAST (ganz unten).\nDESC: NULLS FIRST (ganz oben)." },
  { id: "FC17", domainId: 2, phaseId: 2, q: "Was unterscheidet FETCH FIRST 2 ROWS ONLY von FETCH FIRST 2 ROWS WITH TIES?", a: "ONLY schneidet hart nach 2 Zeilen ab. WITH TIES nimmt weitere Zeilen auf, die denselben ORDER-BY-Wert wie Platz 2 haben." },
  { id: "FC18", domainId: 2, phaseId: 2, q: "Was bewirkt SET VERIFY ON in SQL*Plus bei Substitution Variables?", a: "Es gibt vor der Ausführung die Zeilen 'old N:' (mit &var) und 'new N:' (mit eingesetztem Wert) aus." },
  { id: "FC19", domainId: 3, phaseId: 3, q: "Was liefert SUBSTR('ORACLE', -4, 2) zurück?", a: "'AC'\nStart -4 zählt 4 Zeichen vom rechten Ende zurück ('A') und liest dann 2 Zeichen von links nach rechts." },
  { id: "FC20", domainId: 3, phaseId: 3, q: "Wie verhält sich CONCAT bei 3 Argumenten: CONCAT('A', 'B', 'C')?", a: "ORA-00909: invalid number of arguments! CONCAT akzeptiert strikt 2 Argumente." },
  { id: "FC21", domainId: 3, phaseId: 3, q: "Was passiert bei TRIM('AB' FROM 'ABSMITHAB')?", a: "ORA-30001: trim set should have only one character. TRIM(... FROM ...) erlaubt nur 1 Trim-Zeichen." },
  { id: "FC22", domainId: 3, phaseId: 3, q: "Was liefert INSTR('CORPORATE FLOOR', 'OR', 3, 2)?", a: "14 (Suche beginnt ab Pos. 3, erstes 'OR' ab dort an Pos. 5, zweites 'OR' an Pos. 14). Nicht gefunden liefert 0." },
  { id: "FC23", domainId: 3, phaseId: 3, q: "Was liefern ROUND(156.78, -2) und TRUNC(156.78, -1)?", a: "ROUND(156.78, -2) = 200 (auf Hunderter).\nTRUNC(156.78, -1) = 150 (auf Zehner abschneiden)." },
  { id: "FC24", domainId: 3, phaseId: 3, q: "Was ist der Unterschied zwischen CEIL(-4.2) und FLOOR(-4.2)?", a: "CEIL(-4.2) = -4 (kleinste Ganzzahl >= -4.2).\nFLOOR(-4.2) = -5 (größte Ganzzahl <= -4.2)." },
  { id: "FC25", domainId: 3, phaseId: 3, q: "Was liefert ADD_MONTHS(DATE '2024-01-31', 1)?", a: "2024-02-29 (Schaltjahr-Monatsende wird sauber angepasst)." },
  { id: "FC26", domainId: 3, phaseId: 3, q: "Ab welchem Tag rundet ROUND(date, 'MONTH') auf und ab welchem Monat ROUND(date, 'YEAR')?", a: "'MONTH': ab Tag >= 16.\n'YEAR': ab Monat >= 7 (1. Juli)." },
  { id: "FC27", domainId: 3, phaseId: 3, q: "Welches Jahr erzeugt TO_DATE('15-JAN-85', 'DD-MON-RR') im Jahr 2026 vs. mit 'DD-MON-YY'?", a: "Mit RR: 1985 (aktuelles Jahr 00–49, Input 50–99 -> voriges Jahrhundert).\nMit YY: 2085 (immer aktuelles Jahrhundert)." },
  { id: "FC28", domainId: 3, phaseId: 3, q: "Was bewirkt der Format-Modifier 'fm' in TO_CHAR(hiredate, 'fmMonth DD, YYYY')?", a: "Fill Mode entfernt nachfolgende Leerzeichen bei Monats-/Tagesnamen und führende Nullen bei Zahlen." },
  { id: "FC29", domainId: 3, phaseId: 3, q: "Was gibt TO_CHAR(12500, '$9,999') zurück?", a: "'#######' (Überlaufzeichen, weil 12500 fünf Stellen braucht, die Mask aber nur vier 9er hat)." },
  { id: "FC30", domainId: 3, phaseId: 3, q: "Warum scheitert NVL(comm, 'None')?", a: "ORA-01722: invalid number. Argument 2 wird in den Typ von Argument 1 (NUMBER) konvertiert." },
  { id: "FC31", domainId: 3, phaseId: 3, q: "Wie bestimmt NVL2(a, b, c) seinen Rückgabe-Datentyp?", a: "Anhand von Argument b (2. Argument). Argument c muss implizit in den Typ von b konvertierbar sein. Argument a darf einen anderen Typ haben." },
  { id: "FC32", domainId: 3, phaseId: 3, q: "Was liefert NULLIF(100, 100) vs. NULLIF(100, 200)?", a: "NULLIF(100, 100) -> NULL.\nNULLIF(100, 200) -> 100. (Erstes Argument darf nicht Literal NULL sein.)" },
  { id: "FC33", domainId: 3, phaseId: 3, q: "Worin unterscheiden sich DECODE und searched CASE beim Thema NULL?", a: "DECODE behandelt zwei NULL-Werte als gleich (DECODE(comm, NULL, 0, comm) greift bei NULL!).\nSimple CASE comm WHEN NULL ergibt UNKNOWN und greift niemals." },
  { id: "FC34", domainId: 3, phaseId: 4, q: "Warum unterscheidet sich AVG(comm) (= 550) von AVG(NVL(comm, 0)) (= 157.14) in SCOTT.EMP?", a: "Aggregate Functions (außer COUNT(*)) ignorieren NULLs: AVG(comm) teilt durch 4, AVG(NVL(comm, 0)) teilt durch 14." },
  { id: "FC35", domainId: 3, phaseId: 4, q: "Welche ORA-Fehler entstehen bei: a) SELECT ename, MAX(sal) FROM emp; b) WHERE AVG(sal) > 2000;?", a: "a) ORA-00937: not a single-group group function.\nb) ORA-00934: group function is not allowed here (gehört in HAVING!)." },
  { id: "FC36", domainId: 3, phaseId: 4, q: "Was gilt für verschachtelte Group Functions wie SELECT MAX(AVG(sal)) FROM emp GROUP BY deptno?", a: "Max. Tiefe = 2, GROUP BY ist Pflicht, und es darf KEINE unaggregierte Spalte (auch nicht deptno!) in SELECT stehen." },
  { id: "FC37", domainId: 4, phaseId: 5, q: "Was passiert, wenn du eine Spalte aus JOIN ... USING (deptno) mit einem Qualifier versiehst?", a: "ORA-25154: column part of USING clause cannot have qualifier. Bei USING (deptno) darf niemals e.deptno oder d.deptno geschrieben werden." },
  { id: "FC38", domainId: 4, phaseId: 5, q: "Warum ist HR.EMPLOYEES NATURAL JOIN HR.DEPARTMENTS eine klassische Exam Trap?", a: "Beide Tabellen teilen ZWEI namensgleiche Spalten: DEPARTMENT_ID und MANAGER_ID. NATURAL JOIN joint automatisch auf BEIDE Spalten!" },
  { id: "FC39", domainId: 4, phaseId: 5, q: "Wie funktioniert ein Non-Equijoin auf SCOTT.EMP und SCOTT.SALGRADE?", a: "Verknüpft Zeilen über Bereichsoperatoren statt =, z. B.:\nJOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal" },
  { id: "FC40", domainId: 4, phaseId: 5, q: "Was passiert bei LEFT OUTER JOIN, wenn ein Filter auf die rechte Tabelle in WHERE statt in ON steht?", a: "NULL-Zeilen werden von WHERE herausgefiltert — der Outer Join wird faktisch zu einem INNER JOIN!" },
  { id: "FC41", domainId: 4, phaseId: 5, q: "Wofür steht WHERE e.deptno(+) = d.deptno in Legacy Oracle Syntax?", a: "RIGHT OUTER JOIN (alle Zeilen aus d bleiben erhalten; fehlende e-Zeilen werden mit NULL ergänzt)." },
  { id: "FC42", domainId: 4, phaseId: 5, q: "Wie viele Zeilen liefert SCOTT.EMP CROSS JOIN SCOTT.DEPT?", a: "14 x 4 = 56 Zeilen (Cartesian Product)." },
  { id: "FC43", domainId: 5, phaseId: 6, q: "Warum liefert WHERE empno NOT IN (SELECT mgr FROM scott.emp) 0 Zeilen?", a: "Weil KING mgr = NULL hat. x NOT IN (7839, NULL) wird zu x <> 7839 AND x <> NULL -> UNKNOWN für alle Zeilen." },
  { id: "FC44", domainId: 5, phaseId: 6, q: "Was ist der Unterschied zwischen > ANY und > ALL?", a: "> ANY bedeutet größer als das MINIMUM der Subquery.\n> ALL bedeutet größer als das MAXIMUM der Subquery." },
  { id: "FC45", domainId: 5, phaseId: 6, q: "Wann wird eine Correlated Subquery ausgeführt?", a: "Einmal für jede Kandidatenzeile der äußeren Query, weil die innere Query eine Spalte des äußeren Tabellen-Alias referenziert." },
  { id: "FC46", domainId: 5, phaseId: 6, q: "Was passiert, wenn eine Single-Row Subquery 0 Zeilen liefert vs. 2 Zeilen?", a: "0 Zeilen: wertet zu NULL aus -> kein Fehler, äußeres WHERE liefert 0 Zeilen.\n2 Zeilen: wirft ORA-01427." },
  { id: "FC47", domainId: 5, phaseId: 6, q: "In welchen Klauseln darf eine Subquery stehen?", a: "SELECT (Scalar), FROM (Inline View), WHERE, HAVING (und DML-WHERE/SET). Nicht in GROUP BY." },
  { id: "FC48", domainId: 6, phaseId: 6, q: "Was sind die 3 Regeln für SET Operators (UNION, INTERSECT, MINUS)?", a: "1) Gleiche Spaltenanzahl.\n2) Kompatible Datentyp-Gruppen.\n3) Spaltennamen vom 1. SELECT; ORDER BY nur ganz am Ende." },
  { id: "FC49", domainId: 6, phaseId: 6, q: "Welcher SET Operator entfernt KEINE Duplikate und sortiert die Ausgabe nicht?", a: "UNION ALL (schnellster SET Operator, da Sortierung/Deduplizierung entfällt)." },
  { id: "FC50", domainId: 6, phaseId: 6, q: "Wie lautet in Oracle Database 26ai/23ai das ANSI-Synonym für MINUS?", a: "EXCEPT (gibt Zeilen der ersten Query zurück, die nicht in der zweiten Query vorkommen)." },
  { id: "FC51", domainId: 6, phaseId: 6, q: "Wie ergänzt du eine fehlende Zahlenspalte im zweiten SELECT bei UNION ALL?", a: "Mit TO_NUMBER(NULL) (analog TO_CHAR(NULL) oder TO_DATE(NULL) für Text/Datum)." },
  { id: "FC52", domainId: 7, phaseId: 7, q: "Was unterscheidet bedingtes INSERT ALL von INSERT FIRST?", a: "INSERT ALL prüft jede WHEN-Klausel und kann eine Zeile in mehrere Tabellen schreiben.\nINSERT FIRST stoppt bei der ersten zutreffenden WHEN-Klausel." },
  { id: "FC53", domainId: 7, phaseId: 7, q: "Welche Zeilen kann eine DELETE WHERE-Klausel innerhalb eines MERGE Statements entfernen?", a: "Nur Zeilen, die von diesem MERGE Statement GEMATCHT und AKTUALISIERT wurden (ausgewertet anhand der neuen Werte nach dem Update)." },
  { id: "FC54", domainId: 7, phaseId: 7, q: "Was passiert mit SAVEPOINT sp1, wenn du ein CREATE TABLE Statement ausführst?", a: "DDL löst ein implizites COMMIT aus und macht alle vorherigen Savepoints ungültig (ORA-01086 bei ROLLBACK TO sp1)." },
  { id: "FC55", domainId: 7, phaseId: 7, q: "Was bedeutet Read Consistency in Oracle?", a: "Readers blockieren Writers nie und Writers blockieren Readers nie: andere Sessions sehen immer den letzten committeten Snapshot (via Undo)." },
  { id: "FC56", domainId: 7, phaseId: 7, q: "Was passiert bei einem sauberen EXIT in SQL*Plus vs. einem plötzlichen Netzwerkabbruch?", a: "Sauberes EXIT: implizites COMMIT.\nNetzwerk-/Session-Abbruch: automatisches ROLLBACK." },
  { id: "FC57", domainId: 8, phaseId: 8, q: "Welche Constraints kopiert CREATE TABLE t2 AS SELECT * FROM t1?", a: "NUR explizite NOT NULL Constraints! PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK und DEFAULT-Werte werden NICHT kopiert." },
  { id: "FC58", domainId: 8, phaseId: 8, q: "Welche Ausdrücke sind innerhalb eines CHECK Constraints verboten?", a: "SYSDATE, CURRENT_DATE, USER, UID, ROWNUM, Sequence CURRVAL/NEXTVAL sowie Subqueries (ORA-02436)." },
  { id: "FC59", domainId: 8, phaseId: 8, q: "Was bewirkt WITH CHECK OPTION bei einer View?", a: "Verhindert INSERT oder UPDATE über die View, falls die resultierende Zeile nicht mehr die WHERE-Klausel der View erfüllen würde (ORA-01402)." },
  { id: "FC60", domainId: 8, phaseId: 8, q: "Wie speichert eine Spalte vom Typ NUMBER(5, -2) den Wert 1256?", a: "1300! Negative Scale -2 rundet auf den nächsten Hunderter." },
  { id: "FC61", domainId: 8, phaseId: 8, q: "Welcher Constraint kann NUR inline (auf Spaltenebene) oder per ALTER TABLE ... MODIFY definiert werden?", a: "NOT NULL (Multi-Column Constraints wie PRIMARY KEY (a,b) müssen dagegen out-of-line stehen)." },
  { id: "FC62", domainId: 8, phaseId: 8, q: "Darf eine UNIQUE-Spalte mehrere NULL-Werte enthalten?", a: "Ja! In Oracle ist NULL != NULL, daher erlaubt UNIQUE beliebig viele NULL-Zeilen." },
  { id: "FC63", domainId: 8, phaseId: 8, q: "Was unterscheidet ON DELETE CASCADE von ON DELETE SET NULL bei einem Foreign Key?", a: "CASCADE löscht abhängige Child Rows mit; SET NULL behält Child Rows und setzt deren FK-Spalte auf NULL." },
  { id: "FC64", domainId: 8, phaseId: 8, q: "Was ist das Standard-Verhalten einer Global Temporary Table (GTT)?", a: "ON COMMIT DELETE ROWS (Daten sind privat pro Session und werden beim COMMIT geleert)." },
  { id: "FC65", domainId: 8, phaseId: 8, q: "Unterstützt eine External Table (ORACLE_LOADER) DML oder Indexes?", a: "Nein! External Tables sind Read-only für SELECT auf OS-Dateien in einem DIRECTORY-Objekt." },
  { id: "FC66", domainId: 8, phaseId: 8, q: "Was unterscheidet ALTER TABLE t SET UNUSED (col) von DROP COLUMN?", a: "SET UNUSED verbirgt die Spalte sofort logisch ohne teuren Block-Scan; DROP UNUSED COLUMNS gibt den Platz später offline frei." },
  { id: "FC67", domainId: 9, phaseId: 8, q: "Welcher Fehler tritt auf, wenn du my_seq.CURRVAL vor dem ersten my_seq.NEXTVAL in einer Session abfragst?", a: "ORA-08002: sequence MY_SEQ.CURRVAL is not yet defined in this session." },
  { id: "FC68", domainId: 9, phaseId: 8, q: "Wann legt Oracle automatisch einen Index an?", a: "Immer wenn du einen PRIMARY KEY oder UNIQUE Constraint aktivierst (für FOREIGN KEY wird KEIN automatischer Index erstellt)." },
  { id: "FC69", domainId: 9, phaseId: 8, q: "Was ist ein INVISIBLE Index?", a: "Ein Index, der von DML-Operationen gepflegt wird, den der Optimizer aber ignoriert, solange nicht OPTIMIZER_USE_INVISIBLE_INDEXES = TRUE gesetzt ist." },
  { id: "FC70", domainId: 9, phaseId: 8, q: "Was passiert bei INSERT INTO t (id, name) VALUES (1, 'A') bei GENERATED ALWAYS AS IDENTITY?", a: "ORA-32795: cannot insert into a generated always identity column. (GENERATED BY DEFAULT erlaubt Überschreibungen.)" },
  { id: "FC71", domainId: 9, phaseId: 8, q: "Gewährt ein PUBLIC SYNONYM automatisch SELECT-Rechte auf die Zieltabelle?", a: "Nein! Synonyme sind nur Aliasnamen – Object Privileges müssen weiterhin explizit über GRANT erteilt werden." },
  { id: "FC72", domainId: 10, phaseId: 9, q: "Vergleiche die Data-Dictionary-Views USER_*, ALL_* und DBA_*.", a: "USER_*: Objekte im eigenen Besitz (ohne OWNER).\nALL_*: Eigene Objekte + freigegebene Objekte.\nDBA_*: Alle Objekte der gesamten DB." },
  { id: "FC73", domainId: 10, phaseId: 9, q: "Vergleiche TIMESTAMP WITH TIME ZONE vs. TIMESTAMP WITH LOCAL TIME ZONE.", a: "WITH TIME ZONE speichert explizit Zone/Offset.\nWITH LOCAL TIME ZONE normalisiert auf DBTIMEZONE auf Disk und zeigt Werte in der SESSIONTIMEZONE des Users an." },
  { id: "FC74", domainId: 10, phaseId: 9, q: "Welche Datetime Functions liefern DATE vs. TIMESTAMP WITH TIME ZONE?", a: "SYSDATE und CURRENT_DATE liefern DATE.\nSYSTIMESTAMP und CURRENT_TIMESTAMP liefern TIMESTAMP WITH TIME ZONE.\nLOCALTIMESTAMP liefert TIMESTAMP (ohne TZ)." },
  { id: "FC75", domainId: 10, phaseId: 9, q: "Was zeigt constraint_type = 'C' in USER_CONSTRAINTS an?", a: "Sowohl CHECK Constraints als auch NOT NULL Constraints (Regel steht in SEARCH_CONDITION)." },
  { id: "FC76", domainId: 10, phaseId: 9, q: "Wie schreibst du Interval-Literale für 1 Jahr 6 Monate bzw. 3 Tage 4 Stunden?", a: "INTERVAL '1-6' YEAR TO MONTH\nINTERVAL '3 04:00:00' DAY TO SECOND" },
  { id: "FC77", domainId: 11, phaseId: 9, q: "Kaskadiert der Entzug (REVOKE) eines SYSTEM Privilege mit WITH ADMIN OPTION?", a: "NEIN! System Privileges (z. B. CREATE TABLE) kaskadieren beim REVOKE NICHT." },
  { id: "FC78", domainId: 11, phaseId: 9, q: "Kaskadiert der Entzug (REVOKE) eines OBJECT Privilege mit WITH GRANT OPTION?", a: "JA! Object Privileges (z. B. SELECT ON emp) kaskadieren beim REVOKE automatisch an nachgelagerte Empfänger." },
  { id: "FC79", domainId: 11, phaseId: 9, q: "Für welche Object Privileges sind spaltenbezogene Grants wie (sal, comm) zulässig?", a: "Nur für INSERT, UPDATE und REFERENCES — NICHT für SELECT oder DELETE." },
  { id: "FC80", domainId: 11, phaseId: 9, q: "Was benötigt ein User mindestens, um eine Tabelle per PUBLIC Grant abzufragen?", a: "Das Login-System-Privileg CREATE SESSION (plus das jeweilige Objekt-Recht, das über PUBLIC vorliegt)." }
];

// 60 Domain-gewichtete 1Z0-171 Mock Exam Fragen (getrennt von den Checkpoint-Fragen!)
window.MOCK_EXAM_QUESTIONS = [
  // Domain 1 (3 Fragen - 5%)
  { id: "M01", domainId: 1, prompt: "Zu welcher SQL-Statement-Kategorie gehört der Befehl MERGE?", options: ["DDL", "DML", "DCL", "TCL"], answer: [1], explanation: "MERGE führt bedingtes INSERT/UPDATE/DELETE in einem einzigen atomaren Data Manipulation Language (DML) Statement aus." },
  { id: "M02", domainId: 1, prompt: "Welche zwei Aussagen über Primary Keys in Relational Databases sind wahr?", multi: true, options: ["Eine Tabelle kann mehrere Primary Keys besitzen", "Ein Primary-Key-Wert darf nicht NULL sein", "Ein zusammengesetzter Primary Key erstreckt sich über mehrere Spalten", "Ein Primary Key muss immer ID heißen"], answer: [1, 2], explanation: "Eine Tabelle besitzt höchstens einen Primary Key (der auch composite sein kann) und schließt NULL-Werte aus." },
  { id: "M03", domainId: 1, prompt: "Was bedeutet in einem ERD eine durchgezogene Linie mit Crow's Foot (Krähenfuß), die von ORDERS auf CUSTOMERS zeigt?", options: ["Ein Customer kann viele Orders aufgeben", "Eine Order gehört zu vielen Customers", "Customers und Orders stehen in einer 1:1-Beziehung", "Orders können keinen Foreign Key besitzen"], answer: [0], explanation: "Der Crow's Foot ('many') sitzt auf der Child-Seite ORDERS; ein Customer hat also null, eine oder viele Orders." },

  // Domain 2 (9 Fragen - 15%)
  { id: "M04", domainId: 2, prompt: "Was passiert beim Ausführen von: SELECT ename AS Employee Name FROM scott.emp;?", options: ["Zeigt Spaltenkopf EMPLOYEE NAME", "Zeigt Spaltenkopf Employee Name", "Wirft ORA-00923, weil Aliases mit Leerzeichen in Double Quotes stehen müssen", "Verkettet Employee und Name"], answer: [2], explanation: "Aliases mit Leerzeichen müssen in \"Double Quotes\" eingeschlossen werden." },
  { id: "M05", domainId: 2, prompt: "Welche Query nutzt den Alternative Quote Operator (q) korrekt für die Ausgabe: King's Salary?", options: [
    "SELECT q'[King's Salary]' FROM dual;",
    "SELECT q'King's Salary' FROM dual;",
    "SELECT q'[King's Salary'] FROM dual;",
    "SELECT 'King''s Salary FROM dual;"
  ], answer: [0], explanation: "Die Syntax lautet q'<delimiter>...<closing_delimiter>'. Eckige Klammern [] schließen das Literal sauber innerhalb einfacher Anführungszeichen ein: q'[King's Salary]'." },
  { id: "M06", domainId: 2, prompt: "Gegeben SCOTT.EMP (14 Zeilen, 3 Departments in EMP: 10, 20, 30; 5 verschiedene Jobs): Wie viele Zeilen gibt SELECT DISTINCT deptno, job FROM scott.emp; zurück? (Dept 10: 3 Jobs, Dept 20: 3 Jobs, Dept 30: 3 Jobs)", options: ["3 Zeilen", "5 Zeilen", "9 Zeilen", "14 Zeilen"], answer: [2], explanation: "DISTINCT gilt für das Paar (deptno, job). Dept 10 hat CLERK/MANAGER/PRESIDENT (3), Dept 20 hat CLERK/MANAGER/ANALYST (3), Dept 30 hat CLERK/MANAGER/SALESMAN (3) -> 9 eindeutige Paare." },
  { id: "M07", domainId: 2, prompt: "Welche WHERE-Klausel findet Employees, deren Job wörtlich mit 'SA_' (inklusive Unterstrich) beginnt?", options: [
    "WHERE job_id LIKE 'SA_%'",
    "WHERE job_id LIKE 'SA\\_%' ESCAPE '\\'",
    "WHERE job_id LIKE 'SA[_]%'",
    "WHERE job_id = 'SA_%'"
  ], answer: [1], explanation: "Der Unterstrich ist in LIKE eine Einzelzeichen-Wildcard und muss mit ESCAPE '\\' maskiert werden." },
  { id: "M08", domainId: 2, prompt: "Welche Employees aus SCOTT.EMP liefert: WHERE job = 'CLERK' OR job = 'MANAGER' AND sal > 2900?", options: [
    "Alle CLERKs und nur MANAGER mit sal > 2900 (JONES)",
    "Nur CLERKs und MANAGER mit sal > 2900",
    "Nur JONES (MANAGER mit 2975)",
    "Alle MANAGER und nur CLERKs mit sal > 2900"
  ], answer: [0], explanation: "AND bindet stärker als OR, daher wird ausgewertet als job = 'CLERK' OR (job = 'MANAGER' AND sal > 2900)." },
  { id: "M09", domainId: 2, prompt: "Wo erscheinen NULL-Werte in Oracle SQL standardmäßig bei ORDER BY comm ASC?", options: ["Zuerst (First)", "Zuletzt (Last)", "Aus dem Ergebnis ausgelassen", "Zufällige Reihenfolge"], answer: [1], explanation: "Oracle behandelt NULL bei der Sortierung als größten Wert: LAST bei ASC, FIRST bei DESC (sofern nicht NULLS FIRST/LAST angegeben ist)." },
  { id: "M10", domainId: 2, prompt: "Welche Row-Limiting-Query überspringt die 2 bestbezahlten Employees und liefert die nächsten 3?", options: [
    "SELECT ename, sal FROM scott.emp ORDER BY sal DESC LIMIT 3 OFFSET 2;",
    "SELECT ename, sal FROM scott.emp ORDER BY sal DESC OFFSET 2 ROWS FETCH NEXT 3 ROWS ONLY;",
    "SELECT ename, sal FROM scott.emp FETCH NEXT 3 ROWS OFFSET 2 ORDER BY sal DESC;",
    "SELECT ename, sal FROM scott.emp WHERE ROWNUM BETWEEN 3 AND 5 ORDER BY sal DESC;"
  ], answer: [1], explanation: "Oracles ANSI-Row-Limiting-Klausel steht nach ORDER BY: OFFSET n ROWS FETCH NEXT m ROWS ONLY." },
  { id: "M11", domainId: 2, prompt: "Wenn in SQL*Plus SET VERIFY ON aktiv ist und du SELECT ename FROM scott.emp WHERE deptno = &d; mit Eingabe 10 ausführst, welche zusätzliche Ausgabe erscheint?", options: [
    "Nichts Zusätzliches",
    "old 1: ... &d und new 1: ... 10",
    "DEFINE d = 10",
    "1 row created"
  ], answer: [1], explanation: "SET VERIFY ON gibt die alte (unsubstituierte) und neue (substituierte) SQL-Zeile aus." },
  { id: "M12", domainId: 2, prompt: "Welche zwei Aussagen über && Substitution Variables in SQL*Plus sind wahr?", multi: true, options: [
    "Sie fragen den User bei jeder einzelnen Ausführung erneut ab",
    "Sie bleiben in der Session bis UNDEFINE oder Exit bestehen",
    "Sie benötigen einfache Anführungszeichen, wenn sie in ein String-Literal ('&&job') eingesetzt werden",
    "Sie committen offene Transaktionen automatisch"
  ], answer: [1, 2], explanation: "&& definiert die Variable nach einmaliger Abfrage für die gesamte Session, und Zeichenketten-Ersetzungen benötigen weiterhin Single Quotes in SQL." },

  // Domain 3 (15 Fragen - 25%)
  { id: "M13", domainId: 3, prompt: "Was liefert SELECT INSTR('CORPORATE FLOOR', 'OR', 3, 2) FROM dual; zurück?", options: ["2", "5", "14", "0"], answer: [2], explanation: "Ab Position 3 ('RPORATE FLOOR') steht das 1. 'OR' an Pos. 5 und das 2. 'OR' an Pos. 14." },
  { id: "M14", domainId: 3, prompt: "Was liefert SELECT ROUND(156.78, -2) FROM dual; zurück?", options: ["156", "160", "200", "100"], answer: [2], explanation: "-2 rundet auf den nächsten Hunderter: 156.78 rundet auf 200 auf." },
  { id: "M15", domainId: 3, prompt: "Was liefert SELECT TRUNC(156.78, -1) FROM dual; zurück?", options: ["150", "160", "156", "100"], answer: [0], explanation: "-1 schneidet Richtung null auf die Zehnerstelle ab: 150." },
  { id: "M16", domainId: 3, prompt: "Was ist das Ergebnis von SELECT MOD(17, 5), CEIL(-4.2), FLOOR(-4.2) FROM dual;?", options: ["2 | -4 | -5", "2 | -5 | -4", "3 | -4 | -5", "2 | 4 | 5"], answer: [0], explanation: "MOD(17,5)=2; CEIL(-4.2)=-4 (kleinste Ganzzahl >= -4.2); FLOOR(-4.2)=-5." },
  { id: "M17", domainId: 3, prompt: "Was liefert SELECT ROUND(DATE '2026-06-15', 'YEAR') FROM dual; zurück?", options: ["2026-01-01", "2027-01-01", "2026-07-01", "2026-06-01"], answer: [0], explanation: "ROUND(date, 'YEAR') rundet erst ab dem 1. Juli (Monat 7) auf; der 15. Juni rundet auf 2026-01-01 ab." },
  { id: "M18", domainId: 3, prompt: "Was liefert SELECT MONTHS_BETWEEN(DATE '2026-01-01', DATE '2026-04-01') FROM dual; zurück?", options: ["3", "-3", "90", "-90"], answer: [1], explanation: "MONTHS_BETWEEN(d1, d2) ist negativ, wenn d1 vor d2 liegt: -3." },
  { id: "M19", domainId: 3, prompt: "Mit dem Datumsformat RR: Welches Jahr wird gespeichert, wenn das aktuelle Jahr 2026 ist und du TO_DATE('15-JAN-85', 'DD-MON-RR') ausführst?", options: ["2085", "1985", "1900", "2026"], answer: [1], explanation: "Liegt das aktuelle Jahr zwischen 00–49 und das angegebene 2-stellige Jahr zwischen 50–99, weist RR das vorherige Jahrhundert (1985) zu." },
  { id: "M20", domainId: 3, prompt: "Warum steht der Modifier fm in TO_CHAR(hiredate, 'fmMonth DD, YYYY')?", options: [
    "Erzwingt Monatsnamen in Großbuchstaben",
    "Unterdrückt Leerzeichen-Padding bei Monatsnamen und führende Nullen bei Tagen",
    "Erzwingt exaktes Format-Matching bei Eingabe-Strings",
    "Rechnet lokale Zeit in UTC um"
  ], answer: [1], explanation: "fm (Fill Mode) entfernt nachfolgende Leerzeichen bei Month/Day-Namen sowie führende Nullen bei Zahlen." },
  { id: "M21", domainId: 3, prompt: "Was liefert SELECT NULLIF(100, 100), NULLIF(100, 200) FROM dual; zurück?", options: ["100 | NULL", "NULL | 100", "0 | 100", "NULL | 200"], answer: [1], explanation: "NULLIF(a, b) liefert NULL wenn a = b, andernfalls liefert es a." },
  { id: "M22", domainId: 3, prompt: "Welche Aussage über COALESCE(a, b, c) ist wahr?", options: [
    "Wertet immer alle drei Ausdrücke aus, auch wenn a nicht NULL ist",
    "Erlaubt a als NUMBER und b als VARCHAR2 ohne Konvertierung",
    "Nutzt Short-Circuit Evaluation und stoppt beim ersten Nicht-NULL-Ausdruck",
    "Akzeptiert nur zwei Argumente"
  ], answer: [2], explanation: "COALESCE arbeitet mit Short-Circuit Evaluation und verlangt kompatible Datentypen bei allen Ausdrücken." },
  { id: "M23", domainId: 3, prompt: "Werte aus: SELECT DECODE(NULL, NULL, 'MATCH', 'NO MATCH') FROM dual;", options: ["'NO MATCH'", "NULL", "'MATCH'", "ORA-00932 Fehler"], answer: [2], explanation: "DECODE behandelt NULL als gleich NULL und liefert daher 'MATCH'." },
  { id: "M24", domainId: 3, prompt: "In SCOTT.EMP haben 4 Employees eine COMM (300, 500, 1400, 0) und 10 haben NULL. Was liefert SELECT COUNT(comm), SUM(comm) / COUNT(*) FROM scott.emp;?", options: ["4 | 550", "14 | 157.14...", "4 | 157.14...", "14 | 550"], answer: [2], explanation: "COUNT(comm) zählt nur Nicht-NULL-Werte (4); SUM(comm) ist 2200; COUNT(*) ist 14; 2200/14 = 157.14." },
  { id: "M25", domainId: 3, prompt: "Welche Query wirft einen ORA-00934 / ORA-00979 Fehler?", options: [
    "SELECT deptno, COUNT(*) FROM scott.emp GROUP BY deptno HAVING COUNT(*) > 3;",
    "SELECT deptno, AVG(sal) FROM scott.emp WHERE sal > 1000 GROUP BY deptno;",
    "SELECT deptno, AVG(sal) FROM scott.emp WHERE AVG(sal) > 2000 GROUP BY deptno;",
    "SELECT MAX(AVG(sal)) FROM scott.emp GROUP BY deptno;"
  ], answer: [2], explanation: "Group Functions (AVG(sal)) dürfen nicht in der WHERE-Klausel stehen (ORA-00934); dafür dient HAVING." },
  { id: "M26", domainId: 3, prompt: "Was liefert SELECT LPAD(800, 6, '0') FROM dual; zurück?", options: ["'800000'", "'000800'", "'00800'", "ORA-01722"], answer: [1], explanation: "LPAD füllt links bis zur Gesamtlänge 6 auf -> '000800'." },
  { id: "M27", domainId: 3, prompt: "Welche Aussage zu GROUP BY ist richtig?", options: [
    "Jede Spalte in GROUP BY muss in SELECT erscheinen",
    "Jede nicht aggregierte Spalte in SELECT muss in GROUP BY erscheinen",
    "GROUP BY akzeptiert in SELECT definierte Column Aliases",
    "HAVING muss immer vor GROUP BY stehen"
  ], answer: [1], explanation: "Alle unaggregierten Spalten in SELECT müssen in GROUP BY stehen (umgekehrt müssen GROUP BY-Spalten nicht im SELECT stehen)." },

  // Domain 4 (6 Fragen - 10%)
  { id: "M28", domainId: 4, prompt: "Wenn Tabelle A 5 Zeilen und Tabelle B 4 Zeilen hat: Wie viele Zeilen liefert SELECT * FROM A CROSS JOIN B;?", options: ["9", "20", "5", "4"], answer: [1], explanation: "CROSS JOIN bildet das Cartesian Product: 5 x 4 = 20 Zeilen." },
  { id: "M29", domainId: 4, prompt: "Zwischen HR.EMPLOYEES und HR.DEPARTMENTS existieren in beiden Tabellen die Spalten DEPARTMENT_ID und MANAGER_ID. Was passiert bei HR.EMPLOYEES NATURAL JOIN HR.DEPARTMENTS?", options: [
    "Joint nur über DEPARTMENT_ID",
    "Schlägt fehl mit ORA-00918",
    "Joint gleichzeitig über DEPARTMENT_ID UND MANAGER_ID",
    "Führt einen CROSS JOIN aus"
  ], answer: [2], explanation: "NATURAL JOIN verknüpft automatisch über alle Spalten mit identischem Namen in beiden Tabellen." },
  { id: "M30", domainId: 4, prompt: "Warum wird bei einem Self-Join auf SCOTT.EMP (e LEFT JOIN m ON e.mgr = m.empno) LEFT JOIN statt INNER JOIN verwendet?", options: [
    "Um DEPT 40 einzuschließen",
    "Um KING einzuschließen, dessen Spalte mgr NULL ist",
    "Um doppelte Manager zu entfernen",
    "Weil Oracle INNER JOIN auf derselben Tabelle verbietet"
  ], answer: [1], explanation: "KING hat keinen Manager (mgr IS NULL); ein INNER JOIN würde KING aus der Ergebnisliste entfernen." },
  { id: "M31", domainId: 4, prompt: "Welche Join Condition ordnet die Gehälter in SCOTT.EMP den Gehaltsbändern in SCOTT.SALGRADE (losal..hisal) zu?", options: [
    "NATURAL JOIN scott.salgrade",
    "JOIN scott.salgrade s USING (sal)",
    "JOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal",
    "CROSS JOIN scott.salgrade WHERE e.sal = s.grade"
  ], answer: [2], explanation: "Non-Equijoins vergleichen Bereiche mit BETWEEN oder </>, was eine ON-Klausel erfordert." },
  { id: "M32", domainId: 4, prompt: "Was passiert, wenn du die rechte Tabelle eines LEFT OUTER JOIN in der WHERE-Klausel filterst (z. B. WHERE d.loc = 'DALLAS')?", options: [
    "Ungematchte linke Zeilen bleiben trotzdem mit NULLs erhalten",
    "Ungematchte linke Zeilen entfallen, weil ihr d.loc NULL ist – faktisch wird daraus ein INNER JOIN",
    "Wirft ORA-25154",
    "Wandelt den Join in einen FULL OUTER JOIN um"
  ], answer: [1], explanation: "WHERE läuft nach dem Outer Join; NULL = 'DALLAS' ist UNKNOWN, wodurch ungematchte Zeilen verworfen werden. Optionale Filter gehören in ON." },
  { id: "M33", domainId: 4, prompt: "Welche Query verwendet die Legacy-Oracle-Outer-Join-Syntax, um alle Zeilen aus DEPT zu erhalten, selbst wenn kein EMP passt?", options: [
    "WHERE e.deptno(+) = d.deptno",
    "WHERE e.deptno = d.deptno(+)",
    "WHERE e.deptno(+) = d.deptno(+)",
    "WHERE e.deptno (+) IN (SELECT deptno FROM dept)"
  ], answer: [0], explanation: "Das (+) steht auf der optionalen/fehlenden Seite (EMP), sodass fehlende EMP-Zeilen mit NULLs ergänzt werden und alle DEPT-Zeilen erhalten bleiben." },

  // Domain 5 (3 Fragen - 5%)
  { id: "M34", domainId: 5, prompt: "Welche zwei Klauseln dürfen gültig eine Subquery enthalten?", multi: true, options: ["FROM-Klausel (Inline View)", "GROUP BY-Klausel", "HAVING-Klausel", "Nur Alias-Liste von ORDER BY"], answer: [0, 2], explanation: "Subqueries sind zulässig in SELECT, FROM, WHERE und HAVING (nicht in GROUP BY)." },
  { id: "M35", domainId: 5, prompt: "Was passiert bei: WHERE deptno = (SELECT deptno FROM scott.dept WHERE loc IN ('DALLAS', 'CHICAGO'));?", options: [
    "Matcht sowohl Dept 20 als auch Dept 30",
    "Wirft ORA-01427: single-row subquery returns more than one row",
    "Matcht nur die erste zurückgegebene Zeile",
    "Liefert stillschweigend 0 Zeilen"
  ], answer: [1], explanation: "Ein Single-Row Operator (=) mit einer Subquery, die 2 Zeilen liefert, löst ORA-01427 aus." },
  { id: "M36", domainId: 5, prompt: "Warum wird NOT EXISTS oft gegenüber NOT IN bevorzugt, um Parent-Zeilen ohne Child-Zeilen (z. B. DEPT 40) zu finden?", options: [
    "NOT EXISTS ist die einzige in Oracle 26ai/23ai erlaubte Syntax",
    "NOT EXISTS geht sicher mit NULL-Werten in der Subquery-Tabelle um, ohne 0 Zeilen zurückzugeben",
    "NOT IN funktioniert nicht mit Zahlen",
    "NOT EXISTS sortiert die Ausgabe automatisch"
  ], answer: [1], explanation: "NOT EXISTS prüft Zeilenexistenz (TRUE/FALSE) und tappt nie in die 3-Valued-UNKNOWN-Falle durch NULLs bei NOT IN." },

  // Domain 6 (3 Fragen - 5%)
  { id: "M37", domainId: 6, prompt: "Tabelle T1 hat die Werte {1, 2, 2, 3} und T2 hat {2, 3, 4}. Wie viele Zeilen liefert SELECT x FROM T1 UNION SELECT x FROM T2;?", options: ["7 Zeilen", "5 Zeilen", "4 Zeilen", "2 Zeilen"], answer: [2], explanation: "UNION entfernt Duplikate innerhalb und zwischen beiden Mengen: {1, 2, 3, 4} = 4 Zeilen." },
  { id: "M38", domainId: 6, prompt: "Was liefert bei demselben T1 {1,2,2,3} und T2 {2,3,4} die Abfrage SELECT x FROM T1 INTERSECT SELECT x FROM T2;?", options: ["{2, 3}", "{2, 2, 3}", "{1, 4}", "{1, 2, 3, 4}"], answer: [0], explanation: "INTERSECT liefert die eindeutigen Werte, die in beiden Ergebnismengen vorkommen: {2, 3}." },
  { id: "M39", domainId: 6, prompt: "Wie ergänzt du eine fehlende numerische Spalte im zweiten SELECT, wenn du zwei Queries mit UNION ALL kombinierst?", options: [
    "Spalte im zweiten SELECT weglassen",
    "TO_NUMBER(NULL) an der passenden Spaltenposition einfügen",
    "'NULL' als String-Literal einfügen",
    "UNION MATCH verwenden"
  ], answer: [1], explanation: "Platzhalter-NULLs sollten dem erwarteten Datentyp entsprechen – mittels TO_NUMBER(NULL), TO_CHAR(NULL) oder TO_DATE(NULL)." },

  // Domain 7 (3 Fragen - 5%)
  { id: "M40", domainId: 7, prompt: "Welche Aussage über Oracle Read Consistency ist wahr?", options: [
    "Readers blockieren Writers beim Aktualisieren von Zeilen",
    "Writers blockieren Readers beim Abfragen unbestätigter Tabellen",
    "Writers blockieren Readers niemals; Readers sehen den committeten Snapshot vor der Änderung",
    "Uncommittete Inserts sind sofort für alle anderen Sessions sichtbar"
  ], answer: [2], explanation: "Oracle nutzt Undo-Daten, sodass Readers nie auf Writers warten und stets einen konsistenten committeten Snapshot sehen." },
  { id: "M41", domainId: 7, prompt: "Was passiert, wenn deine SQL*Plus-Session nach zwei INSERT Statements ohne COMMIT unerwartet abstürzt (Netzwerkabbruch)?", options: [
    "Oracle committet die beiden Zeilen automatisch",
    "Oracle führt automatisch ein ROLLBACK der unbestätigten Transaktion aus",
    "Die Tabelle bleibt dauerhaft gesperrt",
    "Nur das erste INSERT wird committet"
  ], answer: [1], explanation: "Ein unerwarteter Session-Abbruch löst ein automatisches ROLLBACK aus (während ein sauberes EXIT implizit committet)." },
  { id: "M42", domainId: 7, prompt: "Welche Zeilen werden gelöscht bei MERGE INTO tgt USING src ON (...) WHEN MATCHED THEN UPDATE SET tgt.sal = src.sal DELETE WHERE tgt.sal < 1000;?", options: [
    "Alle Zeilen in tgt mit sal < 1000",
    "Nur Zeilen, die von diesem MERGE gematcht & aktualisiert wurden und deren NEUES sal < 1000 ist",
    "Zeilen in src mit sal < 1000",
    "Keine; DELETE ist innerhalb von MERGE ungültig"
  ], answer: [1], explanation: "Die DELETE WHERE-Klausel in MERGE gilt nur für in diesem MERGE gematchte und aktualisierte Zeilen – ausgewertet anhand der Werte nach dem Update." },

  // Domain 8 (9 Fragen - 15%)
  { id: "M43", domainId: 8, prompt: "Welcher Wert wird in einer Spalte vom Typ NUMBER(5, -2) gespeichert, wenn du 1256 einfügst?", options: ["1256", "1250", "1300", "ORA-01438 overflow"], answer: [2], explanation: "Eine negative Scale -2 rundet auf den nächsten Hunderter: 1256 -> 1300." },
  { id: "M44", domainId: 8, prompt: "Welche Aussage über TRUNCATE TABLE my_emp; ist WAHR?", options: [
    "Es kann zurückgerollt werden, solange noch kein COMMIT lief",
    "Es feuert ON DELETE Row Triggers",
    "Es ist DDL, committet automatisch und setzt die High-Water Mark der Tabelle zurück",
    "Es löscht sowohl die Tabellenstruktur als auch alle Zeilen"
  ], answer: [2], explanation: "TRUNCATE ist DDL: auto-committet, kein Rollback möglich, behält die Tabellenstruktur bei und setzt die HWM zurück." },
  { id: "M45", domainId: 8, prompt: "Welcher Constraint kann NUR auf Spaltenebene (inline) oder über ALTER TABLE ... MODIFY definiert werden?", options: ["PRIMARY KEY", "CHECK", "NOT NULL", "FOREIGN KEY"], answer: [2], explanation: "NOT NULL lässt sich nicht als Out-of-Line Table-Level Constraint schreiben." },
  { id: "M46", domainId: 8, prompt: "Welche CHECK-Constraint-Definition schlägt mit ORA-02436 fehl?", options: [
    "CHECK (sal > 0 AND sal < 100000)",
    "CHECK (job IN ('CLERK', 'MANAGER'))",
    "CHECK (hiredate <= SYSDATE)",
    "CHECK (comm >= 0)"
  ], answer: [2], explanation: "CHECK Constraints dürfen keine nicht-deterministischen Funktionen wie SYSDATE oder USER referenzieren." },
  { id: "M47", domainId: 8, prompt: "Was passiert mit Child Rows in TASKS, wenn eine Parent Row in PROJECTS gelöscht wird und der FK ON DELETE SET NULL festlegt?", options: [
    "Das Löschen scheitert mit ORA-02292",
    "Child Rows werden automatisch gelöscht",
    "Child Rows bleiben erhalten und ihre Foreign-Key-Spalte wird auf NULL gesetzt",
    "Child Rows bleiben unverändert"
  ], answer: [2], explanation: "ON DELETE SET NULL setzt die Foreign-Key-Spalte betroffener Child Rows auf NULL, statt das Löschen zu blockieren oder Kinder zu löschen." },
  { id: "M48", domainId: 8, prompt: "Wie verhält sich ALTER TABLE my_emp SET UNUSED (comm);?", options: [
    "Löscht alle NULL-Werte in comm",
    "Verbirgt die Spalte sofort logisch, ohne sofort Tabellenblöcke zu scannen/freizugeben",
    "Erlaubt späteres Reaktivieren per SET USED",
    "Löscht die gesamte Tabelle"
  ], answer: [1], explanation: "SET UNUSED macht die Spalte sofort unumkehrbar unzugänglich, sodass DROP UNUSED COLUMNS später nachgeholt werden kann." },
  { id: "M49", domainId: 8, prompt: "Was ist das Standard-Commit-Verhalten einer Global Temporary Table (CREATE GLOBAL TEMPORARY TABLE ...)?", options: [
    "ON COMMIT PRESERVE ROWS",
    "ON COMMIT DELETE ROWS",
    "ON COMMIT DROP DEFINITION",
    "Zeilen werden zwischen allen Usern geteilt"
  ], answer: [1], explanation: "Standardmäßig sind GTTs transaktionsspezifisch (ON COMMIT DELETE ROWS), und Daten sind immer privat je Session." },
  { id: "M50", domainId: 8, prompt: "Welche Aussage über External Tables mit ORGANIZATION EXTERNAL (TYPE ORACLE_LOADER) ist WAHR?", options: [
    "Du kannst INSERT, UPDATE und DELETE darauf ausführen",
    "Du kannst B-Tree-Indexes darauf anlegen",
    "Sie sind Read-only für SELECT-Queries auf OS-Dateien in einem DIRECTORY-Objekt",
    "Ihre Zeilen werden im SYSTEM Tablespace gespeichert"
  ], answer: [2], explanation: "ORACLE_LOADER External Tables lesen Flat Files über ein DIRECTORY-Objekt und unterstützen weder DML noch Indexes." },
  { id: "M51", domainId: 8, prompt: "Gegeben CREATE VIEW v_d10 AS SELECT empno, ename, deptno FROM my_emp WHERE deptno = 10 WITH CHECK OPTION;. Was passiert bei INSERT INTO v_d10 VALUES (9001, 'TEST', 20);?", options: [
    "Fügt eine Zeile mit deptno 20 in my_emp ein",
    "Schlägt fehl mit ORA-01402: view WITH CHECK OPTION where-clause violation",
    "Ändert deptno automatisch auf 10",
    "Fügt nur in die View ein"
  ], answer: [1], explanation: "WITH CHECK OPTION verbietet DML über die View, wenn dadurch Zeilen außerhalb des WHERE-Prädikats der View entstehen würden." },

  // Domain 9 (3 Fragen - 5%)
  { id: "M52", domainId: 9, prompt: "Du erstellst CREATE TABLE orders (id NUMBER GENERATED ALWAYS AS IDENTITY, item VARCHAR2(30));. Was passiert bei INSERT INTO orders (id, item) VALUES (1, 'Book');?", options: [
    "Fügt id = 1 sauber ein",
    "Wirft ORA-32795: cannot insert into a generated always identity column",
    "Ignoriert 1 und generiert 2",
    "Fügt NULL ein"
  ], answer: [1], explanation: "GENERATED ALWAYS verbietet vom User angegebene Werte im INSERT (nutze GENERATED BY DEFAULT, um Überschreibungen zu erlauben)." },
  { id: "M53", domainId: 9, prompt: "Warum kann eine Sequence Nummern überspringen (z. B. Sprung von 10 auf 30)?", options: [
    "Sequences überspringen immer gerade Zahlen",
    "Ein ROLLBACK ist aufgetreten, eine gemeinsame Sequence wurde von einer anderen Tabelle genutzt oder gecachte Werte sind verfallen",
    "NEXTVAL wurde zweimal ohne COMMIT aufgerufen",
    "Sowohl B als auch C verursachen Lücken in Sequences"
  ], answer: [3], explanation: "Sequences sind nicht-transaktional: Rollbacks, Instanz-Neustarts (verlorener CACHE) und gemeinsame Nutzung erzeugen Lücken." },
  { id: "M54", domainId: 9, prompt: "Was ist der Hauptunterschied zwischen einem PRIVATE Synonym und einem PUBLIC Synonym?", options: [
    "Nur DBAs dürfen PUBLIC Synonyms nutzen",
    "Ein PRIVATE Synonym gehört nur zu deinem Schema; ein PUBLIC Synonym ist für alle Datenbank-User erreichbar (vorbehaltlich der Object Privileges)",
    "PUBLIC Synonyms gewähren automatisch das SELECT-Recht",
    "PRIVATE Synonyms können nicht auf Views zeigen"
  ], answer: [1], explanation: "Synonyms liefern nur alternative Namen – sie umgehen niemals Object Privileges." },

  // Domain 10 (3 Fragen - 5%)
  { id: "M55", domainId: 10, prompt: "Was zeigt die Spalte SEARCH_CONDITION in USER_CONSTRAINTS bei constraint_type = 'C'?", options: [
    "Den referenzierten Parent Primary Key",
    "Die CHECK-Bedingung oder den NOT NULL-Prädikattext",
    "Den Index-Namen",
    "Den COMMENT der Spalte"
  ], answer: [1], explanation: "Constraint-Typ 'C' steht sowohl für CHECK als auch für NOT NULL Constraints, wobei die Regel in SEARCH_CONDITION steht." },
  { id: "M56", domainId: 10, prompt: "Was liefert SELECT DATE '2026-01-15' + TO_YMINTERVAL('02-03') FROM dual; zurück?", options: ["2028-04-15", "2026-03-18", "2028-01-15", "ORA-01843 Fehler"], answer: [0], explanation: "Addiert 2 Jahre und 3 Monate zum 2026-01-15 -> 2028-04-15." },
  { id: "M57", domainId: 10, prompt: "Welche zwei Datetime Functions hängen von der SESSIONTIMEZONE des Clients ab und nicht von der Host-OS-Uhr des Datenbankservers?", multi: true, options: ["SYSDATE", "CURRENT_DATE", "CURRENT_TIMESTAMP", "SYSTIMESTAMP"], answer: [1, 2], explanation: "CURRENT_DATE, CURRENT_TIMESTAMP und LOCALTIMESTAMP nutzen SESSIONTIMEZONE; SYSDATE und SYSTIMESTAMP nutzen die DB-Host-OS-Uhr." },

  // Domain 11 (3 Fragen - 5%)
  { id: "M58", domainId: 11, prompt: "Welche zwei Aussagen über Datenbank-Roles sind WAHR?", multi: true, options: [
    "Eine Role kann sowohl System Privileges als auch Object Privileges bündeln",
    "Eine Role gehört dem Schema des Users, der sie erstellt hat",
    "Eine Role kann einer anderen Role erteilt werden",
    "Ein über eine Role erhaltenes Object Privilege erlaubt das Erstellen von Views auf dieser Tabelle"
  ], answer: [0, 2], explanation: "Roles bündeln System- und Object-Rechte und lassen sich an andere Roles vergeben. Roles gehören keinem Schema, und für Views braucht man direkte Object Privileges (nicht über Roles)." },
  { id: "M59", domainId: 11, prompt: "Welcher Befehl gewährt User ALICE SELECT und UPDATE (nur auf SAL und COMM) auf MY_EMP?", options: [
    "GRANT SELECT, UPDATE (sal, comm) ON my_emp TO alice;",
    "GRANT SELECT (sal, comm), UPDATE ON my_emp TO alice;",
    "GRANT UPDATE ON my_emp (sal, comm) TO alice;",
    "GRANT ALL (sal, comm) ON my_emp TO alice;"
  ], answer: [0], explanation: "Spaltenbezogene Object Grants sind für INSERT, UPDATE und REFERENCES möglich – nicht für SELECT." },
  { id: "M60", domainId: 11, prompt: "Welches Privileg benötigt User BOB, um scott.emp abzufragen, wenn SCOTT GRANT SELECT ON emp TO PUBLIC; ausführt?", options: [
    "BOB braucht zusätzlich GRANT SELECT ON scott.emp",
    "BOB benötigt nur CREATE SESSION (Login-Privileg)",
    "BOB benötigt die DBA-Role",
    "BOB benötigt SELECT ANY TABLE"
  ], answer: [1], explanation: "PUBLIC-Grants gelten für alle aktuellen und künftigen Datenbank-User; BOB braucht daher nur CREATE SESSION zum Verbinden und Abfragen." }
];
