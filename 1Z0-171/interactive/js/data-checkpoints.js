window.CHECKPOINT_SLOTS = [
  { id: "CP-0", lessons: "L001–L002", label: "Baseline (Zero Knowledge)", expected: "10–25 %" },
  { id: "CP-1", lessons: "L041–L042", label: "Nach Phase 2 (SELECT & Filtering)", expected: "30–40 %" },
  { id: "CP-2", lessons: "L081–L082", label: "Nach Phase 4 (Functions & Grouping)", expected: "50–60 %" },
  { id: "CP-3", lessons: "L121–L122", label: "Nach Phase 6 (Joins, Subqueries, SET)", expected: "65–72 %" },
  { id: "CP-4", lessons: "L161–L162", label: "Nach Phase 8 (DML, DDL, Views, Indexes)", expected: "75–85 %" },
  { id: "CP-5", lessons: "L199–L200", label: "Final Readiness (Answer Key freigeschaltet)", expected: "≥ 85 %" }
];

// Fester standardisierter 22-Fragen-Benchmark (2 identische Fragen je Exam Domain)
window.CHECKPOINT_QUESTIONS = [
  // Domain 1: Relational Database Concepts
  {
    id: "CPQ01",
    domainId: 1,
    prompt: "In einem Entity-Relationship Diagram (ERD), das auf eine SQL SELECT Query über SCOTT.EMP und SCOTT.DEPT abgebildet wird: Wofür steht ein Attribute einer Entity?",
    options: [
      "Eine Table in der FROM-Klausel",
      "Eine Column in der SELECT- oder WHERE-Klausel",
      "Eine Join Condition in der ON-Klausel",
      "Ein Transaction SAVEPOINT"
    ],
    answer: [1],
    explanation: "Entities entsprechen Tables, Attributes entsprechen Columns und Relationships entsprechen Primary/Foreign Key Join Conditions."
  },
  {
    id: "CPQ02",
    domainId: 1,
    prompt: "Welche zwei SQL Statements gehören zur Data Definition Language (DDL) und lösen ein implizites COMMIT aus?",
    multi: true,
    options: ["TRUNCATE TABLE my_emp;", "DELETE FROM my_emp;", "ALTER TABLE my_emp ADD notes VARCHAR2(50);", "SAVEPOINT sp1;"],
    answer: [0, 2],
    explanation: "TRUNCATE und ALTER sind DDL Statements (Auto-Commit). DELETE gehört zu DML und SAVEPOINT zu TCL."
  },
  // Domain 2: Retrieving and Sorting Data
  {
    id: "CPQ03",
    domainId: 2,
    prompt: "In SCOTT.EMP hat SMITH SAL=800 und COMM=NULL. Was liefert SELECT ename, sal + comm FROM scott.emp WHERE ename = 'SMITH'; zurück?",
    options: ["SMITH | 800", "SMITH | 0", "SMITH | NULL", "ORA-01722: invalid number"],
    answer: [2],
    explanation: "Jede arithmetische Operation mit NULL ergibt NULL."
  },
  {
    id: "CPQ04",
    domainId: 2,
    prompt: "Welche ORDER BY-Klausel läuft fehlerfrei bei: SELECT ename, sal * 12 annual_pay FROM scott.emp?",
    options: ["WHERE annual_pay > 20000 ORDER BY 2 DESC", "ORDER BY \"annual_pay\" DESC", "ORDER BY annual_pay DESC, 1 ASC", "ORDER BY 3 ASC"],
    answer: [2],
    explanation: "Column Aliases funktionieren in ORDER BY (nicht in WHERE). Unquoted Aliases sind case-insensitive, während \"annual_pay\" in Anführungszeichen nicht zu ANNUAL_PAY passt und Position 3 außerhalb der 2 selektierten Spalten liegt."
  },
  // Domain 3: Using Functions
  {
    id: "CPQ05",
    domainId: 3,
    prompt: "Was ist das Ergebnis von SELECT SUBSTR('SALESMAN', -3, 2) FROM dual;?",
    options: ["'AL'", "'MA'", "'AN'", "'SA'"],
    answer: [1],
    explanation: "Der negative Startwert -3 zählt 3 Zeichen von rechts zurück ('M') und liest dann 2 Zeichen von links nach rechts: 'MA'."
  },
  {
    id: "CPQ06",
    domainId: 3,
    prompt: "Was passiert beim Ausführen von: SELECT ename, NVL(comm, 'None') FROM scott.emp;?",
    options: [
      "Zeigt 'None', wo comm NULL ist",
      "Konvertiert comm implizit nach VARCHAR2 und läuft durch",
      "Wirft ORA-01722: invalid number",
      "Gibt für jede Zeile NULL zurück"
    ],
    answer: [2],
    explanation: "NVL konvertiert das zweite Argument in den Datentyp des ersten Arguments (NUMBER). 'None' lässt sich nicht in eine Zahl umwandeln und wirft ORA-01722."
  },
  // Domain 4: Displaying Data from Multiple Tables
  {
    id: "CPQ07",
    domainId: 4,
    prompt: "Was passiert bei: SELECT e.ename, e.deptno, d.dname FROM scott.emp e JOIN scott.dept d USING (deptno);?",
    options: [
      "Liefert sauber 14 Zeilen",
      "Liefert 56 Zeilen (Cartesian Product)",
      "Schlägt fehl mit ORA-25154, weil e.deptno einen Qualifier hat",
      "Schlägt fehl, weil DEPT 40 keine Employees hat"
    ],
    answer: [2],
    explanation: "Eine in der USING-Klausel genannte Spalte darf nirgendwo im SQL Statement einen Table Alias / Qualifier tragen (ORA-25154)."
  },
  {
    id: "CPQ08",
    domainId: 4,
    prompt: "Welcher Join gibt alle 4 Zeilen von SCOTT.DEPT zurück – inklusive DEPT 40 (OPERATIONS), das null Employees hat?",
    options: [
      "scott.emp e INNER JOIN scott.dept d ON e.deptno = d.deptno",
      "scott.emp e LEFT OUTER JOIN scott.dept d ON e.deptno = d.deptno",
      "scott.emp e RIGHT OUTER JOIN scott.dept d ON e.deptno = d.deptno",
      "scott.emp NATURAL JOIN scott.dept"
    ],
    answer: [2],
    explanation: "DEPT steht auf der rechten Seite des Joins, daher bewahrt RIGHT OUTER JOIN (oder FULL OUTER JOIN) auch das ungematchte DEPT 40."
  },
  // Domain 5: Using Subqueries
  {
    id: "CPQ09",
    domainId: 5,
    prompt: "In SCOTT.EMP hat KING MGR = NULL. Wie viele Zeilen liefert SELECT ename FROM scott.emp WHERE empno NOT IN (SELECT mgr FROM scott.emp); zurück?",
    options: ["14 Zeilen", "8 Zeilen (alle Nicht-Manager)", "0 Zeilen", "Wirft ORA-01427"],
    answer: [2],
    explanation: "Weil die Subquery NULL enthält (MGR von KING), wertet jeder NOT IN-Vergleich zu UNKNOWN aus und liefert 0 Zeilen."
  },
  {
    id: "CPQ10",
    domainId: 5,
    prompt: "Welcher Operator ist TRUE, wenn ein Gehalt größer als das NIEDRIGSTE Gehalt aus einer Multi-Row Subquery ist?",
    options: ["> ALL", "> ANY", "= ALL", "NOT EXISTS"],
    answer: [1],
    explanation: "> ANY bedeutet größer als mindestens ein Wert in der Liste – also größer als das Minimum."
  },
  // Domain 6: Using SET Operators
  {
    id: "CPQ11",
    domainId: 6,
    prompt: "Welche Aussage über Compound Queries mit UNION ist WAHR?",
    options: [
      "UNION behält doppelte Zeilen standardmäßig bei",
      "Spaltenüberschriften stammen vom letzten SELECT Statement",
      "ORDER BY darf nur einmal ganz am Ende der Compound Query stehen",
      "Jedes SELECT darf eine unterschiedliche Anzahl an Spalten haben"
    ],
    answer: [2],
    explanation: "UNION entfernt Duplikate, übernimmt die Spaltenüberschriften vom ersten SELECT, verlangt passende Spaltenanzahl/Datentypen und erlaubt ORDER BY nur am Ende."
  },
  {
    id: "CPQ12",
    domainId: 6,
    prompt: "Welche Query liefert nur DEPTNO 40 (das Department in SCOTT.DEPT ohne Employees in SCOTT.EMP)?",
    options: [
      "SELECT deptno FROM scott.emp MINUS SELECT deptno FROM scott.dept;",
      "SELECT deptno FROM scott.dept MINUS SELECT deptno FROM scott.emp;",
      "SELECT deptno FROM scott.dept INTERSECT SELECT deptno FROM scott.emp;",
      "SELECT deptno FROM scott.dept UNION ALL SELECT deptno FROM scott.emp;"
    ],
    answer: [1],
    explanation: "DEPT MINUS EMP liefert die Werte aus DEPT (10,20,30,40), die in EMP (10,20,30) fehlen -> 40."
  },
  // Domain 7: Managing Tables with DML
  {
    id: "CPQ13",
    domainId: 7,
    prompt: "Du führst ein UPDATE auf my_emp aus, setzt SAVEPOINT sp1, führst ein DELETE aus, startest CREATE TABLE tmp (id NUMBER); (erfolgreich) und rufst dann ROLLBACK TO sp1; auf. Was passiert?",
    options: [
      "Nur das DELETE wird rückgängig gemacht",
      "Sowohl UPDATE als auch DELETE werden rückgängig gemacht",
      "Ein Fehler tritt auf, weil CREATE TABLE implizit committet und SAVEPOINT sp1 gelöscht hat",
      "CREATE TABLE wird zurückgerollt"
    ],
    answer: [2],
    explanation: "Jedes DDL Statement (CREATE TABLE) löst ein implizites COMMIT aus, beendet die Transaktion und macht frühere Savepoints ungültig."
  },
  {
    id: "CPQ14",
    domainId: 7,
    prompt: "In einem bedingten Multi-Table INSERT FIRST Statement mit zwei WHEN-Klauseln und einer ELSE-Klausel: Wohin wird eine Quellzeile eingefügt, die BEIDE WHEN-Bedingungen erfüllt?",
    options: [
      "In die Zieltabellen beider WHEN-Klauseln",
      "Nur in die Zieltabelle der ersten zutreffenden WHEN-Klausel",
      "In die ELSE-Zieltabelle",
      "Es wird ein ORA-Fehler geworfen"
    ],
    answer: [1],
    explanation: "INSERT FIRST stoppt nach der ersten zutreffenden WHEN-Klausel; INSERT ALL wertet dagegen jede WHEN-Klausel aus."
  },
  // Domain 8: DDL for Tables and Relationships
  {
    id: "CPQ15",
    domainId: 8,
    prompt: "Welche Constraints werden kopiert, wenn du CREATE TABLE emp_copy AS SELECT * FROM scott.emp; ausführst?",
    options: [
      "PRIMARY KEY und FOREIGN KEY",
      "Alle Constraints inklusive CHECK",
      "Nur explizit definierte NOT NULL Constraints",
      "Gar keine Constraints, nicht einmal NOT NULL"
    ],
    answer: [2],
    explanation: "CTAS kopiert Spaltennamen, Datentypen, Zeilen und nur explizite NOT NULL Constraints (keine PK, FK, UNIQUE, CHECK oder DEFAULT)."
  },
  {
    id: "CPQ16",
    domainId: 8,
    prompt: "Welche Aussage zu einem UNIQUE Constraint in Oracle Database ist wahr?",
    options: [
      "Eine UNIQUE-Spalte darf keine NULL-Werte enthalten",
      "Eine UNIQUE-Spalte kann mehrere NULL-Werte enthalten",
      "Ein UNIQUE Constraint erstellt niemals einen Index",
      "Eine Tabelle kann nur einen einzigen UNIQUE Constraint besitzen"
    ],
    answer: [1],
    explanation: "In Oracle gilt NULL != NULL, daher erlaubt ein UNIQUE Constraint mehrere NULL-Zeilen (sofern nicht zusätzlich NOT NULL gesetzt ist)."
  },
  // Domain 9: Managing Indexes, Synonyms, Sequences
  {
    id: "CPQ17",
    domainId: 9,
    prompt: "In einer brandneuen Datenbank-Session führst du sofort SELECT emp_seq.CURRVAL FROM dual; aus, ohne vorher NEXTVAL aufzurufen. Was passiert?",
    options: [
      "Liefert den START WITH-Wert der Sequence",
      "Liefert 0",
      "Wirft ORA-08002: sequence EMP_SEQ.CURRVAL is not yet defined in this session",
      "Inkrementiert automatisch und liefert 1"
    ],
    answer: [2],
    explanation: "CURRVAL kann in einer Session erst dann abgefragt werden, wenn NEXTVAL in dieser Session mindestens einmal ausgeführt wurde."
  },
  {
    id: "CPQ18",
    domainId: 9,
    prompt: "Für welche Constraints erstellt Oracle automatisch einen Index?",
    options: ["NOT NULL und CHECK", "PRIMARY KEY und FOREIGN KEY", "PRIMARY KEY und UNIQUE", "FOREIGN KEY und CHECK"],
    answer: [2],
    explanation: "Oracle legt automatisch Unique Indexes zur Durchsetzung von PRIMARY KEY und UNIQUE Constraints an (nicht für FOREIGN KEY)."
  },
  // Domain 10: Data Dictionary and Time Zones
  {
    id: "CPQ19",
    domainId: 10,
    prompt: "Welches Data-Dictionary-View-Präfix zeigt alle Objekte in deinem eigenen Besitz PLUS alle Objekte anderer User, auf die dir Zugriff gewährt wurde?",
    options: ["USER_*", "ALL_*", "DBA_*", "V$*"],
    answer: [1],
    explanation: "USER_* zeigt nur eigene Objekte; ALL_* zeigt eigene Objekte plus freigegebene Objekte; DBA_* zeigt alle Objekte der gesamten Datenbank."
  },
  {
    id: "CPQ20",
    domainId: 10,
    prompt: "Welcher Datentyp normalisiert eingefügte Werte auf der Festplatte auf DBTIMEZONE und rechnet sie beim Abruf wieder in die SESSIONTIMEZONE des Users um?",
    options: ["DATE", "TIMESTAMP", "TIMESTAMP WITH TIME ZONE", "TIMESTAMP WITH LOCAL TIME ZONE"],
    answer: [3],
    explanation: "TIMESTAMP WITH LOCAL TIME ZONE speichert normalisierte DB-Zeitzonenwerte und zeigt sie in der SESSIONTIMEZONE des abfragenden Users an."
  },
  // Domain 11: Controlling User Access
  {
    id: "CPQ21",
    domainId: 11,
    prompt: "SYS erteilt CREATE TABLE TO alice WITH ADMIN OPTION. Alice erteilt CREATE TABLE TO bob. Später führt SYS REVOKE CREATE TABLE FROM alice; aus. Wie ist Bobs Status?",
    options: [
      "Bob verliert CREATE TABLE automatisch (Kaskade)",
      "Bob behält CREATE TABLE, weil der Entzug von System Privileges nicht kaskadiert",
      "Bob erhält beim nächsten Login einen ORA-Fehler",
      "REVOKE schlägt fehl, sofern nicht CASCADE angegeben wird"
    ],
    answer: [1],
    explanation: "System Privileges mit WITH ADMIN OPTION kaskadieren beim REVOKE NICHT. (Nur Object Privileges mit WITH GRANT OPTION kaskadieren.)"
  },
  {
    id: "CPQ22",
    domainId: 11,
    prompt: "Alice erteilt SELECT ON alice.emp TO bob WITH GRANT OPTION. Bob erteilt SELECT ON alice.emp TO carol. Dann führt Alice REVOKE SELECT ON alice.emp FROM bob; aus. Was passiert mit Carol?",
    options: [
      "Carol behält das SELECT-Recht",
      "Carols SELECT-Recht wird automatisch mit entzogen (Kaskade)",
      "Alice erhält einen Fehler, weil Bob das Recht weitergegeben hat",
      "Nur Bobs WITH GRANT OPTION wird entfernt"
    ],
    answer: [1],
    explanation: "Der Entzug eines Object Privilege mit WITH GRANT OPTION kaskadiert automatisch und entzieht auch alle abhängigen Weitervergaben."
  }
];

window.CHECKPOINT_SQL_TASKS = [
  {
    id: "TASK1",
    title: "Gold Standard Task 1 (SCOTT Join + Null-Safe Aggregation)",
    prompt: "Schreibe eine Query, die SCOTT.EMP, SCOTT.DEPT und SCOTT.SALGRADE verknüpft und Department Name, Headcount sowie die durchschnittliche Total Compensation (SAL + COMM, wobei NULL bei COMM als 0 behandelt wird) ausgibt – nur für Departments mit mindestens 2 Employees.",
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
    prompt: "Schreibe eine Query, die alle Employees in SCOTT.EMP auflistet, die strikt mehr verdienen als das Durchschnittsgehalt ihres eigenen Departments.",
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
    prompt: "Schreibe ein CREATE TABLE Statement für COURSE_ENROLLMENTS mit enroll_id (PK), empno (FK auf my_emp(empno) mit ON DELETE SET NULL) und status eingeschränkt auf 'ACTIVE' oder 'COMPLETED'.",
    reference: `CREATE TABLE course_enrollments (
  enroll_id NUMBER(6) CONSTRAINT pk_enroll PRIMARY KEY,
  empno     NUMBER(4) CONSTRAINT fk_enroll_emp REFERENCES my_emp(empno) ON DELETE SET NULL,
  status    VARCHAR2(12) CONSTRAINT chk_enroll_status CHECK (status IN ('ACTIVE', 'COMPLETED'))
);`
  }
];
